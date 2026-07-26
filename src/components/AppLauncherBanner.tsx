import React, { useState, useEffect } from 'react';
import { Smartphone, ExternalLink, X, Sparkles } from 'lucide-react';
import { Language } from '../translations';

interface AppLauncherBannerProps {
  lang: Language;
}

export const AppLauncherBanner: React.FC<AppLauncherBannerProps> = ({ lang }) => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkAppStatus = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      setIsStandalone(standalone);

      const installedFlag = localStorage.getItem('kidtopia_app_installed') === 'true';
      setIsInstalled(installedFlag || standalone);
    };

    checkAppStatus();

    // Continuously check periodically
    const interval = setInterval(checkAppStatus, 3000);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).deferredPwaPrompt = e;
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('kidtopia_app_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('storage', checkAppStatus);
    window.addEventListener('visibilitychange', checkAppStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('storage', checkAppStatus);
      window.removeEventListener('visibilitychange', checkAppStatus);
    };
  }, []);

  // If running already in standalone mode, or user dismissed, don't show the browser-to-app banner
  if (isStandalone || dismissed || !isInstalled) {
    return null;
  }

  const handleOpenApp = async () => {
    const promptToUse = deferredPrompt || (window as any).deferredPwaPrompt;
    if (promptToUse && typeof promptToUse.prompt === 'function') {
      try {
        promptToUse.prompt();
        const choice = await promptToUse.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setDismissed(true);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback: open in new window/tab to simulate launching the installed app
    try {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.location.href = window.location.href;
    }
  };

  return (
    <div className="bg-gradient-to-r from-brand-green via-brand-teal to-brand-orange text-white px-4 py-2.5 shadow-md relative z-50 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
      <div className="flex items-center gap-2 max-w-4xl mx-auto truncate">
        <span className="flex-shrink-0 p-1 rounded-full bg-white/20 animate-pulse">
          <Sparkles size={16} className="text-yellow-200" />
        </span>
        <span className="truncate">
          {lang === 'am' 
            ? '📱 የኪድቶፒያ መተግበሪያ በመሣሪያዎ ላይ ተጭኗል። ከብሮውዘር ይልቅ በቀጥታ በመተግበሪያው ለመጠቀም ይክፈቱ!'
            : '📱 Kidtopia App is detected on your device! Open in installed app mode for the best experience.'}
        </span>
        <button
          onClick={handleOpenApp}
          className="flex-shrink-0 bg-white text-brand-green font-bold font-display px-3 py-1 rounded-full shadow hover:bg-yellow-100 hover:scale-105 active:scale-95 transition flex items-center gap-1.5 cursor-pointer text-xs ml-2"
        >
          <Smartphone size={14} />
          <span>{lang === 'am' ? 'መተግበሪያውን ክፈት' : 'Open App'}</span>
          <ExternalLink size={12} />
        </button>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer flex-shrink-0"
        title={lang === 'am' ? 'ዝጋ' : 'Dismiss'}
      >
        <X size={16} />
      </button>
    </div>
  );
};
