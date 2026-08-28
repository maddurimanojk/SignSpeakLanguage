import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Volume2, ShieldCheck, Save, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user, updateProfile, settings, updateSettings, logout } = useAuth();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [backendUrl, setBackendUrlState] = useState(settings.backendUrl);
  const [speechRate, setSpeechRate] = useState(settings.speechRate);
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidenceThreshold);
  const [autoSpeak, setAutoSpeak] = useState(settings.autoSpeak);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(fullName, email);
    updateSettings({
      backendUrl,
      speechRate,
      confidenceThreshold,
      autoSpeak,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Platform Settings</h1>
          <p className="text-sm text-slate-400">Manage user profile, AI backend URL, and speech synthesis parameters</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* User Profile Info */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 text-cyan-400 font-extrabold text-base border-b border-slate-800 pb-4">
            <User className="w-5 h-5" />
            Profile Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-medium focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Backend & Inference Settings */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 text-purple-400 font-extrabold text-base border-b border-slate-800 pb-4">
            <ShieldCheck className="w-5 h-5" />
            AI Backend Server Settings
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                FastAPI Server URL (Production or Local)
              </label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrlState(e.target.value)}
                placeholder="http://localhost:8000 or https://your-app.onrender.com"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Environment configuration variable <code className="text-cyan-400">VITE_API_URL</code> override.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Prediction Confidence Threshold: {Math.round(confidenceThreshold * 100)}%
              </label>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Speech Synthesis Settings */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 text-emerald-400 font-extrabold text-base border-b border-slate-800 pb-4">
            <Volume2 className="w-5 h-5" />
            Text-to-Speech (TTS) Preferences
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Speech Playback Rate: {speechRate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-sm font-bold text-white block">Auto-Speak Translated Words</span>
                <span className="text-xs text-slate-400">Automatically trigger speech playback on recognized gestures</span>
              </div>
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="w-5 h-5 accent-cyan-500 rounded"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all inline-flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>

          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}

          <button
            type="button"
            onClick={logout}
            className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </form>

    </div>
  );
};
