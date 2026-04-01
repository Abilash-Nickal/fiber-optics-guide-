import React, { useState, useEffect, useRef } from 'react';
import {
    Waves, Filter, Share2, Zap, ChevronRight,
    ZapOff, ArrowLeft, Target, Info, Settings2, Activity, Menu, RefreshCw, Copy,
    RotateCw, Thermometer, Ruler, Search, AlertCircle, Globe, PenTool, Lightbulb, Cpu
} from 'lucide-react';
import { MathBlock, MathInline } from '../MathBlock';

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
   1. FIBER ALIGNMENT THEORY
   ========================================= */
const AlignmentMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header className="mb-20">
                <div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Alignment</Badge><Badge variant="navy">Section 01</Badge></div>
                <h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Fiber <span className="text-indigo-600 block">Alignment</span></h2>
            </header>
            <Card className="p-10">
                <MathBlock math="L_{lat} = 4.34 \left( \frac{d}{\omega_0} \right)^2" />
                <p className="text-slate-500 font-medium italic mt-6">Lateral offset (d) is the most critical factor in joint loss.</p>
            </Card>
        </div>
    );
};

/* =========================================
   2. FUSION SPLICING
   ========================================= */
const SplicingMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header className="mb-20">
                <div className="flex items-center gap-3 mb-6"><Badge variant="emerald">Fusion</Badge><Badge variant="navy">Section 02</Badge></div>
                <h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Robotic <span className="text-emerald-600 block">Splicing</span></h2>
            </header>
            <Card className="p-10 text-center glass-navy text-white rounded-[3rem] italic uppercase font-black tracking-widest py-24">Plasma Arc Laboratory</Card>
        </div>
    );
};

/* =========================================
   3. SOURCE PHYSICS
   ========================================= */
const SourcesView = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Emission</Badge><Badge variant="navy">Section 03</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Active <span className="text-indigo-600 block">Emission</span></h2></header>
            <Card className="p-10"><MathBlock math="P_{out} = \eta \frac{h \nu}{q} (I - I_{th})" /></Card>
        </div>
    );
};

/* =========================================
   4. MODULATORS
   ========================================= */
const ModulatorsMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="amber">Pulse</Badge><Badge variant="navy">Section 04</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">Digital <span className="text-indigo-600 block">Modulation</span></h2></header>
            <Card className="p-10 border-l-8 border-indigo-600 font-black italic">MZM & EAM Technology Area</Card>
        </div>
    );
};

/* =========================================
   5. RECEIVER PHYSICS
   ========================================= */
const DetectorsMasterclass = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-24 pb-32 text-slate-800">
            <header><div className="flex items-center gap-3 mb-6"><Badge variant="indigo">Detection</Badge><Badge variant="navy">Section 05</Badge></div><h2 className="text-6xl font-black text-navy uppercase italic tracking-tighter leading-none">The <span className="text-indigo-600 block">Optical Eye</span></h2></header>
            <Card className="p-10"><MathBlock math="R = \frac{\eta q}{h \nu}" /></Card>
        </div>
    );
};

/* =========================================
   MODULE 3 HUB
   ========================================= */
export default function Module3Active({ onBack }) {
  const [activeSection, setActiveSection] = useState('alignment');
  const sections = [
    { id: 'alignment',    title: '1. Fiber Alignment', icon: <Share2 className="w-4 h-4" /> },
    { id: 'splicing',     title: '2. Fusion Splicing',  icon: <Zap className="w-4 h-4" /> },
    { id: 'sources',      title: '3. Active Emission',   icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'modulators',   title: '4. Digital Modulation', icon: <Activity className="w-4 h-4" /> },
    { id: 'detectors',    title: '5. Receiver Physics',  icon: <Cpu className="w-4 h-4" /> },
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
      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar px-6 py-10 md:px-20 md:py-24">
        <div className="max-w-6xl mx-auto pb-48 w-full">
            {activeSection === 'alignment' && <AlignmentMasterclass />}
            {activeSection === 'splicing' && <SplicingMasterclass />}
            {activeSection === 'sources' && <SourcesView />}
            {activeSection === 'modulators' && <ModulatorsMasterclass />}
            {activeSection === 'detectors' && <DetectorsMasterclass />}
        </div>
      </main>
    </div>
  );
}
