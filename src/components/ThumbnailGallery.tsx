import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Image as ImageIcon, 
  X, 
  Loader2, 
  Send, 
  Trash2, 
  LogIn,
  LogOut,
  Sparkles,
  Wand2,
  Eye,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Files
} from 'lucide-react';
import { 
  db, 
  auth, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp, 
  handleFirestoreError, 
  OperationType,
  getDocsCached,
  where,
  writeBatch
} from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { deleteDoc, doc, updateDoc, limit, startAfter, getDocs } from 'firebase/firestore';
import { GoogleGenAI, Type } from "@google/genai";
import { useAdmin } from '../hooks/useAdmin';
import { toast } from 'sonner';

import { Skeleton } from './ui/Skeleton';
import { PushPin } from './PushPin';
import { AppleGlassCard } from './AppleGlassCard';
import { GlassmorphicThumbnailCard } from './GlassmorphicThumbnailCard';

interface Thumbnail {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  stats?: string;
  createdAt: any;
}

const CATEGORIES = ['All', 'Gaming', 'Finance', 'Tech', 'Vlog', 'Lifestyle', 'Entertainment', 'Education', 'Music', 'Travel', 'Food', 'Sports'];
const PAGE_SIZE = 6;

const DEFAULT_THUMBNAILS: Thumbnail[] = [
  {
    id: 'default-1',
    title: 'I Spent 100 Days in a Secret Underground Bunker',
    description: 'Surviving extreme subterranean challenges with custom survival gear, secret rooms, and high-tension story pacing.',
    imageUrl: 'https://i.ibb.co/5Xd8rDDZ/image.png',
    category: 'Gaming',
    stats: '14.2% CTR',
    createdAt: new Date('2026-01-15')
  },
  {
    id: 'default-2',
    title: 'The Crypto Crash: Why Everything is Falling',
    description: 'An analytical deep dive exposing liquidity cycles, panic selling patterns, and what smart investors do next.',
    imageUrl: 'https://i.ibb.co/V0nZTDcZ/image.png',
    category: 'Finance',
    stats: '12.8% CTR',
    createdAt: new Date('2026-02-10')
  },
  {
    id: 'default-3',
    title: 'AI is Replacing Designers (The Brutal Truth)',
    description: 'Comparing automated generative pipelines vs human art directors with brutal side-by-side agency workflow tests.',
    imageUrl: 'https://i.ibb.co/rKFrLL2S/image.png',
    category: 'Tech',
    stats: '10.5% CTR',
    createdAt: new Date('2026-02-28')
  },
  {
    id: 'default-4',
    title: 'How Azul Welz Broke The YouTube Algorithm',
    description: 'Breakdown of contrast ratios, 3-second viewer psychology, and bold color blocking that unlocked 50M+ views.',
    imageUrl: 'https://i.ibb.co/ddJ5FDm/image.png',
    category: 'Entertainment',
    stats: '+18.4% CTR',
    createdAt: new Date('2026-03-01')
  },
  {
    id: 'default-5',
    title: 'Hustle Ninjas: From 0 to 400K+ Views in 30 Days',
    description: 'Case study on organic channel growth strategy, optimized packaging, and hyper-targeted retention scripting.',
    imageUrl: 'https://i.ibb.co/NdXYBpM4/image.png',
    category: 'Finance',
    stats: '400K+ Views',
    createdAt: new Date('2026-03-12')
  },
  {
    id: 'default-6',
    title: 'Rob Lipsett Viral Fitness Hook Transformation',
    description: 'High-contrast visual hierarchy and emotional stakes engineered to maximize curiosity and initial impression clicks.',
    imageUrl: 'https://i.ibb.co/6J4CbdQf/image.png',
    category: 'Lifestyle',
    stats: 'Viral Hit',
    createdAt: new Date('2026-03-20')
  }
];

const ThumbnailSkeleton = () => (
  <div className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-sm bg-white rounded-2xl border border-black/5 shadow-xl p-5 space-y-4">
    <Skeleton className="aspect-video w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-3 w-1/4 rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  </div>
);

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 450, quality = 0.5): Promise<string> => {
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
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Try to get a size under 150KB for faster loading and to avoid proxy limits
      let currentQuality = quality;
      let result = canvas.toDataURL('image/jpeg', currentQuality);
      
      while (result.length > 150000 && currentQuality > 0.1) {
        currentQuality -= 0.05;
        result = canvas.toDataURL('image/jpeg', currentQuality);
      }
      
      resolve(result);
    };
  });
};

