import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Video, Calendar, Shield, Compass, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ThreeSixtyViewer } from './ThreeSixtyViewer';

interface VirtualTourProps {
  lang: Language;
}

const VideoPlayer: React.FC<{ url: string; title?: string; autoplay?: boolean }> = ({ url, title, autoplay = false }) => {
  const getYouTubeId = (urlStr: string) => {
    if (!urlStr) return null;
    if (urlStr.includes('/shorts/')) {
      const parts = urlStr.split('/shorts/');
      if (parts[1]) {
        return parts[1].split(/[?#&]/)[0];
      }
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getGoogleDriveEmbedUrl = (urlStr: string) => {
    if (!urlStr) return null;
    if (!urlStr.includes('drive.google.com') && !urlStr.includes('docs.google.com')) return null;
    
    // Match /d/<id> where <id> is only word chars, hyphens, and underscores
    const dMatch = urlStr.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      return `https://drive.google.com/file/d/${dMatch[1]}/preview`;
    }
    
    // Match id=<id>
    const idParamMatch = urlStr.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      return `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
    }
    
    return null;
  };

  const isFacebookVideoUrl = (urlStr: string) => {
    if (!urlStr) return false;
    return urlStr.includes('facebook.com') || urlStr.includes('fb.watch') || urlStr.includes('fb.com');
  };

  const getFacebookEmbedUrl = (urlStr: string) => {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(urlStr)}&show_text=0&width=560`;
  };

  const isInstagramUrl = (urlStr: string) => {
    if (!urlStr) return false;
    return urlStr.includes('instagram.com') || urlStr.includes('instagr.am');
  };

  const getInstagramEmbedUrl = (urlStr: string) => {
    if (!urlStr) return null;
    const baseUrl = urlStr.split(/[?#]/)[0];
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}embed/`;
  };

  const ytId = getYouTubeId(url);
  if (ytId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytId}?autoplay=${autoplay ? 1 : 0}&mute=${autoplay ? 0 : 1}&rel=0`}
        title={title || "YouTube video player"}
        className="w-full h-full border-0 rounded-2xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  const driveEmbed = getGoogleDriveEmbedUrl(url);
  if (driveEmbed) {
    return (
      <iframe
        src={driveEmbed}
        title={title || "Google Drive video player"}
        className="w-full h-full border-0 rounded-2xl bg-stone-950"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    );
  }

  if (isFacebookVideoUrl(url)) {
    return (
      <iframe
        src={getFacebookEmbedUrl(url)}
        title={title || "Facebook video player"}
        className="w-full h-full border-0 rounded-2xl bg-stone-950"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isInstagramUrl(url)) {
    return (
      <iframe
        src={getInstagramEmbedUrl(url) || url}
        title={title || "Instagram video player"}
        className="w-full h-full border-0 rounded-2xl bg-white"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <video
      src={url}
      className="w-full h-full object-contain rounded-2xl bg-stone-950"
      controls={autoplay}
      autoPlay={autoplay}
      muted={!autoplay}
      playsInline
    />
  );
};

export const VirtualTour: React.FC<VirtualTourProps> = ({ lang }) => {
  const t = useContent(lang).virtualTour;
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [initialIndex, setInitialIndex] = useState<number | null>(null);

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnailUrl = (item: any) => {
    if (item.type === 'image') return item.url;
    const ytId = getYouTubeId(item.url);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800";
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!t.media || t.media.length === 0) return;
    setActiveMediaIndex((prev) => (prev !== null && prev < t.media.length - 1) ? prev + 1 : 0);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!t.media || t.media.length === 0) return;
    setActiveMediaIndex((prev) => (prev !== null && prev > 0) ? prev - 1 : t.media.length - 1);
  };

  const handleClose = () => {
    setActiveMediaIndex(null);
  };

  useEffect(() => {
    if (activeMediaIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMediaIndex, t.media]);

  useEffect(() => {
    if (activeMediaIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeMediaIndex]);

  return (
    <section id="virtual-tour" className="py-24 bg-stone-900 text-white overflow-hidden relative">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-[-10vw] w-[40vw] h-[40vw] rounded-full bg-brand-green/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10vw] w-[40vw] h-[40vw] rounded-full bg-brand-yellow/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-white/10 text-brand-yellow text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-4"
          >
            <Compass size={14} className="stroke-[2.5] animate-spin" style={{ animationDuration: '10s' }} />
            Interactive 360° Experience
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3.5xl sm:text-5xl font-editorial font-bold text-stone-100 mb-4 tracking-tight leading-tight"
          >
            {t.title}
          </motion.h2>
          <div className="w-16 h-1.5 bg-brand-yellow mx-auto rounded-full mt-2"></div>
        </div>

        {/* Traditional Media Gallery Divider Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-xl sm:text-2xl font-sans font-bold text-stone-200 mb-2">
            Photo Gallery & Highlights
          </h3>
          <p className="text-stone-400 text-sm font-sans">
            Take a look at some of our daycare spaces and happy moments
          </p>
        </div>

        {/* Visual Collage */}
        <div className="relative max-w-4xl mx-auto mb-16 sm:mb-32 h-[320px] xs:h-[400px] sm:h-[450px] md:h-[500px]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Decorative blobs behind images */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-yellow/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-brand-green/20 rounded-full blur-3xl -z-10" />
            
            {/* Organic Frame 1 */}
            <div className="absolute top-0 left-0 sm:left-12 w-[65%] sm:w-[55%] aspect-[4/5] rounded-[24px] sm:rounded-[48px] overflow-hidden border-4 sm:border-8 border-white shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-500 group z-10">
              <img 
                src={t.collageImage1 || "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1000&auto=format&fit=crop"} 
                alt="Happy children learning and playing" 
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Organic Frame 2 */}
            <div className="absolute bottom-4 right-0 sm:right-12 w-[55%] sm:w-[45%] aspect-[1/1] rounded-[20px] sm:rounded-[40px] overflow-hidden border-4 sm:border-6 border-white shadow-xl rotate-[6deg] hover:rotate-0 transition-transform duration-500 group z-20">
              <img 
                src={t.collageImage2 || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"} 
                alt="Daycare active play" 
                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Decorative scribble badge */}
            <div className="absolute top-1/4 -right-1 sm:-right-8 bg-brand-orange text-white p-3 sm:p-4.5 rounded-[16px] sm:rounded-[24px] shadow-xl z-30 rotate-[12deg] max-w-[110px] sm:max-w-[160px] border border-white/20">
              <span className="text-lg sm:text-2xl font-black block mb-0.5 leading-none">{t.ratingText}</span>
              <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider block opacity-90">{t.ratingSubtext}</span>
            </div>

            {/* Floating trust badge */}
            <div className="absolute bottom-1/4 -left-2 sm:-left-12 bg-white text-stone-800 py-2.5 px-3.5 sm:py-3.5 sm:px-5 rounded-[16px] sm:rounded-[24px] shadow-xl z-30 rotate-[-8deg] flex items-center gap-2 sm:gap-3 border border-stone-100 max-w-[150px] sm:max-w-none">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                <Shield size={15} className="sm:size-[18px] stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-stone-900 text-xs sm:text-sm block leading-tight">{t.trustText}</span>
                <span className="text-[8px] sm:text-[10px] font-bold text-stone-400 block uppercase tracking-wide">{t.trustSubtext}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Interactive 360° Virtual Tour Area */}
        <div className="max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ThreeSixtyViewer />
          </motion.div>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 items-stretch">
            {t.media && t.media.map((item: any, index: number) => {
              const isVideo = item.type === 'video';
              
              return (
                <motion.div 
                  key={index}
                  layoutId={`media-card-container-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setInitialIndex(index);
                    setActiveMediaIndex(index);
                  }}
                  className="flex flex-col gap-5 w-full md:w-[calc(50%-1.5rem)] max-w-2xl group cursor-pointer"
                >
                  <div className="aspect-video rounded-[32px] overflow-hidden relative shadow-2xl bg-stone-950 border-4 border-stone-800 transition-all duration-500 group-hover:border-brand-yellow/35 group-hover:scale-[1.015]">
                    {isVideo ? (
                      <div className="w-full h-full pointer-events-none select-none">
                        <VideoPlayer url={item.url} title={item.description} autoplay={false} />
                      </div>
                    ) : (
                      <img 
                        src={item.url} 
                        alt={item.description || `Virtual Tour ${index + 1}`} 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    
                    {/* Centered hover overlay for interactive feedback */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-350" />

                    {/* Left corner badge */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-stone-200 border border-white/10 pointer-events-none">
                      {isVideo ? (lang === 'am' ? 'ቪዲዮ' : 'Video') : (lang === 'am' ? 'ፎቶ' : 'Photo')}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-stone-350 text-center text-base font-medium px-4 leading-relaxed group-hover:text-stone-100 transition-colors font-sans">
                      {item.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-5">
            <Link 
              to="/book-tour" 
              className="btn-yellow px-10 py-4.5 text-base font-black tracking-wider uppercase inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95 duration-350 shadow-lg shadow-brand-yellow/10"
            >
              <Calendar size={16} className="stroke-[2.5]" />
              {t.schedule}
            </Link>
          </div>
        </div>

        {/* Lightbox / Full Screen Modal Viewer */}
        <AnimatePresence>
          {activeMediaIndex !== null && t.media && t.media[activeMediaIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-[10000] bg-stone-950/98 backdrop-blur-md flex flex-col items-center justify-center select-none"
            >
              {/* Top Controls Bar */}
              <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
                <div className="text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow font-sans block mb-0.5">
                    {lang === 'am' ? 'ሙሉ ማሳያ' : 'FULL SCREEN VIEWER'}
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    {activeMediaIndex + 1} / {t.media.length}
                  </span>
                </div>
              </div>
                
              {/* Highly prominent, easily clickable global close button specifically optimized for mobile notch/margins */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[10005] w-14 h-14 bg-stone-900/95 border-2 border-white/25 flex items-center justify-center rounded-full text-white transition-all hover:bg-red-600 hover:border-red-600 hover:scale-110 active:scale-90 cursor-pointer shadow-2xl"
                title={lang === 'am' ? 'ዝጋ' : 'Close'}
              >
                <X size={26} className="stroke-[2.5]" />
              </button>

              {/* Main Content Area - True expansion transition container! Optimized for mobile with larger viewport height */}
              <motion.div 
                layoutId={`media-card-container-${initialIndex}`}
                onClick={(e) => e.stopPropagation()} 
                className="relative max-w-4xl lg:max-w-5xl w-[94vw] sm:w-[86vw] md:w-[80vw] h-[68vh] xs:h-[75vh] sm:h-[80vh] flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-white/15 bg-stone-950 z-10 p-1 sm:p-2"
              >

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMediaIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {t.media[activeMediaIndex].type === 'video' ? (
                      <VideoPlayer url={t.media[activeMediaIndex].url} title={t.media[activeMediaIndex].description} autoplay={true} />
                    ) : (
                      <img
                        src={t.media[activeMediaIndex].url}
                        alt={t.media[activeMediaIndex].description || "Lightbox View"}
                        className="w-full h-full object-contain rounded-2xl select-none"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Bottom Caption Area */}
              <div className="absolute bottom-0 inset-x-0 p-6 pb-8 text-center z-50 bg-gradient-to-t from-black/95 to-transparent">
                {t.media[activeMediaIndex].description && (
                  <p className="text-white text-base md:text-xl font-editorial font-bold max-w-2xl mx-auto px-4 leading-relaxed tracking-tight text-center">
                    {t.media[activeMediaIndex].description}
                  </p>
                )}
                <p className="text-[10px] text-stone-400 font-sans mt-3.5 tracking-wide max-w-sm mx-auto bg-black/45 backdrop-blur-sm py-1.5 px-3 rounded-full border border-white/5">
                  {lang === 'am' ? 'ለማሰስ የቀስት ቁልፎችን ወይም የጎን ቀስቶችን ይጠቀሙ' : 'Swipe/Arrow keys or click the side buttons to browse'}
                </p>
              </div>

              {/* Next/Previous Floating Side Buttons - hidden or styled compactly on mobile */}
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/60 hover:bg-brand-green border border-white/10 flex items-center justify-center rounded-full hover:text-white hover:scale-105 active:scale-95 transition-all text-white/90 cursor-pointer z-50 shadow-md"
                title={lang === 'am' ? 'ቀደመ' : 'Previous'}
              >
                <ChevronLeft size={20} className="sm:size-6 stroke-[2.5]" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black/60 hover:bg-brand-green border border-white/10 flex items-center justify-center rounded-full hover:text-white hover:scale-105 active:scale-95 transition-all text-white/90 cursor-pointer z-50 shadow-md"
                title={lang === 'am' ? 'ቀጣይ' : 'Next'}
              >
                <ChevronRight size={20} className="sm:size-6 stroke-[2.5]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
