import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  MousePointer2, 
  ArrowLeft, 
  ExternalLink, 
  Star, 
  Quote, 
  Loader2, 
  Sparkles, 
  Users, 
  Zap, 
  Trophy, 
  Globe, 
  Gamepad2,
  Monitor,
  PlayCircle,
  Layout,
  ChevronDown,
  ArrowRight,
  Target,
  Leaf,
  Plus,
  Upload,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import regeneratedWorkPic from '../assets/images/regenerated_image_1791687574607.jpg';
import { useAdmin } from '../hooks/useAdmin';
import { ThumbnailGallery } from '../components/ThumbnailGallery';
import { BehindTheScenes } from '../components/BehindTheScenes';
import { PushPin } from '../components/PushPin';
import { Skeleton } from '../components/ui/Skeleton';
import { GlassmorphicReviewSection } from '../components/GlassmorphicReviewSection';
import { TrustedCreatorsSection } from '../components/TrustedCreatorsSection';
import { SpectralGlassHover } from '../components/SpectralGlassHover';
import { 
  db, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  OperationType,
  handleFirestoreError,
  limit,
  getDocsCached
} from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';

const REVIEWS = [
  { id: 1, name: "Azul Welz", handle: "357K subscribers", review: "Zeeshan's thumbnails are a game changer. My CTR has never been this high. Absolute professional!", rating: 5, image: "https://i.ibb.co/ddJ5FDm/image.png", color: "text-blue-600", result: "+18.4% CTR" },
  { id: 2, name: "Hustle Ninjas", handle: "301K subscribers", review: "The attention to detail and psychological triggers Zeeshan uses are unmatched. Highly recommended for any serious creator.", rating: 5, image: "https://i.ibb.co/NdXYBpM4/image.png", color: "text-orange-600", result: "400K+ Views" },
  { id: 3, name: "Rob Lipsett", handle: "491K subscribers", review: "Fast, reliable, and incredibly creative. Zeeshan understands the fitness niche perfectly.", rating: 5, image: "https://i.ibb.co/6J4CbdQf/image.png", color: "text-purple-600", result: "Viral Hit" },
  { id: 4, name: "Kristen & Siya", handle: "329K subscribers", review: "Our travel vlogs finally have the visual hooks they deserve. Zeeshan is a master of his craft.", rating: 5, image: "https://i.ibb.co/rR6LmpRm/image.png", color: "text-emerald-600", result: "15% Growth" },
  { id: 5, name: "Enablers", handle: "592K subscribers", review: "Zeeshan's ability to simplify complex concepts into a single visual hook is incredible. He's our go-to for high-impact thumbnails.", rating: 5, image: "https://image2url.com/r2/default/images/1774670864556-c1f9664f-9c57-4938-9b23-2eaa0371cdf4.png", color: "text-blue-700", result: "592K+ Impact" },
  { id: 6, name: "Russian Rock", handle: "690K subscribers", review: "The energy and visual storytelling Z Score brings to our rock content is phenomenal. Truly a master of the craft.", rating: 5, image: "https://image2url.com/r2/default/images/1774670662268-7fe3deea-41b2-4c6f-af8c-454ec4daffa6.png", color: "text-red-600", result: "690K+ Reach" },
  { id: 7, name: "Row Rhythm", handle: "35K subscribers", review: "Zeeshan's designs perfectly capture the rhythm of our content. A true creative partner!", rating: 5, image: "https://image2url.com/r2/default/images/1774860421994-990bce61-ed25-44f2-9291-004db964e791.png", color: "text-zinc-600", result: "35K+ Subs" },
];

