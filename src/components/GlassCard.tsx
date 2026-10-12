import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  tiltIntensity?: number;
  scaleOnHover?: number;
  liftOnHover?: number;
  enableTilt?: boolean;
  enableGlare?: boolean;
  glareIntensity?: number;
  blurStrength?: 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'light' | 'subtle' | 'dark' | 'glow-blue' | 'glow-purple';
  cursorBadge?: string;
}

/**
 * GlassCard
 * Production-grade Apple-inspired Frosted Glass Card with hardware-accelerated 3D lift/tilt
 * and fluid specular glare tracking.
 *
 * Unified Specification:
 * - Frosted glass styling: backdrop-blur-xl bg-white/75 border border-white/80 dark:bg-black/20 dark:border-white/10
 * - High-contrast text legibility (deep charcoal #1d1d1f or vibrant contrast)
 * - Apple spring physics: stiffness: 120, damping: 25, mass: 0.5
 * - Performance: will-change: transform, opacity; transform-gpu
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  tiltIntensity = 6,
  scaleOnHover = 1.02,
  liftOnHover = -8,
  enableTilt = true,
  enableGlare = true,
  glareIntensity = 0.45,
  blurStrength = 'xl',
  variant = 'light',
  cursorBadge,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinates normalized between -0.5 and 0.5 for 3D perspective
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Specular Glare position (0% to 100%)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Apple-grade spring physics (stiffness: 120, damping: 25, mass: 0.5)
  const springConfig = { stiffness: 120, damping: 25, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothGlareX = useSpring(glareX, { stiffness: 140, damping: 22, mass: 0.4 });
  const smoothGlareY = useSpring(glareY, { stiffness: 140, damping: 22, mass: 0.4 });

  // 3D Tilt rotations
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Dynamic glare radial gradient that tracks cursor coordinates
  const glareBackground = useTransform(
    [smoothGlareX, smoothGlareY],
    ([x, y]) =>
      `radial-gradient(circle 420px at ${x}% ${y}%, rgba(255, 255, 255, ${glareIntensity}) 0%, rgba(255, 255, 255, ${glareIntensity * 0.35}) 40%, rgba(255, 255, 255, 0) 75%)`
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;

      mouseX.set(normX);
      mouseY.set(normY);

      glareX.set((x / rect.width) * 100);
      glareY.set((y / rect.height) * 100);
    },
    [mouseX, mouseY, glareX, glareY]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  const blurClasses = {
    md: 'backdrop-blur-none md:backdrop-blur-md',
    lg: 'backdrop-blur-none md:backdrop-blur-lg',
    xl: 'backdrop-blur-none md:backdrop-blur-xl',
    '2xl': 'backdrop-blur-none md:backdrop-blur-2xl',
  }[blurStrength];

  const variantStyles = {
    light:
      'bg-white/95 dark:bg-zinc-900/95 md:bg-white/75 md:dark:bg-black/20 text-zinc-900 border-white/80 dark:border-white/10 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.02),inset_0_1.5px_1px_rgba(255,255,255,0.95)]',
    subtle:
      'bg-white/95 dark:bg-zinc-900/95 md:bg-white/55 md:dark:bg-black/15 text-zinc-900 border-white/60 dark:border-white/10 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.7)]',
    dark:
      'bg-zinc-950 text-white md:bg-zinc-950/75 border-white/15 shadow-[0_14px_45px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]',
    'glow-blue':
      'bg-white/95 dark:bg-zinc-900/95 md:bg-white/80 text-zinc-900 border-blue-500/30 shadow-[0_14px_40px_-8px_rgba(0,112,243,0.12),inset_0_1.5px_1px_rgba(255,255,255,0.95)]',
    'glow-purple':
      'bg-white/95 dark:bg-zinc-900/95 md:bg-white/80 text-zinc-900 border-purple-500/30 shadow-[0_14px_40px_-8px_rgba(121,40,202,0.12),inset_0_1.5px_1px_rgba(255,255,255,0.95)]',
  }[variant];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-cursor="card"
      data-cursor-badge={cursorBadge}
      style={{
        perspective: 1100,
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
      }}
      animate={{
        scale: isHovered ? scaleOnHover : 1,
        y: isHovered ? liftOnHover : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 25,
        mass: 0.5,
      }}
      className={`relative rounded-[28px] border overflow-hidden transition-colors transform-gpu will-change-transform ${blurClasses} ${variantStyles} ${className}`}
      {...(rest as any)}
    >
      {/* Specular Inner Glare Overlay */}
      {enableGlare && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            background: glareBackground,
            opacity: isHovered ? 1 : 0,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Subtle Apple-style Rim Highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/40 dark:border-white/10 z-20" />

      {/* Content slot */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};
