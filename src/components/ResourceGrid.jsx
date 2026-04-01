import React from 'react';
import { FileText, ExternalLink, Download, BookOpen, Activity, Layers, GitBranch } from 'lucide-react';

const ResourceGrid = ({ onOpenPDF }) => {
  const resources = [
    {
      id: 1,
      title: "Module 01: Fundamentals",
      description: "Basics of light, refraction, and Total Internal Reflection (TIR).",
      filename: "FIBERS_01_25.pdf",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />
    },
    {
      id: 2,
      title: "Module 02: Signal Degradation",
      description: "Attenuation, scattering, and modal/chromatic dispersion.",
      filename: "FIBERS_02_25.pdf",
      icon: <Activity className="w-6 h-6 text-indigo-600" />
    },
    {
      id: 3,
      title: "Module 03: Active Systems",
      description: "Optical sources (LED/Laser) and light detectors.",
      filename: "FIBERS_03_25.pdf",
      icon: <Layers className="w-6 h-6 text-emerald-600" />
    },
    {
      id: 4,
      title: "Module 04: Link Budgets & WDM",
      description: "Loss calculations and Multiplexing architectures.",
      filename: "FIBERS_04_25.pdf",
      icon: <GitBranch className="w-6 h-6 text-amber-600" />
    },
    {
      id: 5,
      title: "Core Textbook",
      description: "Optical Fiber Communications: Principles and Practice.",
      filename: "optical-fiber-communications-principles-and-pr (1).pdf",
      icon: <FileText className="w-6 h-6 text-cyan-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((res) => (
        <div 
          key={res.id}
          className="group relative glass-card rounded-[1.5rem] p-6 transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/60 shadow-xl"
        >
          {/* Subtle Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 group-hover:border-cyan-500/20 transition-colors">
              {res.icon}
            </div>
            <button 
              onClick={() => onOpenPDF(res)}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Open View"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-indigo-600 transition-colors">
              {res.title}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {res.description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              PDF Archive
            </span>
            <button 
              onClick={() => onOpenPDF(res)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group/btn"
            >
              View Document
              <Download className="w-3 h-3 group-hover/btn:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceGrid;