const CLIENTS = [
  { id: 1, name: "Azul Welz", handle: "357K subscribers", image: "https://i.ibb.co/ddJ5FDm/image.png", color: "text-blue-600" },
  { id: 2, name: "Hustle Ninjas", handle: "301K subscribers", image: "https://i.ibb.co/NdXYBpM4/image.png", color: "text-orange-600" },
  { id: 3, name: "Rob Lipsett", handle: "491K subscribers", image: "https://i.ibb.co/6J4CbdQf/image.png", color: "text-purple-600" },
  { id: 4, name: "Kristen & Siya", handle: "329K subscribers", image: "https://i.ibb.co/rR6LmpRm/image.png", color: "text-emerald-600" },
  { id: 5, name: "Enablers", handle: "592K subscribers", image: "https://image2url.com/r2/default/images/1774670864556-c1f9664f-9c57-4938-9b23-2eaa0371cdf4.png", color: "text-blue-700" },
  { id: 6, name: "Russian Rock", handle: "690K subscribers", image: "https://image2url.com/r2/default/images/1774670662268-7fe3deea-41b2-4c6f-af8c-454ec4daffa6.png", color: "text-red-600" },
  { id: 7, name: "Row Rhythm", handle: "35K subscribers", image: "https://image2url.com/r2/default/images/1774860421994-990bce61-ed25-44f2-9291-004db964e791.png", color: "text-zinc-600" },
];

const BackgroundFog = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03),transparent_50%)]" />
    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.03),transparent_50%)]" />
  </div>
);

const compressImage = (base64Str: string, maxWidth = 600, maxHeight = 340, quality = 0.4): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      let currentQuality = quality;
      let result = canvas.toDataURL('image/jpeg', currentQuality);
      
      // Target a smaller size for faster loading (under 80KB)
      while (result.length > 80000 && currentQuality > 0.1) {
        currentQuality -= 0.05;
        result = canvas.toDataURL('image/jpeg', currentQuality);
      }
      
      resolve(result);
    };
  });
};

const Reviews = () => <GlassmorphicReviewSection />;

const TrustedClients = () => <TrustedCreatorsSection clients={CLIENTS} />;

