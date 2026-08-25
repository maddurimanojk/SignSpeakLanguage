import React from 'react';
import { Smartphone, Code, Cpu, Server, Database, Volume2, ShieldCheck, Activity } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  const techStack = [
    {
      name: 'React Native',
      category: 'Mobile Frontend',
      description: 'Cross-platform mobile UI framework powering native performance on iOS & Android.',
      icon: Smartphone,
    },
    {
      name: 'Expo Router',
      category: 'Mobile Framework',
      description: 'File-based routing, native camera access, and module integration via Expo SDK 52.',
      icon: Code,
    },
    {
      name: 'TypeScript',
      category: 'Language',
      description: 'Strict type safety across mobile application and backend services.',
      icon: ShieldCheck,
    },
    {
      name: 'MediaPipe Hands',
      category: 'Computer Vision',
      description: 'Google MediaPipe solution extracting 21 3D hand landmarks in real-time frame rates.',
      icon: Cpu,
    },
    {
      name: 'OpenCV',
      category: 'Image Processing',
      description: 'Computer vision library for frame preprocessing, format conversions, and visualization.',
      icon: Activity,
    },
    {
      name: 'Python 3.10',
      category: 'Machine Learning',
      description: 'Scientific computing runtime for MediaPipe, Scikit-Learn, and TensorFlow model training.',
      icon: Code,
    },
    {
      name: 'FastAPI',
      category: 'REST Backend',
      description: 'High-performance asynchronous Python web framework serving AI prediction endpoints.',
      icon: Server,
    },
    {
      name: 'TensorFlow & Keras',
      category: 'Deep Learning',
      description: 'Neural network training and inference engine executing sequence classification models.',
      icon: Activity,
    },
    {
      name: 'LSTM Architecture',
      category: 'Neural Network',
      description: 'Long Short-Term Memory recurrent layers capturing spatio-temporal gesture dynamics.',
      icon: Cpu,
    },
    {
      name: 'AsyncStorage',
      category: 'Local Database',
      description: 'On-device key-value storage for translation history logs and research trial metrics.',
      icon: Database,
    },
    {
      name: 'Text-to-Speech (TTS)',
      category: 'Audio Engine',
      description: 'Native speech synthesis converting translated ISL sentences into spoken voice audio.',
      icon: Volume2,
    },
    {
      name: 'Pytest & Jest',
      category: 'Automated Testing',
      description: 'Unified monorepo test suite featuring 384+ distinct automated test cases with coverage.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="technology" className="py-24 relative bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Technology Stack</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            Built on Modern AI & Mobile Architecture
          </p>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            SignSpeak AI integrates state-of-the-art computer vision libraries, deep learning frameworks, and robust mobile tooling.
          </p>
        </div>

        {/* Tech Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700/80 flex items-center justify-center group-hover:border-primary transition-colors">
                    <Icon className="w-6 h-6 text-secondary group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/80 px-2.5 py-1 rounded-md">
                    {tech.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{tech.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
