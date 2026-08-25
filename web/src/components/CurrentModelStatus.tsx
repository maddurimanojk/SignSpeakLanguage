import React from 'react';
import { AlertTriangle, Clock, Info } from 'lucide-react';

export const CurrentModelStatus: React.FC = () => {
  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white">Model Evaluation Audit Status</h3>
              <p className="text-xs text-amber-400/90 font-semibold">Model evaluation pending methodological verification</p>
            </div>
          </div>

          {/* Status Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-slate-400">Dataset Scope</span>
                <span className="text-sm font-bold text-white">ISL Alphabet Image Dataset</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-extrabold">
                <Info className="w-3.5 h-3.5" />
                STATIC ALPHABET
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="block text-xs font-semibold text-slate-400">Methodological Audit</span>
                <span className="text-sm font-bold text-white">Provenance Audit Active</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
                <Clock className="w-3.5 h-3.5" />
                UNDER REVIEW
              </span>
            </div>

          </div>

          <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
            SignSpeak AI enforces strict academic provenance standards. All claims regarding static ISL alphabet classification vs. temporal word translation are undergo independent methodological verification.
          </p>

        </div>
      </div>
    </section>
  );
};
