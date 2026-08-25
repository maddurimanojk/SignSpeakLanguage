import React from 'react';
import { Camera, Scan, Cpu, Volume2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      stepNum: '01',
      title: 'Capture Live Feed',
      subtitle: 'Real-Time Camera Stream',
      description: 'The user points the smartphone camera towards a person performing Indian Sign Language. The application streams video frames at 25 FPS.',
      icon: Camera,
      badge: 'Expo Camera API',
    },
    {
      stepNum: '02',
      title: 'Detect Hand Landmarks',
      subtitle: '21-Point Skeleton Extraction',
      description: 'MediaPipe Hands detects the user’s hand and extracts 21 key joint coordinates (wrist, knuckles, fingertips) in real-time coordinates.',
      icon: Scan,
      badge: 'MediaPipe Vision',
    },
    {
      stepNum: '03',
      title: 'Recognize Sequence',
      subtitle: 'Deep LSTM Classification',
      description: 'Hand coordinates are wrist-normalized for scale and translation invariance, then fed into a 2-layer Keras LSTM sequence model for classification.',
      icon: Cpu,
      badge: 'TensorFlow / Keras',
    },
    {
      stepNum: '04',
      title: 'Speak Aloud',
      subtitle: 'Text & Audio Synthesis',
      description: 'Temporal debouncing confirms gesture intent, appends the word to the sentence builder, and triggers natural Text-to-Speech audio output.',
      icon: Volume2,
      badge: 'Text-to-Speech Engine',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative bg-slate-950/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">System Architecture Flow</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            How SignSpeak AI Works
          </p>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            A 4-step automated processing pipeline engineered for low latency, privacy, and high accuracy.
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-slate-600 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-secondary transition-colors">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>
                  <span className="text-4xl font-black text-slate-800 group-hover:text-primary/40 transition-colors">
                    {s.stepNum}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300 mb-2 border border-slate-700">
                    {s.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <span className="block text-xs font-semibold text-secondary mb-3">{s.subtitle}</span>
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
