import React, { useState, useCallback, useEffect } from 'react';
import { Layers, Maximize, Activity, ChevronRight, Zap, Target, BookOpen, PenTool, ArrowLeft, Menu, Info } from 'lucide-react';

import { MathBlock, MathInline, EquationCheatSheet } from '../MathBlock';

/* =========================================
   SHARED COMPONENTS
   ========================================= */
const Card = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-[2rem] hover:bg-white/90 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'navy' }) => {
  const styles = {
    navy: 'bg-slate-800/10 text-slate-800 border-slate-800/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    red: 'bg-red-500/10 text-red-600 border-red-500/20',
    gold: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/40',
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

  // SVG ray geometry
  const entryX = 150, entryY = 150;
  const dx = angleCoreRad > 0.001 ? 50 / Math.tan(angleCoreRad) : 400;
  const safeYOffset = Math.min(130 * Math.tan(angleAirRad), 130);
  const startY = entryY + safeYOffset;
  const hitY = 100;

  const getRayData = () => {
    if (incidentAngle === 0) return { path: `M 20,150 L 600,150`, color: '#3b82f6', bounces: [] };

    let path = `M 20,${startY} L ${entryX},${entryY}`;
    let bounces = [];

    if (isTIR) {
      let cx = entryX;
      let cy = entryY;
      let currentHitY = 100; // Top boundary
      let bounceCount = 0;

      while (cx < 600 && bounceCount < 10) {
        let nextX = cx + Math.abs(dx);
        if (nextX > 600) {
          let ratio = (600 - cx) / Math.abs(dx);
          let finalY = cy + (currentHitY - cy) * ratio;
          path += ` L 600,${finalY}`;
          break;
        }
        path += ` L ${nextX},${currentHitY}`;
        bounces.push({ x: nextX, y: currentHitY });
        cx = nextX;
        cy = currentHitY;
        currentHitY = currentHitY === 100 ? 200 : 100;
        bounceCount++;
      }
      return { path, color: '#2563eb', bounces, escaped: null };
    } else {
      let firstHitX = Math.min(entryX + Math.abs(dx), 600);
      path += ` L ${firstHitX},${hitY}`;
      return {
        path,
        color: '#3b82f6',
        bounces: [],
        escaped: { x: firstHitX, y: hitY }
      };
    }
  };

  const rayData = getRayData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <div className="flex items-center gap-3 mb-6">
          <Badge variant="indigo">Laboratory 01</Badge>
          <Badge variant={isTIR ? 'emerald' : 'red'}>{isTIR ? '● Total Internal Reflection' : '○ Fresnel Radiation'}</Badge>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mb-6">Ray Theory & <span className="text-indigo-600">Guidance</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          Analyzing the transition from simple geometric optics to waveguiding principles.
          Adjust refractive indices to visualize the <span className="text-slate-800 font-bold">Acceptance Cone</span>, <span className="text-slate-800 font-bold">Multiple TIR Bounces</span>, and the <span className="text-slate-800 font-bold">Evanescent Field</span>.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-8 border-slate-200">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Continuous Ray Propagation Model</h3>
            <div className="flex gap-2 text-[10px] font-black uppercase">
              <span className={isTIR ? "text-emerald-600" : "text-red-500"}>{isTIR ? "TIR ACTIVE" : "LEAKY MODE"}</span>
            </div>
          </div>
          <div className="w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner relative">
            <svg viewBox="0 0 600 300" className="w-full h-auto block">
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

              {/* Evanescent Field Penetration */}
              {rayData.bounces.map((bounce, i) => (
                <path key={i}
                  d={`M ${bounce.x - 20},${bounce.y} Q ${bounce.x},${bounce.y === 100 ? 85 : 215} ${bounce.x + 20},${bounce.y}`}
                  fill="none" stroke="#f43f5e" strokeWidth="2" opacity="0.5" strokeDasharray="3 3" />
              ))}

              {/* Main Ray */}
              <path d={rayData.path} fill="none" stroke={rayData.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Leaky Ray */}
              {rayData.escaped && (
                <line x1={rayData.escaped.x} y1={rayData.escaped.y}
                  x2={Math.min(rayData.escaped.x + 50, 590)} y2={Math.max(rayData.escaped.y - 80, 5)}
                  stroke="#ef4444" strokeWidth="3" strokeDasharray="5 3" strokeLinecap="round" />
              )}
            </svg>

            {isTIR && (
              <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-rose-100 shadow-sm max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Evanescent Field</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  TIR is not a hard wall. Energy penetrates slightly into the cladding, causing the <span className="font-bold text-slate-800">Goos-Hänchen Shift</span> before returning.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Controls */}
        <Card className="p-8 flex flex-col gap-6 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Optic Parameters</h3>

          <div className="space-y-6">
            {[
              { label: 'Core Index (n₁)', value: n1, min: 1.42, max: 1.6, step: 0.001, set: setN1, color: 'accent-slate-800', display: 'text-slate-800' },
              { label: 'Clad Index (n₂)', value: n2, min: 1.35, max: n1 - 0.001, step: 0.001, set: setN2, color: 'accent-indigo-500', display: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</label>
                  <span className={`font-mono text-sm font-black ${s.display}`}>{s.value.toFixed(3)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(parseFloat(e.target.value))}
                  className={`w-full h-1.5 rounded-full ${s.color} cursor-pointer`} />
              </div>
            ))}

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:bg-slate-100 transition-colors">
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
            <div className="p-5 bg-slate-800 text-white rounded-xl shadow-lg relative overflow-hidden border-none text-center">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10" />
              <div className="text-[10px] font-black text-blue-300 uppercase mb-1 tracking-widest opacity-80">Numerical Aperture</div>
              <div className="text-3xl font-black tracking-tighter">NA = {NA.toFixed(4)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Crit Angle</div>
                <div className="text-xl font-black text-slate-800">{criticalAngleDeg.toFixed(1)}°</div>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
                <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Accept Cone</div>
                <div className="text-xl font-black text-slate-800">±{acceptanceAngleDeg.toFixed(1)}°</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <EquationCheatSheet title="Ray Theory & Skew Optics — Summary" equations={[
        { name: "Snell's Law", math: "n_0 \\sin\\theta_0 = n_1 \\sin\\theta_1", color: 'text-indigo-600', description: "Describes angular transition across interfaces. Foundation for ray tracing." },
        { name: "Numerical Aperture", math: "NA = \\sqrt{n_1^2 - n_2^2}", color: 'text-blue-600', description: "Defines the sine of the maximum acceptance angle for light injection." },
        { name: "Critical Angle (φ_c)", math: "\\sin\\varphi_c = n_2 / n_1", color: 'text-emerald-600', description: "Minimum angle from the normal required to sustain Total Internal Reflection." },
      ]} />
    </div>
  );
};

/* =========================================
   2. FIBER STRUCTURES & ALPHA-PROFILES
   ========================================= */
const FiberAnatomy = () => {
  const [alpha, setAlpha] = useState(2);

  // Generate Profile Curve
  const getCurvePoints = useCallback(() => {
    const pts = [];
    for (let x = -100; x <= 100; x += 4) {
      const r = Math.abs(x) / 100;
      const n = 160 - 100 * (1 - Math.pow(r, Math.min(alpha, 12)));
      pts.push(`${200 + x},${n}`);
    }
    return pts.join(' L ');
  }, [alpha]);

  // Generate Trajectory Curve (Simulating Graded vs Step behavior)
  const getTrajectoryPoints = useCallback(() => {
    if (alpha >= 10) {
      // Step Index: Zig-Zag
      return `M 0,50 L 50,10 L 150,90 L 250,10 L 350,90 L 400,50`;
    } else {
      // Graded Index: Sinusoidal-like (approximated based on alpha)
      // Alpha=2 is perfectly sinusoidal. Alpha < 2 gets pointier, Alpha > 2 gets flatter tops.
      const pts = [];
      for (let x = 0; x <= 400; x += 5) {
        // Simple heuristic to visually represent the smooth bending of graded-index
        const baseSin = Math.sin((x / 100) * Math.PI);
        const y = 50 - 40 * (Math.sign(baseSin) * Math.pow(Math.abs(baseSin), 2 / alpha));
        pts.push(`${x},${y}`);
      }
      return `M ` + pts.join(' L ');
    }
  }, [alpha]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="indigo">Structure Analysis</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mt-6 mb-6">Index <span className="text-indigo-600">Profiles</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          The <span className="text-slate-800 font-bold">Refractive Index Profile n(r)</span> determines the modal path.
          Parabolic profiles (α=2) continuously bend light to neutralize intermodal dispersion by equalizing optical path lengths.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card className="p-8 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">
            Radial Index Distribution & Trajectory
          </h3>

          {/* Index Profile Chart */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-4 shadow-inner">
            <svg viewBox="0 0 400 200" className="w-full h-auto block">
              <rect x="0" y="0" width="400" height="200" fill="transparent" />
              <line x1="200" y1="20" x2="200" y2="175" stroke="#cbd5e1" strokeWidth="2" />
              <line x1="40" y1="160" x2="360" y2="160" stroke="#cbd5e1" strokeWidth="2" />

              <path d={`M 100,160 L 100,120 L ${getCurvePoints()} L 300,120 L 300,160`}
                fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                className="transition-all duration-300" />

              <text x="210" y="24" fill="#64748b" fontSize="9" fontWeight="900" className="uppercase tracking-widest">n(r)</text>
              <text x="350" y="155" fill="#64748b" fontSize="9" fontWeight="900" className="uppercase tracking-widest">Radius</text>
              <text x="200" y="190" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                PROFILED VALUE α = {alpha >= 10 ? '∞ (Step)' : alpha.toFixed(1)}
              </text>
            </svg>
          </div>

          {/* Ray Trajectory Vis */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-800 mb-8 relative">
            <div className="absolute top-2 left-3 text-[8px] font-black text-blue-300 uppercase tracking-widest z-10">Ray Trajectory</div>
            <svg viewBox="0 0 400 100" className="w-full h-auto block">
              <rect x="0" y="10" width="400" height="80" fill="#1e293b" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
              <path d={getTrajectoryPoints()} fill="none" stroke="#38bdf8" strokeWidth="3" className="transition-all duration-300" />
            </svg>
          </div>

          {/* Controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Profile Parameter (α)</label>
              <span className="font-mono text-sm font-black text-indigo-600 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">{alpha >= 10 ? '∞' : alpha.toFixed(1)}</span>
            </div>
            <input type="range" min="1" max="10" step="0.1" value={alpha}
              onChange={e => setAlpha(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full accent-indigo-600 cursor-pointer" />
            <div className="flex justify-between text-[8px] text-slate-400 mt-4 font-black uppercase tracking-widest">
              <span>Triangular</span><span>Parabolic</span><span>Step Index</span>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-8 border-indigo-100 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Profile Math Node</h3>
            </div>
            <MathBlock math="n(r) = n_1[1 - 2\Delta(r/a)^\alpha]^{1/2}" label="General Power-Law Solution" color="border-indigo-200" />
            <p className="text-sm text-slate-600 leading-relaxed mt-6 font-medium">
              Standard silica fibers use <MathInline math="\alpha = 2" /> (parabolic) to minimize intermodal dispersion.
              The refractive index decreases gradually from core center to cladding interface, forcing outer rays to travel faster through lower-index glass, catching up with the axial rays!
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="text-[10px] font-black text-slate-800 uppercase mb-2 tracking-widest">Step-Index</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-bold">High dispersion in multimode. Constant n in core. Preferred structure for SMF.</p>
            </div>
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
              <h4 className="text-[10px] font-black text-indigo-700 uppercase mb-2 tracking-widest">Graded-Index</h4>
              <p className="text-[11px] text-indigo-800/80 leading-relaxed font-bold">Low dispersion. Variable n causes sinusoidal ray paths. Ideal for short-haul MMF.</p>
            </div>
          </div>
        </div>
      </div>
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
        <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mt-6 mb-6">Wave Theory & <span className="text-indigo-600">Modes</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          For fibers with Δ ≪ 1 (Weakly Guiding), Maxwell's equations simplify to scalar wave solutions, defining the <span className="text-slate-800 font-black">Linearly Polarized (LP)</span> modes.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visualizing LP Modes */}
        <Card className="p-8 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
            LP Mode Field Shapes (Cross-Section)
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">

            {/* LP01 */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-800 flex items-center justify-center overflow-hidden mb-3">
                <div className="w-16 h-16 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(2px)' }} />
              </div>
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">LP₀₁</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">Fundamental</span>
            </div>

            {/* LP11 */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-800 flex items-center justify-center overflow-hidden mb-3 gap-1">
                <div className="w-8 h-12 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(1px)' }} />
                <div className="w-8 h-12 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(1px)' }} />
              </div>
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">LP₁₁</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">2 Lobes</span>
            </div>

            {/* LP21 */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-2 border-slate-200 bg-slate-800 flex items-center justify-center overflow-hidden mb-3 p-2 relative">
                <div className="absolute top-2 left-8 w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(1px)' }} />
                <div className="absolute bottom-2 left-8 w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(1px)' }} />
                <div className="absolute top-8 left-2 w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(1px)' }} />
                <div className="absolute top-8 right-2 w-8 h-8 rounded-full" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(1px)' }} />
              </div>
              <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">LP₂₁</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">4 Lobes</span>
            </div>

          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl">
            In weakly guiding fibers, true modes (HE, EH, TE, TM) are degenerate (they travel at nearly identical phase velocities) and merge visually into Linearly Polarized (LP) mode patterns.
          </p>
        </Card>

        {/* Phase vs Group Velocity */}
        <Card className="p-8 border-indigo-100">
          <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-6 border-b border-indigo-50 pb-4">
            Phase vs. Group Velocity
          </h3>
          <div className="space-y-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-black text-slate-800">Phase Velocity (v_p)</h4>
                <span className="text-[10px] font-black text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded">v_p = ω/β = c/n_eff</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                The speed at which the ripples (crests/troughs) of the electromagnetic wave travel. Determined by the Effective Refractive Index (<MathInline math="n_{eff}" />).
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-black text-slate-800">Group Velocity (v_g)</h4>
                <span className="text-[10px] font-black text-rose-600 font-mono bg-rose-50 px-2 py-1 rounded">v_g = dω/dβ = c/N_g</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                The speed at which the overall wave envelope (the actual data pulse or optical energy) travels. Always slower than phase velocity due to dispersion.
              </p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-8 border-slate-200">
          <h3 className="text-xl font-black text-slate-800 mb-6 tracking-tight">Scalar Wave Eigenvalues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <MathBlock math="U \frac{J_{m\pm1}(U)}{J_m(U)} = \mp W \frac{K_{m\pm1}(W)}{K_m(W)}" label="Characteristic Scalar Equation" color="border-indigo-200" />
            <div className="text-sm text-slate-600 leading-relaxed space-y-4">
              <p>Solving this transcendental equation yields the <span className="font-bold text-slate-800">Propagation Constant (β)</span> for each allowed mode.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs shadow-sm mb-2">U</div>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Transverse Core Wavenumber</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 flex items-center justify-center font-black text-xs shadow-sm mb-2">W</div>
                  <p className="text-[9px] text-slate-600 font-black uppercase tracking-wider">Cladding Decay Constant</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
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
  const na = Math.sqrt(n1 * n1 - n2 * n2);
  const calculatedV = (2 * Math.PI * (coreRadius) * 1000 / lambda) * na;
  const isSMF = calculatedV < 2.405;

  // Petermann II Spot Size (approx)
  const mfd_a_ratio = 0.65 + 1.619 / Math.pow(calculatedV, 1.5) + 2.879 / Math.pow(calculatedV, 6);
  const mfd = coreRadius * 2 * mfd_a_ratio;

  // Fractional Power in Core (Gamma)
  const w = mfd / 2;
  const gamma = 1 - Math.exp(-2 * Math.pow(coreRadius / w, 2));
  const powerInCorePct = (gamma * 100).toFixed(1);
  const powerInCladPct = ((1 - gamma) * 100).toFixed(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="gold">System Design</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mt-6 mb-6">Normalized <span className="text-yellow-600 uppercase tracking-tighter">V-Parameter</span></h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          The <span className="text-slate-800 font-black">V-Number</span> dictates the cutoff wavelength, the <span className="text-slate-800 font-black">Mode-Field Diameter (MFD)</span>, and exactly what fraction of optical power spills into the cladding as evanescent waves.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <Card className="xl:col-span-2 p-8 space-y-8 border-slate-200">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Variable Constraints</h3>
          {[
            { label: 'Operating Wavelength λ', value: lambda, min: 800, max: 1650, step: 10, set: setLambda, unit: 'nm', color: 'accent-slate-800', display: 'text-slate-800' },
            { label: 'Core Radius a', value: coreRadius, min: 2, max: 15, step: 0.1, set: setCoreRadius, unit: 'µm', color: 'accent-indigo-500', display: 'text-indigo-600' },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm hover:bg-slate-100 transition-all">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{s.label}</label>
                <span className={`font-mono text-sm font-black ${s.display} px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm`}>{s.value} {s.unit}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.set(parseFloat(e.target.value))}
                className={`w-full h-1.5 rounded-full ${s.color} cursor-pointer`} />
            </div>
          ))}
          <div className="p-6 bg-slate-800 rounded-2xl text-white shadow-xl relative overflow-hidden">
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
            Mode-Field Diameter & Power Confinement (Γ)
          </h3>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 py-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner mb-6 relative overflow-hidden">

            {/* Radial Gaussian Beam */}
            <div className="relative flex items-center justify-center w-48 h-48">
              {/* Cladding field (MFD) */}
              <div className="absolute rounded-full border border-indigo-200"
                style={{ width: `${mfd_a_ratio * 100}px`, height: `${mfd_a_ratio * 100}px`, background: 'radial-gradient(circle, rgba(79,70,229,0.3) 0%, transparent 70%)' }} />
              {/* Physical Core */}
              <div className="absolute rounded-full border-2 border-slate-400 bg-transparent flex items-center justify-center"
                style={{ width: '100px', height: '100px' }}>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-white/80 px-1 rounded">Core</span>
              </div>
            </div>

            {/* Confinement Stats */}
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Spot Size (MFD)</div>
                <div className="text-3xl font-black text-slate-800 tracking-tighter">{mfd.toFixed(2)} µm</div>
              </div>

              <div className="h-px w-full bg-slate-200" />

              <div>
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Power in Core (Γ)</div>
                <div className="text-2xl font-black text-emerald-700">{powerInCorePct}%</div>
              </div>
              <div>
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Power in Clad (1-Γ)</div>
                <div className="text-xl font-black text-rose-600">{powerInCladPct}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
              <h4 className="text-[9px] font-black text-slate-500 uppercase mb-2">Cutoff Wavelength (λ_c)</h4>
              <div className="text-2xl font-black text-indigo-600">{(lambda * calculatedV / 2.405).toFixed(0)} nm</div>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Multi-mode above this V</p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
              <h4 className="text-[9px] font-black text-slate-500 uppercase mb-2">Effective Index (n_eff)</h4>
              <div className="text-2xl font-black text-indigo-600">{(1.46 + (1.48 - 1.46) * (1 - Math.pow(calculatedV, -1.2))).toFixed(4)}</div>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">v_p parameter</p>
            </div>
          </div>
        </Card>
      </div>

      <EquationCheatSheet title="V-Parameter & Power Flow — Reference" equations={[
        { name: 'V-Number Definition', math: 'V = \\frac{2\\pi a}{\\lambda} \\sqrt{n_1^2 - n_2^2}', color: 'text-indigo-600', description: 'Combines geometric and optic parameters into a single unitless frequency node.' },
        { name: 'Fractional Core Power', math: '\\Gamma = \\frac{P_{core}}{P_{total}} \\approx 1 - e^{-2(a/w)^2}', color: 'text-emerald-600', description: 'Calculates the percentage of optical power confined within the physical core radius.' },
        { name: 'Cutoff Wavelength', math: '\\lambda_c = \\frac{2\\pi a \\, NA}{2.405}', color: 'text-rose-600', description: 'The absolute minimum wavelength required to force single-mode operation.' },
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
      question: 'A step-index fiber has n₁=1.49, n₂=1.47. Calculate the maximum acceptance angle in air.',
      steps: [
        <MathInline math="NA = \sqrt{n_1^2 - n_2^2} = \sqrt{1.49^2 - 1.47^2}" />,
        <MathInline math="NA = \sqrt{2.2201 - 2.1609} = \sqrt{0.0592}" />,
        <MathInline math="NA \approx 0.2433" />,
        <MathInline math="\theta_a = \sin^{-1}(NA/1.0) = \sin^{-1}(0.2433)" />,
        <MathInline math="\theta_a \approx 14.08^\circ" />,
      ],
      answer: '14.08°',
    },
    {
      id: 'NODE-02', color: 'slate',
      title: 'Cutoff Wavelength (λ_c)',
      question: 'A fiber has a core radius a=4µm, n₁=1.48, n₂=1.478. Calculate the single-mode cutoff wavelength.',
      steps: [
        <MathInline math="NA = \sqrt{1.48^2 - 1.478^2} = \sqrt{2.1904 - 2.1844} \approx 0.0774" />,
        <MathInline math="\text{Condition for SMF: } V_c = 2.405" />,
        <MathInline math="\lambda_c = (2\pi \cdot a \cdot NA) / 2.405" />,
        <MathInline math="\lambda_c = (2\pi \cdot 4\mu m \cdot 0.0774) / 2.405" />,
        <MathInline math="\lambda_c = 1.945\mu m / 2.405 \approx 0.808 \mu m" />,
      ],
      answer: '808 nm',
    },
    {
      id: 'NODE-03', color: 'emerald',
      title: 'Multimode Parabolic Count',
      question: 'For a parabolic GI fiber (α=2) with V=40, find the total guided modes.',
      steps: [
        <MathInline math="N_{\text{GI}} \approx (\alpha/(\alpha+2)) \cdot (V^2/2)" />,
        <MathInline math="\text{For } \alpha=2: N = (2/4) \cdot (V^2/2) = V^2/4" />,
        <MathInline math="N = 40^2 / 4 = 1600/4" />,
        <MathInline math="N = 400 \text{ modes}" />,
      ],
      answer: '400 modes',
    },
    {
      id: 'NODE-04', color: 'rose',
      title: 'Fractional Power Confinement',
      question: 'If a step-index fiber has core radius a=5µm and MFD 2w=12µm, what % of power is in the cladding?',
      steps: [
        <MathInline math="\text{Mode Field Radius } w = 12 / 2 = 6 \mu m" />,
        <MathInline math="\text{Power in Core } (\Gamma) = 1 - \exp(-2(a/w)^2)" />,
        <MathInline math="\Gamma = 1 - \exp(-2 \cdot (5/6)^2)" />,
        <MathInline math="\Gamma = 1 - \exp(-2 \cdot 0.694) = 1 - \exp(-1.388)" />,
        <MathInline math="\Gamma = 1 - 0.249 = 0.751 \text{ (75.1\% in core)}" />,
        <MathInline math="\text{Power in Clad } = 100\% - 75.1\%" />,
      ],
      answer: '24.9%',
    },
  ];

  const [open, setOpen] = useState({});
  const toggle = id => setOpen(o => ({ ...o, [id]: !o[id] }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <header>
        <Badge variant="gold">Problem Solver</Badge>
        <h2 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight mt-6 mb-6">Expert <span className="text-indigo-600">Problem</span> Sets</h2>
        <p className="text-slate-500 font-medium leading-relaxed max-w-3xl text-lg">
          Validated analytical challenges derived from textbook mode theory and ray propagation models.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {problems.map(p => (
          <Card key={p.id} className="p-8 hover:shadow-xl transition-all duration-500 bg-white border border-slate-200">
            <div className="flex items-start gap-6 mb-8">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black text-xs shadow-lg">{p.id}</div>
              <div>
                <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{p.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">"{p.question}"</p>
              </div>
            </div>

            <button
              onClick={() => toggle(p.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${open[p.id] ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300'}`}
            >
              <span>{open[p.id] ? 'Conceal Analytical Path' : 'Access Derivation Node'}</span>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${open[p.id] ? 'rotate-90' : ''}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${open[p.id] ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 font-mono text-xs leading-loose shadow-inner">
                <div className="text-[9px] font-black text-indigo-600 uppercase mb-4 opacity-80">Verification Sequence</div>
                {p.steps.map((s, i) => (
                  <div key={i} className="flex gap-4 text-slate-700 mb-2">
                    <span className="text-indigo-500 font-black">[{i + 1}]</span>
                    <span className="font-bold tracking-tight">{s}</span>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t border-slate-200 text-indigo-700 font-black text-sm flex items-center gap-3">
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
export default function Module1Basics() {
  const [activeSection, setActiveSection] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'intro', title: '1. Ray Theory & TIR', icon: <Maximize className="w-4 h-4" /> },
    { id: 'structures', title: '2. Fiber Structures', icon: <Layers className="w-4 h-4" /> },
    { id: 'em-theory', title: '3. LP Mode Theory', icon: <Activity className="w-4 h-4" /> },
    { id: 'design-lab', title: '4. V-Parameter Lab', icon: <Zap className="w-4 h-4" /> },
    { id: 'quiz', title: '5. Problem Solver', icon: <PenTool className="w-4 h-4" /> },
  ];

  const navBtn = (s) => (
    <button key={s.id} onClick={() => { setActiveSection(s.id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 text-left group ${activeSection === s.id
          ? 'bg-white text-slate-800 shadow-xl scale-105 z-10'
          : 'text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
        }`}>
      <span className={`${activeSection === s.id ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`}>{s.icon}</span>
      <span className="font-bold text-sm tracking-tight">{s.title}</span>
      {activeSection === s.id && <ChevronRight className="w-4 h-4 ml-auto text-indigo-600" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* ── Sidebar — Corporate Lab Style ── */}
      <nav className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-72 h-full bg-slate-900 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl`}>
        <div className="p-8 flex-1 overflow-y-auto">
          <button className="group flex items-center gap-4 text-slate-400 hover:text-white transition-all mb-12 w-full">
            <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-indigo-600 transition-colors border border-white/10">
              <ArrowLeft className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Hub Menu</span>
          </button>

          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-1">Unit 01: Basics</div>
          <div className="space-y-2">{sections.map(navBtn)}</div>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg shrink-0">
              <Zap className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <div className="text-[10px] font-black text-white uppercase tracking-wider">Lab Node SI-01</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Active Session</div>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white z-30">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-300 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-[10px] font-black tracking-widest uppercase text-yellow-500">Unit 01: Fundamentals</span>
          <div className="w-10" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-10 md:px-12 md:py-16 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-32">
            {activeSection === 'intro' && <TirSimulator />}
            {activeSection === 'structures' && <FiberAnatomy />}
            {activeSection === 'em-theory' && <ModeTheory />}
            {activeSection === 'design-lab' && <DesignLab />}
            {activeSection === 'quiz' && <ProblemSolver />}
          </div>
        </div>
      </main>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}