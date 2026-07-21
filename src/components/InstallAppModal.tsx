import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  ExternalLink, 
  Info, 
  Compass, 
  Apple, 
  Chrome, 
  Globe,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Language } from '../translations';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

type DeviceCategory = 'mobile' | 'tablet' | 'laptop';
type OSPlatform = 'ios' | 'android' | 'chrome_desktop' | 'safari_mac';

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose, lang }) => {
  // Auto-detect device category based on screen size and user agent
  const [detectedCategory, setDetectedCategory] = useState<DeviceCategory>('mobile');
  const [activeCategory, setActiveCategory] = useState<DeviceCategory>('mobile');
  const [activeOS, setActiveOS] = useState<OSPlatform>('ios');
  
  // PWA beforeinstallprompt event handling
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Initial Device Detection based on screen size & UA
    const detectDevice = () => {
      const width = window.innerWidth;
      const ua = navigator.userAgent.toLowerCase();
      
      const isMobileUA = /iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua);
      const isTabletUA = /ipad|android(?!.*mobile)|tablet|kindle|playbook|silk/i.test(ua);

      if (isTabletUA || (width >= 640 && width <= 1024 && 'ontouchstart' in window)) {
        setDetectedCategory('tablet');
        setActiveCategory('tablet');
        if (/ipad|macintosh/i.test(ua) && 'ontouchend' in document) {
          setActiveOS('ios');
        } else {
          setActiveOS('android');
        }
      } else if (isMobileUA || width < 640) {
        setDetectedCategory('mobile');
        setActiveCategory('mobile');
        if (/iphone|ipad|ipod/i.test(ua)) {
          setActiveOS('ios');
        } else {
          setActiveOS('android');
        }
      } else {
        setDetectedCategory('laptop');
        setActiveCategory('laptop');
        if (/macintosh|mac os x/i.test(ua)) {
          setActiveOS('safari_mac');
        } else {
          setActiveOS('chrome_desktop');
        }
      }
    };

    detectDevice();

    const handleResize = () => {
      // Re-evaluate on window resize
      const width = window.innerWidth;
      if (width < 640 && detectedCategory !== 'mobile') {
        setDetectedCategory('mobile');
      } else if (width >= 640 && width <= 1024 && detectedCategory !== 'tablet') {
        setDetectedCategory('tablet');
      } else if (width > 1024 && detectedCategory !== 'laptop') {
        setDetectedCategory('laptop');
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync OS default when changing device category tab
  const handleCategoryChange = (cat: DeviceCategory) => {
    setActiveCategory(cat);
    if (cat === 'mobile' || cat === 'tablet') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod|macintosh/i.test(ua)) {
        setActiveOS('ios');
      } else {
        setActiveOS('android');
      }
    } else {
      const ua = navigator.userAgent.toLowerCase();
      if (/macintosh|mac os x/i.test(ua)) {
        setActiveOS('safari_mac');
      } else {
        setActiveOS('chrome_desktop');
      }
    }
  };

  const handleNativeInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallSuccess(true);
      setDeferredPrompt(null);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kidtopia Daycare & Preschool App',
          text: 'Download and install the Kidtopia International Daycare App on your device!',
          url: window.location.origin,
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-stone-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-[28px] sm:rounded-[36px] shadow-2xl border border-stone-200/80 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-brand-green via-brand-teal to-stone-800 text-white p-6 sm:p-8 relative overflow-hidden shrink-0">
            {/* Background vector accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-bl-full pointer-events-none transform translate-x-10 -translate-y-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-orange/20 rounded-tr-full pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 flex items-start gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white p-1.5 shadow-xl shrink-0 flex items-center justify-center border border-white/30">
                <img src="/favicon.png" alt="Kidtopia App Icon" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-brand-cream border border-white/20 mb-2">
                  <Sparkles size={11} className="text-brand-yellow animate-spin" />
                  <span>{lang === 'en' ? 'PWA Web App Download' : 'የዌብ አፕሊኬሽን ጭነት'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-tight">
                  {lang === 'en' ? 'Install Kidtopia App' : 'የኪድቶፒያ አፕሊኬሽንን ይጫኑ'}
                </h2>
                <p className="text-stone-200 text-xs sm:text-sm font-sans mt-1 max-w-xl opacity-90 leading-relaxed font-medium">
                  {lang === 'en' 
                    ? 'Access live classroom feeds, daily attendance, virtual tours, and instant notifications directly from your home screen without downloading from app stores.'
                    : 'ከአፕ ስቶሮች ሳይወርዱ የቀጥታ ስርጭቶችን፣ የክትትል ሪፖርቶችን እና ማስታወቂያዎችን ከስልክዎ የመነሻ ገጽ በቀጥታ ያግኙ።'}
                </p>
              </div>
            </div>
          </div>

          {/* Standalone Status or Native Install Prompt Banner */}
          {isStandalone ? (
            <div className="bg-brand-green/10 border-b border-brand-green/20 px-6 py-3 flex items-center justify-between gap-3 text-brand-green text-xs font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'You are currently viewing Kidtopia inside the installed Web App!'
                    : 'አሁን በኪድቶፒያ የተጫነ አፕሊኬሽን ውስጥ ይገኛሉ!'}
                </span>
              </div>
            </div>
          ) : deferredPrompt ? (
            <div className="bg-brand-orange/10 border-b border-brand-orange/20 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-stone-900 text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2">
                <Download size={18} className="text-brand-orange animate-bounce shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Your browser supports instant 1-click installation!'
                    : 'ብራውዘርዎ በአንድ ጠቅታ የመጫን እድል አለው!'}
                </span>
              </div>
              <button
                onClick={handleNativeInstallClick}
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                <span>{lang === 'en' ? 'Install Now (1-Click)' : 'አሁኑኑ ጫን (1-ጠቅታ)'}</span>
              </button>
            </div>
          ) : null}

          {/* Modal Scrollable Body */}
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
            
            {/* Step 1: Device Category Selection Tabs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-stone-500 font-accent">
                  {lang === 'en' ? 'Step 1: Select Your Device Type' : 'ደረጃ 1: የሜሴጅ መሣሪያዎን ይምረጡ'}
                </span>
                <span className="text-[11px] font-bold text-brand-teal bg-brand-teal/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Info size={12} />
                  <span>
                    {lang === 'en' 
                      ? `Detected: ${detectedCategory.toUpperCase()}` 
                      : `የተለየው: ${detectedCategory === 'mobile' ? 'ሞባይል' : detectedCategory === 'tablet' ? 'ታብሌት' : 'ላፕቶፕ'}`}
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
                {/* Mobile Button */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('mobile')}
                  className={`py-3 px-2 sm:px-4 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 font-display font-bold text-xs sm:text-sm transition cursor-pointer relative ${
                    activeCategory === 'mobile'
                      ? 'bg-white text-stone-900 shadow-md border border-stone-200/80 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <Smartphone size={18} className={activeCategory === 'mobile' ? 'text-brand-orange' : ''} />
                  <span>{lang === 'en' ? 'Mobile Phone' : 'ሞባይል ስልክ'}</span>
                  {detectedCategory === 'mobile' && (
                    <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-brand-orange animate-ping absolute top-2 right-2" />
                  )}
                </button>

                {/* Tablet Button */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('tablet')}
                  className={`py-3 px-2 sm:px-4 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 font-display font-bold text-xs sm:text-sm transition cursor-pointer relative ${
                    activeCategory === 'tablet'
                      ? 'bg-white text-stone-900 shadow-md border border-stone-200/80 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <Tablet size={18} className={activeCategory === 'tablet' ? 'text-brand-teal' : ''} />
                  <span>{lang === 'en' ? 'Tablet' : 'ታብሌት'}</span>
                  {detectedCategory === 'tablet' && (
                    <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-brand-teal animate-ping absolute top-2 right-2" />
                  )}
                </button>

                {/* Laptop / Desktop Button */}
                <button
                  type="button"
                  onClick={() => handleCategoryChange('laptop')}
                  className={`py-3 px-2 sm:px-4 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 font-display font-bold text-xs sm:text-sm transition cursor-pointer relative ${
                    activeCategory === 'laptop'
                      ? 'bg-white text-stone-900 shadow-md border border-stone-200/80 font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                  }`}
                >
                  <Monitor size={18} className={activeCategory === 'laptop' ? 'text-brand-green' : ''} />
                  <span>{lang === 'en' ? 'Laptop / PC' : 'ላፕቶፕ / ኮምፒዩተር'}</span>
                  {detectedCategory === 'laptop' && (
                    <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-brand-green animate-ping absolute top-2 right-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: OS Sub-selection */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-stone-500 font-accent">
                  {lang === 'en' ? 'Step 2: Choose Operating System / Browser' : 'ደረጃ 2: ኦፐሬቲንግ ሲስተም ወይም ብራውዘር ይምረጡ'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeCategory !== 'laptop' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveOS('ios')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                        activeOS === 'ios'
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Apple size={14} />
                      <span>{activeCategory === 'tablet' ? 'Apple iPad (Safari)' : 'iPhone (Safari)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOS('android')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                        activeOS === 'android'
                          ? 'bg-brand-green text-white border-brand-green shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Chrome size={14} />
                      <span>{activeCategory === 'tablet' ? 'Android Tablet (Chrome)' : 'Android Phone (Chrome)'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveOS('chrome_desktop')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                        activeOS === 'chrome_desktop'
                          ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Chrome size={14} />
                      <span>Google Chrome / Microsoft Edge / Brave</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOS('safari_mac')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                        activeOS === 'safari_mac'
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Apple size={14} />
                      <span>macOS Safari (Add to Dock)</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Step-by-step Installation Guide Cards depending on Category & OS */}
            <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                  <h3 className="font-display font-black text-stone-900 text-base">
                    {lang === 'en' ? 'Step-by-Step Installation Instructions' : 'ደረጃ በደረጃ የአጫጫን መመሪያ'}
                  </h3>
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                  {activeCategory === 'mobile' ? '📱 Mobile Guide' : activeCategory === 'tablet' ? '📱 Tablet Guide' : '💻 Desktop Guide'}
                </span>
              </div>

              {/* GUIDES IMPLEMENTATION */}
              {/* 1. MOBILE - iOS */}
              {activeCategory === 'mobile' && activeOS === 'ios' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">1</div>
                    <div className="flex items-center gap-2 text-brand-teal font-black text-xs">
                      <Compass size={16} />
                      <span>{lang === 'en' ? 'Open in Safari' : 'በSafari ይክፈቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en' 
                        ? 'Ensure you are viewing this page inside the official Apple Safari browser on your iPhone.' 
                        : 'ይህንን ገጽ በiPhone ስልክዎ ኦፊሴላዊ የSafari ብራውዘር መክፈትዎን ያረጋግጡ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-bold text-xs flex items-center justify-center">2</div>
                    <div className="flex items-center gap-2 text-brand-orange font-black text-xs">
                      <Share2 size={16} />
                      <span>{lang === 'en' ? 'Tap Share Icon' : 'Share የሚለውን ምልክት ይጫኑ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Tap the Share icon (square with an up arrow) located at the bottom menu bar of Safari.'
                        : 'ከስክሪኑ ግርጌ በSafari ሜኑ ላይ የሚገኘውን የShare ምልክት (ቀስት ያለው ሳጥን) ይጫኑ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-green text-white font-bold text-xs flex items-center justify-center">3</div>
                    <div className="flex items-center gap-2 text-brand-green font-black text-xs">
                      <PlusSquare size={16} />
                      <span>{lang === 'en' ? 'Add to Home Screen' : 'Add to Home Screen ይምረጡ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Scroll down the options list and select "Add to Home Screen", then tap "Add" in the top right.'
                        : 'ወደ ታች ዝቅ ብለው "Add to Home Screen" የሚለውን መርጠው በቀኝ በኩል "Add" የሚለውን ይጫኑ።'}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. MOBILE - Android */}
              {activeCategory === 'mobile' && activeOS === 'android' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-green text-white font-bold text-xs flex items-center justify-center">1</div>
                    <div className="flex items-center gap-2 text-brand-green font-black text-xs">
                      <Chrome size={16} />
                      <span>{lang === 'en' ? 'Open Chrome Browser' : 'በChrome ይክፈቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Open this webpage inside Google Chrome or Samsung Internet browser.'
                        : 'ገፁን በGoogle Chrome ወይም በSamsung Internet ብራውዘር ይክፈቱ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">2</div>
                    <div className="flex items-center gap-2 text-stone-900 font-black text-xs">
                      <MoreVertical size={16} />
                      <span>{lang === 'en' ? 'Tap Three Dots (⋮)' : 'ሦስቱን ነጥቦች (⋮) ይጫኑ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Tap the three vertical dots (⋮) in the top right corner of Chrome.'
                        : 'በChrome የላይኛው ቀኝ ጥግ ላይ የሚገኙትን ሦስቱን ነጥቦች (⋮) ይጫኑ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-bold text-xs flex items-center justify-center">3</div>
                    <div className="flex items-center gap-2 text-brand-orange font-black text-xs">
                      <Download size={16} />
                      <span>{lang === 'en' ? 'Tap "Install App"' : '"Install app" የሚለውን ይጫኑ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Select "Install app" or "Add to Home screen" and confirm the install dialog.'
                        : '"Install app" ወይም "Add to Home screen" የሚለውን መርጠው መጫኑን ያረጋግጡ።'}
                    </p>
                  </div>
                </div>
              )}

              {/* 3. TABLET - iPad */}
              {activeCategory === 'tablet' && activeOS === 'ios' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-teal text-white font-bold text-xs flex items-center justify-center">1</div>
                    <div className="flex items-center gap-2 text-brand-teal font-black text-xs">
                      <Tablet size={16} />
                      <span>{lang === 'en' ? 'Open Safari on iPad' : 'በiPad Safari ይክፈቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Use Safari on your iPad to take advantage of the expanded tablet dashboard.'
                        : 'የታብሌቱን ሰፊ ስክሪን ለመጠቀም በiPad Safari ብራውዘር ገጹን ይክፈቱ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">2</div>
                    <div className="flex items-center gap-2 text-stone-900 font-black text-xs">
                      <Share2 size={16} />
                      <span>{lang === 'en' ? 'Top Share Button' : 'የላይኛውን Share ይጫኑ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Look at the top right header in Safari next to the address bar and tap the Share icon.'
                        : 'በSafari የላይኛው አድራሻ አጠገብ የሚገኘውን የShare ምልክት ይጫኑ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-green text-white font-bold text-xs flex items-center justify-center">3</div>
                    <div className="flex items-center gap-2 text-brand-green font-black text-xs">
                      <PlusSquare size={16} />
                      <span>{lang === 'en' ? 'Add to Home Screen' : 'Add to Home Screen ይምረጡ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Tap "Add to Home Screen" and click "Add". Launch Kidtopia fullscreen on iPad!'
                        : '"Add to Home Screen" የሚለውን መርጠው "Add" ይበሉ። ኪድቶፒያ በሙሉ ስክሪን ይከፈታል!'}
                    </p>
                  </div>
                </div>
              )}

              {/* 4. TABLET - Android Tablet */}
              {activeCategory === 'tablet' && activeOS === 'android' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-green text-white font-bold text-xs flex items-center justify-center">1</div>
                    <div className="flex items-center gap-2 text-brand-green font-black text-xs">
                      <Tablet size={16} />
                      <span>{lang === 'en' ? 'Open Chrome Tablet' : 'በታብሌት Chrome ይክፈቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Open this URL inside Chrome on your Android tablet device.'
                        : 'በአንድሮይድ ታብሌትዎ ላይ በChrome ብራውዘር ገጹን ይክፈቱ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">2</div>
                    <div className="flex items-center gap-2 text-stone-900 font-black text-xs">
                      <MoreVertical size={16} />
                      <span>{lang === 'en' ? 'Menu (⋮)' : 'ሜኑ (⋮)'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Tap the three-dots menu icon (⋮) on Chrome’s top action bar.'
                        : 'በChrome የላይኛው እርምጃ ባር ላይ ሦስቱን ነጥቦች (⋮) ይጫኑ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-bold text-xs flex items-center justify-center">3</div>
                    <div className="flex items-center gap-2 text-brand-orange font-black text-xs">
                      <Download size={16} />
                      <span>{lang === 'en' ? 'Install Kidtopia App' : 'ኪድቶፒያን ጫን'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Click "Install app" or "Add to Home Screen". Enjoy tablet-optimized views!'
                        : '"Install app" የሚለውን ይጫኑ። በታብሌት የተስተካከለውን ገጽ ይደሰቱበት!'}
                    </p>
                  </div>
                </div>
              )}

              {/* 5. LAPTOP / PC - Chrome / Edge */}
              {activeCategory === 'laptop' && activeOS === 'chrome_desktop' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-bold text-xs flex items-center justify-center">1</div>
                    <div className="flex items-center gap-2 text-brand-orange font-black text-xs">
                      <Globe size={16} />
                      <span>{lang === 'en' ? 'Check Address Bar' : 'የአድራሻ ባሩን ይመልከቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Look at the right side of your Chrome / Edge address bar at the top of your screen.'
                        : 'በስክሪኑ ላይ በChrome / Edge የአድራሻ ባር በቀኝ በኩል ያለውን ምልክት ይመልከቱ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-teal text-white font-bold text-xs flex items-center justify-center">2</div>
                    <div className="flex items-center gap-2 text-brand-teal font-black text-xs">
                      <Download size={16} />
                      <span>{lang === 'en' ? 'Click Install Icon' : 'የጭነት ምልክቱን ይጫኑ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Click the computer/download icon (⊕ or 🌁) in the URL bar, or open Browser Menu (⋮) -> "Save & Share" -> "Install Kidtopia".'
                        : 'በURL ባሩ ላይ የመጫኛ ምልክቱን ይጫኑ ወይም በሜኑ (⋮) ውስጥ "Install Kidtopia" የሚለውን ይምረጡ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-green text-white font-bold text-xs flex items-center justify-center">3</div>
                    <div className="flex items-center gap-2 text-brand-green font-black text-xs">
                      <Monitor size={16} />
                      <span>{lang === 'en' ? 'Launch Desktop App' : 'የዴስክቶፕ አፕሊኬሽኑን ይክፈቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Confirm "Install". Kidtopia will open as a standalone desktop app on Windows/Mac!'
                        : '"Install" ይበሉ። ኪድቶፒያ እንደ ራሱን የቻለ የዴስክቶፕ አፕሊኬሽን በኮምፒዩተርዎ ላይ ይከፈታል!'}
                    </p>
                  </div>
                </div>
              )}

              {/* 6. LAPTOP / PC - Safari macOS */}
              {activeCategory === 'laptop' && activeOS === 'safari_mac' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold text-xs flex items-center justify-center">1</div>
                    <div className="flex items-center gap-2 text-stone-900 font-black text-xs">
                      <Apple size={16} />
                      <span>{lang === 'en' ? 'Open Mac Safari' : 'በMac Safari ይክፈቱ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Open this site in Safari on macOS Sonoma or newer.'
                        : 'በMac ኮምፒዩተርዎ ላይ በSafari ብራውዘር ገጹን ይክፈቱ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange text-white font-bold text-xs flex items-center justify-center">2</div>
                    <div className="flex items-center gap-2 text-brand-orange font-black text-xs">
                      <Layers size={16} />
                      <span>{lang === 'en' ? 'File -> Add to Dock' : 'File -> Add to Dock ይጫኑ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Click "File" in top Mac menu bar, then select "Add to Dock..."'
                        : 'በላይኛው የMac ሜኑ ላይ "File" ተጭነው "Add to Dock..." የሚለውን ይምረጡ።'}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm space-y-2.5 relative">
                    <div className="w-8 h-8 rounded-lg bg-brand-green text-white font-bold text-xs flex items-center justify-center">3</div>
                    <div className="flex items-center gap-2 text-brand-green font-black text-xs">
                      <CheckCircle2 size={16} />
                      <span>{lang === 'en' ? 'Ready on Mac Dock' : 'በMac Dock ላይ ዝግጁ'}</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium leading-relaxed">
                      {lang === 'en'
                        ? 'Click "Add". Kidtopia icon is now pinned right on your Mac Dock!'
                        : '"Add" ይበሉ። የኪድቶፒያ አፕሊኬሽን በMac Dock ላይ ይቀመጣል።'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions & Share Link Box */}
            <div className="p-4 sm:p-5 bg-stone-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl text-brand-orange">
                  <Share2 size={20} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {lang === 'en' ? 'Share App with Family' : 'አፕሊኬሽኑን ለቤተሰብ ያካፍሉ'}
                  </h4>
                  <p className="text-xs text-stone-400 font-medium">
                    {lang === 'en'
                      ? 'Send this Web App link to family members so they can install Kidtopia on their devices.'
                      : 'ሌሎች የቤተሰብ አባላትም በስልካቸው ለመጫን ይህንን ሊንክ ይላኩላቸው።'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 size={14} className="text-brand-green" />
                      <span>{lang === 'en' ? 'Link Copied!' : 'ተቀድቷል!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>{lang === 'en' ? 'Copy Link' : 'ሊንክ ቅዳ'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNativeShare}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ExternalLink size={14} />
                  <span>{lang === 'en' ? 'Share Link' : 'አካፍል'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:px-8 border-t border-stone-200 bg-stone-50 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-semibold text-stone-500">
              {lang === 'en' 
                ? 'Kidtopia Web App v2.4 • Progressive Web App' 
                : 'ኪድቶፒያ ዌብ አፕሊኬሽን v2.4'}
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {lang === 'en' ? 'Close Guide' : 'ዝጋ'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
