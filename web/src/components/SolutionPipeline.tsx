import React from 'react';
import { Camera, Scan, Layers, SlidersHorizontal, BrainCircuit, FileText, Volume2 } from 'lucide-react';

export const SolutionPipeline: React.FC = () => {
  const steps = [
    { icon: Camera, name: 'Camera', desc: 'Live Video Feed' },
    { icon: Scan, name: 'Hand Detection', desc: 'Bounding Box' },
    { icon: Layers, name: '21 Landmarks', desc: 'Joint Extraction' },
    { icon: SlidersHorizontal, name: 'Normalization', desc: 'Scale Invariant' },
    { icon: BrainCircuit, name: 'AI Classification', desc: 'Keras LSTM' },
    { icon: FileText, name: 'Text Output', desc: 'Sentence Builder' },
    { icon: Volume2, name: 'Speech Synthesis', desc: 'Text-to-Speech' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">The Solution</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            From Sign to Speech — In Real Time
          </p>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            SignSpeak AI converts complex spatio-temporal hand gestures into natural audio speech through a seamless 7-stage computer vision & deep learning pipeline.
          </p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="relative">
          {/* Connecting Track Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-primary via-secondary to-emerald-400 -translate-y-1/2 opacity-30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-5 rounded-2xl border border-slate-700/80 bg-slate-900/80 text-center flex flex-col items-center justify-center transition-all duration-300 hover:border-secondary hover:shadow-lg hover:shadow-secondary/10 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-3 group-hover:bg-primary/20 group-hover:border-primary transition-colors">
                    <Icon className="w-6 h-6 text-secondary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Step 0{idx + 1}</span>
                  <span className="text-sm font-bold text-white mb-0.5">{step.name}</span>
                  <span className="text-[11px] text-slate-400">{step.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
