import React, { useState, useEffect, useRef } from 'react';
import {
    Waves, Filter, Share2, Zap, ChevronRight,
    ZapOff, ArrowLeft, Target, Info, Settings2, Activity, Menu, RefreshCw, Copy,
    RotateCw, Thermometer, Ruler, Search, AlertCircle, Globe, PenTool
} from 'lucide-react';
import { MathBlock, MathInline } from '../MathBlock';

/* =========================================
   SHARED HELPERS
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
   1. SAGNAC GYRO LAB
   ========================================= */
const SagnacLab = () => {
    const [rotation, setRotation] = useState(10);
    const [turns, setTurns] = useState(500);
    const [radius, setRadius] = useState(0.1);
    const wavelength = 1550e-9;
    const c = 3e8;
    const Area = Math.PI * Math.pow(radius, 2);
    const phaseShift = (8 * Math.PI * turns * Area * ((rotation * Math.PI) / 180)) / (wavelength * c);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 text-slate-800">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 01</Badge></div>
                <h2 className="text-5xl md:text-6xl font-black text-navy tracking-tight mb-6 uppercase italic">Inertial <span className="text-indigo-600">Sagnac</span></h2>
            </header>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 p-8 border-slate-200">
                    <div className="w-full h-64 glass-navy rounded-2xl flex items-center justify-center relative overflow-hidden">
                        <svg viewBox="-100 -100 200 200" className="w-48 h-48" style={{ transform: `rotate(${rotation * 5}deg)` }}>
                            <circle cx="0" cy="0" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
                            <circle cx="0" cy="0" r="85" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 5" />
                        </svg>
                        <div className="absolute text-white font-black italic text-3xl">{rotation}°/s</div>
                    </div>
                </Card>
                <Card className="p-8 border-slate-200 space-y-6">
                    <input type="range" min="-100" max="100" value={rotation} onChange={e => setRotation(parseFloat(e.target.value))} className="w-full accent-navy" />
                    <div className="p-5 glass-navy text-white rounded-xl text-center"><div className="text-2xl font-black">{phaseShift.toFixed(6)} rad</div></div>
                </Card>
            </div>
            <MathBlock math="\Delta\phi = \frac{8\pi N A}{\lambda c} \Omega" color="border-slate-100" />
        </div>
    );
};

/* =========================================
   2. FBG SANDBOX
   ========================================= */
const BraggView = () => {
    const [temp, setTemp] = useState(25);
    const lambda0 = 1550;
    const shift = lambda0 * (7.2e-6) * (temp - 25);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 text-slate-800">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Laboratory 04</Badge><Badge variant="navy">Section 02</Badge></div>
                <h2 className="text-5xl font-black text-navy tracking-tight mb-6 uppercase italic">Bragg <span className="text-indigo-600 italic block">Sandbox</span></h2>
            </header>
            <Card className="p-10 bg-white shadow-2xl space-y-10">
                <div className="h-20 flex items-center justify-center border-b border-slate-100">
                   <div className="text-4xl font-black text-indigo-600">{(lambda0 + shift).toFixed(3)} nm</div>
                </div>
                <input type="range" min="-50" max="150" value={temp} onChange={e => setTemp(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
            </Card>
            <MathBlock math="\frac{\Delta\lambda_B}{\lambda_B} = (\alpha+\xi)\Delta T" />
        </div>
    );
};

/* =========================================
   3. FIBER OPTIC SENSORS
   ========================================= */
const SensorMasterclass = () => {
    const [stimulus, setStimulus] = useState(0);
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header>
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Physics</Badge><Badge variant="navy">Section 03</Badge></div>
                <h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Optic <span className="text-indigo-600 block">Sensors</span></h2>
            </header>
            <Card className="p-10 space-y-8">
                <h3 className="text-xl font-black text-navy uppercase italic">Extrinsic vs Intrinsic</h3>
                <p className="text-slate-500 font-medium italic">Adjust the stimulus to visualize attenuation due to deformation.</p>
                <input type="range" min="0" max="100" value={stimulus} onChange={e => setStimulus(e.target.value)} className="w-full accent-emerald-500" />
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${100 - stimulus}%` }} />
                </div>
            </Card>
        </div>
    );
};

/* =========================================
   4. FIBER COUPLERS
   ========================================= */
const CouplerMasterclass = () => {
    const [coupling, setCoupling] = useState(50);
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Splitting</Badge><Badge variant="navy">Section 04</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Fiber <span className="text-indigo-600 block">Couplers</span></h2></header>
            <Card className="p-10 space-y-8">
                <div className="flex justify-between font-black"><span className="text-navy">Thru: {100-coupling}%</span><span className="text-indigo-600">Cross: {coupling}%</span></div>
                <input type="range" min="0" max="100" value={coupling} onChange={e => setCoupling(e.target.value)} className="w-full accent-indigo-600" />
            </Card>
        </div>
    );
};

/* =========================================
   5. TRAFFIC CONTROL
   ========================================= */
const TrafficMasterclass = () => {
    const [mode, setMode] = useState('isolator');
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="gold">Networking</Badge><Badge variant="navy">Section 05</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Traffic <span className="text-indigo-600 block">Control</span></h2></header>
            <div className="flex gap-4 mb-10"><button onClick={() => setMode('isolator')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${mode === 'isolator' ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'}`}>Isolator</button><button onClick={() => setMode('circulator')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase ${mode === 'circulator' ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'}`}>Circulator</button></div>
            <Card className="p-20 text-center glass-navy text-white rounded-[3rem] italic uppercase font-black tracking-widest">{mode} Active Area</Card>
        </div>
    );
};

/* =========================================
   6. AMPLIFIERS VS REGEN
   ========================================= */
const AmplifiersMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="rose">Signal Hub</Badge><Badge variant="navy">Section 06</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Amplifiers <span className="text-rose-600 block">& Regen</span></h2></header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-10 border-l-8 border-emerald-500">
                    <h4 className="text-xl font-black text-navy mb-4">EDFA (1R)</h4>
                    <p className="text-slate-500 font-medium italic">Pure optical amplification of photons. Simple but noisy.</p>
                </Card>
                <Card className="p-10 border-l-8 border-purple-500">
                    <h4 className="text-xl font-black text-navy mb-4">O-E-O (3R)</h4>
                    <p className="text-slate-500 font-medium italic">Digital reconstruction from binary pulses. Perfect signal.</p>
                </Card>
            </div>
        </div>
    );
};

