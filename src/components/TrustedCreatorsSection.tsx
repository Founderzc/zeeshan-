import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { SpectralGlassHover } from './SpectralGlassHover';

export interface TrustedClient {
  id: number;
  name: string;
  handle: string;
  image: string;
  color: string;
}

export const TRUSTED_CLIENTS_DATA: TrustedClient[] = [
  { id: 1, name: "Azul Welz", handle: "357K subscribers", image: "https://i.ibb.co/ddJ5FDm/image.png", color: "text-blue-600" },
  { id: 2, name: "Hustle Ninjas", handle: "301K subscribers", image: "https://i.ibb.co/NdXYBpM4/image.png", color: "text-orange-600" },
  { id: 3, name: "Rob Lipsett", handle: "491K subscribers", image: "https://i.ibb.co/6J4CbdQf/image.png", color: "text-purple-600" },
  { id: 4, name: "Kristen & Siya", handle: "329K subscribers", image: "https://i.ibb.co/rR6LmpRm/image.png", color: "text-emerald-600" },
  { id: 5, name: "Enablers", handle: "592K subscribers", image: "https://image2url.com/r2/default/images/1774670864556-c1f9664f-9c57-4938-9b23-2eaa0371cdf4.png", color: "text-blue-700" },
  { id: 6, name: "Russian Rock", handle: "690K subscribers", image: "https://image2url.com/r2/default/images/1774670662268-7fe3deea-41b2-4c6f-af8c-454ec4daffa6.png", color: "text-red-600" },
  { id: 7, name: "Row Rhythm", handle: "35K subscribers", image: "https://image2url.com/r2/default/images/1774860421994-990bce61-ed25-44f2-9291-004db964e791.png", color: "text-zinc-600" },
];

export const TrustedCreatorsSection: React.FC<{
  clients?: TrustedClient[];
  className?: string;
}> = ({
  clients = TRUSTED_CLIENTS_DATA,
  className = ''
}) => {
  return (
    <section className={`py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden bg-[#F5F5F7] dark:bg-black/95 transition-colors ${className}`}>
      {/* Background Saturated Ambient Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[260px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" 
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-6 sm:space-y-8">
        {/* Compact Apple iOS Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] text-blue-600 dark:text-blue-400 text-antialiased"
          >
            <Sparkles size={11} className="text-blue-500" />
            <span>Premium Network</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-[#1d1d1f] dark:text-white tracking-tight text-antialiased"
          >
            TRUSTED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">CREATORS.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm font-medium text-antialiased leading-relaxed"
          >
            Partnering with world-class creators generating hundreds of millions of views.
          </motion.p>
        </div>

        {/* Unified Compact Dashboard-Style Capsule Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-1.5 sm:p-2 rounded-[28px] backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_12px_40px_-15px_rgba(0,0,0,0.06)] relative overflow-hidden"
        >
          {/* Soft internal glare rim */}
          <div 
            className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20 dark:ring-white/10" 
            aria-hidden="true" 
          />

          {/* Ultra-compact block grid with minimal padding and tight spacing (gap-1.5 / gap-2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 sm:gap-2 relative z-10">
            {clients.map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: i * 0.04, 
                  duration: 0.45, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ 
                  y: -4, 
                  scale: 1.02,
                  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } 
                }}
                data-cursor="card"
                data-cursor-badge="CREATOR"
                className="group relative p-2.5 sm:p-3 rounded-2xl backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:bg-white/15 hover:border-white/25 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_25px_-5px_rgba(0,0,0,0.08)] flex flex-col items-center text-center transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle soft internal specular glare on hover */}
                <div 
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                  aria-hidden="true" 
                />

                {/* Compact Circular Avatar with Spectral Glass Glow */}
                <SpectralGlassHover
                  rounded="rounded-full"
                  className="p-0.5 bg-white/10 dark:bg-white/5"
                  blurAmount={16}
                  auraScale={1.2}
                  tiltIntensity={4}
                  containerClassName="mb-2"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden relative shadow-sm">
                    <img
                      src={client.image}
                      alt={client.name}
                      className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 rounded-full ring-1 ring-white flex items-center justify-center">
                      <CheckCircle2 size={8} className="text-white" />
                    </div>
                  </div>
                </SpectralGlassHover>

                {/* Creator Metrics & Razor-Sharp Text */}
                <div className="w-full min-w-0 space-y-0.5">
                  <h4 className="text-xs font-bold text-[#1d1d1f] dark:text-white tracking-tight truncate text-antialiased group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {client.name}
                  </h4>
                  <p className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider truncate text-antialiased">
                    {client.handle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
