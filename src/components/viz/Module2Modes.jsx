import React, { useState } from 'react';
import { TrendingDown, FastForward, History, Settings2, Hexagon, Zap, ChevronRight, Calculator, Activity, LayoutGrid, ArrowLeft, PenTool, Menu, X, Info, ArrowRight, Play } from 'lucide-react';
import { MathBlock, MathInline, EquationCheatSheet } from '../MathBlock';

/* =========================================
   SHARED HELPERS (Corporate Lab Aesthetic)
   ========================================= */

const Card = ({ children, className = '' }) => (
   <div className={`glass-card rounded-[2rem] hover:bg-white/60 transition-all duration-300 ${className}`}>
      {children}
   </div>
);

const Badge = ({ children, variant = 'navy' }) => {
   const styles = {
      navy: 'bg-navy/10 text-navy border-navy/20',
      indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      red: 'bg-red-500/10 text-red-600 border-red-500/20',
      gold: 'bg-gold/10 text-navy border-gold/40',
   };
   return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[variant]}`}>
         {children}
      </span>
   );
};

/* =========================================
   1. ATTENUATION: SCATTERING & ABSORPTION
   ========================================= */
const AttenuationLab = () => {
   const [pi, setPi] = useState(120); // uW
   const [po, setPo] = useState(3);   // uW
   const [l, setL] = useState(8);     // km

   const totalLossDb = 10 * Math.log10(pi / po);
   const alphaDbKm = totalLossDb / l;

   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
         <header>
            <Badge variant="indigo">Signal Analysis</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Signal <span className="text-indigo-600">Attenuation</span></h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
               Attenuation in optical fibers defines the maximum repeaterless link distance.
               It is primarily governed by <span className="text-navy font-bold">Rayleigh Scattering</span> and <span className="text-navy font-bold">Intrinsic Absorption</span>.
            </p>
         </header>

         <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-2 p-8">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Attenuation sandbox Node</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     {[
                        { label: 'Input Power (P_in)', value: pi, min: 10, max: 500, step: 10, set: setPi, unit: 'µW', color: 'accent-navy', display: 'text-navy' },
                        { label: 'Output Power (P_out)', value: po, min: 0.1, max: 50, step: 0.1, set: setPo, unit: 'µW', color: 'accent-indigo-600', display: 'text-indigo-600' },
                        { label: 'Fiber Length (L)', value: l, min: 1, max: 100, step: 1, set: setL, unit: 'km', color: 'accent-slate-400', display: 'text-slate-500' },
                     ].map(s => (
                        <div key={s.label} className="glass-card border border-white/20 rounded-2xl p-5 shadow-inner hover:bg-white/60 transition-all">
                           <div className="flex justify-between items-center mb-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</label>
                              <span className={`font-mono text-sm font-black ${s.display} px-2 py-0.5 glass-card rounded shadow-sm border border-white/10`}>{s.value} {s.unit}</span>
                           </div>
                           <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                              onChange={e => s.set(parseFloat(e.target.value))}
                              className={`w-full h-1.5 rounded-full ${s.color} cursor-pointer shadow-inner`} />
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-6 justify-center">
                     <div className="p-8 glass-navy rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border-none text-center">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                        <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 opacity-80">Total Transmission Loss</div>
                        <div className="text-5xl font-black tracking-tighter">{totalLossDb.toFixed(2)} <span className="text-xl opacity-60">dB</span></div>
                     </div>
                     <div className="p-8 glass-card border border-white/20 rounded-[2.5rem] shadow-inner text-center hover:bg-white/60 transition-all">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Loss Coefficient (α)</div>
                        <div className="text-5xl font-black text-navy tracking-tighter">{alphaDbKm.toFixed(3)} <span className="text-xl text-slate-400">dB/km</span></div>
                     </div>
                  </div>
               </div>
            </Card>

            <div className="space-y-6">
               <Card className="p-8 border-indigo-100">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                        <TrendingDown className="w-6 h-6" />
                     </div>
                     <h4 className="text-xs font-black text-navy uppercase tracking-widest">Degradation Mechanics</h4>
                  </div>
                  <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     <div className="p-5 glass-card border border-white/10 rounded-2xl hover:bg-white/60 transition-all">
                        <h5 className="text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest">1. Scattering</h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-bold mb-3">
                           <strong className="text-navy uppercase tracking-tighter">Rayleigh:</strong> Linear scattering ($\lambda^{-4}$) dominating below 1600nm.<br />
                           <strong className="text-navy uppercase tracking-tighter">Mie:</strong> Forward scattering due to macroscopic imperfections (bubbles, strains).<br />
                           <strong className="text-navy uppercase tracking-tighter">SBS / SRS:</strong> Non-linear backward (SBS) or bidirectional (SRS) scattering at high power thresholds.
                        </p>
                     </div>
                     <div className="p-5 bg-indigo-500/10 border border-indigo-200/20 backdrop-blur-md rounded-2xl shadow-sm">
                        <h5 className="text-[10px] font-black text-navy uppercase mb-1 tracking-widest">2. Absorption</h5>
                        <p className="text-[11px] text-indigo-700 leading-relaxed font-black">
                           Intrinsic (UV/IR tails) and Extrinsic (OH⁻ "Water Peak" at 1383nm).
                        </p>
                     </div>
                     <div className="p-5 glass-card border border-white/10 rounded-2xl hover:bg-white/60 transition-all">
                        <h5 className="text-[10px] font-black text-slate-700 uppercase mb-1 tracking-widest">3. Bending Loss</h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                           <strong className="text-navy uppercase tracking-tighter">Macrobending:</strong> Radiation loss when fiber is bent below critical radius.<br />
                           <strong className="text-navy uppercase tracking-tighter">Microbending:</strong> Microscopic axial distortions radiating modes into the cladding via coupling.
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>

         <EquationCheatSheet title="Signal Attenuation — Reference" equations={[
            { name: 'Transmission Loss (dB)', math: 'L_{\\text{dB}} = 10\\log_{10}\\!\\left(\\dfrac{P_{\\text{in}}}{P_{\\text{out}}}\\right)', color: 'text-indigo-600', description: 'Logarithmic power ratio. Essential for additive loss budgeting.' },
            { name: 'Loss Coefficient', math: '\\alpha = \\dfrac{L_{\\text{dB}}}{L}', color: 'text-blue-600', description: 'Power lost per unit length. Typical SMF value is 0.2 dB/km at 1550nm.' },
            { name: 'Rayleigh Limit', math: '\\alpha_{\\text{scat}} \\propto \\lambda^{-4}', color: 'text-emerald-600', description: 'Strong inverse dependency on wavelength. Explains the shift to longer wavelengths (IR) for long-haul.' },
            { name: 'Power Decay Law', math: 'P(z) = P(0)\\,e^{-\\gamma z}', color: 'text-purple-600', description: 'Fundamental exponential decay function for signal power vs. distance.' },
         ]} />
      </div>
   );
};

/* =========================================
   2. DISPERSION MASTERCLASS (Steps 1-6)
   ========================================= */

const ISISimulator = () => {
   const [distance, setDistance] = useState(34); // L
   const [spectralWidth, setSpectralWidth] = useState(2); // Δλ
   const [dispersionCoeff, setDispersionCoeff] = useState(17); // D
   
   // Gaussian Math: y = A * exp(-(x - mu)^2 / (2 * sigma^2))
   const calculateGaussian = (x, mu, sigma) => {
      const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
      return Math.exp(exponent);
   };

   const sigma = 2 + (dispersionCoeff * distance * spectralWidth) / 200; // Base sigma reduced for thinner pulses
   const p1Pos = 120; // Re-centered to 400px coordinate space
   const p2Pos = 280; // Re-centered to 400px coordinate space
   
   // Generate paths for 400x200 coordinate space
   const pointsCombined = [];
   const pointsBit1 = [];
   const pointsBit2 = [];
   for (let x = 0; x <= 400; x += 2) {
      const y1 = calculateGaussian(x, p1Pos, sigma * 4); // Scaled for new x-coordinate space
      const y2 = calculateGaussian(x, p2Pos, sigma * 4);
      
      pointsCombined.push(`${x},${180 - (y1 + y2) * 150}`);
      pointsBit1.push(`${x},${180 - y1 * 150}`);
      pointsBit2.push(`${x},${180 - y2 * 150}`);
   }
   
   const combinedPath = `M ${pointsCombined.join(' L ')}`;
   const bit1Path = `M ${pointsBit1.join(' L ')}`;
   const bit2Path = `M ${pointsBit2.join(' L ')}`;
   
   // Overlap calculation at the midpoint (x=200)
   const midYTotal = calculateGaussian(200, p1Pos, sigma * 4) + calculateGaussian(200, p2Pos, sigma * 4);
   const overlapPercent = (midYTotal * 100).toFixed(1);
   const totalTime = (dispersionCoeff * distance * spectralWidth).toFixed(0);
   const isCorrupted = parseFloat(overlapPercent) > 40;

   return (
      <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-2xl space-y-12">
         {/* Top Stats Bar */}
         <div className="flex justify-between items-center px-4">
            <h3 className="text-2xl font-black text-navy uppercase tracking-tight italic">Optical Fiber Dispersion Analysis</h3>
            <div className="flex gap-12">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Delay</span>
                  <span className="text-2xl font-black text-navy tracking-tighter">{totalTime} ps</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Overlap Ratio</span>
                  <span className="text-2xl font-black text-navy tracking-tighter">{overlapPercent}%</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Node</span>
                  <span className={`text-2xl font-black italic pb-1 border-b-4 ${isCorrupted ? 'text-rose-600 border-rose-600' : 'text-emerald-500 border-emerald-500'}`}>
                     {isCorrupted ? 'CORRUPTED' : 'STABLE'}
                  </span>
               </div>
            </div>
         </div>

         {/* The Big Graph (No Stretching) */}
         <div className="relative w-full h-[600px] bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner flex flex-col justify-center p-20 overflow-hidden">
            <div className="absolute left-8 top-1/2 -rotate-90 origin-left text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] -translate-y-1/2">
               Optical Signal Intensity
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
               Temporal Pulse Distribution (ps)
            </div>

            <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible">
               {/* Shaded Area under combined signal */}
               <path 
                  d={`${combinedPath} L 400,180 L 0,180 Z`} 
                  fill={isCorrupted ? "rgba(244, 63, 94, 0.08)" : "rgba(129, 140, 248, 0.08)"} 
                  className="transition-all duration-300"
               />
               
               {/* Individual Pulsed Components */}
               <path d={bit1Path} fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
               <path d={bit2Path} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.4" />
               
               {/* Transition Axis */}
               <line x1="200" y1="20" x2="200" y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="8,8" />

               {/* Primary Signal Envelope */}
               <path 
                  d={combinedPath} 
                  fill="none" 
                  stroke={isCorrupted ? "#be123c" : "#1e1b4b"} 
                  strokeWidth="4" 
                  strokeLinejoin="round" 
                  strokeLinecap="round"
                  className="transition-all duration-300" 
               />

               {/* Peak Identifiers (SVG Native to prevent clipping) */}
               <g className="transition-all duration-300">
                  <rect 
                     x={p1Pos - 25} 
                     y={180 - calculateGaussian(p1Pos, p1Pos, sigma * 4) * 150 - 35} 
                     width="50" height="15" rx="7.5" 
                     fill="#4f46e5" 
                  />
                  <text 
                     x={p1Pos} 
                     y={180 - calculateGaussian(p1Pos, p1Pos, sigma * 4) * 150 - 25} 
                     fill="white" fontSize="6px" fontWeight="900" textAnchor="middle" alignmentBaseline="middle"
                  >BIT PULSE '1'</text>
               </g>

               <g className="transition-all duration-300">
                  <rect 
                     x={p2Pos - 25} 
                     y={180 - calculateGaussian(p2Pos, p2Pos, sigma * 4) * 150 - 35} 
                     width="50" height="15" rx="7.5" 
                     fill="#f59e0b" 
                  />
                  <text 
                     x={p2Pos} 
                     y={180 - calculateGaussian(p2Pos, p2Pos, sigma * 4) * 150 - 25} 
                     fill="white" fontSize="6px" fontWeight="900" textAnchor="middle" alignmentBaseline="middle"
                  >BIT PULSE '0'</text>
               </g>

               {/* Telemetry Bubble at Midpoint */}
               <g className="transition-all duration-300 shadow-2xl">
                  <rect x="180" y="80" width="40" height="25" rx="6" fill="white" stroke="#e2e8f0" strokeWidth="1" />
                  <text x="200" y="88" fill="#94a3b8" fontSize="4px" fontWeight="900" textAnchor="middle">OVERLAP</text>
                  <text x="200" y="100" fill={isCorrupted ? "#be123c" : "#1e293b"} fontSize="8px" fontWeight="900" textAnchor="middle">{overlapPercent}%</text>
               </g>
            </svg>

            {/* Error State Banner */}
            {isCorrupted && (
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-rose-500/5 backdrop-blur-[2px]">
                  <div className="bg-white border-[8px] border-rose-600 p-12 shadow-[0_30px_100px_rgba(225,29,72,0.4)] animate-in zoom-in duration-300">
                     <h4 className="text-5xl font-black text-rose-600 uppercase tracking-tighter italic border-b-4 border-rose-100 pb-4 mb-4">ISI DESTRUCTIVE INTERFERENCE</h4>
                     <p className="text-xl font-bold text-rose-500 tracking-[0.2em] text-center uppercase">Signal Resolution Lost: Data Corrupted</p>
                  </div>
               </div>
            )}
         </div>

         {/* Refined Control Matrix */}
         <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-end border-t border-slate-100 pt-16">
            {[
               { label: 'Link Length', unit: 'km', value: distance, set: setDistance, min: 1, max: 200, step: 1 },
               { label: 'Spectral Width', unit: 'nm', value: spectralWidth, set: setSpectralWidth, min: 0.1, max: 10, step: 0.1 },
               { label: 'Dispersion Coeff', unit: 'ps/nm·km', value: dispersionCoeff, set: setDispersionCoeff, min: 0, max: 40, step: 1 }
            ].map(ctrl => (
               <div key={ctrl.label} className="space-y-6">
                  <div className="flex justify-between items-center">
                     <div>
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{ctrl.label}</label>
                        <p className="text-[9px] text-slate-300 font-bold uppercase mt-1">Fiber System Parameter</p>
                     </div>
                     <div className="w-16 h-12 bg-white rounded-2xl border-2 border-slate-100 flex items-center justify-center font-black text-navy shadow-inner text-sm">{ctrl.value}</div>
                  </div>
                  <input 
                     type="range" 
                     min={ctrl.min} 
                     max={ctrl.max} 
                     step={ctrl.step} 
                     value={ctrl.value} 
                     onChange={e => ctrl.set(parseFloat(e.target.value))} 
                     className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700 transition-all shadow-inner" 
                  />
               </div>
            ))}
         </div>
      </div>
   );
};

const DeveloperLab = () => (
   <Card className="mt-16 border-indigo-100 bg-slate-50/50 overflow-hidden">
      <details className="group">
         <summary className="list-none cursor-pointer p-8 flex items-center justify-between hover:bg-white transition-all">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <LayoutGrid className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-sm font-black text-navy uppercase tracking-widest">Developer Lab: Under the Hood</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">How we built this simulator</p>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-open:rotate-90 transition-transform" />
         </summary>
         
         <div className="p-10 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
               <h5 className="text-xs font-black text-indigo-600 uppercase tracking-widest">1. The Gaussian Engine</h5>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We model the light pulse as a mathematical "bell curve" (Gaussian distribution). This represents the probability of photons arriving at a specific time.
               </p>
               <div className="p-6 bg-slate-900 rounded-3xl text-blue-300 font-mono text-[10px] leading-relaxed shadow-xl border-none">
                  <span className="text-indigo-400">function</span> calculateGaussian(x, mu, sigma) {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-indigo-400">let</span> exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));<br/>
                  &nbsp;&nbsp;<span className="text-indigo-400">return</span> Math.exp(exponent);<br/>
                  {'}'}
               </div>
            </div>
            <div className="space-y-6">
               <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest">2. Detecting Corruption (ISI)</h5>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The logic is simple: if the combined intensity of two adjacent pulses at their midpoint surpasses 40%, the data is effectively lost.
               </p>
               <ul className="space-y-3">
                  {[
                     { label: 'Read Inputs', desc: 'Capture L, Δλ, and D from sliders.' },
                     { label: 'Sum Intensity', desc: 'Add two Gaussian curves at each point.' },
                     { label: 'Midpoint Check', desc: 'Monitor intensity at x=50.' },
                     { label: 'SVG Render', desc: 'Map intensities to an SVG path.' }
                  ].map((step, i) => (
                     <li key={i} className="flex gap-4 items-start">
                        <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center text-emerald-600 text-[9px] font-black shrink-0 mt-0.5">{i+1}</div>
                        <div className="text-[10px]"><span className="font-black text-navy">{step.label}:</span> <span className="text-slate-500">{step.desc}</span></div>
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </details>
   </Card>
);

const ChromaticBalancer = () => {
   const [dwShift, setDwShift] = useState(0); // Waveguide shift
   
   return (
      <Card className="p-12 border-indigo-100 mt-12 shadow-2xl">
         <div className="flex justify-between items-start mb-12 border-b border-indigo-50 pb-6">
            <div>
               <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-2">Advanced Chromatic Balancer</h4>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">Material (Dm) vs Waveguide (Dw) Engineering Node</p>
            </div>
            <div className="flex flex-col items-end">
               <label className="text-[10px] font-black text-indigo-600 uppercase mb-3">Core Profile Tuning</label>
               <input type="range" min="-10" max="10" value={dwShift} onChange={e => setDwShift(parseInt(e.target.value))} className="w-48 accent-indigo-600" />
            </div>
         </div>

         <div className="flex flex-col gap-12">
            <div className="w-full h-96 glass-card rounded-3xl border border-white/20 overflow-hidden shadow-inner bg-slate-50/50 p-6">
               <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                  {/* Axes */}
                  <line x1="50" y1="100" x2="350" y2="100" stroke="#cbd5e1" strokeWidth="1" />
                  <line x1="240" y1="20" x2="240" y2="180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
                  <text x="245" y="190" fill="#94a3b8" fontSize="10" fontWeight="black">1.55 µm (Telecom King)</text>

                  {/* Material Dispersion Curve (Positive) */}
                  <path d="M 50,140 Q 200,80 350,40" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4" opacity="0.4" />
                  <text x="60" y="155" fill="#f43f5e" fontSize="8" fontWeight="black" opacity="0.6">Material (Dm)</text>

                  {/* Waveguide Dispersion Curve (Negative, Shiftable) */}
                  <path 
                     d={`M 50,${160 + dwShift * 2.5} Q 200,${120 + dwShift * 2.5} 350,${100 + dwShift * 2.5}`} 
                     fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4"
                     className="transition-all duration-500" opacity="0.4" />
                  <text x="60" y={175 + dwShift * 2} fill="#0ea5e9" fontSize="8" fontWeight="black" className="transition-all duration-500" opacity="0.6">Waveguide (Dw)</text>

                  {/* Result Curve (Bold & Indigo) */}
                  <path 
                     d={`M 50,${150 + dwShift * 1.2} Q 200,${100 + dwShift * 1.2} 350,${70 + dwShift * 1.2}`} 
                     fill="none" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" />
                  <text x="310" y={60 + dwShift} fill="#4f46e5" fontSize="10" fontWeight="black">Total Dispersion (D)</text>

                  {/* Goal Marker with Ping Animation Effect */}
                  <circle cx="240" cy="100" r="6" fill="#10b981" />
                  {Math.abs(100 - (100 + dwShift * 1.2)) < 5 && (
                     <circle cx="240" cy="100" r="15" fill="#10b981" className="animate-ping opacity-20" />
                  )}
               </svg>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 glass-card border border-white/20 rounded-3xl shadow-lg">
                  <h5 className="text-xs font-black text-navy uppercase mb-3 tracking-widest">Engineering Outcome</h5>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                     {Math.abs(dwShift) < 3 
                        ? "OPTIMAL DESIGN: Zero-dispersion crossover achieved at 1550nm. Signal transit remains crisp." 
                        : "SUB-OPTIMAL: Dispersion forces are unbalanced. Pulses will broaden at 1.55um."}
                  </p>
               </div>
               <div className="p-8 glass-card border border-indigo-100 bg-indigo-50/30 rounded-3xl flex items-center justify-center">
                  <MathInline math={`D_{total} \\approx ${(-dwShift * 1.2).toFixed(1)} \\text{ ps/nm·km}`} />
               </div>
            </div>
         </div>
      </Card>
   );
};

const MarathonAnalogy = () => (
   <Card className="p-10 border-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8">
         <Badge variant="gold">Analogy</Badge>
      </div>
      <h3 className="text-2xl font-black text-navy mb-8 tracking-tight">The Marathon & The Muddy Road</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
         <div className="space-y-6">
            <div className="p-6 glass-card border border-rose-100 rounded-2xl relative">
               <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
               <h4 className="text-sm font-black text-rose-600 uppercase mb-2">The Sticky Road (Material)</h4>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The road surface is sticky asphalt. Runners with small shoes (shorter colors) stick more and run slower. Big shoes (longer colors) roll through faster. <strong>Result: The team spreads out.</strong>
               </p>
            </div>
            <div className="p-6 glass-card border border-blue-100 rounded-2xl relative">
               <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black">2</div>
               <h4 className="text-sm font-black text-blue-600 uppercase mb-2">The Icy Ditch (Waveguide)</h4>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The big-shoe runners clumsily spill into the ditch. But the ditch is <strong>ice</strong>—they slide forward much faster! This perfectly counters their "sticky road" advantage.
               </p>
            </div>
         </div>

         <div className="h-64 glass-navy rounded-[2.5rem] flex flex-col justify-around p-10 border-none shadow-2xl relative">
            <div className="absolute top-4 left-6 text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Engineered Balance Node</div>
            {/* Animation of runners */}
            <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/10">
               <div className="absolute top-0 left-0 h-full w-4 bg-rose-400 rounded-full blur-[2px] animate-[runnersMove_3s_infinite]" />
               <div className="absolute top-0 left-0 h-full w-4 bg-blue-400 rounded-full blur-[2px] animate-[runnersMove_4s_infinite]" />
               <div className="absolute top-0 left-0 h-full w-4 bg-indigo-400 rounded-full blur-[2px] animate-[runnersMove_5s_infinite]" />
            </div>
            <p className="text-xs text-blue-300 font-black uppercase tracking-widest text-center">Engineered Synergy: All cross the finish line together.</p>
         </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
         @keyframes runnersMove {
            0% { transform: translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(400px); opacity: 0; }
         }
      `}} />
   </Card>
);

