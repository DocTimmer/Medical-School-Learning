import React, { useState } from "react";

const tabs = ["Overview", "Bartter", "Gitelman", "Liddle", "Comparison"];

export const ReferencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-black text-white mb-2">📋 Study Reference</h1>
          <p className="text-slate-400">Comprehensive guide to Hereditary Renal Transport Disorders</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {tab === "Bartter" ? "🌊 " : tab === "Gitelman" ? "🌿 " : tab === "Liddle" ? "⚡ " : ""}
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ──────────────────────────────────────────── */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4">🧬 The BGL Mnemonic — Nephron Locations</h2>
              <div className="relative">
                <div className="flex flex-col gap-0 ml-4">
                  {[
                    { letter: "B", name: "Bartter", location: "thick Ascending Limb (Loop of Henle)", transporter: "NKCC2", color: "blue", emoji: "🌊" },
                    { letter: "G", name: "Gitelman", location: "Distal Convoluted Tubule (DCT)", transporter: "NCC", color: "emerald", emoji: "🌿" },
                    { letter: "L", name: "Liddle", location: "Collecting Duct", transporter: "ENaC ↑", color: "purple", emoji: "⚡" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black text-white bg-${item.color}-600 shadow-lg`}>
                        {item.letter}
                      </div>
                      <div className={`flex-1 bg-${item.color}-900/30 border border-${item.color}-700/50 rounded-xl p-4`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{item.emoji}</span>
                          <span className={`text-${item.color}-300 font-bold text-lg`}>{item.name} Syndrome</span>
                        </div>
                        <div className="text-slate-300 text-sm"><span className="text-slate-500">Location:</span> {item.location}</div>
                        <div className="text-slate-300 text-sm mt-0.5"><span className="text-slate-500">Defect:</span> <span className="font-mono bg-slate-700 px-2 py-0.5 rounded text-xs">{item.transporter}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4">⚡ Shared Features (All Three Syndromes)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Hypokalemia", desc: "Low serum potassium in all three syndromes", icon: "🔽" },
                  { title: "Metabolic Alkalosis", desc: "High serum bicarbonate in all three syndromes", icon: "🔺" },
                  { title: "Normal Kidney Structure", desc: "These are functional/transport defects — structural anatomy is preserved", icon: "🫘" },
                  { title: "Genetic Origin", desc: "All are hereditary, caused by mutations in transport proteins", icon: "🧬" },
                ].map((item) => (
                  <div key={item.title} className="bg-slate-700/40 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-white font-bold">{item.title}</div>
                      <div className="text-slate-400 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4">💊 Diuretic Mimics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4">
                  <div className="text-blue-300 font-bold mb-2">🌊 Bartter = Loop Diuretic Mimic</div>
                  <p className="text-slate-300 text-sm">NKCC2 in the thick ascending limb is the same target as furosemide. Losing function mimics taking a loop diuretic chronically.</p>
                </div>
                <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4">
                  <div className="text-emerald-300 font-bold mb-2">🌿 Gitelman = Thiazide Mimic</div>
                  <p className="text-slate-300 text-sm">NCC in the DCT is the same target as hydrochlorothiazide. Hallmark: hypocalciuria (opposite of loop diuretics).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BARTTER ───────────────────────────────────────────── */}
        {activeTab === "Bartter" && (
          <div className="space-y-5">
            <div className="bg-blue-900/30 border border-blue-600 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl">🌊</div>
                <div>
                  <h2 className="text-2xl font-black text-white">Bartter Syndrome</h2>
                  <p className="text-blue-400 text-sm">The Loop Diuretic Mimic</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Defect", value: "NKCC2" },
                  { label: "Location", value: "Loop" },
                  { label: "Onset", value: "Neonatal" },
                  { label: "Genetics", value: "Auto. Recessive" },
                ].map((i) => (
                  <div key={i.label} className="bg-blue-900/40 rounded-xl p-3 text-center">
                    <div className="text-blue-300 text-xs mb-1">{i.label}</div>
                    <div className="text-white font-bold text-sm">{i.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🏥 Clinical Presentation</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    "Polyhydramnios (excess amniotic fluid)",
                    "Premature birth",
                    "Massive polyuria & polydipsia",
                    "Failure to thrive / reduced growth",
                    "Developmental delays & cognitive abnormalities",
                    "Hypotension (NOT hypertension)",
                    "Frequent dehydration episodes",
                    "Seizures, tetany, paresthesia",
                    "Chondrocalcinosis (joint calcium deposits)",
                  ].map((item) => (
                    <li key={item} className="flex gap-2"><span className="text-blue-400 mt-0.5">•</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🔬 Pathophysiology</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-blue-300 font-bold mb-1">NKCC2 Defect</div>
                    <p className="text-slate-300">Impairs reabsorption of Na⁺, K⁺, and 2Cl⁻ in the thick ascending limb.</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-blue-300 font-bold mb-1">Secondary Ca²⁺/Mg²⁺ Loss</div>
                    <p className="text-slate-300">Disrupts positive luminal charge → impairs paracellular Ca²⁺ and Mg²⁺ reabsorption → Hypercalciuria.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🧪 Lab Findings</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Blood Pressure", value: "Normal to Low ↓", color: "text-green-400" },
                    { label: "Serum K⁺", value: "Low ↓ (Hypokalemia)", color: "text-red-400" },
                    { label: "Serum pH", value: "High (Metabolic Alkalosis)", color: "text-orange-400" },
                    { label: "Serum Mg²⁺", value: "Low/Normal", color: "text-yellow-400" },
                    { label: "Urine Ca²⁺", value: "HIGH ↑ (Hypercalciuria)", color: "text-red-400" },
                    { label: "Renin", value: "High ↑", color: "text-purple-400" },
                    { label: "Aldosterone", value: "High ↑", color: "text-purple-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center border-b border-slate-700/50 pb-1.5">
                      <span className="text-slate-400">{row.label}</span>
                      <span className={`font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">💊 Management</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-900/30 rounded-xl p-3 border border-blue-700/30">
                    <div className="text-blue-300 font-bold mb-1">🚨 Acute (Neonatal)</div>
                    <p className="text-slate-300">IV saline infusions — critical to prevent life-threatening dehydration</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-white font-bold mb-1">📅 Long-term</div>
                    <ul className="text-slate-300 space-y-1">
                      <li>• Chronic sodium supplementation</li>
                      <li>• Potassium repletion</li>
                    </ul>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-white font-bold mb-1">💊 Adjunct: Indomethacin</div>
                    <p className="text-slate-300">NSAID that decreases prostaglandin production → reduces salt/water loss</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── GITELMAN ──────────────────────────────────────────── */}
        {activeTab === "Gitelman" && (
          <div className="space-y-5">
            <div className="bg-emerald-900/30 border border-emerald-600 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">🌿</div>
                <div>
                  <h2 className="text-2xl font-black text-white">Gitelman Syndrome</h2>
                  <p className="text-emerald-400 text-sm">The Thiazide Mimic</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Defect", value: "NCC" },
                  { label: "Location", value: "DCT" },
                  { label: "Onset", value: "Adolescence" },
                  { label: "Genetics", value: "Auto. Recessive" },
                ].map((i) => (
                  <div key={i.label} className="bg-emerald-900/40 rounded-xl p-3 text-center">
                    <div className="text-emerald-300 text-xs mb-1">{i.label}</div>
                    <div className="text-white font-bold text-sm">{i.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🏥 Clinical Presentation</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    "Often milder than Bartter or even asymptomatic",
                    "Severe fatigue and muscle weakness",
                    "Muscle cramping and spasms (tetany)",
                    "SALT CRAVING ← Hallmark feature!",
                    "Chondrocalcinosis in multiple joints",
                    "Normal to low blood pressure",
                    "Adolescent/young adult onset",
                  ].map((item, i) => (
                    <li key={i} className={`flex gap-2 ${item.includes("Hallmark") ? "text-yellow-300 font-bold" : ""}`}>
                      <span className={item.includes("Hallmark") ? "text-yellow-400" : "text-emerald-400"}>•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🔬 Pathophysiology</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-emerald-300 font-bold mb-1">NCC Defect</div>
                    <p className="text-slate-300">Impairs Na⁺ and Cl⁻ reabsorption in the distal convoluted tubule.</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-emerald-300 font-bold mb-1">Magnesium Wasting</div>
                    <p className="text-slate-300">NCC dysfunction directly impairs Mg²⁺ reabsorption via TRPM6 channels. This is the primary site for active Mg²⁺ uptake.</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-emerald-300 font-bold mb-1">Hypocalciuria</div>
                    <p className="text-slate-300">NCC inhibition → hyperpolarization → enhanced Ca²⁺ reabsorption via TRPV5. Opposite of Bartter!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🧪 Lab Findings</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Blood Pressure", value: "Normal to Low ↓", color: "text-green-400" },
                    { label: "Serum K⁺", value: "Low ↓ (Hypokalemia)", color: "text-red-400" },
                    { label: "Serum pH", value: "High (Metabolic Alkalosis)", color: "text-orange-400" },
                    { label: "Serum Mg²⁺", value: "LOW ↓↓ (Hypomagnesemia)", color: "text-red-400" },
                    { label: "Urine Ca²⁺", value: "LOW ↓ (Hypocalciuria)", color: "text-green-400" },
                    { label: "Renin", value: "High ↑", color: "text-purple-400" },
                    { label: "Aldosterone", value: "High ↑", color: "text-purple-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center border-b border-slate-700/50 pb-1.5">
                      <span className="text-slate-400">{row.label}</span>
                      <span className={`font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">💊 Management</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-emerald-900/30 rounded-xl p-3 border border-emerald-700/30">
                    <div className="text-emerald-300 font-bold mb-1">⭐ Oral Magnesium (Lifelong!)</div>
                    <p className="text-slate-300">Critical to prevent tetany and fatigue. Continuous renal wasting requires lifelong supplementation.</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-white font-bold mb-1">🍽 Dietary</div>
                    <ul className="text-slate-300 space-y-1">
                      <li>• High-sodium diet</li>
                      <li>• High-potassium diet</li>
                      <li>• High-magnesium diet</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── LIDDLE ────────────────────────────────────────────── */}
        {activeTab === "Liddle" && (
          <div className="space-y-5">
            <div className="bg-purple-900/30 border border-purple-600 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-2xl">⚡</div>
                <div>
                  <h2 className="text-2xl font-black text-white">Liddle Syndrome</h2>
                  <p className="text-purple-400 text-sm">Pseudohyperaldosteronism</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Defect", value: "ENaC ↑↑" },
                  { label: "Location", value: "Collecting Duct" },
                  { label: "Onset", value: "Childhood-Adult" },
                  { label: "Genetics", value: "Auto. Dominant" },
                ].map((i) => (
                  <div key={i.label} className="bg-purple-900/40 rounded-xl p-3 text-center">
                    <div className="text-purple-300 text-xs mb-1">{i.label}</div>
                    <div className="text-white font-bold text-sm">{i.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🏥 Clinical Presentation</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    "HYPERTENSION ← Only syndrome with high BP!",
                    "Often asymptomatic until BP detected on exam",
                    "No clinical edema (unlike true hyperaldosteronism)",
                    "Hypokalemia symptoms (weakness, cramps)",
                    "Childhood to young adult onset",
                  ].map((item, i) => (
                    <li key={i} className={`flex gap-2 ${item.includes("HYPERTENSION") ? "text-red-300 font-bold" : ""}`}>
                      <span className={item.includes("HYPERTENSION") ? "text-red-400" : "text-purple-400"}>•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🔬 Pathophysiology</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-purple-300 font-bold mb-1">ENaC Gain-of-Function</div>
                    <p className="text-slate-300">Mutation causes ENaC to be "stuck open" — constitutively active regardless of aldosterone levels.</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-purple-300 font-bold mb-1">Consequence: Na⁺ Excess</div>
                    <p className="text-slate-300">Excessive Na⁺ reabsorption → volume expansion → hypertension. Secondary K⁺ secretion → hypokalemia.</p>
                  </div>
                  <div className="bg-red-900/30 rounded-xl p-3 border border-red-700/30">
                    <div className="text-red-300 font-bold mb-1">⚠️ Why Spironolactone Fails</div>
                    <p className="text-slate-300">ENaC is active DOWNSTREAM of aldosterone receptor. Blocking aldosterone receptor has no effect on the constitutively open channel.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🧪 Lab Findings</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Blood Pressure", value: "HIGH ↑ (Hypertension)", color: "text-red-400" },
                    { label: "Serum K⁺", value: "Low ↓ (Hypokalemia)", color: "text-red-400" },
                    { label: "Serum pH", value: "High (Metabolic Alkalosis)", color: "text-orange-400" },
                    { label: "Serum Mg²⁺", value: "Normal", color: "text-green-400" },
                    { label: "Urine Ca²⁺", value: "Normal", color: "text-green-400" },
                    { label: "Renin", value: "LOW ↓ (Suppressed)", color: "text-blue-400" },
                    { label: "Aldosterone", value: "LOW ↓ (Suppressed)", color: "text-blue-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center border-b border-slate-700/50 pb-1.5">
                      <span className="text-slate-400">{row.label}</span>
                      <span className={`font-bold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">💊 Management</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-purple-900/30 rounded-xl p-3 border border-purple-700/30">
                    <div className="text-purple-300 font-bold mb-1">⭐ Amiloride / Triamterene</div>
                    <p className="text-slate-300">Direct ENaC blockers — target the root cause regardless of aldosterone. First-line pharmacotherapy.</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-3">
                    <div className="text-white font-bold mb-1">🍽 Dietary</div>
                    <p className="text-slate-300">LOW-sodium diet to limit substrate for overactive ENaC channels.</p>
                  </div>
                  <div className="bg-red-900/20 rounded-xl p-3 border border-red-800/30">
                    <div className="text-red-400 font-bold mb-1">❌ Spironolactone — Does NOT Work</div>
                    <p className="text-slate-300">ENaC defect is downstream/independent of aldosterone receptor signaling.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPARISON ────────────────────────────────────────── */}
        {activeTab === "Comparison" && (
          <div className="space-y-5">
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-xl font-black text-white mb-5">📊 Side-by-Side Comparison Table</h2>
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left text-slate-400 pb-3 pr-6 font-semibold">Feature</th>
                    <th className="text-center text-blue-400 pb-3 px-4 font-bold">🌊 Bartter</th>
                    <th className="text-center text-emerald-400 pb-3 px-4 font-bold">🌿 Gitelman</th>
                    <th className="text-center text-purple-400 pb-3 px-4 font-bold">⚡ Liddle</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Defective Transporter", "NKCC2", "NCC", "ENaC (GoF)"],
                    ["Nephron Location", "Thick Ascending Limb", "Distal Convoluted Tubule", "Collecting Duct"],
                    ["Diuretic Equivalent", "Loop Diuretic", "Thiazide", "—"],
                    ["Age of Onset", "Infancy/Neonatal", "Adolescence/Adult", "Childhood-Adult"],
                    ["Blood Pressure", "↓ Normal/Low", "↓ Normal/Low", "↑ HIGH"],
                    ["Serum K⁺", "↓ Low", "↓ Low", "↓ Low"],
                    ["Serum pH", "↑ Alkalosis", "↑ Alkalosis", "↑ Alkalosis"],
                    ["Serum Mg²⁺", "↓ Low/Normal", "↓↓ Very Low", "Normal"],
                    ["Urine Ca²⁺", "↑↑ HIGH", "↓ Low", "Normal"],
                    ["Renin", "↑ High", "↑ High", "↓ LOW"],
                    ["Aldosterone", "↑ High", "↑ High", "↓ LOW"],
                    ["Inheritance", "Autosomal Recessive", "Autosomal Recessive", "Autosomal Dominant"],
                    ["Key Clinical Sign", "Polyhydramnios", "Salt Craving", "Hypertension"],
                    ["Acute Treatment", "IV Saline", "Mg²⁺ Supplementation", "Amiloride/Triamterene"],
                    ["Drug That DOESN'T Work", "—", "—", "Spironolactone"],
                  ].map(([feature, bartter, gitelman, liddle], i) => (
                    <tr key={i} className="border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors">
                      <td className="py-2.5 pr-6 text-slate-300 font-medium">{feature}</td>
                      <td className="py-2.5 px-4 text-center text-blue-200">{bartter}</td>
                      <td className="py-2.5 px-4 text-center text-emerald-200">{gitelman}</td>
                      <td className="py-2.5 px-4 text-center text-purple-200">{liddle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-amber-900/20 border border-amber-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4">💡 High-Yield Pearls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "The 'ONLY' Questions", content: "Liddle is the ONLY one with hypertension. Liddle is the ONLY autosomal dominant. These are board exam favorites!", icon: "⚡" },
                  { title: "Ca²⁺ Differentiator", content: "Bartter = HIGH urine Ca²⁺ (hypercalciuria). Gitelman = LOW urine Ca²⁺ (hypocalciuria). This is opposite and key for differentiating the two!", icon: "🦴" },
                  { title: "Renin/Aldosterone Trick", content: "Bartter + Gitelman both waste salt → RAAS activated → HIGH renin & aldosterone. Liddle retains sodium → RAAS suppressed → LOW renin & aldosterone.", icon: "🔑" },
                  { title: "Why Spiro Fails in Liddle", content: "Spironolactone blocks aldosterone receptors, but ENaC in Liddle is constitutively active REGARDLESS of aldosterone. The mutation bypasses the receptor entirely!", icon: "❌" },
                  { title: "Bartter vs Gitelman Mg²⁺", content: "Both have low Mg²⁺, but Gitelman's is specifically DIRECT (NCC dysfunction in DCT impairs TRPM6-mediated Mg²⁺ uptake). Bartter's is secondary.", icon: "🧲" },
                  { title: "Genetics Quick Rule", content: "Both Bartter & Gitelman are loss-of-function = Autosomal RECESSIVE. Liddle is gain-of-function = Autosomal DOMINANT (one bad copy is enough to cause disease).", icon: "🧬" },
                ].map((pearl) => (
                  <div key={pearl.title} className="bg-slate-800/60 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl flex-shrink-0">{pearl.icon}</span>
                    <div>
                      <div className="text-amber-300 font-bold mb-1">{pearl.title}</div>
                      <p className="text-slate-300 text-sm">{pearl.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
