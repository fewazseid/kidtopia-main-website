import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, CheckCircle2, Sparkles, Share2, PlusSquare, MoreVertical, Loader2, ArrowDownCircle, Apple } from 'lucide-react';
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
  const [showManualGuide, setShowManualGuide] = useState<boolean>(false);
  const [installCancelled, setInstallCancelled] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  // Download / Installation Progress state
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [progressStage, setProgressStage] = useState<string>('');

  const handleClose = () => {
    localStorage.setItem('kidtopia_install_prompt_dismissed', 'true');
    onClose();
  };

  useEffect(() => {
    // Check if app is already running as an installed PWA
    const checkIsInstalled = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches || 
        (navigator as any).standalone === true ||
        localStorage.getItem('kidtopia_app_installed') === 'true';
      if (standalone) {
        setIsStandalone(true);
      }
    };

    checkIsInstalled();

    // Capture prompt from global window
    if ((window as any).deferredPwaPrompt) {
      setDeferredPrompt((window as any).deferredPwaPrompt);
    }

    // Listen for browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).deferredPwaPrompt = e;
      setDeferredPrompt(e);
    };

    // Listen for completion of installation -> Automatically open app in same page
    const handleAppInstalled = () => {
      setInstalledSuccess(true);
      setIsStandalone(true);
      localStorage.setItem('kidtopia_app_installed', 'true');
      localStorage.setItem('kidtopia_install_prompt_dismissed', 'true');
      (window as any).deferredPwaPrompt = null;
      setDeferredPrompt(null);
      setIsLaunching(true);
      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname;
      }, 1000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isOpen]);

  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  const handleDirectInstall = async () => {
    setInstallCancelled(false);
    
    // Step 1: Start Download & Package Preparation Progress Simulation
    setDownloadProgress(10);
    setProgressStage(lang === 'en' ? 'Connecting to Kidtopia app repository...' : 'ከኪድቶፒያ ሲስተም ጋር በመገናኘት ላይ...');

    // Progress step 1
    await new Promise((r) => setTimeout(r, 400));
    setDownloadProgress(35);
    setProgressStage(lang === 'en' ? 'Downloading Service Worker & offline assets...' : 'አፕሊኬሽኑን በማዘጋጀት ላይ...');

    // Progress step 2
    await new Promise((r) => setTimeout(r, 500));
    setDownloadProgress(70);
    setProgressStage(lang === 'en' ? 'Verifying web application package...' : 'አፕሊኬሽኑን በማጣራት ላይ...');

    // Progress step 3
    await new Promise((r) => setTimeout(r, 400));
    setDownloadProgress(100);
    setProgressStage(lang === 'en' ? 'Package ready! Launching installer...' : 'ዝግጁ ነው! አፕሊኬሽኑን በመጫን ላይ...');

    await new Promise((r) => setTimeout(r, 300));
    setDownloadProgress(null); // Reset progress display after completion

    // If on iOS (iPhone/iPad)
    if (isIOS) {
      setShowManualGuide(true);
      return;
    }

    // On Chrome / Android / Desktop with native prompt support
    const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;

    if (activePrompt && typeof activePrompt.prompt === 'function') {
      try {
        activePrompt.prompt();
        const userChoice = await activePrompt.userChoice;
        if (userChoice && userChoice.outcome === 'accepted') {
          setInstalledSuccess(true);
          setIsStandalone(true);
          localStorage.setItem('kidtopia_app_installed', 'true');
          localStorage.setItem('kidtopia_install_prompt_dismissed', 'true');
          (window as any).deferredPwaPrompt = null;
          setDeferredPrompt(null);
          setIsLaunching(true);
          // Auto open / launch app in the same page
          setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname;
          }, 1000);
          return;
        } else if (userChoice && userChoice.outcome === 'dismissed') {
          setInstallCancelled(true);
          return;
        }
      } catch (err) {
        console.error('Error triggering browser PWA install prompt:', err);
      }
    }

    setShowManualGuide(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden my-auto"
          >
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-teal/15 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white bg-stone-800/60 hover:bg-stone-800 rounded-full transition cursor-pointer z-10"
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
                {lang === 'en' ? 'Install Kidtopia App' : 'የኪድቶፒያ አፕሊኬሽን ጫን'}
              </h2>
              <p className="text-stone-400 text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Install the official Kidtopia Web App onto your phone or desktop home screen.'
                  : 'የኪድቶፒያን አፕሊኬሽን በስልክዎ ወይም በኮምፒተርዎ ላይ በመጫን በፍጥነት ይጠቀሙ።'}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {/* If user already has the app installed */}
              {isStandalone || installedSuccess ? (
                <div className="bg-brand-green/15 border border-brand-green/30 p-5 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-brand-green text-sm font-bold">
                    <CheckCircle2 size={22} />
                    <span>{lang === 'en' ? 'App is Installed on Device' : 'አፕሊኬሽኑ በስኬት ተጭኗል'}</span>
                  </div>
                  <p className="text-xs text-stone-300">
                    {lang === 'en' ? 'You are using the official Kidtopia application.' : 'የኪድቶፒያ ኦፊሴላዊ አፕሊኬሽን እየተጠቀሙ ነው።'}
                  </p>
                  {isLaunching && (
                    <p className="text-xs text-brand-yellow font-medium animate-pulse pt-1">
                      {lang === 'en' ? 'Launching Kidtopia App...' : 'አፕሊኬሽኑ እየተከፈተ ነው...'}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Download / Preparation Progress Bar */}
                  {downloadProgress !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-stone-950/80 border border-brand-orange/30 p-4 rounded-2xl space-y-2.5"
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-stone-300 flex items-center gap-1.5">
                          <Loader2 size={14} className="animate-spin text-brand-orange" />
                          <span>{progressStage}</span>
                        </span>
                        <span className="text-brand-orange font-mono font-black">{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-800 h-2.5 rounded-full overflow-hidden p-0.5">
                        <motion.div
                          className="bg-gradient-to-r from-brand-orange to-brand-yellow h-full rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* If user previously cancelled the browser prompt */}
                  {installCancelled && (
                    <p className="text-[11px] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 p-2.5 rounded-xl text-center">
                      {lang === 'en'
                        ? 'Installation request was cancelled. Click the button above whenever you are ready.'
                        : 'የመጫን ጥያቄው ተሰርዟል። ዝግጁ ሲሆኑ ከላይ ያለውን አዝራር ይጫኑ።'}
                    </p>
                  )}

                  {/* Primary Trigger Button (Only shown if NOT installed) */}
                  {downloadProgress === null && (
                    <button
                      onClick={handleDirectInstall}
                      className="w-full py-3.5 px-6 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-brand-orange/20 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                    >
                      <Download size={18} />
                      <span>{lang === 'en' ? 'Install App on Device' : 'አፕሊኬሽኑን በስልክዎ ይጫኑ'}</span>
                      <Sparkles size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* iPhone / iOS Specific Guide */}
              {isIOS && !isStandalone && !installedSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 bg-stone-950/80 border border-stone-800 p-4 rounded-2xl text-left space-y-3"
                >
                  <div className="flex items-center gap-2 text-brand-orange font-bold text-xs uppercase tracking-wider">
                    <Apple size={16} className="text-white" />
                    <span>{lang === 'en' ? 'iPhone Safari Installation Steps:' : 'የiPhone አጫጫን መመሪያ:'}</span>
                  </div>

                  <ol className="space-y-2.5 text-stone-300 text-xs">
                    <li className="flex items-start gap-2.5 bg-stone-900/80 p-2.5 rounded-xl border border-stone-800/60">
                      <span className="w-5 h-5 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                      <div className="flex-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span>{lang === 'en' ? 'Tap Safari Share Button' : 'በSafari የShare ምልክት ይጫኑ'}</span>
                          <Share2 size={14} className="text-brand-orange animate-pulse" />
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {lang === 'en' ? 'Located in the bottom toolbar of Safari (or top right on iPad).' : 'በስልክዎ ታችኛው ክፍል የሚገኘውን Share አዶ ይጫኑ።'}
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5 bg-stone-900/80 p-2.5 rounded-xl border border-stone-800/60">
                      <span className="w-5 h-5 rounded-full bg-brand-green/20 border border-brand-green/40 text-brand-green flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                      <div className="flex-1">
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span>{lang === 'en' ? 'Select "Add to Home Screen"' : '"Add to Home Screen" ይምረጡ'}</span>
                          <PlusSquare size={14} className="text-brand-green" />
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {lang === 'en' ? 'Scroll down the share menu options and tap "Add to Home Screen".' : 'ምናሌውን ዝቅ በማድረግ "Add to Home Screen" የሚለውን ይጫኑ።'}
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start gap-2.5 bg-stone-900/80 p-2.5 rounded-xl border border-stone-800/60">
                      <span className="w-5 h-5 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">3</span>
                      <div className="flex-1">
                        <p className="font-bold text-white">
                          {lang === 'en' ? 'Tap "Add" in Top Right' : 'በቀኝ በኩል "Add" ይጫኑ'}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {lang === 'en' ? 'Confirm to place Kidtopia app icon on your home screen.' : 'በመጨረሻም "Add" በማለት አፕሊኬሽኑን በስልክዎ ገጽ ላይ ያኑሩት።'}
                        </p>
                      </div>
                    </li>
                  </ol>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-orange bg-brand-orange/10 p-2 rounded-xl border border-brand-orange/20 text-center font-medium">
                    <ArrowDownCircle size={14} className="animate-bounce" />
                    <span>{lang === 'en' ? 'Look for the Share icon in Safari bottom toolbar below' : 'በ Safari ታችኛው ክፍል የ Share ምልክቱን ይመልከቱ'}</span>
                  </div>
                </motion.div>
              )}

              {/* Android / Desktop Browser Instructions fallback */}
              {!isIOS && (showManualGuide || !deferredPrompt) && !isStandalone && !installedSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 bg-stone-950/60 border border-stone-800 p-3.5 rounded-2xl text-left space-y-2 text-xs"
                >
                  <p className="font-bold text-brand-orange uppercase text-[10px] tracking-wider">
                    {lang === 'en' ? 'Browser Native Install Steps:' : 'የብራውዘር አጫጫን መመሪያ:'}
                  </p>
                  <ol className="space-y-1.5 text-stone-300 text-[11px]">
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-stone-800 text-brand-orange flex items-center justify-center font-bold text-[10px]">1</span>
                      <span>{lang === 'en' ? 'Tap 3 dots menu (⋮) or Install icon in address bar' : 'የብራውዘሩን 3 ነጥቦች (⋮) ወይም Install ምልክት ይጫኑ'}</span>
                      <MoreVertical size={13} className="text-brand-orange shrink-0" />
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded bg-stone-800 text-brand-green flex items-center justify-center font-bold text-[10px]">2</span>
                      <span>{lang === 'en' ? 'Select "Install Kidtopia" or "Add to Home screen"' : '"Install Kidtopia" የሚለውን ይምረጡ'}</span>
                      <Download size={13} className="text-brand-green shrink-0" />
                    </li>
                  </ol>
                </motion.div>
              )}

              <button
                onClick={handleClose}
                className="w-full py-2 text-xs text-stone-400 hover:text-white font-medium transition cursor-pointer"
              >
                {lang === 'en' ? 'Continue in Web Browser' : 'በብራውዘር ቀጥል'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
