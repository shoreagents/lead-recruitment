'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Show toast with animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - (100 / (duration / 50)); // Update every 50ms
      });
    }, 50);

    // Auto close timer
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 shadow-green-100';
      case 'error':
        return 'bg-red-50 border-red-200 shadow-red-100';
      case 'info':
        return 'bg-blue-50 border-blue-200 shadow-blue-100';
      default:
        return 'bg-green-50 border-green-200 shadow-green-100';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-400 to-green-500';
      case 'error':
        return 'bg-gradient-to-r from-red-400 to-red-500';
      case 'info':
        return 'bg-gradient-to-r from-blue-400 to-blue-500';
      default:
        return 'bg-gradient-to-r from-green-400 to-green-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`
          ${getBgColor()}
          border rounded-xl shadow-lg p-4 min-w-[320px] max-w-[420px]
          transform transition-all duration-300 ease-out backdrop-blur-sm
          ${isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        `}
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/50 rounded-t-xl overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-50 ease-linear shadow-sm`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex items-start space-x-3 pt-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 ml-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast manager for multiple toasts
interface ToastManagerProps {
  toasts: Array<{
    id: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export function ToastManager({ toasts, onRemove }: ToastManagerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 90}px)`,
            zIndex: 1000 - index 
          }}
          className="transition-all duration-300 ease-out"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