const HeroSection = () => {
  const { isAdmin } = useAdmin();
  const [thumbnails, setThumbnails] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dynamicTexts = [
    "grab attention",
    "stop scrolling",
    "drive clicks",
    "scale channels",
    "tell stories",
    "boost CTR",
    "hook viewers",
    "win the click",
    "explode growth"
  ];

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const HeroSkeleton = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex gap-8">
        {[...Array(5)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-40 md:w-64 aspect-[4/5] rounded-3xl"
            style={{ 
              transform: `translateY(${Math.sin(i) * 20}px) rotate(${i * 5 - 10}deg)`,
              opacity: 0.5 - (i * 0.1)
            }}
          />
        ))}
      </div>
    </div>
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const fetchHeroThumbnails = async () => {
      try {
        setQuotaExceeded(false);
        const q = query(
          collection(db, 'hero_thumbnails'), 
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const data = await getDocsCached(q, 'hero_thumbnails_limit_10');
        setThumbnails(data);
      } catch (error) {
        if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('quota-exceeded') || msg.includes('resource-exhausted') || msg.includes('quota exceeded')) {
            setQuotaExceeded(true);
          }
        }
        handleFirestoreError(error, OperationType.LIST, 'hero_thumbnails');
      } finally {
        setIsInitialLoad(false);
      }
    };
    fetchHeroThumbnails();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const compressed = await compressImage(base64, 1200, 800, 0.7);
        
        // Use an orbital distribution for better balance
        // We'll use a spiral-like distribution for a more organic yet balanced feel
        const count = thumbnails.length;
        const angle = (count * 137.5) * (Math.PI / 180); // Golden angle for even distribution
        const radius = 30 + (Math.sqrt(count) * 8); // Radius grows with count
        const x = Math.cos(angle) * Math.min(radius, 65); // Cap radius at 65%
        const y = Math.sin(angle) * Math.min(radius, 65);

        await addDoc(collection(db, 'hero_thumbnails'), {
          url: compressed,
          rotate: Math.random() * 30 - 15, // More subtle rotation
          x,
          y,
          createdAt: serverTimestamp()
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'hero_thumbnails');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const toastId = toast.loading('Deleting thumbnail...');
    try {
      await deleteDoc(doc(db, 'hero_thumbnails', id));
      toast.success('Thumbnail deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete thumbnail', { id: toastId });
      handleFirestoreError(error, OperationType.DELETE, 'hero_thumbnails');
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-32 pb-20 bg-[#FAF9F6]">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Central Content */}
      <div className="relative z-20 text-center max-w-5xl px-6 flex flex-col items-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-none text-[#1A1A1A]">
            Thumbnails that <br />
            <AnimatePresence mode="wait">
              <motion.span 
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-blue-600 inline-block"
              >
                {dynamicTexts[textIndex]}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
            I don't just design. I reverse-engineer why people click. <br className="hidden md:block" />
            No fluff. No templates. Just ideas that get noticed.
          </p>
          
          <div className="pt-4 flex flex-col items-center gap-4">
            <button className="px-10 py-4 bg-black text-white rounded-full text-sm font-bold flex items-center gap-3 hover:bg-zinc-800 transition-all shadow-xl group">
              Get Started for Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Note: Thumbnails thora loading main time lete hain.
            </p>

            {/* Quota Exceeded Overlay */}
            <AnimatePresence>
              {quotaExceeded && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-amber-800 max-w-2xl mx-auto"
                >
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Sparkles className="text-amber-600" size={24} />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h4 className="font-bold text-lg">Daily Limit Reached</h4>
                    <p className="text-sm opacity-90">
                      Wow, Z-Score is popular today! We've reached our daily free database limit. 
                      Some thumbnails might not load, but you can still browse the rest of the site.
                    </p>
                  </div>
                  <button 
                    onClick={() => setQuotaExceeded(false)}
                    className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded-xl text-sm font-bold transition-colors"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {isAdmin && (
          <div className="mt-12">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-6 py-3 bg-white border border-black/10 text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2 mx-auto shadow-sm"
            >
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Hero Thumbnail
            </button>
          </div>
        )}
      </div>

      {/* Arc Thumbnails - Matching Provided Image Style */}
      <div className="relative w-full max-w-[1400px] h-[400px] md:h-[500px] mt-12">
        <div className="absolute inset-0 flex items-center justify-center">
          {isInitialLoad && <HeroSkeleton />}
          <AnimatePresence>
            {!isInitialLoad && thumbnails.map((thumb, i) => {
              const total = thumbnails.length;
              const angleRange = 120; // Arc spread in degrees
              const startAngle = -angleRange / 2;
              const angle = total > 1 ? startAngle + (i * (angleRange / (total - 1))) : 0;
              const radian = (angle - 90) * (Math.PI / 180);
              const radius = 800; // Large radius for subtle curve
              
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius + radius; // Offset to put center at bottom

              return (
                <motion.div
                  key={thumb.id}
                  initial={{ opacity: 0, y: 100, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    x: x * 0.8, // Scale down X for better fit
                    y: y * 0.15, // Flatten the curve
                    rotate: angle * 0.3, // Subtle tilt based on position
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{
                    position: 'absolute',
                    zIndex: 10 + i,
                  }}
                  className="w-40 md:w-64 group"
                >
                  <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/20 transform transition-all duration-700 hover:scale-110 hover:-translate-y-12 hover:z-50 hover:shadow-[0_40px_80px_rgba(0,0,0,0.25)]">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(thumb.id);
                        }}
                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-[60] shadow-lg hover:bg-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    <div className="aspect-[4/5] bg-zinc-100">
                      <img 
                        src={thumb.url} 
                        alt="Hero Thumbnail" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const HangingSection = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualImage, setManualImage] = useState<string | null>(null);
  const [textIndex, setTextIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const manualFileInputRef = useRef<HTMLInputElement>(null);
  const { isAdmin } = useAdmin();

  const dynamicTexts = [
    "grab attention",
    "stop scrolling",
    "drive clicks",
    "scale channels",
    "win the click",
    "hook viewers"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const HangingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  // Fetch posts from Firestore
  React.useEffect(() => {
    const fetchRandomPosts = async () => {
      try {
        const q = query(
          collection(db, 'random_posts'), 
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const posts = await getDocsCached(q, 'random_posts_limit_10');
        setCards(posts);
      } catch (error) {
        if (error instanceof Error) {
          const msg = error.message.toLowerCase();
          if (msg.includes('quota-exceeded') || msg.includes('resource-exhausted') || msg.includes('quota exceeded')) {
            setQuotaExceeded(true);
          }
        }
        handleFirestoreError(error, OperationType.GET, 'random_posts');
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchRandomPosts();
  }, []);

  const handleDelete = async (id: string) => {
    const toastId = toast.loading('Deleting post...');
    try {
      await deleteDoc(doc(db, 'random_posts', id));
      toast.success('Post deleted', { id: toastId });
    } catch (error) {
      toast.error('Failed to delete post', { id: toastId });
      handleFirestoreError(error, OperationType.DELETE, 'random_posts');
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const originalBase64 = event.target?.result as string;
        const base64Data = await compressImage(originalBase64);
        const base64Content = base64Data.split(',')[1];

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets panel.");
        }
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: "Analyze this image and provide a short, catchy title (1-3 words) and a very brief description (under 10 words) suitable for a polaroid-style card. Return in JSON format with 'title' and 'desc' keys." },
                { inlineData: { data: base64Content, mimeType: file.type } }
              ]
            }
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                desc: { type: Type.STRING }
              },
              required: ["title", "desc"]
            }
          }
        });

        const result = JSON.parse(response.text);
        
        const newCardData = {
          title: result.title,
          desc: result.desc,
          image: base64Data,
          rotate: Math.random() * 20 - 10,
          y: Math.random() * 30,
          createdAt: serverTimestamp()
        };

        try {
          await addDoc(collection(db, 'random_posts'), newCardData);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'random_posts');
        }
        
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("AI Upload Error:", error);
      setIsUploading(false);
    }
  };

  const handleManualImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const compressed = await compressImage(base64);
      setManualImage(compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualDesc || !manualImage || isUploading) return;

    setIsUploading(true);
    try {
      const newCardData = {
        title: manualTitle,
        desc: manualDesc,
        image: manualImage,
        rotate: Math.random() * 20 - 10,
        y: Math.random() * 30,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'random_posts'), newCardData);
      
      setManualTitle('');
      setManualDesc('');
      setManualImage(null);
      setShowManualForm(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'random_posts');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="py-32 px-6 bg-[#F5F5F5] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-black/5 shadow-sm mb-6"
          >
            <Sparkles size={14} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Thumbnail that stop scrolling</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Thumbnail that <br />
            <AnimatePresence mode="wait">
              <motion.span 
                key={textIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-orange-500 inline-block"
              >
                {dynamicTexts[textIndex]}
              </motion.span>
            </AnimatePresence>
          </h2>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm mb-2">A collection of visuals designed to break the pattern and drive engagement.</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8">
            Note: Thumbnails thora loading main time lete hain.
          </p>

          {/* Quota Exceeded Overlay */}
          <AnimatePresence>
            {quotaExceeded && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-amber-800 max-w-2xl mx-auto"
              >
                <div className="p-3 bg-amber-100 rounded-full">
                  <Sparkles className="text-amber-600" size={24} />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h4 className="font-bold text-lg">Daily Limit Reached</h4>
                  <p className="text-sm opacity-90">
                    Wow, Z-Score is popular today! We've reached our daily free database limit. 
                    Some thumbnails might not load, but you can still browse the rest of the site.
                  </p>
                </div>
                <button 
                  onClick={() => setQuotaExceeded(false)}
                  className="px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded-xl text-sm font-bold transition-colors"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isAdmin && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="group flex items-center gap-2 px-6 py-3 bg-white border border-black/10 rounded-full hover:bg-black hover:text-white transition-all shadow-sm disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Zap size={16} />
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {isUploading ? 'AI Analyzing...' : 'AI Upload'}
                  </span>
                </button>

                <button 
                  onClick={() => setShowManualForm(!showManualForm)}
                  className={`group flex items-center gap-2 px-6 py-3 border rounded-full transition-all shadow-sm ${showManualForm ? 'bg-black text-white border-black' : 'bg-white border-black/10 hover:bg-zinc-50'}`}
                >
                  <Plus size={16} className={showManualForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
                  <span className="text-xs font-bold uppercase tracking-widest">Manual Add</span>
                </button>
              </div>

              <AnimatePresence>
                {showManualForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full max-w-md overflow-hidden"
                  >
                    <form onSubmit={handleManualSubmit} className="bg-white p-6 rounded-3xl border border-black/5 shadow-xl mt-6 space-y-4">
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-4">Title</label>
                        <input
                          type="text"
                          value={manualTitle}
                          onChange={(e) => setManualTitle(e.target.value)}
                          placeholder="Short catchy title"
                          className="w-full bg-zinc-50 border border-black/5 rounded-2xl py-3 px-5 focus:outline-none focus:border-black/20 transition-all text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-4">Description</label>
                        <input
                          type="text"
                          value={manualDesc}
                          onChange={(e) => setManualDesc(e.target.value)}
                          placeholder="Brief description"
                          className="w-full bg-zinc-50 border border-black/5 rounded-2xl py-3 px-5 focus:outline-none focus:border-black/20 transition-all text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-4">Image</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="file" 
                            ref={manualFileInputRef} 
                            onChange={handleManualImageSelect} 
                            accept="image/*" 
                            className="hidden" 
                          />
                          <button 
                            type="button"
                            onClick={() => manualFileInputRef.current?.click()}
                            className="flex-grow flex items-center justify-center gap-2 py-3 px-5 bg-zinc-50 border border-dashed border-black/10 rounded-2xl hover:bg-zinc-100 transition-all"
                          >
                            {manualImage ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-500" />
                                <span className="text-xs font-medium">Image Selected</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Upload size={14} className="text-zinc-400" />
                                <span className="text-xs font-medium text-zinc-400">Select Image</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                      <button 
                        type="submit"
                        disabled={!manualTitle || !manualDesc || !manualImage || isUploading}
                        className="w-full py-3 bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Post to Workspace'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="relative mt-12">
          {isInitialLoad ? (
            <div className="flex justify-center">
              <HangingSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <AnimatePresence>
                {cards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative"
                  >
                    {/* Technical/Brutalist Card Style */}
                    <div className="relative bg-white border border-black/10 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(card.id);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 shadow-lg hover:bg-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      
                      <div className="aspect-[4/5] overflow-hidden bg-zinc-50 relative">
                        <img 
                          src={card.image} 
                          alt={card.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                        
                        {/* Monospace Label */}
                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black text-white text-[8px] font-mono uppercase tracking-tighter rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ID: {card.id.slice(0, 8)}
                        </div>
                      </div>

                      <div className="p-5 border-t border-black/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">Showcase // 0{i + 1}</span>
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                        </div>
                        <h3 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-orange-500 transition-colors">{card.title}</h3>
                        <p className="text-[10px] text-zinc-500 font-medium leading-relaxed line-clamp-2">{card.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const WorkPage = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#F2F2F2] text-[#1A1A1A] selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden"
    >
      <Helmet>
        <title>Work | Z Score - Premium Portfolio</title>
      </Helmet>

      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50 bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />

      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-xl border-b border-black/5">
        <Link to="/" className="group flex items-center gap-3 text-zinc-500 hover:text-black transition-all">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-[10px]">Back to Home</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Visual/Graphic Designer</span>
          <SpectralGlassHover rounded="rounded-xl" className="px-2 py-1 bg-white/40" blurAmount={18} auraScale={1.12} tiltIntensity={4}>
            <img src="https://i.ibb.co/QjQxzsHp/Z-SCORE-LOGO.png" alt="Z Score Logo" className="h-6 w-auto brightness-0" referrerPolicy="no-referrer" />
          </SpectralGlassHover>
        </div>
      </nav>

      <motion.div variants={sectionVariants}>
        <HeroSection />
      </motion.div>

      <main className="pb-20 px-6 max-w-6xl mx-auto relative z-10">
        {/* Bento Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* About Card */}
          <motion.div 
            variants={sectionVariants}
            className="md:col-span-4 p-8 rounded-[2.5rem] bg-white shadow-sm border border-black/5 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center mb-6 border border-black/5">
                <Target className="text-zinc-900" size={20} />
              </div>
              <h2 className="text-2xl font-bold mb-4">About User</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                A graphic designer hailing from Pakistan with <span className="font-bold text-black">+4 years of experience</span> in the field. My talents encompass crafting editorial designs, creating visuals for live streaming and social media, expertly editing visual content, and analyzing social media insights.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Critical Thinking', 'Attention to Detail', 'Organized'].map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div 
            variants={sectionVariants}
            className="md:col-span-5 relative rounded-[2.5rem] bg-zinc-200 overflow-hidden min-h-[400px] group"
          >
            <img 
              src={regeneratedWorkPic} 
              alt="Profile" 
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h1 className="text-4xl font-bold leading-tight">Zeeshan <br />Ali</h1>
              <p className="text-white/70 text-sm mt-2">Thumbnail Architect & Visual Strategist</p>
            </div>
          </motion.div>

          {/* Stats Card */}
          <motion.div 
            variants={sectionVariants}
            className="md:col-span-3 p-8 rounded-[2.5rem] bg-white shadow-sm border border-black/5 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364}
                  strokeDashoffset={364 * 0.15}
                  className="text-blue-600"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">17</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">Years Old</span>
              </div>
            </div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Experience Level</p>
          </motion.div>
        </div>

        {/* Bento Middle Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Education & Skills */}
          <motion.div 
            variants={sectionVariants}
            className="md:col-span-8 p-10 rounded-[2.5rem] bg-white shadow-sm border border-black/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-blue-600 font-bold text-2xl mb-8 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  Education
                </h3>
                <div className="space-y-8">
                  {[
                    { year: "2018-2021", title: "Visual Arts Foundation", loc: "Lahore, Pakistan" },
                    { year: "2021-2024", title: "Digital Media Design", loc: "Remote Academy" }
                  ].map((edu, i) => (
                    <div key={i} className="flex gap-6">
                      <span className="text-xs font-bold text-zinc-400 mt-1">{edu.year}</span>
                      <div>
                        <h4 className="font-bold text-sm">{edu.title}</h4>
                        <p className="text-xs text-zinc-500 mt-1">{edu.loc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-purple-600 font-bold text-2xl mb-8 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  Software Skills
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Ps" },
                    { name: "Ai" },
                    { name: "Pr" },
                    { name: "Ae" },
                    { name: "Fi" },
                    { name: "Xd" },
                    { name: "Id" },
                    { name: "Cp" },
                  ].map((skill, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-zinc-50 text-zinc-900 flex items-center justify-center font-bold text-sm border border-black/5 hover:border-black/20 transition-all cursor-default">
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Card */}
          <motion.div 
            variants={sectionVariants}
            className="md:col-span-4 p-8 rounded-[2.5rem] bg-white shadow-sm border border-black/5 flex flex-col justify-between"
          >
            <h3 className="text-zinc-900 font-bold text-2xl mb-8 flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-900 rounded-full" />
              Contact
            </h3>
            <div className="space-y-3">
              <a href="mailto:infozedscoreteam@gmail.com" className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 transition-colors group border border-black/5">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-black/5 group-hover:scale-105 transition-transform">
                  <Globe size={14} className="text-zinc-900" />
                </div>
                <span className="text-xs font-bold truncate">infozedscoreteam@gmail.com</span>
              </a>
              <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl border border-black/5">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm border border-black/5">
                  <Users size={14} className="text-zinc-900" />
                </div>
                <span className="text-xs font-bold">zscore_pix</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-black text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group">
              Let's Talk
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Live Thumbnails Section */}
        <motion.div variants={sectionVariants}>
          <ThumbnailGallery />
        </motion.div>

        {/* Behind The Scenes Section */}
        <motion.div variants={sectionVariants}>
          <BehindTheScenes />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Reviews />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <TrustedClients />
        </motion.div>
        <motion.div variants={sectionVariants}>
          <HangingSection />
        </motion.div>

        {/* Behance Redirect Card */}
        <motion.div 
          variants={sectionVariants}
          className="mt-24 p-12 rounded-[3rem] bg-white border border-black/5 text-center relative overflow-hidden group shadow-sm"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000 text-blue-600">
            <ExternalLink size={200} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[#1A1A1A]">Full Portfolio</h2>
          <p className="text-zinc-500 text-lg mb-10 max-w-xl mx-auto font-medium">
            Explore 200+ thumbnails and psychological case studies hosted exclusively on Behance.
          </p>
          <a 
            href="https://www.behance.net/gallery/242444841/Thumbnail-portfolio-2026-ZefuryZ-score"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-bold uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl"
          >
            Explore on Behance
            <ExternalLink size={18} />
          </a>
        </motion.div>
      </main>

      <footer className="py-12 px-6 text-center">
        <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-bold">
          © 2026–2027 Z Score Design. All rights reserved.
        </p>
      </footer>
    </motion.div>
  );
};

export default WorkPage;
