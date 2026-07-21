import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Download, 
  Share2, 
  PlusSquare, 
  MoreVertical, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Apple, 
  Chrome, 
  Globe, 
  Layers, 
  ChevronRight,
  Info
} from 'lucide-react';
import { Language } from '../translations';

interface DeviceInstallGuideCardProps {
  lang: Language;
  onOpenFullModal?: () => void;
  compact?: boolean;
}

export interface DeviceInfo {
  category: 'mobile' | 'tablet' | 'laptop';
  deviceName: string;
  browserName: string;
  osKey: 'ios' | 'android' | 'chrome_desktop' | 'safari_mac';
}

export function detectDeviceAndBrowser(): DeviceInfo {
  const ua = navigator.userAgent;
  const width = window.innerWidth;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Browser detection
  let browserName = 'Browser';
  if (/edg/i.test(ua)) browserName = 'Microsoft Edge';
  else if (/samsungbrowser/i.test(ua)) browserName = 'Samsung Internet';
  else if (/chrome|crios/i.test(ua)) browserName = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browserName = 'Mozilla Firefox';
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browserName = 'Apple Safari';
  else if (/opera|opr/i.test(ua)) browserName = 'Opera';

  // Device & OS detection
  const isIPhone = /iphone|ipod/i.test(ua);
  const isIPad = /ipad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isMac = /macintosh|mac os x/i.test(ua) && !isIPad;
  const isWindows = /windows/i.test(ua);

  if (isIPhone || (isTouch && width < 640 && !isAndroid)) {
    return {
      category: 'mobile',
      deviceName: isIPhone ? 'Apple iPhone' : 'Mobile Smartphone',
      browserName,
      osKey: 'ios',
    };
  }

  if (isIPad || (isAndroid && !/mobile/i.test(ua)) || (isTouch && width >= 640 && width <= 1024)) {
    return {
      category: 'tablet',
      deviceName: isIPad ? 'Apple iPad' : isAndroid ? 'Android Tablet' : 'Tablet Device',
      browserName,
      osKey: isIPad ? 'ios' : 'android',
    };
  }

  if (isAndroid) {
    return {
      category: 'mobile',
      deviceName: 'Android Smartphone',
      browserName,
      osKey: 'android',
    };
  }

  return {
    category: 'laptop',
    deviceName: isMac ? 'Apple Mac' : isWindows ? 'Windows PC / Laptop' : 'Desktop Computer',
    browserName,
    osKey: isMac && browserName === 'Apple Safari' ? 'safari_mac' : 'chrome_desktop',
  };
}

