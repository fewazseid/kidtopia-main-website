import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Book, FileText, CheckCircle2, Download, Upload, AlertCircle, 
  Trash2, ShieldAlert, Award, Compass, RotateCw, Smile, 
  Sliders, Sparkles, Volume2, Search, Printer, Bookmark, Eye, Camera, Heart, CheckSquare,
  Scale, Laptop, MessageSquare, ShieldCheck, DollarSign, Clock
} from 'lucide-react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useContent } from '../ContentContext';
import { PolicyModal } from './PolicyModal';

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

  const contentResources = useContent(lang).resources;
  const handbookChapters = contentResources.handbookChapters || [];

  const filteredChapters = handbookChapters.filter((ch: any) => 
    ch.title.toLowerCase().includes(handbookSearch.toLowerCase()) || 
    ch.content.toLowerCase().includes(handbookSearch.toLowerCase())
  );

  // ==========================================
  // 4. DAILY MENU NUTRITION GUIDE
  // ==========================================
  const [allergyFilter, setAllergyFilter] = useState<string[]>([]);
  
  const menuDays = contentResources.menuDays || [];

  const toggleAllergy = (allergy: string) => {
    setAllergyFilter(prev => 
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  // ==========================================
  // 5. DEVELOPMENT MILESTONES TRACKER
  // ==========================================
  const [milestoneAge, setMilestoneAge] = useState<'toddler' | 'preschool' | 'kinder'>('toddler');
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([]);
  
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<'terms' | 'guidelines' | 'health' | 'privacy'>('terms');

  const openPolicy = (tab: 'terms' | 'guidelines' | 'health' | 'privacy') => {
    setPolicyTab(tab);
    setIsPolicyOpen(true);
  };

  const milestonesData = contentResources.milestonesData || {
    toddler: { title: '', items: [] },
    preschool: { title: '', items: [] },
    kinder: { title: '', items: [] }
  };

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
              {actionType === 'forms' && <FileText size={20} />}
              {actionType === 'nutrition' && <Heart size={20} />}
              {actionType === 'ar_activities' && <Compass size={20} />}
              {actionType === 'avatar' && <Smile size={20} />}
              {actionType === 'milestones' && <CheckSquare size={20} />}
              {actionType === 'intl_act' && <Scale size={20} />}
              {actionType === 'intl_guidelines' && <ShieldCheck size={20} />}
              {actionType === 'comms' && <Laptop size={20} />}
              {actionType === 'policies' && <ShieldCheck size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-editorial font-bold text-stone-900 capitalize">
                {actionType === 'handbook' && (lang === 'en' ? 'Interactive Handbook' : 'የእጅ መጽሐፍ')}
                {actionType === 'forms' && (lang === 'en' ? 'Document Upload & Forms' : 'ቅጾች እና ሰነዶች')}
                {actionType === 'nutrition' && (lang === 'en' ? 'Weekly Meal Planner' : 'ምግብ ዕቅድ')}
                {actionType === 'ar_activities' && (lang === 'en' ? 'Interactive AR Activities' : 'ኤአር ትምህርታዊ ጨዋታ')}
                {actionType === 'avatar' && (lang === 'en' ? 'Create Your Avatar' : 'አቫታር መፍጠሪያ')}
                {actionType === 'milestones' && (lang === 'en' ? 'Development Milestones Tracker' : 'የልጅ እድገት ደረጃዎች መከታተያ')}
                {actionType === 'intl_act' && (lang === 'en' ? 'Ethiopian Child Care Standards (Directive 1084/2025)' : 'የኢትዮጵያ የህፃናት ማቆያ ደረጃዎች (መመሪያ 1084/2025)')}
                {actionType === 'intl_guidelines' && (lang === 'en' ? 'Daycare Parent Handbook Guidelines' : 'የማቆያ መመሪያዎች እና ደንቦች')}
                {actionType === 'comms' && (lang === 'en' ? 'Daycare Control & Communication Software' : 'የማቆያ መቆጣጠሪያ እና መገናኛ ሶፍትዌር')}
                {actionType === 'policies' && (lang === 'en' ? 'Policies & Terms' : 'ፖሊሲዎች እና ደንቦች')}
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
                  <div className="flex flex-wrap gap-2 mb-4"><button onClick={() => openPolicy('terms')} className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-50">View Terms</button><button onClick={() => openPolicy('guidelines')} className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-50">View Guidelines</button><button onClick={() => openPolicy('health')} className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-50">View Health</button></div><Award size={18} className="text-brand-green shrink-0" />
                  <p className="text-xs text-stone-600 font-medium leading-normal">
                    {lang === 'en' 
                      ? 'Confirm that you have read and understood our policies. This acknowledgement status is shared with the administration.' 
                      : 'ይህን መመሪያ ማንበብዎን እና መረዳትዎን ያረጋግጡ። የማረጋገጫ ሁኔታው ለትምህርት ቤቱ አስተዳደር ይጋራል።'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. FORMS & UPLOAD CENTER */}
          {actionType === 'forms' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* Form Downloads & Upload Trigger */}
              <div>
                <h3 className="text-lg font-bold text-stone-950 mb-4">{lang === 'en' ? 'Download Enrollment Forms' : 'የመመዝገቢያ ቅጾችን ያውርዱ'}</h3>
                <div className="space-y-3 mb-8">
                  <div className="p-4 border border-stone-200 rounded-2xl flex justify-between items-center bg-stone-50/50 hover:bg-stone-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Enrollment_Contract.pdf</h4>
                        <p className="text-xs text-stone-500">Size: 1.4 MB | PDF Forms</p>
                      </div>
                    </div>
                    <a href="#" className="p-2 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-100 transition shadow-sm">
                      <Download size={16} />
                    </a>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-2xl flex justify-between items-center bg-stone-50/50 hover:bg-stone-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">Health_Screening_Form.pdf</h4>
                        <p className="text-xs text-stone-500">Size: 950 KB | Doctor Approved</p>
                      </div>
                    </div>
                    <a href="#" className="p-2 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-100 transition shadow-sm">
                      <Download size={16} />
                    </a>
                  </div>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleUploadDocument} className="border-2 border-dashed border-stone-200 rounded-2.5xl p-6 text-center hover:border-brand-green/40 transition">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,image/*"
                    onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  />
                  <Upload size={32} className="mx-auto text-stone-400 mb-3" />
                  <p className="text-sm text-stone-800 font-bold mb-1">
                    {lang === 'en' ? 'Drag and drop files here, or click to browse' : 'ሰነዶችን እዚህ ይጎትቱ፣ ወይም ጠቅ አድርገው ይምረጡ'}
                  </p>
                  <p className="text-xs text-stone-500 mb-4">Supports PDF or Image files up to 10MB</p>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-stone-600 mb-1 text-left">Document Category</label>
                    <select 
                      value={docName} 
                      onChange={(e) => setDocName(e.target.value)}
                      className="w-full p-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green bg-white font-medium text-stone-800"
                    >
                      <option value="Immunization Record">Immunization Record (የክትባት ካርድ)</option>
                      <option value="TB Screening Certificate">TB Screening (የቲቢ ምርመራ)</option>
                      <option value="Birth Certificate">Birth Certificate (የልደት ምስክር ወረቀት)</option>
                      <option value="Parent Acknowledgment Form">Handbook Acknowledgment (የእጅ መጽሐፍ ስምምነት)</option>
                    </select>
                  </div>

                  {selectedFile ? (
                    <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl text-xs font-bold mb-4 flex justify-between items-center">
                      <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                      <button type="button" onClick={() => setSelectedFile(null)} className="text-red-500"><X size={14} /></button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold mr-2 transition-all"
                  >
                    Select File
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile || loading}
                    className="px-4 py-2 bg-brand-green hover:bg-brand-green/95 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Upload Document
                  </button>
                </form>
              </div>

              {/* Upload History & Verification Status */}
              <div className="border-l border-stone-100 pl-4 flex flex-col h-full">
                <h3 className="text-lg font-bold text-stone-950 mb-4">{lang === 'en' ? 'Uploaded Documents & Review Status' : 'የተሰቀሉ ሰነዶች እና ግምገማ ሁኔታ'}</h3>
                {userProfile?.documents && userProfile.documents.length > 0 ? (
                  <div className="space-y-3 overflow-y-auto max-h-[350px]">
                    {userProfile.documents.map((doc: any, i: number) => (
                      <div key={i} className="p-4 border border-stone-150 rounded-2xl flex justify-between items-center hover:bg-stone-50 transition">
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                            {doc.name}
                            {doc.status === 'approved' && <CheckCircle2 size={14} className="text-green-500" />}
                            {doc.status === 'pending' && <AlertCircle size={14} className="text-yellow-500" />}
                          </h4>
                          <p className="text-xs text-stone-500">Uploaded on {doc.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            doc.status === 'approved' 
                              ? 'bg-green-100 text-green-700' 
                              : doc.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {doc.status}
                          </span>
                          <button 
                            onClick={() => deleteDocument(doc.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-400 font-medium">
                    No documents uploaded yet.
                  </div>
                )}
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

          {/* 5. INTERACTIVE AR SIMULATOR */}
          {/* AR activities have been removed as requested. */}

          {/* 6. DEVELOPMENT MILESTONES TRACKER */}
          {actionType === 'milestones' && (
            <div className="max-w-4xl mx-auto h-full flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-stone-100 pb-5">
                  <div>
                    <h3 className="text-xl font-editorial font-bold text-stone-900">
                      {lang === 'en' ? 'Interactive Milestones & Cognitive Growth Checklist' : 'በይነተገናኝ የእድገት ደረጃዎች መከታተያ'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {lang === 'en' 
                        ? 'Select your child’s age range below to track age-appropriate developmental benchmarks.' 
                        : 'የልጅዎን የዕድሜ ክልል በመምረጥ የእድገት መመዘኛዎችን እዚህ ይከታተሉ።'}
                    </p>
                  </div>
                  
                  {/* Category select buttons */}
                  <div className="flex bg-stone-100 p-1 rounded-xl shrink-0">
                    {(['toddler', 'preschool', 'kinder'] as const).map((ageKey) => (
                      <button
                        key={ageKey}
                        onClick={() => setMilestoneAge(ageKey)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                          milestoneAge === ageKey
                            ? 'bg-white text-brand-green shadow-sm'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {ageKey === 'toddler' ? (lang === 'en' ? 'Toddler' : 'ታዳጊ') : ageKey === 'preschool' ? (lang === 'en' ? 'Preschool' : 'ቅድመ ትምህርት') : (lang === 'en' ? 'Kindergarten' : 'ኪንደርጋርተን')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress bar */}
                {(() => {
                  const currentCategoryItems = milestonesData[milestoneAge].items;
                  const checkedInCat = currentCategoryItems.filter(item => checkedMilestones.includes(item.id)).length;
                  const totalInCat = currentCategoryItems.length;
                  const percent = totalInCat > 0 ? Math.round((checkedInCat / totalInCat) * 100) : 0;
                  
                  return (
                    <div className="mb-8 p-5 bg-brand-green/5 border border-brand-green/10 rounded-2.5xl">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs font-black uppercase tracking-wider text-brand-green">
                          {milestonesData[milestoneAge].title}
                        </span>
                        <span className="text-sm font-mono font-bold text-brand-green">{percent}% Completed</span>
                      </div>
                      
                      {/* Bar */}
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="h-full bg-brand-green rounded-full shadow-[0_0_10px_rgba(58,91,50,0.3)]"
                        />
                      </div>

                      <p className="text-xs text-stone-500 mt-2 font-medium">
                        {percent === 100 
                          ? (lang === 'en' ? 'Outstanding! All developmental milestones have been checked and tracked!' : 'ድንቅ ነው! ሁሉም የእድገት ደረጃዎች ምልክት ተደርገውባቸዋል!') 
                          : percent >= 50
                          ? (lang === 'en' ? 'Great progress! Your child is growing and achieving crucial developmental leaps.' : 'ጥሩ እድገት ነው! ልጅዎ ወሳኝ የሆኑ የእድገት ደረጃዎችን እያሳካ ነው።')
                          : (lang === 'en' ? 'Check off milestones as your child demonstrates these social, cognitive, and physical skills.' : 'ልጅዎ ማህበራዊ፣ የእውቀት እና የአካል ክህሎቶችን ሲያሳይ ምልክት ያድርጉባቸው።')
                        }
                      </p>
                    </div>
                  );
                })()}

                {/* Checklist Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {milestonesData[milestoneAge].items.map((item) => {
                    const isChecked = checkedMilestones.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        onClick={() => {
                          setCheckedMilestones(prev => 
                            isChecked ? prev.filter(id => id !== item.id) : [...prev, item.id]
                          );
                          if (!isChecked) {
                            // Play audio guidance safely
                            const utterance = new SpeechSynthesisUtterance(lang === 'en' ? 'Awesome!' : 'ድንቅ!');
                            utterance.rate = 1.2;
                            window.speechSynthesis?.speak(utterance);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                          isChecked 
                            ? 'bg-brand-green/10 border-brand-green/40 shadow-sm' 
                            : 'border-stone-150 hover:border-stone-200 bg-white hover:bg-stone-50/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center mt-0.5 transition-all ${
                          isChecked ? 'bg-brand-green border-brand-green text-white' : 'border-stone-300'
                        }`}>
                          {isChecked && <CheckSquare size={14} className="stroke-[3]" />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold transition-colors leading-relaxed ${
                            isChecked ? 'text-stone-900' : 'text-stone-700'
                          }`}>
                            {item.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PDF Print/Share */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center bg-stone-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-5">
                <p className="text-xs text-stone-500 font-medium">
                  {lang === 'en' 
                    ? 'Disclaimer: This checklist is for informational purposes only. Consult with your pediatrician for health assessments.' 
                    : 'ማስገንዘቢያ፡ ይህ የመከታተያ ዝርዝር ለመረጃ አገልግሎት ብቻ የተዘጋጀ ነው። ለጤና ግምገማዎች እባክዎን የልጆች ሐኪም ያማክሩ።'}
                </p>
                <button
                  onClick={() => window.print()}
                  className="px-4.5 py-2.5 bg-brand-green text-white rounded-xl text-xs font-black shadow-md hover:bg-brand-green/95 transition flex items-center gap-2"
                >
                  <Printer size={14} />
                  <span>{lang === 'en' ? 'Print Report' : 'ሪፖርት አትም'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 7. ETHIOPIAN CHILD CARE STANDARDS (DIRECTIVE 1084/2025) */}
          {actionType === 'intl_act' && (
            <div className="max-w-4xl mx-auto h-full text-left space-y-6">
              <div className="p-5 bg-brand-green/5 border border-brand-green/10 rounded-2.5xl flex items-start gap-4 mb-4">
                <Scale className="text-brand-green shrink-0 mt-1 animate-pulse" size={24} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-lg">
                    {lang === 'en' ? 'Ministry of Women & Social Affairs (MoWSA) Compliance Directive' : 'የሴቶችና ማህበራዊ ጉዳይ ሚኒስቴር (MoWSA) አስገዳጅ መመሪያ'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {lang === 'en' 
                      ? 'Legal criteria, safety procedures, and mandated care-ratios governed under Ethiopia Child-care centers Directive Number 1084/2025.'
                      : 'በኢትዮጵያ የህጻናት ማቆያ ማዕከላት መመሪያ ቁጥር 1084/2025 ስር የተደነገጉ ህጋዊ መስፈርቶች፣ የደህንነት ሂደቶች እና የእንክብካቤ ደረጃዎች።'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Ratio Card */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 space-y-4">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-brand-green flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <ShieldCheck size={14} />
                    {lang === 'en' ? 'Staff-to-Child Ratios' : 'የሰራተኛ እና የህጻናት ጥምርታ'}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">{lang === 'en' ? 'Infants (3-12 months)' : 'ህጻናት (ከ3-12 ወራት)'}</span>
                      <span className="font-mono font-bold px-2 py-0.5 bg-brand-green/10 text-brand-green rounded">1 : 3</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">{lang === 'en' ? 'Toddlers (1-2 years)' : 'ታዳጊዎች (ከ1-2 ዓመት)'}</span>
                      <span className="font-mono font-bold px-2 py-0.5 bg-brand-green/10 text-brand-green rounded">1 : 5</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-stone-700">{lang === 'en' ? 'Preschool (3-5 years)' : 'ቅድመ ትምህርት (ከ3-5 ዓመት)'}</span>
                      <span className="font-mono font-bold px-2 py-0.5 bg-brand-green/10 text-brand-green rounded">1 : 10</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 leading-relaxed font-medium">
                    {lang === 'en' 
                      ? 'Strictly monitored maximum limits under Article 9 of Directive 1084/2025 to ensure focused individual attention and developmental tracking.'
                      : 'ለእያንዳንዱ ህጻን በቂ ትኩረት ለመስጠት በመመሪያው አንቀጽ 9 ስር የተቀመጠው ከፍተኛው የልጆች ቁጥር ገደብ።'}
                  </p>
                </div>

                {/* Safety Card */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 space-y-4">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-brand-orange flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <AlertCircle size={14} />
                    {lang === 'en' ? 'Required Facilities' : 'የማዕከሉ የስራ መስፈርቶች'}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2 leading-relaxed">
                    <li>• <strong>{lang === 'en' ? 'Medical Isolation Room' : 'የህክምና ማግለያ ክፍል'}</strong>: {lang === 'en' ? 'Dedicated quarantine space for sudden illnesses.' : 'ድንገት ለሚታመሙ ህጻናት የተለየ ማቆያ።'}</li>
                    <li>• <strong>{lang === 'en' ? 'Separate Lavatories' : 'የተለዩ መጸዳጃ ቤቶች'}</strong>: {lang === 'en' ? 'Exclusive independent toilets for children and adult staff.' : 'ለልጆች እና ለአዋቂዎች ለየብቻ የተዘጋጁ ንጹህ መጸዳጃዎች።'}</li>
                    <li>• <strong>{lang === 'en' ? 'Biometric Check-out' : 'የደህንነት መውጫ ቁጥጥር'}</strong>: {lang === 'en' ? 'Mandatory electronic tracking log for child safety.' : 'ልጆችን በቁጥጥር ስር ለማስገባት የጣት አሻራ መመዝገቢያ።'}</li>
                  </ul>
                </div>

                {/* Medical Screening Card */}
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 space-y-4">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider text-brand-teal flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <Heart size={14} />
                    {lang === 'en' ? 'Health Mandates' : 'የጤና እና የክትባት ግዴታዎች'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {lang === 'en' 
                      ? 'No child can be admitted without a stamped pediatric lab screening proving immunization updates and active clearance for Tuberculosis, HIV, and Hepatitis B.'
                      : 'ሁሉም ህጻናት ከመመዝገባቸው በፊት ከታወቀ የላብራቶሪ የሳንባ ነቀርሳ (TB)፣ የኤችአይቪ (HIV)፣ የሄፓታይተስ ቢ እና የክትባት ማረጋገጫ ማቅረብ አለባቸው።'}
                  </p>
                  <div className="p-2.5 bg-brand-teal/5 border border-brand-teal/15 rounded-xl flex items-center gap-2">
                    <ShieldCheck className="text-brand-teal shrink-0" size={16} />
                    <span className="text-[10px] text-brand-teal font-extrabold uppercase tracking-wide">{lang === 'en' ? '100% Compliant Facility' : 'ሙሉ በሙሉ ደንብን የሚያከብር ማዕከል'}</span>
                  </div>
                </div>
              </div>

              {/* Legal Disclaimer & Articles List */}
              <div className="p-5 border border-stone-200 rounded-2.5xl space-y-3 bg-white">
                <h4 className="font-bold text-stone-900 text-sm">{lang === 'en' ? 'Core Regulatory Articles - Daycare Obligations' : 'ዋና ዋና አስገዳጅ አንቀጾች - የማቆያው ግዴታዎች'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
                  <div className="p-3.5 bg-stone-50/50 rounded-xl space-y-1.5 border border-stone-100">
                    <strong className="text-stone-900 block">{lang === 'en' ? 'Article 14: Prohibition of Corporal Punishment' : 'አንቀጽ 14፡ የአካል ቅጣት ሙሉ በሙሉ መከልከል'}</strong>
                    <p>{lang === 'en' ? 'Absolute ban on physical punishment, emotional abuse, isolation, or verbal degradation of children. Focus is centered purely on positive behavioral reinforcement.' : 'በልጆች ላይ ማንኛውንም አይነት የአካል ወይም የስሜት ቅጣት፣ ማግለል ወይም መሳደብ መፈጸም በጥብቅ የተከለከለ ነው። ትকুረቱ በአዎንታዊ ባህሪ ግንባታ ላይ ነው።'}</p>
                  </div>
                  <div className="p-3.5 bg-stone-50/50 rounded-xl space-y-1.5 border border-stone-100">
                    <strong className="text-stone-900 block">{lang === 'en' ? 'Article 22: Caregiver Certifications' : 'አንቀጽ 22፡ የእንክብካቤ ሰጪዎች ማረጋገጫ'}</strong>
                    <p>{lang === 'en' ? 'All active childcare personnel must possess certified college credentials in nursing, pediatric health, or early childhood education, paired with valid background checks.' : 'ሁሉም የእንክብካቤ ሰራተኞች በህፃናት ህክምና፣ በነርሲንግ ወይም በቅድመ-ወሊድ አስተዳደግ የሰለጠኑ እና የጸዳ የፖሊስ ሰነድ ያላቸው መሆን አለባቸው።'}</p>
                  </div>
                </div>
              </div>

              {/* Print and Download Footer */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center bg-stone-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-5">
                <p className="text-xs text-stone-500 font-medium">
                  {lang === 'en' 
                    ? 'Official documentation sourced from the Ethiopian Federal Ministry of Justice.' 
                    : 'ከኢትዮጵያ ፌዴራላዊ የፍትህ ሚኒስቴር የተወሰደ ህጋዊ ሰነድ።'}
                </p>
                <button
                  onClick={() => window.print()}
                  className="px-4.5 py-2.5 bg-brand-green text-white rounded-xl text-xs font-black shadow-md hover:bg-brand-green/95 transition flex items-center gap-2"
                >
                  <Printer size={14} />
                  <span>{lang === 'en' ? 'Print Directive Sheet' : 'መመሪያውን አትም'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 8. DAYCARE PARENT HANDBOOK 2025 GUIDELINES Accordion */}
          {actionType === 'intl_guidelines' && (
            <div className="max-w-4xl mx-auto h-full text-left space-y-6">
              <div className="p-5 bg-brand-orange/5 border border-brand-orange/10 rounded-2.5xl flex items-start gap-4 mb-4">
                <Book className="text-brand-orange shrink-0 mt-1 animate-bounce" size={24} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-lg">
                    {lang === 'en' ? 'Parent Handbook Operations Summary' : 'የወላጅ መመሪያ መጽሐፍ ደንቦች ማጠቃለያ'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {lang === 'en' 
                      ? 'Detailed handbook summary for enrolled parents, including tuition fees, check-in, health, and routines as of Sept 2025.'
                      : 'የተመዘገቡ ወላጆች ሊከተሏቸው የሚገቡ ዝርዝር የማቆያው ደንቦች፣ ክፍያዎች፣ የጤና እና የእለት ተእለት ፕሮግራሞች።'}
                  </p>
                </div>
              </div>

              {/* Accordion List */}
              <div className="space-y-4">
                {[
                  {
                    id: 'payment',
                    title: lang === 'en' ? 'Tuition, Late Payments, & Suspension' : 'የወር ክፍያ፣ የቅጣት ውሎች እና ጊዜያዊ እገዳ',
                    icon: DollarSign,
                    color: 'text-brand-orange',
                    content: lang === 'en' 
                      ? 'Tuition fees must be cleared by the 1st day of every month. A 10% penalty is automatically added on the 6th day for any unpaid balances. Services are suspended immediately on the 11th if payment remains outstanding. To withdraw a child, a full 30 days prior written notice is required, otherwise the security deposit is forfeited.' 
                      : 'የማቆያ ክፍያ በየወሩ ከ1ኛው ቀን በፊት በጥሬ ገንዘብ ወይም በባንክ ክፍያ መፈጸም አለበት። ካልተከፈለ ከ6ኛው ቀን ጀምሮ የ10% የቅጣት ክፍያ ይታሰባል። ክፍያው ሳይጠናቀቅ 11ኛው ቀን ላይ ከደረሰ አገልግሎቱ ለልጅዎ ለጊዜው ይቋረጣል። ልጅዎን ከማቆያው ለማውጣት ቢያንስ የ30 ቀናት ቅድመ ማስጠንቀቂያ በጽሁፍ ለአስተዳደሩ ማስገባት አለብዎት፤ ያለበለዚያ የያዙት የዋስትና ክፍያ አይመለስም።'
                  },
                  {
                    id: 'hours',
                    title: lang === 'en' ? 'Operating Hours, Authorizations & Late Pick-ups' : 'የስራ ሰዓት፣ ህጋዊ ልጅ መረከቢያ እና የዘግይቶ መረከብ ክፍያ',
                    icon: Clock,
                    color: 'text-brand-yellow',
                    content: lang === 'en' 
                      ? 'We are open from 7:30 AM to 6:00 PM, Monday to Friday. A penalty of $1 per minute is strictly added for any pick-ups after 6:00 PM. Children will ONLY be released to authorized individuals registered in our database with valid fingerprint credentials and photo IDs. Any temporary pick-up changes must be authorized in writing 2 hours in advance.' 
                      : 'የመክፈቻ ሰዓት ከሰኞ እስከ አርብ ከጠዋቱ 1:30 ሰዓት እስከ ማታ 12:00 ሰዓት ነው። ከምሽቱ 12:00 በኋላ በሚደረግ ማንኛውም መረከብ በደቂቃ $1 (ወይም ተመጣጣኝ ብር) ቅጣት ይታሰባል። ልጆች የሚለቀቁት በጣት አሻራ እና በመታወቂያ ካርድ በዳታቤዛችን ውስጥ ለተመዘገቡ ህጋዊ ወላጆች/ተወካዮች ብቻ ነው። ጊዜያዊ ወኪል ለመላክ ቢያንስ ከ2 ሰዓት በፊት በአፕሊኬሽኑ በኩል ማሳወቅ ያስፈልጋል።'
                  },
                  {
                    id: 'health',
                    title: lang === 'en' ? 'Sick Day Guidelines & Symptoms Quarantine' : 'የታመሙ ልጆች ህግ እና የጤና ማግለያ ደንቦች',
                    icon: Heart,
                    color: 'text-red-500',
                    content: lang === 'en' 
                      ? 'Children displaying a fever over 38°C (100.4°F), continuous coughing, diarrhea, vomiting, or raw contagious skin rashes are strictly barred. Children must remain home and be entirely symptom-free for a full 24 hours without fever-reducing medicine before they can return to the facility. Mandatory TB, Hep B, and HIV screenings must be kept on file.' 
                      : 'ትኩሳታቸው ከ 38°C (100.4°F) በላይ የሆኑ፣ የሚያስመልሳቸው፣ ተቅማጥ ያለባቸው ወይም ተላላፊ ሽፍታ የሚታይባቸው ልጆች ወደ ማቆያው መምጣት በጥብቅ የተከለከለ ነው። ህጻናት ትኩሳት ማስታገሻ ሳይወስዱ ለ24 ሰዓታት ሙሉ በሙሉ ደህና መሆናቸው ሳይረጋገጥ መመለስ አይችሉም። የቲቢ፣ የሄፓታይተስ ቢ እና የኤችአይቪ ምርመራዎች በማህደራቸው ውስጥ መኖር አለባቸው።'
                  },
                  {
                    id: 'nap',
                    title: lang === 'en' ? 'Quiet/Nap Routine & In-House Bedding Laundry' : 'የእንቅልፍ ሰዓት እና የማቆያው የአልጋ ልብስ ማጠቢያ',
                    icon: ShieldCheck,
                    color: 'text-brand-green',
                    content: lang === 'en' 
                      ? 'A mandatory quiet rest and nap period is integrated daily from 1:00 PM to 3:00 PM. Kidtopia provides custom individual toddler bedding. These linens and sheets are sanitized and laundered daily inside our private high-heat industrial laundry facility. Personal pillows, blankets, or soft toys are not allowed due to allergy safety codes.' 
                      : 'በየቀኑ ከቀኑ 7:00 እስከ 9:00 ሰዓት ለሁሉም ታዳጊዎች የእንቅልፍ እና የጸጥታ ሰዓት ነው። ኪድቶፒያ ለእያንዳንዱ ልጅ የሚሆን አልጋ እና አንሶላ ያዘጋጃል። እነዚህ የአልጋ ልብሶች በየቀኑ በማቆያው ማጠቢያ ማዕከል ውስጥ በከፍተኛ ሙቀት በንጽህና ይታጠባሉ። ከአለርጂ ስጋቶች ለመከላከል የግል ትራሶች፣ ብርድ ልብሶች ወይም መጫወቻዎች መያዝ አይፈቀድም።'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="p-5 bg-stone-50 rounded-2xl border border-stone-150 space-y-2">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Icon size={18} className={item.color} />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium pl-6">
                        {item.content}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Print and Download Footer */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex justify-between items-center bg-stone-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 px-6 md:px-8 py-5">
                <p className="text-xs text-stone-500 font-medium">
                  {lang === 'en' 
                    ? 'Refer to the full Sept 2025 Parent Handbook PDF for additional policies.' 
                    : 'ለተጨማሪ ደንቦች እባክዎን ኦሪጅናሉን የሴፕቴምበር 2025 የወላጅ መመሪያ መጽሐፍ ይመልከቱ።'}
                </p>
                <button
                  onClick={() => window.print()}
                  className="px-4.5 py-2.5 bg-brand-green text-white rounded-xl text-xs font-black shadow-md hover:bg-brand-green/95 transition flex items-center gap-2"
                >
                  <Printer size={14} />
                  <span>{lang === 'en' ? 'Print Handbook Summary' : 'ማጠቃለያውን አትም'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 9. POLICIES SECTION */}
          {actionType === 'policies' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full content-start">
              <button onClick={() => openPolicy('terms')} className="p-8 bg-white border border-stone-200 rounded-3xl hover:border-brand-green shadow-sm hover:shadow-md transition text-left flex flex-col gap-2">
                <ShieldCheck size={32} className="text-brand-green" />
                <span className="text-lg font-bold">Terms</span>
                <span className="text-xs text-stone-500">View our terms and conditions.</span>
              </button>
              <button onClick={() => openPolicy('guidelines')} className="p-8 bg-white border border-stone-200 rounded-3xl hover:border-brand-green shadow-sm hover:shadow-md transition text-left flex flex-col gap-2">
                <Book size={32} className="text-brand-orange" />
                <span className="text-lg font-bold">Guidelines</span>
                <span className="text-xs text-stone-500">View our daycare guidelines.</span>
              </button>
              <button onClick={() => openPolicy('health')} className="p-8 bg-white border border-stone-200 rounded-3xl hover:border-brand-green shadow-sm hover:shadow-md transition text-left flex flex-col gap-2">
                <Heart size={32} className="text-red-500" />
                <span className="text-lg font-bold">Health</span>
                <span className="text-xs text-stone-500">View our health policies.</span>
              </button>
              <button onClick={() => openPolicy('privacy')} className="p-8 bg-white border border-stone-200 rounded-3xl hover:border-brand-green shadow-sm hover:shadow-md transition text-left flex flex-col gap-2">
                <ShieldCheck size={32} className="text-brand-teal" />
                <span className="text-lg font-bold">Privacy</span>
                <span className="text-xs text-stone-500">View our privacy policy.</span>
              </button>
            </div>
          )}

          {/* 10. DAYCARE COMMUNICATION SOFTWARE MOCK INTERACTIVE PANEL */}
          {actionType === 'comms' && (
            <div className="max-w-4xl mx-auto h-full text-left space-y-6">
              <div className="p-5 bg-brand-teal/5 border border-brand-teal/10 rounded-2.5xl flex items-start gap-4 mb-4">
                <Laptop className="text-brand-teal shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-lg">
                    {lang === 'en' ? 'Kidtopia Daycare Portal Control Software' : 'የኪድቶፒያ የህፃናት ማቆያ መቆጣጠሪያ ሶፍትዌር ፖርታል'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {lang === 'en' 
                      ? 'Secure dashboard connecting parents with teachers. Track meals, check-ins, naps, and authorize emergency pickups.'
                      : 'ወላጆችን ከአስተማሪዎች ጋር የሚያገናኝ አስተማማኝ መገናኛ ገጽ። ዕለታዊ ምግቦችን፣ እንቅልፍን እና ድንገተኛ ልጅ መረከቢያዎችን እዚህ ያስተዳድሩ።'}
                  </p>
                </div>
              </div>

              {/* Interactive Child Tracker Mock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Child Status Widget */}
                <div className="md:col-span-1 bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center font-editorial font-bold text-brand-green text-lg">
                      Y
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">Yonas Alene</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{lang === 'en' ? 'Toddler Class B' : 'ታዳጊ ክፍል B'}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 border-t border-stone-200 pt-4 text-xs font-medium">
                    <div className="flex justify-between">
                      <span className="text-stone-500">{lang === 'en' ? 'Check-in Time' : 'የመግቢያ ሰዓት'}</span>
                      <span className="text-stone-900 font-bold font-mono">07:44 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">{lang === 'en' ? 'Status' : 'የደህንነት ሁኔታ'}</span>
                      <span className="text-brand-green font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-ping" />
                        {lang === 'en' ? 'Checked In' : 'ገብቷል'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">{lang === 'en' ? 'Last Feed' : 'የመጨረሻ አመጋገብ'}</span>
                      <span className="text-stone-900 font-bold font-mono">11:15 AM (Milk & Oats)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">{lang === 'en' ? 'Nap Status' : 'የእንቅልፍ ሁኔታ'}</span>
                      <span className="text-stone-900 font-bold">{lang === 'en' ? 'Sleeping (1:15 PM)' : 'ተኝቷል (7:15 ከሰዓት)'}</span>
                    </div>
                  </div>
                </div>

                {/* Teacher Updates Mock Feed */}
                <div className="md:col-span-2 bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="font-black text-stone-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-1.5 border-b border-stone-200 pb-2">
                      <MessageSquare size={14} className="text-brand-teal" />
                      {lang === 'en' ? 'Teacher Live Communication Board' : 'የመምህራን የቀጥታ መገናኛ ሰሌዳ'}
                    </h4>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto font-sans">
                      <div className="p-3 bg-white rounded-xl border border-stone-150 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-stone-900">{lang === 'en' ? 'Teacher Tigist' : 'መምህርት ትዕግስት'}</span>
                          <span className="text-[9px] text-stone-400 font-mono font-bold">11:30 AM</span>
                        </div>
                        <p className="text-stone-600">
                          {lang === 'en' 
                            ? 'Yonas finished his bowl of organic oatmeal and fresh bananas completely! He was very helpful in cleaning up the table.' 
                            : 'ዮናስ የተዘጋጀለትን ኦርጋኒክ ሙዝ እና አጃ ምግብ ሙሉ በሙሉ በልቷል! ጠረጴዛውን ለማጽዳትም በጣም አግዟል።'}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-stone-150 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-stone-900">{lang === 'en' ? 'Daycare Nurse' : 'የማቆያው ነርስ'}</span>
                          <span className="text-[9px] text-stone-400 font-mono font-bold">08:15 AM</span>
                        </div>
                        <p className="text-stone-600">
                          {lang === 'en' 
                            ? 'Mandatory morning temperature check complete. Yonas registered 36.6°C. Clear and active.' 
                            : 'የጠዋት የሙቀት መጠን ምርመራ ተጠናቋል። ዮናስ 36.6°C መዝግቧል። ጤናማ እና ንቁ ነው።'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive ad-hoc pick-up authorization button mockup */}
                  <div className="mt-4 pt-3 border-t border-stone-200">
                    <button
                      onClick={() => triggerFeedback('success', lang === 'en' ? 'Ad-hoc pickup authorization submitted to guards!' : 'ጊዜያዊ የልጅ መረከቢያ ፈቃድ ለጥበቃዎች ተልኳል!')}
                      className="w-full py-2.5 bg-brand-teal hover:bg-brand-teal/95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow transition"
                    >
                      {lang === 'en' ? '⚡ Authorize Emergency Pickup (Today)' : '⚡ ድንገተኛ ልጅ መረከቢያ ፍቀድ (ዛሬ)'}
                    </button>
                  </div>
                </div>

              </div>

              {/* System security status banner */}
              <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center gap-3">
                <ShieldCheck size={20} className="text-brand-green shrink-0" />
                <p className="text-xs text-stone-600 font-medium">
                  {lang === 'en' 
                    ? 'Our Daycare Communication Software complies with international security certificates and uses fully encrypted databases to host child files.' 
                    : 'የማቆያ መገናኛ ሶፍትዌራችን ከዓለም አቀፍ የደህንነት ደረጃዎች ጋር የሚስማማ እና የተመሰጠረ መረጃ ቋት (Database) የሚጠቀም ነው።'}
                </p>
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

      <AnimatePresence>
        {isPolicyOpen && (
          <PolicyModal 
            isOpen={isPolicyOpen} 
            onClose={() => setIsPolicyOpen(false)} 
            lang={lang}
            initialTab={policyTab}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
