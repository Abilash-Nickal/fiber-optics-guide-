import React from 'react';
import { X, BookOpen, Download, Layout, ShieldAlert } from 'lucide-react';

const PdfViewerModal = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop with motion fade */}
      <div 
        className="absolute inset-0 bg-navy/20 backdrop-blur-md animate-in fade-in duration-500 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Container with pop-up animation */}
      <div className="relative w-full h-full max-w-7xl glass-card rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 border-white/20">
        
        {/* Glow behind modal */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Modal Header */}
        <header className="flex items-center justify-between px-8 py-6 glass-navy border-x-0 border-t-0 rounded-none relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/20">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">{resource.title}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold uppercase tracking-widest">
                  Secure Resource
                </span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">Viewer Engine v2.0</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href={`/resource/${resource.filename}`} 
              download 
              className="group p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50"
              title="Download to Offline"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <button 
              onClick={onClose}
              className="p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 rounded-xl transition-all border border-slate-700/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Viewer Area */}
        <div className="flex-1 bg-white/5 relative overflow-hidden flex flex-col group backdrop-blur-sm">
          {/* PDF Frame */}
          <iframe 
            src={`/resource/${resource.filename}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-none relative z-10"
            title={resource.title}
          />
          
          {/* Loading / Placeholder State (Layered behind) */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 z-0">
             <Layout className="w-12 h-12 text-slate-800 animate-pulse" />
             <div className="text-slate-800 font-black text-2xl uppercase tracking-[0.5em]">Loading Node</div>
          </div>

          {/* Interactive Layer Overlay (Top-right) */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">Encryption Active</span>
            </div>
          </div>
        </div>

        {/* Action Bar / Modal Footer */}
        <footer className="px-8 py-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-slate-400">
          <div className="text-[9px] font-black uppercase tracking-[0.3em]">
            Digital Learning Infrastructure • {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] font-bold uppercase tracking-widest group-hover:text-cyan-400 transition-colors">Server Operational</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="text-[9px] font-bold uppercase tracking-widest hover:text-white cursor-help transition-colors">
              Access Support
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PdfViewerModal;
