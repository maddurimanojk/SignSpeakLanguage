import React from 'react';
import { GraduationCap, User, Building, BookOpen, UserCheck } from 'lucide-react';

export const AboutProjectSection: React.FC = () => {
  return (
    <section id="about" className="py-24 relative bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Academic Credentials</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white">
            About the Research Project
          </p>
          <p className="text-base text-slate-400 leading-relaxed">
            Project metadata and academic institution details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Project Overview */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-secondary" />
              SignSpeak AI Overview
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="block text-slate-500 font-bold uppercase tracking-wider">Full Research Title</span>
                <span className="text-sm font-bold text-slate-200 leading-relaxed block mt-1">
                  "Effectiveness of Real-Time AI-Driven Sign Language to Speech Translation System Compared with Traditional Communication Methods in Improving Communication Accuracy and Accessibility"
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <span className="block text-slate-500 font-bold uppercase tracking-wider">Research Domain</span>
                  <span className="font-semibold text-slate-200">AI & Computer Vision Accessibility</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-bold uppercase tracking-wider">Target Language</span>
                  <span className="font-semibold text-slate-200">Indian Sign Language (ISL)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="block text-slate-500 font-bold uppercase tracking-wider mb-1">Core Tech Stack</span>
                <span className="font-semibold text-slate-300">
                  React Native, Expo SDK 52, TypeScript, MediaPipe, OpenCV, Python 3.10, FastAPI, TensorFlow 2.21, Keras 3.12, LSTM.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Configurable Academic Placeholders */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Building className="w-6 h-6 text-emerald-400" />
              Academic Metadata & Contributors
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-secondary" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Researcher / Student Name</span>
                    <span className="text-sm font-bold text-white">[Student Name]</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono">[Student ID]</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Department</span>
                    <span className="text-sm font-bold text-white">[Department of Computer Science / AI]</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-primary" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Institution / University</span>
                    <span className="text-sm font-bold text-white">[Academic Institution / University]</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Project Supervisor / Guide</span>
                    <span className="text-sm font-bold text-white">[Supervisor / Guide Name]</span>
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
