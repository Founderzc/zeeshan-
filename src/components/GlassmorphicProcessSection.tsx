import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Target, 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Layers, 
  Zap, 
  Workflow, 
  Eye,
  Flame
} from 'lucide-react';
import { AppleGlassCard } from './AppleGlassCard';
import { PushPin } from './PushPin';

export interface WorkflowStep {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  deliverables: string[];
  duration: string;
  glowColor: string;
  pinColor: string;
  metric: string;
}

const PROCESS_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Discovery & Strategy",
    subtitle: "Audience Psychology & Competitor Audit",
    desc: "We analyze your video premise, target audience mindset, and top-ranking competitors in your niche to identify the exact curiosity gap and psychological hook that wins the feed.",
    icon: Target,
    deliverables: ["Competitor Matrix", "Curiosity Angle", "Focal Point Map"],
    duration: "Hours 0 – 2",
    glowColor: "from-blue-500/20 via-cyan-500/10 to-transparent",
    pinColor: "#3B82F6",
    metric: "3x Higher CTR Potential"
  },
  {
    step: "02",
    title: "Concept & Layout",
    subtitle: "Pattern Interrupt & 3-Second Rule",
    desc: "Drafting rapid compositional variations designed to break the viewer's scroll inertia. We test contrast ratios, focal depth, and eye-tracking paths before placing a single pixel.",
    icon: Cpu,
    deliverables: ["Pattern Interrupts", "Rough Comps", "Eye-Tracking Layout"],
    duration: "Hours 2 – 4",
    glowColor: "from-purple-500/20 via-indigo-500/10 to-transparent",
    pinColor: "#8B5CF6",
    metric: "Sub-Second Comprehension"
  },
  {
    step: "03",
    title: "Design & High-End Art",
    subtitle: "Apple-Grade Lighting & 4K Detail",
    desc: "Executing the approved concept with hyper-precise color grading, cinematic rim lights, facial expression exaggeration, custom 3D assets, and high-legibility typographic framing.",
    icon: Sparkles,
    deliverables: ["4K Render Assets", "Cinematic Rim Lighting", "Layered Master PSD"],
    duration: "Hours 4 – 8",
    glowColor: "from-amber-500/20 via-orange-500/10 to-transparent",
    pinColor: "#FF6321",
    metric: "100% Crisp on Any Screen"
  },
  {
    step: "04",
    title: "Optimization & A/B Testing",
    subtitle: "Algorithmic Validation & Multi-Format Polish",
    desc: "Simulating mobile feed appearances (YouTube Dark/Light mode, iPad, TV app) and generating alternative hook variants ready for YouTube's native A/B thumbnail testing tool.",
    icon: TrendingUp,
    deliverables: ["Mobile Feed Preview", "A/B Variant Option", "Export Compression"],
    duration: "Final Polish",
    glowColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
    pinColor: "#10B981",
    metric: "+15% to +35% Avg CTR Lift"
  }
];

export const GlassmorphicProcessSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.75], ["0%", "100%"]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.3, 1, 0.5]);

  return (
    <section 
      id="process" 
      ref={containerRef}
      className={`py-28 px-4 sm:px-6 relative overflow-hidden bg-[#F5F5F7] dark:bg-black/90 transition-colors ${className}`}
    >
      {/* Background Ambient Radial Glow matching Thumbnail Section */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 blur-[150px] rounded-full pointer-events-none -z-10" 
      />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '36px 36px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header with Apple-grade hierarchy */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-white/80 dark:border-white/15 backdrop-blur-xl shadow-sm text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            <Workflow size={13} className="text-blue-500 animate-pulse" />
            <span>How I Work • 4-Step Architecture</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#1d1d1f] dark:text-white tracking-tight"
          >
            ENGINEERED FOR <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500">
              VIRAL RETENTION.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Every click is won in under 0.4 seconds. Here is the exact systematic workflow used to turn viewer curiosity into explosive algorithm performance.
          </motion.p>
        </div>

        {/* Desktop Glowing Timeline Track */}
        <div className="relative">
          {/* Animated Connecting Glowing Path (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 pointer-events-none z-0">
            {/* Base line track */}
            <div className="w-full h-full bg-black/5 dark:bg-white/10 rounded-full" />
            {/* Glowing animated line reveal */}
            <motion.div
              style={{ height: lineHeight, opacity: glowOpacity }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 via-purple-500 to-orange-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
            />
          </div>

          {/* Process Cards Grid / Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {PROCESS_STEPS.map((step, index) => {
              const StepIcon = step.icon;

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.12, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="flex flex-col h-full"
                  data-cursor="card"
                  data-cursor-badge={`STEP ${step.step}`}
                >
                  <AppleGlassCard
                    className="p-7 sm:p-8 h-full flex flex-col justify-between relative group hover:border-white transition-all overflow-hidden"
                    variant="light"
                    scaleOnHover={1.025}
                    liftOnHover={-8}
                    tiltIntensity={5}
                    glareIntensity={0.5}
                  >
                    {/* PushPin Accent matching thumbnail aesthetic */}
                    <PushPin color={step.pinColor} />

                    {/* Ambient Glow Pill inside card */}
                    <div 
                      className={`absolute -top-16 -right-16 w-36 h-36 bg-gradient-to-br ${step.glowColor} blur-2xl rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60`} 
                    />

                    <div>
                      {/* Top Header: Step Number & Duration */}
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-3xl font-black text-black/20 dark:text-white/20 group-hover:text-blue-600 transition-colors">
                            {step.step}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            Phase
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/10 text-zinc-600 dark:text-zinc-300 text-[11px] font-semibold">
                          <Clock size={11} className="text-zinc-400" />
                          <span>{step.duration}</span>
                        </div>
                      </div>

                      {/* Icon & Title */}
                      <div className="space-y-3 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <StepIcon size={22} className="text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors" />
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {step.title}
                          </h3>
                          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                            {step.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Description with High-Vibrancy Contrast */}
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-normal mb-6">
                        {step.desc}
                      </p>
                    </div>

                    {/* Bottom Deliverables & Performance Metric */}
                    <div className="pt-4 border-t border-black/5 dark:border-white/10 space-y-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                          Key Deliverables
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {step.deliverables.map((item, dIdx) => (
                            <span 
                              key={dIdx}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 text-[11px] font-medium text-zinc-700 dark:text-zinc-200"
                            >
                              <CheckCircle2 size={10} className="text-emerald-500" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Metric Pill */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                          <Flame size={13} className="text-orange-500 animate-bounce" />
                          <span>{step.metric}</span>
                        </div>
                        <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                      </div>
                    </div>
                  </AppleGlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-4 rounded-3xl bg-white/80 dark:bg-black/40 border border-white/80 dark:border-white/15 backdrop-blur-2xl shadow-sm text-xs font-semibold text-zinc-600 dark:text-zinc-300">
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-blue-500" />
              Direct 1-on-1 Communication
            </span>
            <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              100% On-Time Express Delivery
            </span>
            <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <span className="flex items-center gap-2">
              <Flame size={14} className="text-orange-500" />
              Unlimited Polish Until Satisfied
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
