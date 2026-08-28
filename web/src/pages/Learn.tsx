import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, CheckCircle, ShieldCheck, Tag } from 'lucide-react';
import { ISLSignItem, SignCategory } from '../types';

const ISL_DICTIONARY: ISLSignItem[] = [
  // Alphabet A-Z
  ...Array.from({ length: 26 }, (_, i) => {
    const letter = String.fromCharCode(65 + i);
    return {
      id: `alph_${letter}`,
      name: `Letter ${letter}`,
      category: 'Basic' as SignCategory,
      description: `Official Indian Sign Language (ISL) static hand gesture for letter ${letter}.`,
      gestureHint: `Form canonical ISL ${letter} hand posture in front of chest.`,
      difficulty: 'Easy' as const,
      isModelSupported: true,
    };
  }),

  // Emergency & Basic Signs
  {
    id: 'emg_help',
    name: 'Help',
    category: 'Emergency',
    description: 'Universal ISL request sign for immediate assistance.',
    gestureHint: 'Flat left palm facing up, right fist with thumb up resting on left palm, moving upward.',
    difficulty: 'Medium',
    isModelSupported: false,
  },
  {
    id: 'emg_doctor',
    name: 'Doctor / Hospital',
    category: 'Emergency',
    description: 'Sign indicating medical attention or hospital location.',
    gestureHint: 'Right hand index and middle fingers tap inner left wrist wrist pulse twice.',
    difficulty: 'Medium',
    isModelSupported: false,
  },
  {
    id: 'phr_hello',
    name: 'Hello / Namaste',
    category: 'Phrases',
    description: 'Traditional Indian Sign Language greeting.',
    gestureHint: 'Palms pressed together near chest (Namaste pose) or open hand wave.',
    difficulty: 'Easy',
    isModelSupported: false,
  },
  {
    id: 'phr_thank_you',
    name: 'Thank You',
    category: 'Phrases',
    description: 'Expression of gratitude in ISL.',
    gestureHint: 'Flat hand touching chin moves forward toward recipient with slight head nod.',
    difficulty: 'Easy',
    isModelSupported: false,
  },
  {
    id: 'food_water',
    name: 'Water',
    category: 'Food',
    description: 'ISL gesture requesting drinking water.',
    gestureHint: 'Form W shape with 3 middle fingers tapping chin twice.',
    difficulty: 'Easy',
    isModelSupported: false,
  },
];

export const Learn: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Basic', 'Emergency', 'Phrases', 'Food'];

  const filteredSigns = ISL_DICTIONARY.filter((sign) => {
    const matchesCategory = selectedCategory === 'All' || sign.category === selectedCategory;
    const matchesSearch = sign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sign.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            ISL Educational Dictionary
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Learn Indian Sign Language (ISL)
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Explore the official gesture library for ISL alphabets, emergency signals, greetings, and daily communication.
          </p>
        </div>
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
            placeholder="Search sign names or descriptions..."
            className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm font-medium transition-all"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSigns.map((sign) => (
          <div key={sign.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-cyan-500/40 transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-extrabold uppercase">
                  {sign.category}
                </span>

                {sign.isModelSupported ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    AI Model Supported
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-500 text-[10px] font-bold">
                    Curriculum Sign
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                {sign.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {sign.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Gesture Posture Hint</span>
              <p className="text-xs text-slate-300 font-medium bg-slate-950 p-3 rounded-xl border border-slate-800">
                👉 {sign.gestureHint}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
