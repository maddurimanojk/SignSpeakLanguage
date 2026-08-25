import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionPipeline } from './components/SolutionPipeline';
import { HowItWorks } from './components/HowItWorks';
import { TechnologySection } from './components/TechnologySection';
import { LiveDemoSection } from './components/LiveDemoSection';
import { SupportedSigns } from './components/SupportedSigns';
import { ResearchSection } from './components/ResearchSection';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ModelTimeline } from './components/ModelTimeline';
import { ResearchMethodology } from './components/ResearchMethodology';
import { CurrentModelStatus } from './components/CurrentModelStatus';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ResearchComparisonTable } from './components/ResearchComparisonTable';
import { FutureScope } from './components/FutureScope';
import { AboutProjectSection } from './components/AboutProjectSection';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <CurrentModelStatus />
        <ProblemSection />
        <SolutionPipeline />
        <HowItWorks />
        <TechnologySection />
        <LiveDemoSection />
        <SupportedSigns />
        <ResearchSection />
        <ResultsDashboard />
        <ModelTimeline />
        <ResearchMethodology />
        <ArchitectureDiagram />
        <ResearchComparisonTable />
        <FutureScope />
        <AboutProjectSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
