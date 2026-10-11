import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  Battery, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Flashlight,
  Camera
} from 'lucide-react';
import zeeshanProfilePic from '../assets/images/regenerated_image_1791712740532.jpg';

// Official SVG Brand Logos
const BRAND_ICONS = {
  LinkedIn: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z"/>
    </svg>
  ),
  Fiverr: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M22.5 12c0 5.8-4.7 10.5-10.5 10.5S1.5 17.8 1.5 12 6.2 1.5 12 1.5 22.5 6.2 22.5 12zm-8.8-4.7c-.9 0-1.5.4-1.9 1.1V7.5H9.5v8h2.3v-4.5c0-.9.6-1.5 1.5-1.5h.4V7.3zm4.5 4.7c0-2-1.4-3.5-3.3-3.5s-3.4 1.5-3.4 3.5 1.4 3.5 3.4 3.5 3.3-1.5 3.3-3.5zm-2.3 0c0 .9-.5 1.6-1.1 1.6s-1.1-.7-1.1-1.6.5-1.6 1.1-1.6 1.1.7 1.1 1.6z"/>
    </svg>
  ),
  Payoneer: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    </svg>
  ),
  JazzCash: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm1.07-7.75l-.9.92C12.45 10.9 12 11.5 12 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.67z" opacity="0.2"/>
      <path d="M5.5 12a6.5 6.5 0 0 1 11.3-4.4l1.8-1.8A9 9 0 0 0 3 12h2.5zm13 0a6.5 6.5 0 0 1-11.3 4.4l-1.8 1.8A9 9 0 0 0 21 12h-2.5z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  TikTok: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.38a6.34 6.34 0 0 0-.85-.06A6.33 6.33 0 0 0 3 15.65 6.34 6.34 0 0 0 12.23 20V12a8.16 8.16 0 0 0 5.36 2V10.5a4.83 4.83 0 0 1 2-.31v-3.5z"/>
    </svg>
  ),
  YouTube: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Mail: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  )
};

interface SocialLogoItem {
  id: string;
  name: string;
  handle: string;
  category: string;
  actionText: string;
  url: string;
  color: string;
  badgeBg: string;
  icon: () => React.JSX.Element;
}

const SOCIAL_LOGOS: SocialLogoItem[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'in/zeeshan-creative',
    category: 'Professional Network',
    actionText: 'Connect & Network',
    url: 'https://linkedin.com',
    color: 'text-[#0A66C2]',
    badgeBg: 'from-[#0A66C2]/20 to-blue-500/10',
    icon: BRAND_ICONS.LinkedIn
  },
  {
    id: 'fiverr',
    name: 'Fiverr Pro',
    handle: '@z_score_design',
    category: 'Verified Top Rated',
    actionText: 'Order Direct Service',
    url: 'https://fiverr.com',
    color: 'text-[#1DBF73]',
    badgeBg: 'from-[#1DBF73]/20 to-emerald-500/10',
    icon: BRAND_ICONS.Fiverr
  },
  {
    id: 'payoneer',
    name: 'Payoneer',
    handle: 'Global Wire Transfer',
    category: 'International Invoicing',
    actionText: 'USD / EUR / GBP Direct',
    url: 'https://payoneer.com',
    color: 'text-[#FF4800]',
    badgeBg: 'from-[#FF4800]/20 to-orange-500/10',
    icon: BRAND_ICONS.Payoneer
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    handle: '+92 303 5408206',
    category: 'Instant Local Settlement',
    actionText: 'Direct Mobile Deposit',
    url: '#contact',
    color: 'text-[#ED1C24]',
    badgeBg: 'from-[#ED1C24]/20 to-amber-500/10',
    icon: BRAND_ICONS.JazzCash
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    handle: '@ZedScoreTeam',
    category: 'Creator Updates & CTR Breakdown',
    actionText: 'Follow on X',
    url: 'https://x.com',
    color: 'text-zinc-900 dark:text-white',
    badgeBg: 'from-zinc-900/20 to-zinc-600/10',
    icon: BRAND_ICONS.X
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@zscore.visuals',
    category: 'Thumbnail Speed-Arts',
    actionText: 'Watch Viral Breakdowns',
    url: 'https://tiktok.com',
    color: 'text-[#FE2C55]',
    badgeBg: 'from-[#FE2C55]/20 to-[#25F4EE]/10',
    icon: BRAND_ICONS.TikTok
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'Z Score Agency',
    category: 'Design Case Studies',
    actionText: 'Subscribe for Tutorials',
    url: 'https://youtube.com',
    color: 'text-[#FF0000]',
    badgeBg: 'from-[#FF0000]/20 to-rose-600/10',
    icon: BRAND_ICONS.YouTube
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@zscore_creative',
    category: 'Portfolio Showcase',
    actionText: 'View Grid & Stories',
    url: 'https://instagram.com',
    color: 'text-[#E1306C]',
    badgeBg: 'from-[#E1306C]/20 to-[#F77737]/10',
    icon: BRAND_ICONS.Instagram
  },
  {
    id: 'mail',
    name: 'Official Email',
    handle: 'zedscoreteam@gmail.com',
    category: 'Direct Priority Booking',
    actionText: 'Send Inquiries',
    url: 'mailto:zedscoreteam@gmail.com',
    color: 'text-blue-500',
    badgeBg: 'from-blue-500/20 to-purple-600/10',
    icon: BRAND_ICONS.Mail
  }
];

