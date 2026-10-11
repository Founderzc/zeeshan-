import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, X, Upload, Loader2, Image as ImageIcon, Send, Sparkles, ChevronRight, ChevronLeft, Layout, Workflow, FileText, ExternalLink, Wand2, MessageSquare, User, Quote, Star, CheckCircle2, CheckCheck, Video, Phone } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { useAdmin } from '../hooks/useAdmin';
import { Skeleton } from './ui/Skeleton';
import { db, auth, handleFirestoreError, OperationType, getDocsCached } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  deleteDoc, 
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { PushPin } from './PushPin';

interface BTSContent {
  id: string;
  title: string;
  videoTitle?: string;
  description?: string;
  layoutIdea?: string;
  designWorkflow?: string;
  caseStudy?: string;
  clientFeedback?: string;
  whatsappChat?: { role: 'client' | 'designer'; text: string; time: string }[];
  imageUrl: string;
  beforeImages?: string[];
  afterImages?: string[];
  createdAt: Timestamp;
}

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.5): Promise<string> => {
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
      
      // Try to get a size under 150KB to avoid proxy limits
      let currentQuality = quality;
      let result = canvas.toDataURL('image/jpeg', currentQuality);
      
      // If still too large, reduce quality further
      while (result.length > 150000 && currentQuality > 0.1) {
        currentQuality -= 0.1;
        result = canvas.toDataURL('image/jpeg', currentQuality);
      }
      
      resolve(result);
    };
  });
};