const DispersionMasterclass = () => {
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-16 pb-32">
         <header className="mb-20">
            <Badge variant="indigo">Complete Masterclass</Badge>
            <h2 className="text-6xl font-black text-navy tracking-tighter mt-6 mb-8 uppercase italic">The Enemy: <span className="text-indigo-600">Dispersion</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <p className="text-slate-500 font-bold leading-relaxed text-xl border-l-4 border-indigo-600 pl-8">
                  If Attenuation limits how <span className="text-navy">far</span> we go, Dispersion limits how <span className="text-navy">fast</span> we go. 
                  It is the physical "blurring" of digital reality.
               </p>
               <div className="glass-card p-6 border-amber-100 bg-amber-50/30">
                  <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Info className="w-4 h-4" /> Strategic Difference
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                     Perfect glass doesn't fix this. It's a race of colors and paths where light speed isn't constant.
                  </p>
               </div>
            </div>
         </header>

         {/* Step 1: The Blur */}
         <section className="space-y-12 bg-white/40 p-12 rounded-[3.5rem] border border-slate-100">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-black text-lg shadow-xl shadow-navy/20">01</div>
               <h3 className="text-3xl font-black text-navy tracking-tight uppercase italic">The Blur Analysis</h3>
            </div>
            <div className="grid grid-cols-1 gap-12">
               <div className="space-y-6 text-slate-600 font-medium text-lg leading-relaxed max-w-4xl">
                  <p>Ideally, a pulse enters as a sharp, crisp square. But as it travels, the light naturally stretches.</p>
                  <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] font-mono text-sm leading-loose shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px]" />
                     <span className="text-indigo-400 font-black tracking-widest">CRITICAL DIAGNOSIS:</span><br/>
                     "Pulses stretch so much they smash into each other. This is <span className="text-indigo-400 font-black">INTERSYMBOL INTERFERENCE (ISI)</span>. Data corruption is inevitable without compensation."
                  </div>
               </div>
               <div className="w-full">
                  <ISISimulator />
               </div>
            </div>
         </section>

         {/* Step 2 & 3: Races */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-indigo-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-200">02</div>
                  <h4 className="text-lg font-black text-navy uppercase tracking-tighter">Intermodal (The Path Race)</h4>
               </div>
               <div className="space-y-4">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     In thick fiber, light takes many paths (modes). Zig-zags arrive late; straights arrive early.
                  </p>
                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                     <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-1">THE FIX:</p>
                     <p className="text-xs text-slate-600 font-bold">Shrink the core to <span className="text-indigo-600 uppercase">Single-Mode Fiber</span> or use Graded-Index "banked tracks".</p>
                  </div>
               </div>
            </Card>
            <Card className="p-8 border-teal-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-teal-200">03</div>
                  <h4 className="text-lg font-black text-navy uppercase tracking-tighter">Chromatic (The Color Race)</h4>
               </div>
               <div className="space-y-4">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     No laser is one color. A "1550nm" laser actually shoots a spread (spectral width, Δλ). Glass slows different colors differently.
                  </p>
                  <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                     <p className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-1">THE REALITY:</p>
                     <p className="text-xs text-slate-600 font-bold">This affects <span className="text-teal-600 uppercase">ALL</span> fibers, even Single-Mode.</p>
                  </div>
               </div>
            </Card>
         </div>

         {/* Step 4 & 5: Engineering */}
         <section className="space-y-12 mt-32">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-black text-lg shadow-xl shadow-navy/20">04</div>
               <h3 className="text-3xl font-black text-navy tracking-tight uppercase italic">Material vs Waveguide Dynamics</h3>
            </div>
            <div className="grid grid-cols-1 gap-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 glass-card border border-white/20 rounded-[2.5rem] shadow-xl hover:bg-white/80 transition-all">
                     <h5 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">Material Constraint (Dm)</h5>
                     <p className="text-sm text-slate-600 leading-relaxed font-bold">Silica glass naturally slows shorter wavelengths (blues) more than reds. This is molecularly intrinsic.</p>
                  </div>
                  <div className="p-8 glass-card border border-white/20 rounded-[2.5rem] shadow-xl hover:bg-white/80 transition-all">
                     <h5 className="text-xs font-black text-teal-600 uppercase tracking-[0.2em] mb-3">Waveguide Constraint (Dw)</h5>
                     <p className="text-sm text-slate-600 leading-relaxed font-bold">Evanescent Cladding spillover allows long wavelengths to speed up in the lower-index cladding.</p>
                  </div>
               </div>
               <div className="p-10 bg-indigo-900 rounded-[3rem] text-white shadow-2xl flex flex-col md:flex-row items-center gap-10">
                  <div className="flex-1">
                     <h5 className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-4">The Engineering Masterstroke</h5>
                     <p className="text-lg font-medium leading-relaxed italic">
                        "At 1.55 µm, we achieve equilibrium. We force Dw to be the exact negative mirror of Dm, flattening the total dispersion to zero."
                     </p>
                  </div>
                  <div className="w-px h-24 bg-white/10 hidden md:block" />
                  <div className="text-center">
                     <div className="text-xs font-black text-indigo-300 uppercase mb-2">Target Profile</div>
                     <div className="text-4xl font-black tracking-tighter">DSF - G.653</div>
                  </div>
               </div>
               <ChromaticBalancer />
            </div>
         </section>

         {/* Step 5: Math */}
         <section className="space-y-8 mt-24">
             <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-black text-xs">05</div>
               <h3 className="text-2xl font-black text-navy tracking-tight uppercase">The Math of the Blur</h3>
            </div>
            <Card className="p-12 border-slate-200 bg-slate-900 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                     <MathBlock math="\Delta t = D \times L \times \Delta\lambda" color="border-white/10" />
                     <p className="text-xs text-slate-400 mt-6 leading-relaxed italic font-bold">
                        $\Delta t$: Total Pulse Widening (ps)<br/>
                        $D$: Total Dispersion Coefficient (ps/nm·km)<br/>
                        $L$: Fiber Length (km)<br/>
                        $\Delta\lambda$: Laser Spectral Width (nm)
                     </p>
                  </div>
                  <div className="space-y-4 border-l border-white/10 pl-8">
                     <p className="text-sm font-black text-indigo-300 uppercase tracking-widest">Key Rule:</p>
                     <p className="text-xs text-slate-400 leading-relaxed font-bold">
                        If you increase distance or use a cheap (wide color) laser, the blur widens catastrophically.
                     </p>
                  </div>
               </div>
            </Card>
         </section>

         {/* Step 6: Analogy */}
         <section className="mt-24">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-black text-xs">06</div>
               <h3 className="text-2xl font-black text-navy tracking-tight uppercase">Intuitive Understanding</h3>
            </div>
            <MarathonAnalogy />
         </section>

         <DeveloperLab />
      </div>
   );
};