/* =========================================
   7. DISTRIBUTED SENSING
   ========================================= */
const SensingSetupMasterclass = () => {
    const [temp, setTemp] = useState(25);
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="gold">Advanced</Badge><Badge variant="navy">Section 07</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Coherent <span className="text-indigo-600 block">Sensing</span></h2></header>
            <Card className="p-10 space-y-10">
                <div className="flex justify-between items-center"><span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Brillouin Shift</span><span className="text-xl font-black text-navy italic">{temp}°C</span></div>
                <input type="range" min="0" max="100" value={temp} onChange={e => setTemp(e.target.value)} className="w-full accent-navy" />
                <div className="p-8 glass-navy rounded-2xl text-center text-white italic font-medium">Monitoring frequency shift Δν_B...</div>
            </Card>
        </div>
    );
};

/* =========================================
   8. PROBLEM SOLVER
   ========================================= */
const ProblemSolver = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="gold">Final Quiz</Badge><Badge variant="navy">Section 08</Badge></div><h2 className="text-5xl font-black text-navy uppercase italic tracking-tighter leading-none">Expert <span className="text-gold block">Assessment</span></h2></header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 border-slate-200"><h4 className="font-black text-navy uppercase mb-2">Q1: Insertion Loss</h4><div className="text-xs text-slate-500 italic">"Calculate loss if 10dBm in, 8dBm out."</div><div className="mt-4 p-3 bg-navy text-white rounded-lg text-center font-black">2 dB</div></Card>
            </div>
        </div>
    );
};

/* =========================================
   MODULE 4 HUB
   ========================================= */
export default function Module4Systems({ onBack }) {
  const [activeSection, setActiveSection] = useState('sagnac');
  const sections = [
    { id: 'sagnac',      title: '1. Sagnac Gyro',      icon: <RotateCw className="w-4 h-4" /> },
    { id: 'fbg',         title: '2. Bragg Sandbox',     icon: <Thermometer className="w-4 h-4" /> },
    { id: 'sensors',     title: '3. Optic Sensors',     icon: <Search className="w-4 h-4" /> },
    { id: 'couplers',    title: '4. Fiber Couplers',   icon: <Activity className="w-4 h-4" /> },
    { id: 'traffic',     title: '5. Traffic Control',   icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'amplifiers',  title: '6. Amp vs Regen',     icon: <Zap className="w-4 h-4" /> },
    { id: 'distributed', title: '7. Distributed Sensing', icon: <Globe className="w-4 h-4" /> },
    { id: 'quiz',        title: '8. Problem Solver',    icon: <PenTool className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-body relative">
      <nav className="w-80 h-full glass-navy flex flex-col z-50 shadow-2xl relative">
        <div className="p-10 flex-1 overflow-y-auto">
          <button onClick={onBack} className="group flex items-center gap-4 text-slate-400 hover:text-white mb-16"><ArrowLeft className="w-5 h-5 text-white" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-100 italic">Return to Units</span></button>
          <div className="space-y-2">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 text-left group ${activeSection === s.id ? 'bg-white/90 text-navy shadow-xl scale-105 z-10' : 'text-slate-400 hover:bg-white/5'}`}>
                <span className={`${activeSection === s.id ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-300'}`}>{s.icon}</span>
                <span className="font-black text-[11px] tracking-tight uppercase flex-1 italic">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar px-6 py-10 md:px-20 md:py-24">
        <div className="max-w-6xl mx-auto pb-48 w-full">
            {activeSection === 'sagnac' && <SagnacLab />}
            {activeSection === 'fbg' && <BraggView />}
            {activeSection === 'sensors' && <SensorMasterclass />}
            {activeSection === 'couplers' && <CouplerMasterclass />}
            {activeSection === 'traffic' && <TrafficMasterclass />}
            {activeSection === 'amplifiers' && <AmplifiersMasterclass />}
            {activeSection === 'distributed' && <SensingSetupMasterclass />}
            {activeSection === 'quiz' && <ProblemSolver />}
        </div>
      </main>
    </div>
  );
}