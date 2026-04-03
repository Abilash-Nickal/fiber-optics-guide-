import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, Activity, GitBranch, Play, ArrowLeft, Calculator, BookOpen, 
  ChevronRight, ArrowRight, GitMerge, Zap, Menu, X, Search, FileText, 
  Download, Maximize2, Share2, Globe
} from 'lucide-react';

import Module1Basics from './components/viz/Module1Basics';
import Module2Modes from './components/viz/Module2Modes';
import Module3Active from './components/viz/Module3Active';
import Module4Systems from './components/viz/Module4Systems';

// --- STYLES FOR LIQUID ANIMATIONS ---
const liquidStyles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 10s infinite alternate;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .glass-panel {
    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.4);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 0 0 1px rgba(255,255,255,0.2);
  }
  .glass-panel-dark {
    background: linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.2) 100%);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255,255,255,0.05);
  }
  .liquid-text {
    background: linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
  }
`;

// --- COMPONENTS ---

const LiquidBackground = ({ isDark }) => (
  <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0 transition-colors duration-1000 ease-in-out" style={{ backgroundColor: isDark ? '#020617' : '#f0f4ff' }}>
    <div className={`absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob transition-all duration-1000 ${isDark ? 'bg-indigo-900/40 mix-blend-screen' : 'bg-periwinkle/30'}`}></div>
    <div className={`absolute -top-[10%] -right-[20%] w-[70vw] h-[70vw] rounded-full mix-blend-multiply filter blur-[140px] opacity-60 animate-blob animation-delay-2000 transition-all duration-1000 ${isDark ? 'bg-deep-purple/30 mix-blend-screen' : 'bg-purple-300/40'}`}></div>
    <div className={`absolute -bottom-[20%] left-[10%] w-[75vw] h-[75vw] rounded-full mix-blend-multiply filter blur-[130px] opacity-50 animate-blob animation-delay-4000 transition-all duration-1000 ${isDark ? 'bg-teal-900/30 mix-blend-screen' : 'bg-teal-glow/20'}`}></div>
    {/* Dynamic Mesh Overlays */}
    <div className="absolute inset-0 liquid-mesh opacity-20"></div>
    {isDark && (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[180px] animate-blob"></div>
    )}
  </div>
);

const HeroSection = ({ onExplore, onOpenEqBank }) => (
  <div className="relative pt-32 pb-20 flex flex-col items-center text-center z-10 px-4">
    <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full advanced-glass mb-10 animate-fade-in-up border-white/60">
      <div className="flex h-2.5 w-2.5 rounded-full bg-teal-glow animate-pulse shadow-[0_0_10px_#2dd4bf]"></div>
      <span className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">Nexus Engine <span className="text-periwinkle">v4.0 Liquid</span></span>
    </div>
    <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.85] drop-shadow-sm">
      Photonics <br/>
      <span className="bg-gradient-to-r from-blue-600 via-deep-purple to-teal-glow bg-clip-text text-transparent animate-gradient-x font-black">Reimagined.</span>
    </h1>
    <p className="text-xl text-slate-500 max-w-2xl font-semibold mb-12 leading-relaxed opacity-80 italic">
      "Where fluid physics meets glassmorphic architecture. Explore the future of light through a tactile, deeply layered interface."
    </p>
    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4 scale-110">
      <button 
        onClick={onExplore}
        className="group relative px-10 py-5 bg-slate-950 text-white rounded-[2rem] font-black tracking-[0.1em] overflow-hidden shadow-[0_20px_50px_-10px_rgba(15,23,42,0.5)] transition-all hover:scale-105 active:scale-95 uppercase text-xs"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-teal-400 opacity-20 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <span className="relative flex items-center justify-center gap-3">
          Explore Pipeline <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
        </span>
      </button>
      <button 
        onClick={onOpenEqBank}
        className="group px-10 py-5 advanced-glass text-slate-800 rounded-[2rem] font-black tracking-[0.1em] hover:bg-white/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 uppercase text-xs border-white/60"
      >
        <Calculator className="w-5 h-5 text-deep-purple" />
        Laboratory Calc
      </button>
    </div>
  </div>
);

const ResourceGrid = ({ onOpenPDF }) => {
  const resources = [
    { id: 1, title: 'Nonlinear Fiber Optics', author: 'Agrawal, G.', type: 'PDF', size: '4.2 MB', color: 'bg-blue-500' },
    { id: 2, title: 'Quantum Photonics Fundamentals', author: 'Smith, J.', type: 'PDF', size: '2.1 MB', color: 'bg-purple-500' },
    { id: 3, title: 'Silicon Photonics Design', author: 'Chrostowski, L.', type: 'PDF', size: '8.4 MB', color: 'bg-pink-500' },
    { id: 4, title: 'Optical Sensors & Systems', author: 'Udd, E.', type: 'PDF', size: '5.6 MB', color: 'bg-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
      {resources.map((res) => (
        <button 
          key={res.id} 
          onClick={() => onOpenPDF(res)}
          className="glass-panel p-6 rounded-[2rem] text-left group hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(31,38,135,0.15)] flex flex-col h-56"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-auto ${res.color} bg-opacity-20 backdrop-blur-md border border-white/30`}>
            <FileText className={`w-6 h-6 ${res.color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-1 leading-tight group-hover:text-blue-600 transition-colors">{res.title}</h4>
            <p className="text-sm text-slate-500 font-medium mb-3">{res.author}</p>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="bg-white/40 px-3 py-1 rounded-full">{res.type}</span>
              <span>{res.size}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

const PdfViewerModal = ({ resource, onClose }) => {
  if (!resource) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-5xl h-full max-h-[90vh] rounded-[2.5rem] relative flex flex-col overflow-hidden shadow-2xl border-white/50 scale-in-center">
        {/* Modal Header */}
        <div className="h-20 border-b border-white/20 bg-white/20 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl bg-opacity-20 ${resource.color}`}>
               <FileText className={`w-6 h-6 ${resource.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{resource.title}</h3>
              <p className="text-xs font-medium text-slate-500">{resource.author} • {resource.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-white/40 text-slate-600 transition-colors"><Download className="w-5 h-5"/></button>
            <button className="p-2 rounded-full hover:bg-white/40 text-slate-600 transition-colors"><Maximize2 className="w-5 h-5"/></button>
            <div className="w-px h-6 bg-slate-300/50 mx-2"></div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/50 bg-white/30 text-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Modal Body (Fake PDF View) */}
        <div className="flex-1 bg-black/5 p-8 overflow-y-auto custom-scrollbar flex justify-center">
           <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl p-12 min-h-[1200px] space-y-6 opacity-90">
              <div className="h-8 bg-slate-200 rounded w-3/4 mb-12"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-64 bg-slate-50 rounded-xl my-8 border border-slate-100 flex items-center justify-center text-slate-300">Figure 1.1</div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-4/6"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

const EquationBank = ({ isOpen, onClose }) => {
  const equations = [
    { name: "Snell's Law", eq: "n₁ sin(θ₁) = n₂ sin(θ₂)", desc: "Describes the relationship between angles of incidence and refraction." },
    { name: "Numerical Aperture", eq: "NA = √(n₁² - n₂²)", desc: "Light-gathering ability of an optical fiber." },
    { name: "V-Number", eq: "V = (2πa/λ) · NA", desc: "Determines the number of modes in a step-index fiber." },
    { name: "Attenuation", eq: "α = (10/L) · log₁₀(P_in / P_out)", desc: "Signal loss over distance in dB/km." }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[150] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md glass-panel !rounded-none !border-r-0 !border-t-0 !border-b-0 z-[160] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between border-b border-white/20">
           <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
             <Calculator className="w-6 h-6 text-purple-500" />
             Equation Bank
           </h2>
           <button onClick={onClose} className="p-2 bg-white/30 hover:bg-white/50 rounded-full transition-colors text-slate-700">
             <X className="w-5 h-5" />
           </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search equations..." 
              className="w-full bg-white/40 border border-white/50 rounded-2xl py-3 pl-12 pr-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/60 transition-all shadow-inner"
            />
          </div>
          {equations.map((item, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl hover:bg-white/40 transition-colors border-white/30 group">
               <h4 className="font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">{item.name}</h4>
               <div className="py-3 px-4 bg-white/50 rounded-xl font-mono text-center text-blue-700 font-bold mb-3 shadow-inner border border-white/40">
                 {item.eq}
               </div>
               <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeModule, setActiveModule] = useState(null);
  const [isHome, setIsHome] = useState(true);
  const [activePdf, setActivePdf] = useState(null);
  const [isEqBankOpen, setIsEqBankOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Introduction');

  const scrollRef = useRef(null);

  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = liquidStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const openModule = (id) => {
    setActiveModule(id);
    setIsHome(false);
  };

  const closeModule = () => {
    setIsHome(true);
    setTimeout(() => setActiveModule(null), 700); // Matches transition duration
  };

  const scrollToModules = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab('Modules');
  };

  const modules = [
    { id: '1', title: 'Module 01', subtitle: 'Fundamentals', icon: <Play className="w-7 h-7"/>, color: 'text-blue-500', bgGlow: 'from-blue-400/20 to-indigo-400/20', desc: 'Total Internal Reflection & Ray Theory.' },
    { id: '2', title: 'Module 02', subtitle: 'Signal Physics', icon: <Activity className="w-7 h-7"/>, color: 'text-purple-500', bgGlow: 'from-purple-400/20 to-fuchsia-400/20', desc: 'Attenuation, Dispersion & Mode Analysis.' },
    { id: '3', title: 'Module 03', subtitle: 'Active Systems', icon: <Zap className="w-7 h-7"/>, color: 'text-rose-500', bgGlow: 'from-rose-400/20 to-orange-400/20', desc: 'Laser Diodes, EDFAs & SOA Physics.' },
    { id: '4', title: 'Module 04', subtitle: 'Sensors & Systems', icon: <GitBranch className="w-7 h-7"/>, color: 'text-emerald-500', bgGlow: 'from-emerald-400/20 to-teal-400/20', desc: 'FBG, Sagnac Gyro & Distributed Sensing.' }
  ];

  const navLinks = ['Introduction', 'Concepts', 'Modules', 'Resources'];

  return (
    <div className="relative min-h-screen w-full font-sans selection:bg-blue-500/30 overflow-hidden flex items-center justify-center p-4 lg:p-8">
      
      {/* GLOBAL LIQUID BACKGROUND */}
      <LiquidBackground isDark={!isHome} />
      
      {/* MAIN ADVANCED GLASS PORTAL */}
      <div className={`relative min-h-[90vh] w-full max-w-[1400px] advanced-glass rounded-[4rem] overflow-hidden flex flex-col transition-all duration-[1000ms] ease-[cubic-bezier(0.23,1,0.32,1)] border-white/60 ${!isHome ? 'scale-[0.98] opacity-0 pointer-events-none translate-y-16' : 'scale-100 opacity-100 translate-y-0'}`}>
        
        {/* REFINED HEADER */}
        <header className="h-28 w-full flex items-center justify-between px-10 lg:px-16 relative z-50 border-b border-white/30 bg-white/10 backdrop-blur-3xl">
          <div className="flex items-center gap-5 group cursor-default">
             <div className="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-blue-500 via-deep-purple to-teal-glow flex items-center justify-center shadow-2xl shadow-indigo-500/40 group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-700 border border-white/40">
                <div className="w-6 h-6 bg-white/95 rounded-xl rotate-45 backdrop-blur-sm shadow-inner" />
             </div>
             <span className="font-black text-3xl tracking-tighter text-slate-900 group-hover:text-periwinkle transition-colors">NEXUS<span className="text-teal-500 opacity-40">_</span>CORE</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 glass-panel px-4 py-2 rounded-full border-white/30 bg-white/20">
            {navLinks.map((link) => (
               <button 
                key={link}
                onClick={() => {
                  setActiveTab(link);
                  if(link === 'Modules') scrollToModules();
                }}
                className={`relative px-5 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${
                  activeTab === link ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
               >
                 {link}
               </button>
            ))}
          </nav>

          <button className="md:hidden p-3 glass-panel rounded-2xl bg-white/30 border-white/40">
            <Menu className="w-6 h-6 text-slate-700" />
          </button>
        </header>

        {/* CONTENT SCROLL AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 lg:px-12 pb-24 scroll-smooth">
          
          <HeroSection 
            onExplore={scrollToModules} 
            onOpenEqBank={() => setIsEqBankOpen(true)}
          />

          {/* ADVANCED MODULE GRID */}
          <section ref={scrollRef} className="mt-32 pt-20 space-y-16 relative">
            <div className="text-center lg:text-left space-y-4 px-4 px-10">
               <div className="inline-block px-4 py-1 rounded-full bg-periwinkle/10 border border-periwinkle/20 text-[10px] font-black uppercase tracking-[0.3em] text-periwinkle mb-2">Simulation Pipeline</div>
               <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Physics <span className="italic text-periwinkle">Modules</span></h3>
               <p className="text-slate-500 font-bold text-xl max-w-xl italic">"Interactive sensory lab encapsulated in fluid glass."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 px-10">
               {modules.map((mod, idx) => (
                  <button 
                    key={mod.id}
                    onClick={() => openModule(mod.id)}
                    className={`group relative h-[420px] advanced-glass rounded-[4rem] overflow-hidden text-left border-white/60 transition-all duration-[800ms] hover:-translate-y-4 ${
                        idx === 0 ? 'ambient-glow-blue' : idx === 1 ? 'ambient-glow-purple' : idx === 2 ? 'ambient-glow-purple' : 'ambient-glow-teal'
                    }`}
                  >
                     {/* Internal Fluid Mesh */}
                     <div className={`absolute inset-0 bg-gradient-to-br ${mod.bgGlow} opacity-30 group-hover:opacity-60 transition-opacity duration-1000 blur-3xl`} />
                     <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-[2000ms]"></div>
                     
                     <div className="absolute inset-0 p-16 flex flex-col justify-between z-10">
                        <div className="flex justify-between items-start">
                           <div className={`w-20 h-20 frosted-container flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-700 group-hover:rotate-[10deg] ${mod.color}`}>
                              {React.cloneElement(mod.icon, { className: 'w-10 h-10' })}
                           </div>
                           <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-slate-400 bg-white/30 px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-white/40 mb-2 backdrop-blur-md">{mod.title}</span>
                                <div className="flex gap-1">
                                    {[1,2,3].map(d => <div key={d} className={`w-1 h-1 rounded-full ${mod.color.replace('text-', 'bg-')} opacity-30`} />)}
                                </div>
                           </div>
                        </div>
                        
                        <div className="space-y-4 relative">
                           <h3 className="text-4xl font-black text-slate-800 tracking-tighter group-hover:text-periwinkle transition-colors leading-[0.9]">{mod.subtitle}</h3>
                           <p className="text-slate-600 font-bold text-lg max-w-[280px] leading-snug italic opacity-80">{mod.desc}</p>
                        </div>

                        <div className="absolute bottom-16 right-16 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 p-5 rounded-[2rem] bg-slate-950 text-white shadow-2xl border border-white/20">
                           <ArrowRight className="w-8 h-8" />
                        </div>
                     </div>
                  </button>
               ))}
            </div>
          </section>

          {/* Research archive */}
          <section className="mt-40 mb-20 relative">
             <div className="flex items-center justify-between mb-12 px-4">
               <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 text-slate-800">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-emerald-500/20 backdrop-blur-md flex items-center justify-center border border-emerald-500/30">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  Research Archive
               </h3>
             </div>
             <ResourceGrid onOpenPDF={(resource) => setActivePdf(resource)} />
          </section>
        </main>
      </div>

      {/* DARK LIQUID MODULE OVERLAY
      */}
      <div className={`absolute inset-0 z-[100] transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHome ? 'translate-y-full opacity-0 pointer-events-none scale-105' : 'translate-y-0 opacity-100 scale-100'
      }`}>
        <div className="h-full w-full relative">
           {activeModule === '1' && <Module1Basics onBack={closeModule} />}
           {activeModule === '2' && <Module2Modes onBack={closeModule} />}
           {activeModule === '3' && <Module3Active onBack={closeModule} />}
           {activeModule === '4' && <Module4Systems onBack={closeModule} />}
        </div>
      </div>

      {/* OVERLAYS */}
      <EquationBank isOpen={isEqBankOpen} onClose={() => setIsEqBankOpen(false)} />
      <PdfViewerModal resource={activePdf} onClose={() => setActivePdf(null)} />
      
    </div>
  );
}