/* =========================================
   2.5 PHASE VS GROUP VELOCITY
   ========================================= */

const WavePacketSimulator = () => {
   const canvasRef = React.useRef(null);
   const [vp, setVp] = useState(2.0);
   const [vg, setVg] = useState(1.0);
   const [isPlaying, setIsPlaying] = useState(true);

   React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let time = 0;

      const render = () => {
         if (isPlaying) time += 0.05;
         
         // Clear and setup
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         const centerY = canvas.height / 2;
         const width = canvas.width;
         const sigma = 40;
         const k = 0.5;
         const amplitude = 60;

         // Wrap time based on vg to keep packet in view
         const xOffset = (vg * time * 20) % (width + 200) - 100;

         // Draw Reference Axis
         ctx.setLineDash([5, 5]);
         ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
         ctx.beginPath();
         ctx.moveTo(0, centerY);
         ctx.lineTo(width, centerY);
         ctx.stroke();
         ctx.setLineDash([]);

         // Draw Envelope (Dashed)
         ctx.beginPath();
         ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)';
         ctx.lineWidth = 1;
         ctx.setLineDash([4, 4]);
         for (let x = 0; x < width; x++) {
            const env = Math.exp(-Math.pow(x - xOffset, 2) / (2 * Math.pow(sigma, 2)));
            const y = centerY - env * amplitude * 1.2;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
         }
         ctx.stroke();
         ctx.setLineDash([]);

         // Draw Wave Packet (Carrier * Envelope)
         ctx.beginPath();
         ctx.strokeStyle = '#4f46e5';
         ctx.lineWidth = 3;
         ctx.lineJoin = 'round';
         for (let x = 0; x < width; x++) {
            const env = Math.exp(-Math.pow(x - xOffset, 2) / (2 * Math.pow(sigma, 2)));
            // Carrier moves at vp, Envelope at vg
            // Math: cos(k * (x - vp*t)) * exp(...)
            // We use (x - offset_vp) where offset_vp depends on time
            const carrierOffset = (vp * time * 20);
            const carrier = Math.cos(k * (x - carrierOffset));
            const y = centerY - env * carrier * amplitude;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
         }
         ctx.stroke();

         // Draw Labels
         ctx.font = 'bold 9px Arial';
         ctx.fillStyle = '#64748b';
         ctx.fillText('ENVELOPE (DATA)', xOffset - 30, centerY - 85);
         
         animationFrameId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animationFrameId);
   }, [vp, vg, isPlaying]);

   return (
      <Card className="p-10 border-indigo-100 bg-white shadow-2xl">
         <div className="flex justify-between items-center mb-10">
            <div>
               <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-1">Interactive Wave Packet Lab</h4>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Temporal Dynamics Simulator</p>
            </div>
            <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isPlaying ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}
            >
               {isPlaying ? 'Pause Simulator' : 'Run Simulator'}
            </button>
         </div>

         <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 p-8 mb-10 shadow-inner relative overflow-hidden group">
            <div className="absolute top-4 left-6 text-[8px] font-black text-slate-300 uppercase tracking-[0.4em] z-10">Real-Time Wave Mechanics Output</div>
            <canvas 
               ref={canvasRef} 
               width={800} 
               height={300} 
               className="w-full h-auto cursor-crosshair transform transition-transform group-hover:scale-[1.01]"
            />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="p-8 glass-card border border-white/20 rounded-3xl shadow-xl">
               <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Phase Velocity (vp)</label>
                  <span className="text-xs font-black text-navy">{vp.toFixed(1)}c</span>
               </div>
               <input type="range" min="0.5" max="3" step="0.1" value={vp} onChange={e => setVp(parseFloat(e.target.value))} className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer" />
               <p className="text-[9px] text-slate-400 font-bold uppercase mt-3 tracking-tighter italic">Speed of individual ripples inside the pack.</p>
            </div>
            <div className="p-8 glass-card border border-white/20 rounded-3xl shadow-xl">
               <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Group Velocity (vg)</label>
                  <span className="text-xs font-black text-navy">{vg.toFixed(1)}c</span>
               </div>
               <input type="range" min="0.5" max="3" step="0.1" value={vg} onChange={e => setVg(parseFloat(e.target.value))} className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer" />
               <p className="text-[9px] text-slate-400 font-bold uppercase mt-3 tracking-tighter italic">Speed of the overall pulse envelope (The Data).</p>
            </div>
         </div>
         
         {(vp > vg) && (
            <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-500">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shrink-0">
                  <Activity className="w-6 h-6" />
               </div>
               <p className="text-[11px] font-bold text-navy leading-relaxed italic">
                  Observation: <span className="text-indigo-600 uppercase">Anomalous Dispersion Logic</span>. Notice the ripples "spawning" at the tail, racing through the center, and disappearing at the leading edge. This is the reality of fiber optics!
               </p>
            </div>
         )}
      </Card>
   );
};

