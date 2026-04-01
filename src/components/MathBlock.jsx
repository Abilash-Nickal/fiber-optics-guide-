import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

/**
 * MathBlock — renders a LaTeX equation in a high-contrast white container.
 * Enforces BOLD BLACK fonts as requested for the Corporate Lab aesthetic.
 */
export const MathBlock = ({ math, label, color = 'border-white/20' }) => (
  <div className={`my-4 glass-card border-2 ${color} overflow-hidden transition-all duration-300 hover:bg-white/50`}>
    <div className="px-8 py-6 flex items-center justify-center text-black active:scale-[0.98] transition-transform">
      <style>{`
        .katex { font-weight: 800 !important; color: #000 !important; opacity: 1 !important; } 
        .katex .mathnormal, .katex .mathit, .katex .mathrm { font-weight: 800 !important; color: #000 !important; }
      `}</style>
      <BlockMath math={String(math)} />
    </div>
    {label && (
      <div className="px-4 py-2 text-center text-[10px] font-black text-navy border-t border-white/10 bg-white/5 backdrop-blur-md tracking-[0.2em] uppercase">
        {label}
      </div>
    )}
  </div>
);

/**
 * MathInline — high-contrast inline LaTeX with bold black styling.
 */
export const MathInline = ({ math }) => (
  <span className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-white/30 backdrop-blur-sm border border-white/20 text-black font-extrabold align-middle transition-all hover:bg-white/60">
    <style>{`.katex { font-weight: 800 !important; color: #000 !important; }`}</style>
    <InlineMath math={String(math)} />
  </span>
);

/**
 * MathStep — high-contrast numbered derivation step.
 */
export const MathStep = ({ step, text, math, color = 'text-indigo-600' }) => (
  <div className="flex gap-4 items-start mb-6 group">
    <span className={`shrink-0 w-8 h-8 rounded-lg border-2 ${color.replace('text-', 'border-')} flex items-center justify-center text-xs font-black ${color} glass-card shadow-sm group-hover:bg-white/60 transition-colors`}>
      {step}
    </span>
    <div className="flex-1">
      <p className="text-sm text-slate-600 leading-relaxed font-medium">{text}</p>
      {math && (
        <div className="mt-3">
          <MathBlock math={math} color="border-indigo-100" />
        </div>
      )}
    </div>
  </div>
);

/**
 * EquationCheatSheet — Summarized equation node for sections.
 */
export const EquationCheatSheet = ({ equations, title = 'Equation Summary' }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mt-12 glass-card rounded-[2rem] overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-8 py-5 bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-navy rounded-lg">
            <span className="text-white text-xs">f(x)</span>
          </div>
          <span className="font-bold text-sm text-navy uppercase tracking-widest">{title}</span>
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
            {equations.length} nodes
          </span>
        </div>
        <span className={`text-slate-400 font-bold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="divide-y divide-white/10">
          {equations.map((eq, i) => (
            <div key={i} className="px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:bg-white/10 transition-colors">
              <div className="lg:col-span-5">
                <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${eq.color || 'text-indigo-600'}`}>
                  {eq.name}
                </div>
                <MathBlock math={eq.math} color="border-white/10" />
              </div>
              <div className="lg:col-span-7 glass-card p-5 rounded-xl border border-white/10 shadow-inner">
                <p className="text-xs text-navy leading-relaxed font-medium italic">
                  "{eq.description}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
