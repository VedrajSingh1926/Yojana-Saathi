import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export default function SplashLoader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // 1.8 second total duration before starting the fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 800); // Wait for fade out animation to finish before unmounting completely
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-loader-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="splash-content">
            {/* Soft Glow Behind Logo */}
            {!shouldReduceMotion && (
              <motion.div
                className="splash-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
              />
            )}
            
            <motion.div
              className="splash-logo-wrapper"
              initial={{ scale: shouldReduceMotion ? 1 : 0.9, opacity: 0 }}
              animate={{ 
                scale: shouldReduceMotion ? 1 : [0.9, 1, 1.02, 1],
                opacity: 1 
              }}
              transition={{ 
                duration: shouldReduceMotion ? 0 : 2, 
                ease: "easeInOut",
                times: shouldReduceMotion ? undefined : [0, 0.4, 0.7, 1]
              }}
            >
              <img src="/Logo.png" alt="Yojana Saathi Logo" className="splash-logo" />
            </motion.div>
            
            <motion.div
              className="splash-text-container"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="splash-title">Yojana Saathi</h1>
              <p className="splash-subtitle">India's AI Welfare OS</p>
            </motion.div>
            
            <div className="splash-loading-bar-container">
              {shouldReduceMotion ? (
                <div className="splash-loading-bar-static">Loading...</div>
              ) : (
                <motion.div
                  className="splash-loading-bar"
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 1.6, ease: "easeInOut" }}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
