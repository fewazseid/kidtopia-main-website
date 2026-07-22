import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, CheckCircle2, Share2, PlusSquare, MoreVertical, Loader2, Apple, Smartphone, ShieldCheck } from 'lucide-react';
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
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [installCancelled, setInstallCancelled] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  // Download / Installation Progress state
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [progressStage, setProgressStage] = useState<string>('');

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
    setShowIosGuide(false);
    setDownloadProgress(null);
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

    // Listen for completion of installation
    const handleAppInstalled = () => {
      markAppInstalled();
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

  const isIOS = typeof navigator !== 'undefined' && (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );

  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;

  const handleOpenNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  const handleDirectInstall = async () => {
    setInstallCancelled(false);

    // If running inside an iframe (like AI Studio preview), open in direct tab for native installation
    if (isInIframe) {
      handleOpenNewTab();
      return;
    }

    // If on iOS (iPhone/iPad), reveal the iPhone Safari installation guide
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    // Step 1: Show download & package installation progress for Android / Desktop
    setDownloadProgress(20);
    setProgressStage(lang === 'en' ? 'Connecting to Kidtopia app server...' : 'ከኪድቶፒያ ሲስተም ጋር በመገናኘት ላይ...');

    await new Promise((r) => setTimeout(r, 400));
    setDownloadProgress(65);
    setProgressStage(lang === 'en' ? 'Preparing web application package...' : 'አፕሊኬሽኑን በማዘጋጀት ላይ...');

    await new Promise((r) => setTimeout(r, 400));
    setDownloadProgress(100);
    setProgressStage(lang === 'en' ? 'Launching native installer...' : 'አፕሊኬሽኑን በመጫን ላይ...');

    await new Promise((r) => setTimeout(r, 300));
    setDownloadProgress(null);

    // On Chrome / Android / Desktop with native prompt support
    const activePrompt = (window as any).deferredPwaPrompt || deferredPrompt;

    if (activePrompt && typeof activePrompt.prompt === 'function') {
      try {
        activePrompt.prompt();
        const userChoice = await activePrompt.userChoice;
        if (userChoice && userChoice.outcome === 'accepted') {
          markAppInstalled();
          (window as any).deferredPwaPrompt = null;
          setDeferredPrompt(null);
          setIsLaunching(true);
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

    setShowIosGuide(true);
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
            {/* Subtle Brand Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-green/10 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 bg-white/80 hover:bg-white rounded-full transition cursor-pointer z-10 shadow-sm border border-stone-200/60"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header with Colorful Kidtopia Logo matching Website Header */}
            <div className="text-center pt-1">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white border border-stone-200 shadow-md flex items-center justify-center p-2">
                <Smartphone className="text-brand-green" size={30} />
              </div>

              {/* Multi-color Kidtopia Title matching Header.tsx */}
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
                  ? 'Install the official Kidtopia Web Application to your home screen.'
                  : 'የኪድቶፒያን አፕሊኬሽን በስልክዎ ወይም በኮምፒተርዎ ላይ በመጫን በፍጥነት ይጠቀሙ።'}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {/* If user already has the app installed */}
              {isStandalone || installedSuccess ? (
                <div className="bg-brand-green/10 border border-brand-green/30 p-5 rounded-2xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-brand-green text-sm font-bold">
                    <CheckCircle2 size={20} />
                    <span>{lang === 'en' ? 'App Installed on Device' : 'አፕሊኬሽኑ በስኬት ተጭኗል'}</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {lang === 'en' ? 'You are using the official Kidtopia application.' : 'የኪድቶፒያ ኦፊሴላዊ አፕሊኬሽን እየተጠቀሙ ነው።'}
                  </p>
                  {isLaunching && (
                    <p className="text-xs text-brand-orange font-medium animate-pulse pt-1">
                      {lang === 'en' ? 'Opening Kidtopia App...' : 'አፕሊኬሽኑ እየተከፈተ ነው...'}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Download Progress Bar */}
                  {downloadProgress !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-sm space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-stone-700 flex items-center gap-1.5">
                          <Loader2 size={14} className="animate-spin text-brand-green" />
                          <span>{progressStage}</span>
                        </span>
                        <span className="text-brand-green font-mono font-black">{downloadProgress}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-brand-green h-full rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Cancelled message */}
                  {installCancelled && (
                    <p className="text-xs text-brand-orange bg-brand-orange/10 border border-brand-orange/20 p-3 rounded-xl text-center font-medium">
                      {lang === 'en'
                        ? 'Installation request was cancelled. Tap Install whenever you are ready.'
                        : 'የመጫን ጥያቄው ተሰርዟል። ዝግጁ ሲሆኑ Install የሚለውን ይጫኑ።'}
                    </p>
                  )}

                  {/* iOS Share Sheet Guidance view when Install is clicked on iPhone */}
                  {isIOS && showIosGuide && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-stone-200 p-4 rounded-2xl text-left space-y-3 shadow-md"
                    >
                      <div className="flex items-center gap-2 text-brand-green font-bold text-xs uppercase tracking-wider">
                        <Apple size={16} className="text-stone-800" />
                        <span>{lang === 'en' ? 'Complete iOS Installation:' : 'የiPhone አጫጫን መመሪያ:'}</span>
                      </div>

                      <ol className="space-y-2.5 text-stone-700 text-xs">
                        <li className="flex items-start gap-2.5 bg-brand-cream/80 p-2.5 rounded-xl border border-stone-200/80">
                          <span className="w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">1</span>
                          <div>
                            <p className="font-bold text-stone-900 flex items-center gap-1.5">
                              <span>{lang === 'en' ? 'Tap Safari Share Button' : 'በSafari የShare ምልክት ይጫኑ'}</span>
                              <Share2 size={14} className="text-brand-orange" />
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {lang === 'en' ? 'Located at the bottom toolbar of your iPhone Safari screen.' : 'በ Safari ታችኛው ክፍል የሚገኘውን አዶ ይጫኑ።'}
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start gap-2.5 bg-brand-cream/80 p-2.5 rounded-xl border border-stone-200/80">
                          <span className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">2</span>
                          <div>
                            <p className="font-bold text-stone-900 flex items-center gap-1.5">
                              <span>{lang === 'en' ? 'Select "Add to Home Screen"' : '"Add to Home Screen" ይምረጡ'}</span>
                              <PlusSquare size={14} className="text-brand-green" />
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {lang === 'en' ? 'Scroll down the options and tap Add in top right corner.' : 'በመጨረሻም "Add" በማለት ይጫኑ።'}
                            </p>
                          </div>
                        </li>
                      </ol>

                      <div className="pt-1 flex flex-col gap-2">
                        <button
                          onClick={() => {
                            markAppInstalled();
                            handleClose();
                          }}
                          className="w-full py-2.5 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>{lang === 'en' ? 'Added to Home Screen (Done)' : 'በስልክ ላይ ተጭኗል (ተጠናቋል)'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Android / Chrome Manual Steps fallback */}
                  {!isIOS && showIosGuide && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-white border border-stone-200 p-3.5 rounded-2xl text-left space-y-2 text-xs shadow-sm"
                    >
                      <p className="font-bold text-brand-green uppercase text-[10px] tracking-wider">
                        {lang === 'en' ? 'Browser Installation Steps:' : 'የብራውዘር አጫጫን መመሪያ:'}
                      </p>
                      <ol className="space-y-1.5 text-stone-700 text-[11px]">
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-stone-100 text-brand-orange flex items-center justify-center font-bold text-[10px]">1</span>
                          <span>{lang === 'en' ? 'Tap 3 dots menu or Install in browser bar' : 'የብራውዘሩን 3 ነጥቦች ወይም Install ምልክት ይጫኑ'}</span>
                          <MoreVertical size={13} className="text-brand-orange shrink-0" />
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded bg-stone-100 text-brand-green flex items-center justify-center font-bold text-[10px]">2</span>
                          <span>{lang === 'en' ? 'Select Install Kidtopia' : '"Install Kidtopia" የሚለውን ይምረጡ'}</span>
                          <Download size={13} className="text-brand-green shrink-0" />
                        </li>
                      </ol>
                    </motion.div>
                  )}

                  {/* Action Buttons Row: Install and Cancel (Android / iOS dialog style) */}
                  {downloadProgress === null && !showIosGuide && (
                    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={handleDirectInstall}
                        className="flex-1 py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer border border-brand-green/30"
                      >
                        <Download size={16} />
                        <span>{lang === 'en' ? 'Install App' : 'አፕሊኬሽኑን ጫን'}</span>
                      </button>

                      <button
                        onClick={handleClose}
                        className="py-3 px-5 bg-white hover:bg-stone-100 text-stone-700 font-bold text-xs sm:text-sm rounded-2xl transition cursor-pointer text-center border border-stone-200"
                      >
                        {lang === 'en' ? 'Cancel' : 'ሰርዝ'}
                      </button>
                    </div>
                  )}
                </div>
              )}

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
