import React, { useState } from 'react';
import { Play, Volume2, Sparkles, AlertCircle, Smartphone, ExternalLink } from 'lucide-react';

export const LiveDemoSection: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<string>('HELLO');
  const [confidence, setConfidence] = useState<number>(94);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const demoSigns = [
    { sign: 'HELLO', conf: 96, translation: 'Hello' },
    { sign: 'THANK YOU', conf: 94, translation: 'Thank You' },
    { sign: 'WATER', conf: 92, translation: 'I need Water' },
    { sign: 'HELP', conf: 98, translation: 'Please Help' },
    { sign: 'PLEASE', conf: 91, translation: 'Please' },
    { sign: 'STOP', conf: 95, translation: 'Stop' },
  ];

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const currentObj = demoSigns.find(s => s.sign === selectedSign);
      const utterance = new SpeechSynthesisUtterance(currentObj?.translation || selectedSign);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`[Audio Output]: ${selectedSign}`);
    }
  };

  const handleSelectSign = (item: typeof demoSigns[0]) => {
    setSelectedSign(item.sign);
    setConfidence(item.conf);
  };

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4" />
            <span>Interactive Web Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Experience SignSpeak AI
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Test the real-time landmark recognition and Text-to-Speech playback pipeline in this interactive browser mockup.
          </p>
        </div>

        {/* Demo Playground Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Select Gesture to Simulate
              </h3>
              <p className="text-xs text-slate-400">
                Click any ISL sign below to simulate landmark detection and model prediction in the camera viewport:
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {demoSigns.map((item) => (
                  <button
                    key={item.sign}
                    onClick={() => handleSelectSign(item)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                      selectedSign === item.sign
                        ? 'bg-primary text-white border-cyan-400 shadow-md shadow-primary/30'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className="block text-sm font-extrabold mb-0.5">{item.sign}</span>
                    <span className="block text-[10px] opacity-75">Conf: {item.conf}%</span>
                  </button>
                ))}
              </div>

              {/* Notice Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Demo Preview Mode:</strong> This browser simulation demonstrates the UI pipeline. The full camera application runs natively on iOS & Android via React Native Expo.
                </span>
              </div>

            </div>

            {/* Open Mobile App Link Button */}
            <div className="text-center lg:text-left">
              <a
                href="http://localhost:8081"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
              >
                <Smartphone className="w-4 h-4 text-secondary" />
                Open Mobile App Prototype
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Right Column: Simulated Phone Camera Viewport */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
              
              {/* Simulated Camera Window */}
              <div className="relative w-full aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
                
                {/* Camera Top Header Bar */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    LIVE CAMERA
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold uppercase">
                    Demo Preview Mode
                  </span>
                </div>

                {/* Hand Skeleton Overlay SVG */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                  <svg className="w-48 h-48" viewBox="0 0 200 200">
                    <g stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="100" y1="170" x2="60" y2="125" />
                      <line x1="100" y1="170" x2="85" y2="110" />
                      <line x1="100" y1="170" x2="110" y2="110" />
                      <line x1="100" y1="170" x2="135" y2="118" />
                      <line x1="60" y1="125" x2="45" y2="105" />
                      <line x1="85" y1="110" x2="80" y2="80" />
                      <line x1="110" y1="110" x2="110" y2="75" />
                      <line x1="135" y1="118" x2="138" y2="85" />
                    </g>
                    <g fill="#10B981">
                      {[[100,170], [60,125], [45,105], [85,110], [80,80], [110,110], [110,75], [135,118]].map(([cx, cy], idx) => (
                        <circle key={idx} cx={cx} cy={cy} r="4" stroke="#fff" strokeWidth="1.5" />
                      ))}
                    </g>
                  </svg>
                </div>

                {/* Recognized Output Card */}
                <div className="z-10 glass-badge p-4 rounded-2xl border border-slate-700/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase">Recognized Sign</span>
                    <span className="text-2xl font-black text-white tracking-wider">"{selectedSign}"</span>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400">Confidence</span>
                      <span className="text-sm font-extrabold text-emerald-400">{confidence}%</span>
                    </div>

                    <button
                      onClick={handleSpeak}
                      disabled={isSpeaking}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                      {isSpeaking ? 'Speaking...' : 'Speak'}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
