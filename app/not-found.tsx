"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-b from-background to-background/60 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-primary/5 animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        {/* 404 Number with animation */}
        <div 
          className={`transition-all duration-1000 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          <h1 className="text-8xl font-bold text-primary mb-2 animate-bounce-subtle">404</h1>
        </div>
        
        {/* Subtitle with fade in */}
        <div 
          className={`transition-all duration-1000 delay-300 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
        </div>
        
        {/* Description with fade in */}
        <div 
          className={`transition-all duration-1000 delay-500 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, 
            had its name changed, or is temporarily unavailable.
          </p>
        </div>
        
        {/* Button with fade in and pulse effect */}
        <div 
          className={`transition-all duration-1000 delay-700 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Link 
            href="/login" 
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl animate-pulse-subtle"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
} 