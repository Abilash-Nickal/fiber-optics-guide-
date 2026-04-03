import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    Lightbulb, Activity, Cpu, Share2, Target, Zap,
    ArrowLeft, CheckCircle2, Waves, LineChart, AlertTriangle,
    Menu, X, PenTool, Info, Settings2, ChevronRight, BookOpen, Play, GitMerge, ShieldX, RefreshCw
} from 'lucide-react';

import { MathBlock, MathInline, EquationCheatSheet } from '../MathBlock';

/* =========================================
   SHARED COMPONENTS (Corporate Lab)
   ========================================= */
const Card = ({ children, className = '' }) => (
    <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const Badge = ({ children, variant = 'navy', className = '' }) => {
    const styles = {
        navy: 'bg-slate-800/10 text-slate-800 border-slate-800/20',
        indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        red: 'bg-red-500/10 text-red-600 border-red-500/20',
        gold: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/40',
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[variant]} ${className}`}>
            {children}
        </span>
    );
};

/* =========================================
   1. FIBER ALIGNMENT & JOINT LOSSES
   ========================================= */
const JointLossSimulator = () => {
    const [lateral, setLateral] = useState(0);
    const [gap, setGap] = useState(0);
    const [tilt, setTilt] = useState(0);
    const [useGel, setUseGel] = useState(false);
    const modeFieldRadius = 5;

    const calculateLoss = () => {
        let lossDb = 0;
        lossDb += 4.34 * Math.pow(lateral / modeFieldRadius, 2);
        const angleRad = tilt * (Math.PI / 180);
        lossDb += 4.34 * Math.pow((Math.PI * modeFieldRadius * angleRad * 1.5) / 1.55, 2);
        lossDb += 10 * Math.log10(1 + Math.pow((gap * 1.55) / (Math.PI * Math.pow(modeFieldRadius, 2) * 1.5), 2));
        if (!useGel && gap > 0.5) lossDb += 0.32; // Fresnel penalty
        return lossDb.toFixed(2);
    };

    return (
        <Card className="p-10">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">Alignment Node</h4></header>
                    <div className="space-y-6">
                        {[
                            { label: 'Lateral Offset', unit: 'µm', value: lateral, set: setLateral, min: 0, max: 10, step: 0.1 },
                            { label: 'Longitudinal Gap', unit: 'µm', value: gap, set: setGap, min: 0, max: 50, step: 1 },
                            { label: 'Angular Tilt', unit: '°', value: tilt, set: setTilt, min: 0, max: 10, step: 0.1 }
                        ].map(ctrl => (
                            <div key={ctrl.label} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{ctrl.label}</label>
                                    <span className="text-xs font-black text-indigo-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{ctrl.value}{ctrl.unit}</span>
                                </div>
                                <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.value}
                                    onChange={e => ctrl.set(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                            </div>
                        ))}
                        <button onClick={() => setUseGel(!useGel)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${useGel ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-3"><Waves className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Index-Matching Gel</span></div>
                            <div className={`w-3 h-3 rounded-full ${useGel ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-300'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-50 rounded-[3.5rem] border border-slate-200 p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-inner">
                    <div className="absolute top-6 left-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Microscopic Joint View</div>

                    <div className="relative w-full h-80 flex items-center justify-center scale-90 md:scale-100">
                        {/* Left Fiber (Static) */}
                        <div className="relative z-10 w-48 md:w-64 h-32 flex items-center justify-end">
                            <div className="w-full h-24 bg-slate-300 rounded-l-full border-y-4 border-l-4 border-slate-400 flex items-center shadow-lg">
                                <div className="w-full h-4 bg-indigo-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-white animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* Gap Area */}
                        <div className="h-24 transition-all duration-300 relative flex items-center justify-center" style={{ width: `${gap * 3}px`, minWidth: gap > 0 ? '4px' : '0' }}>
                            {useGel && gap > 0 && <div className="absolute inset-0 bg-emerald-400/30 animate-pulse blur-[4px] rounded" />}
                            {/* Visualizing escaping light in the gap */}
                            {!useGel && gap > 10 && (
                                <div className="absolute w-full h-[150%] bg-[radial-gradient(ellipse_at_left,_rgba(99,102,241,0.4)_0%,_transparent_70%)]" style={{ opacity: Math.min(1, gap / 50) }} />
                            )}
                        </div>

                        {/* Right Fiber (Dynamic) */}
                        <div className="relative z-10 w-48 md:w-64 h-32 flex items-center transition-all duration-300 ease-out origin-left" style={{ transform: `translateY(${lateral * 10}px) rotate(${tilt}deg)` }}>
                            <div className="w-full h-24 bg-slate-300 rounded-r-full border-y-4 border-r-4 border-slate-400 flex items-center shadow-lg group relative">
                                <div className="w-full h-4 bg-slate-400 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-500 transition-opacity duration-300" style={{ opacity: Math.max(0.1, 1 - parseFloat(calculateLoss()) / 3) }} />
                                </div>
                                {/* Leakage Visualizer */}
                                <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-rose-500 blur-2xl rounded-full transition-opacity pointer-events-none" style={{ opacity: Math.min(0.8, parseFloat(calculateLoss()) / 5) }} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-6 bg-slate-900 text-white rounded-3xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500" />
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Total Insertion Loss</div>
                        <div className="text-4xl font-black tracking-tighter">{calculateLoss()} <span className="text-lg opacity-50">dB</span></div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const AlignmentCheatSheet = () => (
    <Card className="mt-20 p-12 bg-slate-900 border-4 border-indigo-900/50 shadow-2xl relative overflow-hidden print:bg-white print:border-none print:shadow-none print:p-0">
        {/* Background glows - hidden in print */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 blur-[100px] pointer-events-none print:hidden" />

        <div className="relative z-10" id="cheat-sheet-poster">
            <header className="text-center mb-16 border-b border-white/10 pb-8 print:border-slate-300">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <Badge variant="indigo" className="print:text-indigo-800 print:bg-indigo-100">Infographic Poster</Badge>
                    <button onClick={() => window.print()} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest transition-colors print:hidden flex items-center gap-2 border border-white/20">
                        <Share2 className="w-3 h-3" /> Save / Print
                    </button>
                </div>
                <h3 className="text-5xl font-black text-white mt-4 uppercase italic tracking-tighter print:text-slate-900">
                    Section 01 <span className="text-indigo-400 print:text-indigo-600">Cheat Sheet</span>
                </h3>
                <p className="text-slate-400 mt-4 font-medium tracking-widest uppercase print:text-slate-500">Fiber Alignment & Joint Losses Reference Guide</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lateral */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors print:border-slate-200 print:bg-slate-50">
                    <h4 className="text-xl font-black text-rose-400 uppercase italic mb-4 print:text-rose-600">1. Lateral Offset</h4>
                    <svg viewBox="0 0 200 100" className="w-full h-32 bg-slate-800/50 rounded-2xl mb-6 shadow-inner print:bg-white print:border print:border-slate-200">
                        {/* Left Fiber */}
                        <rect x="20" y="30" width="70" height="40" rx="2" fill="#334155" />
                        <rect x="20" y="45" width="70" height="10" fill="#818cf8" />
                        {/* Right Fiber (Offset down) */}
                        <rect x="110" y="40" width="70" height="40" rx="2" fill="#334155" />
                        <rect x="110" y="55" width="70" height="10" fill="#818cf8" />
                        {/* Offset indicator */}
                        <line x1="100" y1="50" x2="100" y2="60" stroke="#f43f5e" strokeWidth="2" />
                        <path d="M 97 53 L 100 50 L 103 53 M 97 57 L 100 60 L 103 57" fill="none" stroke="#f43f5e" strokeWidth="2" />
                        <text x="88" y="58" fill="#f43f5e" fontSize="12" fontWeight="bold">d</text>
                    </svg>
                    <MathBlock math="L_{lat} = 4.34 \left( \frac{d}{\omega_0} \right)^2" color="border-rose-400 bg-white/5 text-white print:text-slate-800 print:bg-white print:border-t-rose-400" />
                    <p className="text-xs text-slate-400 leading-relaxed mt-4 print:text-slate-600">Misalignment of core axes. The most destructive error. Loss grows exponentially with the square of offset distance <MathInline math="d" />.</p>
                </div>

                {/* Longitudinal */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors print:border-slate-200 print:bg-slate-50">
                    <h4 className="text-xl font-black text-emerald-400 uppercase italic mb-4 print:text-emerald-600">2. Longitudinal Gap</h4>
                    <svg viewBox="0 0 200 100" className="w-full h-32 bg-slate-800/50 rounded-2xl mb-6 shadow-inner print:bg-white print:border print:border-slate-200">
                        <rect x="10" y="30" width="60" height="40" rx="2" fill="#334155" />
                        <rect x="10" y="45" width="60" height="10" fill="#818cf8" />
                        <rect x="130" y="30" width="60" height="40" rx="2" fill="#334155" />
                        <rect x="130" y="45" width="60" height="10" fill="#818cf8" />
                        {/* Light Cone */}
                        <path d="M 70 45 L 130 35 L 130 65 L 70 55 Z" fill="rgba(129, 140, 248, 0.4)" className="print:fill-indigo-200" />
                        <line x1="70" y1="80" x2="130" y2="80" stroke="#34d399" strokeWidth="2" />
                        <path d="M 73 77 L 70 80 L 73 83 M 127 77 L 130 80 L 127 83" fill="none" stroke="#34d399" strokeWidth="2" />
                        <text x="96" y="92" fill="#34d399" fontSize="12" fontWeight="bold">z</text>
                    </svg>
                    <MathBlock math="L_{long} = 10 \log_{10} \left[ 1 + \left(\frac{z \lambda}{2 \pi n_2 \omega_0^2}\right)^2 \right]" color="border-emerald-400 bg-white/5 text-white print:text-slate-800 print:bg-white print:border-t-emerald-400" />
                    <p className="text-xs text-slate-400 leading-relaxed mt-4 print:text-slate-600">Beam expands naturally in the air gap <MathInline math="z" />, reducing overlap with the receiving core. Also triggers Fresnel reflection.</p>
                </div>

                {/* Angular */}
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors print:border-slate-200 print:bg-slate-50">
                    <h4 className="text-xl font-black text-amber-400 uppercase italic mb-4 print:text-amber-600">3. Angular Tilt</h4>
                    <svg viewBox="0 0 200 100" className="w-full h-32 bg-slate-800/50 rounded-2xl mb-6 shadow-inner overflow-visible print:bg-white print:border print:border-slate-200">
                        <rect x="10" y="35" width="90" height="30" rx="2" fill="#334155" />
                        <rect x="10" y="45" width="90" height="10" fill="#818cf8" />
                        <g transform="translate(100, 50) rotate(15) translate(-100, -50)">
                            <rect x="100" y="35" width="90" height="30" rx="2" fill="#334155" />
                            <rect x="100" y="45" width="90" height="10" fill="#818cf8" />
                        </g>
                        {/* Axis lines */}
                        <line x1="10" y1="50" x2="150" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                        {/* Angle arc */}
                        <path d="M 130 50 A 30 30 0 0 1 128 58" fill="none" stroke="#fbbf24" strokeWidth="2" />
                        <text x="135" y="62" fill="#fbbf24" fontSize="12" fontWeight="bold">θ</text>
                    </svg>
                    <MathBlock math="L_{ang} = 4.34 \left( \frac{\pi n_2 \omega_0 \theta}{\lambda} \right)^2" color="border-amber-400 bg-white/5 text-white print:text-slate-800 print:bg-white print:border-t-amber-400" />
                    <p className="text-xs text-slate-400 leading-relaxed mt-4 print:text-slate-600">Fibers meet at an angle <MathInline math="\theta" />, causing the wavefront to tilt and radiate power into the cladding.</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fresnel Reflection */}
                <div className="bg-indigo-900/50 border border-indigo-500/30 rounded-[2rem] p-8 flex flex-col xl:flex-row items-center gap-8 text-center xl:text-left print:bg-indigo-50 print:border-indigo-200">
                    <div className="w-full xl:w-56 shrink-0">
                        <svg viewBox="0 0 200 100" className="w-full h-auto bg-slate-900 rounded-xl shadow-inner print:bg-white print:border print:border-slate-200">
                            {/* Glass 1 */}
                            <rect x="10" y="20" width="70" height="60" rx="2" fill="#334155" className="print:fill-slate-200" />
                            <text x="45" y="90" fill="#94a3b8" fontSize="8" textAnchor="middle" className="print:fill-slate-500">n₁ = 1.45</text>

                            {/* Air Gap */}
                            <rect x="80" y="20" width="40" height="60" fill="#0f172a" className="print:fill-white" />
                            <text x="100" y="90" fill="#64748b" fontSize="8" textAnchor="middle" className="print:fill-slate-400">n_gap = 1</text>

                            {/* Glass 2 */}
                            <rect x="120" y="20" width="70" height="60" rx="2" fill="#334155" className="print:fill-slate-200" />
                            <text x="155" y="90" fill="#94a3b8" fontSize="8" textAnchor="middle" className="print:fill-slate-500">n₁ = 1.45</text>

                            {/* Light Path */}
                            {/* Incident */}
                            <line x1="10" y1="50" x2="80" y2="50" stroke="#818cf8" strokeWidth="4" />
                            <polygon points="75,47 82,50 75,53" fill="#818cf8" />

                            {/* Transmitted (weaker) */}
                            <line x1="80" y1="50" x2="190" y2="50" stroke="#818cf8" strokeWidth="2" opacity="0.6" />

                            {/* Reflected */}
                            <line x1="80" y1="50" x2="30" y2="30" stroke="#f43f5e" strokeWidth="2" />
                            <polygon points="40,30 30,30 35,37" fill="#f43f5e" />
                            <text x="60" y="35" fill="#f43f5e" fontSize="8" fontWeight="bold">~3.4% RL</text>
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-indigo-300 uppercase italic mb-2 print:text-indigo-700">Fresnel Reflection</h4>
                        <div className="bg-white/5 rounded-xl p-3 inline-block print:bg-white print:border print:border-indigo-100">
                            <MathInline math="R = \left( \frac{n_1 - n_{gap}}{n_1 + n_{gap}} \right)^2" />
                        </div>
                        <p className="text-xs text-indigo-200 mt-3 font-medium leading-relaxed print:text-indigo-900">
                            Occurs at every glass/air boundary. Silica-to-air causes ~3.4% reflection. A gap has TWO boundaries, causing ~0.31 dB baseline loss.
                        </p>
                    </div>
                </div>

                {/* Index Matching Gel */}
                <div className="bg-emerald-900/50 border border-emerald-500/30 rounded-[2rem] p-8 flex flex-col xl:flex-row items-center gap-8 text-center xl:text-left print:bg-emerald-50 print:border-emerald-200">
                    <div className="w-full xl:w-56 shrink-0">
                        <svg viewBox="0 0 200 100" className="w-full h-auto bg-slate-900 rounded-xl shadow-inner print:bg-white print:border print:border-slate-200">
                            {/* Glass 1 */}
                            <rect x="10" y="20" width="70" height="60" rx="2" fill="#334155" className="print:fill-slate-200" />

                            {/* Gel Gap */}
                            <rect x="80" y="20" width="40" height="60" fill="rgba(16, 185, 129, 0.2)" className="print:fill-emerald-100" />
                            <text x="100" y="90" fill="#34d399" fontSize="8" textAnchor="middle" className="print:fill-emerald-600">n_gel ≈ 1.45</text>

                            {/* Glass 2 */}
                            <rect x="120" y="20" width="70" height="60" rx="2" fill="#334155" className="print:fill-slate-200" />

                            {/* Light Path */}
                            {/* Incident -> Transmitted seamlessly */}
                            <line x1="10" y1="50" x2="190" y2="50" stroke="#818cf8" strokeWidth="4" />
                            <polygon points="100,46 108,50 100,54" fill="#818cf8" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-emerald-300 uppercase italic mb-2 print:text-emerald-700">Index-Matching Gel</h4>
                        <p className="text-xs text-emerald-200 font-medium leading-relaxed print:text-emerald-900">
                            Used inside mechanical splices and connectors. Matches the refractive index of silica ($n \approx 1.45$), effectively eliminating Fresnel reflections and optical return loss (ORL).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

const AlignmentMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Fiber Connectivity</Badge><Badge variant="navy">Section 01</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-none">Microscopic <span className="text-indigo-600 block">Alignment</span></h2>
            <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8 bg-slate-50 p-6 rounded-r-3xl">
                <p className="text-slate-600 font-bold leading-relaxed text-xl">Building global networks requires connecting thousands of cables. To build a bridge of light, we must join two microscopic glass cores with sub-micron precision.</p>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: 'Lateral Offset', lab: 'Biggest Enemy', icon: <Target className="w-6 h-6" />, desc: 'The most destructive misalignment. Parallel fibers shifted vertically or horizontally.' },
                { title: 'Longitudinal Gap', lab: 'Air Pockets', icon: <Share2 className="w-6 h-6" />, desc: 'Fibers separated by distance. Causes light divergence and Fresnel back-reflection.' },
                { title: 'Angular Tilt', lab: 'Geometric Error', icon: <Activity className="w-6 h-6" />, desc: 'Fibers meet at a tilt, breaking Total Internal Reflection rules and leaking light.' }
            ].map((item, i) => (
                <Card key={i} className="p-10 border-slate-200 group bg-white">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">{item.icon}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{item.lab}</div>
                    <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tighter leading-none">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </Card>
            ))}
        </div>

        <section className="space-y-16">
            <header className="space-y-4">
                <Badge variant="navy">Theory & Derivation</Badge>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">The Physics of <span className="text-indigo-600 block">Joint Losses</span></h3>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-200 pt-16">
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">1. Lateral (Axial) Offset</h4>
                        <p className="text-slate-600 leading-relaxed font-medium">The most critical alignment factor. If core centers are offset by distance $d$, the coupling efficiency drops exponentially. For two identical step-index fibers:</p>
                        <MathBlock math="L_{lat}(dB) = 4.34 \left( \frac{d}{\omega_0} \right)^2" color="border-rose-400" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Where $\omega_0$ is the Mode Field Radius (~5µm for standard SMF).</p>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">2. Angular Misalignment</h4>
                        <MathBlock math="L_{ang}(dB) = 4.34 \left( \frac{\pi n_2 \omega_0 \theta}{\lambda} \right)^2" color="border-indigo-400" />
                        <p className="text-slate-600 leading-relaxed font-medium">Angular tilts cause the wavefront to be "out of phase" when traversing the joint, leading to radiation loss into the cladding.</p>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">3. Fresnel Reflection</h4>
                        <p className="text-slate-600 leading-relaxed font-medium">At any discontinuity of refractive index (e.g. Fiber to Air), some power must reflect backwards. The reflectivity $R$ at normal incidence is:</p>
                        <MathBlock math="R = \left( \frac{n_1 - n_{gap}}{n_1 + n_{gap}} \right)^2" color="border-emerald-400" />
                        <p className="text-slate-600 leading-relaxed font-medium mt-4">For silica (<MathInline math="n_1 \approx 1.45" />) and air (<MathInline math="n_{gap} \approx 1.0" />), <MathInline math="R \approx 0.034" /> (3.4% reflected). This corresponds to a return loss of ~14.7 dB.</p>
                    </div>
                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px]" />
                        <h5 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Critical Reality</h5>
                        <p className="text-sm font-bold leading-relaxed italic">"Fresnel reflection occurs TWICE in a longitudinal gap (entering the air, and hitting the second glass face). This leads to approximately 0.31 dB of instant, unavoidable insertion loss unless Index-Matching Gel is used."</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="space-y-12">
            <header className="flex justify-between items-end border-b border-slate-200 pb-8">
                <div className="space-y-4">
                    <Badge variant="gold">Interactive Laboratory</Badge>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Joint Loss <span className="text-emerald-500 block">Simulator</span></h3>
                </div>
            </header>
            <JointLossSimulator />
            <AlignmentCheatSheet />
        </section>
    </div>
);