export interface IPhoneMockupProfileProps {
  className?: string;
  enableAutoplay?: boolean;
}

export const IPhoneMockupProfile: React.FC<IPhoneMockupProfileProps> = ({
  className = '',
  enableAutoplay = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [progress, setProgress] = useState(0);

  // Live formatted time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 20-second automatic rotation with animated smooth countdown
  useEffect(() => {
    if (!enableAutoplay || isPaused) return;

    const DURATION = 20000; // 20 seconds as specified
    const TICK = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += TICK;
      setProgress((elapsed / DURATION) * 100);

      if (elapsed >= DURATION) {
        elapsed = 0;
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % SOCIAL_LOGOS.length);
      }
    }, TICK);

    return () => clearInterval(timer);
  }, [enableAutoplay, isPaused, currentIndex]);

  const activeItem = SOCIAL_LOGOS[currentIndex];

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % SOCIAL_LOGOS.length);
  };

  const handleSelect = (idx: number) => {
    setProgress(0);
    setCurrentIndex(idx);
  };

  return (
    <div className={`relative mx-auto flex items-center justify-center select-none ${className}`}>
      {/* Dynamic Ambient Spectral Glow Behind the Phone */}
      <div 
        className="absolute -inset-6 bg-gradient-to-tr from-purple-600/25 via-blue-500/20 to-pink-500/25 blur-[60px] rounded-[60px] pointer-events-none opacity-80"
        aria-hidden="true"
      />

      {/* Realistic Titanium / Glass iPhone Frame */}
      <div className="relative w-[310px] sm:w-[340px] md:w-[360px] h-[640px] sm:h-[690px] md:h-[720px] rounded-[52px] p-[10px] bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-black/40">
        
        {/* Antenna bands & buttons */}
        <div className="absolute -left-[13px] top-[115px] w-[3px] h-[26px] bg-zinc-600 rounded-l-sm" /> {/* Action Button */}
        <div className="absolute -left-[13px] top-[155px] w-[3px] h-[50px] bg-zinc-600 rounded-l-sm" /> {/* Volume Up */}
        <div className="absolute -left-[13px] top-[215px] w-[3px] h-[50px] bg-zinc-600 rounded-l-sm" /> {/* Volume Down */}
        <div className="absolute -right-[13px] top-[170px] w-[3px] h-[75px] bg-zinc-600 rounded-r-sm" /> {/* Power Button */}

        {/* OLED Screen Bezel */}
        <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-black ring-1 ring-white/10 flex flex-col justify-between">
          
          {/* Wallpaper Image Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src={zeeshanProfilePic} 
              alt="Zeeshan Profile Wallpaper"
              className="w-full h-full object-cover object-top scale-105"
            />
            {/* iOS Dynamic lockscreen gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
          </div>

          {/* Top iOS Header Area */}
          <div className="relative z-20 pt-3 px-6">
            
            {/* iOS Status Bar */}
            <div className="flex items-center justify-between text-white text-[12px] font-semibold tracking-tight">
              <span className="w-12 pl-1 font-mono tracking-tight">{currentTime}</span>
              
              {/* Dynamic Island Pill */}
              <div className="w-[96px] h-[25px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                </div>
                <div className="flex items-center gap-1">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400" 
                  />
                  <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" />
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center gap-1.5 w-12 justify-end pr-1 text-zinc-200">
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-1 bg-white rounded-xs" />
                  <span className="w-0.5 h-1.5 bg-white rounded-xs" />
                  <span className="w-0.5 h-2 bg-white rounded-xs" />
                  <span className="w-0.5 h-2.5 bg-white rounded-xs" />
                </div>
                <Wifi size={12} className="stroke-[2.5]" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] font-mono leading-none">98</span>
                  <Battery size={13} className="stroke-[2]" />
                </div>
              </div>
            </div>

            {/* Lockscreen Date & Clock typography */}
            <div className="mt-4 text-center space-y-0.5 text-white/90">
              <div className="text-[11px] font-medium tracking-wide uppercase text-white/70">
                Friday, October 11
              </div>
              <div className="text-5xl font-display font-bold tracking-tight text-white drop-shadow-md">
                {currentTime}
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white/80 border border-white/10 mt-1">
                <Sparkles size={10} className="text-yellow-400" />
                <span>Z-SCORE STUDIO</span>
              </div>
            </div>
          </div>

          {/* Bottom Floating Glass Badge (Rotating Social / Payment Logos) */}
          <div 
            className="relative z-30 px-3.5 pb-5 space-y-3"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* The Floating Glass Badge */}
            <div className="relative rounded-[26px] p-3 backdrop-blur-2xl bg-black/45 border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.3)] overflow-hidden">
              
              {/* Subtle Ambient Radial Highlight from the active brand */}
              <div 
                className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${activeItem.badgeBg} blur-2xl pointer-events-none transition-all duration-700`} 
              />

              {/* Countdown Progress Bar (20 Seconds Loop) */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2.5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Smooth Morph & Fade Transition Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.95 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 20, 
                    mass: 0.6 
                  }}
                  className="flex items-center justify-between gap-3"
                >
                  {/* Left: Brand Icon & Identity */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner ${activeItem.color}`}>
                      <activeItem.icon />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white tracking-tight truncate">
                          {activeItem.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/15 text-white/80 font-mono">
                          {currentIndex + 1}/9
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-white/80 truncate font-mono">
                        {activeItem.handle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Quick Action Button */}
                  <a
                    href={activeItem.url}
                    target={activeItem.url.startsWith('http') ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                  >
                    <span>Open</span>
                    <ExternalLink size={10} />
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Quick Switcher Dots */}
              <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/10 text-[9px] text-white/60 font-medium">
                <div className="flex items-center gap-1">
                  {SOCIAL_LOGOS.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(idx)}
                      title={item.name}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex 
                          ? 'w-4 bg-white' 
                          : 'w-1.5 bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="flex items-center gap-0.5 hover:text-white transition-colors"
                >
                  <span>Next (20s)</span>
                  <ChevronRight size={10} />
                </button>
              </div>
            </div>

            {/* Lockscreen Bottom Buttons (Flashlight & Camera) */}
            <div className="flex items-center justify-between px-3 pt-1 text-white/90">
              <button 
                type="button"
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all shadow-md active:scale-95"
              >
                <Flashlight size={16} />
              </button>

              {/* Home indicator bar */}
              <div className="w-32 h-1 bg-white/70 rounded-full shadow-sm" />

              <button 
                type="button"
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all shadow-md active:scale-95"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IPhoneMockupProfile;
