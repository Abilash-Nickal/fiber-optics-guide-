import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const HeroSection = ({ onExplore, onOpenEqBank }) => {
  const features = [
    "Industry Standard",
    "Lab-Verified Physics",
    "Advanced Photonix"
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12 px-6 lg:px-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-slate-500 tracking-wide">
            Hello, Welcome to
          </h2>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight">
            Photonics <span className="text-periwinkle drop-shadow-sm">Nexus.</span>
          </h1>
          <p className="text-2xl lg:text-3xl font-bold text-slate-700">
            Professional Optical Fiber Learning Portal
          </p>
        </div>

        <div className="flex flex-wrap justify-center lg:justify-start gap-4 py-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <div className="w-2.5 h-2.5 rounded-full bg-periwinkle shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:scale-125 transition-transform" />
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
          <button 
            onClick={onExplore}
            className="px-10 py-4 bg-periwinkle text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:scale-105 hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.5)] transition-all active:scale-95"
          >
            Explore Modules
          </button>
          
          <button 
            onClick={onOpenEqBank}
            className="glass-button text-slate-700 border-slate-200 hover:border-periwinkle/30 hover:text-periwinkle transition-all"
          >
            Equation Bank
          </button>
        </div>
      </div>

      {/* Right Content - Character Circle */}
      <div className="relative flex-shrink-0">
        {/* Glow behind the circle */}
        <div className="absolute inset-0 bg-periwinkle/20 blur-[80px] rounded-full animate-pulse" />
        
        <div className="relative w-72 h-72 lg:w-[450px] lg:h-[450px] rounded-full border-[12px] border-white shadow-2xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-slate-50 to-white">
           <img 
             src="/assets/hero-character.png" 
             alt="Physicist Avatar" 
             className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-[2000ms] ease-out"
           />
           
           {/* Inner Ring Glow */}
           <div className="absolute inset-0 border-[2px] border-periwinkle/20 rounded-full" />
        </div>
        
        {/* Floating Accent Icons or Blobs can go here */}
        <div className="absolute -top-4 -right-4 w-16 h-16 glass-card rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <div className="w-6 h-6 bg-periwinkle rounded-lg rotate-45 shadow-glow shadow-periwinkle/40" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
