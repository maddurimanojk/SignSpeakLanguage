import React from 'react';
import { ArrowRight, Activity, Cpu, Volume2, ShieldCheck, Video } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 overflow-hidden">
      {/* Dynamic Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-badge border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>AI Accessibility Research Project</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">Prototype & ML Pipeline Ready</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Breaking Communication <br className="hidden sm:inline" />
              Barriers with <span className="bg-gradient-to-r from-cyan-400 via-secondary to-primary bg-clip-text text-transparent">AI</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-200">
              Real-Time Indian Sign Language to Speech Translation
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              SignSpeak AI leverages computer vision and machine learning to recognize selected Indian Sign Language (ISL) gestures and convert them into clear text and speech in real time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all"
              >
                Try Live Translation
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#research"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-panel text-slate-200 hover:text-white font-semibold text-base border border-slate-700 hover:border-slate-500 transition-all hover:bg-slate-800/80"
              >
                Explore the Research
              </a>
            </div>

            {/* Micro Feature Ticker */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left border-t border-slate-800/80">
              <div>
                <span className="block text-xl font-extrabold text-white">21 Joints</span>
                <span className="text-xs text-slate-400">MediaPipe Tracking</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">15 Frames</span>
                <span className="text-xs text-slate-400">Temporal Sequence</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">FastAPI</span>
                <span className="text-xs text-slate-400">REST AI Server</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">Real-Time</span>
                <span className="text-xs text-slate-400">Text-to-Speech</span>
              </div>
            </div>

          </div>

          {/* Right Column Visual 21 Hand Landmark Interactive Display */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl flex flex-col justify-between overflow-hidden group">
              
              {/* Card Header Overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Camera Feed</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  25 FPS Live
                </div>
              </div>

              {/* Central 21-Joint SVG Hand Skeleton */}
              <div className="relative my-auto flex items-center justify-center h-64">
                <svg className="w-full h-full max-h-56" viewBox="0 0 200 200">
                  {/* Bone Connections */}
                  <g stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
                    {/* Palm Bones */}
                    <line x1="100" y1="170" x2="60" y2="125" />
                    <line x1="100" y1="170" x2="85" y2="110" />
                    <line x1="100" y1="170" x2="110" y2="110" />
                    <line x1="100" y1="170" x2="135" y2="118" />
                    <line x1="100" y1="170" x2="155" y2="135" />

                    {/* Thumb */}
                    <line x1="60" y1="125" x2="45" y2="105" />
                    <line x1="45" y1="105" x2="35" y2="85" />

                    {/* Index Finger */}
                    <line x1="85" y1="110" x2="80" y2="80" />
                    <line x1="80" y1="80" x2="78" y2="55" />
                    <line x1="78" y1="55" x2="76" y2="35" />

                    {/* Middle Finger */}
                    <line x1="110" y1="110" x2="110" y2="75" />
                    <line x1="110" y1="75" x2="110" y2="50" />
                    <line x1="110" y1="50" x2="110" y2="25" />

                    {/* Ring Finger */}
                    <line x1="135" y1="118" x2="138" y2="85" />
                    <line x1="138" y1="85" x2="140" y2="60" />
                    <line x1="140" y1="60" x2="142" y2="40" />

                    {/* Pinky Finger */}
                    <line x1="155" y1="135" x2="162" y2="110" />
                    <line x1="162" y1="110" x2="168" y2="90" />
                    <line x1="168" y1="90" x2="172" y2="72" />
                  </g>

                  {/* Joint Landmark Nodes */}
                  <g fill="#4F46E5">
                    {[
                      [100, 170], [60, 125], [45, 105], [35, 85],
                      [85, 110], [80, 80], [78, 55], [76, 35],
                      [110, 110], [110, 75], [110, 50], [110, 25],
                      [135, 118], [138, 85], [140, 60], [142, 40],
                      [155, 135], [162, 110], [168, 90], [172, 72]
                    ].map(([cx, cy], idx) => (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={idx === 0 ? "6" : "4"}
                        fill={idx === 0 ? "#10B981" : "#06B6D4"}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="animate-pulse"
                      />
                    ))}
                  </g>
                </svg>

                {/* Floating Processing Card */}
                <div className="absolute bottom-2 left-2 right-2 glass-badge p-3 rounded-2xl border border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase">AI Predicted Sign</span>
                    <span className="text-xl font-black text-white tracking-wide">"HELLO"</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] font-semibold text-slate-400">Confidence</span>
                    <span className="text-sm font-bold text-emerald-400">96.4%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Pipeline Status */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center z-10">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Cpu className="w-4 h-4 text-primary mx-auto mb-1" />
                  <span className="block text-[10px] font-semibold text-slate-300">MediaPipe</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Activity className="w-4 h-4 text-secondary mx-auto mb-1" />
                  <span className="block text-[10px] font-semibold text-slate-300">Keras LSTM</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                  <Volume2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="block text-[10px] font-semibold text-slate-300">Speech Engine</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
