import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Eye, 
  Quote, 
  LayoutGrid, 
  Repeat, 
  Flame, 
  ArrowUpRight,
  X
} from 'lucide-react';
import { AppleGlassCard } from './AppleGlassCard';
import { PushPin } from './PushPin';
import enablersAvatar from '../assets/images/regenerated_image_1791817292482.png';
import russianRockAvatar from '../assets/images/regenerated_image_1791817294093.png';
import rowRhythmAvatar from '../assets/images/regenerated_image_1791817303664.png';

export interface ClientReview {
  id: string | number;
  name: string;
  handle: string;
  avatar: string;
  thumbnailUrl: string;
  thumbnailTitle: string;
  category: 'Gaming' | 'Finance' | 'Fitness' | 'Tech' | 'Travel' | 'Entertainment' | 'Business';
  text: string;
  result: string;
  views: string;
  ctr: string;
  rating: number;
  pinColor: string;
  color: string;
  featured?: boolean;
}

export const REVIEWS_DATA: ClientReview[] = [
  {
    id: 1,
    name: "Azul Welz",
    handle: "357K subscribers",
    avatar: "https://i.ibb.co/ddJ5FDm/image.png",
    thumbnailUrl: "https://i.ibb.co/ddJ5FDm/image.png",
    thumbnailTitle: "How Azul Welz Broke The YouTube Algorithm",
    category: "Entertainment",
    result: "+18.4% CTR",
    views: "2.4M Views",
    ctr: "+18.4% CTR",
    rating: 5,
    pinColor: "#FF6321",
    color: "text-blue-600",
    text: "Zeeshan's thumbnails are a complete game changer. My CTR jumped from 4.8% to 18.4% within 48 hours of re-uploading. Absolute masterclass in viewer psychology and focal composition.",
    featured: true
  },
  {
    id: 2,
    name: "Hustle Ninjas",
    handle: "301K subscribers",
    avatar: "https://i.ibb.co/NdXYBpM4/image.png",
    thumbnailUrl: "https://i.ibb.co/NdXYBpM4/image.png",
    thumbnailTitle: "How I Scaled To $100K/Mo Without Paid Ads",
    category: "Finance",
    result: "400K+ Views",
    views: "400K+ Views",
    ctr: "+14.2% CTR",
    rating: 5,
    pinColor: "#3B82F6",
    color: "text-orange-600",
    text: "The attention to detail and psychological triggers Zeeshan builds into every layout are unmatched. Our average view duration and click rate skyrocketed on day one.",
    featured: true
  },
  {
    id: 3,
    name: "Rob Lipsett",
    handle: "491K subscribers",
    avatar: "https://i.ibb.co/6J4CbdQf/image.png",
    thumbnailUrl: "https://i.ibb.co/6J4CbdQf/image.png",
    thumbnailTitle: "Extreme 30-Day Physique Transformation",
    category: "Fitness",
    result: "Viral Hit",
    views: "1.8M Views",
    ctr: "+16.8% CTR",
    rating: 5,
    pinColor: "#8B5CF6",
    color: "text-purple-600",
    text: "Fast, reliable, and deeply understands the high-contrast aesthetic required for fitness. He turned an ordinary workout video into our biggest viral hit of the quarter.",
    featured: true
  },
  {
    id: 4,
    name: "Kristen & Siya",
    handle: "329K subscribers",
    avatar: "https://i.ibb.co/rR6LmpRm/image.png",
    thumbnailUrl: "https://i.ibb.co/rR6LmpRm/image.png",
    thumbnailTitle: "We Spent 24 Hours in a Secret Luxury Island",
    category: "Travel",
    result: "15% Growth",
    views: "890K Views",
    ctr: "+15.0% CTR",
    rating: 5,
    pinColor: "#10B981",
    color: "text-emerald-600",
    text: "Our travel vlogs finally have the cinematic visual hooks they deserve. The storytelling in Zeeshan's thumbnail makes viewers stop scrolling immediately.",
    featured: false
  },
  {
    id: 5,
    name: "Enablers",
    handle: "592K subscribers",
    avatar: enablersAvatar,
    thumbnailUrl: "https://i.ibb.co/V0nZTDcZ/image.png",
    thumbnailTitle: "The Crypto Crash: Why Everything is Falling",
    category: "Finance",
    result: "592K+ Impact",
    views: "1.2M Views",
    ctr: "+12.8% CTR",
    rating: 5,
    pinColor: "#2563EB",
    color: "text-blue-700",
    text: "Zeeshan's ability to simplify complex financial concepts into a single irresistible visual hook is incredible. He is our primary partner for high-stakes uploads.",
    featured: true
  },
  {
    id: 6,
    name: "Russian Rock",
    handle: "690K subscribers",
    avatar: russianRockAvatar,
    thumbnailUrl: "https://i.ibb.co/5Xd8rDDZ/image.png",
    thumbnailTitle: "100 Days Surviving Hardest Hardcore",
    category: "Gaming",
    result: "690K+ Reach",
    views: "690K Views",
    ctr: "+16.5% CTR",
    rating: 5,
    pinColor: "#DC2626",
    color: "text-red-600",
    text: "The raw energy, color grading, and visual storytelling Z Score brings to our rock and gaming content is phenomenal. A true benchmark in graphic design.",
    featured: false
  },
  {
    id: 7,
    name: "Row Rhythm",
    handle: "35K subscribers",
    avatar: rowRhythmAvatar,
    thumbnailUrl: "https://i.ibb.co/rKFrLL2S/image.png",
    thumbnailTitle: "AI is Replacing Designers (The Brutal Truth)",
    category: "Tech",
    result: "35K+ Subs",
    views: "350K Views",
    ctr: "+10.5% CTR",
    rating: 5,
    pinColor: "#F59E0B",
    color: "text-zinc-600",
    text: "Zeeshan's designs perfectly capture the rhythm and modern tech edge of our content. He has redefined our channel's visual identity with clean polish.",
    featured: false
  }
];