export const DeviceInstallGuideCard: React.FC<DeviceInstallGuideCardProps> = ({ 
  lang, 
  onOpenFullModal,
  compact = false 
}) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    category: 'mobile',
    deviceName: 'Smartphone',
    browserName: 'Browser',
    osKey: 'ios',
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installedSuccess, setInstalledSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Detect device on mount
    setDeviceInfo(detectDeviceAndBrowser());

    // Check standalone
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsStandalone(true);
    }

    // Capture PWA install prompt if supported
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleNativeInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
    }
  };

  const getDeviceIcon = () => {
    switch (deviceInfo.category) {
      case 'mobile':
        return <Smartphone className="text-brand-orange shrink-0" size={compact ? 20 : 24} />;
      case 'tablet':
        return <Tablet className="text-brand-teal shrink-0" size={compact ? 20 : 24} />;
      case 'laptop':
        return <Monitor className="text-brand-green shrink-0" size={compact ? 20 : 24} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 relative overflow-hidden"
    >
      {/* Decorative accent background shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-teal/10 rounded-tr-full pointer-events-none" />

      {/* Live Detection Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
            {getDeviceIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/15 px-2.5 py-0.5 rounded-full">
                {lang === 'en' ? 'Auto-Detected Device' : 'የተለየው መሣሪያ'}
              </span>
            </div>
            <h3 className="font-display font-black text-white text-base sm:text-lg mt-0.5 flex items-center gap-1.5">
              <span>{deviceInfo.deviceName}</span>
              <span className="text-stone-400 font-normal text-xs sm:text-sm">({deviceInfo.browserName})</span>
            </h3>
          </div>
        </div>

        {/* 1-Click PWA Install Button if available */}
        {deferredPrompt ? (
          <button
            onClick={handleNativeInstallClick}
            className="w-full sm:w-auto px-4 py-2.5 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer border border-brand-orange/30"
          >
            <Sparkles size={14} className="animate-spin" />
            <span>{lang === 'en' ? 'Install App (1-Click)' : 'አሁኑኑ ጫን (1-ጠቅታ)'}</span>
          </button>
        ) : isStandalone || installedSuccess ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/20 text-brand-green border border-brand-green/30 rounded-xl text-xs font-bold">
            <CheckCircle2 size={14} />
            <span>{lang === 'en' ? 'App Already Installed' : 'አፕሊኬሽኑ ተጭኗል'}</span>
          </span>
        ) : null}
      </div>

      {/* Step-by-Step Installation for Detected OS & Browser */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-black uppercase tracking-wider text-stone-400">
            {lang === 'en'
              ? `Tailored Instructions for ${deviceInfo.deviceName} on ${deviceInfo.browserName}`
              : `ለ${deviceInfo.deviceName} የተዘጋጀ የአጫጫን መመሪያ`}
          </p>
        </div>

        {/* 1. iOS / Safari (iPhone or iPad) */}
        {deviceInfo.osKey === 'ios' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-orange font-black text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Compass size={13} className="text-brand-teal" />
                  <span>{lang === 'en' ? 'Safari Browser' : 'በSafari ይክፈቱ'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Open Kidtopia inside Apple Safari.' : 'ኪድቶፒያን በApple Safari ብራውዘር ይክፈቱ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-orange font-black text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Share2 size={13} className="text-brand-orange" />
                  <span>{lang === 'en' ? 'Tap Share' : 'Share ይጫኑ'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Tap Share icon at bottom or top bar.' : 'በታችኛው ወይም በላዩ የSafari ሜኑ ላይ Share ምልክቱን ይጫኑ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-green font-black text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <PlusSquare size={13} className="text-brand-green" />
                  <span>{lang === 'en' ? 'Add to Home Screen' : 'Add to Home Screen'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Choose "Add to Home Screen" & confirm.' : '"Add to Home Screen" መርጠው ያረጋግጡ።'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Android (Smartphone or Tablet) */}
        {deviceInfo.osKey === 'android' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-green font-black text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Chrome size={13} className="text-brand-green" />
                  <span>{lang === 'en' ? 'Chrome Browser' : 'በChrome ይክፈቱ'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Open in Google Chrome or Samsung Internet.' : 'በGoogle Chrome ወይም Samsung Internet ይክፈቱ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-orange font-black text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <MoreVertical size={13} className="text-brand-orange" />
                  <span>{lang === 'en' ? 'Tap Menu (⋮)' : 'ሜኑ ይጫኑ (⋮)'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Tap the 3 dots (⋮) in upper right.' : 'በቀኝ የላይኛው ጥግ 3 ነጥቦቹን (⋮) ይጫኑ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-green font-black text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Download size={13} className="text-brand-green" />
                  <span>{lang === 'en' ? 'Install App' : 'አፕሊኬሽኑን ጫን'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Select "Install app" or "Add to Home".' : '"Install app" የሚለውን መርጠው ይጫኑ።'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Laptop/PC (Chrome, Edge, Brave, etc.) */}
        {deviceInfo.osKey === 'chrome_desktop' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-orange font-black text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Globe size={13} className="text-brand-orange" />
                  <span>{lang === 'en' ? 'Address Bar' : 'የአድራሻ ባር'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Look at URL address bar at browser top.' : 'በብራውዘሩ ላይኛው የአድራሻ ባር ይመልከቱ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-teal font-black text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Download size={13} className="text-brand-teal" />
                  <span>{lang === 'en' ? 'Click Install' : 'የጭነት ምልክት'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Click the computer / install icon in URL bar.' : 'በURL ባሩ ላይ የመጫኛ ምልክቱን ይጫኑ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-green font-black text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Monitor size={13} className="text-brand-green" />
                  <span>{lang === 'en' ? 'Desktop App' : 'የዴስክቶፕ አፕ'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Confirm "Install" to run app standalone.' : '"Install" ብለው የዴስክቶፕ አፕ ያድርጉት።'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Safari macOS */}
        {deviceInfo.osKey === 'safari_mac' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Apple size={13} />
                  <span>{lang === 'en' ? 'Mac Safari' : 'በMac Safari'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Open site in Safari on macOS.' : 'በMac Safari ላይ ገፁን ይክፈቱ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-orange font-black text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <Layers size={13} className="text-brand-orange" />
                  <span>{lang === 'en' ? 'Add to Dock' : 'Add to Dock'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Click File menu -> "Add to Dock..."' : 'ከላይ File -> "Add to Dock..." ይምረጡ።'}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-xl flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-stone-800 text-brand-green font-black text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-brand-green" />
                  <span>{lang === 'en' ? 'Mac App Ready' : 'ዝግጁ ነው'}</span>
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                  {lang === 'en' ? 'Access Kidtopia anytime from Mac Dock!' : 'ከMac Dock ላይ በቀላሉ ይክፈቱት!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer link to open full multi-device guide modal */}
      {onOpenFullModal && (
        <div className="relative z-10 pt-3 mt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
          <span className="text-stone-400 text-[11px] font-medium flex items-center gap-1">
            <Info size={13} className="text-brand-yellow" />
            <span>{lang === 'en' ? 'Need instructions for another device?' : 'ለሌላ መሣሪያ መመሪያ ይፈልጋሉ?'}</span>
          </span>
          <button
            onClick={onOpenFullModal}
            className="text-brand-orange font-black hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'en' ? 'View All Devices' : 'የሁሉም መሣሪያዎች መመሪያ'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
};
