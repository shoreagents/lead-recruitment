'use client';

import { PacmanLoader } from 'react-spinners';
import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  progressValue?: number;
  showProgress?: boolean;
  showStatusIndicators?: boolean;
}

export default function LoadingScreen({
  title = "Analyzing Your Resume",
  subtitle = "Claude AI is processing your resume data...",
  progressValue = 50,
  showProgress = true,
  showStatusIndicators = true
}: LoadingScreenProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (showProgress) {
      const interval = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev >= progressValue) {
            clearInterval(interval);
            return progressValue;
          }
          return prev + 1;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [progressValue, showProgress]);
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Futuristic Space Background */}
      <div className="absolute inset-0">
        {/* Nebula Effect */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/15 via-transparent to-pink-900/15"></div>
        
        {/* Starfield */}
        <div className="absolute inset-0">
          {isClient && [...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            ></div>
          ))}
        </div>
        
        {/* Floating Space Debris */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-cyan-400/40 rounded-full animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-purple-400/50 rounded-full animate-ping" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-60 left-1/4 w-2.5 h-2.5 bg-blue-400/40 rounded-full animate-pulse" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-80 right-1/3 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-bounce" style={{ animationDuration: '5.6s' }}></div>
        <div className="absolute top-32 left-2/3 w-2 h-2 bg-pink-400/50 rounded-full animate-ping" style={{ animationDuration: '6.4s' }}></div>
        <div className="absolute top-72 right-1/6 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-pulse" style={{ animationDuration: '8.4s' }}></div>
        
        {/* Energy Orbs */}
        <div className="absolute top-1/4 left-1/6 w-6 h-6 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-spin opacity-40" style={{ animationDuration: '16s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full animate-pulse opacity-30" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-5 h-5 bg-gradient-to-r from-green-400/35 to-cyan-400/35 rounded-full animate-bounce opacity-50" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/2 right-1/6 w-4 h-4 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full animate-spin opacity-40" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
        
        {/* Cosmic Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/8 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/8 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent"></div>
        
        {/* Wormhole Effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 border border-cyan-400/15 rounded-full animate-spin" style={{ animationDuration: '24s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '20s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-blue-400/15 rounded-full animate-spin" style={{ animationDuration: '16s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-pink-400/15 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>
        </div>
        
        {/* Energy Waves */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-purple-500/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
      </div>
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center relative">
              {/* Pac-Man Loader */}
              <div className="relative mb-8">
                <div className="flex justify-center">
                  <PacmanLoader 
                    color="#fbbf24" 
                    size={60}
                    margin={4}
                    speedMultiplier={1.2}
                  />
                </div>
                
                {/* Floating energy particles */}
                <div className="absolute -top-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '6s' }}></div>
                <div className="absolute -top-4 -right-4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
                <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
                <div className="absolute -bottom-4 -right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '3s', animationDuration: '6.4s' }}></div>
              </div>
              
              {/* Enhanced Text with Glow Effect */}
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
                {title}
              </h2>
              <p className="text-gray-300 mb-6 text-lg">{subtitle}</p>
              
              {/* Enhanced Progress Bar */}
              {showProgress && (
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <div className="h-3 bg-white/10 border border-cyan-400/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${animatedProgress}%` }}
                      ></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full"></div>
                  </div>
                  <p className="text-sm text-cyan-400 mt-3 font-medium">{Math.round(animatedProgress)}% Complete</p>
                  
                  {/* Real-time Status Message */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">
                      {animatedProgress < 15 ? 'Connecting to database...' :
                       animatedProgress < 45 ? 'Loading user data...' :
                       animatedProgress < 75 ? 'Fetching profile information...' :
                       animatedProgress < 95 ? 'Loading game results...' :
                       'Preparing your profile...'}
                    </p>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 