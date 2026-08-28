import React from 'react';
import { Sparkles, Heart, Target, Users, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Hero Banner */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden text-center max-w-4xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-cyan-500/20 mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="text-cyan-400">SignSpeak AI</span>
        </h1>
        
        <p className="mt-4 text-base text-slate-300 leading-relaxed">
          Empowering the deaf and hard-of-hearing community through real-time computer vision and neural sign language to speech synthesis.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Our Purpose</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To eliminate non-verbal communication barriers in healthcare, education, and daily commercial interactions using low-latency mobile and web artificial intelligence.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Who It Helps</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Millions of ISL signers across India, as well as family members, educators, and service workers communicating with deaf individuals.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">How It Works</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            MediaPipe extracts 21 3D hand keypoints per frame, normalized into spatial coordinate vectors, and fed into deep Keras neural networks for sentence classification.
          </p>
        </div>
      </div>

      {/* CTA Box */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 bg-slate-900/80 text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-white">Experience SignSpeak AI Today</h2>
        <p className="text-xs text-slate-400">
          Try the real-time webcam translation portal or explore the educational sign gesture dictionary.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/translate"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all inline-flex items-center gap-2"
          >
            <span>Start Live Translation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
