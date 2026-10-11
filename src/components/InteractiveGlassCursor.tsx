import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Eye, ArrowUpRight } from 'lucide-react';

export type CursorMode = 'default' | 'interactive' | 'thumbnail' | 'text' | 'hidden';

/**
 * InteractiveGlassCursor
 * Premium, hardware-accelerated Custom Mouse Cursor effect for high-end Glassmorphic UI.
 *
 * Requirements:
 * 1. Hide default cursor on desktop pointer devices.
 * 2. Two components:
 *    - Sharp central dot (snappy response, ultra-low latency).
 *    - Trailing "Glass Aura" outer ring (organic Apple-grade spring physics: mass 0.5, damping 25, stiffness 120).
 *    - Frosted glass appearance with backdrop-filter blur(4px), semi-translucent white glow, ultra-thin border.
 * 3. Magnetic & Context-Aware Interactions:
 *    - Interactive elements (buttons, links): Magnetic expansion & aura glow.
 *    - Thumbnail cards: Expands with a glass badge preview & vibrant indicator.
 *    - Text: Mix-blend-mode difference for Apple-style high-contrast readability.
 *    - Dynamic mousedown click bounce.
 * 4. 60fps hardware acceleration with zero jank.
 */
export const InteractiveGlassCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [customBadge, setCustomBadge] = useState<string | null>(null);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Sharp central dot spring physics (crisp, near-instant tracking)
  const dotSpringConfig = { damping: 40, stiffness: 650, mass: 0.1 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Trailing Glass Aura ring spring physics (Apple organic latency)
  // Matching user spec: mass: 0.5, damping: 25, stiffness: 120
  const auraSpringConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const auraX = useSpring(mouseX, auraSpringConfig);
  const auraY = useSpring(mouseY, auraSpringConfig);

  // Velocity tracking for subtle organic stretch
  const auraScale = useTransform([mouseX, mouseY], () => (isMouseDown ? 0.85 : 1));

  useEffect(() => {
    // Only activate custom cursor on devices with fine pointer (mouse / trackpad)
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    // Enable custom cursor active class on body to hide native cursor
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    // Magnetic and Context inspection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 1. Check for Thumbnail Card or Project Card
      const thumbCard = target.closest('[data-cursor="thumbnail"], [data-cursor="card"], .glass-thumbnail-card');
      if (thumbCard) {
        setCursorMode('thumbnail');
        const badgeLabel = thumbCard.getAttribute('data-cursor-badge') || 'VIEW';
        setCustomBadge(badgeLabel);
        return;
      }

      // 2. Check for Interactive Buttons / Links / Inputs
      const interactive = target.closest('button, a, input, textarea, select, [role="button"], [data-cursor="interactive"]');
      if (interactive) {
        setCursorMode('interactive');
        setCustomBadge(null);
        return;
      }

      // 3. Check for Text Elements with high vibrancy requirement
      const textElement = target.closest('h1, h2, h3, h4, p, blockquote, [data-cursor="text"]');
      if (textElement) {
        setCursorMode('text');
        setCustomBadge(null);
        return;
      }

      // Default state
      setCursorMode('default');
      setCustomBadge(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Size configurations depending on interaction mode
  const getAuraSize = () => {
    switch (cursorMode) {
      case 'thumbnail':
        return { width: 72, height: 72 };
      case 'interactive':
        return { width: 54, height: 54 };
      case 'text':
        return { width: 38, height: 38 };
      default:
        return { width: 36, height: 36 };
    }
  };

  const currentSize = getAuraSize();

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* 1. Sharp Central Dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[10000] will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible ? (cursorMode === 'text' ? 0 : 1) : 0,
          scale: isMouseDown ? 0.6 : cursorMode === 'thumbnail' ? 0 : cursorMode === 'interactive' ? 1.3 : 1,
          width: 5,
          height: 5,
          backgroundColor: cursorMode === 'interactive' ? '#2563eb' : '#09090b',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      />

      {/* 2. Trailing Glass Aura Outer Ring */}
      <motion.div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center will-change-transform ${
          cursorMode === 'text' ? 'mix-blend-difference' : ''
        }`}
        style={{
          x: auraX,
          y: auraY,
          translateX: '-50%',
          translateY: '-50%',
          scale: auraScale,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: currentSize.width,
          height: currentSize.height,
        }}
        transition={{
          type: 'spring',
          mass: 0.5,
          damping: 25,
          stiffness: 120,
        }}
      >
        {/* Apple Frosted Glass Layer */}
        <div
          className={`relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
            cursorMode === 'text'
              ? 'bg-white rounded-full'
              : cursorMode === 'thumbnail'
              ? 'bg-white/80 border border-white/95 shadow-[0_8px_30px_rgba(0,112,243,0.35),0_0_15px_rgba(255,255,255,0.8),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-md'
              : cursorMode === 'interactive'
              ? 'bg-blue-600/15 border border-blue-400/80 shadow-[0_0_20px_rgba(37,99,235,0.3),inset_0_1px_2px_rgba(255,255,255,0.7)] backdrop-blur-sm'
              : 'bg-white/40 border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-[4px]'
          }`}
          style={{
            backdropFilter: cursorMode === 'text' ? 'none' : 'blur(4px) saturate(180%)',
            WebkitBackdropFilter: cursorMode === 'text' ? 'none' : 'blur(4px) saturate(180%)',
          }}
        >
          {/* Specular Inner Glare Reflection Ring */}
          {cursorMode !== 'text' && (
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/50 to-transparent pointer-events-none opacity-70"
              aria-hidden="true"
            />
          )}

          {/* Thumbnail Badge Overlay (Apple Vibrancy Label) */}
          <AnimatePresence>
            {cursorMode === 'thumbnail' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-blue-600 font-display"
              >
                <Eye size={11} className="stroke-[2.5]" />
                <span>{customBadge || 'VIEW'}</span>
              </motion.div>
            )}
            {cursorMode === 'interactive' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="w-1.5 h-1.5 rounded-full bg-blue-600"
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveGlassCursor;
