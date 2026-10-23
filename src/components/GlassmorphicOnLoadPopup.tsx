import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowUpRight,
  Sparkles,
  Layers,
  CreditCard,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Compact, Hyper-Realistic 3D Human Eyeball with Cursor Tracking
 * - Organic purple/violet iris texture
 * - Anatomical radial stroma fibers, limbal ring, and pupil dynamics
 * - Micro-capillaries / delicate sclera veins
 * - Dynamic pupil dilation based on cursor proximity
 * - Organic blinking reflexes
 * - Engineered to fit a compact, minimalist iOS header (size: 26-36px)
 */
interface TrackingHumanEyeProps {
  size?: number;
  className?: string;
  isHovered?: boolean;
}

export const TrackingHumanEye: React.FC<TrackingHumanEyeProps> = ({
  size = 28,
  className = '',
  isHovered = false
}) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDilation, setIsDilation] = useState(false);

  // Mouse tracking with Math.atan2 & strict eyeball bounding limit
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;

      const distance = Math.hypot(deltaX, deltaY);
      const angle = Math.atan2(deltaY, deltaX);

      // Max allowable pupil travel inside sclera curvature (keeps iris strictly within boundary)
      const maxRadius = (rect.width || size) * 0.25;
      const distanceFactor = Math.min(distance / 200, 1);
      const travelRadius = maxRadius * distanceFactor;

      const x = Math.cos(angle) * travelRadius;
      const y = Math.sin(angle) * travelRadius;

      setPupilPos({ x, y });
      setIsDilation(distance < 160);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  // Natural organic blinking reflex (random interval between 3s and 6.5s)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextInterval = Math.random() * 3500 + 3200;
        blinkTimeout = setTimeout(triggerBlink, nextInterval);
      }, 140);
    };

    blinkTimeout = setTimeout(triggerBlink, 3500);
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <div 
      ref={eyeRef}
      className={`relative select-none shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      title="3D Gaze Tracking"
    >
      {/* Subtle Ambient Violet Glow */}
      <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md pointer-events-none" />

      {/* Outer Eyeball Shell (Sclera with organic depth) */}
      <div 
        className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_0_2px_5px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/20 transition-transform duration-200"
        style={{
          background: 'radial-gradient(circle at 45% 40%, #ffffff 0%, #f4f3f7 50%, #e2dfea 85%, #cfcad8 100%)'
        }}
      >
        {/* Organic Micro-Capillaries in Sclera */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-multiply" 
          viewBox="0 0 100 100"
        >
          <path d="M 6 50 Q 20 48 30 45" stroke="#b91c1c" strokeWidth="1.2" fill="none" opacity="0.6" />
          <path d="M 94 50 Q 80 48 70 45" stroke="#b91c1c" strokeWidth="1.2" fill="none" opacity="0.6" />
        </svg>

        {/* 3D Iris & Pupil Assembly */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          style={{
            width: size * 0.58,
            height: size * 0.58,
          }}
          animate={{
            x: pupilPos.x,
            y: pupilPos.y,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 18,
            mass: 0.4
          }}
        >
          {/* Iris Outer Limbal Ring + Organic Purple/Violet Texture */}
          <div 
            className="w-full h-full rounded-full relative overflow-hidden flex items-center justify-center shadow-[inset_0_1px_4px_rgba(0,0,0,0.7)]"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #9333ea 0%, #7c3aed 40%, #4c1d95 80%, #1e1035 100%)'
            }}
          >
            {/* Iris Fibers / Conic Radial pattern */}
            <div 
              className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay pointer-events-none"
              style={{
                background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,0.45) 0deg 9deg, transparent 9deg 18deg)'
              }}
            />
            {/* Violet Stroma Ring */}
            <div 
              className="absolute inset-0.5 rounded-full opacity-75 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 35%, rgba(216, 180, 254, 0.6) 65%, rgba(109, 40, 217, 0.8) 100%)'
              }}
            />

            {/* Central Pupil (Obsidian Black with Proximity Dilation) */}
            <motion.div
              className="rounded-full bg-[#050508] shadow-[inset_0_1px_2px_rgba(0,0,0,0.95)] relative flex items-center justify-center"
              style={{
                width: size * 0.23,
                height: size * 0.23
              }}
              animate={{
                scale: isDilation ? 1.25 : 1
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 20
              }}
            />

            {/* Specular Cornea Dual Glint Highlights */}
            <div 
              className="absolute top-[20%] left-[22%] w-[24%] h-[20%] rounded-full bg-white/95 blur-[0.3px] shadow-[0_0_4px_rgba(255,255,255,0.85)] pointer-events-none -rotate-25" 
            />
            <div 
              className="absolute bottom-[22%] right-[22%] w-[12%] h-[12%] rounded-full bg-white/60 pointer-events-none" 
            />
          </div>
        </motion.div>

        {/* Cornea Glass Curvature Specular Sheen */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 50%, transparent 70%)'
          }}
        />

        {/* Eyelids (Natural Organic Blinking Reflex) */}
        <motion.div
          className="absolute inset-0 bg-[#d8cedb] dark:bg-[#1a1721] z-30 pointer-events-none origin-top border-b border-black/10"
          animate={{ scaleY: isBlinking ? 1 : 0 }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 bg-[#d8cedb] dark:bg-[#1a1721] z-30 pointer-events-none origin-bottom border-t border-black/10"
          animate={{ scaleY: isBlinking ? 1 : 0 }}
          transition={{ duration: 0.1, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export interface GlassmorphicOnLoadPopupProps {
  onDismiss?: () => void;
  storageKey?: string;
  delayMs?: number; // Exactly 10 seconds (10000ms) by default
}

// 9 Rotating Social & Payment Handles (Fades every 20 seconds on a single line of low-opacity text)
const SOCIAL_HANDLES = [
  { name: 'LinkedIn', handle: 'LinkedIn • linkedin.com/in/zedscore' },
  { name: 'Fiverr', handle: 'Fiverr Pro • @z_score_design' },
  { name: 'Payoneer', handle: 'Payoneer • Global Wire Verified' },
  { name: 'JazzCash', handle: 'JazzCash • Instant Settlement (+92 303 5408206)' },
  { name: 'X', handle: 'X (Twitter) • @ZedScoreTeam' },
  { name: 'TikTok', handle: 'TikTok • @zscore.visuals' },
  { name: 'YouTube', handle: 'YouTube • @ZScoreVisuals' },
  { name: 'Instagram', handle: 'Instagram • @zedscore' },
  { name: 'Mail', handle: 'Mail • infozedscoreteam@gmail.com' },
];

/**
 * Minimalist Apple iOS Notification System
 * - Clean, spacious single frosted glass card
 * - Header row: small 18-20px brand logo + compact tracking eye + thin typography + minimal close icon
 * - Generous breathing whitespace, no bulky backgrounds or heavy card stacks
 * - 20-second elegant text fade loop for social handles on a single low-opacity line
 * - Polished inline capsule / minimal text action links ("Visit Site", "View Thumbnails", "Pricing")
 * - 10-second delayed trigger with sessionStorage persistence and ESC dismissal
 */
export const GlassmorphicOnLoadPopup: React.FC<GlassmorphicOnLoadPopupProps> = ({
  onDismiss,
  storageKey = 'zscore_ios_notification_seen',
  delayMs = 10000 // EXACTLY 10 seconds (10000ms) delayed trigger
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [socialIndex, setSocialIndex] = useState(0);

  useEffect(() => {
    // Disable popup completely on mobile devices (< 768px)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    const hasSeen = sessionStorage.getItem(storageKey);
    if (hasSeen) return;

    // Trigger notification popup exactly 10 seconds (10000ms) after user opens the website
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;
      const alreadySeen = sessionStorage.getItem(storageKey);
      if (!alreadySeen) {
        setIsVisible(true);
      }
    }, delayMs);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 768 && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [storageKey, delayMs, isVisible]);

  // 20-second elegant fade loop for social handles
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setSocialIndex((prev) => (prev + 1) % SOCIAL_HANDLES.length);
    }, 20000); // 20000ms = 20 seconds loop

    return () => clearInterval(interval);
  }, [isVisible]);

  const navigate = useNavigate();

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(storageKey, 'true');
    if (onDismiss) onDismiss();
  };

  const handleAction = (hashOrPath: string) => {
    handleClose();
    if (hashOrPath.startsWith('#')) {
      if (window.location.pathname !== '/') {
        navigate('/' + hashOrPath);
        setTimeout(() => {
          const el = document.querySelector(hashOrPath);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(hashOrPath);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(hashOrPath);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div 
          className="hidden md:flex fixed inset-0 z-[120] items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Notification - Z-Score Studio"
        >
          {/* Subtle iOS backdrop blur - lightweight on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 md:bg-black/30 md:backdrop-blur-sm"
          />

          {/* Ultra-Clean Single iOS Frosted Glass Notification Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ 
              type: "spring", 
              stiffness: 140, 
              damping: 20, 
              mass: 0.6 
            }}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
            className="relative w-full max-w-[390px] z-10 rounded-[22px] p-5 sm:p-6 bg-white/95 dark:bg-zinc-900/95 md:bg-white/85 md:dark:bg-black/40 md:backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl text-zinc-900 dark:text-zinc-100 select-none overflow-hidden transform-gpu will-change-[transform,opacity]"
          >
            {/* Subtle multi-hue ambient glare behind glass */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* 1. Header Line: Small Side Logo (18-20px) + Compact Tracking Eye + Thin Typography + Sleek Close */}
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-black/5 dark:border-white/10 relative z-10">
              <div className="flex items-center gap-2 min-w-0">
                {/* Crisp Small Brand Logo (18px - 20px) */}
                <div className="w-[19px] h-[19px] rounded-md bg-zinc-900 dark:bg-zinc-100 p-0.5 flex items-center justify-center shrink-0 shadow-xs">
                  <img 
                    src="https://i.ibb.co/HpDY2hQY/dfef.png" 
                    alt="Z-Score Logo" 
                    className="w-full h-full object-contain invert dark:invert-0" 
                    referrerPolicy="no-referrer" 
                  />
                </div>

                {/* Compact 3D Human Tracking Eye (24px) */}
                <TrackingHumanEye 
                  size={24} 
                  isHovered={isCardHovered} 
                />

                {/* Thin, Premium iOS Typography */}
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[12px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Z-Score Studio
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                    now
                  </span>
                </div>
              </div>

              {/* Minimalist Glass Close Icon Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Dismiss notification"
                className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              >
                <X size={13} className="stroke-[2.2]" />
              </button>
            </div>

            {/* 2. Body Content: Generous Whitespace, Elegant Typography */}
            <div className="space-y-1.5 py-1 relative z-10">
              <h4 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white leading-snug">
                Engineered for maximum CTR & viewer retention.
              </h4>
              <p className="text-[12.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                Discover custom high-conversion thumbnail design engineered for top-tier creators.
              </p>

              {/* 20-Second Elegant Social Handles Fade Loop (Single line of low-opacity text) */}
              <div className="pt-1.5 h-6 flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={socialIndex}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 0.65, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="text-[10.5px] font-mono tracking-tight text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/70 inline-block shrink-0 animate-pulse" />
                    <span className="truncate">{SOCIAL_HANDLES[socialIndex].handle}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 3. Navigation Links: Polished Minimalist Inline Capsule Tags */}
            <div className="flex items-center gap-1.5 pt-3 mt-1.5 border-t border-black/5 dark:border-white/10 relative z-10">
              {/* "Visit Site" Capsule Tag */}
              <button
                type="button"
                onClick={() => handleAction('#home')}
                className="flex-1 py-1.5 px-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/5 dark:border-white/10 text-[11.5px] font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all text-center flex items-center justify-center gap-1 active:scale-97"
              >
                <span>Visit Site</span>
              </button>

              {/* "View Thumbnails" Capsule Tag */}
              <Link
                to="/thumbnails"
                onClick={handleClose}
                className="flex-1 py-1.5 px-2.5 rounded-full bg-purple-500/10 dark:bg-purple-500/15 hover:bg-purple-500/20 dark:hover:bg-purple-500/25 border border-purple-500/20 text-[11.5px] font-medium text-purple-700 dark:text-purple-300 transition-all text-center flex items-center justify-center gap-1 active:scale-97"
              >
                <span>Thumbnails</span>
                <ArrowUpRight size={11} className="opacity-70" />
              </Link>

              {/* "Pricing" Capsule Tag */}
              <button
                type="button"
                onClick={() => handleAction('#pricing')}
                className="flex-1 py-1.5 px-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.12] border border-black/5 dark:border-white/10 text-[11.5px] font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-all text-center flex items-center justify-center gap-1 active:scale-97"
              >
                <span>Pricing</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlassmorphicOnLoadPopup;
