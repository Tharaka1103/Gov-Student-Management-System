'use client';

import React, { useState, useCallback } from 'react';

// Types and Interfaces
interface LoadingIndicatorProps {
  /** Whether the loading indicator is visible */
  isVisible?: boolean;
  /** Loading message to display */
  message?: string;
  /** Submessage for additional context */
  submessage?: string;
  /** Variant of the loading indicator */
  variant?: 'simple' | 'enhanced' | 'minimal';
  /** Size of the loading indicator */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className for additional styling */
  className?: string;
  /** Whether to show the backdrop blur */
  showBackdrop?: boolean;
  /** Whether to show bouncing dots */
  showDots?: boolean;
  /** Whether to show progress bar (enhanced variant only) */
  showProgressBar?: boolean;
}

interface UseLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoading: (loading: boolean) => void;
}

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Custom Hook for Loading State
export const useLoading = (initialState = false): UseLoadingReturn => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading,
  };
};

// Main LoadingIndicator Component
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isVisible = false,
  message = 'Loading',
  submessage = 'Please wait while we process your request...',
  variant = 'enhanced',
  size = 'md',
  className,
  showBackdrop = true,
  showDots = true,
  showProgressBar = true,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'p-4 sm:p-6 max-w-xs',
      spinner: 'w-12 h-12 sm:w-16 sm:h-16',
      centerDot: 'w-3 h-3 sm:w-4 sm:h-4',
      title: 'text-lg sm:text-xl',
      subtitle: 'text-xs sm:text-sm',
      dots: 'w-2 h-2',
      spacing: 'space-y-4'
    },
    md: {
      container: 'p-6 sm:p-8 md:p-10 max-w-md',
      spinner: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
      centerDot: 'w-4 h-4 sm:w-6 sm:h-6',
      title: 'text-xl sm:text-2xl md:text-3xl',
      subtitle: 'text-sm sm:text-base',
      dots: 'w-3 h-3 sm:w-4 sm:h-4',
      spacing: 'space-y-6 sm:space-y-8'
    },
    lg: {
      container: 'p-8 sm:p-10 md:p-12 max-w-lg',
      spinner: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
      centerDot: 'w-6 h-6 sm:w-8 sm:h-8',
      title: 'text-2xl sm:text-3xl md:text-4xl',
      subtitle: 'text-base sm:text-lg',
      dots: 'w-4 h-4 sm:w-5 sm:h-5',
      spacing: 'space-y-8 sm:space-y-10'
    }
  };

  const config = sizeConfig[size];

  if (!isVisible) return null;

  // Simple Variant
  const renderSimpleVariant = () => (
    <div className="relative bg-white rounded-xl shadow-lg border border-yellow-200 text-center">
      <div className={cn(config.container, config.spacing)}>
        {/* Simple Spinner */}
        <div className={cn('relative mx-auto', config.spinner)}>
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(config.centerDot, 'bg-red-900 rounded-full animate-pulse')}></div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className={cn(config.title, 'font-semibold text-red-900')}>{message}</h3>
          <p className={cn(config.subtitle, 'text-gray-600')}>{submessage}</p>
        </div>

        {/* Dots */}
        {showDots && (
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={cn(config.dots, 'bg-yellow-400 rounded-full animate-bounce')}
                style={{ animationDelay: `${index * 0.1}s` }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced Variant
  const renderEnhancedVariant = () => (
    <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-yellow-200 overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-200/20 rounded-full animate-pulse"></div>
        <div 
          className="absolute -bottom-10 -right-10 w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse" 
          style={{ animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute top-1/2 -right-8 w-12 h-12 bg-red-900/10 rounded-full animate-pulse" 
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className={cn('relative z-10 text-center', config.container, config.spacing)}>
        {/* Enhanced Spinner */}
        <div className={cn('relative mx-auto', config.spinner)}>
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-spin"></div>
          <div 
            className="absolute inset-3 rounded-full border-4 border-yellow-400 border-t-transparent border-r-transparent animate-spin" 
            style={{ animationDuration: '2s', animationDirection: 'reverse' }}
          ></div>
          <div 
            className="absolute inset-6 rounded-full border-2 border-red-900 border-b-transparent animate-spin" 
            style={{ animationDuration: '3s' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(config.centerDot, 'bg-gradient-to-br from-red-900 to-red-700 rounded-full animate-pulse shadow-lg')}></div>
          </div>
        </div>

        {/* Loading Text with Animation */}
        <div className="space-y-3 sm:space-y-4">
          <div className="relative">
            <h3 className={cn(config.title, 'font-bold bg-gradient-to-r from-red-900 via-red-800 to-red-900 bg-clip-text text-transparent animate-pulse')}>
              {message}
            </h3>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-1 bg-gradient-to-r from-yellow-400 to-yellow-200 animate-pulse rounded-full"></div>
          </div>
          <p className={cn(config.subtitle, 'text-gray-600 font-medium animate-pulse')}>
            {submessage}
          </p>
        </div>

        {/* Enhanced Progress Indicators */}
        <div className="space-y-4">
          {/* Bouncing Dots */}
          {showDots && (
            <div className="flex justify-center space-x-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={cn(config.dots, 'bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full animate-bounce shadow-lg')}
                  style={{ animationDelay: `${index * 200}ms` }}
                ></div>
              ))}
            </div>
          )}
          
          {/* Progress Bar */}
          {showProgressBar && (
            <div className="w-full bg-yellow-200/50 rounded-full h-2 sm:h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Optional Message */}
        <div className="text-xs sm:text-sm text-gray-500 font-medium animate-pulse">
          🔄 This may take a few moments
        </div>
      </div>
    </div>
  );

  // Minimal Variant
  const renderMinimalVariant = () => (
    <div className=" items-center align-center">
      <div className='text-center  items-center align-center'>
        {/* Minimal Spinner */}
        <div className={cn('relative mx-auto', config.spinner)}>
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200 animate-spin"></div>
          <div 
            className="absolute inset-2 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" 
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(config.centerDot, 'bg-red-900 rounded-full animate-bounce')}></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className={cn(config.title, 'font-bold text-red-900')}>
            {message}
          </h3>
          <p className={cn(config.subtitle, 'text-gray-600 font-medium')}>
            {submessage}
          </p>
        </div>
        {/* Decorative Elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-200/30 rounded-full animate-ping"></div>
          <div 
            className="absolute -bottom-4 -right-4 w-6 h-6 bg-yellow-400/30 rounded-full animate-ping" 
            style={{ animationDelay: '1s' }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'simple':
        return renderSimpleVariant();
      case 'minimal':
        return renderMinimalVariant();
      case 'enhanced':
      default:
        return renderEnhancedVariant();
    }
  };

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center p-4', className)}>
      {/* Backdrop */}
      {showBackdrop && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-red-900/30 to-red-900/20 backdrop-blur-lg"></div>
      )}
      
      {/* Loading Content */}
      <div className="relative z-10 w-full mx-4">
        {renderVariant()}
      </div>
    </div>
  );
};

export default LoadingIndicator;