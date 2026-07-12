import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Book, FileText, CheckCircle2, Download, Upload, AlertCircle, 
  Trash2, ShieldAlert, Award, Compass, RotateCw, Smile, 
  Sliders, Sparkles, Volume2, Search, Printer, Bookmark, Eye, Camera, Heart, CheckSquare
} from 'lucide-react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useContent } from '../ContentContext';

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
            </div>
            <div>
              <h2 className="text-xl font-editorial font-bold text-stone-900 capitalize">
                {actionType === 'handbook' && (lang === 'en' ? 'Interactive Handbook' : 'የእጅ መጽሐፍ')}
                {actionType === 'forms' && (lang === 'en' ? 'Document Upload & Forms' : 'ቅጾች እና ሰነዶች')}
                {actionType === 'nutrition' && (lang === 'en' ? 'Weekly Meal Planner' : 'ምግብ ዕቅድ')}
                {actionType === 'ar_activities' && (lang === 'en' ? 'Interactive AR Activities' : 'ኤአር ትምህርታዊ ጨዋታ')}
                {actionType === 'avatar' && (lang === 'en' ? 'Create Your Avatar' : 'አቫታር መፍጠሪያ')}
                {actionType === 'milestones' && (lang === 'en' ? 'Development Milestones Tracker' : 'የልጅ እድገት ደረጃዎች መከታተያ')}
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
          {actionType === 'ar_activities' && (
            <div className="text-stone-500 p-8 text-center">AR activities have been removed.</div>
          )}

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
