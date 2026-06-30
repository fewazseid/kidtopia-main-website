import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Book, FileText, CheckCircle2, Download, Upload, AlertCircle, 
  Trash2, ShieldAlert, Award, Compass, RotateCw, Smile, 
  Sliders, Sparkles, Volume2, Search, Printer, Bookmark, Eye, Camera, Heart, Users
} from 'lucide-react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface ParentalResourceDetailsProps {
  actionType: string;
  onClose: () => void;
  lang: 'en' | 'am';
}

export const ParentalResourceDetails: React.FC<ParentalResourceDetailsProps> = ({ actionType, onClose, lang }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const user = auth.currentUser;

  // Fetch parent profile for uploads and avatar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          setUserProfile(snap.data());
        } else {
          // Initialize if missing
          const initial = {
            uid: user.uid,
            email: user.email,
            role: 'parent',
            avatar: {
              hairstyle: 'short',
              clothing: 'overall',
              accessory: 'none',
              expression: 'happy',
              skinColor: '#F5C29D',
              primaryColor: '#3a5b32'
            },
            documents: [
              { id: '1', name: 'Immunization Record', status: 'pending', date: '2026-06-15' },
              { id: '2', name: 'TB Screening Certificate', status: 'approved', date: '2026-06-12' }
            ]
          };
          await setDoc(userDocRef, initial);
          setUserProfile(initial);
        }
      } catch (err) {
        console.error('Error fetching user profile', err);
      }
    };
    fetchProfile();
  }, [user]);

  // Show feedback helper
  const triggerFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  // ==========================================
  // 1. AVATAR CREATOR STATE & LOGIC
  // ==========================================
  const [avatar, setAvatar] = useState({
    hairstyle: 'short',
    clothing: 'overall',
    accessory: 'none',
    expression: 'happy',
    skinColor: '#F5C29D',
    primaryColor: '#3a5b32'
  });

  useEffect(() => {
    if (userProfile?.avatar) {
      setAvatar(userProfile.avatar);
    }
  }, [userProfile]);

  const saveAvatar = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { avatar });
      setUserProfile((prev: any) => ({ ...prev, avatar }));
      triggerFeedback('success', lang === 'en' ? 'Avatar saved successfully!' : 'አቫታር በተሳካ ሁኔታ ተቀምጧል!');
    } catch (err) {
      console.error(err);
      triggerFeedback('error', 'Failed to save avatar');
    } finally {
      setLoading(false);
    }
  };

  // Render SVG Layers for Avatar
  const renderAvatarSVG = () => {
    const skin = avatar.skinColor;
    const accent = avatar.primaryColor;

    return (
      <svg viewBox="0 0 100 100" className="w-48 h-48 mx-auto drop-shadow-lg">
        {/* Background Circle */}
        <circle cx="50" cy="50" r="46" fill={`${accent}15`} stroke={accent} strokeWidth="2" strokeDasharray="3,3" />

        {/* Neck */}
        <rect x="46" y="65" width="8" height="12" fill={skin} rx="3" />
        
        {/* Face Base */}
        <circle cx="50" cy="48" r="18" fill={skin} />

        {/* Ears */}
        <circle cx="31" cy="48" r="3.5" fill={skin} />
        <circle cx="69" cy="48" r="3.5" fill={skin} />

        {/* Eyes */}
        <circle cx="44" cy="45" r="2" fill="#2d2d2d" />
        <circle cx="56" cy="45" r="2" fill="#2d2d2d" />

        {/* Eyebrows */}
        <path d="M40 41 Q44 40 47 42" stroke="#2d2d2d" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M60 41 Q56 40 53 42" stroke="#2d2d2d" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Expressions */}
        {avatar.expression === 'happy' && (
          <path d="M44 54 Q50 60 56 54" stroke="#2d2d2d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}
        {avatar.expression === 'excited' && (
          <path d="M43 53 Q50 63 57 53 Z" fill="#b91c1c" stroke="#2d2d2d" strokeWidth="1" />
        )}
        {avatar.expression === 'silly' && (
          <>
            <path d="M44 53 Q50 56 56 53" stroke="#2d2d2d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M48 54 Q50 60 51 54 Z" fill="#ef4444" />
          </>
        )}
        {avatar.expression === 'smart' && (
          <path d="M45 54 Q50 51 55 54" stroke="#2d2d2d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* Cheek Blush */}
        <circle cx="37" cy="51" r="2" fill="#f87171" opacity="0.4" />
        <circle cx="63" cy="51" r="2" fill="#f87171" opacity="0.4" />

        {/* Clothing */}
        {avatar.clothing === 'uniform' && (
          <path d="M30 78 Q50 68 70 78 L68 95 L32 95 Z" fill="#1e3a8a" />
        )}
        {avatar.clothing === 'overall' && (
          <>
            <path d="M30 78 Q50 68 70 78 L68 95 L32 95 Z" fill={accent} />
            {/* Straps */}
            <rect x="36" y="72" width="4" height="20" fill="#f59e0b" rx="1" />
            <rect x="60" y="72" width="4" height="20" fill="#f59e0b" rx="1" />
          </>
        )}
        {avatar.clothing === 'hoodie' && (
          <>
            <path d="M30 78 Q50 68 70 78 L68 95 L32 95 Z" fill="#4b5563" />
            <circle cx="50" cy="74" r="5" fill="#374151" />
          </>
        )}
        {avatar.clothing === 'tshirt' && (
          <path d="M30 78 Q50 72 70 78 L68 95 L32 95 Z" fill="#ea580c" />
        )}

        {/* Collars/Necklines */}
        <path d="M44 68 L50 75 L56 68" stroke="#ffffff" strokeWidth="1.5" fill="none" />

        {/* Hairstyles */}
        {avatar.hairstyle === 'short' && (
          <path d="M32 38 Q50 22 68 38 Q70 30 65 24 Q50 18 35 24 Q30 30 32 38 Z" fill="#1c1917" />
        )}
        {avatar.hairstyle === 'curly' && (
          <path d="M30 40 C28 35 32 28 36 30 C38 25 45 23 48 26 C52 23 60 25 62 30 C66 28 70 33 68 39 C72 43 65 50 63 46 C50 51 37 46 32 46 Z" fill="#44403c" />
        )}
        {avatar.hairstyle === 'ponytail' && (
          <>
            <path d="M32 38 Q50 22 68 38 Q70 30 65 24 Q50 18 35 24 Q30 30 32 38 Z" fill="#78350f" />
            {/* Ponytail extension */}
            <path d="M66 36 Q78 40 76 52 Q68 46 66 36" fill="#78350f" />
            <circle cx="67" cy="37" r="2.5" fill="#ef4444" />
          </>
        )}
        {avatar.hairstyle === 'braids' && (
          <>
            <path d="M32 38 Q50 22 68 38 Q50 20 32 38" fill="#111827" />
            {/* Left Braid */}
            <path d="M31 38 Q24 55 26 70 Q31 55 35 38" fill="#111827" />
            <circle cx="26" cy="68" r="2" fill="#ef4444" />
            {/* Right Braid */}
            <path d="M69 38 Q76 55 74 70 Q69 55 65 38" fill="#111827" />
            <circle cx="74" cy="68" r="2" fill="#ef4444" />
          </>
        )}

        {/* Accessories */}
        {avatar.accessory === 'glasses' && (
          <>
            <circle cx="43" cy="45" r="6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <circle cx="57" cy="45" r="6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <line x1="49" y1="45" x2="51" y2="45" stroke="#2563eb" strokeWidth="1.5" />
            <line x1="31" y1="45" x2="37" y2="45" stroke="#2563eb" strokeWidth="1" />
            <line x1="63" y1="45" x2="69" y2="45" stroke="#2563eb" strokeWidth="1" />
          </>
        )}
        {avatar.accessory === 'cap' && (
          <>
            {/* Cap Dome */}
            <path d="M32 36 Q50 16 68 36 Z" fill="#b91c1c" />
            {/* Cap Visor */}
            <path d="M28 35 Q50 30 72 35" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        )}
        {avatar.accessory === 'bow' && (
          <path d="M45 24 L55 24 L50 28 Z M55 28 L45 28 L50 24 Z" fill="#ec4899" />
        )}
        {avatar.accessory === 'headphones' && (
          <>
            {/* Headband */}
            <path d="M30 46 A20 20 0 0 1 70 46" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
            {/* Ear cups */}
            <rect x="27" y="42" width="4" height="10" rx="2" fill="#06b6d4" />
            <rect x="69" y="42" width="4" height="10" rx="2" fill="#06b6d4" />
          </>
        )}
      </svg>
    );
  };

  // ==========================================
  // 2. DOCUMENT UPLOADER STATE & LOGIC
  // ==========================================
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docName, setDocName] = useState('Immunization Record');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user) return;
    setLoading(true);
    try {
      // Simulate real cloud upload
      const newDoc = {
        id: Math.random().toString(36).substr(2, 9),
        name: docName,
        fileName: selectedFile.name,
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };

      const updatedDocs = [newDoc, ...(userProfile?.documents || [])];
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { documents: updatedDocs });
      
      setUserProfile((prev: any) => ({ ...prev, documents: updatedDocs }));
      setSelectedFile(null);
      triggerFeedback('success', lang === 'en' ? 'Document uploaded successfully!' : 'ሰነድ በተሳካ ሁኔታ ተሰቅሏል!');
    } catch (err) {
      console.error(err);
      triggerFeedback('error', 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (!user) return;
    try {
      const filtered = userProfile.documents.filter((d: any) => d.id !== id);
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { documents: filtered });
      setUserProfile((prev: any) => ({ ...prev, documents: filtered }));
      triggerFeedback('success', 'Document removed.');
    } catch (err) {
      console.error(err);
      triggerFeedback('error', 'Failed to delete document.');
    }
  };

  // ==========================================
  // 3. HANDBOOK CHAPTERS READER
  // ==========================================
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [handbookSearch, setHandbookSearch] = useState('');
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const handbookChapters = [
    {
      title: lang === 'en' ? '1. Welcome & Philosophy' : '1. እንኳን ደህና መጡ እና ፍልስፍና',
      content: lang === 'en' 
        ? 'Welcome to Kidtopia International Daycare! Our philosophy is centered around providing a holistic, safe, and stimulating environment that fosters intellectual growth, physical coordination, and socio-emotional wellness. We operate under rigorous global childcare excellence policies and ensure small staff-to-child ratios.'
        : 'ወደ ኪድቶፒያ ዓለም አቀፍ የህፃናት ማቆያ እንኳን ደህና መጡ! የእኛ ፍልስፍና አእምሯዊ እድገትን ፣ አካላዊ ቅንጅትን እና ማህበራዊ-ስሜታዊ ደህንነትን የሚያጎለብት አጠቃላይ ፣ ደህንነቱ የተጠበቀ እና አነቃቂ ሁኔታን በመስጠት ላይ ያተኮረ ነው። የምንሰራው ጥብቅ በሆኑ አለም አቀፍ የህፃናት እንክብካቤ ፖሊሲዎች ስር ነው ።'
    },
    {
      title: lang === 'en' ? '2. Strict Health & Screenings' : '2. ጥብቅ የጤና እና ምርመራዎች',
      content: lang === 'en'
        ? 'To maintain a clean and disease-free environment for all children, we enforce mandatory medical screening. All children must submit fully updated immunization charts, TB clearance certificate, HIV, and Hepatitis screening results. Children exhibiting active fevers or contagious symptoms must remain home for at least 24 hours fever-free.'
        : 'ለሁሉም ህፃናት ንጹህ እና ከበሽታ ነፃ የሆነ አካባቢን ለመጠበቅ አስገዳጅ የህክምና ምርመራዎችን እናስፈጽማለን። ሁሉም ህጻናት ሙሉ በሙሉ የተዘመኑ የክትባት ሰንጠረዦችን፣ የቲቢ ምርመራ የምስክር ወረቀት፣ የኤችአይቪ እና የሄፐታይተስ ምርመራ ውጤቶችን ማቅረብ አለባቸው። ንቁ ትኩሳት ወይም ተላላፊ ምልክቶች የሚታዩባቸው ልጆች ቢያንስ ለ24 ሰዓታት ትኩሳት ሳይኖራቸው እቤት መቆየት አለባቸው።'
    },
    {
      title: lang === 'en' ? '3. Drop-off & Digital Security Check-out' : '3. የልጆች አወሳሰድ እና ዲጂታል ደህንነት',
      content: lang === 'en'
        ? 'Security is our utmost priority. Our digital check-in and check-out terminal registers the verified identity of authorized parents/guardians. Fingerprint registration is highly recommended. Only individuals pre-registered in our system with valid government ID card approval can check out a child. No exceptions can be made.'
        : 'ደህንነት ለእኛ ዋነኛ ተግባራችን ነው። የእኛ ዲጂታል መግቢያ እና መውጫ ተርሚናል የተፈቀደላቸውን ወላጆች/አሳዳጊዎችን የተረጋገጠ ማንነት ይመዘግባል። የጣት አሻራ ምዝገባ በጣም ይመከራል። በስርዓታችን ውስጥ በህጋዊ የመንግስት መታወቂያ ቀድሞ የተመዘገቡ ግለሰቦች ብቻ ህፃኑን ማውጣት ይችላሉ። ምንም አይነት ልዩ ሁኔታዎች አይፈቀዱም።'
    },
    {
      title: lang === 'en' ? '4. Daily Schedules & Naptime' : '4. ዕለታዊ መርሃ ግብር እና የእንቅልፍ ሰዓት',
      content: lang === 'en'
        ? 'Our days are filled with structured balance: free play, cognitive group studies, healthy meals, and a dedicated afternoon nap (13:00 to 15:00). Blankets and daycare sheets are clean and laundered internally using our commercial hygienic laundry system.'
        : 'ቀናቶቻችን የተዋቀሩ ሚዛኖች የተሞሉ ናቸው-ነፃ ጨዋታ ፣ የእውቀት ቡድን ጥናቶች ፣ ጤናማ ምግቦች እና ከሰዓት በኋላ እንቅልፍ (ከ 13:00 እስከ 15:00)። ብርድ ልብሶች እና አንሶላዎች በንግድ ንፅህና ማጠቢያ ስርዓታችን በመጠቀም በቤት ውስጥ ይታጠባሉ።'
    }
  ];

  const filteredChapters = handbookChapters.filter(ch => 
    ch.title.toLowerCase().includes(handbookSearch.toLowerCase()) || 
    ch.content.toLowerCase().includes(handbookSearch.toLowerCase())
  );

  // ==========================================
  // 4. DAILY MENU NUTRITION GUIDE
  // ==========================================
  const [allergyFilter, setAllergyFilter] = useState<string[]>([]);
  
  const menuDays = [
    {
      day: lang === 'en' ? 'Monday' : 'ሰኞ',
      breakfast: 'Organic Oat Porridge with fresh bananas and raw honey',
      lunch: 'Lentil Stew (Misir Wot) with high-fiber Injera & steamed spinach',
      snack: 'Assorted fruit skewers with low-fat organic yogurt',
      allergens: ['gluten', 'dairy']
    },
    {
      day: lang === 'en' ? 'Tuesday' : 'ማክሰኞ',
      breakfast: 'Scrambled organic eggs with whole wheat toast',
      lunch: 'Mild chicken breast cubes with mashed sweet potatoes and carrots',
      snack: 'Pumpkin seed kernels and sliced local red apples',
      allergens: ['egg', 'gluten']
    },
    {
      day: lang === 'en' ? 'Wednesday' : 'ረቡዕ',
      breakfast: 'Barley Besso shake with dairy-free almond milk',
      lunch: 'Mixed vegetable and chickpea Shiro stew with soft wheat Injera',
      snack: 'Toasted whole grain crackers with avocado puree spread',
      allergens: ['gluten']
    },
    {
      day: lang === 'en' ? 'Thursday' : 'ሐሙስ',
      breakfast: 'Whole wheat pancakes with natural organic maple syrup',
      lunch: 'Steamed local white fish with brown rice and sauteed green beans',
      snack: 'Dehydrated banana chips and organic orange slices',
      allergens: ['fish', 'gluten']
    },
    {
      day: lang === 'en' ? 'Friday' : 'አርብ',
      breakfast: 'Mashed avocado toast with organic soft cheese crumble',
      lunch: 'Traditional beef stew (Siga Alicha) with fluffy teff Injera',
      snack: 'Baked sweet potato chips with honey cinnamon drizzle',
      allergens: ['dairy', 'gluten']
    }
  ];

  const toggleAllergy = (allergy: string) => {
    setAllergyFilter(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  // ==========================================
  // 5. AUGMENTED REALITY SIMULATOR
  // ==========================================
  const [arTheme, setArTheme] = useState<'animals' | 'alphabet' | 'space'>('animals');
  const [selectedArItem, setSelectedArItem] = useState(0);
  const [arRotation, setArRotation] = useState(180); // Exact degrees
  const [arScale, setArScale] = useState(1.0);
  const [arFeedback, setArFeedback] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gamePrompt, setGamePrompt] = useState('');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Confetti generator
  const triggerConfetti = () => {
    const colors = ['#3a5b32', '#ea580c', '#eab308', '#06b6d4', '#ec4899', '#10b981'];
    const pArray = Array.from({ length: 45 }).map((_, i) => ({
      id: Math.random(),
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 10
    }));
    setParticles(pArray);
    setTimeout(() => setParticles([]), 3000);
  };

  // AR Catalog Items
  const arCatalog = {
    animals: [
      { name: 'Simba the Lion Cub', emoji: '🦁', sound: 'Roar!', fact: 'Lions live in family groups called prides.' },
      { name: 'Gary the Giraffe', emoji: '🦒', sound: 'Hummm!', fact: 'Giraffes have the same number of neck bones as humans!' },
      { name: 'Ellie the Elephant', emoji: '🐘', sound: 'Trumpet!', fact: 'Elephants communicate using low-frequency vibrations.' }
    ],
    alphabet: [
      { name: 'Letter A', emoji: '🍎', sound: 'A is for Apple!', fact: 'Apples float in water because they are 25% air!' },
      { name: 'Letter B', emoji: '🐝', sound: 'B is for Bee!', fact: 'Bees pollinate 1/3 of all food crops!' },
      { name: 'Letter C', emoji: '🐱', sound: 'C is for Cat!', fact: 'Cats can jump up to six times their height!' }
    ],
    space: [
      { name: 'Planet Mars', emoji: '🔴', sound: 'Swoosh!', fact: 'Mars is called the Red Planet because of iron oxide rust.' },
      { name: 'The Moon', emoji: '🌙', sound: 'Beep!', fact: 'The Moon does not make its own light; it reflects the Sun.' },
      { name: 'Golden Rocket', emoji: '🚀', sound: 'Blastoff!', fact: 'Rockets reach speeds over 17,800 miles per hour.' }
    ]
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      triggerFeedback('success', 'Camera initialized successfully!');
    } catch (err) {
      console.warn('Camera failed/blocked, using interactive default backdrop:', err);
      setCameraActive(false);
      triggerFeedback('error', 'Camera blocked. Using beautiful interactive vector nursery backdrop.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Start AR Game
  const startArGame = () => {
    const items = arCatalog[arTheme];
    const target = items[Math.floor(Math.random() * items.length)];
    setGamePrompt(lang === 'en' ? `Place the matching card for "${target.name}" into the center viewport!` : `ለ "${target.name}" የሚስማማውን ካርድ መሃል ላይ ያስቀምጡ!`);
    setSelectedArItem(items.indexOf(target));
  };

  const verifyArMatch = () => {
    triggerConfetti();
    setGameScore(prev => prev + 10);
    setArFeedback(lang === 'en' ? 'Excellent Match! Sparkles and Fact unlocked!' : 'ድንቅ ግጥጥም! እውነታው ተከፍቷል!');
    setTimeout(() => {
      setArFeedback(null);
      startArGame();
    }, 4000);
  };

  // Cleanup Camera on unmount
  useEffect(() => {
    if (actionType === 'ar_activities') {
      startCamera();
      startArGame();
    }
    return () => stopCamera();
  }, [actionType, arTheme]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" 
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative z-10 border border-stone-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
              {actionType === 'handbook' && <Book size={20} />}
              {actionType === 'nutrition' && <Heart size={20} />}
              {actionType === 'terms' && <ShieldAlert size={20} />}
              {actionType === 'avatar' && <Smile size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-editorial font-bold text-stone-900 capitalize">
                {actionType === 'handbook' && (lang === 'en' ? 'Interactive Handbook' : 'የእጅ መጽሐፍ')}
                {actionType === 'nutrition' && (lang === 'en' ? 'Weekly Meal Planner' : 'ምግብ ዕቅድ')}
                {actionType === 'terms' && (lang === 'en' ? 'Terms & Conditions' : 'ውሎች እና ሁኔታዎች')}
                {actionType === 'avatar' && (lang === 'en' ? 'Create Your Avatar' : 'አቫታር መፍጠሪያ')}
              </h2>
              <p className="text-xs text-stone-500">Kidtopia Parent Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* 1. HANDBOOK READER */}
          {actionType === 'handbook' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
              {/* Sidebar chapters */}
              <div className="md:col-span-1 border-r border-stone-150 pr-4 flex flex-col gap-3">
                <div className="relative mb-2">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder={lang === 'en' ? 'Search chapters...' : 'ምዕራፎችን ፈልግ...'}
                    value={handbookSearch}
                    onChange={(e) => setHandbookSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green bg-stone-50/50"
                  />
                </div>
                {filteredChapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedChapter(idx)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      selectedChapter === idx 
                        ? 'bg-brand-green/10 text-brand-green font-bold' 
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-sm truncate">{ch.title}</span>
                    <Bookmark 
                      size={14} 
                      className={bookmarked.includes(idx) ? 'fill-yellow-500 text-yellow-500' : 'text-stone-300'} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookmarked(prev => prev.includes(idx) ? prev.filter(b => b !== idx) : [...prev, idx]);
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Reader panel */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-stone-100 pb-3">
                    <h3 className="text-2xl font-editorial font-bold text-stone-900">
                      {handbookChapters[selectedChapter].title}
                    </h3>
                    <button 
                      onClick={() => window.print()}
                      className="p-2 text-stone-400 hover:text-brand-green rounded-lg transition-colors"
                      title="Print Page"
                    >
                      <Printer size={18} />
                    </button>
                  </div>
                  <p className="text-stone-650 leading-relaxed font-sans text-base whitespace-pre-line">
                    {handbookChapters[selectedChapter].content}
                  </p>
                </div>

                <div className="mt-8 p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center gap-3">
                  <Award size={18} className="text-brand-green shrink-0" />
                  <p className="text-xs text-stone-600 font-medium leading-normal">
                    {lang === 'en' 
                      ? 'Confirm that you have read and understood our policies. This acknowledgement status is shared with the administration.' 
                      : 'ይህን መመሪያ ማንበብዎን እና መረዳትዎን ያረጋግጡ። የማረጋገጫ ሁኔታው ለትምህርት ቤቱ አስተዳደር ይጋራል።'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. TERMS & CONDITIONS */}
          {actionType === 'terms' && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-3">
                <h3 className="text-2xl font-editorial font-bold text-stone-900">
                  {lang === 'en' ? 'Daycare & Preschool Comprehensive Policies' : 'የህፃናት ማቆያ እና የቅድመ ትምህርት ቤት አጠቃላይ ፖሊሲዎች'}
                </h3>
                <button 
                  onClick={() => window.print()}
                  className="p-2 text-stone-400 hover:text-brand-green rounded-lg transition-colors"
                  title="Print Terms"
                >
                  <Printer size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-4 space-y-8 text-stone-700 leading-relaxed pb-10">
                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Heart size={18} className="text-red-500" />
                    1. Health and Wellness Policy
                  </h4>
                  <p className="text-sm">To maintain a healthy environment, children with a fever of 38°C or higher, vomiting, diarrhea, or contagious rashes must stay home. A child must be symptom-free for 24 hours without medication before returning. All children must submit updated immunization, TB, HIV, and Hepatitis screening results before admission.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-brand-orange" />
                    2. Security & Safety Protocols
                  </h4>
                  <p className="text-sm">Kidtopia maintains a secure, gated environment. All visitors must register at the front desk. We conduct regular safety drills (fire, emergency evacuation). Staff are trained in basic first aid and emergency response to ensure your child's safety at all times.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Camera size={18} className="text-brand-teal" />
                    3. CCTV Camera Policy
                  </h4>
                  <p className="text-sm">For safety, security, and quality monitoring, Kidtopia is equipped with 24/7 CCTV surveillance in all common areas, classrooms, and playgrounds. Footage is used strictly for internal security audits and incident reviews. To protect the privacy of all children, live streaming to parents is not provided, but footage can be reviewed with management in case of reported incidents.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-brand-green" />
                    4. Payment and Fees
                  </h4>
                  <p className="text-sm">Tuition is due by the 5th of every month. A late fee applies after the 10th. A non-refundable registration fee is required upon enrollment. We require a 30-day written notice for withdrawal. No refunds are provided for short-term absences due to illness or family vacations.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Compass size={18} className="text-brand-yellow" />
                    5. Pickup and Drop-off Time
                  </h4>
                  <p className="text-sm">Standard drop-off is between 7:30 AM and 9:00 AM. Standard pickup is between 4:00 PM and 6:00 PM. Parents arriving after 6:00 PM will be charged a late pickup fee of $1.00 per minute. Please notify us if you will be arriving late due to unforeseen circumstances.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-orange" />
                    6. Nutrition and Dietary Guidelines
                  </h4>
                  <p className="text-sm">We provide balanced, organic, and locally sourced meals. Our menu is designed by nutritionists to support growth. We are a "Nut-Free" facility. Parents must clearly document any food allergies during enrollment. Outside food is only permitted for special celebrations and must be pre-approved.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <AlertCircle size={18} className="text-stone-500" />
                    7. Jewelry and Small Objects
                  </h4>
                  <p className="text-sm">For the safety of all children, please do not send your child to daycare wearing expensive jewelry, small earrings that can easily detach, or small toys that pose a choking hazard. Kidtopia is not responsible for lost or damaged personal items.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Users size={18} className="text-brand-teal" />
                    8. Visit and Off-Time Pickup Policy
                  </h4>
                  <p className="text-sm">Parents are welcome to visit by appointment. For unscheduled off-time pickups (e.g., doctor appointments), please notify the office at least 2 hours in advance so we can prepare your child. Only authorized persons on the pickup list with valid ID can take the child.</p>
                </section>

                <section className="bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Award size={18} className="text-brand-green" />
                    9. Injury and Behavior Management
                  </h4>
                  <p className="text-sm">In case of minor injury, staff will provide first aid and notify parents via the daily report. For emergencies, parents will be contacted immediately. We use "Positive Reinforcement" for behavior management; we do not use corporal punishment. Persistent aggressive behavior will result in a parent conference to develop a support plan.</p>
                </section>
              </div>

              <div className="mt-4 p-6 bg-brand-green/5 border border-brand-green/10 rounded-2.5xl flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={20} className="text-brand-green" />
                  <p className="text-xs sm:text-sm text-stone-600 font-medium">
                    {lang === 'en' 
                      ? 'By enrolling your child, you agree to abide by these comprehensive terms and conditions.' 
                      : 'ልጅዎን በማስመዝገብ፣ በእነዚህ አጠቃላይ ውሎች እና ሁኔታዎች ለመስማማት ተስማምተዋል።'}
                  </p>
                </div>
                <button 
                  onClick={() => triggerFeedback('success', lang === 'en' ? 'Policies accepted!' : 'ፖሊሲዎች ተቀባይነት አግኝተዋል!')}
                  className="w-full sm:w-auto px-8 py-3 bg-brand-green text-white rounded-xl text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  {lang === 'en' ? 'I Accept All Policies' : 'ሁሉንም ፖሊሲዎች እቀበላለሁ'}
                </button>
              </div>
            </div>
          )}

          {/* 3. NUTRITION & MEAL PLAN GUIDE */}
          {actionType === 'nutrition' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-lg font-bold text-stone-950">{lang === 'en' ? 'Daily Food & Allergen Tracker' : 'የዕለታዊ ምግብ እና አለርጂ መከታተያ'}</h3>
                  <p className="text-xs text-stone-500">Kidtopia Daycare Kitchen - Certified Fresh & Organic</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold text-stone-600 mr-2 self-center">Allergen Filters:</span>
                  {['gluten', 'dairy', 'egg', 'fish'].map((allergen) => (
                    <button
                      key={allergen}
                      onClick={() => toggleAllergy(allergen)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                        allergyFilter.includes(allergen)
                          ? 'bg-red-500 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {allergen}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly menu timeline */}
              <div className="space-y-4">
                {menuDays.map((day, idx) => {
                  const hasAllergens = day.allergens.some(a => allergyFilter.includes(a));
                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2.5xl border transition-all ${
                        hasAllergens 
                          ? 'border-red-200 bg-red-50/20 shadow-sm' 
                          : 'border-stone-150 bg-white hover:border-brand-green/20'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-editorial text-lg font-bold text-stone-900">{day.day}</span>
                        <div className="flex gap-1.5">
                          {day.allergens.map((allergy) => (
                            <span 
                              key={allergy}
                              className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                allergyFilter.includes(allergy)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-stone-100 text-stone-500'
                              }`}
                            >
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                        <div className="p-3.5 bg-stone-50/50 rounded-2xl">
                          <span className="text-[10px] font-bold text-brand-orange uppercase tracking-wider">Breakfast</span>
                          <p className="text-sm font-medium text-stone-850 mt-1">{day.breakfast}</p>
                        </div>
                        <div className="p-3.5 bg-stone-50/50 rounded-2xl">
                          <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Lunch</span>
                          <p className="text-sm font-medium text-stone-850 mt-1">{day.lunch}</p>
                        </div>
                        <div className="p-3.5 bg-stone-50/50 rounded-2xl">
                          <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider">PM Snack</span>
                          <p className="text-sm font-medium text-stone-850 mt-1">{day.snack}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. AVATAR CREATOR */}
          {actionType === 'avatar' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
              {/* Preview */}
              <div className="text-center p-6 bg-stone-50 rounded-3xl border border-stone-150 flex flex-col justify-center items-center min-h-[300px]">
                {renderAvatarSVG()}
                <div className="mt-4">
                  <h4 className="font-bold text-stone-900 capitalize font-editorial text-lg">
                    {lang === 'en' ? 'My Avatar' : 'የእኔ አቫታር'}
                  </h4>
                  <p className="text-xs text-stone-500">Customized Kidtopia Profile Character</p>
                </div>
              </div>

              {/* Editor Categories */}
              <div className="space-y-4 text-left">
                {/* Skin tone */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Skin Tone (የቆዳ ቀለም)</label>
                  <div className="flex gap-2">
                    {['#F5C29D', '#E2A272', '#C68654', '#8D5524', '#FFDBAC'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatar({ ...avatar, skinColor: color })}
                        style={{ backgroundColor: color }}
                        className={`w-7 h-7 rounded-full border-2 ${avatar.skinColor === color ? 'border-brand-green scale-110' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Hairstyles */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Hairstyle (የፀጉር ዘይቤ)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['short', 'curly', 'ponytail', 'braids'].map((hair) => (
                      <button
                        key={hair}
                        onClick={() => setAvatar({ ...avatar, hairstyle: hair })}
                        className={`py-1.5 border rounded-xl text-xs font-bold capitalize transition ${
                          avatar.hairstyle === hair 
                            ? 'bg-brand-green/10 text-brand-green border-brand-green/40' 
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {hair}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Costumes */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Clothing / Costume (ልብስ)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['uniform', 'overall', 'hoodie', 'tshirt'].map((clothing) => (
                      <button
                        key={clothing}
                        onClick={() => setAvatar({ ...avatar, clothing: clothing })}
                        className={`py-1.5 border rounded-xl text-xs font-bold capitalize transition ${
                          avatar.clothing === clothing 
                            ? 'bg-brand-green/10 text-brand-green border-brand-green/40' 
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {clothing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expressions */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Expression / Emotion (ስሜት)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['happy', 'excited', 'silly', 'smart'].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => setAvatar({ ...avatar, expression: exp })}
                        className={`py-1.5 border rounded-xl text-xs font-bold capitalize transition ${
                          avatar.expression === exp 
                            ? 'bg-brand-green/10 text-brand-green border-brand-green/40' 
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accessories */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Accessory (መለዋወጫ)</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {['none', 'glasses', 'cap', 'bow', 'headphones'].map((acc) => (
                      <button
                        key={acc}
                        onClick={() => setAvatar({ ...avatar, accessory: acc })}
                        className={`py-1.5 border rounded-xl text-[10px] font-bold capitalize transition truncate ${
                          avatar.accessory === acc 
                            ? 'bg-brand-green/10 text-brand-green border-brand-green/40' 
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {acc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent color picker */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Accent Color (የቀለም ምርጫ)</label>
                  <div className="flex gap-2">
                    {['#3a5b32', '#ea580c', '#0284c7', '#db2777', '#7c3aed'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setAvatar({ ...avatar, primaryColor: color })}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full border-2 ${avatar.primaryColor === color ? 'border-stone-900 scale-110' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={saveAvatar}
                    disabled={loading}
                    className="w-full py-3 bg-brand-green hover:bg-brand-green/95 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition"
                  >
                    {loading ? (lang === 'en' ? 'Saving...' : 'በማስቀመጥ ላይ...') : (lang === 'en' ? 'Save Profile Avatar' : 'አቫታር አስቀምጥ')}
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </motion.div>

      {/* Floating feedback notification inside the portal */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-lg text-white font-semibold flex items-center gap-2 text-xs uppercase tracking-wider ${
              feedback.type === 'success' ? 'bg-brand-green' : 'bg-red-500'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
