import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  MoveHorizontal,
  ArrowRight,
  Eye,
  Zap,
  Flame,
  Award,
  SlidersHorizontal,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  ArrowLeftRight,
  CheckCircle2,
  X,
  FileUp,
  Sliders,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';

export interface BeforeAfterCase {
  id: string;
  creator: string;
  title: string;
  category?: string;
  beforeCpi: string;
  afterCpi: string;
  beforeCtr: string;
  afterCtr: string;
  liftMultiplier: string;
  beforeImage: string;
  afterImage: string;
  psychologyNote: string;
  isCustom?: boolean;
}

export const INITIAL_COMPARISON_CASES: BeforeAfterCase[] = [
  {
    id: 'bunker',
    creator: 'MrBeast Challenge Niche',
    title: 'I Spent 100 Days in a Secret Underground Bunker',
    category: 'Gaming / Viral',
    beforeCpi: 'Generic flat composition with low focal hierarchy',
    afterCpi: 'Deep subterranean lighting, curiosity trap, and hyper-saturated emotion',
    beforeCtr: '4.1%',
    afterCtr: '14.8%',
    liftMultiplier: '+3.6x Lift',
    beforeImage: 'https://i.ibb.co/5Xd8rDDZ/image.png',
    afterImage: 'https://i.ibb.co/5Xd8rDDZ/image.png',
    psychologyNote: 'Replaced flat lighting with high-contrast warm/cool split, isolating facial terror to trigger immediate amygdala response.'
  },
  {
    id: 'azul',
    creator: 'Azul Welz (50M+ Views)',
    title: 'Broke The YouTube Algorithm: Viral Formula',
    category: 'Entertainment',
    beforeCpi: 'Muddled background elements competing with subject',
    afterCpi: '3-second visual isolation with high-contrast electric grading',
    beforeCtr: '3.9%',
    afterCtr: '13.5%',
    liftMultiplier: '+3.4x Lift',
    beforeImage: 'https://i.ibb.co/ddJ5FDm/image.png',
    afterImage: 'https://i.ibb.co/ddJ5FDm/image.png',
    psychologyNote: 'Applied the 3-element focal rule: 1 subject, 1 high-stakes prop, and zero visual clutter.'
  },
  {
    id: 'crypto',
    creator: 'Finance & Wealth Architecture',
    title: 'The Real Reason Markets Are Crashing Now',
    category: 'Finance',
    beforeCpi: 'Stock charts with dense numbers and zero emotional tension',
    afterCpi: 'Dramatized red cliff drop with high-clarity doom hook',
    beforeCtr: '4.4%',
    afterCtr: '12.8%',
    liftMultiplier: '+2.9x Lift',
    beforeImage: 'https://i.ibb.co/V0nZTDcZ/image.png',
    afterImage: 'https://i.ibb.co/V0nZTDcZ/image.png',
    psychologyNote: 'Leveraged loss-aversion psychology to stop aggressive financial feed scrollers within 0.4 seconds.'
  },
  {
    id: 'fitness',
    creator: 'Rob Lipsett Fitness',
    title: 'Viral 30-Day Aesthetic Body Transformation',
    category: 'Fitness',
    beforeCpi: 'Standard gym snapshot with washed out locker room lighting',
    afterCpi: 'Dynamic rim lighting, extreme vascularity hook, and dramatic contrast',
    beforeCtr: '4.0%',
    afterCtr: '15.2%',
    liftMultiplier: '+3.8x Lift',
    beforeImage: 'https://i.ibb.co/6J4CbdQf/image.png',
    afterImage: 'https://i.ibb.co/6J4CbdQf/image.png',
    psychologyNote: 'Engineered extreme silhouette rim-lighting to maximize contrast against YouTube mobile dark mode.'
  }
];

