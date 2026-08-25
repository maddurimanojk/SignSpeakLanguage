import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export const ResearchComparisonTable: React.FC = () => {
  const comparisonData = [
    { feature: 'Real-time Translation', gesture: 'Limited', written: 'No', signSpeak: 'Yes' },
    { feature: 'Audio Speech Output', gesture: 'No', written: 'No', signSpeak: 'Yes' },
    { feature: 'Human Interpreter Required', gesture: 'Sometimes', written: 'No', signSpeak: 'No' },
    { feature: 'Automated ML Recognition', gesture: 'No', written: 'No', signSpeak: 'Yes' },
    { feature: 'Accessibility Level', gesture: 'Limited', written: 'Moderate', signSpeak: 'Designed for Accessibility' },
    { feature: 'AI Assistance', gesture: 'No', written: 'No', signSpeak: 'Yes' },
  ];

  return (
    <section className="py-24 relative bg-slate-950/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Comparative Analysis</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            SignSpeak AI vs. Traditional Methods
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Side-by-side feature matrix evaluating SignSpeak AI against conventional communication approaches.
          </p>
        </div>

        {/* Responsive Table Card */}
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-xs uppercase tracking-wider font-extrabold text-slate-300">
                  <th className="py-5 px-6">Communication Feature</th>
                  <th className="py-5 px-6 text-slate-400">Traditional Gesture</th>
                  <th className="py-5 px-6 text-slate-400">Written Note Communication</th>
                  <th className="py-5 px-6 text-cyan-400 bg-cyan-950/20">SignSpeak AI System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm">
                {comparisonData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4.5 px-6 font-bold text-white">{row.feature}</td>
                    <td className="py-4.5 px-6 text-slate-400">
                      {row.gesture === 'No' ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-400"><X className="w-4 h-4" /> No</span>
                      ) : (
                        row.gesture
                      )}
                    </td>
                    <td className="py-4.5 px-6 text-slate-400">
                      {row.written === 'No' ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-400"><X className="w-4 h-4" /> No</span>
                      ) : (
                        row.written
                      )}
                    </td>
                    <td className="py-4.5 px-6 font-extrabold text-cyan-300 bg-cyan-950/20">
                      {row.signSpeak === 'Yes' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400"><Check className="w-4 h-4" /> Yes</span>
                      ) : (
                        row.signSpeak
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