const PhaseGroupVelocity = () => {
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-16 pb-32">
         <header className="mb-20">
            <Badge variant="indigo">Quantum Mechanics 101</Badge>
            <h2 className="text-6xl font-black text-navy tracking-tighter mt-6 mb-8 uppercase italic">Phase vs <span className="text-indigo-600">Group</span> Velocity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <p className="text-slate-500 font-bold leading-relaxed text-xl border-l-4 border-indigo-600 pl-8">
                  A light pulse has two different speeds at the exact same time. One for the carrier waves, one for the digital envelope.
               </p>
               <div className="glass-card p-6 border-slate-100 bg-slate-50/50">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Info className="w-4 h-4" /> The Quantum Twist
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                     To send a digital "1", we need a wave packet. But in glass, the "ripples" move faster than the "packet" itself.
                  </p>
               </div>
            </div>
         </header>

         {/* Step 1: Phase Velocity */}
         <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-navy text-white flex items-center justify-center font-black text-sm">01</div>
                  <h3 className="text-2xl font-black text-navy tracking-tight uppercase italic">Phase Velocity ($v_p$)</h3>
               </div>
               <p className="text-slate-600 font-medium text-lg leading-relaxed">
                  Imagine picking one specific peak of an infinite wave. How fast that single peak moves across the pier is the <strong>Phase Velocity</strong>.
               </p>
               <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl">
                  <MathBlock math="v_p = \frac{\omega}{\beta}" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-6 text-center tracking-[0.2em]">Angular Frequency / Propagation Constant</p>
               </div>
            </div>
            <div className="space-y-8">
               <div className="p-10 glass-card border-indigo-100 bg-indigo-50/30 rounded-[3rem] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 text-indigo-200"><TrendingDown className="w-12 h-12" /></div>
                  <h4 className="text-sm font-black text-indigo-600 uppercase mb-4">The Carrier Problem</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-bold">
                     An infinite wave carries <strong>zero data</strong>. To send pulse logic, we must bundle many colors together.
                  </p>
               </div>
            </div>
         </section>

         {/* Step 2: Group Velocity */}
         <section className="mt-24 space-y-12">
            <div className="flex items-center gap-6">
               <div className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center font-black text-lg shadow-xl shadow-navy/20">02</div>
               <h3 className="text-3xl font-black text-navy tracking-tight uppercase italic">Group Velocity ($v_g$)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
               <div className="lg:col-span-3 space-y-8 text-slate-600 font-medium text-lg leading-relaxed">
                  <p>
                     The <strong>Group Velocity</strong> is the speed of the envelope—the actual packet that carries your internet signal.
                  </p>
                  <div className="p-8 bg-indigo-900 text-white rounded-[3rem] shadow-2xl relative">
                     <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-900 font-black shadow-lg">!</div>
                     <p className="italic font-bold">"Data travels at $v_g$. Ripples travel at $v_p$."</p>
                     <div className="mt-8 pt-8 border-t border-white/10">
                        <MathBlock math="v_g = \frac{d\omega}{d\beta}" />
                     </div>
                  </div>
               </div>
               <div className="lg:col-span-2 space-y-6">
                  <div className="p-8 glass-card border border-white/20 rounded-[2.5rem] shadow-xl hover:bg-white/80 transition-all">
                     <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Group Index (Ng)</h5>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-bold mb-6">Just as $n$ tells us about phase speed, $N_g$ tells us the speed limit of data pulses.</p>
                     <div className="p-4 bg-slate-900 rounded-xl text-center shadow-lg">
                        <MathInline math="v_g = \frac{c}{N_g}" />
                     </div>
                     <div className="mt-6 p-4 border-t border-slate-100">
                        <MathInline math="N_g = n - \lambda \frac{dn}{d\lambda}" />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Interactive Section */}
         <section className="mt-32">
            <WavePacketSimulator />
         </section>

         {/* Summary Visualization */}
         <section className="mt-32">
            <Card className="p-12 border-slate-200 shadow-2xl bg-white overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8"><Zap className="w-12 h-12 text-slate-100" /></div>
               <h3 className="text-3xl font-black text-navy mb-12 tracking-tight uppercase italic">The Wave Packet Breakdown</h3>
               <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 font-mono text-center relative shadow-inner">
                   <div className="text-[10px] text-slate-400 mb-8 uppercase tracking-[0.4em]">Signal Architecture (Digital '1')</div>
                   <div className="text-indigo-600 font-black text-xl leading-none">
                      (Destructive) &nbsp;&nbsp;&nbsp; (Constructive) &nbsp;&nbsp;&nbsp; (Destructive)<br/>
                      Edges &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Center Core &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Edges<br/>
                      ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ↓<br/>
                      _ _ _ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; _ &nbsp;&nbsp;&nbsp;&nbsp; _ _ _<br/>
                      / \ &nbsp;&nbsp;&nbsp;&nbsp; / \ &nbsp;&nbsp;&nbsp;&nbsp; / \<br/>
                      / \ &nbsp;&nbsp; / \ &nbsp;&nbsp; / \<br/>
                      ── &nbsp;&nbsp;&nbsp;&nbsp; \ / &nbsp;&nbsp;&nbsp;&nbsp; \ / &nbsp;&nbsp;&nbsp;&nbsp; ──<br/>
                      \ _ / &nbsp;&nbsp; \ _ /
                   </div>
                   <div className="mt-12 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-white inline-block px-8 py-3 rounded-full border border-indigo-100 shadow-sm">
                      Envelope Length (Pulse Width)
                   </div>
               </div>
               
               <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <h4 className="text-sm font-black text-navy uppercase tracking-widest border-l-4 border-indigo-600 pl-4">The Peloton Analogy</h4>
                     <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Imagine a pack of bikers (The <strong>Group</strong>). The pack moves at $v_g$. Inside, individual bikers sprint forward then drop back (The <strong>Phase</strong>). They move through the pack at $v_p$.
                     </p>
                  </div>
                  <div className="p-10 glass-navy rounded-[3rem] text-white flex items-center justify-center font-black italic shadow-2xl relative overflow-hidden text-center">
                     <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mt-12" />
                     "In fiber optics, the riders move faster than the pack ($v_g \lt v_p$)."
                  </div>
               </div>
            </Card>
         </section>
      </div>
   );
};