/* =========================================
   2. FUSION SPLICING & PROTECTION
   ========================================= */
const FusionSplicingSimulator = () => {
    const canvasRef = useRef(null);
    const [cleaveAngle, setCleaveAngle] = useState(0);
    const [arcPower, setArcPower] = useState('Optimal');
    const [phase, setPhase] = useState('READY');
    const [showProtector, setShowProtector] = useState(false);
    const [loss, setLoss] = useState(0);
    const [protectorAnim, setProtectorAnim] = useState(0);

    const calculateSpliceLoss = (angle, power) => {
        let baseLoss = 0.02;
        let anglePenalty = Math.pow(angle, 2) * 0.4;
        let arcPenalty = 0;
        if (power === 'Low') arcPenalty = 1.5;
        if (power === 'High') arcPenalty = 1.8;
        return (baseLoss + anglePenalty + arcPenalty).toFixed(2);
    };

    const initiateArc = () => {
        setPhase('SPLICING');
        let start = null;
        const duration = 1500;
        const animate = (time) => {
            if (!start) start = time;
            const progress = time - start;
            if (progress < duration) requestAnimationFrame(animate);
            else { setPhase('DONE'); setLoss(calculateSpliceLoss(cleaveAngle, arcPower)); }
        };
        requestAnimationFrame(animate);
    };

    const applyProtector = () => {
        setShowProtector(true);
        let start = null;
        const duration = 1500;
        const animate = (time) => {
            if (!start) start = time;
            const progress = time - start;
            setProtectorAnim(Math.min(1, progress / duration));
            if (progress < duration) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };

    const reset = () => { setPhase('READY'); setShowProtector(false); setProtectorAnim(0); setLoss(0); };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const render = () => {
            const w = canvas.width; const h = canvas.height; const centerY = h / 2;
            const fiberWidth = 180; const fiberHeight = 80; const coreHeight = 12;
            const gap = phase === 'READY' || phase === 'SPLICING' ? 30 : 0;

            ctx.clearRect(0, 0, w, h);

            // Draw Electrodes
            ctx.fillStyle = '#cbd5e1';
            ctx.beginPath(); ctx.moveTo(w / 2 - 5, 10); ctx.lineTo(w / 2 + 5, 10); ctx.lineTo(w / 2, 50); ctx.fill(); // Top
            ctx.beginPath(); ctx.moveTo(w / 2 - 5, h - 10); ctx.lineTo(w / 2 + 5, h - 10); ctx.lineTo(w / 2, h - 50); ctx.fill(); // Bottom

            const angleRad = (cleaveAngle * Math.PI) / 180;
            const slantOffset = Math.tan(angleRad) * (fiberHeight / 2);

            // Left Fiber
            ctx.beginPath(); ctx.fillStyle = '#f8fafc';
            ctx.moveTo(w / 2 - gap - fiberWidth, centerY - fiberHeight / 2);
            ctx.lineTo(w / 2 - gap - (phase === 'DONE' ? 0 : slantOffset), centerY - fiberHeight / 2);
            ctx.lineTo(w / 2 - gap + (phase === 'DONE' ? 0 : slantOffset), centerY + fiberHeight / 2);
            ctx.lineTo(w / 2 - gap - fiberWidth, centerY + fiberHeight / 2);
            ctx.closePath(); ctx.fill(); ctx.strokeRect(w / 2 - gap - fiberWidth, centerY - fiberHeight / 2, fiberWidth, fiberHeight);

            // Right Fiber
            ctx.beginPath();
            ctx.moveTo(w / 2 + gap + fiberWidth, centerY - fiberHeight / 2);
            ctx.lineTo(w / 2 + gap + (phase === 'DONE' ? 0 : slantOffset), centerY - fiberHeight / 2);
            ctx.lineTo(w / 2 + gap - (phase === 'DONE' ? 0 : slantOffset), centerY + fiberHeight / 2);
            ctx.lineTo(w / 2 + gap + fiberWidth, centerY + fiberHeight / 2);
            ctx.closePath(); ctx.fill();

            // Cores
            ctx.fillStyle = '#6366f1'; ctx.globalAlpha = 0.5;
            ctx.fillRect(w / 2 - gap - fiberWidth, centerY - coreHeight / 2, fiberWidth, coreHeight);
            ctx.fillRect(w / 2 + gap, centerY - coreHeight / 2, fiberWidth, coreHeight);
            ctx.globalAlpha = 1.0;

            // Plasma Arc Animation
            if (phase === 'SPLICING') {
                ctx.strokeStyle = '#c084fc'; ctx.lineWidth = 3; ctx.shadowBlur = 20; ctx.shadowColor = '#a855f7';
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath(); ctx.moveTo(w / 2, 50);
                    let currY = 50;
                    while (currY < h - 50) {
                        currY += 15 + Math.random() * 10;
                        ctx.lineTo(w / 2 + (Math.random() - 0.5) * 60, currY);
                    }
                    ctx.stroke();
                }
                ctx.shadowBlur = 0;
            }

            // Splice Result Deformities
            if (phase === 'DONE') {
                if (parseFloat(loss) > 0.15) {
                    // Bad Splice (Burned / Bubbled)
                    ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 4; ctx.beginPath();
                    ctx.moveTo(w / 2, centerY - fiberHeight / 2); ctx.lineTo(w / 2 + (Math.random() - 0.5) * 10, centerY); ctx.lineTo(w / 2, centerY + fiberHeight / 2); ctx.stroke();
                    for (let i = 0; i < 15; i++) {
                        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(w / 2 + (Math.random() - 0.5) * 20, centerY + (Math.random() - 0.5) * 30, Math.random() * 3 + 1, 0, Math.PI * 2); ctx.fill();
                    }
                } else {
                    // Perfect Splice
                    ctx.fillStyle = '#f8fafc'; ctx.fillRect(w / 2 - 5, centerY - fiberHeight / 2, 10, fiberHeight);
                    ctx.fillStyle = '#6366f1'; ctx.globalAlpha = 0.5; ctx.fillRect(w / 2 - 5, centerY - coreHeight / 2, 10, coreHeight); ctx.globalAlpha = 1.0;
                }
            }

            // Splice Protector Animation
            if (showProtector) {
                const slideIn = Math.min(1, protectorAnim * 2);
                const shrink = Math.max(0, (protectorAnim - 0.5) * 2);
                const pWidth = 320;
                const pHeight = 120 - (shrink * 30);
                const startX = -pWidth;
                const endX = w / 2 - pWidth / 2;
                const currentX = startX + (endX - startX) * slideIn;

                // Shrink Tube
                ctx.globalAlpha = 0.6; ctx.fillStyle = '#94a3b8'; ctx.beginPath(); ctx.roundRect(currentX, centerY - pHeight / 2, pWidth, pHeight, 15); ctx.fill();
                // Steel Splint
                ctx.globalAlpha = 0.9; ctx.fillStyle = '#334155'; ctx.fillRect(currentX + 10, centerY + pHeight / 2 - 20, pWidth - 20, 10);
                ctx.globalAlpha = 1.0;
            }
            animationId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [cleaveAngle, arcPower, phase, showProtector, protectorAnim, loss]);

    return (
        <Card className="p-10 border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-200 pb-4">Fusion Splicer Console</h4></header>
                    <div className="space-y-8">
                        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cleave Angle Error</label>
                                <span className={`text-xs font-black px-2 py-1 bg-white border border-slate-200 rounded ${cleaveAngle > 1 ? 'text-rose-500' : 'text-emerald-500'}`}>{cleaveAngle.toFixed(1)}°</span>
                            </div>
                            <input type="range" min="0" max="5" step="0.1" value={cleaveAngle} onChange={e => { setCleaveAngle(parseFloat(e.target.value)); reset(); }}
                                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-indigo-600" />
                        </div>
                        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Arc Plasma Power</label>
                            <div className="flex gap-2">
                                {['Low', 'Optimal', 'High'].map(p => (
                                    <button key={p} onClick={() => { setArcPower(p); reset(); }}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${arcPower === p ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={initiateArc} disabled={phase !== 'READY'} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${phase !== 'READY' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'}`}><Zap className="w-4 h-4" />INITIATE ARC</button>
                            <button onClick={applyProtector} disabled={phase !== 'DONE' || showProtector} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${phase !== 'DONE' || showProtector ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg'}`}><Settings2 className="w-4 h-4" />APPLY PROTECTOR</button>
                        </div>
                        {phase === 'DONE' && (
                            <div className={`p-4 rounded-2xl text-center font-black text-sm border-2 ${parseFloat(loss) > 0.15 ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                Est. Loss: {loss} dB
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] p-6 relative overflow-hidden flex flex-col min-h-[400px] border-[8px] border-slate-800 shadow-2xl">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-500 uppercase tracking-widest z-10">Microscope View (X/Y Aligned)</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full flex-1" />
                </div>
            </div>
        </Card>
    );
};

const SplicingMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="emerald">Fusion Lab</Badge><Badge variant="navy">Section 02</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-none">Robotic <span className="text-emerald-600 block">Splicing</span></h2>
            <p className="text-slate-600 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-emerald-600 pl-8 bg-emerald-50 p-6 rounded-r-3xl">To permanently join fibers with near-zero loss, technicians use high-voltage <span className="text-emerald-700 underline underline-offset-8">Plasma Arcs</span> to melt glass tips into a single, seamless strand.</p>
        </header>

        <section className="space-y-16">
            <header className="space-y-4">
                <Badge variant="emerald">Advanced Physics</Badge>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Fusion <span className="text-emerald-600 block">Mechanics</span></h3>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-200 pt-16 font-medium">
                <div className="space-y-10">
                    <div className="space-y-6 text-slate-600 leading-relaxed">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">1. Mode Field Mismatch</h4>
                        <p>Even a "perfect" splice between two different fiber types (e.g. G.652 to G.655) will have loss. The core sizes (Mode Field Diameters) do not match, causing light to overspill.</p>
                        <MathBlock math="L_{splice}(dB) = -20 \log_{10} \left( \frac{2 \omega_1 \omega_2}{\omega_1^2 + \omega_2^2} \right)" color="border-indigo-400 bg-indigo-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Where $\omega_1$ and $\omega_2$ are the MFD radii of the two fibers.</p>
                    </div>
                    <div className="space-y-6 text-slate-600 leading-relaxed">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">2. Surface Tension & Self-Alignment</h4>
                        <p>Molten glass acts like a liquid. When the arc hits, the surface tension of the silica naturally pulls the two fibers toward a common center. This "self-alignment" effect often corrects tiny lateral errors, yielding losses as low as 0.01 dB.</p>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="p-10 bg-emerald-900 text-emerald-50 border border-emerald-800 rounded-[3rem] space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 blur-[60px]" />
                        <h4 className="text-xl font-black text-emerald-300 uppercase italic relative z-10">The Thermocapillary Flow</h4>
                        <p className="text-sm leading-relaxed italic relative z-10">"During heating, the viscosity of silica drops from $10^{13}$ to $10^4$ Poise. The arc must be precisely timed; too little heat causes a 'cold splice' with air bubbles, while too much heat deforms the core geometry, causing 'necking'."</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Arc Temp</div>
                            <div className="text-2xl font-black text-rose-500 italic">~2000°C</div>
                        </div>
                        <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
                            <div className="text-[10px] font-black text-slate-500 uppercase mb-2">Optimal Loss</div>
                            <div className="text-2xl font-black text-emerald-500 italic">&lt; 0.02 dB</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { step: '01', title: 'Preparation', desc: 'Plastic buffers are stripped away. Bare glass is wiped with high-purity alcohol.' },
                { step: '02', title: 'Cleaving', desc: 'A tungsten blade scores and snaps the glass at a mathematically perfect 90° angle.' },
                { step: '03', title: 'Fusion Arc', desc: 'An electrical arc creates plasma to melt and join the fiber tips seamlessly.' },
                { step: '04', title: 'Protection', desc: 'A steel-reinforced shrink sleeve slides over the joint to act as a permanent splint.' }
            ].map((s, i) => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-200 hover:shadow-xl transition-all">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs mb-6 border border-emerald-100">
                        {s.step}
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-4 tracking-tighter">{s.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                </div>
            ))}
        </div>
        <FusionSplicingSimulator />
    </div>
);

/* =========================================
   3. CONNECTORS & TERMINATORS
   ========================================= */
const ConnectorSimulator = () => {
    const canvasRef = useRef(null);
    const [type, setType] = useState('UPC');
    const [isFiring, setIsFiring] = useState(false);
    const speed = 15;
    const boundaryX = 600;

    const fireLaser = () => setIsFiring(true);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); let animationId;
        let photon = { x: 50, y: 200, active: true, phase: 'FORWARD' };
        let reflectedParticles = [];

        const render = () => {
            const w = canvas.width; const h = canvas.height; const centerY = h / 2;

            // Background
            ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h);

            // Draw Fiber Core and Cladding
            ctx.fillStyle = '#e2e8f0'; ctx.fillRect(50, centerY - 80, 550, 160);
            ctx.fillStyle = '#cbd5e1'; ctx.fillRect(50, centerY - 15, 550, 30);

            // Draw End Face (Connector Polish)
            ctx.lineWidth = 6;
            ctx.strokeStyle = type === 'APC' ? '#10b981' : type === 'UPC' ? '#3b82f6' : '#0f172a';
            ctx.beginPath();
            if (type === 'UPC') {
                ctx.moveTo(boundaryX, centerY - 80);
                ctx.bezierCurveTo(boundaryX + 15, centerY - 40, boundaryX + 15, centerY + 40, boundaryX, centerY + 80);
            } else if (type === 'APC') {
                ctx.moveTo(boundaryX - 11, centerY - 80);
                ctx.lineTo(boundaryX + 11, centerY + 80);
            } else {
                // Terminator (Black Block)
                ctx.moveTo(boundaryX, centerY - 80); ctx.lineTo(boundaryX, centerY + 80);
                ctx.fillStyle = '#1e293b'; ctx.fillRect(boundaryX, centerY - 80, 50, 160);
            }
            ctx.stroke();

            // Laser Animation
            if (isFiring && photon.active) {
                if (photon.phase === 'FORWARD') {
                    photon.x += speed;
                    ctx.shadowBlur = 15; ctx.shadowColor = '#6366f1'; ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 8;
                    ctx.beginPath(); ctx.moveTo(photon.x - 50, centerY); ctx.lineTo(photon.x, centerY); ctx.stroke(); ctx.shadowBlur = 0;

                    if (photon.x >= boundaryX) {
                        if (type === 'TERMINATOR') {
                            photon.active = false;
                            for (let i = 0; i < 15; i++) {
                                reflectedParticles.push({ x: boundaryX, y: centerY + (Math.random() - 0.5) * 40, life: 1, vx: (Math.random()) * 3, vy: (Math.random() - 0.5) * 3 });
                            }
                        } else {
                            photon.phase = 'REFLECTED'; photon.dx = -speed;
                            const escapeAngle = type === 'APC' ? 16 * (Math.PI / 180) : 0;
                            photon.dy = Math.sin(escapeAngle) * speed;
                        }
                    }
                } else {
                    photon.x += photon.dx; photon.y += photon.dy;
                    ctx.shadowBlur = 15; ctx.shadowColor = '#f43f5e'; ctx.strokeStyle = '#f43f5e'; ctx.lineWidth = 6;
                    ctx.beginPath(); ctx.moveTo(photon.x + 40, photon.y - (photon.dy * 40 / Math.abs(photon.dx))); ctx.lineTo(photon.x, photon.y); ctx.stroke(); ctx.shadowBlur = 0;

                    if (photon.x < 50 || photon.y > h || photon.y < 0) {
                        photon.active = false; setIsFiring(false); photon = { x: 50, y: 200, active: true, phase: 'FORWARD' };
                    }
                }
            }

            // Terminator Absorption Animation
            reflectedParticles = reflectedParticles.filter(p => {
                p.life -= 0.03; p.x += p.vx; p.y += p.vy;
                ctx.fillStyle = `rgba(30, 41, 59, ${p.life})`;
                ctx.beginPath(); ctx.arc(p.x, p.y, (1 - p.life) * 10 + 2, 0, Math.PI * 2); ctx.fill();
                if (p.life <= 0) { setIsFiring(false); photon = { x: 50, y: 200, active: true, phase: 'FORWARD' }; }
                return p.life > 0;
            });

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [isFiring, type]);

    return (
        <Card className="p-10 border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">Connection Types</h4></header>
                    <div className="space-y-4">
                        {[
                            { id: 'UPC', label: 'UPC (Blue)', desc: 'Domed polish. Traps air, but causes straight back-reflection (~50dB RL).' },
                            { id: 'APC', label: 'APC (Green)', desc: '8° Angled polish. Deflects reflection into cladding (>60dB RL).' },
                            { id: 'TERMINATOR', label: 'Terminator', desc: 'Optical black hole. Doped material absorbs unused port energy.' }
                        ].map(m => (
                            <button key={m.id} onClick={() => { setType(m.id); setIsFiring(false); }}
                                className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${type === m.id ? 'bg-white border-indigo-500 shadow-md scale-[1.02]' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white'}`}>
                                <div className={`text-[10px] font-black uppercase mb-2 ${type === m.id ? 'text-indigo-600' : 'text-slate-400'}`}>{m.label}</div>
                                <div className={`text-xs font-medium ${type === m.id ? 'text-slate-600' : 'text-slate-400'}`}>{m.desc}</div>
                            </button>
                        ))}
                    </div>
                    <button onClick={fireLaser} disabled={isFiring}
                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isFiring ? 'bg-slate-200 text-slate-400' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg'}`}>
                        Fire Test Pulse
                    </button>
                </div>
                <div className="flex-1 bg-white rounded-[3.5rem] border border-slate-200 shadow-inner overflow-hidden relative min-h-[400px] flex flex-col">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">Ray Trace Simulation</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full flex-1" />

                    {/* Dynamic Readout */}
                    <div className="absolute bottom-6 right-8 bg-white border border-slate-200 p-4 rounded-2xl shadow-lg max-w-[200px]">
                        <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</div>
                        {type === 'UPC' && <div className="text-rose-500 font-bold text-xs leading-tight">WARNING: High Back-Reflection. Laser destabilization risk.</div>}
                        {type === 'APC' && <div className="text-emerald-500 font-bold text-xs leading-tight">SAFE: Reflection safely deflected into cladding.</div>}
                        {type === 'TERMINATOR' && <div className="text-slate-800 font-bold text-xs leading-tight">SAFE: Optical energy fully absorbed.</div>}
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ConnectorsMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Optical Interfaces</Badge><Badge variant="navy">Section 03</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-none">Plug & <span className="text-blue-600 block">Play Joints</span></h2>
            <p className="text-slate-600 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-blue-600 pl-8 bg-slate-50 p-6 rounded-r-3xl">Connectors allow us to build modular networks. Instead of melting glass, they rely on rigid ceramic <span className="text-slate-900">Ferrules</span> and spring tension to align cores perfectly.</p>
        </header>

        <section className="space-y-16">
            <header className="space-y-4">
                <Badge variant="navy">Theory & Design</Badge>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Connector <span className="text-blue-600 block">Performance</span></h3>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-200 pt-16">
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">1. Return Loss (ORL)</h4>
                        <p className="text-slate-600 leading-relaxed font-medium">Unlike splices, connectors always involve a physical interface where back-reflections (Fresnel) occur. High reflections can return to the transmitter, causing Relative Intensity Noise (RIN) in the laser.</p>
                        <MathBlock math="RL(dB) = -10 \log_{10} \left( \frac{P_{reflected}}{P_{incident}} \right)" color="border-blue-400 bg-blue-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Higher RL is better (e.g., 60dB is vastly superior to 40dB).</p>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">2. The 8° APC Polish</h4>
                        <p className="text-slate-600 leading-relaxed font-medium">By polishing the ferrule end-face at an 8-degree angle (Angled Physical Contact), we ensure reflected light is angled *outside* the numerical aperture of the core.</p>
                        <div className="p-8 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-[2.5rem]">
                            <h5 className="text-xs font-black uppercase mb-2 text-emerald-600">APC Benefit Math</h5>
                            <p className="text-sm italic font-bold">"Reflected rays are offset by $2\theta$ (16° relative to the incident ray). This angle easily exceeds the critical angle limit, effectively 'trapping' the dangerous noise in the cladding to be absorbed by the plastic jacket."</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <ConnectorSimulator />
    </div>
);

/* =========================================
   4. PASSIVE COMPONENTS (Couplers & Routing)
   ========================================= */

const FBTCouplerSimulator = () => {
    const canvasRef = useRef(null);
    const [couplingLength, setCouplingLength] = useState(50);
    const [p3, setP3] = useState(50);
    const [p4, setP4] = useState(50);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); let animationId;
        let time = 0;

        const render = () => {
            time += 0.05;
            const w = canvas.width; const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Physics math for Evanescent Coupling
            // Power oscillates sinusoidally based on length
            const kappa = 0.0314; // Coupling coefficient
            const actualLength = couplingLength * 2; // scale for drawing
            const p1Transfer = Math.pow(Math.cos(kappa * couplingLength), 2) * 100;
            const p2Transfer = Math.pow(Math.sin(kappa * couplingLength), 2) * 100;

            // Update UI State smoothly
            setP3(p1Transfer);
            setP4(p2Transfer);

            // Draw Glass Fibers
            ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.strokeStyle = '#e2e8f0'; // Cladding

            // Top Fiber (Port 1 to Port 3)
            ctx.beginPath(); ctx.moveTo(50, 80); ctx.bezierCurveTo(200, 80, 250, 150, 300, 150);
            ctx.lineTo(300 + actualLength, 150); ctx.bezierCurveTo(350 + actualLength, 150, 400 + actualLength, 80, 750, 80); ctx.stroke();

            // Bottom Fiber (Port 2 to Port 4)
            ctx.beginPath(); ctx.moveTo(50, 220); ctx.bezierCurveTo(200, 220, 250, 150, 300, 150);
            ctx.lineTo(300 + actualLength, 150); ctx.bezierCurveTo(350 + actualLength, 150, 400 + actualLength, 220, 750, 220); ctx.stroke();

            // Draw Core/Light
            ctx.lineWidth = 6;

            // Input Port 1 (100% Light)
            ctx.strokeStyle = '#38bdf8'; ctx.shadowBlur = 15; ctx.shadowColor = '#38bdf8';
            ctx.beginPath(); ctx.moveTo(50, 80); ctx.bezierCurveTo(200, 80, 250, 150, 300, 150); ctx.stroke();

            // Input Port 2 (0% Light)
            ctx.strokeStyle = '#94a3b8'; ctx.shadowBlur = 0;
            ctx.beginPath(); ctx.moveTo(50, 220); ctx.bezierCurveTo(200, 220, 250, 150, 300, 150); ctx.stroke();

            // Coupling Region (The Pendulum)
            // We draw tiny segments to show the light fading between top and bottom
            for (let x = 0; x < actualLength; x += 5) {
                let currentZ = x / 2;
                let intensityTop = Math.pow(Math.cos(kappa * currentZ), 2);
                let intensityBot = Math.pow(Math.sin(kappa * currentZ), 2);

                // Top Core in coupling region
                ctx.strokeStyle = `rgba(56, 189, 248, ${intensityTop})`; ctx.shadowBlur = intensityTop * 15;
                ctx.beginPath(); ctx.moveTo(300 + x, 147); ctx.lineTo(300 + x + 5, 147); ctx.stroke();

                // Bottom Core in coupling region
                ctx.strokeStyle = `rgba(56, 189, 248, ${intensityBot})`; ctx.shadowBlur = intensityBot * 15;
                ctx.beginPath(); ctx.moveTo(300 + x, 153); ctx.lineTo(300 + x + 5, 153); ctx.stroke();
            }

            // Output Port 3
            ctx.strokeStyle = `rgba(56, 189, 248, ${p1Transfer / 100})`; ctx.shadowBlur = (p1Transfer / 100) * 15;
            ctx.beginPath(); ctx.moveTo(300 + actualLength, 150); ctx.bezierCurveTo(350 + actualLength, 150, 400 + actualLength, 80, 750, 80); ctx.stroke();

            // Output Port 4
            ctx.strokeStyle = `rgba(56, 189, 248, ${p2Transfer / 100})`; ctx.shadowBlur = (p2Transfer / 100) * 15;
            ctx.beginPath(); ctx.moveTo(300 + actualLength, 150); ctx.bezierCurveTo(350 + actualLength, 150, 400 + actualLength, 220, 750, 220); ctx.stroke();

            ctx.shadowBlur = 0;

            // Labels
            ctx.fillStyle = '#64748b'; ctx.font = 'bold 12px sans-serif';
            ctx.fillText('Port 1 (100%)', 50, 60);
            ctx.fillText('Port 2 (0%)', 50, 250);
            ctx.fillText(`Port 3 (${p3.toFixed(1)}%)`, 660, 60);
            ctx.fillText(`Port 4 (${p4.toFixed(1)}%)`, 660, 250);

            animationId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [couplingLength]);

    return (
        <Card className="p-10 border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">FBT Splitter Design</h4></header>
                    <div className="space-y-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coupling Length (z)</label>
                            <span className="text-xs font-black text-sky-600 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">{couplingLength} µm</span>
                        </div>
                        <input type="range" min="0" max="100" step="1" value={couplingLength} onChange={e => setCouplingLength(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-sky-500" />
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic mt-4">
                            "As the molten glass is stretched, the cladding thins. Evanescent waves physically spill across the gap, acting like a pendulum transferring energy back and forth."
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Port 3 Power</div>
                            <div className="text-2xl font-black text-sky-600">{p3.toFixed(1)}%</div>
                        </div>
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Port 4 Power</div>
                            <div className="text-2xl font-black text-sky-600">{p4.toFixed(1)}%</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[400px]">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-500 uppercase tracking-widest z-10">Evanescent Wave Coupling</div>
                    <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const TrafficControlSimulator = () => {
    const canvasRef = useRef(null);
    const [device, setDevice] = useState('ISOLATOR'); // ISOLATOR, CIRCULATOR
    const [action, setAction] = useState('IDLE'); // FORWARD, BACKWARD, PORT1, PORT2

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); let animationId;

        let particles = [];
        const spawnParticle = (x, y, dx, dy, color) => {
            particles.push({ x, y, dx, dy, color, life: 1, active: true });
        };

        if (action === 'FORWARD') spawnParticle(50, 150, 5, 0, '#10b981');
        if (action === 'BACKWARD') spawnParticle(750, 150, -5, 0, '#f43f5e');
        if (action === 'PORT1') spawnParticle(150, 50, 3, 3, '#10b981');
        if (action === 'PORT2') spawnParticle(650, 150, -5, 0, '#38bdf8');

        setAction('IDLE'); // reset trigger

        const render = () => {
            const w = canvas.width; const h = canvas.height;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);

            if (device === 'ISOLATOR') {
                // Draw Fiber & Isolator
                ctx.fillStyle = '#334155'; ctx.fillRect(50, 140, 700, 20);
                ctx.fillStyle = '#1e293b'; ctx.fillRect(350, 110, 100, 80);
                ctx.strokeStyle = '#475569'; ctx.lineWidth = 2; ctx.strokeRect(350, 110, 100, 80);
                ctx.fillStyle = '#64748b'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('FARADAY ROTATOR', 345, 90);

                // Update particles
                particles.forEach(p => {
                    if (!p.active) return;
                    p.x += p.dx;

                    if (p.dx > 0) { // Forward
                        ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.fillStyle = p.color;
                        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
                        if (p.x > w) p.active = false;
                    } else { // Backward
                        if (p.x <= 450) {
                            // BLOCKED
                            p.dx = 0; p.life -= 0.05;
                            ctx.fillStyle = `rgba(244, 63, 94, ${p.life})`;
                            ctx.beginPath(); ctx.arc(p.x, p.y, (1 - p.life) * 20, 0, Math.PI * 2); ctx.fill();
                            if (p.life <= 0) p.active = false;
                        } else {
                            ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.fillStyle = p.color;
                            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
                        }
                    }
                });
            } else if (device === 'CIRCULATOR') {
                // Draw Circulator (3 Ports)
                ctx.fillStyle = '#334155';
                // Port 1 (Top Left)
                ctx.beginPath(); ctx.moveTo(50, 50); ctx.lineTo(350, 150); ctx.lineWidth = 20; ctx.stroke();
                // Port 2 (Right)
                ctx.beginPath(); ctx.moveTo(450, 150); ctx.lineTo(750, 150); ctx.stroke();
                // Port 3 (Bottom Left)
                ctx.beginPath(); ctx.moveTo(350, 150); ctx.lineTo(50, 250); ctx.stroke();

                // Center Circle
                ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.arc(400, 150, 60, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#475569'; ctx.lineWidth = 4; ctx.stroke();
                // Directional Arrow inside
                ctx.strokeStyle = '#64748b'; ctx.beginPath(); ctx.arc(400, 150, 30, Math.PI * 0.8, Math.PI * 2.2); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(430, 140); ctx.lineTo(430, 160); ctx.lineTo(410, 150); ctx.fill();

                // Labels
                ctx.fillStyle = '#64748b'; ctx.font = 'bold 12px sans-serif';
                ctx.fillText('PORT 1 (TX)', 50, 30);
                ctx.fillText('PORT 2 (FIBER)', 680, 130);
                ctx.fillText('PORT 3 (RX)', 50, 280);

                // Update particles
                particles.forEach(p => {
                    if (!p.active) return;
                    p.x += p.dx; p.y += p.dy;

                    // Routing Logic
                    if (p.color === '#10b981') { // From Port 1
                        if (p.x >= 400) { p.dx = 5; p.dy = 0; p.y = 150; } // Turn to Port 2
                    } else if (p.color === '#38bdf8') { // From Port 2
                        if (p.x <= 400) { p.dx = -3; p.dy = 3; } // Turn to Port 3
                    }

                    ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

                    if (p.x < 0 || p.x > w || p.y > h) p.active = false;
                });
            }

            particles = particles.filter(p => p.active);
            animationId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [device, action]);

    return (
        <Card className="p-10 border-slate-200 mt-12">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">Traffic Control</h4></header>
                    <div className="flex gap-2">
                        <button onClick={() => setDevice('ISOLATOR')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${device === 'ISOLATOR' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}><ShieldX className="w-3 h-3" /> Isolator</button>
                        <button onClick={() => setDevice('CIRCULATOR')} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${device === 'CIRCULATOR' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}><RefreshCw className="w-3 h-3" /> Circulator</button>
                    </div>

                    <div className="space-y-4 pt-6">
                        {device === 'ISOLATOR' ? (
                            <>
                                <p className="text-xs text-slate-500 font-medium italic">An isolator uses a magnetic Faraday crystal to allow light forward, but block 100% of backward reflections from destroying the laser.</p>
                                <button onClick={() => setAction('FORWARD')} className="w-full py-4 rounded-xl bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase border border-emerald-200 hover:bg-emerald-100 transition-all">Fire Laser Forward (Allowed)</button>
                                <button onClick={() => setAction('BACKWARD')} className="w-full py-4 rounded-xl bg-rose-50 text-rose-600 font-black text-[10px] uppercase border border-rose-200 hover:bg-rose-100 transition-all">Trigger Back-Reflection (Blocked)</button>
                            </>
                        ) : (
                            <>
                                <p className="text-xs text-slate-500 font-medium italic">A 3-port circulator is a directional router. Port 1 strictly exits to Port 2. Port 2 strictly exits to Port 3. Perfect for Bi-Directional transmission on one fiber.</p>
                                <button onClick={() => setAction('PORT1')} className="w-full py-4 rounded-xl bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase border border-emerald-200 hover:bg-emerald-100 transition-all">Inject TX (Port 1)</button>
                                <button onClick={() => setAction('PORT2')} className="w-full py-4 rounded-xl bg-sky-50 text-sky-600 font-black text-[10px] uppercase border border-sky-200 hover:bg-sky-100 transition-all">Incoming RX (Port 2)</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[300px]">
                    <canvas ref={canvasRef} width={800} height={300} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const PassivesMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Network Routing</Badge><Badge variant="navy">Section 04</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-none">Passive <span className="text-blue-600 block">Components</span></h2>
            <p className="text-slate-600 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-blue-600 pl-8 bg-slate-50 p-6 rounded-r-3xl">The internet is a web, not a straight line. We must split, combine, and strictly route light using components that require zero electrical power.</p>
        </header>

        <section className="space-y-16">
            <header className="space-y-4">
                <Badge variant="navy">Theory & Design</Badge>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Evanescent <span className="text-sky-500 block">Coupling</span></h3>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-200 pt-16">
                <div className="space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">The FBT Splitter</h4>
                        <p className="text-slate-600 leading-relaxed font-medium">You cannot simply glue two fibers together to split light. The Fused Biconical Taper (FBT) method melts and stretches two fibers. The cladding becomes so thin that the <strong>Evanescent Fields</strong> overlap, allowing energy to leak from Core 1 into Core 2.</p>
                        <MathBlock math="P_1(z) = P_{in} \cos^2(\kappa z) \quad ; \quad P_2(z) = P_{in} \sin^2(\kappa z)" color="border-sky-400 bg-sky-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">By stopping the pull at a specific length $z$, we can create 50:50, 90:10, or 99:1 splitting ratios!</p>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 blur-[50px]" />
                        <h5 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-3">Coupler Losses</h5>
                        <div className="space-y-4 font-medium text-sm">
                            <p><strong>Splitting Loss:</strong> Unavoidable physics. Splitting power in half guarantees a 3dB loss.</p>
                            <p><strong>Excess Loss:</strong> Power scattered/destroyed during the melting process (ideal is &lt; 0.1dB).</p>
                            <p><strong>Insertion Loss:</strong> The total sum: Splitting + Excess.</p>
                        </div>
                    </div>
                </div>
            </div>
            <FBTCouplerSimulator />
        </section>

        <section className="space-y-16">
            <header className="space-y-4">
                <Badge variant="emerald">Traffic Control</Badge>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Isolators & <span className="text-emerald-500 block">Circulators</span></h3>
            </header>
            <TrafficControlSimulator />
        </section>
    </div>
);

/* =========================================
   5. TRANSMITTER PHYSICS (LASER SOURCES)
   ========================================= */
const LaserSourcesSimulator = () => {
    const canvasRef = useRef(null);
    const [pump, setPump] = useState(25);
    const [mode, setMode] = useState('FP');
    const atomsRef = useRef([]);
    const photonsRef = useRef([]);

    useEffect(() => {
        const atoms = [];
        for (let i = 0; i < 50; i++) {
            atoms.push({
                x: 100 + Math.random() * 400,
                y: 50 + Math.random() * 200,
                excited: false
            });
        }
        atomsRef.current = atoms;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame = 0;
        let localSpectrum = new Array(50).fill(0);

        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height;
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h);

            // Draw Cavity
            ctx.strokeStyle = '#334155'; ctx.lineWidth = 4; ctx.strokeRect(100, 50, 400, 200);

            // Draw Mirrors
            ctx.fillStyle = mode === 'FP' ? '#94a3b8' : '#1e293b'; // Left Mirror
            ctx.fillRect(90, 40, 10, 220);
            ctx.fillStyle = mode === 'FP' ? '#cbd5e1' : '#1e293b'; // Right Mirror (partial)
            ctx.fillRect(500, 40, 10, 220);

            // Draw DFB Grating
            if (mode === 'DFB') {
                ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.beginPath();
                for (let x = 110; x < 490; x += 10) { ctx.moveTo(x, 150 - Math.sin(x / 5) * 15); ctx.lineTo(x, 150 + Math.sin(x / 5) * 15); }
                ctx.stroke();
                ctx.fillStyle = 'rgba(74, 222, 128, 0.05)'; ctx.fillRect(100, 50, 400, 200); // Greenish tint
            }

            // Pump Atoms
            atomsRef.current.forEach(a => {
                if (!a.excited && Math.random() < pump / 1000) a.excited = true;
                ctx.fillStyle = a.excited ? '#fde047' : '#334155';
                if (a.excited) { ctx.shadowBlur = 10; ctx.shadowColor = '#fde047'; }
                ctx.beginPath(); ctx.arc(a.x, a.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

                // Spontaneous Emission
                if (a.excited && Math.random() < 0.01) {
                    a.excited = false;
                    photonsRef.current.push({ x: a.x, y: a.y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 4, color: mode === 'DFB' ? 1550 : 1540 + Math.random() * 20 });
                }
            });

            // Move Photons & Stimulate
            photonsRef.current = photonsRef.current.filter(p => {
                p.x += p.vx; p.y += p.vy;

                // Left Bounce
                if (p.x < 100) {
                    if (mode === 'FP' || (mode === 'DFB' && Math.abs(p.color - 1550) < 1)) { p.vx = Math.abs(p.vx); p.x = 100; }
                    else return false; // DFB destroys non-resonant
                }
                // Right Bounce / Escape
                if (p.x > 500) {
                    if (Math.random() < 0.15) { // Escape
                        localSpectrum[Math.floor(Math.min(49, Math.max(0, (p.color - 1540) * 2.5)))]++;
                        return false;
                    }
                    if (mode === 'FP' || (mode === 'DFB' && Math.abs(p.color - 1550) < 1)) { p.vx = -Math.abs(p.vx); p.x = 500; }
                    else return false; // DFB destroys non-resonant
                }
                // Y Bounce
                if (p.y < 50 || p.y > 250) { p.vy = -p.vy; }

                // Stimulated Emission
                atomsRef.current.forEach(a => {
                    if (a.excited && Math.hypot(p.x - a.x, p.y - a.y) < 15) {
                        a.excited = false;
                        // Clone photon!
                        photonsRef.current.push({ x: a.x, y: a.y, vx: p.vx, vy: p.vy, color: p.color });
                    }
                });

                // Draw
                ctx.fillStyle = mode === 'DFB' ? '#4ade80' : `hsl(${(p.color - 1540) * 10}, 80%, 60%)`;
                ctx.shadowBlur = 5; ctx.shadowColor = ctx.fillStyle;
                ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
                return true;
            });

            // Draw Spectrum Chart
            ctx.fillStyle = '#1e293b'; ctx.fillRect(550, 50, 200, 200);
            ctx.strokeStyle = mode === 'DFB' ? '#4ade80' : '#6366f1'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
            ctx.beginPath();
            localSpectrum.forEach((val, i) => {
                const x = 550 + (i * 4); const y = 250 - Math.min(val * 2, 190);
                if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                if (frame % 30 === 0) localSpectrum[i] *= 0.8; // Decay
            });
            ctx.stroke();

            // Chart Labels
            ctx.fillStyle = '#64748b'; ctx.font = 'bold 10px sans-serif';
            ctx.fillText('OUTPUT SPECTRUM', 555, 65);
            ctx.fillText(mode === 'DFB' ? 'Pure 1550nm' : 'Multiple FP Modes', 555, 240);

            requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [mode, pump]);

    return (
        <Card className="p-10 bg-white shadow-xl border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">Laser Control</h4></header>
                    <div className="space-y-6">
                        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Injection Current (Pump)</label>
                            <input type="range" min="0" max="100" value={pump} onChange={e => setPump(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-indigo-600 cursor-pointer" />
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Creates Population Inversion</p>
                        </div>
                        <div className="flex gap-2">
                            {['FP', 'DFB'].map(t => (
                                <button key={t} onClick={() => { setMode(t); photonsRef.current = []; }}
                                    className={`flex-1 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${mode === t ? 'bg-slate-800 text-white shadow-md scale-[1.02]' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}>
                                    {t === 'FP' ? 'Fabry-Perot' : 'DFB Laser'}
                                </button>
                            ))}
                        </div>
                        <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-900">
                            <p className="text-xs font-medium italic">
                                "{mode === 'FP' ? 'Fabry-Perot lasers use flat end-mirrors. The wide cavity allows several closely-related wavelengths to resonate and escape.' : 'Distributed Feedback lasers etch a corrugated grating directly into the cavity. It acts as a perfect filter, destroying all but one exact wavelength.'}"
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[400px]">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">Stimulated Emission Cavity</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const SourcesView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Source Physics</Badge><Badge variant="navy">Section 05</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-[0.9]">Active <span className="text-indigo-600 block">Emission</span></h2>
            <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8 bg-slate-50 p-6 rounded-r-3xl">
                <p className="text-slate-600 font-bold leading-relaxed text-xl">We cannot use flashlights to power the internet. We need coherent, organized photons that travel in perfect lockstep. We need the <span className="text-slate-900">Laser Diode</span>.</p>
            </div>
        </header>

        <section className="space-y-16">
            <div className="flex justify-between items-end border-b border-slate-200 pb-12">
                <div className="space-y-4">
                    <Badge variant="indigo">Quantum Mechanics</Badge>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Laser <span className="text-indigo-600 block">Dynamics</span></h3>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-slate-200 pt-16">
                <div className="space-y-10">
                    <div className="space-y-6 text-slate-600 font-medium">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">1. Spontaneous vs. Stimulated</h4>
                        <p className="leading-relaxed">In an <strong>LED</strong>, excited electrons drop randomly, spitting photons in all directions (Spontaneous). In a <strong>Laser</strong>, a passing photon forces an excited electron to clone itself, creating an identical twin—same color, phase, and direction (Stimulated).</p>
                    </div>
                    <div className="space-y-6 text-slate-600 font-medium">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">2. Fabry-Perot Mode Spacing</h4>
                        <p className="leading-relaxed">In a simple cavity of length $L$, only specific wavelengths satisfy the resonance condition ($m \lambda = 2 n L$).</p>
                        <MathBlock math="\Delta \lambda = \frac{\lambda^2}{2 n L}" color="border-indigo-400 bg-indigo-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">For a 300µm cavity at 1550nm, modes are typically spaced ~1nm apart.</p>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="p-10 bg-slate-900 rounded-[3rem] text-white space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="w-32 h-32" /></div>
                        <h4 className="text-2xl font-black text-indigo-400 uppercase italic relative z-10">The Gain Condition</h4>
                        <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">"For lasing to occur, the optical gain ($g$) must exceed the internal loss ($\alpha_i$) plus the mirror loss ($\alpha_m$). This is reached by increasing Injection Current past the Threshold."</p>
                        <div className="relative z-10 bg-white/10 p-4 rounded-2xl">
                            <MathInline math="g \geq \alpha_i + \frac{1}{2L} \ln \left( \frac{1}{R_1 R_2} \right)" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <LaserSourcesSimulator />
    </div>
);

/* =========================================
   6. OPTICAL MODULATORS
   ========================================= */
const MZMSimulator = () => {
    const canvasRef = useRef(null);
    const [voltage, setVoltage] = useState(0); // 0 to 180 degrees

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let frame = 0;

        const render = () => {
            frame++;
            const w = canvas.width; const h = canvas.height;
            const midY = h / 2;
            const phaseShift = (voltage / 180) * Math.PI;

            ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h);

            // Draw Waveguide (Y-junctions)
            ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 14; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(50, midY); ctx.lineTo(150, midY);
            ctx.lineTo(250, midY - 60); ctx.lineTo(550, midY - 60); ctx.lineTo(650, midY);
            ctx.moveTo(150, midY); ctx.lineTo(250, midY + 60); ctx.lineTo(550, midY + 60); ctx.lineTo(650, midY);
            ctx.lineTo(750, midY); ctx.stroke();

            // Draw Electrode (Bottom Arm)
            ctx.globalAlpha = 0.8; ctx.fillStyle = '#fef08a'; ctx.fillRect(250, midY + 40, 300, 40); ctx.globalAlpha = 1.0;
            ctx.strokeStyle = '#eab308'; ctx.lineWidth = 3; ctx.strokeRect(250, midY + 40, 300, 40);
            ctx.fillStyle = '#ca8a04'; ctx.font = 'bold 12px sans-serif'; ctx.fillText(`V = ${voltage > 0 ? '+' : ''}${voltage}V Phase Shift`, 330, midY + 95);

            // Animate Waves
            ctx.lineWidth = 4; ctx.shadowBlur = 10;

            // Input Wave (CW)
            ctx.strokeStyle = '#38bdf8'; ctx.shadowColor = '#38bdf8'; ctx.beginPath();
            for (let x = 50; x < 150; x++) { ctx.lineTo(x, midY + Math.sin((x - frame * 3) * 0.1) * 15); } ctx.stroke();

            // Top Arm (Static Phase)
            ctx.beginPath();
            for (let x = 150; x < 650; x++) {
                let yPos = midY; if (x < 250) yPos = midY - (x - 150) * 0.6; else if (x > 550) yPos = (midY - 60) + (x - 550) * 0.6; else yPos = midY - 60;
                ctx.lineTo(x, yPos + Math.sin((x - frame * 3) * 0.1) * 15);
            } ctx.stroke();

            // Bottom Arm (Phase Shift via Voltage)
            ctx.strokeStyle = '#818cf8'; ctx.shadowColor = '#818cf8'; ctx.beginPath();
            for (let x = 150; x < 650; x++) {
                let yPos = midY; if (x < 250) yPos = midY + (x - 150) * 0.6; else if (x > 550) yPos = (midY + 60) - (x - 550) * 0.6; else yPos = midY + 60;
                // Gradually apply phase shift inside the electrode region
                let localPhase = (x > 250 && x < 550) ? phaseShift * ((x - 250) / 300) : (x >= 550 ? phaseShift : 0);
                ctx.lineTo(x, yPos + Math.sin((x - frame * 3) * 0.1 - localPhase) * 15);
            } ctx.stroke();

            // Recombined Output
            // Sum of sin(A) + sin(A - phi) = 2 cos(phi/2) sin(A - phi/2)
            const outAmp = Math.cos(phaseShift / 2);
            ctx.strokeStyle = Math.abs(outAmp) < 0.2 ? '#94a3b8' : (Math.abs(outAmp) > 0.8 ? '#10b981' : '#38bdf8');
            ctx.shadowColor = ctx.strokeStyle;
            ctx.lineWidth = Math.max(1, Math.abs(outAmp) * 6);
            ctx.beginPath();
            for (let x = 650; x < 750; x++) { ctx.lineTo(x, midY + Math.sin((x - frame * 3) * 0.1 - phaseShift / 2) * (15 * outAmp)); } ctx.stroke();

            ctx.shadowBlur = 0; requestAnimationFrame(render);
        };
        const animId = requestAnimationFrame(render); return () => cancelAnimationFrame(animId);
    }, [voltage]);

    return (
        <Card className="p-10 bg-white shadow-xl border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header className="space-y-2"><Badge variant="amber">Phase Control</Badge><h4 className="text-xl font-black text-slate-800 uppercase italic border-b border-slate-100 pb-4">Interference Lab</h4></header>
                    <div className="space-y-8">
                        <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Electro-Optic Voltage</label>
                            <input type="range" min="0" max="180" value={voltage} onChange={e => setVoltage(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-amber-500 cursor-pointer" />
                            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mt-2"><span>0V (In-Phase)</span><span>Vπ (180° Shift)</span></div>
                        </div>
                        <div className={`p-8 rounded-[2.5rem] border transition-all text-center shadow-inner ${voltage > 150 ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className={`text-5xl font-black italic tracking-tighter ${voltage > 150 ? 'text-slate-400' : 'text-emerald-500'}`}>{voltage > 150 ? 'BIT 0' : 'BIT 1'}</div>
                            <div className={`text-[10px] font-black uppercase tracking-widest mt-2 ${voltage > 150 ? 'text-slate-500' : 'text-emerald-700'}`}>{voltage > 150 ? 'Dark (Destructive)' : 'Bright (Constructive)'}</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[400px] shadow-inner">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-500 uppercase tracking-widest z-10">Mach-Zehnder Waveguide</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const ModulatorsMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Pulse Creation</Badge><Badge variant="navy">Section 06</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-[0.9]">Digital <span className="text-indigo-600 block">Modulation</span></h2>
            <div className="space-y-6 max-w-4xl border-l-4 border-indigo-600 pl-8 bg-slate-50 p-6 rounded-r-3xl">
                <p className="text-slate-600 font-bold leading-relaxed text-xl">A continuous laser beam carries zero information. To send data, we must "chop" the beam billions of times per second into 1s and 0s.</p>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 bg-white border border-slate-200 rounded-[3rem] space-y-6 shadow-md">
                <h3 className="text-2xl font-black text-slate-800 uppercase italic">1. Direct Modulation</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">Flicking the laser's power source on and off. Easy and cheap, but it causes the laser to physically sputter—a phenomenon called <strong>Chirp</strong>. The shifting colors cause the pulse to blur and die over long distances due to Chromatic Dispersion.</p>
            </div>
            <div className="p-10 bg-slate-900 text-white rounded-[3rem] space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Settings2 className="w-24 h-24" /></div>
                <h3 className="text-2xl font-black text-indigo-400 uppercase italic relative z-10">2. External Modulation</h3>
                <p className="text-sm text-slate-300 font-medium leading-relaxed italic relative z-10">The laser stays ON permanently (CW Mode), keeping its color mathematically pure. A separate high-speed "shutter" (MZM or EAM) chops the beam *after* the laser. Result: Zero Chirp and ultra-stable pulse propagation for long-haul.</p>
            </div>
        </div>

        <section className="space-y-16">
            <header className="space-y-4"><Badge variant="gold">Interference Physics</Badge><h3 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">The Mach-Zehnder <span className="text-indigo-600 block">Interferometer (MZM)</span></h3></header>
            <MZMSimulator />
        </section>

        <div className="p-12 bg-white border border-slate-200 shadow-xl rounded-[3.5rem] relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <Badge variant="emerald">EAM Technology</Badge>
                    <h3 className="text-4xl font-black tracking-tighter uppercase italic text-slate-800">The Electro-Absorption <span className="text-emerald-500 block">Modulator</span></h3>
                    <p className="text-slate-600 font-medium leading-relaxed">Instead of splitting light like an MZM, an EAM acts like a dark window blind. By applying a reverse-bias voltage, the semiconductor instantly shifts its absorption band (<strong>Quantum Confined Stark Effect</strong>), "swallowing" the photons and turning a 1 into a 0.</p>
                </div>
                <Card className="bg-slate-50 border-slate-100 p-10 space-y-6 shadow-inner">
                    <h4 className="text-xs font-black uppercase text-slate-500 border-b border-slate-200 pb-4">When to use what?</h4>
                    <div className="space-y-5">
                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600 uppercase">Direct Mod</span><span className="text-xs font-black text-slate-400">&lt; 10 Gbps / Short Reach</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600 uppercase">EAM Shutter</span><span className="text-xs font-black text-emerald-500">10 - 40 Gbps / Medium</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs font-bold text-slate-600 uppercase">Mach-Zehnder</span><span className="text-xs font-black text-indigo-600">100 Gbps+ / Long Haul</span></div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
);

/* =========================================
   7. DETECTOR PHYSICS (PIN vs APD)
   ========================================= */
const PhotodiodeSimulator = () => {
    const canvasRef = useRef(null);
    const [type, setType] = useState('PIN');
    const [intensity, setIntensity] = useState(5);
    const [voltage, setVoltage] = useState(50);
    const [collected, setCollected] = useState(0);
    const counterRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        let photons = []; let electrons = []; let animationId;

        const render = () => {
            ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            const midX = canvas.width / 2; const midY = canvas.height / 2;

            // Draw Semiconductor Blocks
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#3b82f6'; ctx.fillRect(midX - 100, midY - 60, 50, 120);
            ctx.fillStyle = '#94a3b8'; ctx.fillRect(midX - 50, midY - 60, 100, 120);
            ctx.fillStyle = '#ef4444'; ctx.fillRect(midX + 50, midY - 60, 50, 120);
            ctx.globalAlpha = 1.0;

            // High Voltage Region for APD
            if (type === 'APD') {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; ctx.fillRect(midX, midY - 60, 50, 120);
            }

            ctx.fillStyle = 'white'; ctx.font = '900 12px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('P', midX - 75, midY - 75); ctx.fillText('I (DEPLETION)', midX, midY - 75); ctx.fillText('N', midX + 75, midY - 75);

            // Spawn Photons
            if (Math.random() < intensity / 20) photons.push({ x: 0, y: midY + (Math.random() - 0.5) * 80 });

            // Update Photons
            photons = photons.filter(p => {
                p.x += 5;
                ctx.fillStyle = '#fde047'; ctx.shadowBlur = 15; ctx.shadowColor = '#fde047';
                ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();

                // Collision / Absorption
                if (p.x >= midX - 50 && p.x <= midX + 50) {
                    const count = type === 'PIN' ? 1 : Math.floor(2 + (voltage / 100) * 15);
                    for (let i = 0; i < count; i++) {
                        // Fanning out effect for APD
                        electrons.push({ x: p.x, y: p.y, vx: 6 + Math.random() * 2, vy: type === 'APD' ? (Math.random() - 0.5) * 8 : 0 });
                    }
                    return false; // Photon absorbed
                }
                return p.x < canvas.width;
            });

            // Update Electrons
            electrons = electrons.filter(e => {
                e.x += e.vx; e.y += e.vy;
                ctx.fillStyle = '#38bdf8'; ctx.shadowBlur = 10; ctx.shadowColor = '#0ea5e9';
                ctx.beginPath(); ctx.arc(e.x, e.y, 3, 0, Math.PI * 2); ctx.fill();
                if (e.x >= canvas.width) { counterRef.current++; return false; }
                return true;
            });
            ctx.shadowBlur = 0; animationId = requestAnimationFrame(render);
        };
        render();
        const interval = setInterval(() => { setCollected(counterRef.current); counterRef.current = 0; }, 1000);
        return () => { cancelAnimationFrame(animationId); clearInterval(interval); };
    }, [type, intensity, voltage]);

    return (
        <Card className="p-10 bg-white shadow-xl border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">Detector Config</h4></header>
                    <div className="space-y-6">
                        <div className="flex gap-2">
                            {['PIN', 'APD'].map(m => (
                                <button key={m} onClick={() => setType(m)} className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all ${type === m ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}>{m} Diode</button>
                            ))}
                        </div>
                        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Incoming Photons</label>
                            <input type="range" min="1" max="10" value={intensity} onChange={e => setIntensity(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-yellow-400 cursor-pointer" />
                        </div>
                        {type === 'APD' && (
                            <div className="space-y-3 bg-rose-50 p-5 rounded-2xl border border-rose-100">
                                <div className="flex justify-between items-center"><label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Reverse Bias Voltage</label><span className="text-xs font-black text-rose-600">{voltage}V</span></div>
                                <input type="range" min="10" max="100" value={voltage} onChange={e => setVoltage(e.target.value)} className="w-full h-1.5 bg-rose-200 rounded-full appearance-none accent-rose-500 cursor-pointer" />
                            </div>
                        )}
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 space-y-2 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/20 blur-[30px]" />
                            <div className="text-[9px] font-black text-sky-400 uppercase tracking-widest relative z-10">Output Current</div>
                            <div className="text-4xl font-black text-white italic tracking-tighter relative z-10">{(collected * 0.1).toFixed(1)} <span className="text-xl text-slate-400">µA</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-900 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[400px]">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">P-I-N Junction Viewer</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const DetectorsMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header><div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Receiver Physics</Badge><Badge variant="navy">Section 07</Badge></div><h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-none">The <span className="text-indigo-600 block">Optical Eye</span></h2></header>

        <section className="space-y-16">
            <div className="flex justify-between items-end border-b border-slate-200 pb-12">
                <div className="space-y-4">
                    <Badge variant="indigo">Photodetection</Badge>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Photon <span className="text-indigo-600 block">Conversion</span></h3>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-medium">
                <div className="space-y-10">
                    <div className="space-y-6 text-slate-600 leading-relaxed">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">1. Responsivity ($R$)</h4>
                        <p>The efficiency of a detector is measured by how many Amperes of current it produces per Watt of incident light. This is heavily wavelength-dependent.</p>
                        <MathBlock math="R = \frac{\eta q}{h \nu} = \frac{\eta \lambda (\mu m)}{1.24}" color="border-indigo-400 bg-indigo-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Where $\eta$ is Quantum Efficiency.</p>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="space-y-6 text-slate-600 leading-relaxed">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">2. PIN vs APD Gain</h4>
                        <p>A **PIN photodiode** has no internal gain ($M=1$). An **APD (Avalanche Photodiode)** uses high reverse bias to accelerate electrons, crashing them into atoms to knock more electrons loose (Impact Ionization).</p>
                        <MathBlock math="I_{APD} = M \cdot R \cdot P_{in}" color="border-emerald-400 bg-emerald-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Typically, APD gain $M$ ranges from 10 to 100.</p>
                    </div>
                </div>
            </div>
        </section>

        <PhotodiodeSimulator />
    </div>
);

/* =========================================
   8. DETECTOR CHARACTERISTICS (Performance)
   ========================================= */
const DetectorPerformanceSimulator = () => {
    const canvasRef = useRef(null);
    const [power, setPower] = useState(25);
    const [temp, setTemp] = useState(25);
    const [material, setMaterial] = useState('InGaAs_1550');

    const materials = {
        Silicon_850: { responsivity: 0.5, maxCurrent: 40, label: 'Silicon (850nm)' },
        InGaAs_1550: { responsivity: 0.9, maxCurrent: 60, label: 'InGaAs (1550nm)' }
    };

    const config = materials[material];
    const darkCurrent = 0.5 * Math.pow(2, temp / 10); // Scaled for visual effect
    const idealCurrent = power * config.responsivity;
    const outputCurrent = config.maxCurrent * (1 - Math.exp(-idealCurrent / config.maxCurrent));
    const snr = outputCurrent / darkCurrent;

    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d');
        const draw = () => {
            const w = canvas.width; const h = canvas.height; const padding = 60;
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, w, h); // light bg

            // Axes
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2; ctx.beginPath();
            ctx.moveTo(padding, padding); ctx.lineTo(padding, h - padding); ctx.lineTo(w - padding, h - padding); ctx.stroke();

            // Labeling
            ctx.fillStyle = '#64748b'; ctx.font = '900 10px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('Optical Power (Pin) →', w / 2, h - 20);
            ctx.save(); ctx.translate(20, h / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('Output Current (mA) →', 0, 0); ctx.restore();

            // Noise Floor (Shaded Band)
            const noiseFloorY = (h - padding) - (darkCurrent * (h - 2 * padding) / 100);
            ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
            ctx.fillRect(padding, noiseFloorY, w - 2 * padding, (h - padding) - noiseFloorY);
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)'; ctx.beginPath(); ctx.moveTo(padding, noiseFloorY); ctx.lineTo(w - padding, noiseFloorY); ctx.stroke();

            // Linearity/Saturation Curve
            ctx.strokeStyle = '#4f46e5'; ctx.lineWidth = 4; ctx.beginPath();
            for (let x = 0; x <= 100; x++) {
                const p = x;
                const icr = p * config.responsivity;
                const ocr = config.maxCurrent * (1 - Math.exp(-icr / config.maxCurrent));
                const plotX = padding + (x * (w - 2 * padding) / 100);
                const plotY = (h - padding) - (ocr * (h - 2 * padding) / 100);
                if (x === 0) ctx.moveTo(plotX, plotY); else ctx.lineTo(plotX, plotY);
            }
            ctx.stroke();

            // Current Power Marker
            const markerX = padding + (power * (w - 2 * padding) / 100);
            const markerY = (h - padding) - (outputCurrent * (h - 2 * padding) / 100);

            ctx.setLineDash([5, 5]); ctx.strokeStyle = '#94a3b8'; ctx.beginPath(); ctx.moveTo(markerX, padding); ctx.lineTo(markerX, h - padding); ctx.stroke(); ctx.setLineDash([]);

            ctx.fillStyle = snr < 1.5 ? '#f43f5e' : '#4f46e5'; ctx.beginPath(); ctx.arc(markerX, markerY, 8, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'white'; ctx.lineWidth = 3; ctx.stroke();
        };
        draw();
    }, [power, temp, material, darkCurrent, outputCurrent, config, snr]);

    return (
        <Card className="p-10 bg-white shadow-2xl border-slate-200">
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3 space-y-8">
                    <header><h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 border-b border-slate-100 pb-4">Lab Dashboard</h4></header>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Detector Material</label>
                            <select value={material} onChange={e => setMaterial(e.target.value)} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-800 outline-none">
                                {Object.keys(materials).map(k => <option key={k} value={k}>{materials[k].label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center"><label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Optical Power</label><span className="text-xs font-black text-indigo-600">{power} mW</span></div>
                            <input type="range" min="0" max="100" value={power} onChange={e => setPower(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-full appearance-none accent-indigo-600 cursor-pointer" />
                        </div>
                        <div className="space-y-3 bg-rose-50 p-5 rounded-2xl border border-rose-100">
                            <div className="flex justify-between items-center"><label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Temperature</label><span className="text-xs font-black text-rose-600">{temp} °C</span></div>
                            <input type="range" min="0" max="100" value={temp} onChange={e => setTemp(e.target.value)} className="w-full h-1.5 bg-rose-200 rounded-full appearance-none accent-rose-500 cursor-pointer" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div className="p-4 bg-white border border-slate-200 rounded-2xl text-center shadow-sm">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Responsivity</span>
                                <span className="block text-xl font-black text-slate-800 mt-1">{config.responsivity} A/W</span>
                            </div>
                            <div className={`p-4 rounded-2xl text-center shadow-sm border ${snr < 1.5 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
                                <span className={`text-[9px] font-black uppercase ${snr < 1.5 ? 'text-rose-500' : 'text-slate-400'}`}>SNR</span>
                                <span className={`block text-xl font-black mt-1 ${snr < 1.5 ? 'text-rose-600' : 'text-emerald-500'}`}>{snr.toFixed(1)} {snr < 1.5 && 'LOST'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-[3.5rem] border-[12px] border-slate-200 overflow-hidden relative min-h-[400px] shadow-inner">
                    <div className="absolute top-6 left-8 text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">Linearity & Saturation Curve</div>
                    <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
                </div>
            </div>
        </Card>
    );
};

const PerformanceMasterclass = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
        <header className="mb-20">
            <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Detector Dynamics</Badge><Badge variant="navy">Section 08</Badge></div>
            <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-none">Detector <span className="text-rose-600 block">Performance</span></h2>
            <p className="text-slate-600 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-rose-600 pl-8 bg-rose-50 p-6 rounded-r-3xl">Not every detector is created equal. Every "Eye" in a network is graded on its sensitivity, noise floor, and when it will eventually go blind from over-saturation.</p>
        </header>

        <section className="space-y-16">
            <div className="flex justify-between items-end border-b border-slate-200 pb-12">
                <div className="space-y-4">
                    <Badge variant="rose">Noise & Limits</Badge>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-[0.9]">Sensitivity <span className="text-rose-600 block">Metrics</span></h3>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-medium">
                <div className="space-y-10">
                    <div className="space-y-6 text-slate-600 leading-relaxed">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">1. Dark Current ($I_d$)</h4>
                        <p>Even in total darkness, thermal energy knocks electrons loose in the semiconductor. This "Dark Current" creates a baseline noise floor that doubles approximately every 10°C.</p>
                        <MathBlock math="I_d(T) \approx I_{d0} \cdot 2^{(T-T_0)/10}" color="border-rose-400 bg-rose-50" />
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="space-y-6 text-slate-600 leading-relaxed">
                        <h4 className="text-xl font-black text-slate-800 uppercase italic">2. Noise Equivalent Power (NEP)</h4>
                        <p>NEP defines the minimum optical power required to produce a signal-to-noise ratio of 1. It is the absolute limit of the detector's sensitivity.</p>
                        <MathBlock math="NEP = \frac{\sqrt{\langle i_n^2 \rangle}}{R}" color="border-slate-300 bg-slate-50" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Where <MathInline math="\sqrt{\langle i_n^2 \rangle}" /> is the RMS noise current.</p>
                    </div>
                </div>
            </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { title: 'Quantum Eff.', sym: 'η', desc: 'Ratio of generated electrons to incoming photons. Real PINs are 70-90% efficient.' },
                { title: 'Responsivity', sym: 'R', desc: 'The Amps per Watt conversion rate. Changes drastically with wavelength.' },
                { title: 'Dark Current', sym: 'Id', desc: 'False signal caused by thermal heat. Micro-current flowing in total darkness.' },
                { title: 'NEP', sym: 'Floor', desc: 'The absolute minimum light needed for a computer to "hear" signal over noise.' }
            ].map((s, i) => (
                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-200 hover:shadow-xl transition-shadow">
                    <div className="text-rose-600 font-black text-sm mb-4 bg-rose-50 inline-block px-3 py-1 rounded-lg border border-rose-100">{s.sym}</div>
                    <h4 className="text-xl font-bold text-slate-800 mb-4 tracking-tighter leading-none">{s.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{s.desc}</p>
                </div>
            ))}
        </div>

        <section className="p-16 bg-slate-900 rounded-[4rem] text-white overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/20 blur-[80px]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="space-y-10">
                    <Badge variant="gold">Saturation Analogy</Badge>
                    <h3 className="text-5xl font-black tracking-tighter uppercase italic leading-none">The <span className="text-rose-400">Rain Bucket</span></h3>
                    <p className="text-lg text-slate-300 font-medium leading-relaxed italic border-l-4 border-rose-400 pl-8">"Dark current is like a leaky garden hose at the bottom of the bucket. If the rain (light) is lighter than the leak, you can't measure it. If a hurricane hits, the bucket overflows and the meter goes blind (Saturation)."</p>
                </div>
                <div className="space-y-8">
                    <div className="p-8 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md">
                        <MathInline math="I_{out} = I_{max} \cdot (1 - e^{-RP/I_{max}})" />
                    </div>
                    <p className="text-[10px] font-black text-rose-300 uppercase tracking-widest text-center">Saturation Asymptotic Function</p>
                </div>
            </div>
        </section>

        <DetectorPerformanceSimulator />
    </div>
);

/* =========================================
   9. ADVANCED PROBLEM SOLVER
   ========================================= */
const ProblemSolver = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32">
            <header className="mb-20">
                <div className="flex items-center gap-3 mb-6"><Badge variant="gold">System Assessment</Badge><Badge variant="navy">Section 09</Badge></div>
                <h2 className="text-6xl font-black text-slate-800 tracking-tighter mb-8 uppercase italic leading-[0.9]">Expert <span className="text-yellow-600 block">Assessment</span></h2>
                <p className="text-slate-600 font-bold leading-relaxed text-xl max-w-4xl border-l-4 border-yellow-500 pl-8 bg-amber-50 p-6 rounded-r-3xl">Test your engineering intuition on the fundamental physics of link components. These challenges require combining knowledge from alignment, emission, routing, and detection.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                    {
                        id: 'Prob 01',
                        title: 'The Lateral Crisis',
                        desc: 'Calculate the dB loss for two SMFs (ω₀ = 5 µm) offset by 2 µm. If the power budget only allows for 0.5 dB of joint loss, is this connection viable?',
                        color: 'rose',
                        steps: [
                            'L = 4.34 * (d / ω₀)²',
                            'L = 4.34 * (2 / 5)² = 4.34 * 0.16',
                            'L ≈ 0.69 dB'
                        ],
                        result: 'FAILED. Loss (0.69dB) exceeds 0.5dB limit.'
                    },
                    {
                        id: 'Prob 02',
                        title: 'Fresnel Return Loss',
                        desc: 'A connector leaves a small air gap between two SMFs (n=1.46). Calculate the Optical Return Loss (ORL) at this single interface.',
                        color: 'indigo',
                        steps: [
                            'R = ((n₁ - n₀) / (n₁ + n₀))²',
                            'R = ((1.46 - 1) / (1.46 + 1))² = (0.46 / 2.46)²',
                            'R ≈ 0.035 (3.5% reflected)',
                            'ORL = -10 * log₁₀(R) = -10 * log₁₀(0.035)'
                        ],
                        result: 'ORL ≈ 14.5 dB'
                    },
                    {
                        id: 'Prob 03',
                        title: 'Star Coupler Loss',
                        desc: 'A 1x4 star coupler has an excess loss of 1 dB. What is the total insertion loss per port?',
                        color: 'sky',
                        steps: [
                            'Splitting Loss = 10 * log₁₀(N)',
                            'Splitting Loss = 10 * log₁₀(4) ≈ 6.0 dB',
                            'Total Insertion Loss = Splitting Loss + Excess Loss',
                            'Total Loss = 6.0 + 1.0'
                        ],
                        result: 'Total Loss = 7.0 dB per port'
                    },
                    {
                        id: 'Prob 04',
                        title: 'APD Gain Budget',
                        desc: 'A detector with R=0.9 A/W receives -30 dBm (1 µW) of power. If the noise floor requires 50 µA for a clear signal, what minimum APD gain M is needed?',
                        color: 'emerald',
                        steps: [
                            'Target Current = 50 µA',
                            'Base Current = R * P = 0.9 A/W * 1 µW = 0.9 µA',
                            'Required Gain M = Target / Base',
                            'M = 50 / 0.9 ≈ 55.5'
                        ],
                        result: 'Gain M ≥ 56 required.'
                    }
                ].map((prob, i) => (
                    <Card key={i} className="p-12 border border-slate-200 hover:shadow-2xl transition-all space-y-8 bg-white">
                        <Badge variant={prob.color}>{prob.id}</Badge>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic">{prob.title}</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">{prob.desc}</p>
                        <details className="group">
                            <summary className="list-none cursor-pointer flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-6 py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-slate-100 transition-colors">
                                <ChevronRight className="w-4 h-4 group-open:rotate-90 transition-transform" /> Reveal Analytical Solution
                            </summary>
                            <div className="mt-6 p-8 bg-slate-900 text-white rounded-3xl font-mono text-xs space-y-4 shadow-inner">
                                <div className={`text-${prob.color}-400 font-black tracking-widest mb-4`}>// DEEP ANALYSIS</div>
                                {prob.steps.map((step, si) => <p key={si} className="text-slate-300 border-l-2 border-white/10 pl-4">{step}</p>)}
                                <p className={`text-${prob.color}-400 font-black mt-6 pt-4 border-t border-white/10`}>RESULT: {prob.result}</p>
                            </div>
                        </details>
                    </Card>
                ))}
            </div>

            <section className="p-16 bg-slate-900 rounded-[4rem] text-white overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 p-12 opacity-10"><PenTool className="w-32 h-32" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="space-y-8">
                        <Badge variant="gold">Final Design Challenge</Badge>
                        <h4 className="text-4xl font-black uppercase italic tracking-tighter">The "Cold" <span className="text-yellow-500 block">Link Problem</span></h4>
                        <p className="text-slate-300 font-medium leading-relaxed italic">"Dark current $I_d$ in an APD doubles every 10°C. If a system operates at 50°C and SNR is currently 10, what happens at 20°C?"</p>
                    </div>
                    <div className="p-10 bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md space-y-4 font-mono text-xs">
                        <div className="text-indigo-300">Temp Drop = 30°C (3 half-steps)</div>
                        <div className="text-indigo-300">New Dark Current = Original / $2^3$ = 1/8th</div>
                        <div className="text-emerald-400 font-black text-2xl mt-4">NEW SNR ≈ 80</div>
                        <p className="text-slate-400 italic mt-6 border-t border-white/10 pt-4">"Colder electronics are significantly more sensitive due to massive thermal noise reduction."</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

/* =========================================
   MODULE 3 HUB
   ========================================= */
export default function Module3Active({ onBack }) {
    const [activeSection, setActiveSection] = useState('alignment');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const sections = [
        { id: 'alignment', title: '1. Fiber Alignment', icon: <Share2 className="w-4 h-4" /> },
        { id: 'splicing', title: '2. Fusion Splicing', icon: <Zap className="w-4 h-4" /> },
        { id: 'connectors', title: '3. Connectors & Polish', icon: <Settings2 className="w-4 h-4" /> },
        { id: 'passives', title: '4. Passives & Routing', icon: <GitMerge className="w-4 h-4" /> },
        { id: 'sources', title: '5. Active Emission', icon: <Lightbulb className="w-4 h-4" /> },
        { id: 'modulators', title: '6. Optical Modulators', icon: <Waves className="w-4 h-4" /> },
        { id: 'detectors', title: '7. Receiver Physics', icon: <Cpu className="w-4 h-4" /> },
        { id: 'perf', title: '8. Detector Metrics', icon: <Activity className="w-4 h-4" /> },
        { id: 'quiz', title: '9. Problem Solver', icon: <PenTool className="w-4 h-4" /> },
    ];

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
            <nav className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 lg:w-96 h-full bg-slate-900 flex flex-col z-50 transition-transform duration-500 ease-in-out shadow-2xl`}>
                <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
                    <button onClick={onBack} className="group flex items-center gap-4 text-slate-400 hover:text-white transition-all mb-16 w-full">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-indigo-600 transition-all shadow-md text-white"><ArrowLeft className="w-5 h-5" /></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Portal Core</span>
                    </button>

                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 px-4 opacity-70">Unit 03: Link Components</div>
                    <div className="space-y-3">
                        {sections.map(s => (
                            <button key={s.id} onClick={() => { setActiveSection(s.id); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-5 px-6 py-4 rounded-2xl transition-all duration-300 text-left group relative ${activeSection === s.id ? 'bg-white text-slate-900 shadow-xl scale-[1.02] z-10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                <span className={`${activeSection === s.id ? 'text-indigo-600' : 'group-hover:text-slate-300'} shrink-0`}>{s.icon}</span>
                                <span className="font-black text-[11px] tracking-tight uppercase flex-1">{s.title}</span>
                                {activeSection === s.id && <div className="absolute right-6 w-2 h-2 rounded-full bg-indigo-600 animate-pulse shadow-[0_0_10px_rgba(79,70,229,0.5)]" />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10 p-10">
                    <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20"><Activity className="w-6 h-6 text-white" /></div>
                        <div>
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Module 03</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Active Hardware</div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50">
                <div className="md:hidden flex items-center justify-between p-6 bg-slate-900 text-white z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2"><Menu className="w-6 h-6" /></button>
                    <span className="font-black text-[10px] tracking-widest uppercase text-indigo-400">Link Components</span>
                    <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-12 md:px-20 md:py-24 scroll-smooth">
                    <div className="max-w-5xl mx-auto pb-48">
                        {activeSection === 'alignment' && <AlignmentMasterclass />}
                        {activeSection === 'splicing' && <SplicingMasterclass />}
                        {activeSection === 'connectors' && <ConnectorsMasterclass />}
                        {activeSection === 'passives' && <PassivesMasterclass />}
                        {activeSection === 'sources' && <SourcesView />}
                        {activeSection === 'modulators' && <ModulatorsMasterclass />}
                        {activeSection === 'detectors' && <DetectorsMasterclass />}
                        {activeSection === 'perf' && <PerformanceMasterclass />}
                        {activeSection === 'quiz' && <ProblemSolver />}
                    </div>
                </div>
                <div className="absolute -bottom-20 -right-20 text-slate-200 font-black text-[20rem] pointer-events-none select-none -z-10 tracking-tighter opacity-30 uppercase">Link</div>
            </main>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-500" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
}