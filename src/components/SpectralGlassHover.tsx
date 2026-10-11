import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface SpectralGlassHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowClassName?: string;
  tiltIntensity?: number;
  scaleOnHover?: number;
  blurAmount?: number; // In px, default 25px
  auraScale?: number; // In scale, default 1.08
  rounded?: string; // Tailwind rounded class, default 'rounded-2xl'
  enableTilt?: boolean;
  enableGlare?: boolean;
  enableSpectralAura?: boolean;
  onClick?: () => void;
}

/**
 * SpectralGlassHover
 *
 * Ultra-high-end interactive wrapper component inspired by Google 'AI Mode' spectral glow ring
 * combined with Apple iOS glassmorphism layers.
 *
 * Key Interaction Features:
 * 1. Dynamic Spectral 'AI Mode' Glow Aura:
 *    - Neon pink (#FF2D85), soft yellow (#FFD54F), vibrant cyan (#00E5FF), light emerald (#00E676), violet (#7C4DFF).
 *    - Hidden by default (scale: 0.9, opacity: 0).
 *    - On proximity/hover: smoothly scales up, rotates subtly, and blurs outward (filter: blur(25px))
 *      producing a glowing halo ring exactly like the Google AI search bar.
 * 2. Cohesive Inner Glassmorphism Shimmer:
 *    - Apple iOS glass canvas ('backdrop-blur-xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]').
 *    - Hardware-accelerated 3D tilt in perspective(1000px).
 *    - Inner specular glare radial reflection following cursor position in real-time.
 * 3. Smooth Transition Rules:
 *    - Apple-grade spring physics (stiffness: 150, damping: 20) with 'will-change: transform, opacity'.
 */
export const SpectralGlassHover: React.FC<SpectralGlassHoverProps> = ({
  children,
  className = '',
  containerClassName = '',
  glowClassName = '',
  tiltIntensity = 7,
  scaleOnHover = 1.02,
  blurAmount = 25,
  auraScale = 1.08,
  rounded = 'rounded-2xl',
  enableTilt = true,
  enableGlare = true,
  enableSpectralAura = true,
  onClick,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized cursor coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Cursor coordinates in percentage (0 to 100%) for glare
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Spring physics matching stiffness: 150, damping: 20
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothGlareX = useSpring(glareX, { stiffness: 180, damping: 22 });
  const smoothGlareY = useSpring(glareY, { stiffness: 180, damping: 22 });

  // 3D rotations based on normalized cursor position
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

  // Subtle rotation for spectral aura ring following mouse angle
  const auraRotate = useTransform(
    [smoothMouseX, smoothMouseY],
    ([x, y]) => ((Number(x) * 20) + (Number(y) * 15))
  );

  // Dynamic specular inner glare reflection
  const glareBackground = useTransform(
    [smoothGlareX, smoothGlareY],
    ([x, y]) =>
      `radial-gradient(circle 320px at ${x}% ${y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 30%, rgba(255, 255, 255, 0) 70%)`
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates (-0.5 to 0.5)
      const normX = x / rect.width - 0.5;
      const normY = y / rect.height - 0.5;

      mouseX.set(normX);
      mouseY.set(normY);

      // Percentage for glare
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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ perspective: 1000 }}
      className={`relative inline-flex items-center justify-center group ${containerClassName}`}
      {...(rest as any)}
    >
      {/* 1. Dynamic Spectral 'AI Mode' Glow Aura (Google AI Ring) */}
      {enableSpectralAura && (
        <motion.div
          aria-hidden="true"
          style={{
            rotate: auraRotate,
            filter: `blur(${blurAmount}px)`,
          }}
          animate={{
            scale: isHovered ? auraScale : 0.9,
            opacity: isHovered ? 0.95 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 20,
            mass: 0.5,
          }}
          className={`pointer-events-none absolute -inset-2 z-0 will-change-transform ${rounded} ${glowClassName}`}
        >
          {/* Multi-color spectral conic/linear gradient ring: Neon Pink, Soft Yellow, Cyan, Light Emerald, Soft Violet */}
          <div
            className={`w-full h-full ${rounded} opacity-90 animate-gradient-x`}
            style={{
              background:
                'conic-gradient(from 180deg at 50% 50%, #FF2D85 0deg, #FFD54F 75deg, #00E676 150deg, #00E5FF 230deg, #7C4DFF 300deg, #FF2D85 360deg)',
            }}
          />
        </motion.div>
      )}

      {/* Thin crisp spectral border trace around card edge */}
      {enableSpectralAura && (
        <motion.div
          aria-hidden="true"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`pointer-events-none absolute -inset-[1px] z-10 will-change-transform ${rounded}`}
          style={{
            background:
              'linear-gradient(135deg, rgba(255,45,133,0.8) 0%, rgba(255,213,79,0.7) 25%, rgba(0,230,118,0.7) 50%, rgba(0,229,255,0.8) 75%, rgba(124,77,255,0.8) 100%)',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* 2. Cohesive Top Apple iOS Glassmorphism Canvas */}
      <motion.div
        style={{
          rotateX: enableTilt ? rotateX : 0,
          rotateY: enableTilt ? rotateY : 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
        }}
        animate={{
          scale: isHovered ? scaleOnHover : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 20,
          mass: 0.5,
        }}
        className={`relative z-20 w-full h-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${rounded} overflow-hidden transition-colors ${className}`}
      >
        {/* Inner Specular Glare Reflection (following cursor) */}
        {enableGlare && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* Delicate inner rim bevel ring */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-20 ring-1 ring-inset ring-white/15 ${rounded}`}
        />

        {/* Content Children */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default SpectralGlassHover;
