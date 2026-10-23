/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, AnimatePresence, useInView, useMotionValue, useSpring, Variants } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Briefcase, 
  Zap, 
  Target,
  Cpu,
  MousePointer2,
  Palette,
  Send,
  CheckCircle2,
  ArrowRight,
  Instagram,
  Twitter,
  Github,
  Mail,
  MessageSquare,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  Video,
  Layers,
  Phone,
  ChevronDown,
  Bot,
  Loader2,
  Hand,
  Globe,
  Check,
  Star,
  Quote,
  Volume2,
  VolumeX,
  Users,
  Trophy,
  Gamepad2,
  TreeDeciduous,
  Flower2,
  Leaf,
  Heart,
  Image as ImageIcon,
  LogIn,
  LogOut,
  Mic,
  MicOff
} from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { GoogleGenAI, Modality } from "@google/genai";
import AboutPage from './pages/AboutPage';
import ThumbnailShowcasePage from './pages/ThumbnailShowcasePage';
import { CommentsSection } from './components/CommentsSection';
import { WaterBackground } from './components/WaterBackground';
import { FogEffect } from './components/FogEffect';
import { PushPin } from './components/PushPin';
import { AppleGlassCard } from './components/AppleGlassCard';
import { ApplePricingSection } from './components/ApplePricingSection';
import { GlassCard } from './components/GlassCard';
import { AnimatedSection, AnimatedText, AnimatedGlassBlock } from './components/AnimatedSection';
import { AppleHelloIntro } from './components/AppleHelloIntro';
import { InteractiveGlassCursor } from './components/InteractiveGlassCursor';
import { GlassmorphicPageTransition } from './components/GlassmorphicPageTransition';
import { GlassmorphicProcessSection } from './components/GlassmorphicProcessSection';
import { GlassmorphicReviewSection } from './components/GlassmorphicReviewSection';
import { TrustedCreatorsSection } from './components/TrustedCreatorsSection';
import { SpectralGlassHover } from './components/SpectralGlassHover';
import { useAdmin } from './hooks/useAdmin';
import { Toaster, toast } from 'sonner';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import zeeshanProfilePic from './assets/images/regenerated_image_1791712740532.jpg';
import enablersAvatar from './assets/images/regenerated_image_1791817292482.png';
import russianRockAvatar from './assets/images/regenerated_image_1791817294093.png';
import rowRhythmAvatar from './assets/images/regenerated_image_1791817303664.png';
import serrahxAvatar from './assets/images/regenerated_image_1791908842046.jpg';
import mrJayPlayzAvatar from './assets/images/regenerated_image_1791908843465.jpg';
import haProdClientAvatar from './assets/images/regenerated_image_1791958692290.png';
import haProdReviewAvatar from './assets/images/regenerated_image_1791958694279.png';
import behanceAvatar from './assets/images/regenerated_image_1792781378749.png';
import xAvatar from './assets/images/regenerated_image_1792781381244.png';

