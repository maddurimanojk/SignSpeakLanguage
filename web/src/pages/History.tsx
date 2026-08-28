import React, { useState } from 'react';
import { Clock, Search, Trash2, Volume2, ShieldCheck, Filter, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const History: React.FC = () => {
  const { userHistory, deleteTranslationRecord, clearUserHistory, settings } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(0);

  const filteredHistory = userHistory.filter((record) => {
    const matchesSearch = record.sentence.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesConfidence = record.confidence >= minConfidenceFilter;
    return matchesSearch && matchesConfidence;
  });

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.speechRate;
      utterance.pitch = settings.speechPitch;
      utterance.volume = settings.speechVolume;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Translation History
          </h1>
          <p className="text-sm text-slate-400">
            Personal persistent log of translated sign sentences and AI confidence metrics
          </p>
        </div>

        {userHistory.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire translation history?')) {
                clearUserHistory();
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 font-bold text-xs transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved translations..."
            className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Confidence Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={minConfidenceFilter}
            onChange={(e) => setMinConfidenceFilter(parseFloat(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-cyan-500 w-full md:w-auto"
          >
            <option value={0}>All Confidence Levels</option>
            <option value={0.70}>≥ 70% Confidence</option>
            <option value={0.85}>≥ 85% Confidence</option>
            <option value={0.95}>≥ 95% Confidence</option>
          </select>
        </div>

      </div>

      {/* Records Table / List */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <Clock className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-extrabold text-white">No history records found</h3>
            <p className="text-xs max-w-sm mx-auto">
              {userHistory.length === 0
                ? 'Translations recorded in the /translate portal will be permanently saved to your account here.'
                : 'No records match your active search or confidence filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-900/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white">{item.sentence}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-extrabold">
                      {Math.round(item.confidence * 100)}% Confidence
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>📅 {new Date(item.dateTime).toLocaleString()}</span>
                    <span>⏱ {item.durationSeconds || 10}s duration</span>
                    <span>🤟 {item.signCount || item.sentence.split(' ').length} signs</span>
                    <span className="text-emerald-400 font-semibold">✓ {item.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => speakText(item.sentence)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                    title="Speak Sentence"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteTranslationRecord(item.id)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
