import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Maximize, Activity, ChevronRight, Zap, Target, BookOpen, PenTool, ArrowLeft, Menu, Info } from 'lucide-react';
import { MathBlock, MathInline, EquationCheatSheet } from '../MathBlock';

/* =========================================
   SHARED HELPERS
   ========================================= */

/** Glassmorphic card wrapper */
/** Sharp Corporate Card */
const Card = ({ children, className = '' }) => (
  <div className={`glass-card rounded-[2rem] hover:bg-white/60 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

/** Section badge — Updated for Corporate Lab */
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
   1. TIR SIMULATOR
   ========================================= */
const TirSimulator = () => {
  const [n1, setN1] = useState(1.48);
  const [n2, setN2] = useState(1.46);
  const [incidentAngle, setIncidentAngle] = useState(12);

  const n0 = 1.0;
  const criticalAngleRad = Math.asin(Math.min(n2 / n1, 1));
  const criticalAngleDeg = (criticalAngleRad * 180) / Math.PI;
  const naSq = n1 * n1 - n2 * n2;
  const NA = naSq > 0 ? Math.sqrt(naSq) : 0;
  const acceptanceAngleDeg = NA <= n0 ? (Math.asin(NA / n0) * 180) / Math.PI : 90;

  const angleAirRad = (incidentAngle * Math.PI) / 180;
  const sinCore = (n0 * Math.sin(angleAirRad)) / n1;
  const angleCoreRad = Math.asin(Math.min(sinCore, 1));
  const phiRad = Math.PI / 2 - angleCoreRad;
  const isTIR = phiRad >= criticalAngleRad;
  const isGuided = incidentAngle <= acceptanceAngleDeg;

  // SVG ray geometry
  const entryX = 150, entryY = 150;
  const dx = angleCoreRad > 0.001 ? 50 / Math.tan(angleCoreRad) : 400;
  const safeYOffset = Math.min(130 * Math.tan(angleAirRad), 130);
  const startY = entryY + safeYOffset;
  const firstHitX = Math.min(entryX + Math.abs(dx), 595);
  const hitY = 100; // always hits upper interface first

  const getRayPath = () => {
    const init = `M 20,${startY} L ${entryX},${entryY} L ${firstHitX},${hitY}`;
    if (incidentAngle === 0) return { d: `M 20,150 L 595,150`, stroke: '#3b82f6' };
    if (isTIR) {
      const b1X = Math.min(firstHitX + Math.abs(dx) * 2, 595);
      const b2X = Math.min(b1X + Math.abs(dx) * 2, 595);
      return { d: `${init} L ${b1X},200 L ${b2X},${hitY}`, stroke: '#2563eb' };
    } else {
      return {
        d: null,
        escaped: { init, fx: firstHitX, fy: hitY },
        stroke: '#3b82f6',
        escape: '#ef4444'
      };
    }
  };

  const ray = getRayPath();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="indigo">Laboratory 01</Badge>
          <Badge variant={isTIR ? 'emerald' : 'red'}>{isTIR ? '● Total Internal Reflection' : '○ Fresnel Radiation'}</Badge>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mb-6">Ray Theory & <span className="text-indigo-600">Guidance</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          Analyzing the transition from simple geometric optics to waveguiding principles.
          Adjust refractive indices to visualize the <span className="text-navy font-bold">Acceptance Cone</span> and <span className="text-navy font-bold">TIR boundaries</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* SVG Visualization */}
        <Card className="xl:col-span-2 p-8 border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ray Propagation Model (Meridional)</h3>
            <div className="flex gap-2 text-[10px] font-black text-navy uppercase">
               <span className={isTIR ? "text-emerald-600" : "text-red-500"}>{isTIR ? "TIR ACTIVE" : "LEAKY MODE"}</span>
            </div>
          </div>
          <div className="w-full rounded-xl overflow-hidden border border-white/20 glass-card shadow-inner">
            <svg viewBox="0 0 600 300" className="w-full h-auto block" style={{ background: 'transparent' }}>
              <rect x="0" y="0" width="600" height="300" fill="transparent" />
              <rect x="150" y="0" width="450" height="100" fill="#f0f9ff" />
              <rect x="150" y="100" width="450" height="100" fill="#ffffff" />
              <rect x="150" y="200" width="450" height="100" fill="#f0f9ff" />

              <line x1="150" y1="100" x2="600" y2="100" stroke="#bae6fd" strokeWidth="2" strokeDasharray="12 4" />
              <line x1="150" y1="200" x2="600" y2="200" stroke="#bae6fd" strokeWidth="2" strokeDasharray="12 4" />
              <line x1="150" y1="0" x2="150" y2="300" stroke="#cbd5e1" strokeWidth="3" />
              
              <text x="375" y="50" fill="#0369a1" fontSize="10" fontWeight="800" textAnchor="middle" className="uppercase tracking-widest opacity-60">Cladding (n₂)</text>
              <text x="375" y="155" fill="#1e293b" fontSize="12" fontWeight="900" textAnchor="middle" className="uppercase tracking-[0.2em] opacity-80">Core (n₁)</text>
              <text x="375" y="250" fill="#0369a1" fontSize="10" fontWeight="800" textAnchor="middle" className="uppercase tracking-widest opacity-60">Cladding (n₂)</text>
              <text x="75" y="148" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">AIR</text>
              <text x="75" y="160" fill="#64748b" fontSize="10" textAnchor="middle">(n₀=1)</text>

              {ray.d ? (
                <path d={ray.d} fill="none" stroke={ray.stroke} strokeWidth="3" strokeLinecap="round" />
              ) : ray.escaped ? (
                <g>
                   <path d={ray.escaped.init} fill="none" stroke={ray.stroke} strokeWidth="3" strokeLinecap="round" />
                   <line x1={ray.escaped.fx} y1={ray.escaped.fy}
                    x2={Math.min(ray.escaped.fx + 50, 590)} y2={Math.max(ray.escaped.fy - 80, 5)}
                    stroke="#ef4444" strokeWidth="3" strokeDasharray="5 3" strokeLinecap="round" />
                </g>
              ) : null}

              <path d={`M ${entryX + 30},${hitY} A 30,30 0 0,0 ${entryX + 30},${hitY + 30}`}
                fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.7" />
              <text x={entryX + 45} y={hitY + 20} fill="#f59e0b" fontSize="8" fontWeight="bold">φ_c</text>
            </svg>
          </div>
        </Card>

        {/* Controls & readouts */}
        <Card className="p-8 flex flex-col gap-6 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Optic Parameters</h3>

          <div className="space-y-6">
            {[
              { label: 'Core Index (n₁)', value: n1, min: 1.42, max: 1.6, step: 0.001, set: setN1, color: 'accent-navy', display: 'text-navy' },
              { label: 'Clad Index (n₂)', value: n2, min: 1.35, max: n1 - 0.001, step: 0.001, set: setN2, color: 'accent-indigo-500', display: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl p-5 border border-white/20 hover:bg-white/60 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</label>
                  <span className={`font-mono text-sm font-black ${s.display}`}>{s.value.toFixed(3)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(parseFloat(e.target.value))}
                  className={`w-full h-1.5 rounded-full ${s.color} cursor-pointer shadow-inner`} />
              </div>
            ))}

            <div className="glass-card rounded-xl p-5 border border-white/20 hover:bg-white/60 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Angle (θ)</label>
                <span className="font-mono text-sm font-black text-amber-600">{incidentAngle}°</span>
              </div>
              <input type="range" min="0" max="45" step="0.5" value={incidentAngle}
                onChange={e => setIncidentAngle(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full accent-amber-500 cursor-pointer" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-auto">
            <div className="p-5 glass-navy text-white rounded-xl shadow-lg relative overflow-hidden border-none text-center">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10" />
              <div className="text-[10px] font-black text-blue-300 uppercase mb-1 tracking-widest opacity-80">Numerical Aperture</div>
              <div className="text-3xl font-black tracking-tighter">NA = {NA.toFixed(4)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 glass-card border border-white/20 rounded-xl">
                 <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Crit Angle</div>
                 <div className="text-xl font-black text-navy">{criticalAngleDeg.toFixed(1)}°</div>
               </div>
               <div className="p-4 glass-card border border-white/20 rounded-xl">
                 <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Accept Cone</div>
                 <div className="text-xl font-black text-navy">±{acceptanceAngleDeg.toFixed(1)}°</div>
               </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-8 border-indigo-100">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Target className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-navy tracking-tight">Skew Rays vs. Meridional</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Advanced Ray Trajectory</p>
               </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Unlike <span className="font-bold text-navy">Meridional rays</span> that pass through the core axis, 
              <span className="font-bold text-indigo-600"> Skew rays</span> follow a helical path, never crossing the exact center. 
              This geometry increases the effective light-gathering capacity.
            </p>
            <MathBlock math="NA_{\text{skew}} \cos \gamma = (n_1^2 - n_2^2)^{1/2} = NA" label="Skew Ray Acceptance Condition" color="border-indigo-200" />
            <div className="p-4 glass-card border border-indigo-200/20 rounded-xl">
               <p className="text-[11px] text-indigo-700 leading-relaxed italic font-black">
                 "Skew rays dominate in multimode fibers and account for significant power transmission even when meridional rays are restricted."
               </p>
            </div>
         </Card>

         <Card className="p-8 border-slate-200">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white shadow-lg">
                  <BookOpen className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-navy tracking-tight">Boundary Theory</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Guidance Mechanics</p>
               </div>
            </div>
            <div className="space-y-4">
               <div className="p-4 glass-card border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/60 transition-all">
                  <div>
                    <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-1">Snell's Law</h4>
                    <p className="text-[11px] text-slate-600 font-bold">n₀ sin θ₀ = n₁ sin θ₁</p>
                  </div>
                  <div className="text-[10px] font-black text-indigo-600">REFRACTION</div>
               </div>
               <div className="p-4 glass-card border border-white/10 rounded-xl flex items-center justify-between hover:bg-white/60 transition-all">
                  <div>
                    <h4 className="text-xs font-black text-navy uppercase tracking-widest mb-1">Critical Angle</h4>
                    <p className="text-[11px] text-slate-600 font-bold">sin φ_c = n₂/n₁</p>
                  </div>
                  <div className="text-[10px] font-black text-emerald-600 font-mono">TIR THRESHOLD</div>
               </div>
               <div className="p-4 bg-amber-500/10 border border-amber-200/20 backdrop-blur-md rounded-xl">
                  <p className="text-[11px] text-amber-700 leading-relaxed font-black">
                    Guidance only occurs if the ray enters within the <strong>Acceptance Cone</strong> defined by the Numerical Aperture.
                  </p>
               </div>
            </div>
         </Card>
      </div>

      <EquationCheatSheet title="Ray Theory & Skew Optics — Summary" equations={[
        { name: "Snell's Law", math: "n_0 \\sin\\theta_0 = n_1 \\sin\\theta_1", color: 'text-indigo-600', description: "Describes the angular transition of light across the air-fiber interface. Foundation for all ray tracing." },
        { name: "Numerical Aperture", math: "NA = \\sqrt{n_1^2 - n_2^2}", color: 'text-blue-600', description: "Defines the sine of the maximum acceptance angle. A higher NA implies easier light injection but more multi-path delay." },
        { name: "Skew Ray Correction", math: "NA \\cos \\gamma = (n_1^2 - n_2^2)^{1/2}", color: 'text-purple-600', description: "Page 6 Ref: Skew rays travel helical paths and can be guided even if entering at angles that would fail meridional criteria." },
        { name: "Critical Angle (φ_c)", math: "\\sin\\varphi_c = \\dfrac{n_2}{n_1}", color: 'text-emerald-600', description: "The minimum angle from the normal required to sustain Total Internal Reflection (TIR) at the core-cladding boundary." },
      ]} />
    </div>
  );
};

/* =========================================
   2. FIBER STRUCTURES & ALPHA-PROFILES
   ========================================= */
const FiberAnatomy = () => {
  const [alpha, setAlpha] = useState(2);

  const getCurvePoints = useCallback(() => {
    const pts = [];
    for (let x = -100; x <= 100; x += 4) {
      const r = Math.abs(x) / 100;
      const n = 160 - 100 * (1 - Math.pow(r, Math.min(alpha, 9)));
      pts.push(`${200 + x},${n}`);
    }
    return pts.join(' L ');
  }, [alpha]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="indigo">Structure Analysis</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Index <span className="text-indigo-600">Profiles</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          The <span className="text-navy font-bold">Refractive Index Profile n(r)</span> determines the modal path. 
          Parabolic profiles (α=2) specifically neutralize intermodal dispersion by equalizing optical path lengths.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="p-8 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
            Radial Index Distribution Node
          </h3>
          <div className="rounded-xl overflow-hidden border border-white/20 glass-card mb-8 shadow-inner">
            <svg viewBox="0 0 400 200" className="w-full h-auto block" style={{ background: 'transparent' }}>
              <rect x="0" y="0" width="400" height="200" fill="transparent" />
              {/* Axes */}
              <line x1="200" y1="20" x2="200" y2="175" stroke="#e2e8f0" strokeWidth="2" />
              <line x1="40" y1="160" x2="360" y2="160" stroke="#e2e8f0" strokeWidth="2" />
              
              {/* Profile Curve */}
              <path d={`M 100,160 L 100,120 L ${getCurvePoints()} L 300,120 L 300,160`}
                fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                className="transition-all duration-500" />
              
              <text x="210" y="24" fill="#64748b" fontSize="9" fontWeight="900" className="uppercase tracking-widest">n(r)</text>
              <text x="350" y="155" fill="#64748b" fontSize="9" fontWeight="900" className="uppercase tracking-widest">Radius</text>
              
              <text x="200" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                PROFILED VALUE α = {alpha >= 9 ? '∞ (Step)' : alpha.toFixed(2)}
              </text>
            </svg>
          </div>
          <div className="glass-card border border-white/20 rounded-2xl p-6 transition-all hover:bg-white/60">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-navy uppercase tracking-[0.2em]">Profile Parameter (α)</label>
              <span className="font-mono text-sm font-black text-indigo-600 px-3 py-1 glass-card rounded-lg shadow-sm">{alpha >= 9 ? '∞' : alpha.toFixed(1)}</span>
            </div>
            <input type="range" min="1" max="10" step="0.1" value={alpha}
              onChange={e => setAlpha(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full accent-indigo-600 cursor-pointer shadow-inner" />
            <div className="flex justify-between text-[8px] text-slate-400 mt-4 font-black uppercase tracking-widest">
              <span>Triangular</span><span>Parabolic</span><span>Step Index</span>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-8 border-indigo-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-black text-navy tracking-tight">Profile Math Node</h3>
            </div>
            <MathBlock math="n(r) = n_1\left[1 - 2\Delta\left(\frac{r}{a}\right)^{\!\alpha}\right]^{\!1/2}" label="General Power-Law Solution" color="border-indigo-100" />
            <p className="text-sm text-slate-600 leading-relaxed mt-6 font-medium">
              Standard silica fibers use <span className="text-navy font-bold">α = 2</span> (parabolic) to minimize intermodal dispersion. 
              The refractive index decreases from core center to cladding interface.
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 glass-card border border-white/10 rounded-2xl hover:bg-white/60 transition-all">
               <h4 className="text-[10px] font-black text-navy uppercase mb-2 tracking-widest">Step-Index</h4>
               <p className="text-[11px] text-slate-500 leading-relaxed font-black">High dispersion. Constant n in core. Preferred for SMF.</p>
            </div>
            <div className="p-6 bg-indigo-500/10 border border-indigo-200/20 backdrop-blur-md rounded-2xl">
               <h4 className="text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest">Graded-Index</h4>
               <p className="text-[11px] text-indigo-700 leading-relaxed font-black">Low dispersion. Variable n (sinusoidal rays). Ideal for high-speed MMF.</p>
            </div>
          </div>
        </div>
      </div>

      <EquationCheatSheet title="Fiber Structures — Reference" equations={[
        { name: 'Alpha-Profile Formula', math: 'n(r) = n_1\\left[1 - 2\\Delta\\left(\\frac{r}{a}\\right)^{\\!\\alpha}\\right]^{\\!1/2}', color: 'text-indigo-600', description: 'Defines the radial index distribution. α=1 is triangular, α=2 is parabolic (dispersion-optimized), and α=∞ is step-index.' },
        { name: 'Relative Index Difference', math: '\\Delta = \\dfrac{n_1 - n_2}{n_1} \\approx \\dfrac{n_1^2 - n_2^2}{2n_1^2}', color: 'text-blue-600', description: 'A unitless measure of the optical contrast. typical Δ is 0.003 (0.3%) for SMF.' },
        { name: 'Index Contrast Ratio', math: 'n_2 = n_1(1-2\\Delta)^{1/2}', color: 'text-emerald-600', description: 'Exact relationship between n₁ and n₂ via the contrast parameter Δ.' },
      ]} />
    </div>
  );
};

/* =========================================
   3. MODE THEORY (LP modes)
   ========================================= */
const ModeTheory = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="indigo">Electromagnetic Theory</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Weakly <span className="text-indigo-600">Guiding</span> Case</h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          For fibers with Δ ≪ 1, Maxwell's equations simplify to scalar wave solutions. 
          This defines the <span className="text-navy font-black">Linearly Polarized (LP)</span> mode regime.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
            LP Mode Hierarchy Node
          </h3>
          <div className="space-y-4">
             <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <h4 className="text-lg font-black text-navy">Fundamental LP₀₁</h4>
                   <span className="px-3 py-1 bg-white rounded-full text-[9px] font-black text-indigo-600 shadow-sm border border-indigo-100 uppercase tracking-widest">No Cutoff</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Equivalent to the exact <span className="font-bold text-navy">HE₁₁</span> mode. It has no cutoff wavelength and is the foundation of Single-Mode Fiber (SMF).
                </p>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-600/40 flex items-center justify-center font-black text-[10px] text-indigo-600">SMF</div>
                </div>
             </div>

             <div className="p-5 glass-card border border-white/20 rounded-2xl hover:bg-white/60 transition-all">
                <div className="flex items-center justify-between mb-2">
                   <h4 className="text-lg font-black text-slate-400 uppercase tracking-tight">Higher Order Modes</h4>
                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">LP₁₁, LP₂₁, ...</span>
                </div>
                <p className="text-xs text-slate-500 italic font-bold">
                  Propagate only when the V-parameter exceeds specific eigenvalue thresholds (e.g., V &gt; 2.405).
                </p>
             </div>
          </div>
        </Card>

        <Card className="p-8 border-indigo-100">
          <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-8 border-b border-indigo-50 pb-4">
            Exact to LP Mode Mapping
          </h3>
          <div className="overflow-hidden rounded-xl border border-white/20 glass-card shadow-inner">
             <table className="w-full text-left border-collapse">
                <thead className="bg-white/10 border-b border-white/10 backdrop-blur-md">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-navy uppercase tracking-widest">LP Mode</th>
                      <th className="px-6 py-4 text-[10px] font-black text-navy uppercase tracking-widest">Exact Modes</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs font-bold">
                   <tr className="hover:bg-white/20 transition-colors">
                      <td className="px-6 py-4 text-indigo-600 font-black tracking-tight">LP₀₁</td>
                      <td className="px-6 py-4 text-slate-600 italic">HE₁₁</td>
                   </tr>
                   <tr className="hover:bg-white/20 transition-colors">
                      <td className="px-6 py-4 text-indigo-600 font-black tracking-tight">LP₁₁</td>
                      <td className="px-6 py-4 text-slate-600 italic">TE₀₁, TM₀₁, HE₂₁</td>
                   </tr>
                   <tr className="hover:bg-white/20 transition-colors">
                      <td className="px-6 py-4 text-indigo-600 font-black tracking-tight">LP₂₁</td>
                      <td className="px-6 py-4 text-slate-600 italic">EH₁₁, HE₃₁</td>
                   </tr>
                </tbody>
             </table>
          </div>
          <p className="text-[10px] text-slate-400 mt-6 leading-relaxed font-bold uppercase tracking-widest text-center">
            Ref: Lecture Notes Page 19 • Mode Degeneracy Node
          </p>
        </Card>
      </div>

      <Card className="p-8 border-slate-200">
        <h3 className="text-xl font-black text-navy mb-8 tracking-tight">Scalar Wave Eigenvalues</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <MathBlock math="U\frac{J_{m\pm1}(U)}{J_m(U)} = \mp W\frac{K_{m\pm1}(W)}{K_m(W)}" label="Characteristic Scalar Equation" color="border-indigo-100" />
          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
             <p>Solving this transcendental equation yields the <span className="font-bold text-navy">Propagation Constant (β)</span> for each allowed mode.</p>
             <div className="flex items-start gap-4 p-4 glass-card border border-white/20 rounded-xl hover:bg-white/60 transition-all">
                <div className="shrink-0 w-8 h-8 rounded-lg glass-navy flex items-center justify-center font-black text-indigo-300 text-xs shadow-sm border-none">U</div>
                <p className="text-[11px] text-navy font-black uppercase tracking-wider mt-1">Transverse Wavenumber in Core</p>
             </div>
             <div className="flex items-start gap-4 p-4 glass-card border border-white/20 rounded-xl hover:bg-white/60 transition-all">
                <div className="shrink-0 w-8 h-8 rounded-lg glass-navy flex items-center justify-center font-black text-slate-400 text-xs shadow-sm border-none">W</div>
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-wider mt-1">Decay Constant in Cladding</p>
             </div>
          </div>
        </div>
      </Card>

      <EquationCheatSheet title="Mode Theory — Analytical Reference" equations={[
        { name: 'V-Parameter (SMF Limit)', math: 'V < 2.405 \\implies \\text{LP}_{01} \\text{ Only}', color: 'text-indigo-600', description: 'Fundamental threshold for single-mode operation. Derived from the first zero of the Bessel function J₁.' },
        { name: 'Mode Count (Approx)', math: 'N \\approx V^2 / 2', color: 'text-blue-600', description: 'Estimates the total number of modes in a multimode step-index fiber.' },
        { name: 'Characteristic Identity', math: 'V^2 = U^2 + W^2', color: 'text-emerald-600', description: 'Relates core wavenumber and cladding decay constants to the normalized frequency.' },
      ]} />
    </div>
  );
};

/* =========================================
   4. THE V-PARAMETER DESIGN LAB
   ========================================= */
const DesignLab = () => {
  const [lambda, setLambda] = useState(1310);
  const [coreRadius, setCoreRadius] = useState(4.1);
  const n1 = 1.48;
  const n2 = 1.46;
  const na = Math.sqrt(n1*n1 - n2*n2);
  const calculatedV = (2 * Math.PI * (coreRadius) * 1000 / lambda) * na;
  const isSMF = calculatedV < 2.405;
  
  // MFD (Gaussian) model: Petermann II Spot Size (approx)
  // w = a * (0.65 + 1.619/V^1.5 + 2.879/V^6)
  const mfd_a_ratio = 0.65 + 1.619 / Math.pow(calculatedV, 1.5) + 2.879 / Math.pow(calculatedV, 6);
  const mfd = coreRadius * 2 * mfd_a_ratio;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="gold">System Design</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Normalized <span className="text-gold uppercase tracking-tighter">V-Parameter</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          The <span className="text-navy font-black">V-Number</span> is the single most critical degree of freedom in fiber design. 
          It dictates the cutoff wavelength and the fundamental <span className="text-navy font-black">Mode-Field Diameter (MFD)</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <Card className="xl:col-span-2 p-8 space-y-8 border-slate-200">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Variable Constraints</h3>
          {[
            { label: 'Operating Wavelength λ', value: lambda, min: 800, max: 1650, step: 10, set: setLambda, unit: 'nm', color: 'accent-navy', display: 'text-navy' },
            { label: 'Core Radius a', value: coreRadius, min: 2, max: 15, step: 0.1, set: setCoreRadius, unit: 'µm', color: 'accent-indigo-500', display: 'text-indigo-600' },
          ].map(s => (
            <div key={s.label} className="glass-card border border-white/20 rounded-2xl p-6 shadow-inner hover:bg-white/60 transition-all">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</label>
                <span className={`font-mono text-sm font-black ${s.display} px-3 py-1 glass-card rounded-lg shadow-sm border border-white/10`}>{s.value} {s.unit}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.set(parseFloat(e.target.value))}
                className={`w-full h-1.5 rounded-full ${s.color} cursor-pointer shadow-inner`} />
              <div className="flex justify-between text-[8px] text-slate-400 mt-4 font-black uppercase tracking-widest">
                <span>Min: {s.min}</span><span>Max: {s.max}</span>
              </div>
            </div>
          ))}
          <div className="p-5 bg-navy rounded-2xl text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
             <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 opacity-80">Calculated V-Number</h4>
             <div className="text-5xl font-black tracking-tighter mb-4">{calculatedV.toFixed(3)}</div>
             <div className={`inline-flex px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isSMF ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                {isSMF ? '✓ Single-Mode' : '✗ Multi-Mode Operation'}
             </div>
          </div>
        </Card>

        <Card className="xl:col-span-3 p-8 border-indigo-100 flex flex-col">
           <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-8 border-b border-indigo-50 pb-4">
              Gaussian Mode-Field Diameter (MFD) Visualization
           </h3>
           <div className="flex-1 flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-3xl border border-slate-100 shadow-inner mb-6 relative overflow-hidden">
              {/* Radial Gaussian Beam */}
              <div 
                className="relative rounded-full transition-all duration-500 shadow-[0_0_60px_rgba(79,70,229,0.2)]"
                style={{ 
                  width: `${mfd_a_ratio * 100}px`, 
                  height: `${mfd_a_ratio * 100}px`,
                  background: 'radial-gradient(circle, rgba(79,70,229,0.9) 0%, rgba(79,70,229,0.3) 60%, transparent 100%)'
                }}
              />
              <div className="mt-12 text-center">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Petermann II Spot Size</div>
                 <div className="text-4xl font-black text-navy tracking-tighter">MFD ≈ {mfd.toFixed(2)} µm</div>
                 <p className="text-[11px] text-slate-500 font-medium italic mt-2">
                   "At λ = {lambda}nm, field extends {(mfd/(coreRadius*2)).toFixed(2)}x beyond core radius."
                 </p>
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 glass-card border border-white/20 rounded-2xl shadow-sm hover:bg-white/60 transition-all">
                 <h4 className="text-[9px] font-black text-navy uppercase mb-2">Cutoff Wavelength (λ_c)</h4>
                 <div className="text-2xl font-black text-indigo-600">{(lambda*calculatedV/2.405).toFixed(0)} nm</div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Multi-mode above this V</p>
              </div>
              <div className="p-5 glass-card border border-white/20 rounded-2xl shadow-sm hover:bg-gold/10 transition-colors">
                 <h4 className="text-[9px] font-black text-navy uppercase mb-2">Effective Index (n_eff)</h4>
                 <div className="text-2xl font-black text-indigo-600">{(1.46 + (1.48-1.46)*(1-Math.pow(calculatedV, -1.2))).toFixed(4)}</div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Phase velocity parameter</p>
              </div>
           </div>
        </Card>
      </div>

      <EquationCheatSheet title="V-Parameter & Spot Size — Reference" equations={[
        { name: 'V-Number Definition', math: 'V = \\dfrac{2\\pi a}{\\lambda}\\,NA', color: 'text-indigo-600', description: 'Combines geometric and optic parameters into a single unitless frequency node.' },
        { name: 'Petermann II MFD', math: 'w \\approx a \\left( 0.65 + \\frac{1.619}{V^{1.5}} + \\frac{2.879}{V^6} \\right)', color: 'text-blue-600', description: 'Empirical formula for the 1/e field radius. Note how MFD increases as V decreases near cutoff.' },
        { name: 'Core Power fraction', math: '\\eta = 1 - \\exp(-2(a/w)^2)', color: 'text-emerald-600', description: 'Defines what percentage of light remains trapped inside the physical core glass.' },
      ]} />
    </div>
  );
};