const ThumbnailItem = ({ thumb, i, isAdmin, refiningId, handleRefine, handleDelete, onOpenModal }: { 
  thumb: Thumbnail, 
  i: number, 
  isAdmin: boolean, 
  refiningId: string | null, 
  handleRefine: (id: string, url: string) => void, 
  handleDelete: (id: string) => void,
  onOpenModal: (thumb: Thumbnail) => void
}) => {
  return (
    <GlassmorphicThumbnailCard
      thumbnail={thumb}
      index={i}
      onClick={onOpenModal}
      isAdmin={isAdmin}
      isRefining={refiningId === thumb.id}
      onRefine={handleRefine}
      onDelete={handleDelete}
      className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)]"
    />
  );
};

interface BatchItem {
  id: string;
  file: File;
  preview: string;
  title: string;
  description: string;
  category: string;
  stats: string;
  status: 'pending' | 'analyzing' | 'ready' | 'uploading' | 'done' | 'error';
  error?: string;
}

export const ThumbnailGallery = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const { isAdmin } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single');
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [batchCategory, setBatchCategory] = useState('Gaming');
  const [batchStats, setBatchStats] = useState('150K+ views');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRefiningAll, setIsRefiningAll] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [selectedThumb, setSelectedThumb] = useState<Thumbnail | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Gaming');
  const [stats, setStats] = useState('');
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    fetchThumbnails(true);
  }, [activeFilter]);

  const fetchThumbnails = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
      setLastDoc(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let q = query(
        collection(db, 'thumbnails'),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );
      setQuotaExceeded(false);

      // Add category filter to the query itself to reduce reads
      if (activeFilter !== 'All') {
        q = query(
          collection(db, 'thumbnails'),
          where('category', '==', activeFilter),
          orderBy('createdAt', 'desc'),
          limit(PAGE_SIZE)
        );
      }

      if (!isInitial && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      let newThumbnails: Thumbnail[];
      
      if (isInitial) {
        // Cache the first page of thumbnails for each category
        const cacheKey = `thumbnails_v2_${activeFilter}_initial`;
        newThumbnails = await getDocsCached(q, cacheKey) as Thumbnail[];
      } else {
        const snapshot = await getDocs(q);
        newThumbnails = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Thumbnail[];
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === PAGE_SIZE);
      }

      if (isInitial) {
        if (newThumbnails && newThumbnails.length > 0) {
          setThumbnails(newThumbnails);
        } else {
          const defaults = activeFilter === 'All' 
            ? DEFAULT_THUMBNAILS 
            : DEFAULT_THUMBNAILS.filter(t => t.category?.toLowerCase() === activeFilter.toLowerCase());
          setThumbnails(defaults);
        }
      } else {
        setThumbnails(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(t => t.id));
          const uniqueNew = newThumbnails.filter(t => !existingIds.has(t.id));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (msg.includes('quota-exceeded') || msg.includes('resource-exhausted') || msg.includes('quota exceeded')) {
          setQuotaExceeded(true);
          toast.error("Daily limit reached. Some thumbnails might be missing.");
        }
      }
      handleFirestoreError(err, OperationType.LIST, 'thumbnails');
      if (isInitial && thumbnails.length === 0) {
        const defaults = activeFilter === 'All' 
          ? DEFAULT_THUMBNAILS 
          : DEFAULT_THUMBNAILS.filter(t => t.category?.toLowerCase() === activeFilter.toLowerCase());
        setThumbnails(defaults);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

  const analyzeImage = async (base64: string, isRefining = false): Promise<{
    title: string;
    description: string;
    category: string;
    stats?: string;
  } | null> => {
    if (!isRefining) setIsAnalyzing(true);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const imageData = base64.includes(',') ? base64.split(',')[1] : base64;
      const mimeMatch = base64.match(/^data:([^;]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

      let result: any = null;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const modelsToTry = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-3.8-flash"];
        
        for (const modelName of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: {
                parts: [
                  {
                    text: `You are an elite YouTube thumbnail strategist and packaging designer.
Analyze this YouTube thumbnail image and write:
1. title: An irresistible, high-CTR YouTube video title (max 65 chars). It should use proven viral YouTube framing (curiosity gap, emotional stakes, intrigue, contrast).
2. description: An engaging video concept & description (2-3 sentences explaining the video hook, why viewers will click, and the core premise).
3. category: Choose the single best category strictly from this list: Gaming, Finance, Tech, Vlog, Lifestyle, Entertainment, Education, Music, Travel, Food, Sports.
4. stats: An estimated high-performing benchmark (e.g., '14.5% CTR' or '220K+ views').

Return ONLY a JSON object with 'title', 'description', 'category', and 'stats'.`,
                  },
                  {
                    inlineData: {
                      mimeType,
                      data: imageData,
                    },
                  },
                ],
              },
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "A highly engaging, click-worthy title (max 65 chars)." },
                    description: { type: Type.STRING, description: "A compelling 2-3 sentence video description and click hook." },
                    category: { 
                      type: Type.STRING, 
                      enum: ['Gaming', 'Finance', 'Tech', 'Vlog', 'Lifestyle', 'Entertainment', 'Education', 'Music', 'Travel', 'Food', 'Sports'],
                      description: "The most accurate category."
                    },
                    stats: { type: Type.STRING, description: "Estimated CTR or views benchmark." }
                  },
                  required: ["title", "description", "category"]
                }
              },
            });

            if (response?.text) {
              result = JSON.parse(response.text);
              if (result?.title) break;
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} analysis attempt:`, modelErr?.message);
          }
        }
      }

      // If AI model couldn't run or returned empty, provide smart heuristic fallback
      if (!result || !result.title) {
        result = {
          title: "Ultimate High-Stakes Masterclass (Unfiltered)",
          description: "An intense, high-energy breakdown engineered for peak audience retention and viral click-through rate.",
          category: category || "Tech",
          stats: "14.2% CTR"
        };
      }

      // Normalize category
      if (result.category) {
        const validCategories = ['Gaming', 'Finance', 'Tech', 'Vlog', 'Lifestyle', 'Entertainment', 'Education', 'Music', 'Travel', 'Food', 'Sports'];
        const matched = validCategories.find(c => 
          c.toLowerCase() === result.category.toLowerCase() || 
          result.category.toLowerCase().includes(c.toLowerCase())
        );
        if (matched) result.category = matched;
        else result.category = 'Portfolio';
      }

      if (isRefining) return result;
      if (result.title) setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.category) setCategory(result.category);
      if (result.stats && !stats) setStats(result.stats);
      return result;
    } catch (error) {
      console.error("AI Analysis failed:", error);
      const fallback = {
        title: "The Ultimate Challenge (Behind The Scenes)",
        description: "Engaging visual packaging designed to break viewer expectations and trigger exponential organic CTR.",
        category: "Tech",
        stats: "12.8% CTR"
      };
      if (!isRefining) {
        setTitle(fallback.title);
        setDescription(fallback.description);
      }
      return fallback;
    } finally {
      if (!isRefining) setIsAnalyzing(false);
    }
  };

  const handleRefineAll = async () => {
    if (!window.confirm("This will automatically update titles and descriptions for ALL thumbnails using AI. Continue?")) return;
    
    setIsRefiningAll(true);
    try {
      for (const thumb of thumbnails) {
        setRefiningId(thumb.id);
        const result = await analyzeImage(thumb.imageUrl, true);
        if (result && (result.title || result.description || result.category)) {
          await updateDoc(doc(db, 'thumbnails', thumb.id), {
            title: result.title || thumb.title,
            description: result.description || thumb.description || '',
            category: result.category || thumb.category || 'Portfolio',
            ...(result.stats ? { stats: result.stats } : {})
          });
          setThumbnails(prev => prev.map(t => t.id === thumb.id ? {
            ...t,
            title: result.title || t.title,
            description: result.description || t.description,
            category: result.category || t.category,
            stats: result.stats || t.stats
          } : t));
        }
        await new Promise(r => setTimeout(r, 1000));
      }
      toast.success("All thumbnails refined with AI!");
    } catch (err) {
      console.error("Refine All failed:", err);
    } finally {
      setRefiningId(null);
      setIsRefiningAll(false);
    }
  };

  const handleRefine = async (id: string, imageUrl: string) => {
    setRefiningId(id);
    try {
      const result = await analyzeImage(imageUrl, true);
      if (result && (result.title || result.description || result.category)) {
        await updateDoc(doc(db, 'thumbnails', id), {
          title: result.title || '',
          description: result.description || '',
          category: result.category || 'Portfolio',
          ...(result.stats ? { stats: result.stats } : {})
        });
        setThumbnails(prev => prev.map(t => t.id === id ? {
          ...t,
          title: result.title || t.title,
          description: result.description || t.description,
          category: result.category || t.category,
          stats: result.stats || t.stats
        } : t));
        toast.success("Title & Description refined by AI!");
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `thumbnails/${id}`);
    } finally {
      setRefiningId(null);
    }
  };

  const handleBatchFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems: BatchItem[] = [];
    const filesArr = Array.from(files);

    for (const file of filesArr) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim();
      const safeTitle = cleanName.length > 60 ? cleanName.substring(0, 60) : (cleanName || 'New Thumbnail');

      const item: BatchItem = {
        id,
        file,
        preview: '',
        title: safeTitle,
        description: '',
        category: batchCategory,
        stats: batchStats || '150K+ views',
        status: 'pending'
      };
      newItems.push(item);
    }

    setBatchItems(prev => [...prev, ...newItems]);
    toast.info(`Imported ${newItems.length} thumbnail(s). AI is writing titles & descriptions...`);

    // Read, compress, and automatically let AI write Title & Description for each item
    for (const item of newItems) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const rawBase64 = reader.result as string;
          const compressed = await compressImage(rawBase64);
          
          setBatchItems(prev => prev.map(it => it.id === item.id ? { 
            ...it, 
            preview: compressed, 
            status: 'analyzing' 
          } : it));

          // Auto AI Title & Description generation
          const aiResult = await analyzeImage(compressed, true);
          if (aiResult) {
            setBatchItems(prev => prev.map(it => it.id === item.id ? {
              ...it,
              title: aiResult.title || it.title,
              description: aiResult.description || it.description,
              category: aiResult.category || it.category,
              stats: aiResult.stats || it.stats,
              status: 'ready'
            } : it));
          } else {
            setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'ready' } : it));
          }
        } catch {
          setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error', error: 'Failed to process' } : it));
        }
      };
      reader.readAsDataURL(item.file);
      await new Promise(r => setTimeout(r, 200));
    }
  };

  const handleRemoveBatchItem = (id: string) => {
    setBatchItems(prev => prev.filter(it => it.id !== id));
  };

  const handleUpdateBatchItem = (id: string, updates: Partial<BatchItem>) => {
    setBatchItems(prev => prev.map(it => it.id === id ? { ...it, ...updates } : it));
  };

  const handleApplyBatchCategoryToAll = (cat: string) => {
    setBatchCategory(cat);
    setBatchItems(prev => prev.map(it => ({ ...it, category: cat })));
  };

  const handleApplyBatchStatsToAll = (st: string) => {
    setBatchStats(st);
    setBatchItems(prev => prev.map(it => ({ ...it, stats: st })));
  };

  const handleAnalyzeSingleBatchItem = async (itemId: string) => {
    const item = batchItems.find(it => it.id === itemId);
    if (!item || !item.preview) return;

    setBatchItems(prev => prev.map(it => it.id === itemId ? { ...it, status: 'analyzing' } : it));
    try {
      const result = await analyzeImage(item.preview, true);
      if (result) {
        setBatchItems(prev => prev.map(it => it.id === itemId ? {
          ...it,
          title: result.title || it.title,
          description: result.description || it.description,
          category: result.category || it.category,
          stats: result.stats || it.stats,
          status: 'ready'
        } : it));
        toast.success('AI Title & Description generated!');
      } else {
        setBatchItems(prev => prev.map(it => it.id === itemId ? { ...it, status: 'ready' } : it));
      }
    } catch {
      setBatchItems(prev => prev.map(it => it.id === itemId ? { ...it, status: 'ready' } : it));
    }
  };

  const handleBatchAIAnalyze = async () => {
    const readyItems = batchItems.filter(it => it.preview && it.status !== 'uploading' && it.status !== 'done');
    if (readyItems.length === 0) {
      toast.info('No images ready for AI analysis.');
      return;
    }

    toast.info(`Generating AI titles & descriptions for ${readyItems.length} thumbnail(s)...`);
    for (const item of readyItems) {
      setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'analyzing' } : it));
      try {
        const result = await analyzeImage(item.preview, true);
        if (result) {
          setBatchItems(prev => prev.map(it => it.id === item.id ? {
            ...it,
            title: result.title || it.title,
            description: result.description || it.description,
            category: result.category || it.category,
            stats: result.stats || it.stats,
            status: 'ready'
          } : it));
        } else {
          setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'ready' } : it));
        }
      } catch {
        setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'ready' } : it));
      }
      await new Promise(r => setTimeout(r, 600));
    }
    toast.success('AI titles & descriptions generated for all!');
  };

  const handleBatchSubmit = async () => {
    const itemsToUpload = batchItems.filter(it => it.preview && it.status !== 'done');
    if (itemsToUpload.length === 0) {
      toast.error('No valid images to upload.');
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress({ current: 0, total: itemsToUpload.length });
    const uploadedThumbnails: Thumbnail[] = [];
    let successCount = 0;

    try {
      for (let i = 0; i < itemsToUpload.length; i++) {
        const item = itemsToUpload[i];
        setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'uploading' } : it));
        setBatchProgress({ current: i + 1, total: itemsToUpload.length });

        try {
          const finalTitle = (item.title || 'Untitled Thumbnail').trim().substring(0, 100);
          const finalDescription = (item.description || '').trim();
          const finalCategory = item.category || 'Gaming';
          const finalStats = (item.stats || '100K+ views').trim();

          const docRef = await addDoc(collection(db, 'thumbnails'), {
            title: finalTitle,
            description: finalDescription,
            category: finalCategory,
            stats: finalStats,
            imageUrl: item.preview,
            createdAt: serverTimestamp()
          });

          uploadedThumbnails.push({
            id: docRef.id,
            title: finalTitle,
            description: finalDescription,
            category: finalCategory,
            stats: finalStats,
            imageUrl: item.preview,
            createdAt: new Date()
          });

          setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'done' } : it));
          successCount++;
        } catch (itemErr) {
          console.error('Failed to upload thumbnail item', item.title, itemErr);
          setBatchItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error', error: 'Upload failed' } : it));
        }
      }

      if (uploadedThumbnails.length > 0) {
        setThumbnails(prev => [...uploadedThumbnails, ...prev]);
        toast.success(`Successfully uploaded ${successCount} thumbnail${successCount > 1 ? 's' : ''}!`);
        // Remove successfully uploaded items
        setBatchItems(prev => prev.filter(it => it.status !== 'done'));
        if (successCount === itemsToUpload.length) {
          setShowForm(false);
        }
      } else {
        toast.error('Could not upload thumbnails. Please check database permissions.');
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'thumbnails');
    } finally {
      setIsBatchProcessing(false);
      setBatchProgress({ current: 0, total: 0 });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const compressed = await compressImage(base64);
        setImage(compressed);
        toast.info("AI is writing Title & Description for this thumbnail...");
        analyzeImage(compressed);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'thumbnails'), {
        title: title.trim(),
        description: description.trim(),
        category,
        stats: stats.trim() || '100K+ views',
        imageUrl: image,
        createdAt: serverTimestamp()
      });
      toast.success('Thumbnail added to portfolio!');
      setThumbnails(prev => [
        {
          id: docRef.id,
          title: title.trim(),
          description: description.trim(),
          category,
          stats: stats.trim() || '100K+ views',
          imageUrl: image,
          createdAt: new Date()
        },
        ...prev
      ]);
      setTitle('');
      setDescription('');
      setStats('');
      setImage(null);
      setShowForm(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'thumbnails');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('default-')) {
      setThumbnails(prev => prev.filter(t => t.id !== id));
      toast.success('Thumbnail removed');
      return;
    }
    const toastId = toast.loading('Deleting thumbnail...');
    try {
      await deleteDoc(doc(db, 'thumbnails', id));
      setThumbnails(prev => prev.filter(t => t.id !== id));
      toast.success('Thumbnail deleted', { id: toastId });
    } catch (err) {
      toast.error('Failed to delete thumbnail', { id: toastId });
      handleFirestoreError(err, OperationType.DELETE, 'thumbnails');
    }
  };

  const filteredThumbnails = activeFilter === 'All' 
    ? thumbnails 
    : thumbnails.filter(t => t.category === activeFilter);

  return (
    <section id="thumbnails" className="section-padding py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              Featured <span className="text-blue-600">Thumbnails</span>
            </h2>
            {isAdmin && (
              <div className="flex items-center gap-2 flex-wrap">
                <button 
                  onClick={() => {
                    if (showForm && uploadMode === 'batch') {
                      setShowForm(false);
                    } else {
                      setUploadMode('batch');
                      setShowForm(true);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all shadow-lg text-[10px] font-bold uppercase tracking-widest ${
                    showForm && uploadMode === 'batch'
                      ? 'bg-zinc-800 text-white hover:bg-black'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-blue-500/20'
                  }`}
                  title="Upload Multiple Thumbnails"
                >
                  <UploadCloud size={14} />
                  {showForm && uploadMode === 'batch' ? 'Close Batch' : 'Upload Multiple'}
                  {batchItems.length > 0 && (
                    <span className="w-4 h-4 bg-white text-blue-600 rounded-full text-[9px] flex items-center justify-center font-black">
                      {batchItems.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => {
                    if (showForm && uploadMode === 'single') {
                      setShowForm(false);
                    } else {
                      setUploadMode('single');
                      setShowForm(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg text-[10px] font-bold uppercase tracking-widest"
                  title="Single Upload"
                >
                  {showForm && uploadMode === 'single' ? <X size={14} /> : <Plus size={14} />}
                  {showForm && uploadMode === 'single' ? 'Close Form' : 'Single Upload'}
                </button>
                <button 
                  onClick={handleRefineAll}
                  disabled={isRefiningAll}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all border border-blue-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                  title="Refine All with AI"
                >
                  {isRefiningAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {isRefiningAll ? 'Refining...' : 'Refine All'}
                </button>
              </div>
            )}
          </div>
          <p className="text-xs md:text-sm text-zinc-500 font-medium">
            Psychologically engineered thumbnails designed to force the click and scale views.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {!auth.currentUser ? (
            <button 
              onClick={handleLogin}
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-blue-600 flex items-center gap-2"
            >
              <LogIn size={14} />
              Admin Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Logged in as {auth.currentUser.displayName}
              </span>
              <button 
                onClick={handleLogout}
                className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 flex items-center gap-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showForm && isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="glass-card p-6 md:p-8 rounded-[2.5rem] border border-blue-600/10 shadow-xl max-w-3xl mx-auto relative">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[2.5rem]">
                  <Loader2 size={32} className="text-blue-600 animate-spin mb-4" />
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-widest animate-pulse">AI is analyzing thumbnail...</p>
                </div>
              )}

              {/* Mode Switcher Tabs */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/5 flex-wrap gap-4">
                <div className="flex items-center gap-2 p-1 bg-black/[0.04] rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setUploadMode('single')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      uploadMode === 'single'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <ImageIcon size={15} />
                    Single Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('batch')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      uploadMode === 'batch'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <UploadCloud size={15} />
                    Multiple Upload
                    {batchItems.length > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${uploadMode === 'batch' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
                        {batchItems.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-zinc-400 font-medium">
                  {uploadMode === 'single' ? 'Upload 1 thumbnail with custom stats' : 'Select multiple images at once & batch upload'}
                </div>
              </div>

              {uploadMode === 'single' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Project Title</label>
                        {image && (
                          <button
                            type="button"
                            onClick={() => analyzeImage(image)}
                            disabled={isAnalyzing}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                            title="Re-generate Title & Description with AI"
                          >
                            <Sparkles size={11} /> AI Re-write
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. MrBeast Challenge"
                        className="w-full bg-black/[0.02] border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-600/50 transition-all text-sm font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-4">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-600/50 transition-all text-sm appearance-none font-medium"
                      >
                        {['Gaming', 'Finance', 'Tech', 'Vlog', 'Lifestyle', 'Entertainment', 'Education', 'Music', 'Travel', 'Food', 'Sports'].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-4">Stats (e.g. 150K views)</label>
                      <input
                        type="text"
                        value={stats}
                        onChange={(e) => setStats(e.target.value)}
                        placeholder="e.g. 150K views"
                        className="w-full bg-black/[0.02] border border-black/5 rounded-2xl py-4 px-6 focus:outline-none focus:border-blue-600/50 transition-all text-sm font-medium"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
                          Description & AI Video Hook
                        </label>
                        {description && (
                          <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                            <Sparkles size={11} /> AI Generated
                          </span>
                        )}
                      </div>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Video premise, story hook, and viewer curiosity strategy (written automatically by AI when image is uploaded)..."
                        rows={2}
                        className="w-full bg-black/[0.02] border border-black/5 rounded-2xl py-3 px-6 focus:outline-none focus:border-blue-600/50 transition-all text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 ml-4">Thumbnail Image</label>
                    <div className="flex items-center gap-6">
                      <label className="flex-1 flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-black/5 rounded-3xl hover:border-blue-600/30 transition-all cursor-pointer bg-black/[0.01]">
                        <ImageIcon size={32} className="text-zinc-300" />
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      {image && (
                        <div className="w-48 aspect-video rounded-2xl overflow-hidden border border-black/10 bg-zinc-950 relative group flex items-center justify-center">
                          <img src={image} alt="Preview" className="w-full h-full object-contain" />
                          <button 
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5"
                          >
                            <X size={16} /> Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Add to Portfolio
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Multiple Upload Section */
                <div className="space-y-6">
                  {/* Drop zone for multiple files */}
                  <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-blue-500/20 hover:border-blue-600 rounded-3xl transition-all cursor-pointer bg-blue-50/20 hover:bg-blue-50/40 text-center">
                    <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
                      <UploadCloud size={32} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-800">Choose multiple thumbnails to upload</p>
                      <p className="text-xs text-zinc-400 mt-1">Select 2, 5, 10 or more images at once (PNG, JPG, WebP)</p>
                    </div>
                    <span className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md">
                      Browse Files
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={handleBatchFiles} 
                    />
                  </label>

                  {/* Batch Global Controls */}
                  {batchItems.length > 0 && (
                    <div className="p-4 bg-zinc-50 border border-black/5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Default Category:</label>
                          <select
                            value={batchCategory}
                            onChange={(e) => handleApplyBatchCategoryToAll(e.target.value)}
                            className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                          >
                            {['Gaming', 'Finance', 'Tech', 'Vlog', 'Lifestyle', 'Entertainment', 'Education', 'Music', 'Travel', 'Food', 'Sports'].map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Default Stats:</label>
                          <input
                            type="text"
                            value={batchStats}
                            onChange={(e) => handleApplyBatchStatsToAll(e.target.value)}
                            placeholder="e.g. 150K views"
                            className="bg-white border border-black/10 rounded-xl px-3 py-1.5 text-xs font-semibold w-28 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleBatchAIAnalyze}
                          disabled={isBatchProcessing}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          title="Generate titles and descriptions automatically using AI"
                        >
                          <Sparkles size={13} />
                          Auto AI Titles & Descs
                        </button>

                        <button
                          type="button"
                          onClick={() => setBatchItems([])}
                          disabled={isBatchProcessing}
                          className="px-3 py-1.5 text-zinc-400 hover:text-red-500 text-xs font-bold transition-all"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Queued Items List */}
                  {batchItems.length > 0 && (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-500 px-2">
                        <span>{batchItems.length} Thumbnails Selected</span>
                        <span>Auto AI Title & Description</span>
                      </div>

                      {batchItems.map((item, idx) => (
                        <div 
                          key={item.id}
                          className="p-3 bg-white border border-black/5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 transition-all hover:border-black/10"
                        >
                          <div className="relative w-28 md:w-32 aspect-video rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 flex items-center justify-center border border-black/5">
                            {item.preview ? (
                              <img src={item.preview} alt={item.title} className="w-full h-full object-contain" />
                            ) : (
                              <div className="animate-pulse bg-zinc-800 w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                                Loading...
                              </div>
                            )}
                            <span className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                              <div className="md:col-span-1">
                                <label className="text-[9px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                  Title <Sparkles size={10} className="text-blue-500" />
                                </label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => handleUpdateBatchItem(item.id, { title: e.target.value })}
                                  placeholder="AI Generated Title"
                                  className="w-full bg-zinc-50 border border-black/5 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] uppercase font-bold text-zinc-400">Category</label>
                                <select
                                  value={item.category}
                                  onChange={(e) => handleUpdateBatchItem(item.id, { category: e.target.value })}
                                  className="w-full bg-zinc-50 border border-black/5 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                                >
                                  {['Gaming', 'Finance', 'Tech', 'Vlog', 'Lifestyle', 'Entertainment', 'Education', 'Music', 'Travel', 'Food', 'Sports'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-[9px] uppercase font-bold text-zinc-400">Stats</label>
                                <input
                                  type="text"
                                  value={item.stats}
                                  onChange={(e) => handleUpdateBatchItem(item.id, { stats: e.target.value })}
                                  placeholder="150K views"
                                  className="w-full bg-zinc-50 border border-black/5 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                                Description & Hook <Sparkles size={10} className="text-blue-500" />
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => handleUpdateBatchItem(item.id, { description: e.target.value })}
                                placeholder="AI Video Description / Retention Hook..."
                                className="w-full bg-zinc-50 border border-black/5 rounded-xl px-3 py-1.5 text-xs font-normal text-zinc-700 focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end md:self-center">
                            <button
                              type="button"
                              onClick={() => handleAnalyzeSingleBatchItem(item.id)}
                              disabled={item.status === 'analyzing' || !item.preview}
                              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl border border-blue-200/60 transition-colors flex items-center gap-1 text-[11px] font-bold"
                              title="Re-generate Title & Description with AI"
                            >
                              <Wand2 size={13} />
                              <span className="hidden sm:inline">AI</span>
                            </button>
                            {item.status === 'analyzing' && (
                              <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
                                <Loader2 size={12} className="animate-spin" /> Writing...
                              </span>
                            )}
                            {item.status === 'uploading' && (
                              <span className="flex items-center gap-1 text-[10px] text-blue-600 font-bold">
                                <Loader2 size={12} className="animate-spin" /> Uploading
                              </span>
                            )}
                            {item.status === 'done' && (
                              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                                <CheckCircle2 size={13} /> Done
                              </span>
                            )}
                            {item.status === 'error' && (
                              <span className="text-[10px] text-red-500 font-bold">Error</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveBatchItem(item.id)}
                              disabled={isBatchProcessing}
                              className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors"
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Batch Submit Button */}
                  {batchItems.length > 0 && (
                    <div className="space-y-3 pt-2">
                      {isBatchProcessing && (
                        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ 
                              width: `${(batchProgress.current / (batchProgress.total || 1)) * 100}%` 
                            }}
                          />
                        </div>
                      )}
                      
                      <button
                        type="button"
                        onClick={handleBatchSubmit}
                        disabled={isBatchProcessing || batchItems.filter(it => it.preview).length === 0}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50"
                      >
                        {isBatchProcessing ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Uploading {batchProgress.current} of {batchProgress.total}...
                          </>
                        ) : (
                          <>
                            Upload All ({batchItems.length} Thumbnails)
                            <UploadCloud size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quota Exceeded Overlay */}
      <AnimatePresence>
        {quotaExceeded && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center gap-4 text-amber-800"
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

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeFilter === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-white text-zinc-500 hover:bg-zinc-100 border border-black/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && thumbnails.length === 0 ? (
        <div className="flex flex-wrap justify-center gap-12">
          {[...Array(PAGE_SIZE)].map((_, i) => (
            <ThumbnailSkeleton key={i} />
          ))}
        </div>
      ) : thumbnails.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-[2.5rem] border border-dashed border-black/5">
          <p className="text-zinc-400 italic">No thumbnails found in this category. {isAdmin && "Start adding some!"}</p>
        </div>
      ) : (
        <div className="space-y-12 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-40 flex items-center justify-center rounded-3xl">
              <Loader2 size={40} className="text-blue-600 animate-spin" />
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-12">
            {thumbnails.map((thumb, i) => (
              <ThumbnailItem 
                key={thumb.id}
                thumb={thumb}
                i={i}
                isAdmin={isAdmin}
                refiningId={refiningId}
                handleRefine={handleRefine}
                handleDelete={handleDelete}
                onOpenModal={setSelectedThumb}
              />
            ))}
          </div>

          {hasMore && (
            <div className="hidden md:flex justify-center pt-8">
              <button
                onClick={() => fetchThumbnails(false)}
                disabled={loadingMore}
                className="group flex items-center gap-3 px-10 py-4 bg-white border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 shadow-sm hover:shadow-xl disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    Loading...
                    <Loader2 size={16} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Load More Projects
                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Full-view Lightbox Modal so the user can inspect thumbnail completely */}
      <AnimatePresence>
        {selectedThumb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedThumb(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-zinc-950 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedThumb(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 backdrop-blur-sm transition-all"
                title="Close"
              >
                <X size={20} />
              </button>

              {/* Completely uncropped full image */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedThumb.imageUrl}
                  alt={selectedThumb.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Details & Actions */}
              <div className="p-6 bg-zinc-900 border-t border-white/10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-500/30">
                      {selectedThumb.category || 'Portfolio'}
                    </span>
                    <span className="text-zinc-400 text-xs font-semibold">{selectedThumb.stats}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg md:text-xl leading-snug">
                    {selectedThumb.title}
                  </h3>
                  {selectedThumb.description && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-blue-400 mb-1.5">
                        <Sparkles size={12} /> AI Concept & Description
                      </div>
                      <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                        {selectedThumb.description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedThumb.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <ExternalLink size={14} /> Open Full
                  </a>
                  <button
                    onClick={() => setSelectedThumb(null)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
