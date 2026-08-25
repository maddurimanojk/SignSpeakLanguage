import React from 'react';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';

export const ModelTimeline: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1',
      title: 'Mobile & Web Prototype',
      status: 'Completed',
      isDone: true,
      desc: 'React Native Expo mobile app, UI components, TTS integration, and local SQLite history.',
    },
    {
      phase: 'Phase 2',
      title: 'AI & Inference Pipeline',
      status: 'Completed',
      isDone: true,
      desc: 'MediaPipe landmark normalization, FastAPI REST endpoints, sequence buffer, and 384+ unit tests.',
    },
    {
      phase: 'Phase 3',
      title: 'Real Human Dataset',
      status: 'Ready for Collection',
      isDone: false,
      isCurrent: true,
      desc: 'MediaPipe-based live webcam collector tool (ml/collect_landmarks.py) ready for human sessions.',
    },
    {
      phase: 'Phase 4',
      title: '10-Class Model Training',
      status: 'Pending Dataset',
      isDone: false,
      desc: 'Participant-aware train/val/test splitting and Keras LSTM training on 10 core ISL signs.',
    },
    {
      phase: 'Phase 5',
      title: '27-Class Expansion',
      status: 'Future',
      isDone: false,
      desc: 'Expanding data collection and model binary to full 27-sign ISL research vocabulary.',
    },
    {
      phase: 'Phase 6',
      title: 'Real-World Evaluation',
      status: 'Future',
      isDone: false,
      desc: 'Live participant comparative testing against traditional communication methods.',
    },
  ];

  return (
    <section className="py-24 relative bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Development Roadmap</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Model Development Status
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Transparent breakdown of project milestones from prototype software engineering to human participant trials.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((p, idx) => (
            <div
              key={idx}
              className={`glass-panel p-6 rounded-3xl border transition-all ${
                p.isDone
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : p.isCurrent
                  ? 'border-cyan-500/60 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{p.phase}</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    p.isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : p.isCurrent
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {p.isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {p.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
