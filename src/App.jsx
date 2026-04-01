import React, { useState, useRef } from 'react';
import { 
  Layers, Activity, GitBranch, Play, ArrowLeft, Calculator, BookOpen, 
  ChevronRight, ArrowRight, GitMerge, Zap, Menu, X
} from 'lucide-react';
import Module1Basics from './components/viz/Module1Basics';
import Module2Modes from './components/viz/Module2Modes';
import Module3Active from './components/viz/Module3Active';
import Module4Systems from './components/viz/Module4Systems'; 
import ResourceGrid from './components/ResourceGrid';
import PdfViewerModal from './components/PdfViewerModal';
import SynthaceBackground from './components/SynthaceBackground';
import EquationBank from './components/EquationBank';
import HeroSection from './components/HeroSection';

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [isHome, setIsHome] = useState(true);
  const [activePdf, setActivePdf] = useState(null);
  const [isEqBankOpen, setIsEqBankOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Introduction');

  const scrollRef = useRef(null);

  const openModule = (id) => {
    setActiveModule(id);
    setIsHome(false);
  };

  const closeModule = () => {
    setIsHome(true);
    setTimeout(() => setActiveModule(null), 500); 
  };

  const scrollToModules = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const modules = [
    { id: '1', title: 'Module 01', subtitle: 'Fundamentals', icon: <Play className="w-6 h-6"/>, color: 'from-blue-500 to-indigo-600', desc: 'Total Internal Reflection & Ray Theory.' },
    { id: '2', title: 'Module 02', subtitle: 'Signal Physics', icon: <Activity className="w-6 h-6"/>, color: 'from-indigo-500 to-purple-600', desc: 'Attenuation, Dispersion & Mode Analysis.' },
    { id: '3', title: 'Module 03', subtitle: 'Active Systems', icon: <Zap className="w-6 h-6"/>, color: 'from-purple-500 to-rose-600', desc: 'Laser Diodes, EDFAs & SOA Physics.' },
    { id: '4', title: 'Module 04', subtitle: 'Sensors & Systems', icon: <GitBranch className="w-6 h-6"/>, color: 'from-emerald-500 to-teal-600', desc: 'FBG, Sagnac Gyro & Distributed Sensing.' }
  ];

  const navLinks = ['Introduction', 'Concepts', 'Modules', 'Resources'];

  return (
    <div className="min-h-screen w-full bg-[#f8faff] text-slate-800 font-sans selection:bg-periwinkle/30 flex items-center justify-center p-4 lg:p-8">
      <SynthaceBackground />
      
      {/* MAIN CONTEXT CARD */}
      <div className={`relative h-[90vh] w-full max-w-[1400px] glass-card rounded-[3rem] overflow-hidden flex flex-col transition-all duration-700 shadow-2xl ${!isHome ? 'scale-95 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        
        {/* HEADER */}
        <header className="h-24 w-full flex items-center justify-between px-12 relative z-50">
          <div className="flex items-center gap-3 group cursor-default translate-x-[-12px] scale-110">
             <div className="w-12 h-12 rounded-2xl bg-periwinkle flex items-center justify-center shadow-[0_10px_20px_rgba(99,102,241,0.35)] group-hover:rotate-12 transition-transform duration-500">
                <div className="w-5 h-5 bg-white rounded-lg rotate-45" />
             </div>
             <span className="font-black text-3xl tracking-tight text-slate-900 drop-shadow-sm">Nexus</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
               <button 
                key={link}
                onClick={() => {
                  setActiveTab(link);
                  if(link === 'Modules') scrollToModules();
                }}
                className={`relative py-2 text-sm font-bold tracking-wide transition-all ${
                  activeTab === link ? 'text-periwinkle' : 'text-slate-500 hover:text-slate-900'
                }`}
               >
                 {link}
                 {activeTab === link && (
                   <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-periwinkle rounded-full animate-in fade-in zoom-in duration-300" />
                 )}
               </button>
            ))}
          </nav>

          <button className="md:hidden p-3 glass-panel rounded-2xl">
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </header>

        {/* CONTENT SCROLL AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar px-6 lg:px-12 pb-24">
          
          <HeroSection 
            onExplore={scrollToModules} 
            onOpenEqBank={() => setIsEqBankOpen(true)}
          />

          {/* MODULE GRID SECTION */}
          <section ref={scrollRef} className="mt-32 pt-12 space-y-12">
            <div className="text-center lg:text-left space-y-4">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Technical Learning Modules</h3>
               <p className="text-slate-500 font-medium max-w-xl">Comprehensive physics modules designed for graduate-level photonics research.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {modules.map((mod, idx) => (
                  <button 
                    key={mod.id}
                    onClick={() => openModule(mod.id)}
                    className="group relative h-80 glass-panel overflow-hidden text-left border-white/50 hover:border-periwinkle/30 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8"
                    style={{ animationDelay: `${idx * 0.15}s` }}
                  >
                     <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700`} />
                     
                     <div className="absolute inset-0 p-12 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div className={`p-5 rounded-3xl bg-gradient-to-br ${mod.color} text-white shadow-xl shadow-indigo-200/50 group-hover:scale-110 transition-transform`}>
                              {mod.icon}
                           </div>
                           <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">{mod.title}</span>
                        </div>
                        
                        <div className="space-y-3">
                           <h3 className="text-3xl font-black text-slate-900 tracking-tight">{mod.subtitle}</h3>
                           <p className="text-slate-500 font-medium text-sm max-w-xs leading-relaxed">{mod.desc}</p>
                        </div>

                        <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 text-periwinkle p-4 glass-card rounded-2xl shadow-lg border-white">
                           <ArrowRight className="w-6 h-6" />
                        </div>
                     </div>
                  </button>
               ))}
            </div>
          </section>

          {/* Research archive */}
          <section className="mt-40 mb-20">
             <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black tracking-tight flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  Research archive
               </h3>
             </div>
             <ResourceGrid onOpenPDF={(resource) => setActivePdf(resource)} />
          </section>
        </main>
      </div>

      {/* 
          CLEAN MODULE OVERLAY — Stays dark/laboratory themed inside for focus
      */}
      <div className={`absolute inset-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isHome ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}>
        <div className="h-full w-full bg-[#03040b] overflow-hidden relative">
           {activeModule === '1' && <Module1Basics onBack={closeModule} />}
           {activeModule === '2' && <Module2Modes onBack={closeModule} />}
           {activeModule === '3' && <Module3Active onBack={closeModule} />}
           {activeModule === '4' && <Module4Systems onBack={closeModule} />}
        </div>
      </div>

      <EquationBank isOpen={isEqBankOpen} onClose={() => setIsEqBankOpen(false)} />
      <PdfViewerModal resource={activePdf} onClose={() => setActivePdf(null)} />
    </div>
  );
}