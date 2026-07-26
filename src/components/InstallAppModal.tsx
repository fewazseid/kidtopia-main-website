import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, CheckCircle2, Share2, PlusSquare, Apple, Smartphone, ShieldCheck, ExternalLink, ArrowDown } from 'lucide-react';
import { Language } from '../translations';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose, lang }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  const isIOS = typeof navigator !== 'undefined' && (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const markAppInstalled = () => {
    localStorage.setItem('kidtopia_app_installed', 'true');
    localStorage.setItem('kidtopia_install_prompt_dismissed', 'true');
    setIsStandalone(true);
    setInstalledSuccess(true);
    window.dispatchEvent(new Event('appinstalled'));
    window.dispatchEvent(new Event('storage'));
  };

  const handleClose = () => {
    localStorage.setItem('kidtopia_install_prompt_dismissed', 'true');
    onClose();
  };

  // Lock background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const checkIsInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true ||
        localStorage.getItem('kidtopia_app_installed') === 'true';
      if (standalone) {
        setIsStandalone(true);
      }
    };

    checkIsInstalled();

    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      markAppInstalled();
      (window as any).deferredPwaPrompt = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isOpen]);

  const handleOpenInSafari = () => {
    window.open('https://kidtopia-main-u5x6pj.laravel.cloud/login', '_blank');
  };

  const handleInstallClick = async () => {
    // On Android / Chrome / Desktop with native prompt API support
    const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;
    if (activePrompt && typeof activePrompt.prompt === 'function') {
      try {
        activePrompt.prompt();
        const userChoice = await activePrompt.userChoice;
        if (userChoice && userChoice.outcome === 'accepted') {
          markAppInstalled();
          (window as any).deferredPwaPrompt = null;
          setDeferredPrompt(null);
          return;
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    } else {
      markAppInstalled();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm sm:max-w-md bg-brand-cream border border-stone-200/90 rounded-[32px] p-6 sm:p-7 shadow-2xl text-stone-800 relative overflow-hidden my-auto"
          >
            {/* Ambient Background Glows in Kidtopia Logo Colors */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-green/15 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-white/80 hover:bg-white rounded-full transition cursor-pointer z-10 shadow-sm border border-stone-200/60"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header with Authentic Kidtopia Logo Colors */}
            <div className="text-center pt-1">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white border border-stone-200/80 shadow-md flex items-center justify-center p-2">
                {isIOS ? <Apple className="text-brand-green" size={32} /> : <Smartphone className="text-brand-green" size={32} />}
              </div>

              {/* Colorful Kidtopia Logo matching Header styling */}
              <div className="font-display font-black text-2xl sm:text-3xl tracking-tighter flex items-center justify-center gap-0.5">
                <span className="text-brand-orange">K</span>
                <span className="text-brand-yellow">I</span>
                <span className="text-brand-green">D</span>
                <span className="text-brand-teal">T</span>
                <span className="text-brand-tan">O</span>
                <span className="text-brand-orange">P</span>
                <span className="text-brand-yellow">I</span>
                <span className="text-brand-green">A</span>
              </div>

              <p className="text-[9px] sm:text-[10px] font-display font-bold tracking-widest uppercase text-brand-green mt-0.5">
                {lang === 'en' ? 'International Daycare & Preschool' : 'አለምአቀፍ ህጻናት ማቆያ እና ቅድመ-ትምህርት ቤት'}
              </p>

              <p className="text-stone-600 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Install Kidtopia App on your iPhone or mobile device.'
                  : 'የኪድቶፒያን አፕሊኬሽን በስልክዎ ላይ በመጫን በፍጥነት ይጠቀሙ።'}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {/* Special callout when running inside preview iframe on iPhone */}
              {isInIframe && (
                <div className="bg-brand-yellow/20 border border-brand-yellow/40 p-3.5 rounded-2xl text-xs text-stone-800 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-stone-900">
                    <ExternalLink size={15} className="text-brand-orange shrink-0" />
                    <span>{lang === 'en' ? 'Open in Safari Tab:' : 'በSafari አዲስ ታብ ይክፈቱ:'}</span>
                  </p>
                  <p className="text-[11px] text-stone-600 leading-normal">
                    {lang === 'en'
                      ? 'iOS Safari requires viewing in a full browser tab to show the bottom toolbar and Add to Home Screen.'
                      : 'በiPhone ላይ ለመጫን መጀመሪያ በSafari አዲስ ታብ መከፈት አለበት።'}
                  </p>
                  <button
                    onClick={handleOpenInSafari}
                    className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer text-xs"
                  >
                    <ExternalLink size={14} />
                    <span>{lang === 'en' ? 'Open in Safari Tab' : 'በSafari አዲስ ታብ ክፈት'}</span>
                  </button>
                </div>
              )}

              {/* iPhone / iOS Direct Safari Instructions */}
              {isIOS && (
                <div className="bg-white border border-stone-200/90 p-4 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
                    <Apple size={16} className="text-stone-800" />
                    <span>{lang === 'en' ? 'iPhone Installation Instructions:' : 'በiPhone ላይ እንዴት ይጫናል?'}</span>
                  </div>

                  <ol className="space-y-2.5 text-stone-700 text-xs">
                    <li className="flex items-start gap-2.5 bg-brand-cream/80 p-2.5 rounded-xl border border-stone-200/60">
                      <span className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{lang === 'en' ? 'Tap Safari Share Button' : 'በSafari ታችኛው ክፍል Share ይጫኑ'}</span>
                          <Share2 size={14} className="text-brand-orange shrink-0" />
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {lang === 'en' ? 'Located on the bottom toolbar of Safari.' : 'በ Safari ታችኛው ባር ላይ የሚገኘውን አዶ ይጫኑ።'}
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5 bg-brand-cream/80 p-2.5 rounded-xl border border-stone-200/60">
                      <span className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="font-bold text-stone-900 flex items-center gap-1.5">
                          <span>{lang === 'en' ? 'Tap "Add to Home Screen"' : '"Add to Home Screen" ይምረጡ'}</span>
                          <PlusSquare size={14} className="text-brand-green shrink-0" />
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {lang === 'en' ? 'Scroll down and tap Add.' : 'በመጨረሻም "Add" በማለት ይጫኑ።'}
                        </p>
                      </div>
                    </li>
                  </ol>

                  {/* Visual Animated Indicator pointing down towards Safari Share button */}
                  <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-brand-orange font-bold animate-bounce">
                    <ArrowDown size={14} />
                    <span>{lang === 'en' ? 'Tap Share at bottom of Safari screen' : 'በSafari ታችኛው ክፍል Share ይጫኑ'}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col gap-2">
                <a
                  href="https://kidtopia-main-u5x6pj.laravel.cloud/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-brand-orange/30 text-center"
                >
                  <ExternalLink size={16} />
                  <span>{lang === 'en' ? 'Open Kidtopia Portal (kidtopia-main-u5x6pj.laravel.cloud)' : 'የኪድቶፒያ ሊንክ ክፈት'}</span>
                </a>

                {!isIOS && (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer border border-brand-green/30"
                  >
                    <Download size={16} />
                    <span>{lang === 'en' ? 'Install App Prompt' : 'አፕሊኬሽኑን ጫን'}</span>
                  </button>
                )}

                {/* Confirm button */}
                <button
                  onClick={() => {
                    markAppInstalled();
                    handleClose();
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-2xl border border-stone-200 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 size={15} className="text-brand-green" />
                  <span>{lang === 'en' ? 'Done! Added to Home Screen' : 'ተጭኗል! ወደ Home Screen አክያለሁ'}</span>
                </button>
              </div>

              {/* Security guarantee footer */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-stone-500 font-medium">
                <ShieldCheck size={13} className="text-brand-green" />
                <span>{lang === 'en' ? 'Official Kidtopia Web Application' : 'የኪድቶፒያ ኦፊሴላዊ ዌብ አፕሊኬሽን'}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
