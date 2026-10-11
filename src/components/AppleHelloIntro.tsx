import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AppleHelloIntroProps {
  onComplete?: () => void;
}

// Staggered two-word sequence requested: "Hello" -> "Creator" (or "Buddy")
const WORDS = [
  { text: "Hello", subtext: "Welcome to Z Score Studio" },
  { text: "Creator", subtext: "High-Performance Visual Architecture" }
];

export const AppleHelloIntro: React.FC<AppleHelloIntroProps> = ({ onComplete }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // 1. First word ("Hello") stays for premium pause (~1.35s), then morphs to second word ("Creator")
    const morphTimer = setTimeout(() => {
      setWordIndex(1);
    }, 1400);

    // 2. After second word completes its brief reveal, gracefully scale up and dissolve
    const finishTimer = setTimeout(() => {
      setIsFinishing(true);
    }, 3200);

    // 3. Final unmount handoff to main global glassmorphism portfolio
    const completeTimer = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 4100);

    return () => {
      clearTimeout(morphTimer);
      clearTimeout(finishTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleSkipOrClick = () => {
    if (!isFinishing) {
      setIsFinishing(true);
      setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 650);
    }
  };

  if (isDone) return null;

  const currentWord = WORDS[wordIndex];

  return (
    <motion.div
      key="apple-hello-intro-overlay"
      initial={{ opacity: 1, scale: 1 }}
      animate={{ 
        opacity: isFinishing ? 0 : 1,
        filter: isFinishing ? "blur(24px)" : "blur(0px)",
        scale: isFinishing ? 1.04 : 1
      }}
      exit={{ 
        opacity: 0,
        filter: "blur(24px)",
        scale: 1.04
      }}
      transition={{ 
        duration: 0.9, 
        ease: [0.16, 1, 0.3, 1] // Strict Apple spring physics
      }}
      onClick={handleSkipOrClick}
      className="fixed inset-0 z-[250] flex flex-col items-center justify-between py-10 sm:py-14 px-6 overflow-hidden cursor-pointer select-none bg-[#f5f5f7]"
      style={{
        background: "radial-gradient(ellipse at 50% 48%, #ffffff 0%, #f6f6f8 65%, #ececed 100%)"
      }}
    >
      {/* Subtle Apple Ambient Glass Reflection / Aura */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.45, scale: [0.96, 1.04, 0.96] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute w-[640px] h-[640px] rounded-full blur-[130px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 113, 227, 0.08) 0%, rgba(200, 220, 255, 0.04) 50%, transparent 70%)"
        }}
      />

      {/* Top Bar: Minimalist iOS Brand Pill & Skip action */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl flex items-center justify-between z-10"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.03] backdrop-blur-md border border-black/[0.04] shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-sans font-medium tracking-wide text-zinc-600">
            Z Score Studio
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkipOrClick();
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
              src="https://i.ibb.co/QjQxzsHp/Z-SCORE-LOGO.png" 
              alt="Z Score Logo" 
              className="h-10 sm:h-12 md:h-14 w-auto brightness-0 transition-transform duration-500" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </motion.div>

        {/* 2. Staggered Morphing Text: "Hello" -> "Creator" in Google Font 'Caveat' */}
        <div className="relative h-32 sm:h-44 md:h-52 flex items-center justify-center overflow-visible">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.text}
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(14px)",
                scale: 0.92,
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
                y: -18,
                filter: "blur(14px)",
                scale: 1.06,
                clipPath: "inset(0% 0% 0% 0%)"
              }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1] // Apple's signature fluid transition curve
              }}
              className="text-center relative select-none flex flex-col items-center"
            >
              <h1 
                className="text-7xl sm:text-8xl md:text-9xl lg:text-[135px] font-medium leading-none text-[#1d1d1f] tracking-normal drop-shadow-sm"
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  fontWeight: 500,
                  WebkitFontSmoothing: "antialiased"
                }}
              >
                {currentWord.text}
              </h1>

              {/* Organic handwriting calligraphy accent line */}
              <motion.svg
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-32 sm:w-48 md:w-60 mx-auto -mt-2 sm:-mt-3 text-[#1d1d1f]/40 overflow-visible"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.65 }}
                transition={{
                  delay: 0.25,
                  duration: 0.8,
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
          </AnimatePresence>
        </div>

        {/* Minimalist Sub-caption reveal that adapts with the sequence */}
        <div className="h-10 mt-6 sm:mt-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentWord.subtext}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-sans font-normal tracking-wide text-zinc-500"
            >
              {currentWord.subtext}
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
