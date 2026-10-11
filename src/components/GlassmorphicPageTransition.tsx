import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, User, Home } from 'lucide-react';

interface GlassmorphicPageTransitionProps {
  children: React.ReactNode;
}

/**
 * GlassmorphicPageTransition
 * Global layout wrapper for cinematic iOS-inspired page transitions.
 *
 * Requirements:
 * 1. Fluid, seamless page transition when switching routes.
 * 2. Dynamic frosted glass overlay smoothly wiping/fading across viewport,
 *    blurring underlying content before revealing next page.
 * 3. Organic Apple-style spring physics (mass: 0.5, damping: 25, stiffness: 120)
 *    and cubic-bezier(0.16, 1, 0.3, 1) with zero lag and 60fps smoothness.
 * 4. Specular glare beam reflection sweeping across the glass curtain.
 * 5. Floating Apple frosted glass capsule showing the destination page badge.
 */
export const GlassmorphicPageTransition: React.FC<GlassmorphicPageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Scroll to top immediately on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const pageBadge = useMemo(() => {
    if (location.pathname === '/about') {
      return { 
        title: 'About Zeeshan', 
        subtitle: 'Story & Journey', 
        icon: <User size={15} className="text-blue-500" /> 
      };
    }
    if (location.pathname === '/thumbnails' || location.pathname === '/showcase') {
      return { 
        title: 'Thumbnail Showcase', 
        subtitle: 'Visual Architecture', 
        icon: <Layers size={15} className="text-purple-500" /> 
      };
    }
    return { 
      title: 'Z Score Portfolio', 
      subtitle: 'Architect of Attention', 
      icon: <Sparkles size={15} className="text-blue-500" /> 
    };
  }, [location.pathname]);

  return (
    <div className="relative w-full">
      {/* Dynamic Frosted Glass Curtain with Apple Spring Physics */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[150] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Frosted Glass Layer with Heavy Saturation & Blur */}
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(24px) saturate(180%)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-white/45"
              style={{
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              }}
            />

            {/* Specular Diagonal Reflection Beam (Apple Glare Wipe Effect) */}
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '160%', opacity: [0, 0.95, 0] }}
              transition={{
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute inset-y-0 w-3/5 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-22deg] pointer-events-none"
            />

            {/* Apple Frosted Glass Capsule Pill */}
            <motion.div
              initial={{ scale: 0.88, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: -10, opacity: 0 }}
              transition={{
                type: 'spring',
                mass: 0.5,
                damping: 25,
                stiffness: 120,
              }}
              className="relative z-10 px-6 py-3.5 rounded-full bg-white/85 border border-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.09),inset_0_1.5px_2px_rgba(255,255,255,1)] flex items-center gap-3.5 backdrop-blur-3xl"
            >
              <div className="w-8 h-8 rounded-full bg-black/[0.04] flex items-center justify-center shadow-inner">
                {pageBadge.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-900 tracking-wide font-display">{pageBadge.title}</span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-semibold">{pageBadge.subtitle}</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping ml-1" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Page Content Transition with Physics Blur & Scale */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14, scale: 0.99, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, scale: 0.99, filter: 'blur(6px)' }}
          transition={{
            duration: 0.36,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full relative will-change-[transform,opacity,filter]"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default GlassmorphicPageTransition;
