import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Zap,
  Flame,
  Upload,
  ArrowLeftRight,
  X,
  Plus,
  Trash2,
  SlidersHorizontal,
  RotateCw,
  Search,
  Layers,
  Smartphone,
  Maximize2,
  CheckCircle2
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

export const BENCHMARK_CASES: BeforeAfterCase[] = [
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
      const saved = localStorage.getItem('z_score_futuristic_cases');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return BENCHMARK_CASES;
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(initialCaseId);

  // Interaction Mode:
  // 1. 'lens': Dynamic Island Lens (Portal Inspector - mouse cursor transforms into magnetic glass circle revealing Before)
  // 2. 'flip-3d': Premium 3D Double-Sided Card Flip (Axis flip with organic spring physics)
  const [interactionMode, setInteractionMode] = useState<'lens' | 'flip-3d'>('lens');
  const [isFlipped, setIsFlipped] = useState(false); // for 3D card flip

  // Dynamic Island Lens Physics & Geometry
  const [lensDiameter, setLensDiameter] = useState(240); // px
  const [isHovering, setIsHovering] = useState(false);
  const [containerBounds, setContainerBounds] = useState({ width: 800, height: 450 });

  // Mouse Coordinates inside container
  const rawMouseX = useMotionValue(400);
  const rawMouseY = useMotionValue(225);

  // Silky smooth spring physics for magnetic glass lens tracking (mass: 0.35, stiffness: 220, damping: 24)
  const lensX = useSpring(rawMouseX, { mass: 0.35, stiffness: 220, damping: 24 });
  const lensY = useSpring(rawMouseY, { mass: 0.35, stiffness: 220, damping: 24 });

  // Creator Control Center state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCreatorInput, setNewCreatorInput] = useState('');
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Editable active case state
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0] || BENCHMARK_CASES[0];
  const [editForm, setEditForm] = useState({
    creator: '',
    title: '',
    beforeCtr: '',
    afterCtr: '',
    category: '',
    psychologyNote: ''
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef = useRef<HTMLInputElement>(null);

  // Sync edit form with active case
  useEffect(() => {
    if (activeCase) {
      setEditForm({
        creator: activeCase.creator,
        title: activeCase.title,
        beforeCtr: activeCase.beforeCtr,
        afterCtr: activeCase.afterCtr,
        category: activeCase.category || 'Creator Focus',
        psychologyNote: activeCase.psychologyNote
      });
    }
  }, [activeCaseId, cases]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('z_score_futuristic_cases', JSON.stringify(cases));
    } catch {
      // Ignored
    }
  }, [cases]);

  // Measure container geometry
  const updateContainerBounds = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerBounds({ width: rect.width, height: rect.height });
    }
  }, []);

  useEffect(() => {
    updateContainerBounds();
    window.addEventListener('resize', updateContainerBounds);
    return () => window.removeEventListener('resize', updateContainerBounds);
  }, [updateContainerBounds]);

  // Mouse Tracking for Dynamic Island Lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    rawMouseX.set(x);
    rawMouseY.set(y);
    if (!isHovering) setIsHovering(true);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMouseMove(e);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Smoothly return lens to center on mouse leave
    rawMouseX.set(containerBounds.width / 2);
    rawMouseY.set(containerBounds.height / 2);
  };

  // Mobile Touch Support: Touch-tap instantly moves portal lens without performance crash
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, touch.clientY - rect.top));
    rawMouseX.set(x);
    rawMouseY.set(y);
    setIsHovering(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    handleTouchMove(e);
  };

  // Creator Management Actions
  const handleAddCreator = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newCreatorInput.trim() || 'New Creator Hook';
    const tag = newCategoryInput.trim() || 'Viral Focus';
    const id = `custom-${Date.now()}`;

    const newCase: BeforeAfterCase = {
      id,
      creator: name,
      title: `${name} CTR Optimization Study`,
      category: tag,
      beforeCpi: 'Raw baseline draft / low-contrast subject isolation',
      afterCpi: 'Engineered high-CTR focal hook with dramatic color grading',
      beforeCtr: '3.9%',
      afterCtr: '14.5%',
      liftMultiplier: '+3.7x Lift',
      beforeImage: activeCase.beforeImage,
      afterImage: activeCase.afterImage,
      psychologyNote: 'Custom comparison slot. Move lens or flip card to inspect focal hierarchy.',
      isCustom: true
    };

    setCases(prev => [newCase, ...prev]);
    setActiveCaseId(id);
    setNewCreatorInput('');
    setNewCategoryInput('');
    setIsAddingNew(false);
    toast.success(`Creator "${name}" added to Control Center!`);
  };

  const handleDeleteCreator = (idToDelete: string) => {
    if (cases.length <= 1) {
      toast.error('At least one comparison case must remain.');
      return;
    }
    const remaining = cases.filter(c => c.id !== idToDelete);
    setCases(remaining);
    setActiveCaseId(remaining[0].id);
    toast.info('Creator case removed.');
  };

  const handleSaveActiveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    const parse = (str: string) => parseFloat(str.replace('%', '')) || 1;
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
          psychologyNote: editForm.psychologyNote,
          liftMultiplier: lift
        };
      }
      return c;
    }));

    toast.success('Creator metadata updated!');
    setIsMenuOpen(false);
  };

  // Image Upload Handlers
  const handleImageFile = (side: 'before' | 'after', file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please upload a valid image (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
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

  return (
    <div className={`relative max-w-5xl mx-auto space-y-4 select-none ${className}`}>
      {/* Hidden File Inputs */}
      <input
        ref={beforeFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleImageFile('before', e.target.files[0])}
      />
      <input
        ref={afterFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleImageFile('after', e.target.files[0])}
      />

      {/* ========================================================================= */}
      {/* CREATOR CONTROL CENTER: Micro-minimalist clean floating menu block        */}
      {/* Built with extreme frosted glass ('backdrop-blur-xl bg-white/5 border')   */}
      {/* ========================================================================= */}
      <div className="backdrop-blur-xl bg-white/50 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-[28px] p-2.5 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.6)] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Creator Case Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {cases.map((c) => {
            const isSelected = c.id === activeCase.id;
            return (
              <div key={c.id} className="relative group shrink-0">
                <button
                  onClick={() => {
                    setActiveCaseId(c.id);
                    setIsFlipped(false);
                  }}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1d1d1f] text-white shadow-md dark:bg-white dark:text-zinc-900 pr-7'
                      : 'bg-white/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-white/90 border border-black/5 dark:border-white/5'
                  }`}
                >
                  <span className="truncate max-w-[130px] sm:max-w-[150px]">{c.creator}</span>
                  {c.isCustom && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Custom Case" />
                  )}
                </button>

                {/* Clean Delete 'X' Button on active state */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCreator(c.id);
                    }}
                    title="Delete Creator Case"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/20 hover:bg-red-500 hover:text-white text-zinc-300 flex items-center justify-center transition-colors"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Quick Add Creator Trigger */}
          <button
            onClick={() => setIsAddingNew(true)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 transition-all flex items-center gap-1"
          >
            <Plus size={12} />
            <span>Add Creator</span>
          </button>
        </div>

        {/* Right Interaction Switcher: Lens vs 3D Flip */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Apple Interaction Mode Switcher */}
          <div className="inline-flex p-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/5">
            <button
              onClick={() => {
                setInteractionMode('lens');
                setIsFlipped(false);
              }}
              title="Dynamic Island Lens Portal Inspector"
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                interactionMode === 'lens'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
              }`}
            >
              <Search size={12} className="text-blue-500" />
              <span>Island Lens</span>
            </button>
            <button
              onClick={() => setInteractionMode('flip-3d')}
              title="3D Double-Sided Organic Card Flip"
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight transition-all flex items-center gap-1.5 ${
                interactionMode === 'flip-3d'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
              }`}
            >
              <RotateCw size={12} className="text-purple-500" />
              <span>3D Card Flip</span>
            </button>
          </div>

          {/* Lens Diameter Selector (when in lens mode) */}
          {interactionMode === 'lens' && (
            <div className="hidden sm:inline-flex items-center gap-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-full text-[10px] font-bold text-zinc-500">
              <span className="text-zinc-400">Lens:</span>
              {[
                { size: 180, label: 'S' },
                { size: 240, label: 'M' },
                { size: 300, label: 'L' }
              ].map(opt => (
                <button
                  key={opt.size}
                  onClick={() => setLensDiameter(opt.size)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    lensDiameter === opt.size
                      ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Control Center Config Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border shadow-sm ${
              isMenuOpen
                ? 'bg-[#1d1d1f] text-white border-black dark:bg-white dark:text-black'
                : 'bg-white/80 dark:bg-white/10 hover:bg-white text-zinc-800 dark:text-white border-black/5 dark:border-white/10'
            }`}
          >
            <SlidersHorizontal size={12} />
            <span>Metrics</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC INLINE 'ADD CREATOR' POPUP INPUT */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            onSubmit={handleAddCreator}
            className="overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-zinc-900/80 border border-blue-500/30 rounded-2xl p-3.5 shadow-lg flex flex-col sm:flex-row items-center gap-2.5"
          >
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Add Creator Name (e.g. MrBeast, Azul Welz, HA PROD)..."
                value={newCreatorInput}
                onChange={(e) => setNewCreatorInput(e.target.value)}
                autoFocus
                className="w-full px-3.5 py-2 text-xs font-semibold bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="w-full sm:w-48">
              <input
                type="text"
                placeholder="Category (e.g. Gaming)"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-semibold bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                Add Creator
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

      {/* EXPANDABLE CONTROL CENTER METRICS DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.98 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 140, damping: 20 }}
            className="overflow-hidden backdrop-blur-2xl bg-white/85 dark:bg-zinc-900/95 border border-white/60 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative z-30"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-display">
                  Dynamic Creator Context & CTR Multiplier
                </h4>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-black dark:hover:text-white"
              >
                <X size={13} />
              </button>
            </div>

            <form onSubmit={handleSaveActiveMetadata} className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Creator Name
                  </label>
                  <input
                    type="text"
                    value={editForm.creator}
                    onChange={(e) => setEditForm(prev => ({ ...prev, creator: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Before Baseline CTR
                  </label>
                  <input
                    type="text"
                    value={editForm.beforeCtr}
                    onChange={(e) => setEditForm(prev => ({ ...prev, beforeCtr: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-semibold bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                    After Optimized CTR
                  </label>
                  <input
                    type="text"
                    value={editForm.afterCtr}
                    onChange={(e) => setEditForm(prev => ({ ...prev, afterCtr: e.target.value }))}
                    className="w-full px-3 py-1.5 text-xs font-bold text-blue-600 bg-white/70 dark:bg-black/30 border border-blue-300 dark:border-blue-500/40 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Video Hook Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-1.5 text-xs font-semibold bg-white/70 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => beforeFileRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Upload size={12} /> Replace Before Image
                  </button>
                  <button
                    type="button"
                    onClick={() => afterFileRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <Upload size={12} /> Replace After Image
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteCreator(activeCase.id)}
                    className="px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1d1d1f] text-white dark:bg-white dark:text-zinc-900 text-xs font-bold rounded-xl shadow-md"
                  >
                    Apply Updates
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CANVAS: DYNAMIC ISLAND LENS OR 3D CARD FLIP                */}
      {/* Performance Anti-Crash Lock: transform-gpu will-change-transform          */}
      {/* ========================================================================= */}
      {interactionMode === 'lens' ? (
        /* ======================================================================= */
        /* CONCEPT 1: DYNAMIC ISLAND LENS (Magnetic Circular Portal Overlay)       */
        /* Full 'After' image visible; lens reveals stationary 'Before' draft      */
        /* ======================================================================= */
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchStart}
          className="relative w-full aspect-[16/9] rounded-[32px] overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 dark:bg-black/20 shadow-[0_20px_50px_rgba(0,0,0,0.14),inset_0_1.5px_1px_rgba(255,255,255,0.4)] cursor-crosshair select-none touch-none transform-gpu will-change-transform"
        >
          {/* BASE CANVAS: Optimized 'AFTER' Thumbnail (Fully Visible) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={activeCase.afterImage}
              alt="After Optimized Thumbnail"
              className="w-full h-full object-cover select-none"
              loading="eager"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* DYNAMIC ISLAND LENS PORTAL (Tracks Cursor via Spring Physics) */}
          {/* Inside this circular window, the 'Before' thumbnail renders at exact 1:1 coordinates */}
          <motion.div
            style={{
              x: lensX,
              y: lensY,
              width: lensDiameter,
              height: lensDiameter,
              marginLeft: -lensDiameter / 2,
              marginTop: -lensDiameter / 2
            }}
            className="absolute top-0 left-0 rounded-full overflow-hidden pointer-events-none z-30 ring-2 ring-white/80 shadow-[0_0_50px_rgba(0,0,0,0.65),inset_0_2px_4px_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,85,255,0.4)] transform-gpu will-change-transform"
          >
            {/* Direct coordinate mirror for flawless zero-latency lock */}
            <DynamicPortalInner
              lensX={lensX}
              lensY={lensY}
              lensDiameter={lensDiameter}
              containerWidth={containerBounds.width}
              containerHeight={containerBounds.height}
              imageSrc={activeCase.beforeImage}
            />

            {/* Lens HUD Overlay: Optical Reticle & Specular Glass Reflection */}
            <div className="absolute inset-0 rounded-full pointer-events-none border border-white/40">
              {/* Soft top-left specular glass sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/30 rounded-full" />

              {/* Optical Crosshair Reticle */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30 -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/30 -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/50" />

              {/* Floating Lens Portal Badge */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2">
                <span className="px-2.5 py-0.5 rounded-full backdrop-blur-md bg-black/75 border border-white/30 text-white text-[9px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                  BEFORE • {activeCase.beforeCtr} CTR
                </span>
              </div>
            </div>
          </motion.div>

          {/* FLOATING CORNER STATUS BADGES */}
          {/* Top-Right: 'AFTER' Hook Badge */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-xl bg-[#0055ff]/90 border border-white/40 text-white text-xs font-bold shadow-[0_4px_24px_rgba(0,85,255,0.4)]">
              <Flame size={13} className="fill-white" />
              <span>OPTIMIZED ({activeCase.afterCtr} CTR)</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-black">
                {activeCase.liftMultiplier}
              </span>
            </div>
          </div>

          {/* Top-Left: Live Interaction Prompt */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl bg-black/40 border border-white/20 text-white/90 text-[11px] font-semibold shadow-md">
              <Search size={11} className="text-blue-400" />
              <span className="hidden sm:inline">Glide cursor to reveal unoptimized baseline draft</span>
              <span className="sm:hidden">Touch & drag to inspect</span>
            </div>
          </div>

          {/* Bottom Creator Title Metadata Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end justify-between gap-4">
            <div className="p-3 sm:p-4 rounded-2xl backdrop-blur-xl bg-black/55 border border-white/20 text-white max-w-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {activeCase.creator}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-[10px] text-zinc-300 font-medium">
                  {activeCase.category || 'Featured Showcase'}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white truncate">
                {activeCase.title}
              </h3>
            </div>

            <button
              onClick={() => beforeFileRef.current?.click()}
              className="pointer-events-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold transition-all"
            >
              <Upload size={12} />
              <span>Replace Image</span>
            </button>
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* CONCEPT 2: PREMIUM 3D DOUBLE-SIDED CARD FLIP                            */
        /* Flips on axis with organic spring physics (stiffness: 140, damping: 20) */
        /* ======================================================================= */
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[440px] rounded-[32px] [perspective:1400px] cursor-pointer group/flip select-none"
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              type: 'spring',
              stiffness: 140,
              damping: 20,
              mass: 0.4
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full h-full rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] transform-gpu will-change-transform"
          >
            {/* FRONT SIDE: OPTIMIZED AFTER */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden border border-blue-500/40 shadow-2xl bg-zinc-900"
            >
              <img
                src={activeCase.afterImage}
                alt="Optimized After"
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-xl bg-[#0055ff]/90 border border-white/40 text-white text-xs font-bold shadow-lg">
                  <Flame size={13} className="fill-white" />
                  AFTER ({activeCase.afterCtr} CTR)
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                    {activeCase.creator}
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg">
                    {activeCase.title}
                  </h3>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold flex items-center gap-1.5">
                  <RotateCw size={13} className="group-hover/flip:rotate-180 transition-transform duration-500" />
                  <span>Tap to Flip to Baseline</span>
                </div>
              </div>
            </div>

            {/* BACK SIDE: BASELINE BEFORE (Rotated 180deg) */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
              className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden border border-white/30 shadow-2xl bg-zinc-900"
            >
              <img
                src={activeCase.beforeImage}
                alt="Baseline Before"
                className="w-full h-full object-cover select-none"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Badges */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full backdrop-blur-xl bg-black/60 border border-white/20 text-white text-xs font-semibold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-zinc-400" />
                  BEFORE BASELINE ({activeCase.beforeCtr} CTR)
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Low-Contrast Baseline Draft
                  </span>
                  <p className="text-xs text-zinc-300 max-w-md">
                    {activeCase.beforeCpi}
                  </p>
                </div>

                <div className="px-3.5 py-1.5 rounded-full bg-[#0055ff] text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <RotateCw size={13} />
                  <span>Tap to Flip to Optimized</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* STRATEGIC ATTENTION PSYCHOLOGY BLUEPRINT FOOTER */}
      <div className="p-4 sm:p-5 rounded-[24px] backdrop-blur-xl bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Zap size={18} />
          </div>
          <div>
            <h5 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider font-display">
              Attention Architecture Blueprint
            </h5>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mt-0.5">
              {activeCase.psychologyNote}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => beforeFileRef.current?.click()}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 border border-black/5 hover:bg-white text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-1"
          >
            <Upload size={12} />
            <span>Upload Before</span>
          </button>
          <button
            onClick={() => afterFileRef.current?.click()}
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

// =========================================================================
// HELPER COMPONENT: DynamicPortalInner
// Synchronously counter-offsets the "Before" image to mirror world coordinates
// perfectly inside the floating circular Dynamic Island Lens
// =========================================================================
interface DynamicPortalInnerProps {
  lensX: any;
  lensY: any;
  lensDiameter: number;
  containerWidth: number;
  containerHeight: number;
  imageSrc: string;
}

const DynamicPortalInner: React.FC<DynamicPortalInnerProps> = ({
  lensX,
  lensY,
  lensDiameter,
  containerWidth,
  containerHeight,
  imageSrc
}) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const unsubX = lensX.on('change', (latestX: number) => {
      setCoords(prev => ({ ...prev, x: latestX }));
    });
    const unsubY = lensY.on('change', (latestY: number) => {
      setCoords(prev => ({ ...prev, y: latestY }));
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [lensX, lensY]);

  // Exact 1:1 counter-translation
  const offsetX = -(coords.x - lensDiameter / 2);
  const offsetY = -(coords.y - lensDiameter / 2);

  return (
    <div
      style={{
        position: 'absolute',
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        left: `${offsetX}px`,
        top: `${offsetY}px`
      }}
      className="pointer-events-none select-none"
    >
      <img
        src={imageSrc}
        alt="Before Baseline Portal Mirror"
        className="w-full h-full object-cover select-none"
        draggable={false}
      />
    </div>
  );
};