// --- Typewriter Text Component ---
const TypewriterText = ({ text, speed = 20 }: { text: string; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return <span>{displayedText}</span>;
};

// --- Scrapbook Decorations Component ---
const ScrapbookDecorations = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Red String Effect */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <motion.path
          d="M 100 200 Q 300 100 500 300 T 900 200"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 50 800 Q 400 900 600 700 T 950 850"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>

      {/* Push Pins */}
      <PushPin className="absolute top-10 left-[10%] rotate-[-15deg] scale-75" color="#ef4444" />
      <PushPin className="absolute bottom-20 right-[15%] rotate-[20deg] scale-75" color="#ef4444" />

      {/* Torn Paper Scraps */}
      <motion.div 
        initial={{ rotate: -5, opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="absolute top-1/4 -left-10 w-40 h-20 bg-white/10 backdrop-blur-sm border border-white/20 -rotate-12 skew-x-12"
      />
      <motion.div 
        initial={{ rotate: 8, opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="absolute bottom-1/3 -right-8 w-32 h-32 bg-zinc-900/10 backdrop-blur-sm border border-black/5 rotate-6 skew-y-6"
      />

      {/* Red Circles around "Stop the Scroll" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border-2 border-red-500/20 rounded-full scale-110 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-red-500/10 rounded-full scale-125" />
    </div>
  );
};

// --- Profile Image Component ---
const ProfileImage = () => {
  return (
    <div className="relative w-full h-full">
      <SpectralGlassHover
        rounded="rounded-3xl"
        className="w-full h-full p-2 bg-white/10 dark:bg-black/20"
        containerClassName="w-full h-full"
        blurAmount={30}
        auraScale={1.06}
        tiltIntensity={6}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "anticipate" }}
          className="w-full h-full"
        >
          <motion.img 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            src={zeeshanProfilePic} 
            alt="Zeeshan" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-2xl"
            loading="lazy"
          />
        </motion.div>
      </SpectralGlassHover>
    </div>
  );
};

// --- AI Chat Component ---
const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; isNew?: boolean }[]>(() => {
    const saved = localStorage.getItem('z_score_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    return [
      { role: 'ai', text: "Hi! I'm Zeeshan's AI assistant. How can I help you grow your channel today?" }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('z_score_chat_history', JSON.stringify(messages.slice(-30)));
    } catch (e) {
      console.warn("Failed to save chat history to localStorage", e);
    }
  }, [messages]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggleAIChat', handleToggle);
    return () => window.removeEventListener('toggleAIChat', handleToggle);
  }, []);

  const playVoice = async (text: string) => {
    if (!isVoiceEnabled) return;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets panel.");
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      const base64Audio = part?.inlineData?.data;
      
      if (base64Audio) {
        const binary = atob(base64Audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        
        // Gemini TTS returns raw PCM 16-bit mono at 24kHz
        const pcm16 = new Int16Array(bytes.buffer);
        const float32 = new Float32Array(pcm16.length);
        for (let i = 0; i < pcm16.length; i++) {
          float32[i] = pcm16[i] / 32768.0;
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }
        
        const buffer = audioContext.createBuffer(1, float32.length, 24000);
        buffer.getChannelData(0).set(float32);
        
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        source.start(0);
      } else {
        console.warn("No audio data received from Gemini TTS");
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  const getLocalResponse = (query: string): string | null => {
    const q = query.toLowerCase();
    
    // Pricing
    if (q.includes('price') || q.includes('cost') || q.includes('pricing') || q.includes('how much')) {
      return "Zeeshan offers three main packages: Starter ($12), Pro ($60), and Elite ($120). Each package is designed to maximize your CTR and channel growth!";
    }
    
    // Contact
    if (q.includes('contact') || q.includes('whatsapp') || q.includes('number') || q.includes('reach') || q.includes('call')) {
      return "You can reach Zeeshan directly on WhatsApp at +92 303 5408206. He's usually very responsive to new project inquiries!";
    }
    
    // Experience / Portfolio
    if (q.includes('experience') || q.includes('work') || q.includes('portfolio') || q.includes('who') || q.includes('clients')) {
      return "Zeeshan has over 5 years of experience and has worked with top creators like MrBeast, Azul Welz, and Hustle Ninjas. He has completed over 200 projects with an average CTR of 15%!";
    }
    
    // Services
    if (q.includes('service') || q.includes('thumbnail') || q.includes('design') || q.includes('do')) {
      return "Zeeshan specializes in high-performance YouTube thumbnail designs that use psychological visual hooks to stop the scroll and explode your growth.";
    }
    
    // CTR / Growth
    if (q.includes('ctr') || q.includes('growth') || q.includes('click') || q.includes('views')) {
      return "Zeeshan's designs focus on psychological triggers to boost your CTR. His clients often see a significant jump in views—his average CTR across projects is 15%!";
    }
    
    // Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('salaam') || q.includes('aoa')) {
      return "Hello! I'm Zeeshan's AI assistant. I can tell you about his pricing, portfolio, or how to contact him. What's on your mind?";
    }

    return null;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Try local response first (Offline Mode)
    const localResponse = getLocalResponse(userMessage);
    if (localResponse) {
      // Simulate a small delay for "thinking"
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev.map(m => ({...m, isNew: false})), { role: 'ai', text: localResponse, isNew: true }]);
      setIsLoading(false);
      if (isVoiceEnabled) playVoice(localResponse);
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets panel.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            parts: [
              {
                text: `You are Zeeshan's AI assistant for his portfolio website "Z Score". Zeeshan is a premium YouTube thumbnail designer. 
                Key info about Zeeshan:
                - 5+ years experience.
                - Worked with MrBeast, Azul Welz, Hustle Ninjas.
                - Specializes in psychological design and high CTR.
                - Avg CTR: 10%, 98.98% quality rating, 3.3M+ views.
                - Pricing: Starter ($12), Pro ($60), Elite ($120).
                - Contact: WhatsApp +92 303 5408206.
                Answer the following user question briefly and professionally: ${userMessage}`
              }
            ]
          }
        ],
      });

      const text = response.text || "I'm sorry, I couldn't process that. Please try again or contact Zeeshan directly!";
      setMessages(prev => [...prev.map(m => ({...m, isNew: false})), { role: 'ai', text, isNew: true }]);
      
      if (isVoiceEnabled) {
        playVoice(text);
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg = "I'm having some trouble connecting. You can reach Zeeshan directly via WhatsApp at +92 303 5408206!";
      setMessages(prev => [...prev.map(m => ({...m, isNew: false})), { role: 'ai', text: errorMsg, isNew: true }]);
      if (isVoiceEnabled) {
        playVoice(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 h-[500px] backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-black/80 backdrop-blur-md text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-black/5">
                  <img 
                    src="https://i.ibb.co/HpDY2hQY/dfef.png" 
                    alt="Z Score Logo" 
                    className="w-full h-full object-contain" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div>
                  <div className="text-xs font-bold">Ask Z-Score AI</div>
                  <div className="text-[8px] text-zinc-400 uppercase tracking-widest font-bold">Online</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} 
                  className={`flex items-center gap-1.5 transition-colors ${isVoiceEnabled ? 'text-blue-600' : 'text-zinc-500 hover:text-white'}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">{isVoiceEnabled ? 'Voice On' : 'Voice Off'}</span>
                  {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 bg-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-blue-600/80 backdrop-blur-sm text-white rounded-tr-none shadow-lg' 
                      : 'bg-white/60 backdrop-blur-sm text-zinc-900 border border-white/30 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.role === 'ai' && msg.isNew ? (
                      <TypewriterText text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/30 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20 bg-transparent">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    placeholder={isListening ? "Listening..." : "Ask anything..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className={`w-full bg-white/40 backdrop-blur-sm border rounded-xl px-4 py-3 pr-10 outline-none transition-all text-sm font-medium placeholder:text-zinc-500 ${
                      isListening ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-white/30 focus:border-blue-600/50'
                    }`}
                  />
                  <button 
                    onClick={handleSend}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:scale-110 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <button 
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                    isListening 
                      ? 'bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-600/20' 
                      : 'bg-white/40 backdrop-blur-sm border border-white/30 text-zinc-500 hover:text-blue-600'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <Mic size={20} /> : <Mic size={20} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-black/20 backdrop-blur-md text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-600/40 transition-all group border border-white/20"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} className="group-hover:animate-bounce" />}
      </motion.button>
    </div>
  );
};

// --- Types ---
type SectionId = 'home' | 'about' | 'thumbnails' | 'journey' | 'process' | 'pricing' | 'contact';

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  stats: string;
}

interface JourneyItem {
  year: string;
  title: string;
  desc: string;
  detail: string;
}

interface Review {
  id: number;
  name: string;
  handle: string;
  text: string;
  image: string;
  color: string;
  result: string;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  image?: string;
  createdAt: any;
  likes: number;
}

interface Client {
  id: number;
  name: string;
  handle: string;
  image: string;
  color: string;
}

interface ProcessStep {
  number: number;
  title: string;
  desc: string;
}

interface PricingPlan {
  name: string;
  price: string;
  monthlyPrice: string;
  perks: string;
  features: string[];
  recommended?: boolean;
  popularTag?: string;
}

// --- Data ---
const PROJECTS: Project[] = [
  { id: 1, title: "I Spent 100 Days in a Secret Bunker", category: "Gaming", image: "https://i.ibb.co/5Xd8rDDZ/image.png", stats: "14.2% CTR" },
  { id: 2, title: "The Crypto Crash: Why Everything is Falling", category: "Finance", image: "https://i.ibb.co/V0nZTDcZ/image.png", stats: "12.8% CTR" },
  { id: 3, title: "AI is Replacing Designers (The Truth)", category: "Tech", image: "https://i.ibb.co/rKFrLL2S/image.png", stats: "10.5% CTR" },
  { id: 4, title: "Solo Travel in Japan", category: "Vlog", image: "https://picsum.photos/seed/thumb4/800/450", stats: "42K Views" },
  { id: 5, title: "100 Days of Fitness", category: "Vlog", image: "https://picsum.photos/seed/thumb5/800/450", stats: "2.5% CTR" },
  { id: 6, title: "Ultimate Gaming Setup", category: "Tech", image: "https://picsum.photos/seed/thumb6/800/450", stats: "95K Views" },
];

const JOURNEY: JourneyItem[] = [
  { 
    year: "2023", 
    title: "The Genesis", 
    desc: "Launched Z Score with a singular focus: mastering the psychological triggers that force a click. Started by helping small creators break through the noise in competitive gaming and finance niches.", 
    detail: "Developed the initial 'Pattern Interrupt' framework, focusing on high-contrast lighting and exaggerated visual hierarchy to stop the scroll." 
  },
  { 
    year: "2024", 
    title: "Scaling Impact", 
    desc: "Partnered with mid-tier creators to deliver consistent CTR growth. Achieved my first 100K+ view milestone for a client, proving that data-driven design beats random aesthetics every time.", 
    detail: "Refined the design process to include deep-dive audience research and competitor analysis, ensuring every thumbnail fills a specific 'gap' in the viewer's feed." 
  },
  { 
    year: "2025", 
    title: "Z Score Evolution", 
    desc: "Transitioned from a solo designer to a strategic partner for premium YouTubers. Mastered the art of 'Visual Storytelling' where the thumbnail tells a story before the video even starts.", 
    detail: "Integrated advanced color theory and psychological framing techniques that resulted in a consistent 3%+ CTR increase across diverse niches like Tech and Vlogs." 
  },
  { 
    year: "2026", 
    title: "The Future of Attention", 
    desc: "Integrating AI-driven rendering with human-centric psychological design to stay ahead of the evolving YouTube algorithm. Pushing the boundaries of what a 'Visual Hook' can be.", 
    detail: "Leveraging cutting-edge tools to create hyper-realistic environments while maintaining the emotional core that drives human curiosity and engagement." 
  },
];

const PROCESS: ProcessStep[] = [
  { 
    number: 1, 
    title: "Brief", 
    desc: "You share your script, rough cut, or concept. I dive deep to capture the message and vibe." 
  },
  { 
    number: 2, 
    title: "Research", 
    desc: "I brainstorm 4-7 click-worthy thumbnail ideas using your niche, topic, and audience psychology." 
  },
  { 
    number: 3, 
    title: "Design", 
    desc: "I craft high-quality, scroll-stopping thumbnails, sharing updates so you're never left guessing." 
  },
  { 
    number: 4, 
    title: "Refine", 
    desc: "I polish fast using your feedback aiming for designs you'd double-click yourself. Final files shared." 
  },
  { 
    number: 5, 
    title: "Optimize", 
    desc: "I monitor post-launch, run A/B tests, and tweak thumbnails for best possible results." 
  },
];

const REVIEWS: Review[] = [
  { id: 1, name: "Azul Welz", handle: "357K subscribers", image: "https://i.ibb.co/ddJ5FDm/image.png", color: "text-blue-600", text: "Zeeshan's thumbnails are a game changer. My CTR has never been this high. Absolute professional!", result: "+18.4% CTR" },
  { id: 2, name: "Hustle Ninjas", handle: "301K subscribers", image: "https://i.ibb.co/NdXYBpM4/image.png", color: "text-orange-600", text: "The attention to detail and psychological triggers Zeeshan uses are unmatched. Highly recommended for any serious creator.", result: "400K+ Views" },
  { id: 3, name: "Rob Lipsett", handle: "491K subscribers", image: "https://i.ibb.co/6J4CbdQf/image.png", color: "text-purple-600", text: "Fast, reliable, and incredibly creative. Zeeshan understands the fitness niche perfectly.", result: "Viral Hit" },
  { id: 4, name: "Kristen & Siya", handle: "329K subscribers", image: "https://i.ibb.co/rR6LmpRm/image.png", color: "text-emerald-600", text: "Our travel vlogs finally have the visual hooks they deserve. Zeeshan is a master of his craft.", result: "15% Growth" },
  { id: 5, name: "Enablers", handle: "592K subscribers", image: enablersAvatar, color: "text-blue-700", text: "Zeeshan's ability to simplify complex concepts into a single visual hook is incredible. He's our go-to for high-impact thumbnails.", result: "592K+ Impact" },
  { id: 6, name: "Russian Rock", handle: "690K subscribers", image: russianRockAvatar, color: "text-red-600", text: "The energy and visual storytelling Z Score brings to our rock content is phenomenal. Truly a master of the craft.", result: "690K+ Reach" },
  { id: 7, name: "Row Rhythm", handle: "35K subscribers", image: rowRhythmAvatar, color: "text-zinc-600", text: "Zeeshan's designs perfectly capture the rhythm of our content. A true creative partner!", result: "35K+ Subs" },
  { id: 8, name: "serrahx", handle: "420K subscribers", image: serrahxAvatar, color: "text-indigo-600", text: "Working with Zeeshan took our channel to an entirely new tier. The visual hierarchy consistently lifts our day-one CTR past 17%.", result: "+17.6% CTR" },
  { id: 9, name: "mr jay playz", handle: "840K subscribers", image: mrJayPlayzAvatar, color: "text-cyan-600", text: "Zeeshan delivers pure scroll-stopping gold! In gaming where competition is cutthroat, his 3D lighting and depth separation give us an instant 18%+ CTR edge.", result: "+18.9% CTR" },
  { id: 10, name: "HA PROD", handle: "Creative Agency", image: haProdReviewAvatar, color: "text-pink-600", text: "HA PROD trusts Zeeshan exclusively for our top tier creator rosters—high-volume thumbnails executed at pristine agency standards.", result: "10M+ Network" },
];

const CLIENTS: Client[] = [
  { id: 1, name: "Azul Welz", handle: "357K subscribers", image: "https://i.ibb.co/ddJ5FDm/image.png", color: "text-blue-600" },
  { id: 2, name: "Hustle Ninjas", handle: "301K subscribers", image: "https://i.ibb.co/NdXYBpM4/image.png", color: "text-orange-600" },
  { id: 3, name: "Rob Lipsett", handle: "491K subscribers", image: "https://i.ibb.co/6J4CbdQf/image.png", color: "text-purple-600" },
  { id: 4, name: "Kristen & Siya", handle: "329K subscribers", image: "https://i.ibb.co/rR6LmpRm/image.png", color: "text-emerald-600" },
  { id: 5, name: "Enablers", handle: "592K subscribers", image: enablersAvatar, color: "text-blue-700" },
  { id: 6, name: "Russian Rock", handle: "690K subscribers", image: russianRockAvatar, color: "text-red-600" },
  { id: 7, name: "Row Rhythm", handle: "35K subscribers", image: rowRhythmAvatar, color: "text-zinc-600" },
  { id: 8, name: "serrahx", handle: "420K subscribers", image: serrahxAvatar, color: "text-indigo-600" },
  { id: 9, name: "mr jay playz", handle: "840K subscribers", image: mrJayPlayzAvatar, color: "text-cyan-600" },
  { id: 10, name: "HA PROD", handle: "Creative Agency", image: haProdClientAvatar, color: "text-pink-600" },
];

const PRICING: PricingPlan[] = [
  { 
    name: "Starter", 
    price: "$12", 
    monthlyPrice: "$99",
    perks: "Ideal for individual video drops or testing CTR visual hooks",
    features: [
      "1 Custom High-CTR Thumbnail", 
      "2 Iterative Revisions", 
      "24h Express Delivery", 
      "Layered PSD & Source Assets",
      "Resolution-Independent 4K Output"
    ] 
  },
  { 
    name: "Pro Creator", 
    price: "$60", 
    monthlyPrice: "$399",
    perks: "Most popular for consistent creators uploading weekly",
    features: [
      "5 High-CTR Thumbnails (Pack)", 
      "Unlimited Organic Revisions", 
      "12h Priority Delivery Turnaround", 
      "A/B Testing Hook Variants",
      "Psychological Concept Research", 
      "Direct WhatsApp VIP Channel"
    ], 
    recommended: true,
    popularTag: "MOST POPULAR • TOP CTR"
  },
  { 
    name: "Elite Agency", 
    price: "$120", 
    monthlyPrice: "$790",
    perks: "Full-scale art direction for high-volume channels and media brands",
    features: [
      "10 High-CTR Thumbnails (Pack)", 
      "Dedicated Creative Lead", 
      "Same-Day Fast-Track Delivery", 
      "Channel Visual Audit & Strategy", 
      "Multi-Variant A/B Split Exports", 
      "1-on-1 Monthly Growth Session"
    ] 
  },
];

// --- Components ---

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

const Counter = ({ target, duration = 2, suffix = "", decimals }: CounterProps) => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  const numDecimals = decimals !== undefined 
    ? decimals 
    : (target.toString().split('.')[1]?.length || 0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const totalFrames = duration * 60;
      const increment = end / totalFrames;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end.toFixed(numDecimals));
          clearInterval(timer);
        } else {
          setDisplayValue(start.toFixed(numDecimals));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }
  }, [isInView, target, duration, numDecimals]);

  return <span ref={nodeRef} className="tabular-nums tracking-tight whitespace-nowrap">{displayValue}{suffix}</span>;
};




const Navbar = ({ activeSection }: { activeSection: SectionId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { isAdmin, user } = useAdmin();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed.");
    }
  };

  const navItems: { id: SectionId; label: string; path?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'thumbnails', label: 'Thumbnails', path: '/thumbnails' },
    { id: 'journey', label: 'Journey' },
    { id: 'process', label: 'Process' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (id: string, path?: string) => {
    setIsMenuOpen(false);
    if (path) return;
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 md:py-6 flex justify-between items-center bg-white/95 md:bg-white/80 backdrop-blur-none md:backdrop-blur-xl border-b border-black/5 transform-gpu">
      <Link to="/" className="flex items-center gap-2 cursor-pointer group">
        <SpectralGlassHover
          rounded="rounded-2xl"
          className="px-3 py-1.5 bg-white/40 dark:bg-black/20"
          blurAmount={20}
          auraScale={1.12}
          tiltIntensity={5}
        >
          <img src="https://i.ibb.co/HpDY2hQY/dfef.png" alt="Z Score Logo" className="h-8 w-auto group-hover:scale-105 transition-transform duration-300 object-contain" referrerPolicy="no-referrer" />
        </SpectralGlassHover>
      </Link>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          item.path ? (
            <Link
              key={item.id}
              to={item.path}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-blue-600 relative group ${
                location.pathname === item.path ? 'text-blue-600' : 'text-zinc-400'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-blue-600 transition-all duration-300 ${
                location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ) : (
            <button
              key={item.id}
              onClick={() => {
                if (isHome) {
                  scrollToSection(item.id);
                } else {
                  window.location.href = `/#${item.id}`;
                }
              }}
              className={`text-[10px] font-bold uppercase tracking-widest transition-all hover:text-blue-600 relative group ${
                activeSection === item.id && isHome ? 'text-blue-600' : 'text-zinc-400'
              }`}
            >
              {item.label}
              <span className={`absolute -bottom-1 left-0 h-[1.5px] bg-blue-600 transition-all duration-300 ${
                activeSection === item.id && isHome ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          )
        ))}
      </div>

      <div className="flex items-center gap-4">
        {/* Admin Controls */}
        <div className="hidden sm:flex items-center gap-3 mr-2 border-r border-black/5 pr-4">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdmin && (
                <span className="px-2 py-1 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-widest rounded-md">Admin</span>
              )}
              <button 
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="p-2 text-zinc-400 hover:text-blue-600 transition-colors"
              title="Admin Login"
            >
              <LogIn size={16} />
            </button>
          )}
        </div>

        <a 
          href="https://wa.me/923035408206"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-transparent text-black border border-black/20 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-black hover:text-white transition-all"
        >
          <Phone size={12} />
          Let's Talk
        </a>
        
        {/* Custom High-Aesthetic 3-Line Mobile Menu Toggle */}
        <button 
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          className="md:hidden relative w-11 h-11 rounded-2xl bg-black/[0.04] active:bg-black/10 border border-black/10 flex flex-col items-center justify-center gap-[5px] transition-all duration-300 shadow-sm active:scale-95 group overflow-hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {/* Line 1 - Top Bar */}
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 7, width: 22 } : { rotate: 0, y: 0, width: 22 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="h-[2px] bg-zinc-900 rounded-full origin-center block"
          />
          {/* Line 2 - Dynamic Middle Bar (Signature Studio Accent) */}
          <motion.span
            animate={isMenuOpen ? { opacity: 0, scaleX: 0, width: 0 } : { opacity: 1, scaleX: 1, width: 14 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="h-[2px] bg-blue-600 rounded-full origin-center block self-center"
          />
          {/* Line 3 - Bottom Bar */}
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -7, width: 22 } : { rotate: 0, y: 0, width: 18 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="h-[2px] bg-zinc-900 rounded-full origin-center block"
          />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-black/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            {navItems.map((item) => (
              item.path ? (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl font-display font-bold text-left ${
                    location.pathname === item.path ? 'text-neon-blue' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isHome) {
                      scrollToSection(item.id);
                    } else {
                      window.location.href = `/#${item.id}`;
                    }
                  }}
                  className={`text-xl font-display font-bold text-left ${
                    activeSection === item.id && isHome ? 'text-neon-blue' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
            <a 
              href="https://wa.me/923035408206"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-transparent text-black border border-black/20 font-bold rounded-2xl text-center flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
            >
              <Phone size={18} />
              Start a Project
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ isLoaded, onReplayIntro }: { isLoaded: boolean; onReplayIntro?: () => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 35, 
      filter: "blur(14px)",
      clipPath: "inset(0% 20% 0% 20% round 16px)"
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)",
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  const titleRevealVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.96,
      filter: "blur(16px)",
      clipPath: "inset(0% 25% 0% 25% round 20px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      transition: {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      {/* Background Noise/Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

      {/* Background Glows (Subtle & Light) */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-blue-100/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-100/30 blur-[120px] rounded-full animate-pulse delay-700" />
      
      <motion.div 
        style={{ y: y1, opacity }}
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="text-center z-10"
      >
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Apple Hello Intro Script Ribbon */}
          <motion.button
            type="button"
            onClick={onReplayIntro}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-5 py-2 rounded-full backdrop-blur-xl bg-white/70 hover:bg-white border border-black/10 shadow-sm transition-all mb-4 text-zinc-800 cursor-pointer"
            title="Replay cinematic Apple Hello intro animation"
          >
            <span className="font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-blue-600 leading-none -rotate-2 inline-block drop-shadow-sm group-hover:scale-105 transition-transform">
              hello, creator.
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 group-hover:text-blue-600 flex items-center gap-1.5 border-l border-black/10 pl-3">
              <Sparkles size={12} className="text-blue-500 animate-spin-slow" />
              Intro
            </span>
          </motion.button>

          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-neon-blue text-xs font-bold uppercase tracking-widest border border-neon-blue/20"
          >
            <Sparkles size={14} className="glow-blue" />
            Premium Thumbnail Expert
          </motion.div>
        </div>
        
        <motion.h1 
          variants={titleRevealVariants}
          className="text-7xl md:text-[10rem] font-display font-bold tracking-tighter mb-8 leading-[0.85] text-[#1A1A1A] relative"
        >
          <ScrapbookDecorations />
          STOP THE <br />
          <span className="text-blue-600">SCROLL.</span>
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-4 font-medium leading-relaxed"
        >
          High-fidelity visual hooks engineered for maximum CTR. 
          I turn viewers into subscribers through psychological design.
        </motion.p>
        <motion.p
          variants={itemVariants}
          className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-12"
        >
          Note: Thumbnails thora loading main time lete hain.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link 
            to="/thumbnails"
            className="group px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-500/25"
          >
            Thumbnail Showcase
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/about"
            className="px-8 py-4 bg-transparent text-zinc-900 font-bold rounded-full hover:bg-black/5 transition-all border border-black/15"
          >
            About Zeeshan
          </Link>
          <button
            onClick={() => window.open('/thumbnails', '_blank', 'noopener,noreferrer')}
            className="px-5 py-4 bg-white/80 hover:bg-white text-zinc-700 font-bold rounded-full transition-all border border-black/10 flex items-center gap-2 text-sm shadow-sm"
            title="Open Showcase in a separate window"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">New Window</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Restored Floating Elements */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-1/3 left-[10%] hidden xl:block p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 shadow-sm"
      >
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
            <Briefcase className="text-zinc-900" size={16} />
          </div>
          <div>
            <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Total Views</div>
            <div className="text-lg font-display font-bold">3.3M+</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute top-1/3 right-[10%] hidden xl:block p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-black/5 shadow-sm"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
            <Zap className="text-zinc-900" size={16} />
          </div>
          <div>
            <div className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Avg. CTR</div>
            <div className="text-lg font-display font-bold">10%</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Scroll to explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-blue-600 to-transparent" />
      </motion.div>
    </section>
  );
};
const About = () => (
  <section id="about" className="section-padding px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <h3 className="text-blue-600 font-bold uppercase tracking-widest text-xs">The Designer</h3>
          <h2 className="text-5xl md:text-6xl font-display font-bold leading-tight text-[#1A1A1A]">
            I'm Zeeshan, <br />
            Architect of <span className="text-blue-600">Attention.</span>
          </h2>
        </div>
        
        <div className="space-y-6 text-zinc-500 text-lg leading-relaxed font-medium">
          <p>
            With over 5 years of experience in the creator economy, I've mastered the art of the 
            "Visual Hook." My work isn't just about aesthetics—it's about data-driven 
            psychology that forces a click. I don't just make thumbnails; I build gateways to your content.
          </p>
          <p>
            My philosophy is simple: Every pixel must serve a purpose. Whether it's the subtle glow on a subject's face or the precise placement of a text element, everything is engineered to maximize curiosity and drive the YouTube algorithm in your favor.
          </p>
        </div>

        {/* Stats Box - Apple-inspired Glass Card */}
        <AppleGlassCard 
          className="p-6 md:p-8 overflow-hidden"
          scaleOnHover={1.02}
          liftOnHover={-6}
          tiltIntensity={4}
          glareIntensity={0.45}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-start">
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 truncate">Total Views</span>
              <div className="text-2xl sm:text-3xl font-display font-black text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <Counter target={3.3} suffix="M+" decimals={1} />
              </div>
            </div>
            
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 truncate">Avg CTR</span>
              <div className="text-2xl sm:text-3xl font-display font-black text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <Counter target={10} suffix="%" />
              </div>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 truncate">Quality</span>
              <div className="text-2xl sm:text-3xl font-display font-black text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                <Counter target={98.98} suffix="%" decimals={2} />
              </div>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 truncate">Experience</span>
              <div className="text-2xl sm:text-3xl font-display font-black text-zinc-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                5+ YRS
              </div>
            </div>
          </div>
        </AppleGlassCard>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-black border border-black/20 font-bold rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group"
          >
            View Full Story
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative group h-full flex items-center justify-center"
      >
        <div className="relative w-full max-w-md mx-auto">
          {/* Subtle ambient glass glow behind portrait */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-transparent rounded-[36px] blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />
          
          <AppleGlassCard
            className="p-4 sm:p-5 relative overflow-hidden"
            variant="light"
            scaleOnHover={1.02}
            liftOnHover={-6}
            tiltIntensity={4}
            glareIntensity={0.4}
          >
            {/* Top Minimal Pill Tag */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">
                <Sparkles size={11} className="text-blue-500" />
                Creative Lead & VFX Artist
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Available for projects" />
            </div>

            {/* Clean Profile Display Picture (DP) */}
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-zinc-900 border border-black/5 dark:border-white/10 shadow-lg">
              <img
                src={zeeshanProfilePic}
                alt="Zeeshan - Visual & Thumbnail Designer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Card Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                <h3 className="font-display font-bold text-xl leading-tight">Zeeshan</h3>
                <p className="text-xs text-white/75 font-medium">Architect of Attention • 500M+ Views</p>
              </div>
            </div>
          </AppleGlassCard>
        </div>
      </motion.div>
    </div>
  </section>
);

const WhyMe = () => (
  <AnimatedSection className="section-padding px-6 max-w-7xl mx-auto overflow-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <div className="order-2 lg:order-1 space-y-12">
        <div className="space-y-4">
          <AnimatedText as="h3" className="text-neon-purple font-bold uppercase tracking-widest text-sm">Why Choose Me?</AnimatedText>
          <AnimatedText as="h2" className="text-4xl md:text-5xl font-display font-bold text-[#1d1d1f]">The Science Behind <br /><span className="text-gradient">The Click.</span></AnimatedText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              icon: Target, 
              title: "Psychological Engineering", 
              desc: "I don't just design; I engineer clicks using advanced color theory and visual hierarchy that triggers instant curiosity.",
            },
            { 
              icon: Cpu, 
              title: "Data-Driven Results", 
              desc: "Every pixel is backed by CTR analysis and audience behavior research to ensure your content gets the attention it deserves.",
            },
            { 
              icon: Zap, 
              title: "Viral Consistency", 
              desc: "My designs have helped creators cross the 100K+ view milestone repeatedly by staying ahead of the YouTube algorithm.",
            },
            { 
              icon: Sparkles, 
              title: "Algorithm Mastery", 
              desc: "I specialize in 'Pattern Interrupt' designs that break the viewer's scroll and force them to engage with your video.",
            }
          ].map((item, i) => (
            <GlassCard
              key={i}
              variant="subtle"
              liftOnHover={-6}
              scaleOnHover={1.02}
              tiltIntensity={4}
              glareIntensity={0.35}
              className="p-6 h-full flex flex-col justify-start group"
            >
              <div className="p-3 rounded-xl bg-black/[0.04] dark:bg-white/10 w-fit mb-4 group-hover:scale-110 transition-transform">
                <item.icon size={20} className="text-zinc-900 group-hover:text-blue-600 transition-colors" />
              </div>
              <h4 className="text-lg font-bold text-[#1d1d1f] mb-2">{item.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="order-1 lg:order-2 relative flex justify-center items-center"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-purple-600/5 blur-[100px] rounded-full" />
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 hover:scale-105 transition-transform duration-500">
          <img 
            src={zeeshanProfilePic} 
            alt="Zeeshan Profile" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </motion.div>
    </div>
  </AnimatedSection>
);

const Journey = () => (
  <section id="journey" className="section-padding px-6 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col items-center text-center mb-24 space-y-4">
        <h3 className="text-neon-blue font-bold uppercase tracking-widest text-sm">The Evolution</h3>
        <h2 className="text-5xl md:text-7xl font-display font-black leading-none">
          5 YEARS OF <br /><span className="text-gradient">IMPACT.</span>
        </h2>
      </div>

      <div className="relative">
        {/* Vertical Line with Progress */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-zinc-100 md:-translate-x-1/2 overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-full bg-gradient-to-b from-neon-blue via-neon-purple to-neon-blue"
          />
        </div>

        <div className="space-y-32 relative">
          {JOURNEY.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-20 ${
                i % 2 !== 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={`flex-1 w-full md:w-auto ${i % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div className="space-y-6 group">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    <div className="text-8xl font-display font-black text-black/5 leading-none group-hover:text-neon-blue/10 transition-colors duration-500">
                      {item.year}
                    </div>
                  </motion.div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-display font-bold text-black group-hover:text-neon-blue transition-colors duration-300">{item.title}</h4>
                    <p className="text-zinc-500 leading-relaxed font-light max-w-md mx-auto md:mx-0 text-lg">
                      {item.desc}
                    </p>
                    <div className={`p-6 bg-zinc-50 rounded-2xl border border-black/5 group-hover:border-neon-blue/20 transition-all duration-500 ${i % 2 !== 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      <p className="text-xs text-zinc-400 font-medium italic">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-white border-2 border-neon-blue rounded-full -translate-x-1/2 z-20 shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
              
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const Process = () => <GlassmorphicProcessSection />;

const FAQ_DATA = [
  {
    question: "What is your typical turnaround time?",
    answer: "For a single thumbnail, it's usually 24-48 hours. For bulk orders or case studies, we'll discuss a timeline that fits your upload schedule."
  },
  {
    question: "Do you offer revisions?",
    answer: "Yes! I offer unlimited revisions until you're 100% satisfied with the visual hook. Your success is my priority."
  },
  {
    question: "What niches do you specialize in?",
    answer: "I've worked across Gaming, Finance, Tech, Vlogs, and Education. My 'Pattern Interrupt' strategy works for any niche."
  },
  {
    question: "How do we get started?",
    answer: "Simply click the 'Let's Talk' button to reach out via WhatsApp, or fill out the contact form below. I'll get back to you within 24 hours."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <AnimatedSection id="faq" className="section-padding px-6 max-w-3xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <AnimatedText as="h3" className="text-neon-purple font-bold uppercase tracking-widest text-sm">Common Questions</AnimatedText>
        <AnimatedText as="h2" className="text-4xl md:text-5xl font-display font-bold text-[#1d1d1f]">Frequently Asked</AnimatedText>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5, delay: i * 0.08 }}
            data-cursor="interactive"
            className="backdrop-blur-xl bg-white/75 dark:bg-black/20 border border-white/80 dark:border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1.5px_1px_rgba(255,255,255,0.95)] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.04] transition-colors"
            >
              <span className="font-bold text-[#1d1d1f] pr-4">{item.question}</span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                className="text-blue-600 shrink-0"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 25, mass: 0.5 }}
                  className="px-6 pb-6 text-zinc-600 text-sm leading-relaxed"
                >
                  {item.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
};

const Reviews = () => <GlassmorphicReviewSection />;

const TrustedClients = () => <TrustedCreatorsSection clients={CLIENTS} />;

const Pricing = () => {
  return <ApplePricingSection />;
};

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct WhatsApp message
    const message = `Hello Zeeshan! %0A%0AMy Name: ${formData.name} %0AMy Email: ${formData.email} %0AProject Details: ${formData.details}`;
    const whatsappUrl = `https://wa.me/923035408206?text=${message}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <AnimatedSection id="contact" className="section-padding px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-12">
          <div className="space-y-4">
            <AnimatedText as="h3" className="text-neon-blue font-bold uppercase tracking-widest text-sm">Contact</AnimatedText>
            <AnimatedText as="h2" className="text-5xl md:text-6xl font-display font-bold leading-tight text-[#1d1d1f]">
              Let's Build Your <br />
              Next <span className="text-gradient">Viral Hook.</span>
            </AnimatedText>
            <AnimatedText as="p" className="text-zinc-500 text-lg font-light max-w-md">
              Ready to dominate the algorithm? Fill out the form or reach out directly via WhatsApp.
            </AnimatedText>
          </div>

          <div className="space-y-8">
            <h4 className="text-xl font-bold text-[#1d1d1f]">What happens next?</h4>
            <div className="space-y-6">
              {[
                { step: "01", title: "Initial Consultation", desc: "We'll discuss your channel, niche, and specific goals for your upcoming content." },
                { step: "02", title: "Strategy & Research", desc: "I'll dive into your audience psychology and competitor trends to find the perfect hook." },
                { step: "03", title: "Design & Delivery", desc: "You'll receive high-fidelity thumbnails designed to maximize curiosity and CTR." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="text-2xl font-display font-black text-neon-blue/20 group-hover:text-neon-blue transition-colors duration-500">{item.step}</div>
                  <div className="space-y-1">
                    <div className="font-bold text-[#1d1d1f]">{item.title}</div>
                    <div className="text-sm text-zinc-500 font-normal leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GlassCard
          liftOnHover={-6}
          scaleOnHover={1.01}
          tiltIntensity={3}
          glareIntensity={0.35}
          className="p-8 md:p-12 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 ml-2 font-bold">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/[0.02] border border-black/5 rounded-2xl px-6 py-5 outline-none focus:border-neon-blue transition-all text-zinc-900 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 ml-2 font-bold">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/[0.02] border border-black/5 rounded-2xl px-6 py-5 outline-none focus:border-neon-blue transition-all text-zinc-900 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 ml-2 font-bold">Project Details</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell me about your channel and goals..."
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    className="w-full bg-black/[0.02] border border-black/5 rounded-2xl px-6 py-5 outline-none focus:border-neon-blue transition-all resize-none text-zinc-900 font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-6 bg-transparent text-black border border-black/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/5"
                >
                  Send to WhatsApp
                  <Send size={18} />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-20 h-20 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} className="text-neon-blue glow-blue" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold">Redirecting...</h3>
                  <p className="text-zinc-500">Opening WhatsApp to send your message. I'll see you there!</p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-neon-blue text-sm font-bold uppercase tracking-widest hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      <div className="mt-24 flex flex-wrap justify-center gap-12 border-t border-black/5 pt-12">
        {[
          { icon: Phone, label: "+92 303 5408206", url: "https://wa.me/923035408206" },
          { icon: Instagram, label: "@zscore_pix", url: "https://www.instagram.com/zscore_pix/" },
          { icon: Twitter, label: "@zedscore_pix", url: "https://x.com/zedscore_pix" },
          { icon: Layers, label: "Zscore_pix", url: "https://www.behance.net/Zscore_pix" },
          { icon: Mail, label: "zedscoreteam@gmail.com", url: "mailto:zedscoreteam@gmail.com" },
        ].map((item, i) => (
          <a 
            key={i} 
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-zinc-400 hover:text-black transition-colors cursor-pointer group"
          >
            <item.icon size={18} className="group-hover:text-neon-blue transition-colors" />
            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
          </a>
        ))}
      </div>
    </AnimatedSection>
  );
};

const SocialLive = () => {
  return (
    <AnimatedSection className="section-padding px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="text-red-500 font-bold uppercase tracking-[0.3em] text-[10px]">Live Social Hub</span>
          </div>
          <AnimatedText as="h2" className="text-4xl md:text-5xl font-display font-bold text-[#1d1d1f]">Follow the <span className="text-gradient">Journey.</span></AnimatedText>
        </div>
        <AnimatedText as="p" className="text-zinc-500 text-sm max-w-xs font-normal leading-relaxed">
          Real-time updates, behind-the-scenes, and design tips. Join the community on Instagram, TikTok, Behance and X.
        </AnimatedText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Instagram Stats */}
        <GlassCard
          liftOnHover={-8}
          scaleOnHover={1.02}
          tiltIntensity={4}
          glareIntensity={0.35}
          className="rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-3 shadow-inner border border-black/5 flex items-center justify-center overflow-hidden">
              <img src="https://i.ibb.co/HpDY2hQY/dfef.png" alt="Logo" className="w-16 h-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-black/5">
              <Instagram size={16} className="text-purple-600" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1d1d1f]">zscore_pix</h3>
            <p className="text-zinc-500 text-sm font-medium">Visual/Graphic Designer</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full border-y border-black/5 dark:border-white/10 py-6">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">1.2K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Posts</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">45K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">280</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Following</span>
            </div>
          </div>

          <a 
            href="https://www.instagram.com/zscore_pix/" 
            target="_blank" 
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="w-full py-4 bg-zinc-950 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-black/10 text-xs text-center"
          >
            Follow on Instagram
          </a>
        </GlassCard>

        {/* TikTok Stats */}
        <GlassCard
          liftOnHover={-8}
          scaleOnHover={1.02}
          tiltIntensity={4}
          glareIntensity={0.35}
          className="rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-3 shadow-inner border border-black/5 flex items-center justify-center overflow-hidden">
              <img src="https://i.ibb.co/HpDY2hQY/dfef.png" alt="Logo" className="w-16 h-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-black/5">
              <Video size={16} className="text-black" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1d1d1f]">zscore_pix</h3>
            <p className="text-zinc-500 text-sm font-medium">Content Creator</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full border-y border-black/5 dark:border-white/10 py-6">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">120K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">850K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Likes</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">150</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Following</span>
            </div>
          </div>

          <a 
            href="https://www.tiktok.com/@zscore_pix" 
            target="_blank" 
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="w-full py-4 bg-transparent text-[#1d1d1f] border border-black/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5 text-xs text-center"
          >
            Follow on TikTok
          </a>
        </GlassCard>

        {/* Behance Stats */}
        <GlassCard
          liftOnHover={-8}
          scaleOnHover={1.02}
          tiltIntensity={4}
          glareIntensity={0.35}
          className="rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-[3px] shadow-inner border border-black/5 flex items-center justify-center overflow-hidden">
              <img src={behanceAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-black/5">
              <Palette size={16} className="text-blue-600" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1d1d1f]">ZEFURY</h3>
            <p className="text-zinc-500 text-sm font-medium">Portfolio Artist</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full border-y border-black/5 dark:border-white/10 py-6">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">12K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Appreciations</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">5.2K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">42</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Projects</span>
            </div>
          </div>

          <a 
            href="https://www.behance.net/Zscore_pix" 
            target="_blank" 
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="w-full py-4 bg-transparent text-[#1d1d1f] border border-black/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5 text-xs text-center"
          >
            Follow on Behance
          </a>
        </GlassCard>

        {/* X Stats */}
        <GlassCard
          liftOnHover={-8}
          scaleOnHover={1.02}
          tiltIntensity={4}
          glareIntensity={0.35}
          className="rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-8"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white p-[3px] shadow-inner border border-black/5 flex items-center justify-center overflow-hidden">
              <img src={xAvatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg border border-black/5">
              <Twitter size={16} className="text-black" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#1d1d1f]">zedscore_pix</h3>
            <p className="text-zinc-500 text-sm font-medium">Design Strategist</p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full border-y border-black/5 dark:border-white/10 py-6">
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">8.4K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">1.2K</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Tweets</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#1d1d1f]">450</span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Following</span>
            </div>
          </div>

          <a 
            href="https://x.com/zedscore_pix" 
            target="_blank" 
            rel="noopener noreferrer"
            data-cursor="interactive"
            className="w-full py-4 bg-transparent text-[#1d1d1f] border border-black/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5 text-xs text-center"
          >
            Follow on X
          </a>
        </GlassCard>
      </div>
    </AnimatedSection>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-black/5">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <img src="https://i.ibb.co/HpDY2hQY/dfef.png" alt="Z Score Logo" className="h-9 w-auto object-contain" referrerPolicy="no-referrer" />
      </div>
      
      <p className="text-zinc-500 text-xs uppercase tracking-widest">
        © 2026–2027 Z Score Design. All rights reserved.
      </p>

      <div className="flex gap-6">
        <a href="https://www.tiktok.com/@zscore_pix" target="_blank" rel="noopener noreferrer">
          <Video size={18} className="text-zinc-500 hover:text-neon-blue transition-colors cursor-pointer" />
        </a>
        <a href="https://www.instagram.com/zscore_pix/" target="_blank" rel="noopener noreferrer">
          <Instagram size={18} className="text-zinc-500 hover:text-neon-blue transition-colors cursor-pointer" />
        </a>
        <a href="https://www.behance.net/Zscore_pix" target="_blank" rel="noopener noreferrer">
          <Palette size={18} className="text-zinc-500 hover:text-neon-blue transition-colors cursor-pointer" />
        </a>
        <a href="https://x.com/zedscore_pix" target="_blank" rel="noopener noreferrer">
          <Twitter size={18} className="text-zinc-500 hover:text-neon-blue transition-colors cursor-pointer" />
        </a>
      </div>
    </div>
  </footer>
);

const LOADING_MESSAGES = [
  "Initialising Z-Score Engine...",
  "Analyzing Click Psychology...",
  "Optimizing Visual Hooks...",
  "Calculating Click Probability...",
  "Rendering High-fidelity Assets...",
  "Calibrating Attention Spans...",
  "Finalising Visual Strategy..."
];

const LoadingScreen = ({ onComplete }: { onComplete?: () => void }) => {
  return <AppleHelloIntro onComplete={onComplete} />;
};



export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [introKey, setIntroKey] = useState(1);
  const [initialProgress, setInitialProgress] = useState(0);

  const handleReplayIntro = () => {
    setIntroKey(prev => prev + 1);
    setIsLoading(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setInitialProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 20);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3300);

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as SectionId);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = ['home', 'about', 'journey', 'process', 'comments', 'pricing', 'contact'];
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Helmet>
        <title>Z Score | YouTube Thumbnail Design & Growth Expert</title>
        <meta name="description" content="Z Score helps top creators like MrBeast, Azul Welz, and Hustle Ninjas scale their channels with high-performance thumbnail designs and psychological visual hooks." />
        <meta property="og:title" content="Z Score | YouTube Thumbnail Design & Growth Expert" />
        <meta property="og:description" content="High-performance thumbnail designs and psychological visual hooks for top creators." />
        <meta name="twitter:title" content="Z Score | YouTube Thumbnail Design & Growth Expert" />
        <meta name="twitter:description" content="High-performance thumbnail designs and psychological visual hooks for top creators." />
      </Helmet>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key={`loader-${introKey}`} onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <WaterBackground />
        <div className="bg-white/0 min-h-screen selection:bg-neon-blue/20 selection:text-black scroll-smooth relative">
          <AIChat />
          <InteractiveGlassCursor />
          
          {/* Global Background Elements */}
          <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
          <div className="fixed inset-0 radial-mask bg-white/10 pointer-events-none" />

          <Navbar activeSection={activeSection} />
          
          <main className="relative z-10">
            <GlassmorphicPageTransition>
              <Routes>
                <Route path="/" element={
                  <>
                    <Hero isLoaded={!isLoading} onReplayIntro={handleReplayIntro} />
                    <About />
                    <TrustedClients />
                    <WhyMe />
                    <Journey />
                    <Process />
                    <Reviews />
                    <CommentsSection />
                    <FAQ />
                    <Pricing />
                    <SocialLive />
                    <Contact />
                  </>
                } />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/thumbnails" element={<ThumbnailShowcasePage />} />
                <Route path="/showcase" element={<ThumbnailShowcasePage />} />
                <Route path="/work" element={<Navigate to="/thumbnails" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </GlassmorphicPageTransition>
          </main>

          <Footer />
        </div>
    </BrowserRouter>
  );
}

