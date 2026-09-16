# MedTime Quiz Exporter & GitHub Pages APKG Generation: Troubleshooting & Local Fix Report

## Overview & Executive Summary
This report details the root causes behind why `MedTime_Quiz_Reproductive.html` was glitching/failing to load on GitHub Pages and why Anki `.apkg` exports were failing or outputting `.txt` files. All issues have been identified, fixed, and verified using automated headless browser beta testing.

---

## Identified Root Causes & Technical Details

### 1. Premature Script Closure / Syntax Error (Critical Root Cause)
* **Problem**: In the inline JavaScript `<script>` tag, JSON string data (specifically `ANKI_MODELS`) contained unescaped `</script>` string literals inside the HTML template strings (e.g., `...indexOf(filter) > -1 ? "" : "none"; }}</script>...`).
* **Mechanism**: Per standard HTML5 parsing rules, whenever an HTML parser encounters the literal sequence `</script>` anywhere inside a `<script>` tag—even if enclosed within JavaScript string literals or JSON strings—it immediately terminates the script tag.
* **Impact**: The JavaScript execution was abruptly truncated around line 1579, preventing `bootApp()`, `initApp()`, `exportQuizToAnki()`, and all event listeners from ever being defined or called. This left the quiz page blank, unresponsive, or glitched with `SyntaxError: Invalid or unexpected token`.
* **Fix**: Any occurrence of `</script>` inside inline script strings or JSON stringified payloads must be escaped as `<\/script>`.

### 2. Browser Preload Scanner Traps (404 & Hostname Errors)
* **Problem**: In `formatQuestionForAnki`, image tag string concatenation was written as:
  ```javascript
  questionHtml += '<div style="margin-top:10px;"><img src="' + imgSrc + '" style="max-width:100%; height:auto;" /></div>';
  ```
  Additionally, `#q-image` had an empty `src=""` attribute (`<img id="q-image" class="question-image" src="" ...>`).
* **Mechanism**: Modern browser speculative HTML preloaders scan raw text in script blocks for `<img src="...">` before JS executes. Scanning `' + imgSrc + '` causes 404 requests for literal paths like `http://.../'%20+%20imgSrc%20+%20'`, and scanning the trailing `"` quote causes hostname lookup errors. Empty `src=""` causes browsers to fetch the current HTML page URL as an image.
* **Fix**:
  1. Break the image tag token string so speculative preloader scanners ignore it:
     ```javascript
     questionHtml += '<div style="margin-top:10px;"><' + 'img src="' + encodeURI(imgSrc) + '" style="max-width:100%; height:auto;" /></div>';
     ```
  2. Remove `src=""` from `#q-image`:
     ```html
     <img id="q-image" class="question-image" style="display:none;" alt="Question image">
     ```

### 3. HTTPS Mixed Content & Endpoint Blocking on Remote Hosts (GitHub Pages)
* **Problem**: On remote HTTPS environments like GitHub Pages (`https://doctimmer.github.io`), `exportQuizToAnki` was attempting to fetch cleartext local HTTP endpoints (`http://127.0.0.1:5050/export_anki`).
* **Mechanism**: Modern browsers block `http://` requests from `https://` origins due to Mixed Content / Private Network Access (PNA) restrictions.
* **Fix**: Check origin in `exportQuizToAnki`:
  ```javascript
  const isLocalOrigin = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
  if (!isLocalOrigin) {
    try {
      await buildClientSideApkg(deckTitle, targetQuestions, fileSuffix);
      return;
    } catch (clientErr) {
      console.warn('Browser APKG builder failed, attempting server endpoints:', clientErr);
    }
  }
  ```

### 4. Client-Side SQLite & JSZip Integration Optimizations
* **Preload Libraries**: In `<head>`, add deferred CDN script tags so WebAssembly SQLite and JSZip are fetched in advance:
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.js" defer></script>
  ```
* **Cache WebAssembly Engine**: In `buildClientSideApkg`, cache `window._SQL_INSTANCE` to avoid recompiling WebAssembly on every export:
  ```javascript
  if (!window._SQL_INSTANCE) {
    window._SQL_INSTANCE = await window.initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/${file}`
    });
  }
  const db = new window._SQL_INSTANCE.Database();
  ```
* **Card Template & Watermark Logo**:
  - Examinee Title: Verified as `"Medical Student"` (NOT `"Timothy Chandler"`).
  - Background Watermark Logo: `_medtime_logo.png` binary is bundled as media `0` with `{"0": "_medtime_logo.png"}` in `media`, styled with `opacity: 0.035 !important;`.

---

## Guidelines for Future Local Quiz Uploads & Generator Scripts

When generating or editing HTML quiz files locally for future uploads to GitHub Pages, follow these 4 rules:

1. **Always Sanitize Inline `<script>` Content**:
   If your generator embeds HTML strings or JSON containing `</script>`, sanitize the output:
   ```javascript
   const sanitizeForInlineScript = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
   ```

2. **Avoid Preloader Scanner Traps**:
   Never write raw `<img src="' + varName + '"...>` or `<img src="">` in script strings or template literals. Always split `<` and `img src` (`'<' + 'img src="'`).

3. **Ensure Remote Origin Detection**:
   Always verify `isLocalOrigin` in export utilities so remote deployments (like GitHub Pages) immediately trigger client-side `.apkg` generation instead of trying local Python backend ports.

4. **Verify Generated HTML Before Deployment**:
   Before committing and pushing generated quiz HTML files, test script block syntax:
   ```bash
   node -e "
   const fs = require('fs');
   const html = fs.readFileSync('Your_Quiz_File.html', 'utf8');
   const matches = html.match(/<script[\\s\\S]*?<\\/script>/gi);
   matches.forEach((m, i) => new Function(m.replace(/<\\/?script[^>]*>/gi, '')));
   console.log('All script blocks parsed successfully!');
   "
   ```

---

## Verification Results
* **Page Boot**: `bootApp()` runs smoothly, rendering 14 quiz cards in the DOM with **0 console errors** and **0 page errors**.
* **Export All to Anki**: Downloads a valid binary `.apkg` ZIP archive containing `collection.anki2` (24 cards, Examplify Custom Model ID `1607392321`, examinee title "Medical Student"), media mapping, and `_medtime_logo.png` image binary (494 KB).
* **Export Missed to Anki**: Exports missed questions into a valid `.apkg` file.
* **Create Missed Module**: Successfully creates custom missed question modules.
