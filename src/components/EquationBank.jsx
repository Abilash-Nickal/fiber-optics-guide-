import React, { useState } from 'react';
import { Search, X, Calculator, BookOpen, Target, Zap } from 'lucide-react';
import { MathBlock } from './MathBlock';

/**
 * EquationBank — A searchable repository of all mathematical formulas
 * in the Fiber Optics Learning Portal.
 */
const EquationBank = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  const equations = [
    // Module 1
    { segment: 'Module 1', name: 'Snell\'s Law', math: 'n_0 \\sin\\theta_0 = n_1 \\sin\\theta_1', description: 'Governs refraction at the core-cladding interface.', tags: ['refraction', 'basics'] },
    { segment: 'Module 1', name: 'Critical Angle', math: '\\theta_c = \\sin^{-1}(n_2/n_1)', description: 'Minimum angle for Total Internal Reflection (TIR).', tags: ['TIR', 'basics'] },
    { segment: 'Module 1', name: 'Numerical Aperture (NA)', math: 'NA = (n_1^2 - n_2^2)^{1/2}', description: 'The light-gathering capacity of the fiber.', tags: ['acceptance', 'basics'] },
    { segment: 'Module 1', name: 'Skew Ray NA', math: 'NA_{\\text{skew}} = \\frac{NA}{\\cos\\gamma}', description: 'NA corrected for rays not passing through the core axis.', tags: ['skew', 'advanced'] },
    { segment: 'Module 1', name: 'V-Parameter', math: 'V = \\frac{2\\pi a}{\\lambda} NA', description: 'Normalized frequency determining the number of modes.', tags: ['modes', 'design'] },
    { segment: 'Module 1', name: 'Cutoff Wavelength', math: '\\lambda_c = \\frac{2\\pi a n_1}{V_c}(2\\Delta)^{1/2}', description: 'Wavelength below which the fiber becomes multimode.', tags: ['cutoff', 'design'] },
    
    // Module 2
    { segment: 'Module 2', name: 'Attenuation (dB)', math: '\\alpha_{\\text{dB}} = -\\frac{10}{L}\\log_{10}\\left(\\frac{P_{out}}{P_{in}}\\right)', description: 'Signal loss over distance.', tags: ['loss', 'attenuation'] },
    { segment: 'Module 2', name: 'Material Dispersion', math: 'D_m = -\\frac{\\lambda}{c} \\frac{d^2n}{d\\lambda^2}', description: 'Broadening due to wavelength-dependent refractive index.', tags: ['dispersion', 'broadening'] },
    { segment: 'Module 2', name: 'Waveguide Dispersion', math: 'D_w = -\\frac{n_2\\Delta}{c\\lambda} V \\frac{d^2(Vb)}{dV^2}', description: 'Broadening due to the guiding structure.', tags: ['dispersion', 'broadening'] },
    
    // Module 3
    { segment: 'Module 3', name: 'Lasing Condition', math: 'R_1 R_2 e^{2(\\bar{g}-\\alpha_i)L} = 1', description: 'Threshold requirement for laser oscillation.', tags: ['laser', 'gain'] },
    { segment: 'Module 3', name: 'Responsivity', math: 'R = \\frac{\\eta q}{h\\nu}', description: 'Photodetector efficiency in converting light to current.', tags: ['detector', 'efficiency'] },
    
    // Module 4
    { segment: 'Module 4', name: 'Bragg Wavelength', math: '\\lambda_B = 2 n_{eff} \\Lambda', color: 'text-emerald-600', description: 'Resonant reflection wavelength for FBGs.', tags: ['sensor', 'FBG'] },
    { segment: 'Module 4', name: 'Noise Figure (NF)', math: 'NF = \\frac{SNR_{in}}{SNR_{out}}', description: 'Signal-to-noise ratio degradation in amplifiers.', tags: ['amplifier', 'noise'] },
  ];

  const filtered = equations.filter(eq => 
    eq.name.toLowerCase().includes(search.toLowerCase()) ||
    eq.description.toLowerCase().includes(search.toLowerCase()) ||
    eq.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
      <div className="absolute inset-0 bg-navy/20 backdrop-blur-md pointer-events-auto" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl h-full max-h-[85vh] glass-card rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-300 border-white/30">
        
        {/* Header */}
        <div className="px-8 py-6 glass-navy text-white flex items-center justify-between shrink-0 border-x-0 border-t-0 rounded-none">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calculator className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Equation Bank</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-blue-300 font-bold">Comprehensive Photonics Reference</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-8 py-6 border-b border-white/10 bg-white/5 backdrop-blur-md shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, tag, or concept (e.g., 'Dispersion', 'NA')..."
              className="w-full pl-12 pr-4 py-3 glass-card border border-white/20 rounded-xl text-sm focus:ring-2 focus:ring-navy focus:border-navy outline-none transition-all placeholder:text-slate-400 font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((eq, i) => (
              <div key={i} className="group p-6 rounded-2xl glass-card hover:bg-white/60 hover:border-indigo-300/50 hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded">
                      {eq.segment}
                    </span>
                    <div className="flex gap-1">
                      {eq.tags.map(t => (
                        <span key={t} className="text-[8px] font-black text-indigo-600 uppercase px-1.5 py-0.5 rounded glass-card border border-white/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-sm font-black text-navy mb-3 group-hover:text-gold transition-colors">
                    {eq.name}
                  </h3>
                  <MathBlock math={eq.math} color="border-white/10" />
                </div>
                <p className="mt-4 text-[11px] text-slate-500 leading-relaxed font-medium italic">
                  "{eq.description}"
                </p>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No equations found matching "{search}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-white/5 backdrop-blur-md border-t border-white/10 text-center shrink-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Expert Photonics Reference Node • Validated Academic Content
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquationBank;
