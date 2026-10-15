import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Clock, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { PRICING_TIERS, PricingTierData } from '../data/pricingTiers';

type BillingMode = 'perProject' | 'monthly';
type Currency = 'usd' | 'pkr';

interface ApplePricingCardProps {
  tier: PricingTierData;
  billingMode: BillingMode;
  currency: Currency;
}

const ApplePricingCard: React.FC<ApplePricingCardProps> = ({ tier, billingMode, currency }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coords for 3D tilt (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Percentage coords for radial shimmer glare (0% to 100%)
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  // High-performance spring physics for tilt (stiffness: 120, damping: 25)
  const springConfig = { stiffness: 120, damping: 25, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  const smoothGlareX = useSpring(glareX, { stiffness: 220, damping: 24 });
  const smoothGlareY = useSpring(glareY, { stiffness: 220, damping: 24 });

  // 3D tilt transform
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);

  // Dynamic specular white shimmer radial reflection
  const glareBackground = useTransform(
    [smoothGlareX, smoothGlareY],
    ([x, y]) =>
      `radial-gradient(circle 340px at ${x}% ${y}%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.2) 30%, rgba(255, 255, 255, 0) 70%)`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
  }, [mouseX, mouseY, glareX, glareY]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    glareX.set(50);
    glareY.set(50);
  };

  // Pricing configuration calculation
  const tierPricing = tier.pricing[currency][billingMode];
  const currencySymbol = currency === 'usd' ? '$' : 'Rs ';
  const isRecommended = tier.recommended;

  // Format numbers nicely
  const formattedPrice = tierPricing.price.toLocaleString();
  const formattedOriginalPrice = tierPricing.originalPrice ? tierPricing.originalPrice.toLocaleString() : null;

  const whatsappMessage = encodeURIComponent(
    `${tier.whatsappPreset} (${currencySymbol}${formattedPrice} ${tierPricing.unit})`
  );
  const whatsappUrl = `https://wa.me/923035408206?text=${whatsappMessage}`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1100,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: isHovered ? 1.025 : 1,
        y: isHovered ? -8 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 25,
      }}
      className={`relative rounded-[32px] overflow-hidden flex flex-col justify-between transform-gpu will-change-[transform,opacity] transition-all duration-300 ${
        isRecommended
          ? 'backdrop-blur-none bg-white/95 dark:bg-black/95 md:backdrop-blur-xl md:bg-white/60 dark:md:bg-black/40 border-2 border-[#0055ff]/40 shadow-[0_20px_50px_-12px_rgba(0,85,255,0.18),0_1px_2px_rgba(0,0,0,0.05),inset_0_1.5px_1px_rgba(255,255,255,0.9)]'
          : 'backdrop-blur-none bg-white/95 dark:bg-black/95 md:backdrop-blur-xl md:bg-white/40 dark:md:bg-black/20 border border-white/60 dark:border-white/10 shadow-[0_12px_36px_-8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.85)]'
      }`}
    >
      {/* 3D Inner White Radial-Glare Shimmer Reflection */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
        style={{
          background: glareBackground,
          opacity: isHovered ? 1 : 0,
          mixBlendMode: 'overlay',
        }}
        aria-hidden="true"
      />

      {/* Apple-grade Razor Beveled Rim Highlight */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ${
          isRecommended ? 'ring-blue-500/25' : 'ring-white/60 dark:ring-white/15'
        } z-20`}
        aria-hidden="true"
      />

      {/* Main Content Area */}
      <div className="relative z-10 p-7 sm:p-9 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Category tag & Badge */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-zinc-600 dark:text-zinc-400">
              {tier.name} Tier
            </span>

            {tier.badge && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isRecommended
                    ? 'bg-[#0055ff] text-white shadow-sm shadow-blue-500/25 ring-1 ring-blue-400/40'
                    : 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                }`}
              >
                <Sparkles size={11} className="shrink-0" />
                {tier.badge}
              </span>
            )}
          </div>

          {/* Tier Title & Tagline */}
          <h3 className="text-2xl sm:text-3xl font-display font-black text-[#1d1d1f] dark:text-white tracking-tight">
            {tier.name}
          </h3>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-2 font-normal leading-relaxed min-h-[36px]">
            {tier.tagline}
          </p>

          {/* Pricing Value Container with Apple Spring Transitions */}
          <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-baseline gap-2 flex-wrap">
              {/* Optional Strikethrough Discount */}
              {formattedOriginalPrice && (
                <span className="text-base sm:text-lg text-zinc-600 line-through font-semibold tracking-tight">
                  {currencySymbol}{formattedOriginalPrice}
                </span>
              )}

              {/* Dynamic Price Display */}
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                  {currencySymbol}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${currency}-${billingMode}-${tierPricing.price}`}
                    initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                    className="text-4xl sm:text-5xl font-display font-black tracking-tight text-[#1d1d1f] dark:text-white"
                  >
                    {formattedPrice}
                  </motion.span>
                </AnimatePresence>
                <span className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-semibold tracking-tight ml-1">
                  {tierPricing.unit}
                </span>
              </div>
            </div>

            {/* Delivery turnaround & Savings badges */}
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200/80 dark:bg-white/10 dark:text-zinc-300 dark:border-white/10">
                <Clock size={10} />
                {tierPricing.deliveryTime}
              </span>

              {tierPricing.savingsNote && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  <TrendingUp size={10} />
                  {tierPricing.savingsNote}
                </span>
              )}
            </div>
          </div>

          {/* Quick Specifications Matrix */}
          <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                <Clock size={13} className="text-zinc-400" /> SLA Turnaround:
              </span>
              <span className="font-bold text-[#1d1d1f] dark:text-white text-right">
                {tier.features.turnaround}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                <RefreshCw size={13} className="text-zinc-400" /> Revisions:
              </span>
              <span className="font-bold text-[#1d1d1f] dark:text-white text-right">
                {tier.features.revisions}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
                <Layers size={13} className="text-zinc-400" /> Deliverables:
              </span>
              <span className="font-bold text-[#1d1d1f] dark:text-white text-right truncate max-w-[170px]" title={tier.features.deliverables}>
                {tier.features.deliverables}
              </span>
            </div>
          </div>

          {/* Included Features Bullet Points */}
          <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400 mb-3.5">
              Included Engineering:
            </p>
            <ul className="space-y-3">
              {tier.features.included.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isRecommended
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-zinc-200/80 text-zinc-700 dark:bg-white/15 dark:text-zinc-300'
                    }`}
                  >
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="pt-8 mt-6 border-t border-black/[0.06] dark:border-white/[0.08]">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mb-3 text-center italic">
            Ideal for: {tier.idealFor}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="interactive"
            className={`w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all duration-300 text-center shadow-sm ${
              isRecommended
                ? 'bg-[#1d1d1f] text-white hover:bg-black hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-black/15'
                : 'bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-[#1d1d1f] dark:text-white border border-black/10 dark:border-white/15 hover:shadow-md'
            }`}
          >
            <span>{tier.ctaText || `Configure ${tier.name}`}</span>
            <ArrowRight size={13} className="shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export const ApplePricingSection: React.FC = () => {
  const [billingMode, setBillingMode] = useState<BillingMode>('perProject');
  const [currency, setCurrency] = useState<Currency>('usd');

  return (
    <section id="pricing" className="section-padding bg-[#f5f5f7] dark:bg-zinc-950 relative overflow-hidden py-32 border-y border-black/5 dark:border-white/5 transition-colors duration-500">
      {/* Dynamic Ambient Background Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-blue-400/10 via-purple-400/10 to-transparent blur-[160px] pointer-events-none rounded-full" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-blue-500/5 blur-[140px] pointer-events-none rounded-full" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Apple-grade Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0055ff] animate-pulse" />
            <span className="text-[#0055ff] font-mono font-bold uppercase tracking-[0.25em] text-[10px]">
              TRANSPARENT VALUE ARCHITECTURE
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black tracking-tight text-[#1d1d1f] dark:text-white leading-[1.08]">
            Configure Your <span className="text-blue-600 dark:text-blue-400">CTR Investment.</span>
          </h2>

          <p className="text-zinc-700 dark:text-zinc-300 max-w-xl mx-auto text-sm sm:text-base font-normal leading-relaxed">
            Multi-budget pricing architecture crafted for ambitious creators. Transparent packages, razor-sharp SLAs, and zero hidden fees.
          </p>

          {/* Interactive Control Center: Pill Switches for Category & Currency */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Sliding Capsule 1: Per Project vs Monthly Package */}
            <div 
              data-cursor="interactive"
              className="inline-flex p-1.5 rounded-full backdrop-blur-none bg-white/95 dark:bg-black/80 md:backdrop-blur-xl md:bg-white/70 dark:md:bg-white/10 border border-black/5 dark:border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.06)] relative"
            >
              <button
                onClick={() => setBillingMode('perProject')}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 z-10 ${
                  billingMode === 'perProject' ? 'text-[#1d1d1f] dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {billingMode === 'perProject' && (
                  <motion.div
                    layoutId="pricing-billing-capsule"
                    transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] rounded-full -z-10"
                  />
                )}
                Single / Pack Rates
              </button>

              <button
                onClick={() => setBillingMode('monthly')}
                className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 z-10 flex items-center gap-2 ${
                  billingMode === 'monthly' ? 'text-[#1d1d1f] dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {billingMode === 'monthly' && (
                  <motion.div
                    layoutId="pricing-billing-capsule"
                    transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] rounded-full -z-10"
                  />
                )}
                <span>Monthly Retainer</span>
                <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SAVE UP TO 25%
                </span>
              </button>
            </div>

            {/* Sliding Capsule 2: Currency Selector (USD / PKR) */}
            <div 
              data-cursor="interactive"
              className="inline-flex p-1.5 rounded-full backdrop-blur-none bg-white/95 dark:bg-black/80 md:backdrop-blur-xl md:bg-white/70 dark:md:bg-white/10 border border-black/5 dark:border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.06)] relative"
            >
              <button
                onClick={() => setCurrency('usd')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 z-10 flex items-center gap-1.5 ${
                  currency === 'usd' ? 'text-[#1d1d1f] dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {currency === 'usd' && (
                  <motion.div
                    layoutId="pricing-currency-capsule"
                    transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] rounded-full -z-10"
                  />
                )}
                <span>USD ($)</span>
              </button>

              <button
                onClick={() => setCurrency('pkr')}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-300 z-10 flex items-center gap-1.5 ${
                  currency === 'pkr' ? 'text-[#1d1d1f] dark:text-white' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                {currency === 'pkr' && (
                  <motion.div
                    layoutId="pricing-currency-capsule"
                    transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                    className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] rounded-full -z-10"
                  />
                )}
                <span>PKR (₨)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Minimalist Layout Matrix Categorized by Budget Scales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-stretch">
          {PRICING_TIERS.map((tier) => (
            <ApplePricingCard
              key={tier.id}
              tier={tier}
              billingMode={billingMode}
              currency={currency}
            />
          ))}
        </div>

        {/* Apple-grade Guarantee / Assurance Footnote */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 px-6 py-4 rounded-2xl backdrop-blur-none bg-white/90 dark:bg-black/60 md:backdrop-blur-md md:bg-white/40 border border-black/5 dark:border-white/10 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <ShieldCheck size={14} className="text-emerald-500" /> 100% Satisfaction Guarantee
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <Clock size={14} className="text-blue-500" /> Strict On-Time SLA Delivery
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <Zap size={14} className="text-amber-500" /> Layered PSD Master Files Included
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplePricingSection;