export const BehindTheScenes = () => {
  const [contents, setContents] = useState<BTSContent[]>([]);
  const { isAdmin } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<BTSContent | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Form state
  const [title, setTitle] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [layoutIdea, setLayoutIdea] = useState('');
  const [designWorkflow, setDesignWorkflow] = useState('');
  const [caseStudy, setCaseStudy] = useState('');
  const [clientFeedback, setClientFeedback] = useState('');
  const [whatsappChat, setWhatsappChat] = useState<{ role: 'client' | 'designer'; text: string; time: string }[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [beforeImages, setBeforeImages] = useState<string[]>([]);
  const [afterImages, setAfterImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefiningAll, setIsRefiningAll] = useState(false);
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchBTS = async () => {
      try {
        const q = query(
          collection(db, 'behind_the_scenes'), 
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const data = await getDocsCached(q, 'bts_limit_10');
        setContents(data as BTSContent[]);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'behind_the_scenes');
      } finally {
        setLoading(false);
      }
    };

    fetchBTS();
  }, []);

  const handleImageUpload = async (files: FileList | null, type: 'main' | 'before' | 'after') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const compressedImages: string[] = [];

    for (const file of fileArray) {
      const reader = new FileReader();
      const compressed = await new Promise<string>((resolve) => {
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          const comp = await compressImage(base64);
          resolve(comp);
        };
        reader.readAsDataURL(file);
      });
      compressedImages.push(compressed);
    }

    if (type === 'main') {
      setImage(compressedImages[0]);
      // Automatically trigger AI refinement for the case study
      setTimeout(() => generateCaseStudy(), 100);
    }
    if (type === 'before') setBeforeImages(prev => [...prev, ...compressedImages]);
    if (type === 'after') {
      setAfterImages(prev => [...prev, ...compressedImages]);
      if (!image && compressedImages.length > 0) {
        setImage(compressedImages[0]);
        setTimeout(() => generateCaseStudy(), 100);
      }
    }
  };

  const handleDrag = (e: React.DragEvent, type: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: active }));
  };

  const handleDrop = (e: React.DragEvent, type: 'main' | 'before' | 'after') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files, type);
    }
  };

  const generateCaseStudy = async () => {
    if (beforeImages.length === 0 && afterImages.length === 0 && !image) {
      setError('Please upload at least one image first.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is missing. Please configure it in the Secrets panel.");
      }
      const ai = new GoogleGenAI({ apiKey });
      
      const parts: any[] = [
        { text: `
          Analyze the provided images (Before/After/Main) and generate a complete design case study.
          Return the response in JSON format with the following fields:
          - title: A short, catchy project title.
          - videoTitle: A title for a YouTube video about this project.
          - description: A detailed description of what was done.
          - layoutIdea: The initial concept or layout idea.
          - designWorkflow: A step-by-step design process.
          - caseStudy: A full, professional case study in Markdown format.
          - clientFeedback: A short, enthusiastic testimonial from the client.
          - whatsappChat: An array of 4-5 messages simulating a WhatsApp conversation between the 'designer' and 'client' about the project. Each message should have:
            - role: either 'client' or 'designer'
            - text: the message content
            - time: a simulated time (e.g., "10:45 AM")
          
          The chat should feel natural and professional. The last message should be from the designer saying they are sending the final file.
          
          If only one image is provided, assume it's the final result and imagine the process.
          If before/after are provided, focus on the transformation.
        `}
      ];

      if (beforeImages.length > 0) {
        parts.push({
          inlineData: {
            data: beforeImages[0].split(',')[1],
            mimeType: "image/jpeg"
          }
        });
        parts.push({ text: "This is a 'Before' image." });
      }

      if (afterImages.length > 0) {
        parts.push({
          inlineData: {
            data: afterImages[0].split(',')[1],
            mimeType: "image/jpeg"
          }
        });
        parts.push({ text: "This is an 'After' image." });
      }

      if (image && afterImages.length === 0) {
        parts.push({
          inlineData: {
            data: image.split(',')[1],
            mimeType: "image/jpeg"
          }
        });
        parts.push({ text: "This is the main project image." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              videoTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              layoutIdea: { type: Type.STRING },
              designWorkflow: { type: Type.STRING },
              caseStudy: { type: Type.STRING },
              clientFeedback: { type: Type.STRING },
              whatsappChat: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING, enum: ['client', 'designer'] },
                    text: { type: Type.STRING },
                    time: { type: Type.STRING }
                  },
                  required: ["role", "text", "time"]
                }
              }
            },
            required: ["title", "videoTitle", "description", "layoutIdea", "designWorkflow", "caseStudy", "clientFeedback", "whatsappChat"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      
      if (result.title) setTitle(result.title);
      if (result.videoTitle) setVideoTitle(result.videoTitle);
      if (result.description) setDescription(result.description);
      if (result.layoutIdea) setLayoutIdea(result.layoutIdea);
      if (result.designWorkflow) setDesignWorkflow(result.designWorkflow);
      if (result.caseStudy) setCaseStudy(result.caseStudy);
      if (result.clientFeedback) setClientFeedback(result.clientFeedback);
      if (result.whatsappChat) setWhatsappChat(result.whatsappChat);
      
    } catch (err) {
      console.error('Error generating case study:', err);
      setError('AI generation failed. Please try again or fill manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async (content: BTSContent) => {
    setRefiningId(content.id);
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is missing");
      const ai = new GoogleGenAI({ apiKey });
      
      const parts: any[] = [
        { text: "Analyze the provided image and generate a complete design case study. Return JSON with: title, videoTitle, description, layoutIdea, designWorkflow, caseStudy, clientFeedback, whatsappChat (array of {role, text, time})." }
      ];
      
      parts.push({
        inlineData: {
          data: content.imageUrl.split(',')[1],
          mimeType: "image/jpeg"
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              videoTitle: { type: Type.STRING },
              description: { type: Type.STRING },
              layoutIdea: { type: Type.STRING },
              designWorkflow: { type: Type.STRING },
              caseStudy: { type: Type.STRING },
              clientFeedback: { type: Type.STRING },
              whatsappChat: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING, enum: ['client', 'designer'] },
                    text: { type: Type.STRING },
                    time: { type: Type.STRING }
                  },
                  required: ["role", "text", "time"]
                }
              }
            },
            required: ["title", "videoTitle", "description", "layoutIdea", "designWorkflow", "caseStudy", "clientFeedback", "whatsappChat"]
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      if (result.title) {
        await updateDoc(doc(db, 'behind_the_scenes', content.id), {
          ...result,
          updatedAt: serverTimestamp()
        });
        // Update local state
        setContents(prev => prev.map(c => c.id === content.id ? { ...c, ...result } : c));
      }
    } catch (err) {
      console.error('Refine failed:', err);
    } finally {
      setRefiningId(null);
    }
  };

  const handleRefineAll = async () => {
    if (!window.confirm("This will automatically update ALL case studies using AI. Continue?")) return;
    setIsRefiningAll(true);
    try {
      for (const content of contents) {
        await handleRefine(content);
        await new Promise(r => setTimeout(r, 1000));
      }
    } finally {
      setIsRefiningAll(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'behind_the_scenes'), {
        title,
        videoTitle: videoTitle || null,
        description: description || null,
        layoutIdea: layoutIdea || null,
        designWorkflow: designWorkflow || null,
        caseStudy: caseStudy || null,
        clientFeedback: clientFeedback || null,
        whatsappChat: whatsappChat.length > 0 ? whatsappChat : null,
        imageUrl: image,
        beforeImages: beforeImages.length > 0 ? beforeImages : null,
        afterImages: afterImages.length > 0 ? afterImages : null,
        createdAt: serverTimestamp(),
      });
      setTitle('');
      setVideoTitle('');
      setDescription('');
      setLayoutIdea('');
      setDesignWorkflow('');
      setCaseStudy('');
      setClientFeedback('');
      setWhatsappChat([]);
      setImage(null);
      setBeforeImages([]);
      setAfterImages([]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding BTS content:', err);
      setError('Failed to add content. The images might still be too large or there was a connection issue.');
      handleFirestoreError(err, OperationType.CREATE, 'behind_the_scenes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteDoc(doc(db, 'behind_the_scenes', id));
      } catch (err) {
        console.error('Error deleting BTS content:', err);
        handleFirestoreError(err, OperationType.DELETE, `behind_the_scenes/${id}`);
      }
    }
  };

  const getCarouselImages = (content: BTSContent) => {
    const images = [{ url: content.imageUrl, label: 'Final Result' }];
    if (content.beforeImages) {
      content.beforeImages.forEach((url, i) => images.push({ url, label: `Before ${i + 1}` }));
    }
    if (content.afterImages) {
      content.afterImages.forEach((url, i) => images.push({ url, label: `After ${i + 1}` }));
    }
    return images;
  };

  const carouselImages = selectedContent ? getCarouselImages(selectedContent) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  if (loading) {
    return (
      <div className="py-20 space-y-12">
        <div className="flex justify-between items-end">
          <div className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-6">
              <Skeleton className="aspect-video w-full rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[#1A1A1A]">
            Behind The <span className="text-blue-600">Scenes</span>
          </h2>
          <p className="text-zinc-500 max-w-2xl font-medium">
            A glimpse into the process, setup, and moments that happen off-camera.
          </p>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefineAll}
              disabled={isRefiningAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-all border border-blue-200 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isRefiningAll ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {isRefiningAll ? 'Refining...' : 'Refine All'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              Manual Upload Case Study
            </button>
          </div>
        )}
      </div>

      {/* BTS Grid */}
      <div className="flex flex-wrap justify-center gap-12">
        <AnimatePresence mode="popLayout">
          {contents.map((content, i) => (
            <motion.div
              key={content.id}
              layout
              initial={{ opacity: 0, scale: 0.9, rotate: Math.random() * 10 - 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ rotate: 0, zIndex: 20, y: -10 }}
              onClick={() => {
                setSelectedContent(content);
                setCurrentImageIndex(0);
              }}
              className="group relative w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-sm bg-white border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <PushPin color={['#FF6321', '#3B82F6', '#10B981', '#F59E0B'][i % 4]} />
              
              <div className="aspect-video relative overflow-hidden bg-zinc-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={content.imageUrl}
                    src={content.imageUrl}
                    alt={content.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </AnimatePresence>
                
                {/* Case Study Overlay */}
                {(content.beforeImages || content.afterImages) && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-widest rounded-full">
                      Case Study
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {isAdmin && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefine(content);
                      }}
                      disabled={refiningId === content.id}
                      className="p-2 bg-white/90 backdrop-blur-md text-blue-600 rounded-full hover:bg-white transition-all shadow-lg disabled:opacity-50"
                      title="Refine with AI"
                    >
                      {refiningId === content.id ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(content.id);
                      }}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8">
                <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
                  {content.title}
                </h3>

                {/* Before/After Preview */}
                {(content.beforeImages || content.afterImages) && (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {content.beforeImages && content.beforeImages.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Before</span>
                          <span className="text-[8px] font-bold text-zinc-300">{content.beforeImages.length}</span>
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden border border-black/5">
                          <img 
                            src={content.beforeImages[0]} 
                            className="w-full h-full object-cover" 
                            alt="Before" 
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                    {content.afterImages && content.afterImages.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-widest text-blue-600">After</span>
                          <span className="text-[8px] font-bold text-blue-300">{content.afterImages.length}</span>
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden border border-blue-600/20">
                          <img 
                            src={content.afterImages[0]} 
                            className="w-full h-full object-cover" 
                            alt="After" 
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Content Modal */}
      <AnimatePresence>
        {selectedContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden border border-black/5 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                onClick={() => setSelectedContent(null)}
                className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-zinc-400 hover:text-black transition-colors shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Side: Visuals */}
              <div className="w-full md:w-1/2 bg-zinc-50 overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                      {carouselImages[currentImageIndex]?.label}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {currentImageIndex + 1} / {carouselImages.length}
                    </span>
                  </div>
                  
                  <div className="relative group/carousel aspect-video rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-600/10 border border-black/5 bg-black">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={carouselImages[currentImageIndex]?.url}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-contain"
                        alt={carouselImages[currentImageIndex]?.label}
                      />
                    </AnimatePresence>

                    {carouselImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover/carousel:opacity-100"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all opacity-0 group-hover/carousel:opacity-100"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Carousel Thumbnails */}
                  {carouselImages.length > 1 && (
                    <div className="flex gap-3 justify-center">
                      {carouselImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-20 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                            currentImageIndex === idx ? 'border-blue-600 scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img src={img.url} className="w-full h-full object-cover" alt={img.label} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Before/After Comparison Grid (Keep as secondary view) */}
                {selectedContent.beforeImages && selectedContent.afterImages && (
                  <div className="pt-12 border-t border-black/5">
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">Side-by-Side Comparison</h4>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-zinc-200" />
                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-12">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="px-4 py-2 bg-zinc-100 text-zinc-500 text-[9px] font-bold uppercase tracking-widest rounded-full border border-black/5">Before</span>
                          <div className="flex-grow h-[1px] bg-zinc-100" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          {selectedContent.beforeImages.map((img, idx) => (
                            <div key={idx} className="aspect-video rounded-[2.5rem] overflow-hidden border border-black/5 shadow-xl shadow-black/5 hover:scale-[1.02] transition-transform duration-500">
                              <img src={img} className="w-full h-full object-cover" alt={`Before ${idx + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="px-4 py-2 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-widest rounded-full border border-blue-100">After</span>
                          <div className="flex-grow h-[1px] bg-blue-50" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          {selectedContent.afterImages.map((img, idx) => (
                            <div key={idx} className="aspect-video rounded-[2.5rem] overflow-hidden border border-blue-600/10 shadow-2xl shadow-blue-600/5 hover:scale-[1.02] transition-transform duration-500">
                              <img src={img} className="w-full h-full object-cover" alt={`After ${idx + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Content */}
              <div className="w-full md:w-1/2 overflow-y-auto custom-scrollbar p-8 md:p-12 bg-white flex flex-col">
                <div className="max-w-xl flex-grow">
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg shadow-blue-600/20">
                        Case Study
                      </span>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                        {selectedContent.createdAt ? (
                          (() => {
                            const rawDate = selectedContent.createdAt as any;
                            const date = rawDate.toDate ? rawDate.toDate() : new Date(rawDate);
                            return date.toLocaleDateString();
                          })()
                        ) : 'Recent Project'}
                      </span>
                    </div>
                    <h2 className="text-5xl font-black text-[#1A1A1A] leading-[0.9] tracking-tighter uppercase">
                      {selectedContent.title}
                    </h2>
                    {selectedContent.videoTitle && (
                      <p className="text-blue-600 font-bold flex items-center gap-2 text-sm">
                        <ExternalLink className="w-4 h-4" />
                        {selectedContent.videoTitle}
                      </p>
                    )}
                  </div>

                  {selectedContent.description && (
                    <div className="mb-12 relative">
                      <div className="absolute -left-6 top-0 w-1 h-full bg-blue-600/10 rounded-full" />
                      <p className="text-zinc-500 text-xl leading-relaxed font-medium italic">
                        "{selectedContent.description}"
                      </p>
                    </div>
                  )}

                  {/* WhatsApp Chat Simulation */}
                  {selectedContent.whatsappChat && (
                    <div className="mb-12 space-y-4">
                      <div className="flex items-center gap-3 text-green-600 mb-6">
                        <MessageSquare className="w-5 h-5" />
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Client Approval Chat</h4>
                      </div>
                      <div className="bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden border border-black/5 shadow-xl relative">
                        {/* WhatsApp Header */}
                        <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border border-white/10">
                              <img 
                                src="https://i.ibb.co/qXFY4XD/dposa-s.png" 
                                alt="Client" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-bold">Client (Verified)</div>
                              <div className="text-[10px] opacity-70 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                online
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 opacity-70">
                            <Video size={18} />
                            <Phone size={18} />
                            <X className="w-5 h-5 cursor-pointer" onClick={() => setSelectedContent(null)} />
                          </div>
                        </div>
                        {/* Chat Area */}
                        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar bg-[#e5ddd5] relative">
                          <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat" />
                          
                          {selectedContent.whatsappChat.map((msg, idx) => (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              whileInView={{ opacity: 1, y: 0, scale: 1 }}
                              key={idx}
                              className={`flex ${msg.role === 'client' ? 'justify-start' : 'justify-end'} relative z-10`}
                            >
                              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm relative ${
                                msg.role === 'client' 
                                  ? 'bg-white text-zinc-800 rounded-tl-none' 
                                  : 'bg-[#dcf8c6] text-zinc-800 rounded-tr-none'
                              }`}>
                                {/* Tail */}
                                <div className={`absolute top-0 w-4 h-4 ${
                                  msg.role === 'client' 
                                    ? 'left-[-8px] bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]' 
                                    : 'right-[-8px] bg-[#dcf8c6] [clip-path:polygon(0_0,100%_0,0_100%)]'
                                }`} />
                                
                                <p className="text-sm leading-relaxed pr-12">{msg.text}</p>
                                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                                  <span className="text-[9px] text-zinc-400">{msg.time}</span>
                                  {msg.role === 'designer' && <CheckCheck size={12} className="text-blue-500" />}
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* Final Thumbnail Message */}
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            className="flex justify-end relative z-10"
                          >
                            <div className="max-w-[85%] p-2 bg-[#dcf8c6] rounded-2xl rounded-tr-none shadow-sm relative">
                              <div className="absolute top-0 right-[-8px] bg-[#dcf8c6] w-4 h-4 [clip-path:polygon(0_0,100%_0,0_100%)]" />
                              <div className="rounded-xl overflow-hidden border border-black/5 mb-1">
                                <img 
                                  src={selectedContent.imageUrl} 
                                  alt="Final Thumbnail" 
                                  className="w-full h-auto max-h-60 object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="px-2 pb-1 flex items-center justify-between gap-4">
                                <span className="text-[10px] font-medium text-zinc-500">Final_Thumbnail_v1.jpg</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-zinc-400">
                                    {selectedContent.whatsappChat[selectedContent.whatsappChat.length - 1]?.time || "Just now"}
                                  </span>
                                  <CheckCheck size={12} className="text-blue-500" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Client Feedback Card */}
                  {selectedContent.clientFeedback && (
                    <div className="mb-12 group">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-600/20 relative overflow-hidden">
                        <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/10 rotate-12" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-lg font-bold leading-relaxed mb-6">
                            "{selectedContent.clientFeedback}"
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-widest">Verified Client</div>
                              <div className="text-[10px] opacity-70">Project Success</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-10">
                    {selectedContent.layoutIdea && (
                      <div className="space-y-4 group">
                        <div className="flex items-center gap-3 text-blue-600">
                          <Layout className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">The Vision</h4>
                        </div>
                        <div className="text-zinc-600 leading-relaxed bg-zinc-50 p-8 rounded-[2.5rem] border border-black/5 shadow-inner">
                          {selectedContent.layoutIdea}
                        </div>
                      </div>
                    )}

                    {selectedContent.designWorkflow && (
                      <div className="space-y-4 group">
                        <div className="flex items-center gap-3 text-blue-600">
                          <Workflow className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Process</h4>
                        </div>
                        <div className="text-zinc-600 leading-relaxed bg-blue-50/30 p-8 rounded-[2.5rem] border border-blue-600/5">
                          {selectedContent.designWorkflow}
                        </div>
                      </div>
                    )}

                    {selectedContent.caseStudy && (
                      <div className="space-y-8 pt-10 border-t border-black/5">
                        <div className="flex items-center gap-3 text-blue-600">
                          <FileText className="w-5 h-5" />
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Deep Dive</h4>
                        </div>
                        <div className="prose prose-zinc prose-sm max-w-none prose-headings:text-[#1A1A1A] prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-zinc-600 prose-p:leading-relaxed prose-strong:text-blue-600 bg-white p-10 rounded-[3rem] border border-black/5 shadow-xl">
                          <ReactMarkdown>{selectedContent.caseStudy}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-black/5 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Zefury Creative Studio</span>
                  <span>© 2026–2027</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 border border-black/5 shadow-2xl"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-3xl font-bold mb-8 text-[#1A1A1A]">Add BTS Content</h3>

              <div className="mb-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                      <Wand2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">AI Magic Mode</h4>
                      <p className="text-[10px] text-blue-600 font-medium">Upload images first, then click generate!</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={generateCaseStudy}
                    disabled={isGenerating || (beforeImages.length === 0 && afterImages.length === 0 && !image)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Generate All
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      placeholder="e.g. Cinematic Vlog Setup"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium"
                      placeholder="e.g. My Day in Tokyo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium min-h-[100px]"
                    placeholder="Tell us more about this project..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Layout Idea
                    </label>
                    <textarea
                      value={layoutIdea}
                      onChange={(e) => setLayoutIdea(e.target.value)}
                      className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium min-h-[80px]"
                      placeholder="The initial concept..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Design Workflow / Process
                    </label>
                    <textarea
                      value={designWorkflow}
                      onChange={(e) => setDesignWorkflow(e.target.value)}
                      className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium min-h-[80px]"
                      placeholder="Step by step process..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Case Study
                    </label>
                  </div>
                  <textarea
                    value={caseStudy}
                    onChange={(e) => setCaseStudy(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium min-h-[150px]"
                    placeholder="The full case study will appear here..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Client Feedback (Testimonial)
                  </label>
                  <textarea
                    value={clientFeedback}
                    onChange={(e) => setClientFeedback(e.target.value)}
                    className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-medium min-h-[80px]"
                    placeholder="Client's testimonial..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    WhatsApp Chat (JSON Format)
                  </label>
                  <textarea
                    value={JSON.stringify(whatsappChat, null, 2)}
                    onChange={(e) => {
                      try {
                        setWhatsappChat(JSON.parse(e.target.value));
                      } catch (err) {
                        // Handle invalid JSON silently while typing
                      }
                    }}
                    className="w-full bg-zinc-50 border border-black/5 rounded-2xl px-6 py-4 text-[#1A1A1A] focus:outline-none focus:border-blue-600 transition-colors font-mono text-xs min-h-[150px]"
                    placeholder='[{"role": "client", "text": "Hi", "time": "10:00 AM"}]'
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      Before Images (Bulk)
                    </label>
                    <div 
                      onDragEnter={(e) => handleDrag(e, 'before', true)}
                      onDragLeave={(e) => handleDrag(e, 'before', false)}
                      onDragOver={(e) => handleDrag(e, 'before', true)}
                      onDrop={(e) => handleDrop(e, 'before')}
                      className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all overflow-hidden bg-zinc-50 ${
                        dragActive['before'] ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:border-blue-600/50'
                      }`}
                    >
                      {beforeImages.length > 0 ? (
                        <div className="p-4 grid grid-cols-3 gap-2 h-full overflow-y-auto custom-scrollbar">
                          {beforeImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-black/5 group/img">
                              <img src={img} className="w-full h-full object-cover" alt={`Before ${idx}`} />
                              <button 
                                type="button" 
                                onClick={() => setBeforeImages(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square rounded-lg border border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                            <Plus className="w-4 h-4 text-zinc-300" />
                            <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'before')} className="hidden" />
                          </label>
                        </div>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="w-4 h-4 text-zinc-300 mb-2" />
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Drag & Drop Before Images</span>
                          <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'before')} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                      After Images (Bulk)
                    </label>
                    <div 
                      onDragEnter={(e) => handleDrag(e, 'after', true)}
                      onDragLeave={(e) => handleDrag(e, 'after', false)}
                      onDragOver={(e) => handleDrag(e, 'after', true)}
                      onDrop={(e) => handleDrop(e, 'after')}
                      className={`relative aspect-video rounded-2xl border-2 border-dashed transition-all overflow-hidden bg-zinc-50 ${
                        dragActive['after'] ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:border-blue-600/50'
                      }`}
                    >
                      {afterImages.length > 0 ? (
                        <div className="p-4 grid grid-cols-3 gap-2 h-full overflow-y-auto custom-scrollbar">
                          {afterImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-black/5 group/img">
                              <img src={img} className="w-full h-full object-cover" alt={`After ${idx}`} />
                              <button 
                                type="button" 
                                onClick={() => setAfterImages(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square rounded-lg border border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                            <Plus className="w-4 h-4 text-zinc-300" />
                            <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'after')} className="hidden" />
                          </label>
                        </div>
                      ) : (
                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="w-4 h-4 text-zinc-300 mb-2" />
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Drag & Drop After Images</span>
                          <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(e.target.files, 'after')} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
                    Main Display Image (Required)
                  </label>
                  <div 
                    onDragEnter={(e) => handleDrag(e, 'main', true)}
                    onDragLeave={(e) => handleDrag(e, 'main', false)}
                    onDragOver={(e) => handleDrag(e, 'main', true)}
                    onDrop={(e) => handleDrop(e, 'main')}
                    className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all overflow-hidden bg-zinc-50 ${
                      dragActive['main'] ? 'border-blue-600 bg-blue-50/50' : 'border-zinc-200 hover:border-blue-600/50'
                    }`}
                  >
                    {image ? (
                      <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-black/5 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Drag & Drop Main Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files, 'main')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <p className="text-xs font-medium text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !image || !title}
                  className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      Add Content
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
