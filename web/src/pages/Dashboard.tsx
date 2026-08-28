import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Clock, BookOpen, BarChart3, Settings, ShieldCheck, Sparkles, User, Award, ArrowUpRight, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchBackendHealth } from '../services/api';
import { BackendHealthResponse } from '../types';

export const Dashboard: React.FC = () => {
  const { user, userHistory, settings } = useAuth();
  const [health, setHealth] = useState<BackendHealthResponse | null>(null);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    async function loadHealth() {
      const res = await fetchBackendHealth(settings.backendUrl);
      setIsBackendOnline(res.isAvailable);
      if (res.info) {
        setHealth(res.info);
      }
    }
    loadHealth();
  }, [settings.backendUrl]);

  const avgConfidence = userHistory.length > 0
    ? Math.round((userHistory.reduce((acc, r) => acc + r.confidence, 0) / userHistory.length) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Welcome Hero */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Portal Active
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-cyan-400">{user?.fullName || 'SignSpeak User'}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Real-time Indian Sign Language (ISL) recognition platform. Convert hand gestures into text and spoken audio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/translate"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm hover:opacity-95 shadow-xl shadow-cyan-500/20 transition-all"
            >
              <Camera className="w-5 h-5" />
              Start Translation
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Translations</span>
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white">{userHistory.length}</div>
          <span className="text-xs text-slate-400 block">Personal Session Log</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Confidence</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white">{userHistory.length > 0 ? `${avgConfidence}%` : 'N/A'}</div>
          <span className="text-xs text-slate-400 block">Mean AI Prediction Confidence</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active AI Mode</span>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-lg font-extrabold text-white truncate">
            {health?.inference_mode || (isBackendOnline ? 'REAL_MODEL' : 'OFFLINE')}
          </div>
          <span className="text-xs text-slate-400 block">{health?.classes_count || 26} Supported Classes</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Backend Status</span>
            <div className={`w-3 h-3 rounded-full ${isBackendOnline ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50' : 'bg-rose-500'}`} />
          </div>
          <div className="text-lg font-extrabold text-white">
            {isBackendOnline ? 'Connected & Online' : 'Service Offline'}
          </div>
          <span className="text-xs text-slate-400 block truncate">{settings.backendUrl}</span>
        </div>

      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">QUICK ACCESS PORTAL</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link to="/translate" className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors">Live Translation</h3>
            <p className="text-xs text-slate-400 mt-1">Open camera viewport and start live sign-to-speech conversion.</p>
          </Link>

          <Link to="/learn" className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-blue-400 transition-colors">Learn ISL Signs</h3>
            <p className="text-xs text-slate-400 mt-1">Browse educational ISL gesture dictionary with categories and hints.</p>
          </Link>

          <Link to="/history" className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-purple-500/50 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-purple-400 transition-colors">Translation History</h3>
            <p className="text-xs text-slate-400 mt-1">Review saved personal translations, confidence logs, and speech audio.</p>
          </Link>

          <Link to="/research" className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">Research Portal</h3>
            <p className="text-xs text-slate-400 mt-1">Inspect computer vision methodology, MediaPipe landmarks, and metrics.</p>
          </Link>

        </div>
      </div>

      {/* Recent History Preview */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-white">Recent Translation Activity</h3>
            <p className="text-xs text-slate-400">Your latest recognized sign sentences</p>
          </div>
          <Link to="/history" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
            View Full History
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {userHistory.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <Clock className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No translations recorded yet</p>
            <p className="text-xs max-w-md mx-auto">Start a live camera translation session to record recognized sentences to your account.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userHistory.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-base font-extrabold text-white block">{item.sentence}</span>
                  <span className="text-xs text-slate-400">{new Date(item.dateTime).toLocaleString()}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
                  {Math.round(item.confidence * 100)}% Confidence
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
