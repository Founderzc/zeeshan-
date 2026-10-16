import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Sliders, ArrowRight, Eye, TrendingUp, Cpu, Award } from 'lucide-react';
import { BeforeAfterThumbnailSlider } from './BeforeAfterThumbnailSlider';
import { CtrRevenueCalculator } from './CtrRevenueCalculator';

export const ConversionStudioSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'both' | 'slider' | 'calculator'>('both');

  return (
    <section id="conversion-studio" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#0055ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm">
          <Sparkles size={13} className="text-[#0055ff]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#1d1d1f] dark:text-zinc-300 font-display">
            Visual Hook Architecture & Conversion Lab
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-[#1d1d1f] dark:text-white leading-[1.08]">
          Proof Before Purchase.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0055ff] to-[#38bdf8]">
            Engineered For CTR.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
          Glide the Dynamic Island Lens portal or trigger the 3D card flip to inspect real psychological visual engineering, then simulate your channel's direct revenue upside with our live mathematical model.
        </p>

        {/* Apple Segmented View Toggle */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 backdrop-blur-md border border-black/5 dark:border-white/10">
            {[
              { id: 'both', label: 'Complete Studio' },
              { id: 'slider', label: '1. Dynamic Island Lens' },
              { id: 'calculator', label: '2. Revenue Multiplier' },
            ].map(tab => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  data-cursor="interactive"
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 ${
                    isSelected
                      ? 'text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="conversionTabPill"
                      className="absolute inset-0 bg-[#1d1d1f] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
                      transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Content Views */}
      <div className="space-y-16">
        {/* View 1: Before/After Slider */}
        <AnimatePresence mode="wait">
          {(activeTab === 'both' || activeTab === 'slider') && (
            <motion.div
              key="slider-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#0055ff] rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-display">
                    Futuristic Dynamic Island Lens & 3D Card Flip Portal
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                  Move cursor to inspect with magnetic circular lens or tap 3D Flip
                </span>
              </div>

              <BeforeAfterThumbnailSlider />
            </motion.div>
          )}
        </AnimatePresence>

        {/* View 2: Realtime CTR Revenue Calculator */}
        <AnimatePresence mode="wait">
          {(activeTab === 'both' || activeTab === 'calculator') && (
            <motion.div
              key="calculator-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#0055ff] rounded-full" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 font-display">
                    Realtime Mathematical CTR & Revenue Multiplier
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                  Based on 2.5x–3.0x algorithmic impression acceleration
                </span>
              </div>

              <CtrRevenueCalculator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ConversionStudioSection;