/* =========================================
   5. PROBLEM SOLVER
   ========================================= */
const ProblemSolver = () => {
  const problems = [
    {
      id: 'NODE-01', color: 'indigo',
      title: 'Acceptance Cone Analysis',
      question: 'A step-index fiber has n₁=1.49, n₂=1.47. Calculate the maximum acceptance angle in air (n₀=1).',
      steps: [
        'NA = √(n₁² − n₂²) = √(1.49² − 1.47²)',
        'NA = √(2.2201 − 2.1609) = √0.0592',
        'NA ≈ 0.2433',
        'θ_a = sin⁻¹(NA/n₀) = sin⁻¹(0.2433)',
        'θ_a ≈ 14.08°',
      ],
      answer: '14.08°',
    },
    {
      id: 'NODE-02', color: 'navy',
      title: 'SMF Design Limit',
      question: 'Find maximum core radius a for SMF at λ=1550 nm with NA=0.12.',
      steps: [
        'Condition: V ≤ 2.4048',
        'V = (2π/λ) · a · NA',
        '2.4048 = (2π / 1.55 µm) · a · 0.12',
        'a = (2.4048 × 1.55) / (2π × 0.12)',
        'a ≈ 3.727 / 0.754 ≈ 4.94 µm',
      ],
      answer: '≈ 4.94 µm',
    },
    {
      id: 'NODE-03', color: 'emerald',
      title: 'Multimode Parabolic Count',
      question: 'For a parabolic GI fiber (α=2) with V=40, find the total guided modes.',
      steps: [
        'N_GI ≈ (α/(α+2)) · (V²/2)',
        'For α=2: N = (2/4) · (V²/2) = V²/4',
        'N = 40² / 4 = 1600/4',
        'N = 400 modes',
        '(vs. 800 for step-index: N_SI = V²/2)',
      ],
      answer: '400 modes',
    },
    {
      id: 'NODE-04', color: 'gold',
      title: 'Petermann II Calculations',
      question: 'Estimate MFD for a fiber with V=2.2 and a=4.5 µm.',
      steps: [
        'w/a = 0.65 + 1.619/(2.2^1.5) + 2.879/(2.2^6)',
        'w/a = 0.65 + 0.496 + 0.025 ≈ 1.171',
        'MFD = 2w = 2 · (4.5 · 1.171)',
        'MFD ≈ 10.54 µm',
      ],
      answer: '≈ 10.54 µm',
    },
  ];

  const [open, setOpen] = useState({});
  const toggle = id => setOpen(o => ({ ...o, [id]: !o[id] }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="gold">Problem Solver</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mt-6 mb-6">Expert <span className="text-indigo-600">Problem</span> Sets</h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          Validated analytical challenges derived from textbook mode theory and ray propagation models.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {problems.map(p => (
          <Card key={p.id} className="p-8 hover:shadow-xl transition-all duration-500">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-navy text-white flex items-center justify-center font-black text-xs shadow-lg">{p.id}</div>
              <div>
                <h4 className="text-xl font-black text-navy mb-2 tracking-tight">{p.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">"{p.question}"</p>
              </div>
            </div>

            <button
              onClick={() => toggle(p.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${open[p.id] ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
            >
              <span>{open[p.id] ? 'Conceal Analytical Path' : 'Access Derivation Node'}</span>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${open[p.id] ? 'rotate-90' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open[p.id] ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 glass-card rounded-2xl border border-white/20 font-mono text-xs leading-loose relative shadow-inner">
                <div className="text-[9px] font-black text-indigo-600 uppercase mb-4 opacity-60">Verification Sequence Node</div>
                {p.steps.map((s, i) => (
                  <div key={i} className="flex gap-4 text-slate-600 mb-2">
                    <span className="text-indigo-600 font-black opacity-40">[{i + 1}]</span>
                    <span className="font-bold tracking-tight">{s}</span>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t border-slate-200 text-indigo-600 font-black text-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  Final Result: {p.answer}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

/* =========================================
   MODULE 1 SHELL
   ========================================= */
export default function Module1Basics({ onBack }) {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'intro',       title: '1. Ray Theory & TIR',      icon: <Maximize className="w-4 h-4" /> },
    { id: 'structures',  title: '2. Fiber Structures',       icon: <Layers className="w-4 h-4" /> },
    { id: 'em-theory',  title: '3. LP Mode Theory',         icon: <Activity className="w-4 h-4" /> },
    { id: 'design-lab', title: '4. V-Parameter Lab',        icon: <Zap className="w-4 h-4" /> },
    { id: 'quiz',        title: '5. Problem Solver',         icon: <PenTool className="w-4 h-4" /> },
  ];

  const navBtn = (s) => (
    <button key={s.id} onClick={() => { setActiveSection(s.id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 text-left group ${
        activeSection === s.id
          ? 'bg-white/90 glass-card text-navy shadow-xl scale-105 z-10'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
      }`}>
      <span className={`${activeSection === s.id ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>{s.icon}</span>
      <span className="font-bold text-sm tracking-tight">{s.title}</span>
      {activeSection === s.id && <ChevronRight className="w-4 h-4 ml-auto text-indigo-600" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-body">
      {/* ── Sidebar — Corporate Lab Style ── */}
      <nav className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-72 h-full glass-navy flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl border-y-0 border-l-0`}>
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <button onClick={onBack}
            className="group flex items-center gap-4 text-slate-400 hover:text-white transition-all mb-12 w-full">
            <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-indigo-600 transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Hub Menu</span>
          </button>

          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-1">Unit 01: Basics</div>
          <div className="space-y-2">{sections.map(navBtn)}</div>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-lg shrink-0">
              <Zap className="w-5 h-5 text-navy" />
            </div>
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-wider">Lab Node SI-01</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Active Session</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main content — Stark White ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-transparent">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-navy text-white z-30">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-[10px] font-black tracking-widest uppercase text-gold">Unit 01: Fundamentals</span>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-10 md:px-12 md:py-16 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-32">
            {activeSection === 'intro'      && <TirSimulator />}
            {activeSection === 'structures' && <FiberAnatomy />}
            {activeSection === 'em-theory' && <ModeTheory />}
            {activeSection === 'design-lab' && <DesignLab />}
            {activeSection === 'quiz'       && <ProblemSolver />}
          </div>
        </div>
      </main>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}
