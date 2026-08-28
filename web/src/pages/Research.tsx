import React from 'react';
import { BarChart3, ShieldCheck, Cpu, Code2, Database, Award, Layers, Sparkles } from 'lucide-react';
import { ResearchMethodology } from '../components/ResearchMethodology';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { CurrentModelStatus } from '../components/CurrentModelStatus';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';

export const Research: React.FC = () => {
  return (
    <div className="space-y-12 pb-12">
      
      {/* Top Header */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            Academic Research & Engineering Specifications
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            SignSpeak AI Engineering & Provenance
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Title: "Effectiveness of Real-Time AI-Driven Sign Language to Speech Translation System Compared with Traditional Communication Methods in Improving Communication Accuracy and Accessibility"
          </p>
        </div>
      </div>

      {/* Model Evaluation & Provenance Audit */}
      <CurrentModelStatus />

      {/* Held-Out Metrics Dashboard */}
      <ResultsDashboard />

      {/* Computer Vision Pipeline */}
      <ResearchMethodology />

      {/* System Architecture */}
      <ArchitectureDiagram />

    </div>
  );
};
