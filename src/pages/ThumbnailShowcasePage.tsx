import React from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  Eye, 
  TrendingUp, 
  Layers, 
  Flame, 
  MessageSquare,
  Phone
} from 'lucide-react';
import { ThumbnailGallery } from '../components/ThumbnailGallery';
import { AppleGlassCard } from '../components/AppleGlassCard';

export const ThumbnailShowcasePage: React.FC = () => {
  const handleOpenInNewWindow = () => {
    window.open('/thumbnails', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Helmet>
        <title>Thumbnail Showcase | Z Score - High-CTR YouTube Visuals</title>
        <meta 
          name="description" 
          content="Explore the complete collection of high-performance YouTube thumbnails engineered by Z Score. Psychological visual hooks designed for viral CTR." 
        />
        <meta property="og:title" content="Thumbnail Showcase | Z Score" />
        <meta property="og:description" content="Explore high-converting YouTube thumbnails engineered for viral CTR." />
      </Helmet>

      {/* Background Ambience */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Navigation & Header Section */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white border border-black/5 text-xs font-bold text-zinc-600 hover:text-black transition-all shadow-sm group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to About & Profile
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenInNewWindow}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white border border-black/5 text-xs font-bold text-zinc-600 hover:text-blue-600 transition-all shadow-sm"
                title="Open this showcase in a clean new browser window/tab"
              >
                <ExternalLink size={13} />
                Open in New Window
              </button>
            </div>
          </div>

          {/* Apple-style Glassmorphism Showcase Hero Banner */}
          <AppleGlassCard 
            className="p-8 sm:p-12 relative overflow-hidden" 
            variant="light"
            scaleOnHover={1.01}
            liftOnHover={-4}
            tiltIntensity={3}
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-600 text-[11px] font-bold tracking-wide uppercase">
                  <Sparkles size={13} className="text-blue-500 animate-spin-slow" />
                  Visual Hook Architecture
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-zinc-900 leading-[1.05]">
                  THUMBNAIL <span className="text-blue-600">SHOWCASE.</span>
                </h1>
                <p className="text-zinc-600 text-sm sm:text-base font-medium leading-relaxed">
                  Every thumbnail here is an engineered psychological click-magnet. Tested across 500M+ views 
                  with top creators like Azul Welz, Hustle Ninjas, and Rob Lipsett. Click any card to inspect full details, 
                  CTR hooks, and AI concept breakdowns.
                </p>
              </div>

              {/* Glass Performance Metrics Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
                <div className="p-3 sm:p-4 rounded-2xl backdrop-blur-xl bg-white/85 dark:bg-black/20 border border-white/80 dark:border-white/10 shadow-sm flex flex-col min-w-[100px] sm:min-w-[120px] overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">Total Views</span>
                  <span className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5 whitespace-nowrap tabular-nums tracking-tight">3.3M+</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5 truncate">
                    <TrendingUp size={11} className="shrink-0" /> Viral Reach
                  </span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl backdrop-blur-xl bg-white/85 dark:bg-black/20 border border-white/80 dark:border-white/10 shadow-sm flex flex-col min-w-[100px] sm:min-w-[120px] overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">Avg. CTR</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5 whitespace-nowrap tabular-nums tracking-tight">10%</span>
                  <span className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-0.5 truncate">
                    <Zap size={11} className="shrink-0" /> Optimized
                  </span>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl backdrop-blur-xl bg-white/85 dark:bg-black/20 border border-white/80 dark:border-white/10 shadow-sm flex flex-col min-w-[100px] sm:min-w-[120px] overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 truncate">Quality</span>
                  <span className="text-xl sm:text-2xl font-black text-zinc-900 mt-0.5 whitespace-nowrap tabular-nums tracking-tight">98.98%</span>
                  <span className="text-[10px] text-purple-600 font-semibold mt-1 flex items-center gap-0.5 truncate">
                    <Eye size={11} className="shrink-0" /> Fidelity
                  </span>
                </div>
              </div>
            </div>
          </AppleGlassCard>
        </div>

        {/* The Complete Interactive Thumbnail Gallery with Glassmorphism */}
        <div>
          <ThumbnailGallery />
        </div>

        {/* Bottom CTA Card */}
        <AppleGlassCard className="p-8 sm:p-10 text-center space-y-6" variant="light" scaleOnHover={1.01}>
          <div className="max-w-xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
              Need Viral Thumbnails for Your Channel?
            </h3>
            <p className="text-zinc-600 text-sm font-medium">
              Let's engineer click-worthy visual hooks that 10x your click-through rate. Fast turnaround, unlimited revisions, and proven psychology.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/923035408206"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25"
            >
              <Phone size={14} />
              Book on WhatsApp
            </a>
            <Link
              to="/#pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-50 text-zinc-800 border border-black/10 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
            >
              View Pricing Plans
            </Link>
          </div>
        </AppleGlassCard>
      </div>
    </div>
  );
};

export default ThumbnailShowcasePage;
