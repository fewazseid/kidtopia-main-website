import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, Smartphone, Upload, CheckCircle2, ShieldCheck, 
  Smile, Users, ClipboardList, LogIn, Heart, Camera, Activity, Info,
  Utensils, Clock
} from 'lucide-react';

interface ScreenshotMap {
  registration: string | null;
  dashboard: string | null;
  biometric: string | null;
}

export const SoftwareShowcase: React.FC<{ lang: 'en' | 'am' }> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'registration' | 'dashboard' | 'biometric'>('dashboard');
  const [uploadedScreenshots, setUploadedScreenshots] = useState<ScreenshotMap>({
    registration: null,
    dashboard: null,
    biometric: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedScreenshots(prev => ({
          ...prev,
          [activeTab]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedScreenshots(prev => ({
      ...prev,
      [activeTab]: null
    }));
  };

  // Translations for Software Showcase
  const translations = {
    en: {
      badge: "Proprietary Daycare Technology",
      title: "From Registration to Kids' Checkout, Powered by Kidtopia OS",
      subtitle: "We believe transparency is the ultimate foundation of trust. That's why we built our custom software ecosystem to keep you connected, secured, and informed every single second.",
      parentDashboardTitle: "Exclusive Parent Dashboard",
      parentDashboardDesc: "Parents get full access to a modern portal with real-time updates, child health logs, daily diet details, and direct communication with nannies.",
      uploadLabel: "Drop your software screenshot here or click to browse",
      uploadFormat: "Supports PNG, JPG or WebP. Replaces mock preview.",
      changeScreenshot: "Replace Custom Screenshot",
      useFallback: "Reset to Default Interface Preview",
      tabRegistration: "1. Online Registration",
      tabDashboard: "2. Parent Dashboard",
      tabBiometric: "3. Biometric Checkout Terminal",
      regTitle: "Streamlined Online Registration Portal",
      regDesc: "Say goodbye to physical paper stacks. Register your child, sign secure medical declarations, upload immunizations, and select learning tracks in 5 minutes.",
      dashTitle: "Secure Parent Control Panel & Live Feed",
      dashDesc: "Real-time feeding updates, nap timers, and activity checklists. View exclusive daily photo streams of your children participating in cognitive activities.",
      bioTitle: "SecuGen Fingerprint Kids Checkout Terminal",
      bioDesc: "Industry-grade biometric verification. Nannies scan and authorize dismissals instantly, guaranteeing that kids are only released to verified parents and guardians.",
    },
    am: {
      badge: "የልዩ ህፃናት ማቆያ ቴክኖሎጂ",
      title: "ከምዝገባ እስከ ህፃናት መውጫ - በኪድቶፒያ ኦኤስ የተደገፈ",
      subtitle: "ግልጽነት ለታማኝነት ዋናው መሠረት እንደሆነ እናምናለን። ለዚህም ነው በእያንዳንዱ ሰከንድ ደህንነትዎን ለመጠበቅ እና መረጃ ለማድረስ የእኛን ልዩ የሶፍትዌር ስርዓት የዘረጋነው።",
      parentDashboardTitle: "የወላጆች መቆጣጠሪያ ሰሌዳ (Dashboard)",
      parentDashboardDesc: "ወላጆች የእውነተኛ ጊዜ ዝመናዎችን፣ የጤና ሁኔታዎችን፣ ዕለታዊ አመጋገብን እና ከተንከባካቢዎች ጋር ቀጥተኛ ግንኙነትን የሚያገኙበት ዘመናዊ ፖርታል አላቸው።",
      uploadLabel: "እዚህ ላይ የሶፍትዌሩን ስክሪንሾት ያስገቡ ወይም ለመምረጥ ይጫኑ",
      uploadFormat: "PNG፣ JPG ወይም WebP ይደግፋል። ነባሪውን ምስል ይቀይራል።",
      changeScreenshot: "አዲስ ስክሪንሾት ለመቀየር",
      useFallback: "ወደ ነባሪው የሶፍትዌር ንድፍ ይመለሱ",
      tabRegistration: "1. የኢንተርኔት ምዝገባ",
      tabDashboard: "2. የወላጅ ዳሽቦርድ",
      tabBiometric: "3. የባዮሜትሪክ መውጫ ተርሚናል",
      regTitle: "ቀላል እና ፈጣን የበይነመረብ ምዝገባ",
      regDesc: "የወረቀት ስራዎችን ያስቀሩ። በ 5 ደቂቃዎች ውስጥ ልጅዎን ይመዝግቡ፣ የህክምና መግለጫዎችን ይሙሉ፣ እና የክትባት ካርዶችን በቀላሉ ያስገቡ።",
      dashTitle: "የወላጅ መቆጣጠሪያ እና የቀጥታ መረጃ ፍሰት",
      dashDesc: "ምግብ፣ እንቅልፍ እና የእንቅስቃሴ ሪፖርቶች። ልጆችዎ በእውቀት ማሳደጊያ ስራዎች ላይ ሲሳተፉ የሚያሳዩ ልዩ የፎቶ ዝመናዎችን ያግኙ።",
      bioTitle: "የሲኩጄን የጣት አሻራ የህፃናት መውሰጃ ስርዓት",
      bioDesc: "ከፍተኛ ጥራት ያለው የጣት አሻራ ማረጋገጫ። ህፃናት ለተፈቀደላቸው ወላጆች ብቻ መለቀቃቸውን በከፍተኛ ጥንቃቄ ያረጋግጣል።"
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 via-white to-stone-50/70 overflow-hidden relative border-t border-stone-200/50">
      {/* Visual backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-orange/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header content */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-black tracking-widest uppercase font-accent px-4.5 py-2 rounded-full mb-6 border border-brand-orange/10 shadow-sm"
          >
            <ShieldCheck size={14} className="stroke-[2.5] text-brand-orange" />
            <span>{t.badge}</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-3.5xl sm:text-5xl font-editorial font-bold text-stone-900 mb-6 tracking-tight leading-tight"
          >
            {t.title}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-stone-500 font-sans text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium"
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-12 max-w-4xl mx-auto">
          {[
            { id: 'registration', label: t.tabRegistration, icon: ClipboardList },
            { id: 'dashboard', label: t.tabDashboard, icon: Laptop },
            { id: 'biometric', label: t.tabBiometric, icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 border cursor-pointer hover:scale-[1.01] active:scale-[0.98] ${
                  isActive 
                    ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/20' 
                    : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50 hover:text-stone-900 shadow-sm'
                }`}
              >
                <Icon size={15} className={isActive ? 'animate-pulse text-white' : 'text-stone-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Features & Explanations of selected flow */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 bg-white border border-stone-200/60 p-8 rounded-[28px] shadow-[0_12px_30px_rgba(0,0,0,0.02)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-bl-full pointer-events-none -z-10" />

                <h3 className="text-2xl font-editorial font-bold text-stone-900 tracking-tight leading-tight">
                  {activeTab === 'registration' && t.regTitle}
                  {activeTab === 'dashboard' && t.dashTitle}
                  {activeTab === 'biometric' && t.bioTitle}
                </h3>

                <p className="text-stone-500 font-sans text-sm leading-relaxed font-medium">
                  {activeTab === 'registration' && t.regDesc}
                  {activeTab === 'dashboard' && t.dashDesc}
                  {activeTab === 'biometric' && t.bioDesc}
                </p>

                {/* Bullets */}
                <div className="space-y-3 pt-2">
                  {activeTab === 'registration' && (
                    <>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'ዲጂታል የክትባት ካርድና የህክምና ፎርሞች' : 'Digital Immunization & Medical Submissions'}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'ዕለታዊ የሰዓት መርሐ-ግብር ምርጫ' : 'Daily Schedule & Custom Track Setup'}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'ፈጣን የኢሜይል ማረጋገጫና የመቀበያ ሰነዶች' : 'Instant Email Confirmation & Onboarding'}</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'dashboard' && (
                    <>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'የእንቅልፍ፣ የምግብና የፈሳሽ ዝርዝር ዝመናዎች' : 'Nap, Diet & Feeding Timer Indicators'}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'የቀጥታ የክፍል እንቅስቃሴ ፎቶዎች' : 'Secure Daily Classroom Photo streams'}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'የጤና እና የሙቀት መለኪያ ሪፖርት' : 'Dynamic Health Status & Temperature logs'}</span>
                      </div>
                    </>
                  )}
                  {activeTab === 'biometric' && (
                    <>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'የሲኩጄን (SecuGen) የጣት አሻራ አንባቢ ውህደት' : 'SecuGen Hardware fingerprint driver support'}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'የተፈቀደላቸው ወላጆች ፎቶ ማረጋገጫ' : 'Nanny-verified face match terminal screens'}</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-stone-700 font-sans text-sm font-semibold">
                        <CheckCircle2 size={16} className="text-brand-green shrink-0" />
                        <span>{lang === 'am' ? 'ፈጣን የኤስኤምኤስ (SMS) መውጫ ማሳወቂያ' : 'Instant Child Checkout SMS alert to mother/father'}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Dashboard highlight card */}
                <div className="mt-6 p-4 rounded-2xl bg-brand-cream/30 border border-brand-yellow/10 flex items-start gap-3">
                  <Info size={16} className="text-brand-orange shrink-0 mt-0.5" />
                  <div className="text-xs text-stone-600 leading-normal font-sans font-medium">
                    {lang === 'am' 
                      ? 'ወላጆች የራሳቸው የዳሽቦርድ መለያ አላቸው። በምናሌው ላይ ያለውን "ግባ" ቁልፍ በመጫን መግባት ይችላሉ።' 
                      : 'Every parent receives secure custom dashboard credentials to view their child\'s digital journal. Accessible via the "Login" button on the navigation bar.'}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: The Interactive Device Frame & Screenshot Upload Dropzone */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Interactive Upload Playground Label */}
            <div className="w-full max-w-xl text-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-stone-100 text-stone-500 py-1.5 px-3 rounded-full border border-stone-200">
                ⚡ {lang === 'am' ? 'የስርዓቱን ፎቶዎች ለመቀየር አፕሎድ ያድርጉ' : 'Interactive Playground: Upload Actual Screenshots!'}
              </span>
            </div>

            {/* Hidden native input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* device frame with dropzone triggers */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-xl bg-stone-900 rounded-[32px] p-3 sm:p-4 shadow-2xl shadow-stone-900/30 border-4 border-stone-800 relative hover:scale-[1.01] hover:border-stone-700 transition-all duration-500 cursor-pointer group"
            >
              {/* Speaker / Notch bar */}
              <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-20 flex items-center justify-center gap-1.5">
                <div className="w-8 h-1 bg-stone-800 rounded-full" />
                <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
              </div>

              {/* Screen container */}
              <div className="relative w-full aspect-[4/3] rounded-[22px] overflow-hidden bg-stone-950 flex flex-col justify-between p-3 sm:p-4 text-stone-200 select-none z-10 border border-stone-900">
                
                {/* Check if user uploaded a custom screenshot for this tab */}
                {uploadedScreenshots[activeTab] ? (
                  <div className="absolute inset-0 z-10 bg-stone-950">
                    <img 
                      src={uploadedScreenshots[activeTab]!} 
                      alt="Custom Screenshot uploaded" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="p-2 bg-white text-stone-900 rounded-xl text-xs font-bold shadow-lg"
                      >
                        {lang === 'am' ? 'ምስል ቀይር' : 'Change Image'}
                      </button>
                      <button 
                        onClick={removeScreenshot}
                        className="p-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg"
                      >
                        {lang === 'am' ? 'አስወግድ' : 'Remove'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* High Fidelity CSS-designed Fallback Mockups (So it looks stunning natively!) */
                  <div className="absolute inset-0 z-0 bg-stone-950 font-sans p-4 sm:p-6 flex flex-col justify-between">
                    
                    {/* Header bar */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded-lg bg-brand-green flex items-center justify-center text-[10px] font-black font-accent">K</div>
                        <span className="text-xs font-black tracking-wider uppercase text-white">Kidtopia OS v4.1</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 font-semibold font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
                        <span>LIVE TERMINAL</span>
                      </div>
                    </div>

                    {/* Body contents based on active tab */}
                    <div className="flex-1 py-4 flex flex-col justify-center">
                      <AnimatePresence mode="wait">
                        {activeTab === 'registration' && (
                          <motion.div
                            key="reg-mock"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-3"
                          >
                            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-orange">Kidtopia Registration Hub</span>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                              <div className="h-6.5 bg-white/10 rounded-lg flex items-center px-2.5 justify-between">
                                <span className="text-[10px] text-stone-300 font-semibold">Child Full Name:</span>
                                <span className="text-[10px] text-white font-bold font-mono">Abel Tesfaye</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="h-6 bg-white/5 rounded-lg flex items-center px-2 justify-between">
                                  <span className="text-[9px] text-stone-400">Age:</span>
                                  <span className="text-[9px] text-brand-yellow font-bold">2.5 Years</span>
                                </div>
                                <div className="h-6 bg-white/5 rounded-lg flex items-center px-2 justify-between">
                                  <span className="text-[9px] text-stone-400">Class:</span>
                                  <span className="text-[9px] text-brand-teal font-bold">Toddler A</span>
                                </div>
                              </div>
                              <div className="h-6 bg-brand-green/20 text-brand-green rounded-lg border border-brand-green/30 flex items-center justify-center text-[10px] font-black">
                                ✓ Medical Record & Immunization verified
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'dashboard' && (
                          <motion.div
                            key="dash-mock"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-3"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] uppercase tracking-widest font-bold text-brand-teal">Parent Portal Dashboard</span>
                              <span className="text-[9px] text-stone-400">Welcome, Rediet (Mother)</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                <Utensils size={14} className="text-brand-orange mb-1.5" />
                                <span className="text-[8px] text-stone-400 font-semibold uppercase">Lunch Time</span>
                                <span className="text-[9px] text-white font-bold mt-0.5">Finished 100%</span>
                              </div>
                              <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                <Clock size={14} className="text-brand-yellow mb-1.5" />
                                <span className="text-[8px] text-stone-400 font-semibold uppercase">Nap Timer</span>
                                <span className="text-[9px] text-white font-bold mt-0.5">1h 45m left</span>
                              </div>
                              <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                                <Camera size={14} className="text-brand-green mb-1.5" />
                                <span className="text-[8px] text-stone-400 font-semibold uppercase">New Photos</span>
                                <span className="text-[9px] text-brand-green font-bold mt-0.5">3 Uploaded</span>
                              </div>
                            </div>
                            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
                                <span className="text-[9px] text-stone-300">Classroom status:</span>
                              </div>
                              <span className="text-[9px] text-white font-bold">Activity: Painting Circle Time</span>
                            </div>
                          </motion.div>
                        )}

                        {activeTab === 'biometric' && (
                          <motion.div
                            key="bio-mock"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-3"
                          >
                            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-green">Biometric Security Clearance</span>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-4">
                              {/* Scanner Graphic */}
                              <div className="w-14 h-14 bg-brand-green/10 border border-brand-green/30 rounded-full flex items-center justify-center text-brand-green text-xl relative shrink-0">
                                <div className="absolute inset-0 rounded-full bg-brand-green/5 animate-ping" style={{ animationDuration: '2s' }} />
                                🟢
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="text-[10px] text-stone-400 font-semibold">Terminal: MAIN CHECKOUT</div>
                                <div className="text-[11px] text-white font-black font-mono">AUTHORIZED GUARDIAN MATCHED</div>
                                <div className="text-[9px] text-brand-green font-bold">✓ SecuGen fingerprint driver matching parent record</div>
                              </div>
                            </div>
                            <div className="h-6 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-lg flex items-center justify-center text-[9px] font-bold">
                              SMS notification dispatched automatically to parents
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Upload Overlay/Instructions inside screen */}
                    <div className="border-t border-white/5 pt-2.5 flex justify-between items-center text-[9px] text-stone-400">
                      <div className="flex items-center gap-1.5">
                        <Upload size={10} className="text-brand-orange animate-bounce" />
                        <span>{t.uploadLabel}</span>
                      </div>
                      <span className="font-mono opacity-60">1280 x 960</span>
                    </div>

                  </div>
                )}
                
              </div>
            </div>

            {/* Change/Reset Buttons */}
            <div className="mt-4.5 flex gap-3 text-xs">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-stone-55 border border-stone-300 font-bold text-stone-700 shadow-sm cursor-pointer transition flex items-center gap-1.5"
              >
                <Upload size={13} className="text-stone-500" />
                <span>{uploadedScreenshots[activeTab] ? t.changeScreenshot : (lang === 'am' ? 'የሶፍትዌሩን ምስል አፕሎድ ያድርጉ' : 'Upload Real Screenshot')}</span>
              </button>

              {uploadedScreenshots[activeTab] && (
                <button 
                  onClick={removeScreenshot}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 font-bold text-stone-500 cursor-pointer transition"
                >
                  {t.useFallback}
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
