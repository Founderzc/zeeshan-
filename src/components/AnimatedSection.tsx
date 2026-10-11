import React from 'react';
import { motion } from 'motion/react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  stagger?: number;
}

// Apple signature spring physics: stiffness: 120, damping: 25, mass: 0.5 (cubic-bezier(0.16, 1, 0.3, 1))
const appleSpringTransition = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 25,
  mass: 0.5,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (stagger: number = 0.12) => ({
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.05,
    },
  }),
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 12,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: appleSpringTransition,
  },
};

/**
 * AnimatedSection
 * Reusable viewport wrapper with staggered children and Apple spring physics.
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  id,
  delay = 0,
  stagger = 0.12,
}) => {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      custom={stagger}
      variants={containerVariants}
      className={`relative ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.section>
  );
};

/**
 * AnimatedText
 * Wraps headings or paragraphs to ensure buttery smooth entrance without popping.
 * Translates subtly (Y: 10px to 0) with high-contrast text rendering.
 */
export const AnimatedText: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
}> = ({ children, className = '', as = 'div', delay = 0 }) => {
  const Component = motion[as as keyof typeof motion] as any;

  return (
    <Component
      variants={itemVariants}
      transition={{
        ...appleSpringTransition,
        delay,
      }}
      className={`select-text ${className}`}
      style={{ willChange: 'transform, opacity' }}
      data-cursor="text"
    >
      {children}
    </Component>
  );
};

/**
 * AnimatedGlassBlock
 * Unified frosted glass block wrapper for text callouts, cards, and stat blocks.
 * Uses backdrop-blur-xl bg-white/75 border border-white/80 with high-contrast text.
 */
export const AnimatedGlassBlock: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      variants={itemVariants}
      transition={{
        ...appleSpringTransition,
        delay,
      }}
      className={`relative backdrop-blur-xl bg-white/75 dark:bg-black/20 border border-white/80 dark:border-white/10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${className}`}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};
