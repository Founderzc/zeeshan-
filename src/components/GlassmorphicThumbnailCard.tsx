import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Eye, TrendingUp, Sparkles, Wand2, Trash2, Loader2 } from 'lucide-react';
import { PushPin } from './PushPin';

export interface ThumbnailData {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  stats?: string;
  createdAt?: any;
}

interface GlassmorphicThumbnailCardProps {
  thumbnail: ThumbnailData;
  index?: number;
  onClick?: (thumbnail: ThumbnailData) => void;
  isAdmin?: boolean;
  isRefining?: boolean;
  onRefine?: (id: string, imageUrl: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

/**
 * GlassmorphicThumbnailCard
 *
 * Cinematic iOS-inspired Glassmorphic Thumbnail Card component.
 *
 * Requirements:
 * 1. Translucent frosted glass border and underlying backdrop-filter blur.
 * 2. On Hover: High-performance 3D lift/tilt effect (hardware accelerated)
 *    with adaptive inner glare reflection following mouse coordinates.
 * 3. Text overlays with Apple-style Vibrancy (high-contrast legibility over any background).
 * 4. Magnetic integration with InteractiveGlassCursor via `data-cursor="thumbnail"`.
 * 5. Full uncropped 100% visible thumbnail presentation.
 */
export const GlassmorphicThumbnailCard: React.FC<GlassmorphicThumbnailCardProps> = ({
  thumbnail,
  index = 0,
  onClick,
  isAdmin = false,
  isRefining = false,
  onRefine,
  onDelete,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Normalized mouse coordinates (-0.5 to 0.5) for 3D physics tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Glare position in percentages (0% to 100%)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // Apple-grade spring physics for smooth, organic 60fps tilt damping
  const tiltSpringConfig = { damping: 25, stiffness: 260, mass: 0.55 };
  const smoothMouseX = useSpring(mouseX, tiltSpringConfig);
  const smoothMouseY = useSpring(mouseY, tiltSpringConfig);
  const smoothGlareX = useSpring(glareX, { damping: 22, stiffness: 300 });
  const smoothGlareY = useSpring(glareY, { damping: 22, stiffness: 300 });

  // 3D rotations based on normalized cursor position
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-7, 7]);

  // Dynamic specular glare radial gradient following the cursor
  const glareBackground = useTransform(
    [smoothGlareX, smoothGlareY],
    ([x, y]) =>
      `radial-gradient(circle 360px at ${x}% ${y}%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.25) 35%, rgba(255, 255, 255, 0) 70%)`
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX.set(x / rect.width - 0.5);
      mouseY.set(y / rect.height - 0.5);

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

  // Formatted date string
  const formattedDate = React.useMemo(() => {
    if (!thumbnail.createdAt) return 'Recent';
    const date = thumbnail.createdAt.toDate ? thumbnail.createdAt.toDate() : new Date(thumbnail.createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60) || 1}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [thumbnail.createdAt]);

  const pinColors = ['#FF6321', '#3B82F6', '#10B981', '#F59E0B'];
  const pinColor = pinColors[index % pinColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.05, 0.35), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-sm flex relative ${className}`}
      data-cursor="thumbnail"
      data-cursor-badge="VIEW"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick && onClick(thumbnail)}
        style={{
          perspective: 1200,
        }}
        className="w-full relative flex flex-col group cursor-pointer"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          animate={{
            scale: isHovered ? 1.025 : 1,
            y: isHovered ? -8 : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
            mass: 0.6,
          }}
          className="w-full h-full flex flex-col relative rounded-[28px] overflow-hidden border border-white/80 bg-white/75 backdrop-blur-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.08),inset_0_1.5px_1px_rgba(255,255,255,0.95)] transition-colors"
        >
          {/* Subtle Decorative Push Pin */}
          <PushPin color={pinColor} />

          {/* Precision Specular Inner Glare Overlay (Apple Glass reflection) */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
              mixBlendMode: 'overlay',
            }}
            aria-hidden="true"
          />

          {/* iPhone Beveled Rim Light */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/50 z-20"
            aria-hidden="true"
          />

          {/* Thumbnail Container: 16:9 full uncropped display */}
          <div className="aspect-video relative bg-zinc-950/90 rounded-t-[26px] overflow-hidden flex items-center justify-center border-b border-white/20">
            {/* Loading Pulse Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-100 animate-pulse flex items-center justify-center z-10" />
            )}

            {/* Ambient Underglow (makes any thumbnail pop aesthetically) */}
            <img
              src={thumbnail.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
              aria-hidden="true"
            />

            {/* Crisp 100% visible thumbnail image */}
            <motion.img
              src={thumbnail.imageUrl}
              alt={thumbnail.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              onLoad={() => setImageLoaded(true)}
              className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />

            {/* Apple Vibrancy Hover Overlay with Inspect Pill */}
            <div className="absolute inset-0 z-20 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none backdrop-blur-[2px]">
              <span className="px-4 py-2 rounded-full bg-white/95 text-zinc-900 text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 border border-white/80">
                <Eye size={13} className="text-blue-600" /> View Fullscreen
              </span>
            </div>

            {/* Admin Action Controls */}
            {isAdmin && (
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
                {onRefine && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefine(thumbnail.id, thumbnail.imageUrl);
                    }}
                    disabled={isRefining}
                    className="p-2 bg-blue-600/90 text-white rounded-full hover:bg-blue-700 backdrop-blur-md shadow-lg disabled:opacity-50 transition-colors"
                    title="Refine Title & Hook with AI"
                  >
                    {isRefining ? <Loader2 size={15} className="animate-spin" /> : <Wand2 size={15} />}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(thumbnail.id);
                    }}
                    className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 backdrop-blur-md shadow-lg transition-colors"
                    title="Delete Thumbnail"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details Section with Apple-grade Vibrancy & Typography */}
          <div className="p-5 flex-grow flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                {/* Frosted Glass Category Pill */}
                <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-blue-500/20 backdrop-blur-sm">
                  {thumbnail.category || 'Portfolio'}
                </span>

                {thumbnail.stats && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-700 bg-black/[0.04] px-2 py-0.5 rounded-md">
                    <TrendingUp size={11} className="text-emerald-500" />
                    {thumbnail.stats}
                  </span>
                )}
              </div>

              {/* Title with High Legibility */}
              <h3 className="text-zinc-900 font-bold text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {thumbnail.title}
              </h3>

              {thumbnail.description && (
                <p className="text-zinc-600 text-xs line-clamp-2 mt-1.5 leading-relaxed font-normal">
                  {thumbnail.description}
                </p>
              )}
            </div>

            {/* Bottom Meta Bar */}
            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400 pt-3 border-t border-black/5 mt-3">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Visual Architecture
              </span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GlassmorphicThumbnailCard;
