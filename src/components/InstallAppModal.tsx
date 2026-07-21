import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, CheckCircle2, Sparkles, Smartphone, Share2, PlusSquare, ArrowRight, Monitor } from 'lucide-react';
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

  useEffect(() => {
    // Check if app is running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDirectInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalledSuccess(true);
        setDeferredPrompt(null);
      }
    } else {
      // If native prompt not captured (e.g., iOS Safari or already triggered)
      const ua = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/i.test(ua);
      if (isIOS) {
        alert(
          lang === 'en'
            ? 'To install Kidtopia on iOS Safari:\n1. Tap the Share button at the bottom of Safari.\n2. Tap "Add to Home Screen".'
            : 'በiOS Safari ላይ Kidtopia ለመጫን:\n1. በSafari ታችኛው ክፍል Share ምልክቱን ይጫኑ።\n2. "Add to Home Screen" የሚለውን ይምረጡ።'
        );
      } else {
        alert(
          lang === 'en'
            ? 'To install on this browser:\nOpen your browser menu (⋮ or ⋯) and select "Install Kidtopia" or "Add to Home Screen".'
            : 'በዚህ ብራውዘር ላይ ለመጫን:\nየብራውዘሩን ሜኑ (⋮) በመጫን "Install Kidtopia" ወይም "Add to Home Screen" ይምረጡ።'
        );
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden"
          >
            {/* Background glowing gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-teal/15 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-800/60 hover:bg-stone-800 rounded-full transition"
            >
              <X size={18} />
            </button>

            <div className="text-center pt-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-brand-orange via-brand-yellow to-brand-green p-0.5 shadow-lg">
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
                  <Download className="text-brand-orange" size={28} />
                </div>
              </div>

              <h2 className="text-xl font-black font-display text-white">
                {lang === 'en' ? 'Download Kidtopia App' : 'የኪድቶፒያ አፕሊኬሽን አውርድ'}
              </h2>
              <p className="text-stone-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Get the official Kidtopia web app on your phone or desktop for fast, 1-tap access.'
                  : 'የኪድቶፒያን አፕሊኬሽን በስልክዎ ወይም በኮምፒተርዎ ላይ በመጫን በፍጥነት ይጠቀሙ።'}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {isStandalone || installedSuccess ? (
                <div className="bg-brand-green/15 border border-brand-green/30 p-4 rounded-2xl flex items-center justify-center gap-2 text-brand-green text-sm font-bold">
                  <CheckCircle2 size={20} />
                  <span>{lang === 'en' ? 'Kidtopia App is Already Installed' : 'አፕሊኬሽኑ በስኬት ተጭኗል'}</span>
                </div>
              ) : (
                <button
                  onClick={handleDirectInstall}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow text-stone-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                >
                  <Download size={18} />
                  <span>{lang === 'en' ? 'Download & Install Now' : 'አሁኑኑ አውርድና ጫን'}</span>
                  <Sparkles size={16} />
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-stone-400 hover:text-white font-medium transition cursor-pointer"
              >
                {lang === 'en' ? 'Continue in Browser' : 'በብራውዘር ቀጥል'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
