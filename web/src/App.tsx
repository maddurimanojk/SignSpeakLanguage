import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Translate } from './pages/Translate';
import { History } from './pages/History';
import { Learn } from './pages/Learn';
import { Research } from './pages/Research';
import { About } from './pages/About';
import { Settings } from './pages/Settings';

// Homepage Components
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SolutionPipeline } from './components/SolutionPipeline';
import { HowItWorks } from './components/HowItWorks';
import { LiveDemoSection } from './components/LiveDemoSection';
import { SupportedSigns } from './components/SupportedSigns';
import { ResearchSection } from './components/ResearchSection';
import { CurrentModelStatus } from './components/CurrentModelStatus';
import { TechnologySection } from './components/TechnologySection';
import { FutureScope } from './components/FutureScope';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionPipeline />
      <HowItWorks />
      <LiveDemoSection />
      <CurrentModelStatus />
      <SupportedSigns />
      <ResearchSection />
      <TechnologySection />
      <FutureScope />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
          <Navbar />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/translate" element={<Translate />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/research" element={<Research />} />
              <Route path="/about" element={<About />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
