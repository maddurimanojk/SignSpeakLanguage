import React from 'react';
import { MessageSquareOff, EyeOff, UserCheck } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: MessageSquareOff,
      title: 'Communication Gap',
      description: 'Over 63 million people in India are deaf or hard of hearing. Most non-signers cannot understand Indian Sign Language (ISL), creating severe communication barriers in daily life.',
      color: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      icon: EyeOff,
      title: 'Limited Accessibility',
      description: 'Essential public services—including healthcare, legal systems, financial institutions, and emergency services—frequently lack accessible sign language support.',
      color: 'from-rose-500/20 to-rose-500/5',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
    },
    {
      icon: UserCheck,
      title: 'Dependence on Interpreters',
      description: 'Human sign language interpreters are scarce, expensive, and unavailable 24/7. Continuous reliance on third-party interpreters restricts personal autonomy and privacy.',
      color: 'from-indigo-500/20 to-indigo-500/5',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
    },
  ];

  return (
    <section className="py-24 relative bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">The Core Problem</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Communication Should Be Accessible to Everyone
          </p>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Deaf and hard-of-hearing individuals face persistent societal and technological isolation due to the lack of real-time sign language translation tools.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className={`glass-panel p-8 rounded-3xl border ${prob.borderColor} bg-gradient-to-b ${prob.color} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-900 border ${prob.borderColor} flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${prob.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{prob.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{prob.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
