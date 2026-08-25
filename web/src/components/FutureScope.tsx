import React from 'react';
import { Sparkles, Layers, Users, Zap, Globe, Smartphone, ShieldCheck } from 'lucide-react';

export const FutureScope: React.FC = () => {
  const futureItems = [
    { title: 'Expand Vocabulary', desc: 'Expanding sign recognition beyond 27 core signs to 100+ ISL gestures.', icon: Layers },
    { title: 'Multi-Participant Trials', desc: 'Engaging 50+ diverse signers across age groups and regions.', icon: Users },
    { title: 'Multiple Hand Support', desc: 'Simultaneous 2-hand landmark tracking for complex compound signs.', icon: Sparkles },
    { title: 'Continuous Sentence Recognition', desc: 'Translating fluid sign language sentences without inter-sign pauses.', icon: Zap },
    { title: 'Regional Sign Dialects', desc: 'Supporting regional variations across Indian Sign Language dialects.', icon: Globe },
    { title: 'On-Device Edge Inference', desc: 'Quantized TFLite models executing predictions 100% offline on smartphone NPUs.', icon: Smartphone },
    { title: 'Bidirectional Speech-to-Sign', desc: 'Converting spoken voice into 3D avatar ISL animations for two-way conversation.', icon: ShieldCheck },
  ];

  return (
    <section className="py-24 relative bg-slate-900/40 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Future Roadmap</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Future Research & System Expansion
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Planned technological enhancements and research extensions for SignSpeak AI.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-slate-600 transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
