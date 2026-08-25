import React from 'react';
import { Hand, Github, FileText, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Hand className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white">
                SignSpeak <span className="text-secondary font-black">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Real-Time Indian Sign Language to Speech Translation System designed to improve communication accuracy and accessibility.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#technology" className="hover:text-white transition-colors">Technology Stack</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#research" className="hover:text-white transition-colors">Research Methodology</a></li>
              <li><a href="#supported-signs" className="hover:text-white transition-colors">Supported Signs</a></li>
              <li><a href="#results" className="hover:text-white transition-colors">Results Dashboard</a></li>
            </ul>
          </div>

          {/* Contact & Repos */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
            <div className="flex flex-col gap-2 text-xs">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-slate-400" />
                SignSpeak AI Monorepo Repository
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                Academic Research Paper Documentation
              </a>
              <a
                href="mailto:research@signspeak.ai"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                Contact Academic Research Lead
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SignSpeak AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Accessibility Research
          </p>
        </div>
      </div>
    </footer>
  );
};
