import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, Heart, Activity, FileText, Camera, Smile, 
  Sparkles, Compass, Book, Utensils, Clipboard, Clock, CheckCircle2,
  X, ChevronLeft, ChevronRight, FolderOpen, Plus, Edit, Trash2, Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, logout, db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { GlassCard } from '../components/GlassCard';
import { ParentalResourceDetails } from '../components/ParentalResourceDetails';
import { ImageSelectModal, convertGoogleDriveUrl } from '../components/ImageSelectModal';

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portal' | 'health' | 'timeline' | 'gallery'>('portal');
  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const [galleryItems, setGalleryItems] = useState([
    { url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop", title: "Indoor Creative Painting Class" },
    { url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200&auto=format&fit=crop", title: "Circle Play & Storytelling time" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop", title: "Nursery Block Building Workshop" }
  ]);

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);

  // Subscribe to real-time gallery photos from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'gallery'), (snapshot) => {
      if (snapshot.exists() && snapshot.data()?.items) {
        setGalleryItems(snapshot.data().items);
      }
    }, (err) => {
      console.warn("Could not listen to gallery photos from Firestore:", err);
    });
    return () => unsub();
  }, []);

  const handleNextMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMediaIndex((prev) => (prev !== null && prev < galleryItems.length - 1) ? prev + 1 : 0);
  };

  const handlePrevMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMediaIndex((prev) => (prev !== null && prev > 0) ? prev - 1 : galleryItems.length - 1);
  };

  useEffect(() => {
    if (activeMediaIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextMedia();
      } else if (e.key === 'ArrowLeft') {
        handlePrevMedia();
      } else if (e.key === 'Escape') {
        setActiveMediaIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMediaIndex]);
  
  // Health updates form state
  const [allergies, setAllergies] = useState('');
  const [medication, setMedication] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [savingHealth, setSavingHealth] = useState(false);
  const [healthSuccess, setHealthSuccess] = useState(false);

  const user = auth.currentUser;

  // Load parent profile (for avatar, health records, documents)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserProfile(data);
          setAllergies(data.healthInfo?.allergies || '');
          setMedication(data.healthInfo?.medication || '');
          setBloodType(data.healthInfo?.bloodType || 'O+');
        }
      } catch (err) {
        console.error('Error loading user profile in dashboard', err);
      }
    };
    fetchProfile();
  }, [user, activeAction]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingHealth(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        healthInfo: { allergies, medication, bloodType }
      });
      setHealthSuccess(true);
      setTimeout(() => setHealthSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingHealth(false);
    }
  };

  // Render SVG Layers for Avatar matching Parent’s avatar state
  const renderAvatarPreview = (avatarObj: any) => {
    if (!avatarObj) return <Smile size={32} className="text-brand-green" />;
    const skin = avatarObj.skinColor || '#F5C29D';
    const accent = avatarObj.primaryColor || '#3a5b32';

    return (
      <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-sm">
        <circle cx="50" cy="50" r="46" fill={`${accent}15`} stroke={accent} strokeWidth="1" />
        <rect x="46" y="65" width="8" height="12" fill={skin} rx="3" />
        <circle cx="50" cy="48" r="18" fill={skin} />
        <circle cx="44" cy="45" r="2" fill="#2d2d2d" />
        <circle cx="56" cy="45" r="2" fill="#2d2d2d" />
        <path d="M44 54 Q50 60 56 54" stroke="#2d2d2d" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {avatarObj.clothing === 'uniform' && <path d="M30 78 Q50 68 70 78 L68 95 L32 95 Z" fill="#1e3a8a" />}
        {avatarObj.clothing === 'overall' && <path d="M30 78 Q50 68 70 78 L68 95 L32 95 Z" fill={accent} />}
        {avatarObj.clothing === 'hoodie' && <path d="M30 78 Q50 68 70 78 L68 95 L32 95 Z" fill="#4b5563" />}
        {avatarObj.clothing === 'tshirt' && <path d="M30 78 Q50 72 70 78 L68 95 L32 95 Z" fill="#ea580c" />}
        {avatarObj.hairstyle === 'short' && <path d="M32 38 Q50 22 68 38 Q70 30 65 24 Q50 18 35 24 Q30 30 32 38 Z" fill="#1c1917" />}
        {avatarObj.hairstyle === 'curly' && <path d="M30 40 C28 35 32 28 36 30 C38 25 45 23 48 26 C52 23 60 25 62 30 C66 28 70 33 68 39 C72 43 65 50 63 46 C50 51 37 46 32 46 Z" fill="#44403c" />}
        {avatarObj.hairstyle === 'ponytail' && (
          <>
            <path d="M32 38 Q50 22 68 38 Z" fill="#78350f" />
            <path d="M66 36 Q78 40 76 52 Q68 46 66 36" fill="#78350f" />
          </>
        )}
        {avatarObj.hairstyle === 'braids' && (
          <>
            <path d="M32 38 Q50 22 68 38" fill="#111827" />
            <path d="M31 38 Q24 55 26 70" fill="#111827" />
            <path d="M69 38 Q76 55 74 70" fill="#111827" />
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-stone-100/40 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm mb-8">
          <div className="flex items-center gap-4 text-left">
            <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
              {userProfile?.avatar ? renderAvatarPreview(userProfile.avatar) : <Smile size={28} className="text-brand-green" />}
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-brand-green bg-brand-green/10 px-3 py-1 rounded-full font-accent">
                Parent Profile
              </span>
              <h1 className="text-2.5xl font-editorial font-bold text-stone-900 mt-1">
                Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Parent'}
              </h1>
              <p className="text-xs text-stone-500">Kidtopia International Daycare Parent Portal</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4.5 py-2.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-black uppercase tracking-wider font-accent"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>

        {/* Top-Level Quick Tabs */}
        <div className="flex border-b border-stone-200 mb-8 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('portal')}
            className={`py-3 px-6 text-sm font-black uppercase tracking-wider font-accent border-b-2 transition-all shrink-0 ${
              activeTab === 'portal' ? 'border-brand-green text-brand-green' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-6 text-sm font-black uppercase tracking-wider font-accent border-b-2 transition-all shrink-0 ${
              activeTab === 'timeline' ? 'border-brand-green text-brand-green' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Daily Reports
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`py-3 px-6 text-sm font-black uppercase tracking-wider font-accent border-b-2 transition-all shrink-0 ${
              activeTab === 'health' ? 'border-brand-green text-brand-green' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Health & Allergy File
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-6 text-sm font-black uppercase tracking-wider font-accent border-b-2 transition-all shrink-0 ${
              activeTab === 'gallery' ? 'border-brand-green text-brand-green' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Photo Gallery
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === 'portal' && (
          <div className="space-y-8">
            {/* Core Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <GlassCard 
                className="p-6 flex flex-row items-center gap-4 text-left h-full cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
                onClick={() => setActiveTab('timeline')}
                delay={0.05}
              >
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange shrink-0">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-none mb-1 font-sans">Daily Report</h3>
                  <p className="text-stone-500 text-xs">See what your child did today.</p>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-6 flex flex-row items-center gap-4 text-left h-full cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
                onClick={() => setActiveTab('gallery')}
                delay={0.1}
              >
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green shrink-0">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-none mb-1 font-sans">Photos</h3>
                  <p className="text-stone-500 text-xs">View photos of your child's day.</p>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-6 flex flex-row items-center gap-4 text-left h-full cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
                onClick={() => setActiveAction('forms')}
                delay={0.15}
              >
                <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-none mb-1 font-sans">Documents</h3>
                  <p className="text-stone-500 text-xs">Access forms and upload records.</p>
                </div>
              </GlassCard>

              <GlassCard 
                className="p-6 flex flex-row items-center gap-4 text-left h-full cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
                onClick={() => setActiveTab('health')}
                delay={0.2}
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                  <Heart size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 leading-none mb-1 font-sans">Health File</h3>
                  <p className="text-stone-500 text-xs">Update medical and allergy info.</p>
                </div>
              </GlassCard>

            </div>

            {/* Educational Activities & Avatar Creation Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
            {/* Character Avatar Creation Card */}
              <GlassCard className="p-8 text-left border-l-4 border-brand-orange/40 relative overflow-hidden" delay={0.3}>
                <div className="absolute top-1/2 right-[-10%] w-[150px] h-[150px] rounded-full bg-brand-orange/5 blur-[50px] pointer-events-none" />
                <Smile size={36} className="text-brand-orange mb-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full font-accent">
                  Highly Customizable
                </span>
                <h3 className="text-xl font-editorial font-bold text-stone-900 mt-3 mb-2">
                  Create Your Custom Profile Avatar
                </h3>
                <p className="text-sm text-stone-550 leading-relaxed font-sans font-medium mb-6">
                  Design a colorful, charming visual character to represent yourself or your child. Customize skin tones, hairstyles, school uniforms, and goofy expressions.
                </p>
                <button
                  onClick={() => setActiveAction('avatar')}
                  className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orange/95 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition font-accent flex items-center gap-1.5"
                >
                  <Smile size={14} />
                  Create Avatar
                </button>
              </GlassCard>

            </div>

            {/* Additional Quick Resources */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-stone-200/50 rounded-2.5xl flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-950 text-sm">Interactive Nutrition Planner</h4>
                    <p className="text-xs text-stone-500">View safety-verified daily kitchen meals.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveAction('nutrition')}
                  className="text-xs font-black uppercase tracking-wider text-brand-green hover:underline font-accent"
                >
                  View
                </button>
              </div>

              <div className="p-6 bg-white border border-stone-200/50 rounded-2.5xl flex justify-between items-center text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                    <Book size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-950 text-sm">Parent School Handbook</h4>
                    <p className="text-xs text-stone-500">Quickly lookup daycare rules & policies.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveAction('handbook')}
                  className="text-xs font-black uppercase tracking-wider text-brand-green hover:underline font-accent"
                >
                  Read
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Tab: Child Timeline/Schedule */}
        {activeTab === 'timeline' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
            <h2 className="text-xl font-editorial font-bold text-stone-900 mb-2">Today's Daily Activity Report</h2>
            <p className="text-xs text-stone-500 mb-6">Real-time update from Kidtopia caregivers</p>

            <div className="relative border-l-2 border-stone-200 pl-6 ml-4 space-y-8">
              
              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-brand-green text-white flex items-center justify-center shadow-sm">
                  <Clock size={12} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-green font-mono bg-brand-green/10 px-2.5 py-0.5 rounded-full">08:30 AM</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">Arrival & Secure Check-In</h4>
                  <p className="text-xs text-stone-500 mt-1">Checked in securely by Mom. Hand hygiene screening completed successfully.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-sm">
                  <Utensils size={12} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-orange font-mono bg-brand-orange/10 px-2.5 py-0.5 rounded-full">09:15 AM</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">Healthy Breakfast Meal</h4>
                  <p className="text-xs text-stone-500 mt-1">Ate whole wheat porridge with local honey and sweet berries. Great appetite today!</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-brand-teal text-white flex items-center justify-center shadow-sm">
                  <Compass size={12} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-teal font-mono bg-brand-teal/10 px-2.5 py-0.5 rounded-full">10:30 AM</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">AR Educational Flashcards</h4>
                  <p className="text-xs text-stone-500 mt-1">Participated in our brand-new Augmented Reality Animal matching game! Unlocked the lion facts with high score.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-sm">
                  <Smile size={12} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 font-mono bg-purple-100 px-2.5 py-0.5 rounded-full">01:00 PM</span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">Afternoon Sleep / Naptime</h4>
                  <p className="text-xs text-stone-500 mt-1">Slept peacefully for 2 hours on sterilized clean sheets. Woke up energized.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: Health profile form */}
        {activeTab === 'health' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
              <h2 className="text-xl font-editorial font-bold text-stone-900 mb-1">Health & Allergy Records File</h2>
              <p className="text-xs text-stone-500 mb-6">Updates here are shared in real-time with the school kitchen and first-aid staff.</p>

              <form onSubmit={handleSaveHealth} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Child's Blood Type</label>
                  <select 
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full p-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green bg-white font-medium"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A-">A Negative (A-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Allergies & Food Sensitivities</label>
                  <textarea
                    rows={3}
                    placeholder="List any food or medical allergies (e.g. Gluten, Nuts, Penicillin) or write None."
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-stone-600 mb-1.5">Required Medications & Timing</label>
                  <textarea
                    rows={3}
                    placeholder="Describe any daily medication schedules our staff must administer."
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green font-sans"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={savingHealth}
                    className="px-5 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition disabled:opacity-50 font-accent"
                  >
                    {savingHealth ? 'Saving...' : 'Update Health File'}
                  </button>
                  {healthSuccess && (
                    <span className="text-xs text-brand-green font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Saved and shared!
                    </span>
                  )}
                </div>
              </form>
            </div>

            <div className="md:col-span-1 space-y-4 text-left">
              <div className="p-5 bg-red-50/50 border border-red-100 rounded-2.5xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-red-700 mb-2 flex items-center gap-1.5">
                  <Heart size={14} /> First-Aid & Safety Notice
                </h4>
                <p className="text-xs text-stone-600 leading-normal font-sans">
                  Our certified nannies are trained in CPR and child first aid. If your child has epinephrine or inhaler prescriptions, please hand them directly to our clinic nurse on Monday morning.
                </p>
              </div>
              <div className="p-5 bg-brand-green/5 border border-brand-green/10 rounded-2.5xl">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-green mb-2 flex items-center gap-1.5">
                  <Clipboard size={14} /> Mandatory Screenings
                </h4>
                <p className="text-xs text-stone-600 leading-normal font-sans font-medium">
                  State daycare law requires fully updated TB and hepatitis medical checks on file. Ensure you have submitted these forms in the Documents tab.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Photos gallery */}
        {activeTab === 'gallery' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-editorial font-bold text-stone-900 mb-1">Today's Child Play Photos</h2>
                <p className="text-xs text-stone-500">See snapshots of your child's learning and group play activities</p>
              </div>
              <button
                onClick={() => {
                  setEditingPhotoIndex(null);
                  setIsPhotoModalOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <FolderOpen size={16} />
                <span>Import / Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((img, i) => (
                <div 
                  key={i} 
                  className="group rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition bg-white flex flex-col"
                >
                  <div 
                    onClick={() => setActiveMediaIndex(i)}
                    className="aspect-video relative overflow-hidden bg-stone-100 cursor-pointer"
                  >
                    <img 
                      src={img.url} 
                      alt={img.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const match = img.url.match(/thumbnail\?id=([a-zA-Z0-9_-]+)/) || img.url.match(/id=([a-zA-Z0-9_-]+)/);
                        if (match && match[1] && !target.dataset.tried) {
                          target.dataset.tried = 'true';
                          target.src = `https://lh3.googleusercontent.com/d/${match[1]}`;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm text-stone-900 font-bold text-xs shadow">
                        Click to View
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 bg-stone-50 border-t border-stone-150 flex justify-between items-center gap-2">
                    <span className="font-bold text-stone-800 text-xs truncate max-w-[160px]" title={img.title}>
                      {img.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPhotoIndex(i);
                          setIsPhotoModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition cursor-pointer"
                        title="Edit / Change Photo"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${img.title}"?`)) {
                            const updated = galleryItems.filter((_, idx) => idx !== i);
                            setGalleryItems(updated);
                            try {
                              await setDoc(doc(db, 'settings', 'gallery'), { items: updated }, { merge: true });
                            } catch (err) {
                              console.error("Error updating Firestore gallery:", err);
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                        title="Delete Photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Adding or Editing Gallery Photos */}
        <ImageSelectModal
          isOpen={isPhotoModalOpen}
          onClose={() => {
            setIsPhotoModalOpen(false);
            setEditingPhotoIndex(null);
          }}
          initialUrl={editingPhotoIndex !== null ? galleryItems[editingPhotoIndex]?.url : ''}
          initialTitle={editingPhotoIndex !== null ? galleryItems[editingPhotoIndex]?.title : ''}
          showTitleField={true}
          modalTitle={editingPhotoIndex !== null ? 'Edit Photo & Caption' : 'Add / Import Photo'}
          onSelect={async (newUrl, newTitle) => {
            let updated: { url: string; title: string }[];
            if (editingPhotoIndex !== null) {
              updated = [...galleryItems];
              updated[editingPhotoIndex] = {
                url: newUrl,
                title: newTitle || galleryItems[editingPhotoIndex].title || 'Child Play Photo'
              };
            } else {
              updated = [
                { url: newUrl, title: newTitle || 'Child Play Photo' },
                ...galleryItems
              ];
            }
            setGalleryItems(updated);
            try {
              await setDoc(doc(db, 'settings', 'gallery'), { items: updated }, { merge: true });
            } catch (err) {
              console.error("Error saving gallery to Firestore:", err);
            }
          }}
        />

      </div>

      {/* Lightbox / Full Screen Modal Viewer */}
      <AnimatePresence>
        {activeMediaIndex !== null && galleryItems[activeMediaIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveMediaIndex(null)}
            className="fixed inset-0 z-50 bg-stone-950/98 backdrop-blur-md flex flex-col items-center justify-center select-none"
          >
            {/* Top Controls Bar */}
            <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow font-sans block mb-0.5">
                  FULL SCREEN VIEWER
                </span>
                <span className="text-xs font-mono text-stone-400">
                  {activeMediaIndex + 1} / {galleryItems.length}
                </span>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setActiveMediaIndex(null)}
                className="w-12 h-12 bg-white/5 border border-white/10 hover:bg-red-500 hover:border-red-500 flex items-center justify-center rounded-2xl text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Close"
              >
                <X size={20} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Main Content Area */}
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative max-w-5xl w-[90vw] aspect-video flex items-center justify-center rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-stone-950"
            >
              <img
                src={galleryItems[activeMediaIndex].url}
                alt={galleryItems[activeMediaIndex].title}
                className="w-full h-full object-contain rounded-2xl select-none"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Bottom Caption Area */}
            <div className="absolute bottom-0 inset-x-0 p-6 text-center z-50 bg-gradient-to-t from-black/90 to-transparent">
              {galleryItems[activeMediaIndex].title && (
                <p className="text-white text-base md:text-xl font-editorial font-bold max-w-3xl mx-auto px-4 leading-relaxed tracking-tight text-center">
                  {galleryItems[activeMediaIndex].title}
                </p>
              )}
              <p className="text-[10px] text-stone-500 font-sans mt-2 tracking-wide">
                Use Left/Right arrow keys or click the side navigation controls to browse
              </p>
            </div>

            {/* Next/Previous Floating Side Buttons */}
            <button
              onClick={handlePrevMedia}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-white/5 hover:bg-brand-green border border-white/10 flex items-center justify-center rounded-2xl hover:text-white hover:scale-105 active:scale-95 transition-all text-white/80 cursor-pointer z-50"
              title="Previous"
            >
              <ChevronLeft size={24} className="stroke-[2.5]" />
            </button>

            <button
              onClick={handleNextMedia}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-white/5 hover:bg-brand-green border border-white/10 flex items-center justify-center rounded-2xl hover:text-white hover:scale-105 active:scale-95 transition-all text-white/80 cursor-pointer z-50"
              title="Next"
            >
              <ChevronRight size={24} className="stroke-[2.5]" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Parental Interactive Features Modal */}
      <AnimatePresence>
        {activeAction && (
          <ParentalResourceDetails 
            actionType={activeAction} 
            onClose={() => setActiveAction(null)} 
            lang="en" 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