const PMDSimulator = () => {
   const [length, setLength] = useState(50); // L in km
   const [stress, setStress] = useState(2); // Birefringence factor
   const canvasRef = React.useRef(null);
   const [isPlaying, setIsPlaying] = useState(true);

   // Fundamental Constants (scaled for visualization)
   const c = 3; // Mock speed of light in pixels/ms
   const dgd = (length * stress) / 20; // Differential Group Delay scaled

   React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let animationFrameId;
      let time = 0;

      const render = () => {
         if (isPlaying) time += 0.5;
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         
         const startX = 50;
         const endX = canvas.width - 50;
         const centerY = canvas.height / 2;
         const zAxisY = centerY;

         // Draw Fiber Path (Dashed Z-Axis)
         ctx.setLineDash([5, 5]);
         ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
         ctx.beginPath();
         ctx.moveTo(startX, zAxisY);
         ctx.lineTo(endX, zAxisY);
         ctx.stroke();
         ctx.setLineDash([]);

         // Current positions based on time loop
         const fastPos = (startX + time % (endX - startX));
         const slowPos = fastPos - dgd;

         // Draw Waves using Isometric Projection
         const drawWave = (pos, amplitude, color, angle, label) => {
            if (pos < startX || pos > endX) return;

            const envelopeWidth = 30;
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            
            // Draw Gaussian Envelope + Sine
            for (let i = -envelopeWidth; i <= envelopeWidth; i++) {
               const x = pos + i;
               if (x < startX || x > endX) continue;
               
               const gauss = Math.exp(-Math.pow(i/15, 2));
               const carrier = Math.cos(i * 0.5);
               
               // Isometric projection: angle determines Y-offset
               const dx = x;
               const dy = zAxisY - (gauss * carrier * amplitude * Math.sin(angle));
               const dzOffset = gauss * carrier * amplitude * Math.cos(angle) * 0.5;

               if (i === -envelopeWidth) ctx.moveTo(dx + dzOffset, dy - dzOffset);
               else ctx.lineTo(dx + dzOffset, dy - dzOffset);
            }
            ctx.stroke();

            // Label
            ctx.fillStyle = color;
            ctx.font = 'bold 8px Inter';
            ctx.fillText(label, pos, zAxisY - 40);
         };

         // Vertical Wave (90 degrees)
         drawWave(fastPos, 30, '#f43f5e', Math.PI/2, 'FAST (V)');
         // Horizontal Wave (0 degrees, but isometric makes it diagonal)
         drawWave(slowPos, 30, '#0ea5e9', 0, 'SLOW (H)');

         // Boundary markers
         ctx.fillStyle = '#cbd5e1';
         ctx.fillRect(startX, centerY-30, 2, 60);
         ctx.fillRect(endX, centerY-30, 2, 60);

         animationFrameId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animationFrameId);
   }, [length, stress, dgd, isPlaying]);

   // Intensity Graph Data
   const calculateIntensity = () => {
      const points = [];
      const chartWidth = 400;
      const chartHeight = 100;
      const midX = 200;
      const spread = dgd * 2;

      for (let x = 0; x <= chartWidth; x++) {
         const v = Math.exp(-Math.pow((x - midX)/20, 2));
         const h = Math.exp(-Math.pow((x - midX - spread)/20, 2));
         const total = (v + h) * 40;
         points.push(`${x},${chartHeight - total}`);
      }
      return `M ${points.join(' L ')}`;
   };

   return (
      <div className="space-y-12">
         <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl space-y-10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
               <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  {isPlaying ? <Activity className="w-6 h-6 text-indigo-600 animate-pulse" /> : <Play className="w-6 h-6 text-slate-400" />}
               </button>
            </div>
            
            <header>
               <h3 className="text-2xl font-black text-navy tracking-tight uppercase italic mb-2">3D Isometric PMD Logic</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Visualizing Temporal Splitting along the Z-Axis</p>
            </header>

            <div className="w-full h-80 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
               <canvas ref={canvasRef} width={800} height={320} className="w-full h-full" />
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-12">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-rose-500" />
                     <span className="text-[9px] font-black text-slate-500 uppercase">Vertical Power</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-blue-500" />
                     <span className="text-[9px] font-black text-slate-500 uppercase">Horizontal Power</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Controls */}
               <div className="space-y-8 p-10 glass-card bg-slate-50/30 rounded-[2.5rem] border border-slate-100/50 shadow-inner">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black text-navy uppercase tracking-widest">Fiber Length (L)</label>
                        <span className="text-sm font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg">{length} km</span>
                     </div>
                     <input type="range" min="1" max="200" value={length} onChange={e => setLength(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black text-navy uppercase tracking-widest">Core Stress (Δn)</label>
                        <span className="text-sm font-black text-emerald-600 px-3 py-1 bg-emerald-50 rounded-lg">{(stress/100).toFixed(3)}</span>
                     </div>
                     <input type="range" min="0" max="10" value={stress} onChange={e => setStress(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                  </div>
               </div>

               {/* Intensity Trace */}
               <div className="p-10 bg-navy rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px]" />
                  <header className="mb-6">
                     <h4 className="text-xs font-black text-blue-300 uppercase tracking-[0.2em] mb-2">Receiver Output intensity</h4>
                     <p className="text-[9px] text-white/40 font-medium uppercase leading-relaxed">Pulse Resolution vs. ISI</p>
                  </header>
                  <div className="flex-1 flex items-center justify-center py-4">
                     <svg viewBox="0 0 400 100" className="w-full h-24 overflow-visible">
                        <path d={calculateIntensity()} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300" />
                        <line x1="0" y1="95" x2="400" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        {stress > 4 && (
                           <g className="animate-pulse">
                              <text x="200" y="20" fill="#f43f5e" fontSize="12" fontWeight="black" textAnchor="middle">SYSTÈM CRITICAL: DGD LIMIT EXCEEDED</text>
                           </g>
                        )}
                     </svg>
                  </div>
                  <footer className="pt-6 border-t border-white/10 flex justify-between items-center">
                     <span className="text-[9px] font-black text-white/60 uppercase">Calculated Delay</span>
                     <span className="text-xl font-black text-white italic tracking-tighter">{(dgd * 10).toFixed(1)} ps</span>
                  </footer>
               </div>
            </div>
         </div>
      </div>
   );
};

const PolarizationPMD = () => {
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
         <header className="mb-20">
            <Badge variant="indigo">Vector Analysis</Badge>
            <h2 className="text-6xl font-black text-navy tracking-tighter mt-6 mb-8 uppercase italic leading-tight">Polarization & <span className="text-indigo-600 block">PMD Physics</span></h2>
            <p className="text-slate-500 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-indigo-600 pl-8">
               Single-Mode Fiber is a lie. Even in the most perfect fiber, there is not just one path. There are <span className="text-navy underline decoration-indigo-600">two</span>.
            </p>
         </header>

         {/* 5 Step Logic Flow */}
         <div className="grid grid-cols-1 gap-12">
            {[
               {
                  step: 'Step 01',
                  title: 'Invisible Geometry',
                  desc: 'Light is an Electromagnetic Wave. It is made of magnetic and electric fields oscillating together in organizing geometric planes.'
               },
               {
                  step: 'Step 02',
                  title: 'The "Single" Mode Lie',
                  desc: 'The fundamental LP01 mode actually exists in two perpendicular states: Vertical (Ey) and Horizontal (Ex). They completely ignore each other until physics intervenes.'
               },
               {
                  step: 'Step 03',
                  title: 'Birefringence (The Squish)',
                  desc: 'Manufacturing stress or physical bending squishes the core into an oval. This creates two different refractive indices (e.g., 1.4600 vs 1.4601).'
               },
               {
                  step: 'Step 04',
                  title: 'PMD (The Ghost State)',
                  desc: 'Because of Birefringence, the vertical part travels faster than the horizontal part. A single crisp pulse splits into two separate ghost pulses.'
               },
               {
                  step: 'Step 05',
                  title: 'The Reverse Psychology Fix',
                  desc: 'Polarization-Maintaining (PM) fibers (PANDA) intentionally crush the core with rods to lock light into one orientation forever.'
               }
            ].map((s, i) => (
               <div key={i} className="group flex gap-12 items-start p-12 bg-white rounded-[3.5rem] border border-slate-100 hover:shadow-2xl transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center font-black text-xl shrink-0 shadow-xl group-hover:rotate-6 transition-transform">0{i+1}</div>
                  <div className="space-y-4">
                     <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{s.step}</div>
                     <h4 className="text-3xl font-black text-navy tracking-tighter">{s.title}</h4>
                     <p className="text-lg text-slate-500 leading-relaxed font-medium max-w-3xl">{s.desc}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* Interactive Lab Section */}
         <section className="space-y-12 bg-slate-50 rounded-[4rem] p-16 border border-slate-100">
            <header className="flex justify-between items-end">
               <div className="space-y-4">
                  <Badge variant="rose">Laboratory 05</Badge>
                  <h3 className="text-4xl font-black text-navy tracking-tight uppercase italic">Stress-Induced <span className="text-rose-600">Birefringence</span> Simulator</h3>
               </div>
               <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm hidden md:block">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Theoretical Delta</div>
                  <MathInline math="\Delta \tau = \frac{L \cdot \Delta n}{c}" />
               </div>
            </header>
            <PMDSimulator />
         </section>

         {/* The Coin Analogy */}
         <Card className="p-20 bg-navy relative overflow-hidden shadow-[0_50px_100px_rgba(30,27,75,0.4)]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-10">
                  <Badge variant="gold">Analogy Masterclass</Badge>
                  <h3 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">The Sliding Coin in <span className="text-blue-400">The Squished Pipe</span></h3>
                  <p className="text-xl text-blue-100/70 leading-relaxed font-medium">
                     Imagine a coin sliding in a PVC pipe. Standing up (Vertical) or laying flat (Horizontal). In a round pipe, both are identical.
                  </p>
                  <div className="space-y-6">
                     <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                        <h5 className="text-white font-black uppercase text-sm mb-2 tracking-widest">The Squish (Fast Axis)</h5>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"Standing up, the coin glides through the tall part of the oval with zero resistance."</p>
                     </div>
                     <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                        <h5 className="text-white font-black uppercase text-sm mb-2 tracking-widest">The Friction (Slow Axis)</h5>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"Laying flat, the coin's edges scrape the squished sides, dragging it back. The signal arrives spread out."</p>
                     </div>
                  </div>
               </div>
               <div className="relative aspect-square flex items-center justify-center p-12">
                  <div className="w-full h-full rounded-full border-8 border-dashed border-white/10 animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-64 h-40 rounded-[50%] border-8 border-white/20 glass-card flex items-center justify-center">
                        <div className="w-20 h-4 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-[2px] animate-pulse" />
                     </div>
                  </div>
               </div>
            </div>
         </Card>
      </div>
   );
};

/* =========================================
   3.5 FIBER EVOLUTION MASTERCLASS
   ========================================= */

const DispersionEvolutionSimulator = () => {
   const [fiberType, setFiberType] = useState('standard');

   const fiberData = {
      standard: {
         name: 'Standard SMF (G.652)',
         zero: '1310 nm',
         at1550: '+17 ps/nm·km',
         desc: 'The benchmark. Zero dispersion at 1310nm. Lowest loss at 1550nm creates a "Dilemma" of dim vs blurry signals.',
         color: '#334155',
         formula: (x) => (0.09 / 4) * x * (1 - Math.pow(1310 / x, 4))
      },
      dsf: {
         name: 'Dispersion-Shifted (G.653)',
         zero: '1550 nm',
         at1550: '0 ps/nm·km',
         desc: 'Shifted the zero-point to the 1550nm window by manipulating Waveguide Dispersion. Caused massive "Four-Wave Mixing" ghost signals in WDM systems.',
         color: '#e11d48',
         formula: (x) => 0.07 * (x - 1550)
      },
      nzdsf: {
         name: 'Non-Zero DSF (G.655)',
         zero: '1450 nm',
         at1550: '+4 ps/nm·km',
         desc: 'The modern backbone. Intentionally leaves a tiny bit of dispersion at 1550nm to force colored lasers to slide past each other, preventing data crashes.',
         color: '#059669',
         formula: (x) => 0.045 * (x - 1450)
      },
      dff: {
         name: 'Dispersion-Flattened',
         zero: 'Multiple',
         at1550: '±2 ps/nm·km',
         desc: 'Attempts a "W-profile" to keep dispersion near zero across all colors. Complex, expensive, and still suffered from FWM. A commercial failure.',
         color: '#8b5cf6',
         formula: (x) => 2 * Math.sin((x - 1300) * 0.015)
      }
   };

   const currentFiber = fiberData[fiberType];
   
   const points = [];
   for (let x = 1200; x <= 1700; x += 10) {
      const y = currentFiber.formula(x);
      const xCoord = ((x - 1200) / 500) * 400;
      const yCoord = 100 - (y / 30) * 100;
      points.push(`${xCoord},${yCoord}`);
   }
   const path = `M ${points.join(' L ')}`;

   return (
      <Card className="p-10 border-slate-100 bg-white shadow-2xl">
         <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 space-y-6">
               <h4 className="text-sm font-black text-navy uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Dispersion Profile Shifter</h4>
               <div className="space-y-3">
                  {Object.keys(fiberData).map(key => (
                     <button 
                        key={key}
                        onClick={() => setFiberType(key)}
                        className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-tight ${fiberType === key ? 'bg-navy text-white border-navy scale-[1.02] shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-200'}`}
                     >
                        {fiberData[key].name}
                     </button>
                  ))}
               </div>
               <div className="mt-12 p-8 glass-card border-slate-100 bg-slate-50/50 rounded-3xl">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1550nm Performance</span>
                     <span className={`text-xl font-black ${fiberType === 'nzdsf' ? 'text-emerald-500' : 'text-navy'}`}>{currentFiber.at1550}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{currentFiber.desc}</p>
               </div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-[3rem] border border-slate-100 p-12 relative overflow-hidden group">
               <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Chromatic Dispersion Profile (ps/nm·km)</div>
               <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                  <rect x="264" y="0" width="28" height="200" fill="#10b981" fillOpacity="0.05" />
                  <line x1="264" y1="0" x2="264" y2="200" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
                  <line x1="292" y1="0" x2="292" y2="200" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" opacity="0.2" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />
                  <line x1="88" y1="0" x2="88" y2="200" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2" />
                  <path d={path} fill="none" stroke={currentFiber.color} strokeWidth="4" strokeLinecap="round" className="transition-all duration-500 ease-in-out" />
                  <text x="88" y="195" fill="#94a3b8" fontSize="6px" fontWeight="900" textAnchor="middle">1310 nm</text>
                  <text x="278" y="195" fill="#10b981" fontSize="6px" fontWeight="900" textAnchor="middle">1550 nm window</text>
                  <text x="5" y="105" fill="#94a3b8" fontSize="6px" fontWeight="900">0 ps</text>
               </svg>
            </div>
         </div>
      </Card>
   );
};

const FiberEvolution = () => {
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
         <header className="mb-20">
            <Badge variant="indigo">Generation Lab</Badge>
            <h2 className="text-6xl font-black text-navy tracking-tighter mt-6 mb-8 uppercase italic leading-tight">The Evolution of <span className="text-indigo-600 block">Dispersion</span></h2>
            <p className="text-slate-500 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-indigo-600 pl-8">
               In fiber optics, we have two main goals: send light as <span className="text-navy">far</span> as possible and send data as <span className="text-navy">fast</span> as possible.
            </p>
         </header>

         {/* 5 Generation Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
               {
                  step: 'Step 01',
                  title: 'Multimode (Gen 1)',
                  problem: 'Intermodal Dispersion',
                  desc: 'Light takes many paths (modes). Some go straight, some bounce. Pulses arrive spread out wildly.',
                  fix: 'Shrunk core to 8µm, physically blocking all but one path.',
                  outcome: 'Born: Single-Mode Fiber (SMF)'
               },
               {
                  step: 'Step 02',
                  title: 'Standard SMF (Gen 2)',
                  problem: '1310 vs 1550 Dilemma',
                  desc: 'One path, but Chromatic Dispersion appears. Zero at 1310nm, but lowest loss is at 1550nm.',
                  fix: 'Engineers forced a choice: do you want dim crisp signals, or bright blurry ones?',
                  outcome: 'G.652 Standard'
               },
               {
                  step: 'Step 03',
                  title: 'DSF (Gen 3)',
                  problem: 'WDM Disaster',
                  desc: 'Successfully shifted the zero point to 1550nm. Perfect for one laser, but destroyed multi-laser WDM systems.',
                  fix: 'Modified core profile into a triangle to cancel material dispersion.',
                  outcome: 'Born: G.653'
               },
               {
                  step: 'Step 04',
                  title: 'DFF (Experimental)',
                  problem: 'Manufacturing Failure',
                  desc: 'Attempted to flatten the curve across all colors. Hovered near zero everywhere.',
                  fix: 'Multi-trench "W" profiles around the core.',
                  outcome: 'Commercial Failure'
               },
               {
                  step: 'Step 05',
                  title: 'NZDSF (Modern)',
                  problem: 'Four-Wave Mixing',
                  desc: 'Perfect zero dispersion causes "ghost" signals to spawn. We actually NEED a little bit of blur.',
                  fix: 'Zero shifted to ~1450nm. At 1550nm, a tiny ps/nm·km prevents data locking.',
                  outcome: 'Born: ITU-T G.655'
               }
            ].map((gen, i) => (
               <div key={i} className="p-10 glass-card bg-white border-slate-100 rounded-[2.5rem] flex flex-col hover:scale-[1.02] transition-all">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{gen.step}: {gen.problem}</div>
                  <h4 className="text-xl font-bold text-navy mb-4">{gen.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-8 flex-1">{gen.desc}</p>
                  <div className="space-y-4">
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="block text-[9px] font-black text-indigo-600 uppercase mb-1">Mathematical Fix</span>
                        <span className="text-[10px] text-slate-600 leading-tight font-bold italic">"{gen.fix}"</span>
                     </div>
                     <div className="p-3 bg-navy text-white rounded-xl text-center font-black text-[9px] uppercase tracking-widest">{gen.outcome}</div>
                  </div>
               </div>
            ))}
         </div>

         {/* Highway Analogy Expanded */}
         <section className="bg-slate-900 rounded-[4rem] p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.2),transparent)]" />
            <div className="relative z-10 space-y-16">
               <header className="text-center space-y-4">
                  <Badge variant="amber">Intuitive Physics</Badge>
                  <h3 className="text-5xl font-black text-white tracking-tight italic uppercase leading-none">The Highway of <span className="text-indigo-400">Data</span></h3>
               </header>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                     { 
                        title: 'Multimode', icon: '🚗🚗🚗', label: 'Chaos',
                        desc: 'A 10-lane highway. Cars weave everywhere, taking different distances to arrive. Massive traffic jam at the exit.' 
                     },
                     { 
                        title: 'Standard SMF', icon: '🛣️', label: 'Single Line',
                        desc: 'A 1-lane road. But red cars inherently drive faster than blue cars. Over 100 miles, they spread out.' 
                     },
                     { 
                        title: 'DSF (Perfect)', icon: '🏎️🏎️', label: 'Ghost Crash',
                        desc: 'Everyone at exactly 100mph. Drivers get bored, talk to each other, and crash side-by-side (Four-Wave Mixing).' 
                     },
                     { 
                        title: 'NZDSF (Hybrid)', icon: '🏁', label: 'The Winner',
                        desc: 'Tiny slope on the road. Red at 100mph, blue at 99mph. They drift past each other, never locking in and never crashing.' 
                     }
                  ].map((item, i) => (
                     <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[3rem] text-center space-y-6 hover:bg-white/10 transition-colors">
                        <div className="text-4xl">{item.icon}</div>
                        <div>
                           <h5 className="text-white font-black uppercase text-sm tracking-widest mb-1">{item.title}</h5>
                           <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest opacity-60">{item.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Visual Tool Section */}
         <section className="space-y-12">
            <div className="flex justify-between items-end">
               <div>
                  <Badge variant="emerald">Laboratory 04</Badge>
                  <h3 className="text-4xl font-black text-navy tracking-tight mt-6 uppercase italic">interactive <span className="text-emerald-500">dispersion</span> curve simulator</h3>
               </div>
               <div className="text-right pb-2">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">WDM Compatibility Check</p>
                  <p className="text-sm font-black text-navy italic">ITU-T Recommendation Series</p>
               </div>
            </div>
            <DispersionEvolutionSimulator />
         </section>
      </div>
   );
};

/* =========================================
   5. ADVANCED PHOTONIC CRYSTAL FIBERS
   ========================================= */
const MicrostructuredFibers = () => {
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
         <header>
            <Badge variant="indigo">Future Photonics</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Photonic <span className="text-indigo-600">Crystals</span></h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
               PCFs (Holey Fibers) utilize air-hole arrays to create guidance mechanisms
               not found in conventional silica structures.
            </p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="p-10 flex flex-col items-center">
               <h3 className="text-xs font-black text-navy mb-2 uppercase tracking-widest w-full">Modified TIR Node</h3>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-12 w-full">Index-Guiding Solid Core</p>
               <div className="w-48 h-48 rounded-full glass-card border border-white/20 shadow-inner relative flex items-center justify-center scale-110 hover:bg-white/60 transition-all">
                  <div className="grid grid-cols-7 gap-1.5 p-4 glass-card rounded-full border border-white/10">
                     {[...Array(49)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${i === 24 ? 'glass-navy shadow-xl scale-125 border-none' : 'bg-slate-300 shadow-inner'}`}></div>
                     ))}
                  </div>
               </div>
               <p className="text-[11px] text-slate-500 mt-16 leading-relaxed text-center px-8 font-medium">
                  Supports <span className="text-navy font-bold">Endless Single-Mode</span> operation by leveraging a wavelength-dependent effective cladding index.
               </p>
            </Card>

            <Card className="p-10 flex flex-col items-center border-indigo-100">
               <h3 className="text-xs font-black text-indigo-600 mb-2 uppercase tracking-widest w-full">Photonic Bandgap Node</h3>
               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-12 w-full">Hollow core Bragg guidance</p>
               <div className="w-48 h-48 rounded-full bg-indigo-500/10 border border-indigo-200/20 backdrop-blur-md shadow-inner relative flex items-center justify-center scale-110">
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-indigo-400 glass-card animate-pulse flex items-center justify-center">
                     <div className="w-8 h-8 rounded-full glass-navy border-none" />
                  </div>
                  <div className="absolute inset-0 grid grid-cols-9 gap-1 scale-110 opacity-20 pointer-events-none">
                     {[...Array(81)].map((_, i) => {
                        const circleX = (i % 9) - 4;
                        const circleY = Math.floor(i / 9) - 4;
                        const dist = Math.sqrt(circleX * circleX + circleY * circleY);
                        return <div key={i} className={`w-2 h-2 rounded-full ${dist < 2 ? 'invisible' : 'bg-navy'}`}></div>
                     })}
                  </div>
               </div>
               <p className="text-[11px] text-indigo-600/70 mt-16 leading-relaxed text-center px-8 font-medium">
                  Traps light in <span className="font-bold">Air</span>. Enables ultra-low latency and power delivery beyond the silica damage threshold.
               </p>
            </Card>
         </div>
      </div>
   );
};

/* =========================================
   6. ADVANCED PROBLEM SOLVER
   ========================================= */
const ProblemSolver = () => {
   return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
         <header>
            <Badge variant="amber">Laboratory Evaluation</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Problem <span className="text-indigo-600">Solver</span></h2>
            <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
               Analytical engineering cases focusing on signal integrity and link preservation.
            </p>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
            {[
               {
                  id: 'P-01',
                  title: 'Total Transmission Loss',
                  problem: 'An 12 km fiber has an input power of 250 µW and an output power of 5 µW. Find the attenuation in dB/km.',
                  steps: [
                     { label: 'Total Loss in dB', value: 'Loss_dB = 10 · log₁₀(P_in / P_out) = 10 · log₁₀(50) ≈ 16.99 dB' },
                     { label: 'Per-km Coefficient (α)', value: 'α = Loss_dB / L = 16.99 / 12 ≈ 1.416 dB/km' }
                  ],
                  color: 'amber'
               },
               {
                  id: 'P-02',
                  title: 'Bit Rate - Distance Product',
                  problem: 'A multimode fiber has a broadening of 15 ns/km. Calculate the maximum data rate (RZ) for a 5 km link.',
                  steps: [
                     { label: 'Total Broadening (Δτ)', value: 'Δτ_total = 15 ns/km · 5 km = 75 ns' },
                     { label: 'Bit Rate (R_b)', value: 'R_b ≤ 1 / (2 · Δτ_total) [RZ condition] = 1 / 150e-9 ≈ 6.67 Mbps' }
                  ],
                  color: 'emerald'
               },
               {
                  id: 'P-03',
                  title: 'Chromatic Dispersion Δλ',
                  problem: 'A laser has spectral width Δλ=2nm at 1310nm. If D = 0.5 ps/nm·km, find the broadening over 20km.',
                  steps: [
                     { label: 'Governing Equation', value: 'Δτ_chrom = |D| · L · Δλ' },
                     { label: 'Calculation', value: 'Δτ = 0.5 · 20 · 2 = 20 ps' }
                  ],
                  color: 'indigo'
               },
               {
                  id: 'P-04',
                  title: 'PMD Limit Estimation',
                  problem: 'A fiber has PMD coeff = 0.2 ps/√km. Estimate the average DGD for a 100km link.',
                  steps: [
                     { label: 'Statistical Relation', value: 'Average Δτ_pmd = D_pmd · √L' },
                     { label: 'Calculation', value: 'Δτ_pmd = 0.2 · √100 = 2.0 ps' }
                  ],
                  color: 'red'
               }
            ].map(p => (
               <Card key={p.id} className="p-8 border-slate-200 hover:border-navy/20 transition-all">
                  <div className="flex items-start gap-4 mb-6">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm shadow-${p.color}-200 border-2 border-${p.color}-100 text-${p.color}-600 bg-${p.color}-50`}>
                        {p.id}
                     </div>
                     <div className="flex-1">
                        <h4 className="text-xl font-bold text-navy mb-2 tracking-tight">{p.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                           {p.problem}
                        </p>
                     </div>
                  </div>
                  <details className="group">
                     <summary className="list-none cursor-pointer flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 py-4 px-6 glass-card border border-white/10 rounded-2xl hover:bg-white/60 transition-all">
                        <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" /> Reveal Analytical Solution Node
                     </summary>
                     <div className="mt-6 p-6 glass-navy rounded-3xl text-white font-mono text-xs leading-relaxed shadow-2xl border-none">
                        {p.steps.map((step, si) => (
                           <div key={si} className="mb-4 last:mb-0 border-l-2 border-white/10 pl-4 py-1">
                              <div className="text-blue-300 mb-1 font-bold"># {step.label}</div>
                              <div className="opacity-90">{step.value}</div>
                           </div>
                        ))}
                     </div>
                  </details>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default function Module2Modes({ onBack }) {
   const [activeSection, setActiveSection] = useState('attenuation');
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const sections = [
      { id: 'attenuation', title: '1. Attenuation', icon: <TrendingDown className="w-5 h-5" /> },
      { id: 'velocity', title: '2. Velocity Physics', icon: <Zap className="w-5 h-5" /> },
      { id: 'dispersion', title: '3. Dispersion Masterclass', icon: <FastForward className="w-5 h-5" /> },
      { id: 'evolution', title: '4. Fiber Evolution Lab', icon: <History className="w-5 h-5" /> },
      { id: 'polarization', title: '5. Polarization (PMD)', icon: <Activity className="w-5 h-5" /> },
      { id: 'pcf', title: '6. Photonic Crystals', icon: <Hexagon className="w-5 h-5" /> },
      { id: 'quiz', title: '7. Problem Solver', icon: <PenTool className="w-5 h-5" /> },
   ];

   return (
      <div className="flex flex-col md:flex-row h-screen bg-white text-navy font-body overflow-hidden">
         {/* Sidebar Navigation */}
         <nav className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 lg:w-96 h-full glass-navy flex flex-col shadow-2xl z-50 transition-transform duration-500 ease-in-out border-y-0 border-l-0`}>
            <div className="p-10 flex flex-col h-full">
               <button onClick={onBack} className="group flex items-center gap-4 text-slate-400 hover:text-white transition-all mb-16">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                     <ArrowLeft className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black tracking-widest uppercase text-[10px]">Portal Core</span>
               </button>

               <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pr-4 custom-scrollbar">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 px-4 opacity-60">Signal Dynamics</div>
                  {sections.map((section) => (
                     <button
                        key={section.id}
                        onClick={() => {
                           setActiveSection(section.id);
                           setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all duration-300 group relative ${activeSection === section.id
                              ? 'bg-white/90 glass-card text-navy shadow-xl scale-105 z-10'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                           }`}
                     >
                        <div className={`${activeSection === section.id ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-300'} transition-colors shrink-0`}>
                           {section.icon}
                        </div>
                        <span className={`font-black text-[11px] tracking-tight uppercase text-left pr-10 flex-1 ${activeSection === section.id ? 'text-navy' : ''}`}>
                           {section.title}
                        </span>
                        {activeSection === section.id && (
                           <div className="absolute right-8 w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        )}
                     </button>
                  ))}
               </div>

               <div className="mt-auto pt-8 border-t border-white/5">
                  <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/10">
                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                        <Zap className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <div className="text-[10px] font-black text-white uppercase tracking-widest">Module 02</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Signal Analysis</div>
                     </div>
                  </div>
               </div>
            </div>
         </nav>

         {/* Main Content Area */}
         <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-transparent">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-6 bg-navy text-white z-30">
               <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
                  <Menu className="w-6 h-6" />
               </button>
               <span className="font-black text-[10px] tracking-widest uppercase">Signal Analysis</span>
               <div className="w-10" />
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto px-8 py-12 md:px-20 md:py-24 scroll-smooth custom-scrollbar">
               <div className="max-w-5xl mx-auto pb-32">
                  {activeSection === 'attenuation' && <AttenuationLab />}
                  {activeSection === 'velocity' && <PhaseGroupVelocity />}
                  {activeSection === 'dispersion' && <DispersionMasterclass />}
                  {activeSection === 'evolution' && <FiberEvolution />}
                  {activeSection === 'polarization' && <PolarizationPMD />}
                  {activeSection === 'pcf' && <MicrostructuredFibers />}
                  {activeSection === 'quiz' && <ProblemSolver />}
               </div>
            </div>

            {/* Brand Watermark */}
            <div className="absolute bottom-10 right-10 text-slate-100 font-black text-9xl pointer-events-none select-none -z-10 tracking-tighter opacity-10">
               CORE
            </div>
         </main>

         {/* Mobile Menu Backdrop */}
         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-navy/80 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-500"
               onClick={() => setIsMobileMenuOpen(false)}
            />
         )}
      </div>
   );
}
