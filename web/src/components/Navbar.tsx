import React, { useState } from 'react';
import { Hand, Menu, X, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Technology', href: '#technology' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Research', href: '#research' },
    { name: 'Supported Signs', href: '#supported-signs' },
    { name: 'Results', href: '#results' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Hand className="w-5 h-5 text-secondary" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SignSpeak <span className="text-secondary font-black">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider font-semibold uppercase">
                ISL Speech Translation
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              Try Translation
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800/80 hover:text-secondary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#demo"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full mt-4 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-center"
          >
            <Sparkles className="w-4 h-4" />
            Try Translation
          </a>
        </div>
      )}
    </header>
  );
};
