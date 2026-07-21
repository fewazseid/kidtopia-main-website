import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, CheckCircle2, Sparkles, ExternalLink, Share2, PlusSquare, MoreVertical, Smartphone, Monitor } from 'lucide-react';
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
  const [showManualSteps, setShowManualSteps] = useState<boolean>(false);
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  useEffect(() => {
    // Check if app is running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Check global captured prompt if already caught
    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
    }

    // Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isOpen]);

  const downloadAppShortcutFile = () => {
    const currentUrl = window.location.href;
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Kidtopia Daycare & Preschool</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="manifest" href="${window.location.origin}/manifest.json">
  <meta name="theme-color" content="#3A5B32">
  <script>
    window.location.href = "${currentUrl}";
  </script>
</head>
<body style="font-family:sans-serif; text-align:center; padding:40px; background:#f8f6f0; color:#1c1917;">
  <h2>Redirecting to Kidtopia Web App...</h2>
  <p><a href="${currentUrl}">Click here if not redirected automatically.</a></p>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KidtopiaAppLauncher.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDirectInstall = async () => {
    const activePrompt = deferredPrompt || (window as any).deferredPwaPrompt;

    if (activePrompt) {
      try {
        activePrompt.prompt();
        const { outcome } = await activePrompt.userChoice;
        if (outcome === 'accepted') {
          setInstalledSuccess(true);
          setDeferredPrompt(null);
          (window as any).deferredPwaPrompt = null;
        }
        return;
      } catch (err) {
        console.error('Error triggering PWA prompt:', err);
      }
    }

    // Trigger fallback shortcut download so a real file download happens
    downloadAppShortcutFile();

    // If inside iframe or prompt unavailable, pop out to dedicated window
    if (isInIframe) {
      window.open(window.location.href, '_blank');
    }

    setShowManualSteps(true);
  };

  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden my-auto"
          >
            {/* Background glowing gradients */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-teal/15 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-800/60 hover:bg-stone-800 rounded-full transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="text-center pt-1">
              <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-gradient-to-tr from-brand-orange via-brand-yellow to-brand-green p-0.5 shadow-lg">
                <div className="w-full h-full bg-stone-900 rounded-[14px] flex items-center justify-center">
                  <Download className="text-brand-orange animate-pulse" size={28} />
                </div>
              </div>

              <h2 className="text-xl font-black font-display text-white">
                {lang === 'en' ? 'Download Kidtopia App' : 'የኪድቶፒያ አፕሊኬሽን አውርድ'}
              </h2>
              <p className="text-stone-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Get the official web app directly on your device for fast 1-tap access.'
                  : 'የኪድቶፒያን አፕሊኬሽን በስልክዎ ወይም በኮምፒተርዎ ላይ በመጫን በፍጥነት ይጠቀሙ።'}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {isStandalone || installedSuccess ? (
                <div className="bg-brand-green/15 border border-brand-green/30 p-4 rounded-2xl flex items-center justify-center gap-2 text-brand-green text-sm font-bold">
                  <CheckCircle2 size={20} />
                  <span>{lang === 'en' ? 'Kidtopia App Installed' : 'አፕሊኬሽኑ ተጭኗል'}</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={handleDirectInstall}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                  >
                    <Download size={18} />
                    <span>{lang === 'en' ? 'Download & Install Now' : 'አሁኑኑ አውርድና ጫን'}</span>
                    <Sparkles size={16} />
                  </button>

                  {isInIframe && (
                    <button
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="w-full py-2.5 px-4 bg-stone-800 hover:bg-stone-700/80 text-stone-200 text-xs font-bold rounded-xl border border-stone-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ExternalLink size={14} className="text-brand-yellow" />
                      <span>{lang === 'en' ? 'Open in App Window to Install' : 'በተለየ መስኮት ይክፈቱ'}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Step instructions if native browser dialog is blocked */}
              {(showManualSteps || !deferredPrompt) && !isStandalone && !installedSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl text-left space-y-2 text-xs"
                >
                  <p className="font-bold text-brand-orange uppercase text-[10px] tracking-wider">
                    {lang === 'en' ? 'Browser Install Steps:' : 'የአጫጫን ደረጃዎች:'}
                  </p>
                  {isIOS ? (
                    <ol className="space-y-1.5 text-stone-300 text-[11px]">
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-stone-800 text-brand-orange flex items-center justify-center font-bold text-[10px]">1</span>
                        <span>{lang === 'en' ? 'Tap Share icon at bottom of Safari' : 'በSafari ታችኛው ክፍል Share ይጫኑ'}</span>
                        <Share2 size={13} className="text-brand-orange shrink-0" />
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-stone-800 text-brand-green flex items-center justify-center font-bold text-[10px]">2</span>
                        <span>{lang === 'en' ? 'Select "Add to Home Screen"' : '"Add to Home Screen" ይምረጡ'}</span>
                        <PlusSquare size={13} className="text-brand-green shrink-0" />
                      </li>
                    </ol>
                  ) : (
                    <ol className="space-y-1.5 text-stone-300 text-[11px]">
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-stone-800 text-brand-orange flex items-center justify-center font-bold text-[10px]">1</span>
                        <span>{lang === 'en' ? 'Click 3 dots menu (⋮) in upper browser bar' : 'በብራውዘሩ ከላይ 3 ነጥቦቹን (⋮) ይጫኑ'}</span>
                        <MoreVertical size={13} className="text-brand-orange shrink-0" />
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-stone-800 text-brand-green flex items-center justify-center font-bold text-[10px]">2</span>
                        <span>{lang === 'en' ? 'Click "Install Kidtopia App"' : '"Install Kidtopia" ይጫኑ'}</span>
                        <Download size={13} className="text-brand-green shrink-0" />
                      </li>
                    </ol>
                  )}
                </motion.div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2 text-xs text-stone-400 hover:text-white font-medium transition cursor-pointer"
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
