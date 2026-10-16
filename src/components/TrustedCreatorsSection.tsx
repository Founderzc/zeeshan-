import React, { useState, useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Plus, ArrowUpRight, ArrowDownRight, ArrowUpLeft, Shield, Award } from 'lucide-react';
import enablersAvatar from '../assets/images/regenerated_image_1791817292482.png';
import russianRockAvatar from '../assets/images/regenerated_image_1791817294093.png';
import rowRhythmAvatar from '../assets/images/regenerated_image_1791817303664.png';
import serrahxAvatar from '../assets/images/regenerated_image_1791908842046.jpg';
import mrJayPlayzAvatar from '../assets/images/regenerated_image_1791908843465.jpg';
import haProdAvatar from '../assets/images/regenerated_image_1791958692290.png';

export type SlotType = 'creator' | 'brand' | 'dashed-empty';

export interface CreatorGridSlot {
  id: string;
  type: SlotType;
  name?: string;
  handle?: string;
  image?: string;
  isGrayscale?: boolean; // black-and-white stylized portrait frames
  emptyLabel?: string;
  category?: string;
  tooltip?: {
    text: string;
    arrowDirection: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    style: 'charcoal' | 'electric-blue' | 'emerald';
  };
}

// Brand Logo constant - dead center slot
export const Z_SCORE_BRAND_LOGO = "https://i.ibb.co/QjQxzsHp/Z-SCORE-LOGO.png";

// EXTERNALIZED, FULLY EDITABLE DATA MATRIX
// Arranged in 3 rows of 5 columns (15 slots total) with dead-center Brand slot at Row 2, Column 3 (index 7).
export const CREATOR_GRID_MATRIX: CreatorGridSlot[] = [
  // --- ROW 1 (5 Slots) ---
  {
    id: 'c-1',
    type: 'creator',
    name: 'Azul Welz',
    handle: '357K Subscribers',
    image: 'https://i.ibb.co/ddJ5FDm/image.png',
    isGrayscale: false,
    category: 'Entertainment',
    tooltip: {
      text: 'Verified Partner ★',
      arrowDirection: 'bottom-right',
      style: 'emerald'
    }
  },
  {
    id: 'empty-1',
    type: 'dashed-empty',
    emptyLabel: 'Reserve Slot'
  },
  {
    id: 'c-2',
    type: 'creator',
    name: 'Kristen & Siya',
    handle: '329K Subscribers',
    image: 'https://i.ibb.co/rR6LmpRm/image.png',
    isGrayscale: true, // Black-and-white stylized portrait frame
    category: 'Travel'
  },
  {
    id: 'c-3',
    type: 'creator',
    name: 'Hustle Ninjas',
    handle: '301K Subscribers',
    image: 'https://i.ibb.co/NdXYBpM4/image.png',
    isGrayscale: false,
    category: 'Finance',
    tooltip: {
      text: 'Admin ↗',
      arrowDirection: 'top-right',
      style: 'charcoal'
    }
  },
  {
    id: 'empty-2',
    type: 'dashed-empty',
    emptyLabel: 'Next Creator'
  },

  // --- ROW 2 (5 Slots - Dead Center is Brand Slot at index 7) ---
  {
    id: 'c-4',
    type: 'creator',
    name: 'Row Rhythm',
    handle: '35K Subscribers',
    image: rowRhythmAvatar,
    isGrayscale: true, // Black-and-white stylized portrait frame
    category: 'Tech'
  },
  {
    id: 'c-5',
    type: 'creator',
    name: 'Rob Lipsett',
    handle: '491K Subscribers',
    image: 'https://i.ibb.co/6J4CbdQf/image.png',
    isGrayscale: false,
    category: 'Fitness'
  },
  {
    // === EXACT DEAD-CENTER BRAND LOGO INTEGRATION ===
    id: 'brand-center',
    type: 'brand',
    name: 'Z Score',
    handle: 'Visual Architecture Agency',
    image: Z_SCORE_BRAND_LOGO,
    category: 'Agency Headquarters'
  },
  {
    id: 'c-6',
    type: 'creator',
    name: 'Enablers',
    handle: '592K Subscribers',
    image: enablersAvatar,
    isGrayscale: false,
    category: 'Business',
    tooltip: {
      text: 'Lead Visual Director ↖',
      arrowDirection: 'top-left',
      style: 'electric-blue'
    }
  },
  {
    id: 'c-7',
    type: 'creator',
    name: 'Russian Rock',
    handle: '690K Subscribers',
    image: russianRockAvatar,
    isGrayscale: true, // Black-and-white stylized portrait frame
    category: 'Gaming'
  },

  // --- ROW 3 (5 Slots) ---
  {
    id: 'empty-3',
    type: 'dashed-empty',
    emptyLabel: 'Slot Available'
  },
  {
    id: 'c-8',
    type: 'creator',
    name: 'serrahx',
    handle: '420K Subscribers',
    image: serrahxAvatar,
    isGrayscale: false,
    category: 'Tech'
  },
  {
    id: 'c-9',
    type: 'creator',
    name: 'mr jay playz',
    handle: '840K Subscribers',
    image: mrJayPlayzAvatar,
    isGrayscale: true, // Black-and-white stylized portrait frame
    category: 'Gaming'
  },
  {
    id: 'c-10',
    type: 'creator',
    name: 'HA PROD',
    handle: 'Creative Agency',
    image: haProdAvatar,
    isGrayscale: false,
    category: 'Agency Partner',
    tooltip: {
      text: 'Content Reviewer ↘',
      arrowDirection: 'bottom-right',
      style: 'charcoal'
    }
  },
  {
    id: 'empty-4',
    type: 'dashed-empty',
    emptyLabel: 'Open Collab'
  }
];

