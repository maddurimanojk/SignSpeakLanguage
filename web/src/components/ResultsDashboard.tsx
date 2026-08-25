import React from 'react';
import { AlertTriangle, Clock, Layers, ShieldCheck } from 'lucide-react';

export const ResultsDashboard: React.FC = () => {
  return (
    <section id="results" className="py-24 relative bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400">Methodological Audit in Progress</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Model Evaluation Status
          </p>
          <p className="text-base text-amber-400/90 font-semibold leading-relaxed">
            Model evaluation pending methodological verification
          </p>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Status</span>
            <div className="text-xl font-extrabold text-amber-300">Pending Verification</div>
            <span className="block text-[11px] text-slate-400">Methodological Audit</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Dataset Type</span>
            <div className="text-xl font-extrabold text-white">ISL Alphabet Images</div>
            <span className="block text-[11px] text-cyan-400 font-semibold">26 Static Gesture Classes</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-purple-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Scope Distinction</span>
            <div className="text-xl font-extrabold text-white">Alphabet vs Word</div>
            <span className="block text-[11px] text-slate-400">Static Gesture Classification</span>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Standard</span>
            <div className="text-xl font-extrabold text-white">Non-Fabrication</div>
            <span className="block text-[11px] text-emerald-400 font-semibold">Provenanced Research</span>
          </div>

        </div>

        {/* Audit Note */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-4">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-1">Academic Provenance Notice</span>
            SignSpeak AI distinguishes static ISL alphabet gesture recognition from full temporal ISL word/sentence translation. Held-out test evaluation results are published only after complete verification of dataset provenance and temporal sequence construction.
          </div>
        </div>

      </div>
    </section>
  );
};
