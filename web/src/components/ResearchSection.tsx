import React from 'react';
import { Target, Clock, CheckCircle2, HeartHandshake, User, ArrowRight } from 'lucide-react';

export const ResearchSection: React.FC = () => {
  const comparisonMethods = [
    {
      title: 'Traditional Gesture',
      desc: 'Relying on ad-hoc unstandardized body movements and facial expressions without sign language training.',
      speed: 'Slow & Unclear',
      accuracy: 'Low (< 40%)',
    },
    {
      title: 'Written Communication',
      desc: 'Writing messages on paper or mobile notepad apps to convey information.',
      speed: 'Tedious / Interrupted',
      accuracy: 'High (100% text)',
    },
    {
      title: 'SignSpeak AI System',
      desc: 'Real-time computer vision landmark extraction with deep learning classification & instant voice speech.',
      speed: 'Real-Time (< 500ms)',
      accuracy: 'AI Model Evaluated',
    },
  ];

  return (
    <section id="research" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Academic Methodology</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Measuring Communication Effectiveness
          </p>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            The core research hypothesis evaluates whether real-time AI sign language translation significantly improves communication speed, accuracy, and accessibility compared to traditional non-verbal methods.
          </p>
        </div>

        {/* 3 Comparison Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {comparisonMethods.map((m, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <span className="text-xs font-extrabold text-secondary uppercase tracking-wider">Method 0{idx + 1}</span>
              <h3 className="text-xl font-bold text-white">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.desc}</p>
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="block text-slate-500 font-semibold">Speed</span>
                  <span className="font-bold text-slate-200">{m.speed}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-semibold">Accuracy</span>
                  <span className="font-bold text-slate-200">{m.accuracy}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Experimental Methodology Diagram */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-700/80 bg-slate-900/60">
          <h3 className="text-lg font-bold text-white text-center mb-8">
            Experimental Protocol Workflow
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-3 text-center">
            {[
              'Participant Selection',
              'Communication Task',
              'Method Assignment',
              'Gesture Processing',
              'Measure Speed & Accuracy',
              'User Satisfaction Survey',
              'Statistical Analysis'
            ].map((node, i, arr) => (
              <React.Fragment key={i}>
                <div className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 shadow-md">
                  {node}
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-secondary hidden sm:block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
