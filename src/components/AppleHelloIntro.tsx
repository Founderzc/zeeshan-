import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AppleHelloIntroProps {
  onComplete?: () => void;
}

// iPhone 'Hello' to 'Creator' Text Morph Sequence
// Continuous flow: Enter "Hello" -> Exit "Hello" / Enter "Creator" -> Fade & scale out Intro layer
export const AppleHelloIntro: React.FC<AppleHelloIntroProps> = ({ onComplete }) => {
  // Current active word: 'hello' -> 'creator'
  const [currentWord, setCurrentWord] = useState<'hello' | 'creator'>('hello');
  // Trigger outro scale up & dissolve
  const [isOutro, setIsOutro] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // 1. "Hello" appears with handwriting draw / blur fade (~1100ms)
    // As soon as Hello completes its frame, immediately morph into "Creator" (no dead delay)
    const morphToCreatorTimer = setTimeout(() => {
      setCurrentWord('creator');
    }, 1250);

    // 2. "Creator" completes its frame (~1200ms after morph starts = 2450ms total)
    // Smoothly scale up and dissolve entire intro layout using Apple's premium spring physics
    const startOutroTimer = setTimeout(() => {
      setIsOutro(true);
    }, 2550);

    // 3. Final unmount handoff
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
      if (onComplete) onComplete();
    }, 3250);

    return () => {
      clearTimeout(morphToCreatorTimer);
      clearTimeout(startOutroTimer);
      clearTimeout(unmountTimer);
    };
  }, [onComplete]);

  const handleSkip = () => {
    if (!isOutro) {
      setIsOutro(true);
      setTimeout(() => {
        setIsMounted(false);
        if (onComplete) onComplete();
      }, 550);
    }
  };

  if (!isMounted) return null;

  return (
    <motion.div
      key="apple-hello-intro-overlay"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ 
        opacity: isOutro ? 0 : 1,
        scale: isOutro ? 1.08 : 1,
        filter: isOutro ? "blur(16px)" : "blur(0px)",
      }}
      exit={{ 
        opacity: 0,
        scale: 1.08,
        filter: "blur(16px)",
      }}
      transition={{ 
        type: "spring",
        stiffness: 120,
        damping: 25,
        mass: 0.6,
        duration: 0.75,
      }}
      onClick={handleSkip}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-between py-10 sm:py-14 px-6 overflow-hidden cursor-pointer select-none bg-[#f5f5f7] transform-gpu will-change-[transform,opacity]"
      style={{
        background: "radial-gradient(ellipse at 50% 48%, #ffffff 0%, #f6f6f8 65%, #ececed 100%)"
      }}
    >
      {/* Subtle Apple Ambient Glass Reflection / Aura (Hardware-accelerated) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.4, scale: [0.96, 1.04, 0.96] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[500px] sm:w-[640px] h-[500px] sm:h-[640px] rounded-full blur-[80px] sm:blur-[130px] pointer-events-none transform-gpu"
        style={{
          background: "radial-gradient(circle, rgba(0, 113, 227, 0.08) 0%, rgba(200, 220, 255, 0.04) 50%, transparent 70%)"
        }}
      />

      {/* Top Bar: Minimalist iOS Brand Pill & Skip action */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.05] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-sans font-medium tracking-wide text-zinc-600">
            Z Score Studio
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-sans text-zinc-400 hover:text-zinc-800 transition-colors px-3 py-1 rounded-full hover:bg-black/5"
        >
          Skip
        </button>
      </motion.div>

      {/* Main Center Stage: Logo + Morphing Handwritten Script Sequence */}
      <div className="relative flex flex-col items-center justify-center my-auto z-10 w-full max-w-3xl">
        
        {/* 1. Logo Integration & Spatial Layout: Centered Above with Soft Fade-In */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="mb-8 sm:mb-12 md:mb-14 flex items-center justify-center"
        >
          <div className="relative p-2">
            <img 
              src="https://i.ibb.co/HpDY2hQY/dfef.png" 
              alt="Z Score Logo" 
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-500" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </motion.div>

        {/* 2. Seamless Continuous Morphing: "Hello" -> "Creator" in Google Font 'Caveat' */}
        <div className="relative h-32 sm:h-44 md:h-52 flex items-center justify-center overflow-visible">
          <AnimatePresence mode="wait">
            {currentWord === 'hello' ? (
              <motion.div
                key="word-hello"
                initial={{
                  opacity: 0,
                  y: 18,
                  filter: "blur(12px)",
                  scale: 0.94,
                  clipPath: "inset(0% 100% 0% 0%)"
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0%)"
                }}
                exit={{
                  opacity: 0,
                  y: -14,
                  filter: "blur(12px)",
                  scale: 1.05,
                  clipPath: "inset(0% 0% 0% 0%)"
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1] // Apple's signature fluid transition curve
                }}
                className="text-center relative select-none flex flex-col items-center transform-gpu will-change-[transform,opacity]"
              >
                <h1 
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[135px] font-medium leading-none text-[#1d1d1f] tracking-normal drop-shadow-xs"
                  style={{
                    fontFamily: "'Caveat', cursive, sans-serif",
                    fontWeight: 500,
                    WebkitFontSmoothing: "antialiased"
                  }}
                >
                  Hello
                </h1>

                {/* Handwriting calligraphy accent underline for Hello */}
                <motion.svg
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-32 sm:w-48 md:w-60 mx-auto -mt-2 sm:-mt-3 text-[#1d1d1f]/40 overflow-visible"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.65 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <motion.path
                    d="M4 8C45 2 120 1 196 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </motion.div>
            ) : (
              <motion.div
                key="word-creator"
                initial={{
                  opacity: 0,
                  y: 18,
                  filter: "blur(12px)",
                  scale: 0.94,
                  clipPath: "inset(0% 100% 0% 0%)"
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: 1,
                  clipPath: "inset(0% 0% 0% 0%)"
                }}
                exit={{
                  opacity: 0,
                  y: -14,
                  filter: "blur(12px)",
                  scale: 1.05,
                  clipPath: "inset(0% 0% 0% 0%)"
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="text-center relative select-none flex flex-col items-center transform-gpu will-change-[transform,opacity]"
              >
                <h1 
                  className="text-7xl sm:text-8xl md:text-9xl lg:text-[135px] font-medium leading-none text-[#1d1d1f] tracking-normal drop-shadow-xs"
                  style={{
                    fontFamily: "'Caveat', cursive, sans-serif",
                    fontWeight: 500,
                    WebkitFontSmoothing: "antialiased"
                  }}
                >
                  Creator
                </h1>

                {/* Handwriting calligraphy accent underline for Creator */}
                <motion.svg
                  viewBox="0 0 200 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-36 sm:w-52 md:w-64 mx-auto -mt-2 sm:-mt-3 text-[#1d1d1f]/40 overflow-visible"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.65 }}
                  transition={{
                    delay: 0.15,
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <motion.path
                    d="M4 8C55 1 135 2 196 9"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minimalist Sub-caption reveal synced smoothly */}
        <div className="h-10 mt-6 sm:mt-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentWord}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-sans font-normal tracking-wide text-zinc-500"
            >
              {currentWord === 'hello' ? 'Welcome to Z Score Studio' : 'High-Performance Visual Architecture'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Area: iOS Home Indicator Bar & Subtle Tap Cue */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center gap-3 z-10"
      >
        <div className="w-32 sm:w-36 h-1 bg-black/15 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-black/40 to-transparent"
          />
        </div>
        <span className="text-[10px] uppercase font-mono tracking-[0.28em] text-zinc-400">
          Click anywhere to skip
        </span>
      </motion.div>
    </motion.div>
  );
};
