import React, { useState } from 'react';
import { Search, Filter, BookOpen, AlertCircle } from 'lucide-react';

export const SupportedSigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const vocabulary = [
    { sign: 'HELLO', category: 'Basic', desc: 'Standard greeting gesture.' },
    { sign: 'THANK YOU', category: 'Basic', desc: 'Gesture expressing gratitude.' },
    { sign: 'YES', category: 'Basic', desc: 'Affirmative head/hand motion.' },
    { sign: 'NO', category: 'Basic', desc: 'Negative head/hand motion.' },
    { sign: 'PLEASE', category: 'Basic', desc: 'Polite request gesture.' },
    { sign: 'SORRY', category: 'Basic', desc: 'Apology gesture.' },
    { sign: 'HELP', category: 'Emergency', desc: 'Urgent assistance request.' },
    { sign: 'WATER', category: 'Food', desc: 'Requesting drinking water.' },
    { sign: 'FOOD', category: 'Food', desc: 'Indicating food or hunger.' },
    { sign: 'HOME', category: 'Places', desc: 'House/residence sign.' },
    { sign: 'SCHOOL', category: 'Places', desc: 'Educational institution sign.' },
    { sign: 'HOSPITAL', category: 'Places', desc: 'Medical facility sign.' },
    { sign: 'GOOD', category: 'Common Phrases', desc: 'Positive state/quality.' },
    { sign: 'BAD', category: 'Common Phrases', desc: 'Negative state/quality.' },
    { sign: 'NAME', category: 'People', desc: 'Identifying name sign.' },
    { sign: 'STOP', category: 'Emergency', desc: 'Halting or stopping action.' },
    { sign: 'COME', category: 'Common Phrases', desc: 'Inviting motion.' },
    { sign: 'GO', category: 'Common Phrases', desc: 'Departing motion.' },
    { sign: 'I', category: 'People', desc: 'First person pronoun.' },
    { sign: 'YOU', category: 'People', desc: 'Second person pronoun.' },
    { sign: 'WE', category: 'People', desc: 'Plural first person pronoun.' },
    { sign: 'WHAT', category: 'Common Phrases', desc: 'Question word gesture.' },
    { sign: 'WHERE', category: 'Common Phrases', desc: 'Location question gesture.' },
    { sign: 'HOW', category: 'Common Phrases', desc: 'Manner question gesture.' },
    { sign: 'WELCOME', category: 'Basic', desc: 'Welcoming greeting sign.' },
    { sign: 'GOOD MORNING', category: 'Basic', desc: 'Morning greeting phrase.' },
    { sign: 'GOOD NIGHT', category: 'Basic', desc: 'Night parting phrase.' },
  ];

  const categories = ['All', 'Basic', 'People', 'Food', 'Places', 'Emergency', 'Common Phrases'];

  const filteredVocabulary = vocabulary.filter((item) => {
    const matchesSearch = item.sign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="supported-signs" className="py-24 relative bg-slate-950/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>27 Core Signs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Supported & Planned Vocabulary
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            The initial research phase targets 27 essential Indian Sign Language (ISL) gestures covering daily necessities, social greetings, and emergency communication.
          </p>

          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-xl mx-auto text-xs text-slate-400 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Labeled as <strong>Supported/Planned Vocabulary</strong> during initial ML dataset collection & evaluation.
            </span>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search sign or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-secondary text-slate-950 font-extrabold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Vocabulary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredVocabulary.map((item) => (
            <div
              key={item.sign}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.category}
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400/80" />
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors mb-1">
                {item.sign}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
