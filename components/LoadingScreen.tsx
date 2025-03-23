"use client"
import { motion } from "framer-motion"
import { HeartPulse, Stethoscope, Clipboard, Activity } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  duration?: number; // Duration in ms, default will be 3000ms (3 seconds)
  onLoadingComplete?: () => void; // Callback when loading completes
}

export default function LoadingScreen({ duration = 3000, onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Start time of the loading
    const startTime = Date.now();
    
    // Function to update progress
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        // Continue updating if not complete
        requestAnimationFrame(updateProgress);
      } else {
        // Mark as complete
        setIsComplete(true);
        // Call the callback after completion
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }
    };
    
    // Start updating progress
    const animationId = requestAnimationFrame(updateProgress);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [duration, onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center z-50">
      <div className="w-full max-w-md text-white text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative w-32 h-32 mx-auto">
            {/* Pulsing background circle */}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut",
                repeat: isComplete ? 0 : Infinity,
              }}
            />
            
            {/* Main icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <HeartPulse size={64} className="text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100"
        >
          {isComplete ? "Ready!" : "Preparing Your Clinic"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-purple-200 mb-12"
        >
          {isComplete ? "Your healthcare dashboard is ready" : "Setting up your healthcare dashboard"}
        </motion.p>

        {/* Animated loading icons */}
        <div className="flex justify-center space-x-8 mb-8">
          {[
            { icon: <Stethoscope size={24} />, label: "Systems" },
            { icon: <Clipboard size={24} />, label: "Records" },
            { icon: <Activity size={24} />, label: "Analytics" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.2, duration: 0.5 }}
            >
              <motion.div
                className={`w-12 h-12 rounded-lg ${isComplete ? 'bg-green-600/50' : 'bg-purple-700/50'} backdrop-blur-sm flex items-center justify-center mb-2`}
                animate={{ 
                  opacity: isComplete ? 1 : [0.7, 1, 0.7],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: isComplete ? 0 : Infinity,
                  delay: index * 0.5,
                }}
              >
                {item.icon}
              </motion.div>
              <span className="text-xs text-purple-300">{item.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Loading bar */}
        <div className="h-1.5 bg-purple-900/50 rounded-full w-full max-w-xs mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-400 to-indigo-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

