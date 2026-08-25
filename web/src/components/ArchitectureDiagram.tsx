import React from 'react';
import { Camera, Smartphone, Cpu, Sliders, Layers, Server, Brain, FileText, Volume2, ArrowDown, ArrowRight } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const nodes = [
    { title: 'Mobile Camera', sub: '25 FPS Video Input', icon: Camera },
    { title: 'Expo / React Native', sub: 'Mobile Application', icon: Smartphone },
    { title: 'MediaPipe Hands', sub: 'Landmark Extraction', icon: Cpu },
    { title: '21 Hand Landmarks', sub: 'Raw Coordinates', icon: Layers },
    { title: 'Wrist Normalization', sub: 'Scale Invariant (42 Floats)', icon: Sliders },
    { title: '15-Frame Buffer', sub: 'Temporal Sequence', icon: Layers },
    { title: 'FastAPI Backend', sub: 'REST AI Server', icon: Server },
    { title: 'TensorFlow / Keras', sub: '2-Layer LSTM Model', icon: Brain },
    { title: 'Sign Classification', sub: 'Softmax Probability', icon: Brain },
    { title: 'Sentence Builder', sub: 'Temporal Debouncer', icon: FileText },
    { title: 'Text-to-Speech', sub: 'Native Audio Output', icon: Volume2 },
  ];

  return (
    <section className="py-24 relative bg-slate-950/90 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">System Blueprint</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            End-to-End System Architecture
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Technical dataflow detailing how live video frames are converted into normalized landmark tensors, classified by neural networks, and synthesized into speech.
          </p>
        </div>

        {/* System Diagram Flow */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={i} className="relative group">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-secondary transition-all flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-white mb-0.5">{node.title}</span>
                      <span className="block text-[10px] text-slate-400">{node.sub}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
