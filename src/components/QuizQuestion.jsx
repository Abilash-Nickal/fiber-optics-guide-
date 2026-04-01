import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, XCircle, Info } from 'lucide-react';

const QuizQuestion = ({ question, working, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  const checkAnswer = () => {
    // Simple check: remove units/spaces, lowercase, check equality
    const sanitizedUser = userAnswer.toLowerCase().replace(/[a-z\s]/g, '').trim();
    const sanitizedAnswer = answer.toLowerCase().replace(/[a-z\s]/g, '').trim();
    
    // Fallback search if it's not a numeric result
    if (sanitizedUser === sanitizedAnswer || answer.toLowerCase().includes(userAnswer.toLowerCase().trim()) && userAnswer.trim().length > 1) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-2xl transition-all duration-500 hover:border-orange-500/20 group relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-orange-500/10 transition-colors" />

      <div className="flex items-start gap-6 mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 flex items-center justify-center border border-orange-500/20 shrink-0 shadow-lg">
          <HelpCircle className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 block">Knowledge Check</span>
          <h4 className="text-xl font-bold text-slate-100 leading-snug">
            {question}
          </h4>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch relative z-10">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Enter your result..." 
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            className="w-full h-full bg-slate-950/80 border border-slate-800 rounded-3xl px-6 py-4 text-white font-mono text-lg focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 outline-none transition-all shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] placeholder:text-slate-700"
          />
        </div>
        <button 
          onClick={checkAnswer}
          className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-3xl transition-all shadow-xl shadow-orange-900/40 active:scale-95 flex items-center justify-center gap-3"
        >
          Verify Node
        </button>
      </div>

      {isCorrect !== null && (
        <div className={`mt-8 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 relative z-10 border shadow-lg ${
          isCorrect 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <div className={`p-2 rounded-xl ${isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest mb-0.5">
              {isCorrect ? 'Validation Successful' : 'Validation Failed'}
            </div>
            <p className="text-sm opacity-80 font-medium">
              {isCorrect ? 'Excellent! Your result matches the expected theoretical output.' : 'Check your units and calculations, and review the derivation below.'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-slate-800/80 pt-6 relative z-10">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-orange-400 transition-colors group/btn"
        >
          <div className="p-1 px-1.5 bg-slate-800 rounded border border-slate-700 group-hover/btn:border-orange-500/30 transition-colors">
            <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
          {isOpen ? 'Conceal Mathematical Track' : 'Access Derivation Log'}
        </button>
        
        {isOpen && (
           <div className="mt-6 p-8 bg-slate-950/40 rounded-[2rem] border border-slate-800/60 animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden group/derivation">
              <div className="absolute top-0 right-0 p-4 opacity-5 bg-orange-400 rounded-bl-3xl" />
              
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Info className="w-4 h-4 text-orange-500/60" />
                 </div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Theoretical Trace Console</span>
              </div>
              
              <div className="space-y-4">
                {working.split('\n').map((line, idx) => (
                  <div key={idx} className="flex gap-4 items-start font-mono text-sm">
                    <span className="text-slate-700 select-none">0{idx + 1}</span>
                    <span className="text-slate-400 leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Computed Constant</span>
                    <div className="text-lg font-black text-white bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700 mt-1 inline-block">
                       {answer}
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational Status</span>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isCorrect ? 'text-emerald-500' : 'text-slate-500 animate-pulse'}`}>
                       {isCorrect ? '● Verified Output' : '○ Standby for User Input'}
                    </div>
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestion;