export interface TrustedClient {
  id: number;
  name: string;
  handle: string;
  image: string;
  color: string;
}

export interface TrustedCreatorsSectionProps {
  className?: string;
  gridData?: CreatorGridSlot[];
  brandLogoUrl?: string;
  clients?: any;
}

export const TrustedCreatorsSection: React.FC<TrustedCreatorsSectionProps> = ({
  className = '',
  gridData = CREATOR_GRID_MATRIX,
  brandLogoUrl = Z_SCORE_BRAND_LOGO,
  clients
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHoverSlot, setActiveHoverSlot] = useState<CreatorGridSlot | null>(null);

  // Hardware-accelerated 3D parallax tracking whenever the mouse moves around
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 22,
    mass: 0.4
  });

  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 120,
    damping: 22,
    mass: 0.4
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveHoverSlot(null);
  };

  return (
    <section 
      id="trusted-creators" 
      className={`py-16 sm:py-20 px-4 sm:px-6 relative overflow-visible bg-[#F5F5F7] dark:bg-black/95 transition-colors ${className}`}
    >
      {/* Background Soft Saturated Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-[140px] rounded-full pointer-events-none -z-10" 
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8 sm:space-y-10">
        {/* Minimalist Apple iOS Section Header */}
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] text-blue-600 dark:text-blue-400 text-antialiased"
          >
            <Sparkles size={11} className="text-blue-500" />
            <span>High-Impact Creator Matrix</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-[#1d1d1f] dark:text-white tracking-tight text-antialiased leading-none"
          >
            TRUSTED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">CREATORS.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium text-antialiased leading-relaxed"
          >
            A high-performance roster of top-tier creators, channel founders, and creative production agencies.
          </motion.p>
        </div>

        {/* ========================================================================= */}
        {/* THE ISOMETRIC / OFFSET DASHED CAPSULE SQUIRCLE GRID MATRIX                */}
        {/* Treatment: backdrop-blur-2xl bg-white/5 border border-white/10            */}
        {/* With sub-pixel responsive glass & 3D parallax tracking                   */}
        {/* ========================================================================= */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative max-w-4xl mx-auto [perspective:1400px] py-4"
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d'
            }}
            className="p-3 sm:p-5 md:p-7 rounded-[36px] sm:rounded-[44px] backdrop-blur-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_60px_-15px_rgba(0,0,0,0.06)] relative overflow-visible transform-gpu will-change-transform"
          >
            {/* Subtle internal glass rim reflection */}
            <div 
              className="pointer-events-none absolute inset-0 rounded-[36px] sm:rounded-[44px] ring-1 ring-inset ring-white/50 dark:ring-white/10" 
              aria-hidden="true" 
            />

            {/* 5-Column Staggered Squircle Matrix */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 relative z-10 items-center justify-items-center">
              {gridData.map((slot, index) => {
                const isCenterBrand = slot.type === 'brand';
                const isDashedEmpty = slot.type === 'dashed-empty';

                return (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.9, y: 16 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.min(index * 0.035, 0.4),
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{
                      scale: isCenterBrand ? 1.08 : 1.05,
                      y: -4,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                    }}
                    onMouseEnter={() => setActiveHoverSlot(slot)}
                    data-cursor="card"
                    className="relative group flex items-center justify-center w-full aspect-square max-w-[130px] sm:max-w-[145px]"
                  >
                    {/* ======================================================= */}
                    {/* 1. EXACT DEAD-CENTER BRAND LOGO SLOT                    */}
                    {/* ======================================================= */}
                    {isCenterBrand ? (
                      <div className="relative w-full h-full rounded-[26px] sm:rounded-[32px] p-2.5 sm:p-3.5 bg-gradient-to-b from-white/95 via-white/85 to-white/70 dark:from-zinc-900/95 dark:via-zinc-900/80 dark:to-zinc-950/90 border-2 border-blue-500/50 shadow-[0_12px_40px_rgba(0,85,255,0.3),inset_0_1px_2px_rgba(255,255,255,0.95)] flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden z-20 group-hover:border-blue-500 transition-all duration-300">
                        {/* Glowing radial halo behind logo */}
                        <div className="absolute inset-0 bg-radial-gradient from-blue-500/25 via-blue-500/5 to-transparent pointer-events-none" />

                        {/* Z Score Uploaded Brand Logo Container */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/15 p-2 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 relative">
                          <img
                            src={brandLogoUrl}
                            alt="Z Score Agency Logo"
                            className="w-full h-full object-contain brightness-0 dark:brightness-0 dark:invert"
                            referrerPolicy="no-referrer"
                            loading="eager"
                          />
                        </div>

                        {/* Center Badge Label */}
                        <div className="mt-1.5">
                          <span className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-white font-display">
                            Z SCORE
                          </span>
                          <span className="block text-[8px] sm:text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            AGENCY HQ
                          </span>
                        </div>

                        {/* Pulse Ring */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
                      </div>
                    ) : isDashedEmpty ? (
                      /* ======================================================= */
                      /* 2. EMPTY LIGHT-DASHED GRID SHAPE SQUIRCLE               */
                      /* ======================================================= */
                      <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] border-2 border-dashed border-zinc-300 dark:border-white/15 bg-white/20 dark:bg-white/[0.02] flex flex-col items-center justify-center text-center p-2 hover:border-blue-400 hover:bg-blue-50/20 dark:hover:bg-blue-500/5 transition-all duration-300 cursor-pointer group/empty">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover/empty:text-blue-600 group-hover/empty:scale-110 transition-all">
                          <Plus size={14} />
                        </div>
                        <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 group-hover/empty:text-zinc-700 dark:group-hover/empty:text-zinc-300 transition-colors">
                          {slot.emptyLabel || 'Slot'}
                        </span>
                      </div>
                    ) : (
                      /* ======================================================= */
                      /* 3. CREATOR AVATAR SQUIRCLE (Colorful OR Black-and-White)*/
                      /* ======================================================= */
                      <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] p-1 sm:p-1.5 backdrop-blur-2xl bg-white/60 dark:bg-white/10 border border-white/80 dark:border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_-6px_rgba(0,0,0,0.06)] hover:bg-white hover:border-white hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col items-center justify-center">
                        <div className="relative w-full h-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                          <img
                            src={slot.image}
                            alt={slot.name || 'Creator'}
                            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                              slot.isGrayscale
                                ? 'grayscale contrast-125 group-hover:grayscale-0'
                                : 'grayscale-0'
                            }`}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Verified Check Badge */}
                          <div className="absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 w-4 h-4 bg-blue-600 rounded-full ring-1 ring-white flex items-center justify-center">
                            <CheckCircle2 size={10} className="text-white" />
                          </div>

                          {/* Hover Name Overlay */}
                          <div className="absolute bottom-1 left-1.5 right-6 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                            <span className="text-[9px] font-bold text-white truncate block drop-shadow-sm">
                              {slot.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ======================================================= */}
                    {/* 4. FLOATING SLEEK TOOLTIP PILL BADGES POINTING TO SLOTS */}
                    {/* Examples: "Admin ↗", "Content Reviewer ↘", etc.         */}
                    {/* ======================================================= */}
                    {slot.tooltip && (
                      <div
                        style={{ transform: 'translateZ(30px)' }}
                        className={`absolute z-30 pointer-events-none transition-transform duration-300 group-hover:scale-110 ${
                          slot.tooltip.arrowDirection === 'top-right'
                            ? '-top-2.5 -right-3'
                            : slot.tooltip.arrowDirection === 'top-left'
                            ? '-top-2.5 -left-3'
                            : slot.tooltip.arrowDirection === 'bottom-left'
                            ? '-bottom-2.5 -left-3'
                            : '-bottom-2.5 -right-3'
                        }`}
                      >
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight shadow-xl border text-antialiased ${
                            slot.tooltip.style === 'charcoal'
                              ? 'bg-[#1d1d1f] text-white border-white/20 shadow-black/30'
                              : slot.tooltip.style === 'electric-blue'
                              ? 'bg-[#0055ff] text-white border-white/30 shadow-blue-500/30'
                              : 'bg-emerald-600 text-white border-white/30 shadow-emerald-500/30'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{slot.tooltip.text}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Status Ticker / Network Statistics */}
            <div className="mt-5 sm:mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500 font-medium">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  <Shield size={10} className="text-blue-500" />
                  Verified Roster
                </span>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  500M+ Aggregate Views Influenced
                </span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active Creator Network
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
