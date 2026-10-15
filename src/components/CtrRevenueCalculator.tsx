import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DollarSign, TrendingUp, Sparkles, ArrowRight, Zap, Calculator, Check, Flame } from 'lucide-react';

export interface CtrRevenueCalculatorProps {
  className?: string;
  onCtaClick?: (details: { views: number; rpm: number; projectedGain: number }) => void;
}

// Preset Quick Chips
const VIEW_PRESETS = [
  { label: '50K', value: 50000 },
  { label: '250K', value: 250000 },
  { label: '1M', value: 1000000 },
  { label: '3M', value: 3000000 },
  { label: '5M', value: 5000000 },
];

const RPM_PRESETS = [
  { label: '$2.50 (Gaming)', value: 2.5 },
  { label: '$5.00 (Tech/Vlog)', value: 5.0 },
  { label: '$9.00 (Finance)', value: 9.0 },
  { label: '$14.00 (SaaS/Biz)', value: 14.0 },
];

export const CtrRevenueCalculator: React.FC<CtrRevenueCalculatorProps> = ({
  className = '',
  onCtaClick,
}) => {
  // Input 1: Average Monthly Views (Scale: 10,000 to 5,000,000)
  const [monthlyViews, setMonthlyViews] = useState<number>(350000);

  // Input 2: Current RPM / Earnings per 1k views (Scale: $1 to $15)
  const [rpm, setRpm] = useState<number>(6.5);

  // CTR Multiplier: 2.5x to 3.0x (Default: 3.0x as per spec)
  const [multiplier, setMultiplier] = useState<number>(3.0);

  // Real-time calculations
  const { baseMonthlyRevenue, engineeredMonthlyRevenue, monthlyGain, annualGain } = useMemo(() => {
    // Base Case (Current): (Views * RPM) / 1000
    const base = (monthlyViews * rpm) / 1000;
    // Engineered Case (Assuming 2.5x to 3x CTR lift): Multiplies dynamically
    const engineered = base * multiplier;
    const gain = engineered - base;
    const annual = gain * 12;

    return {
      baseMonthlyRevenue: Math.round(base),
      engineeredMonthlyRevenue: Math.round(engineered),
      monthlyGain: Math.round(gain),
      annualGain: Math.round(annual),
    };
  }, [monthlyViews, rpm, multiplier]);

  // Formatter for Currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Formatter for Views
  const formatViews = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M`;
    }
    return `${Math.round(val / 1000)}K`;
  };

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick({ views: monthlyViews, rpm, projectedGain: monthlyGain });
      return;
    }
    // Default: Open WhatsApp or scroll to contact
    const message = `Hello Zeeshan! I calculated my YouTube channel potential on your CTR Revenue Calculator: %0A%0A- Monthly Views: ${formatViews(monthlyViews)}%0A- Channel RPM: $${rpm.toFixed(2)}%0A- Current Revenue: ${formatCurrency(baseMonthlyRevenue)}/mo%0A- Projected Engineered Revenue: ${formatCurrency(engineeredMonthlyRevenue)}/mo%0A- Potential Upside: +${formatCurrency(monthlyGain)}/mo%0A%0AI want to engineer higher CTR thumbnails for my channel. Let's talk!`;
    const whatsappUrl = `https://wa.me/923035408206?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-none bg-white/95 dark:bg-black/95 md:backdrop-blur-xl md:bg-white/40 transform-gpu will-change-transform ${className}`}
    >
      {/* Specular Glare Inner Top Highlight (Apple Aesthetic) */}
      <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-black/5 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0055ff]/10 text-[#0055ff] border border-[#0055ff]/20 text-xs font-bold tracking-wide uppercase font-mono mb-2">
            <Zap size={12} className="fill-[#0055ff]" />
            Live Mathematical Engine
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#1d1d1f] dark:text-white tracking-tight">
            Realtime CTR & Revenue Multiplier
          </h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-xl">
            See the exact monetary return generated when your click-through rate jumps from an amateur baseline (3–4%) to an engineered hook (11–14%+).
          </p>
        </div>

        {/* Multiplier Segmented Toggle */}
        <div className="flex flex-col items-start md:items-end gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Engineered CTR Lift Model
          </span>
          <div className="inline-flex p-1 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 backdrop-blur-md border border-black/5 dark:border-white/10">
            {[
              { val: 2.5, label: '2.5x (Conservative)' },
              { val: 2.8, label: '2.8x (Standard)' },
              { val: 3.0, label: '3.0x (Peak Hook)' },
            ].map(tier => {
              const active = multiplier === tier.val;
              return (
                <button
                  key={tier.val}
                  onClick={() => setMultiplier(tier.val)}
                  data-cursor="interactive"
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="multiplierPill"
                      className="absolute inset-0 bg-[#0055ff] rounded-xl shadow-[0_2px_10px_rgba(0,85,255,0.4)]"
                      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                    />
                  )}
                  <span className="relative z-10">{tier.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Input Sliders (Left) & Glowing Output Block (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mt-8">
        {/* Controls Column (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
          {/* SLIDER 1: Average Monthly Views */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-display flex items-center gap-1.5">
                <span>1. Average Monthly Views</span>
              </label>
              <div className="flex items-baseline gap-1 bg-white/80 dark:bg-black/60 px-3.5 py-1.5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                <span className="text-lg font-black text-[#1d1d1f] dark:text-white font-mono">
                  {formatViews(monthlyViews)}
                </span>
                <span className="text-xs font-medium text-zinc-400">views / mo</span>
              </div>
            </div>

            {/* Custom Apple-Grade Range Track */}
            <div className="relative py-2" data-cursor="drag" data-cursor-badge="VIEWS">
              <input
                type="range"
                min={10000}
                max={5000000}
                step={10000}
                value={monthlyViews}
                onChange={e => setMonthlyViews(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#0055ff] focus:outline-none focus:ring-2 focus:ring-[#0055ff]/40"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                <span>10K</span>
                <span>1M</span>
                <span>2.5M</span>
                <span>5M</span>
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Presets:</span>
              {VIEW_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setMonthlyViews(preset.value)}
                  data-cursor="interactive"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-200 border ${
                    monthlyViews === preset.value
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-sm'
                      : 'bg-white/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 border-black/5 dark:border-white/5 hover:bg-black/5'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* SLIDER 2: Current RPM / Earnings per 1k views */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-display flex items-center gap-1.5">
                <span>2. Channel RPM (Earnings / 1K Views)</span>
              </label>
              <div className="flex items-baseline gap-1 bg-white/80 dark:bg-black/60 px-3.5 py-1.5 rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                <span className="text-lg font-black text-[#1d1d1f] dark:text-white font-mono">
                  ${rpm.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-zinc-400">/ 1k views</span>
              </div>
            </div>

            {/* Custom Apple-Grade Range Track */}
            <div className="relative py-2" data-cursor="drag" data-cursor-badge="RPM">
              <input
                type="range"
                min={1.0}
                max={15.0}
                step={0.5}
                value={rpm}
                onChange={e => setRpm(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#0055ff] focus:outline-none focus:ring-2 focus:ring-[#0055ff]/40"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                <span>$1.00</span>
                <span>$5.00</span>
                <span>$10.00</span>
                <span>$15.00</span>
              </div>
            </div>

            {/* Quick RPM Preset Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1">Niches:</span>
              {RPM_PRESETS.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setRpm(preset.value)}
                  data-cursor="interactive"
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    rpm === preset.value
                      ? 'bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-sm'
                      : 'bg-white/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 border-black/5 dark:border-white/5 hover:bg-black/5'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Proof Footnote */}
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 text-[11px] text-zinc-500 leading-relaxed">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Live Mathematical Proof:</span>{' '}
            Baseline Revenue = ({formatViews(monthlyViews)} × ${rpm.toFixed(2)}) / 1000 ={' '}
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
              {formatCurrency(baseMonthlyRevenue)}/mo
            </span>
            . Optimized CTR scales YouTube impression recommendations by {multiplier}x.
          </div>
        </div>

        {/* Display Layout Output Column (5 Cols on desktop): Massive Glowing Electric Blue (#0055ff) Output Block */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0055ff] via-[#0047d4] to-[#003bb3] text-white shadow-[0_20px_50px_rgba(0,85,255,0.35)] overflow-hidden border border-white/20 transform-gpu will-change-transform">
            {/* Specular Radial Glare Reflection */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-white/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-300/10 rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Top Status */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                  <Sparkles size={11} className="text-white" />
                  Engineered Revenue Boost
                </span>
                <span className="text-xs font-mono font-semibold bg-white/20 px-2 py-0.5 rounded-md text-white">
                  +{multiplier}x CTR Lift
                </span>
              </div>

              {/* Massive Output Value */}
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-100 font-medium">
                  Projected Monthly Revenue
                </div>
                <motion.div
                  key={engineeredMonthlyRevenue}
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-4xl sm:text-5xl font-display font-black tracking-tight text-white mt-1 drop-shadow-sm"
                >
                  {formatCurrency(engineeredMonthlyRevenue)}
                  <span className="text-lg font-light text-blue-200 ml-1">/mo</span>
                </motion.div>

                {/* Net Additional Gain Pill */}
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-emerald-300 font-mono text-xs font-bold">
                  <TrendingUp size={14} className="stroke-[2.5]" />
                  <span>+{formatCurrency(monthlyGain)} /mo net profit boost</span>
                </div>
              </div>

              {/* Baseline Comparison Card (Vibrancy & Contrast) */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-blue-200">Current Baseline</div>
                  <div className="text-lg font-bold font-mono text-white/90">
                    {formatCurrency(baseMonthlyRevenue)}
                    <span className="text-[10px] font-normal text-blue-200">/mo</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-blue-200">1-Year Scaled Upside</div>
                  <div className="text-lg font-bold font-mono text-white">
                    +{formatCurrency(annualGain)}
                    <span className="text-[10px] font-normal text-blue-200">/yr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCta}
            data-cursor="interactive"
            className="w-full mt-4 py-4 px-6 rounded-2xl bg-[#1d1d1f] hover:bg-black text-white font-display font-bold text-sm tracking-wide shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 group transition-all duration-300"
          >
            <span>Claim Your +{formatCurrency(monthlyGain)}/mo Revenue Hook</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CtrRevenueCalculator;