export const BeforeAfterThumbnailSlider: React.FC<{
  className?: string;
  initialCaseId?: string;
}> = ({ className = '', initialCaseId = 'bunker' }) => {
  // Case management state
  const [cases, setCases] = useState<BeforeAfterCase[]>(() => {
    try {
      const saved = localStorage.getItem('z_score_slider_cases');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COMPARISON_CASES;
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(initialCaseId);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverSide, setDragOverSide] = useState<'before' | 'after' | null>(null);

  // View presentation mode: 'slider' (horizontal reveal bar) or 'iphone-card-swap' (3D depth card stack)
  const [viewMode, setViewMode] = useState<'slider' | 'iphone-card-swap'>('slider');
  const [cardSwapped, setCardSwapped] = useState(false); // in card swap mode, which card is in front

  // Minimalist Manual Dashboard Overlay state
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Inline "Add Creator Name" input on overlay
  const [inlineCreatorName, setInlineCreatorName] = useState('');
  const [inlineCategoryTag, setInlineCategoryTag] = useState('');

  // Editing form state for active case
  const [editForm, setEditForm] = useState<{
    creator: string;
    title: string;
    category: string;
    beforeCtr: string;
    afterCtr: string;
    beforeCpi: string;
    afterCpi: string;
    psychologyNote: string;
  }>({
    creator: '',
    title: '',
    category: '',
    beforeCtr: '',
    afterCtr: '',
    beforeCpi: '',
    afterCpi: '',
    psychologyNote: ''
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  // Resolve current active case safely
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0] || INITIAL_COMPARISON_CASES[0];

  // Keep editForm synced with active case
  useEffect(() => {
    if (activeCase) {
      setEditForm({
        creator: activeCase.creator,
        title: activeCase.title,
        category: activeCase.category || 'Creator Case',
        beforeCtr: activeCase.beforeCtr,
        afterCtr: activeCase.afterCtr,
        beforeCpi: activeCase.beforeCpi,
        afterCpi: activeCase.afterCpi,
        psychologyNote: activeCase.psychologyNote
      });
    }
  }, [activeCaseId, cases]);

  // Save cases to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('z_score_slider_cases', JSON.stringify(cases));
    } catch {
      // Ignored
    }
  }, [cases]);

  // Spring physics curve specified by architect: mass: 0.4, stiffness: 140, damping: 22 (locked 60fps)
  const springX = useMotionValue(50);
  const smoothX = useSpring(springX, { mass: 0.4, stiffness: 140, damping: 22 });

  useEffect(() => {
    springX.set(sliderPos);
  }, [sliderPos, springX]);

  // Pointer dragging coordination
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clampedPercent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.prevent-slider-drag')) return;
    setIsDragging(true);
    handleMove(e.clientX);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos(prev => Math.min(100, prev + 5));
    }
  };

  // Dynamic Case Management Handlers
  const handleAddNewCreator = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = inlineCreatorName.trim() || 'New Creator Hook';
    const tag = inlineCategoryTag.trim() || 'Viral Case';

    const newId = `custom-${Date.now()}`;
    const newCase: BeforeAfterCase = {
      id: newId,
      creator: name,
      title: `${name} CTR Optimization Experiment`,
      category: tag,
      beforeCpi: 'Baseline draft screenshot / unpolished thumbnail',
      afterCpi: 'Z Score engineered focal hook & high-contrast grading',
      beforeCtr: '3.8%',
      afterCtr: '14.2%',
      liftMultiplier: '+3.7x Lift',
      beforeImage: activeCase.beforeImage,
      afterImage: activeCase.afterImage,
      psychologyNote: 'Custom comparison slot. Upload before/after images or customize CTR metrics in the dashboard.',
      isCustom: true
    };

    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(newId);
    setInlineCreatorName('');
    setInlineCategoryTag('');
    setIsAddingNew(false);
    toast.success(`Creator "${name}" added to workspace!`);
  };

  const handleUpdateActiveCase = (e: React.FormEvent) => {
    e.preventDefault();
    const parse = (val: string) => parseFloat(val.replace('%', '')) || 1;
    const b = parse(editForm.beforeCtr);
    const a = parse(editForm.afterCtr);
    const lift = `+${(a / Math.max(0.1, b)).toFixed(1)}x Lift`;

    setCases(prev => prev.map(c => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          creator: editForm.creator.trim() || c.creator,
          title: editForm.title.trim() || c.title,
          category: editForm.category.trim() || c.category,
          beforeCtr: editForm.beforeCtr.includes('%') ? editForm.beforeCtr : `${editForm.beforeCtr}%`,
          afterCtr: editForm.afterCtr.includes('%') ? editForm.afterCtr : `${editForm.afterCtr}%`,
          beforeCpi: editForm.beforeCpi,
          afterCpi: editForm.afterCpi,
          psychologyNote: editForm.psychologyNote,
          liftMultiplier: lift
        };
      }
      return c;
    }));

    toast.success('Creator metadata successfully updated!');
    setIsDashboardOpen(false);
  };

  const handleDeleteActiveCase = (caseIdToDelete: string) => {
    if (cases.length <= 1) {
      toast.error('Cannot delete the last remaining comparison case.');
      return;
    }

    const remaining = cases.filter(c => c.id !== caseIdToDelete);
    setCases(remaining);
    setActiveCaseId(remaining[0].id);
    toast.info('Case deleted from workspace.');
  };

  const handleResetDefaults = () => {
    setCases(INITIAL_COMPARISON_CASES);
    setActiveCaseId(INITIAL_COMPARISON_CASES[0].id);
    localStorage.removeItem('z_score_slider_cases');
    toast.success('Reset to standard benchmark cases.');
  };

  // Image Upload handler
  const handleFileUpload = (side: 'before' | 'after', file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCases(prev => prev.map(c => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            [`${side}Image`]: result
          };
        }
        return c;
      }));
      toast.success(`${side === 'before' ? 'Before (Baseline)' : 'After (Optimized)'} thumbnail uploaded!`);
    };
    reader.readAsDataURL(file);
  };

  // Swap Before ⇄ After with iPhone fluid spring
  const handleSwapThumbnails = () => {
    if (viewMode === 'iphone-card-swap') {
      setCardSwapped(prev => !prev);
    } else {
      setCases(prev => prev.map(c => {
        if (c.id === activeCase.id) {
          return {
            ...c,
            beforeImage: c.afterImage,
            afterImage: c.beforeImage,
            beforeCtr: c.afterCtr,
            afterCtr: c.beforeCtr,
            beforeCpi: c.afterCpi,
            afterCpi: c.beforeCpi
          };
        }
        return c;
      }));
      toast.info('Swapped Before ⇄ After perspectives');
    }
  };

  return (
    <div className={`relative max-w-5xl mx-auto space-y-4 ${className}`}>
      {/* Hidden File Inputs */}
      <input
        ref={beforeFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileUpload('before', e.target.files[0])}
      />
      <input
        ref={afterFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFileUpload('after', e.target.files[0])}
      />

      {/* TOP CONTROL WORKSPACE OVERLAY: Minimalist Apple Frosted Glass Capsule */}
      <div className="backdrop-blur-xl bg-white/40 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-[28px] p-2.5 sm:p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Creator Case Pills Scrollable Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {cases.map((c) => {
            const isSelected = c.id === activeCase.id;
            return (
              <div key={c.id} className="relative group shrink-0">
                <button
                  onClick={() => setActiveCaseId(c.id)}
                  className={`relative px-3 sm:px-4 py-2 rounded-full text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1d1d1f] text-white shadow-md dark:bg-white dark:text-zinc-900 pr-7'
                      : 'bg-white/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-white/90 border border-black/5 dark:border-white/5'
                  }`}
                >
                  <span className="truncate max-w-[130px] sm:max-w-[160px]">{c.creator}</span>
                  {c.isCustom && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Custom case" />
                  )}
                </button>

                {/* Clean Delete 'X' Button on active state or hover */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteActiveCase(c.id);
                    }}
                    title="Delete this creator case"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 hover:bg-red-500 hover:text-white text-zinc-300 flex items-center justify-center transition-colors"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Quick Add Creator Button */}
          <button
            onClick={() => setIsAddingNew(true)}
            className="shrink-0 px-3 py-2 rounded-full text-xs font-bold tracking-tight bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 transition-all flex items-center gap-1"
          >
            <Plus size={13} />
            <span>Add Creator</span>
          </button>
        </div>

        {/* Right Utility Actions: Manual Dashboard Overlay Trigger + iPhone Mode Toggle */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* iOS Presentation Mode Switcher */}
          <div className="inline-flex p-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5">
            <button
              onClick={() => setViewMode('slider')}
              title="Interactive Horizontal Reveal Bar"
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                viewMode === 'slider'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
              }`}
            >
              <MoveHorizontal size={13} />
              <span className="hidden sm:inline">Slider Split</span>
            </button>
            <button
              onClick={() => {
                setViewMode('iphone-card-swap');
                setCardSwapped(false);
              }}
              title="iPhone 3D Organic Card Swap Animation"
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                viewMode === 'iphone-card-swap'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
              }`}
            >
              <Smartphone size={13} className="text-blue-500" />
              <span>iPhone Swap</span>
            </button>
          </div>

          {/* Manual Studio Dashboard Overlay Toggle */}
          <button
            onClick={() => setIsDashboardOpen(!isDashboardOpen)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              isDashboardOpen
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-500/20'
                : 'bg-white/80 dark:bg-white/10 hover:bg-white text-zinc-800 dark:text-white border-black/5 dark:border-white/10'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Edit Metrics</span>
          </button>

          {/* Quick Swap Button */}
          <button
            onClick={handleSwapThumbnails}
            title="Swap Before and After"
            className="p-1.5 rounded-full bg-white/70 dark:bg-white/10 hover:bg-white text-zinc-700 dark:text-zinc-200 border border-black/5 transition-all shadow-sm"
          >
            <ArrowLeftRight size={14} />
          </button>
        </div>
      </div>

      {/* QUICK INLINE CREATOR NAME INPUT OVERLAY */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ type: 'spring', mass: 0.4, stiffness: 140, damping: 22 }}
            onSubmit={handleAddNewCreator}
            className="overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-zinc-900/80 border border-blue-500/30 rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Add Creator Name (e.g. MrBeast, Azul Welz, HA PROD)..."
                value={inlineCreatorName}
                onChange={(e) => setInlineCreatorName(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2 text-xs font-semibold bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="w-full sm:w-48">
              <input
                type="text"
                placeholder="Category Tag (e.g. Gaming)"
                value={inlineCategoryTag}
                onChange={(e) => setInlineCategoryTag(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                Save Creator
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* EXPANDABLE MANUAL DASHBOARD OVERLAY */}
      <AnimatePresence>
        {isDashboardOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ type: 'spring', mass: 0.4, stiffness: 140, damping: 22 }}
            className="overflow-hidden backdrop-blur-2xl bg-white/80 dark:bg-zinc-900/90 border border-white/60 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative z-30"
          >
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-display uppercase tracking-wider">
                  Manual Creator & CTR Configuration Matrix
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-2.5 py-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={() => setIsDashboardOpen(false)}
                  className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateActiveCase} className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    value={editForm.creator}
                    onChange={(e) => setEditForm(prev => ({ ...prev, creator: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Video Title Hook
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-semibold bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Before Baseline</span>
                    <button
                      type="button"
                      onClick={() => beforeFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <Upload size={12} /> Replace Image
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold">CTR %</span>
                      <input
                        type="text"
                        value={editForm.beforeCtr}
                        onChange={(e) => setEditForm(prev => ({ ...prev, beforeCtr: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-black/40 border border-black/10 rounded-lg"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-zinc-400 font-bold">Critique Note</span>
                      <input
                        type="text"
                        value={editForm.beforeCpi}
                        onChange={(e) => setEditForm(prev => ({ ...prev, beforeCpi: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-black/40 border border-black/10 rounded-lg truncate"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-blue-500/[0.03] border border-blue-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">After Optimized</span>
                    <button
                      type="button"
                      onClick={() => afterFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <Upload size={12} /> Replace Image
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase text-blue-500 font-bold">CTR %</span>
                      <input
                        type="text"
                        value={editForm.afterCtr}
                        onChange={(e) => setEditForm(prev => ({ ...prev, afterCtr: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-black/40 border border-blue-300 dark:border-blue-500/40 rounded-lg text-blue-600 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-blue-500 font-bold">Hook Reason</span>
                      <input
                        type="text"
                        value={editForm.afterCpi}
                        onChange={(e) => setEditForm(prev => ({ ...prev, afterCpi: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-black/40 border border-blue-300 dark:border-blue-500/40 rounded-lg truncate"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Psychological Trigger & Viewer Behavior Analysis
                </label>
                <textarea
                  rows={2}
                  value={editForm.psychologyNote}
                  onChange={(e) => setEditForm(prev => ({ ...prev, psychologyNote: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-medium bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-zinc-400">
                  Real-time calculated lift:{' '}
                  <strong className="text-blue-600 font-mono">
                    {`+${((parseFloat(editForm.afterCtr.replace('%', '')) || 1) / Math.max(0.1, parseFloat(editForm.beforeCtr.replace('%', '')) || 1)).toFixed(1)}x Lift`}
                  </strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteActiveCase(activeCase.id)}
                    className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Delete Case</span>
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1d1d1f] text-white dark:bg-white dark:text-zinc-900 text-xs font-bold rounded-xl shadow-md transition-transform hover:scale-[1.02]"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VISUAL WORKSPACE: Either Slider Split OR iPhone-Style 3D Fluid Card Swap */}
      <div className="relative group">
        {viewMode === 'slider' ? (
          /* ========================================================================= */
          /* MODE 1: HORIZONTAL INTERACTIVE SLIDER SPLIT                              */
          /* ========================================================================= */
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuenow={Math.round(sliderPos)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Before and after thumbnail comparison slider"
            className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 dark:bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1.5px_1px_rgba(255,255,255,0.4)] cursor-ew-resize select-none touch-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform-gpu will-change-transform"
          >
            {/* UNDER LAYER: "AFTER" (Optimized Premium Thumbnail) */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={activeCase.afterImage}
                alt={`${activeCase.creator} - After Thumbnail`}
                className="w-full h-full object-cover select-none pointer-events-none"
                loading="eager"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* OVER LAYER: "BEFORE" (Old Baseline Thumbnail - Clipped dynamically) */}
            <motion.div
              className="absolute inset-0 overflow-hidden pointer-events-none will-change-[clip-path]"
              style={{
                clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
              }}
            >
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={activeCase.beforeImage}
                  alt={`${activeCase.creator} - Before Thumbnail`}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  loading="eager"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* FLOATING GLASS CAPSULE BADGES (Apple iOS 26 Styling) */}
            {/* Top-Left: "BEFORE (4% CTR)" in soft low-opacity styling */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 text-white/90 text-xs font-semibold shadow-lg">
                <span className="w-2 h-2 rounded-full bg-zinc-400" />
                <span>BEFORE ({activeCase.beforeCtr} CTR)</span>
              </div>
            </div>

            {/* Top-Right: "AFTER (14.8% CTR)" in vibrant electric blue styling */}
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-xl bg-[#0055ff]/85 border border-white/40 text-white text-xs font-bold shadow-[0_4px_20px_rgba(0,85,255,0.4)]">
                <Flame size={13} className="fill-white" />
                <span>AFTER ({activeCase.afterCtr} CTR)</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-black">
                  {activeCase.liftMultiplier}
                </span>
              </div>
            </div>

            {/* THE METALLIC WIRE DIVIDER BAR & MAGNETIC GLASS DRAG HANDLE */}
            <div
              className="absolute top-0 bottom-0 z-30 pointer-events-none will-change-transform"
              style={{
                left: `${sliderPos}%`,
                transform: 'translateX(-50%)'
              }}
            >
              {/* Sharp metallic wire */}
              <div className="w-[2px] h-full bg-gradient-to-b from-white/90 via-white/50 to-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8),0_0_20px_rgba(0,85,255,0.4)]" />

              {/* Magnetic glass drag handle capsule */}
              <motion.div
                animate={{ scale: isDragging ? 1.15 : 1 }}
                transition={{ type: 'spring', mass: 0.4, stiffness: 140, damping: 22 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/80 dark:border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center text-white cursor-ew-resize"
              >
                <div className="flex items-center gap-0.5 text-white drop-shadow-md">
                  <div className="w-1 h-3.5 bg-white rounded-full opacity-90" />
                  <div className="w-1 h-3.5 bg-white rounded-full opacity-90" />
                </div>
              </motion.div>
            </div>

            {/* Bottom Details Overlay Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end justify-between gap-4">
              <div className="p-3 sm:p-4 rounded-2xl backdrop-blur-xl bg-black/50 border border-white/20 text-white max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    {activeCase.creator}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-[10px] text-zinc-300 font-medium">
                    {activeCase.category || 'Featured Hook'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                  {activeCase.title}
                </h3>
              </div>

              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/20 border border-white/30 text-white text-xs font-semibold">
                <MoveHorizontal size={13} />
                <span>Drag to Reveal</span>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE 2: iPHONE-STYLE 3D ORGANIC CARD-SWAPPING FLUID ANIMATION             */
          /* Physics: mass: 0.4, stiffness: 140, damping: 22 at locked 60fps          */
          /* ========================================================================= */
          <div className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[420px] rounded-[32px] p-4 sm:p-8 backdrop-blur-xl bg-white/10 border border-white/20 dark:bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1.5px_1px_rgba(255,255,255,0.4)] flex items-center justify-center overflow-visible select-none [perspective:1200px]">
            {/* Background Ambience */}
            <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            {/* Card 1: BEFORE Card */}
            <motion.div
              layout
              onClick={() => setCardSwapped(false)}
              animate={{
                x: !cardSwapped ? 0 : 35,
                y: !cardSwapped ? 0 : -15,
                scale: !cardSwapped ? 1 : 0.88,
                rotateY: !cardSwapped ? 0 : -8,
                rotateZ: !cardSwapped ? 0 : -2,
                zIndex: !cardSwapped ? 20 : 10,
                opacity: !cardSwapped ? 1 : 0.75
              }}
              transition={{
                type: 'spring',
                mass: 0.4,
                stiffness: 140,
                damping: 22
              }}
              className="absolute w-[86%] sm:w-[78%] aspect-[16/9] rounded-[24px] overflow-hidden border border-white/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] cursor-pointer transform-gpu will-change-transform group/card"
            >
              <img
                src={activeCase.beforeImage}
                alt="Before"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/60 border border-white/20 text-white text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  BEFORE ({activeCase.beforeCtr} CTR)
                </span>
              </div>

              {/* Tap to swap indicator if in background */}
              {cardSwapped && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-white/90 text-zinc-900 text-xs font-bold shadow-lg">
                    Tap to Bring Forward
                  </span>
                </div>
              )}
            </motion.div>

            {/* Card 2: AFTER Card */}
            <motion.div
              layout
              onClick={() => setCardSwapped(true)}
              animate={{
                x: cardSwapped ? 0 : 35,
                y: cardSwapped ? 0 : -15,
                scale: cardSwapped ? 1 : 0.88,
                rotateY: cardSwapped ? 0 : 8,
                rotateZ: cardSwapped ? 0 : 2,
                zIndex: cardSwapped ? 20 : 10,
                opacity: cardSwapped ? 1 : 0.75
              }}
              transition={{
                type: 'spring',
                mass: 0.4,
                stiffness: 140,
                damping: 22
              }}
              className="absolute w-[86%] sm:w-[78%] aspect-[16/9] rounded-[24px] overflow-hidden border border-blue-400/50 shadow-[0_25px_60px_-15px_rgba(0,85,255,0.4)] cursor-pointer transform-gpu will-change-transform group/card"
            >
              <img
                src={activeCase.afterImage}
                alt="After"
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full backdrop-blur-xl bg-[#0055ff]/90 border border-white/40 text-white text-xs font-bold shadow-lg">
                  <Flame size={13} className="fill-white" />
                  AFTER ({activeCase.afterCtr} CTR)
                </span>
              </div>

              {/* Tap to swap indicator if in background */}
              {!cardSwapped && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-4 py-1.5 rounded-full bg-[#0055ff] text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                    <Flame size={13} />
                    Tap to Inspect Optimized
                  </span>
                </div>
              )}
            </motion.div>

            {/* Bottom floating toggle control in card swap mode */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={() => setCardSwapped(prev => !prev)}
                className="px-5 py-2 rounded-full backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white border border-white/40 shadow-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all"
              >
                <ArrowLeftRight size={14} className="text-blue-600" />
                <span>Swap Active Card ({cardSwapped ? 'Showing After' : 'Showing Before'})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STRATEGIC PSYCHOLOGICAL BREAKDOWN FOOTER */}
      <div className="p-4 sm:p-5 rounded-[24px] backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-display">
              Attention Psychology Blueprint
            </h5>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mt-0.5">
              {activeCase.psychologyNote}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => beforeFileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 border border-black/5 hover:bg-white text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1"
          >
            <Upload size={12} />
            <span>Upload Before</span>
          </button>
          <button
            onClick={() => afterFileInputRef.current?.click()}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#0055ff] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-1"
          >
            <Upload size={12} />
            <span>Upload After</span>
          </button>
        </div>
      </div>
    </div>
  );
};
