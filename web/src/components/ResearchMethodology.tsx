import React from 'react';
import { Database, ShieldCheck, Users, Brain, FileCheck } from 'lucide-react';

export const ResearchMethodology: React.FC = () => {
  return (
    <section className="py-24 relative bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Scientific Rigor</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Research Methodology & Data Integrity
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Ensuring reproducible machine learning experiments and uncompromised academic standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Column: Participant-Aware Splitting Explanation */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Participant-Aware Group Splitting</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Standard random train/test splits can cause severe <strong>data leakage</strong> if multiple sequence frames from the same individual participant appear in both training and test sets.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              SignSpeak AI enforces <strong>Group-Based Partitioning</strong> (`GroupKFold`), where all gesture recordings from a participant are assigned exclusively to either the training set, validation set, or held-out test set. This ensures true generalization to unseen signers.
            </p>
          </div>

          {/* Right Column: Synthetic vs Real Human Data Isolation */}
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white">Synthetic vs. Real Human Dataset Isolation</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              During initial software development, synthetic landmark sequences were generated solely to verify the end-to-end tensor pipeline, FastAPI REST contracts, and mobile UI components.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>Synthetic data is strictly isolated</strong> (`dataset/`) and is <strong>never</strong> mixed into final model training or evaluation. Final research conclusions will rely 100% on real human participant recordings (`dataset_real/`).
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
