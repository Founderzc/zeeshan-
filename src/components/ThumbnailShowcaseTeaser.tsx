import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Eye, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Play,
  Zap
} from 'lucide-react';
import { AppleGlassCard } from './AppleGlassCard';

const FEATURED_TEASERS = [
  {
    title: "100 DAYS SURVIVING HARDEST HARDCORE",
    category: "Gaming",
    stats: "2.4M views",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    hook: "Extreme contrast + high emotional stake trigger"
  },
  {
    title: "HOW I SCALED TO $100K/MO WITHOUT ADS",
    category: "Finance",
    stats: "890K views",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    hook: "Curiosity gap & believable wealth psychology"
  },
  {
    title: "WE TESTED THE $50,000 CYBERTRUCK SETUP",
    category: "Tech",
    stats: "1.1M views",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    hook: "Apple-grade lighting & spatial depth framing"
  }
];

export const ThumbnailShowcaseTeaser: React.FC = () => {
  const handleOpenNewWindow = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('/thumbnails', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="thumbnails" className="section-padding px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-600 text-xs font-bold uppercase tracking-widest">
              <Sparkles size={13} className="text-blue-500" />
              Dedicated Showcase
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-zinc-900 tracking-tight">
              THUMBNAIL <span className="text-blue-600">SHOWCASE.</span>
            </h2>
            <p className="text-zinc-500 text-base max-w-xl font-medium leading-relaxed">
              Explore 200+ high-CTR thumbnail projects in our dedicated showcase window. 
              Equipped with uncropped full views, interactive AI breakdowns, category filters, and batch uploads.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/thumbnails"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 group"
            >
              Enter Showcase Page
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={handleOpenNewWindow}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/80 hover:bg-white text-zinc-700 hover:text-black border border-black/10 rounded-full text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-md shadow-sm"
              title="Open showcase in a separate browser window/tab"
            >
              <ExternalLink size={14} />
              Open in New Window
            </button>
          </div>
        </div>

        {/* Featured Apple Glassmorphic Showcase Card */}
        <AppleGlassCard
          className="p-6 sm:p-10 relative overflow-hidden"
          variant="light"
          scaleOnHover={1.01}
          liftOnHover={-6}
          tiltIntensity={3}
          glareIntensity={0.5}
        >
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-zinc-900">
                    Curated High-Performance Gallery
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    100% full uncropped views · Physics-based Apple glass hover · AI-written hooks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-bold text-zinc-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>200+ Projects Live</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-600">
                  <TrendingUp size={14} />
                  <span>Avg +15.4% CTR</span>
                </div>
              </div>
            </div>

            {/* 3 Interactive Apple Glass Cards Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_TEASERS.map((item, idx) => (
                <Link key={idx} to="/thumbnails" className="block group">
                  <AppleGlassCard
                    scaleOnHover={1.03}
                    liftOnHover={-8}
                    tiltIntensity={7}
                    glareIntensity={0.6}
                    variant="subtle"
                    className="p-3 space-y-3 cursor-pointer"
                  >
                    <div className="aspect-video relative rounded-2xl overflow-hidden bg-zinc-950 flex items-center justify-center border border-white/30">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-bold text-white uppercase tracking-wider">
                        {item.category}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-blue-600 text-[9px] font-bold text-white">
                        {item.stats}
                      </div>
                    </div>

                    <div className="px-1 space-y-1">
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        {item.hook}
                      </p>
                    </div>
                  </AppleGlassCard>
                </Link>
              ))}
            </div>

            {/* Action Banner inside Glass Card */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-50/70 to-purple-50/70 border border-blue-100/80 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white text-blue-600 shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">
                    Want to view the full gallery with all categories & interactive AI features?
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Gaming, Tech, Finance, Vlog, Lifestyle, and more. Lightbox view included.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  to="/thumbnails"
                  className="w-full sm:w-auto text-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  Browse Full Showcase
                </Link>
                <button
                  onClick={handleOpenNewWindow}
                  className="p-2.5 bg-white hover:bg-zinc-100 text-zinc-700 rounded-xl border border-black/10 transition-colors"
                  title="Open in separate window"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </AppleGlassCard>
      </div>
    </section>
  );
};

export default ThumbnailShowcaseTeaser;