const CATEGORIES = ['All Proofs', 'High CTR (+15%+)', '1M+ Views Club', 'Finance & Tech', 'Gaming & Fitness'];

export const GlassmorphicReviewSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeCategory, setActiveCategory] = useState('All Proofs');
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('grid');
  const [selectedProof, setSelectedProof] = useState<ClientReview | null>(null);

  const filteredReviews = useMemo(() => {
    return REVIEWS_DATA.filter(review => {
      if (activeCategory === 'All Proofs') return true;
      if (activeCategory === 'High CTR (+15%+)') {
        return review.ctr.includes('18') || review.ctr.includes('16') || review.ctr.includes('15');
      }
      if (activeCategory === '1M+ Views Club') {
        return review.views.includes('M');
      }
      if (activeCategory === 'Finance & Tech') {
        return review.category === 'Finance' || review.category === 'Tech';
      }
      if (activeCategory === 'Gaming & Fitness') {
        return review.category === 'Gaming' || review.category === 'Fitness' || review.category === 'Entertainment';
      }
      return true;
    });
  }, [activeCategory]);

  return (
    <section 
      id="reviews" 
      className={`py-32 px-4 sm:px-6 relative overflow-hidden bg-[#F5F5F7] dark:bg-black/95 transition-colors ${className}`}
    >
      {/* Background Ambient Radial Glow matching Thumbnail Showcase */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-blue-500/10 blur-[160px] rounded-full pointer-events-none -z-10" 
      />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '36px 36px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header: Styled like the Thumbnail Showcase Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-zinc-900/95 md:bg-white/80 md:dark:bg-white/10 border border-white/80 dark:border-white/15 backdrop-blur-none md:backdrop-blur-xl shadow-sm text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest transform-gpu"
            >
              <Sparkles size={13} className="text-orange-500" />
              <span>Proven Track Record • Client Case Studies</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#1d1d1f] dark:text-white tracking-tight"
            >
              CLIENT REVIEWS & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-pink-600 to-blue-600">
                VERIFIED PRAISE.
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 dark:text-zinc-400 text-base font-medium leading-relaxed"
            >
              Real testimonials from world-class creators and channel founders. Authentic feedback from projects generating millions of views and massive CTR lifts.
            </motion.p>
          </div>

          {/* Quick Metrics & Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* View Switcher: Grid vs Continuous Flow Marquee */}
            <div className="inline-flex p-1 bg-white/70 dark:bg-white/10 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <LayoutGrid size={13} />
                <span>Showcase Grid</span>
              </button>
              <button
                onClick={() => setViewMode('stream')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  viewMode === 'stream'
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                <Repeat size={13} />
                <span>Infinite Stream</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap backdrop-blur-md border ${
                activeCategory === category
                  ? 'bg-white text-zinc-950 border-white shadow-md ring-2 ring-black/5 dark:bg-white dark:text-black'
                  : 'bg-white/60 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 border-white/60 dark:border-white/10 hover:bg-white/90'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Render: Grid vs Stream */}
        {viewMode === 'grid' ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review, index) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  index={index}
                  onPreviewClick={() => setSelectedProof(review)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Infinite Stream Marquee matching Apple smoothness */
          <div className="relative overflow-hidden py-4 -mx-4 sm:-mx-6">
            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F5F5F7] dark:from-black/95 to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F5F5F7] dark:from-black/95 to-transparent z-20 pointer-events-none" />

            <div className="flex gap-6 w-max animate-infinite-scroll hover:[animation-play-state:paused] py-2">
              {[...filteredReviews, ...filteredReviews].map((review, idx) => (
                <div key={`${review.id}-${idx}`} className="w-[360px] sm:w-[400px] flex-shrink-0">
                  <ReviewCard 
                    review={review} 
                    index={idx}
                    onPreviewClick={() => setSelectedProof(review)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Performance Summary Pill Bar */}
        <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-6 text-zinc-500 text-xs font-semibold">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="flex items-center gap-2">
              <TrendingUp size={14} className="text-orange-500" />
              Average CTR Lift: <strong className="text-zinc-900 dark:text-white">+16.2%</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hidden sm:inline" />
            <span className="flex items-center gap-2">
              <Eye size={14} className="text-blue-500" />
              Total Views Influenced: <strong className="text-zinc-900 dark:text-white">250M+ Views</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hidden sm:inline" />
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              Client Satisfaction: <strong className="text-zinc-900 dark:text-white">99.4%</strong>
            </span>
          </div>

          <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Verified YouTube Partner Network
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full Thumbnail Proof */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProof(null)}
              className="absolute inset-0 bg-black/80 md:backdrop-blur-xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-4xl bg-white/95 dark:bg-zinc-900/95 md:bg-white/90 border border-white/80 dark:border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-none md:backdrop-blur-2xl z-10 transform-gpu will-change-[transform,opacity]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProof(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>

              <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-zinc-700 shadow-lg flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                      <img 
                        src={selectedProof.avatar} 
                        alt={selectedProof.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-zinc-900 dark:text-white flex items-center gap-2">
                        {selectedProof.name}
                        <CheckCircle2 size={18} className="text-blue-500 fill-blue-500 text-white" />
                      </h4>
                      <p className="text-sm font-semibold text-zinc-400">{selectedProof.handle}</p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                        {selectedProof.category}
                      </span>
                    </div>
                  </div>

                  {/* Stats pills */}
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center gap-1.5">
                      <Flame size={13} className="fill-orange-500" />
                      {selectedProof.ctr}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5">
                      <TrendingUp size={13} />
                      {selectedProof.views}
                    </span>
                    <div className="ml-auto flex items-center gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                      {[...Array(selectedProof.rating)].map((_, i) => (
                        <Star key={i} size={13} className="fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative pt-2 bg-black/[0.02] dark:bg-white/[0.03] p-6 rounded-2xl border border-black/5 dark:border-white/10">
                    <Quote className="text-zinc-300 dark:text-zinc-700 w-8 h-8 -mb-2 opacity-50" />
                    <p className="text-zinc-800 dark:text-zinc-200 text-base sm:text-lg leading-relaxed font-normal">
                      "{selectedProof.text}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span>Verified Review by <strong>{selectedProof.name}</strong></span>
                  <button 
                    onClick={() => setSelectedProof(null)}
                    className="px-4 py-2 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-bold text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Sub-component: Individual Review Card with clean client avatar/DP focus
interface ReviewCardProps {
  review: ClientReview;
  index: number;
  onPreviewClick: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, index, onPreviewClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col"
    >
      <AppleGlassCard
        className="p-6 sm:p-7 h-full flex flex-col justify-between relative group hover:border-white transition-all overflow-hidden"
        variant="light"
        scaleOnHover={1.025}
        liftOnHover={-8}
        tiltIntensity={4}
        glareIntensity={0.4}
      >
        {/* PushPin Header Accent */}
        <PushPin color={review.pinColor} />

        <div className="space-y-5">
          {/* Client DP & Identity Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Client DP Image */}
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 shadow-md relative group-hover:scale-105 transition-transform flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div>
                <h4 className="font-bold text-base text-[#1d1d1f] dark:text-white flex items-center gap-1.5">
                  {review.name}
                  <CheckCircle2 size={15} className="text-blue-500 fill-blue-500 text-white flex-shrink-0" />
                </h4>
                <p className="text-xs font-semibold text-zinc-400">
                  {review.handle}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                    {review.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
              {[...Array(review.rating)].map((_, sIdx) => (
                <Star key={sIdx} size={11} className="fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="relative pt-1">
            <Quote className="text-zinc-200 dark:text-zinc-800 w-8 h-8 -mb-3 opacity-60 pointer-events-none" />
            <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
              "{review.text}"
            </p>
          </div>
        </div>

        {/* Bottom Card Footer: Result Pill & Details Trigger */}
        <div className="pt-5 mt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <TrendingUp size={12} />
              {review.views}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold text-xs">
              <Flame size={11} className="fill-orange-500" />
              {review.ctr}
            </span>
          </div>

          <button
            onClick={onPreviewClick}
            className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400 group-hover:text-blue-600 transition-colors"
          >
            <span>Review Details</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </AppleGlassCard>
    </motion.div>
  );
};
