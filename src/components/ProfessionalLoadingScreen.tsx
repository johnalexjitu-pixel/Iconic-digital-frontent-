"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Wifi, Shield, Database } from 'lucide-react';

interface ProfessionalLoadingScreenProps {
  isVisible: boolean;
  progress?: number;
  message?: string;
  onComplete?: () => void;
}

export function ProfessionalLoadingScreen({ 
  isVisible, 
  progress = 0, 
  message = "Connecting to server...",
  onComplete 
}: ProfessionalLoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const steps = [
    { 
      id: 'connection', 
      label: 'Establishing secure connection', 
      icon: Wifi,
      duration: 1000 
    },
    { 
      id: 'auth', 
      label: 'Authenticating user credentials', 
      icon: Shield,
      duration: 1500 
    },
    { 
      id: 'sync', 
      label: 'Synchronizing campaign data', 
      icon: Database,
      duration: 2000 
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setAnimatedProgress(0);
      // Re-enable body scroll when loading screen is hidden
      document.body.style.overflow = 'unset';
      return;
    }

    // Disable body scroll when loading screen is visible
    document.body.style.overflow = 'hidden';

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setAnimatedProgress(prev => {
        if (prev >= progress) {
          clearInterval(progressInterval);
          return progress;
        }
        return prev + 1;
      });
    }, 20);

    // Animate steps
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        clearInterval(stepInterval);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      }
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [isVisible, progress, onComplete]);

  // Cleanup effect to restore body scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50 w-screen h-screen overflow-hidden"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 w-full h-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(168,85,247,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 text-center w-full max-w-md mx-auto px-6 flex flex-col justify-center h-full">
        {/* Main Loading Animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {/* Outer rings */}
            <div className="absolute -inset-8 rounded-full border-2 border-blue-500/20 animate-spin"></div>
            <div className="absolute -inset-6 rounded-full border-2 border-purple-500/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute -inset-4 rounded-full border-2 border-pink-500/40 animate-spin" style={{ animationDuration: '2s' }}></div>
            
            {/* Main loading circle */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            
            {/* Floating dots */}
            <div className="absolute -top-3 -right-3 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-3 -left-3 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 -right-6 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${animatedProgress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-400 font-medium">
            {animatedProgress}%
          </div>
        </div>

        {/* Main Message */}
        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">
          {message}
        </h3>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30' 
                    : isCompleted 
                    ? 'bg-green-500/10 border border-green-400/30' 
                    : 'bg-slate-800/50 border border-slate-700/50'
                }`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse' 
                    : isCompleted 
                    ? 'bg-green-500' 
                    : 'bg-slate-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : isCompleted 
                    ? 'text-green-400' 
                    : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <div className="mt-6 text-xs text-slate-500">
          Please wait while we prepare your experience...
        </div>
      </div>
    </div>
  );
}
