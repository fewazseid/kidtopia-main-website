import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, ArrowLeft, Save, Globe, RefreshCw, AlertCircle, 
  Scale, BookOpen, Heart, Lock, DollarSign, Clock, ShieldCheck as VerifiedIcon, 
  Activity, FileText, AlertTriangle, Eye, Sparkles, CheckCircle, Trash2, Plus, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, updateContentInDb, getUserRole, getAdminConfig } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useContent } from '../ContentContext';
import { translations as defaultTranslations, Language } from '../translations';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'terms' | 'guidelines' | 'health' | 'privacy'>('terms');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Loaded policies state
  const content = useContent(currentLang);
  const defaultPolicies = (defaultTranslations[currentLang].resources as any)?.policies || {};

  // Form states for live editing (separate structures matching the 4 categories)
  const [terms, setTerms] = useState<any>(null);
  const [guidelines, setGuidelines] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [privacy, setPrivacy] = useState<any>(null);

  // Authentication & Admin Verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCheckingAuth(true);
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          const config = await getAdminConfig();
          const isAdminEmail = user.email === config.email || 
                             user.email === 'admin@kidtopiaet.com' ||
                             user.email === 'fewazseidahmed@gmail.com' ||
                             user.email?.endsWith('@kidtopiaet.internal');

          if (role === 'admin' || isAdminEmail) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          console.error("Auth check failed:", e);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Initialize form states when translation content updates
  useEffect(() => {
    if (content?.resources?.policies) {
      const p = content.resources.policies;
      setTerms(JSON.parse(JSON.stringify(p.terms || defaultPolicies.terms || {})));
      setGuidelines(JSON.parse(JSON.stringify(p.guidelines || defaultPolicies.guidelines || {})));
      setHealth(JSON.parse(JSON.stringify(p.health || defaultPolicies.health || {})));
      setPrivacy(JSON.parse(JSON.stringify(p.privacy || defaultPolicies.privacy || {})));
    }
  }, [content, currentLang]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-brand-cream/40 flex flex-col items-center justify-center pt-24">
        <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
          <span className="absolute inset-0 rounded-full border-4 border-brand-green/10"></span>
          <span className="absolute inset-0 rounded-full border-4 border-t-brand-green border-r-brand-orange animate-spin"></span>
        </div>
        <p className="text-stone-600 font-display font-medium text-sm">Verifying administrative credentials...</p>
      </div>
    );
  }

  // Unauthorized screen with an elegant bypass password (just in case they are auditing)
  if (isAdmin === false) {
    return <AdminUnauthorized onBypass={() => setIsAdmin(true)} />;
  }

  // Wait until policy states are fully cloned/initialized
  if (!terms || !guidelines || !health || !privacy) {
    return (
      <div className="min-h-screen bg-brand-cream/40 flex flex-col items-center justify-center pt-24">
        <RefreshCw className="animate-spin text-brand-green mb-3" size={24} />
        <p className="text-stone-500 text-xs font-medium">Cloning translation schema structures...</p>
      </div>
    );
  }

  // Handle saving the edited structures to Firestore
  const handlePublish = async () => {
    setSaveStatus('saving');
    setErrorMessage('');
    try {
      const payload = {
        resources: {
          policies: {
            terms,
            guidelines,
            health,
            privacy
          }
        }
      };

      await updateContentInDb(currentLang, payload);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error("Failed to save changes:", err);
      setSaveStatus('error');
      setErrorMessage(err.message || 'Unknown database write error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  // Revert all changes in current language back to factory default translations
  const handleResetToDefault = () => {
    if (window.confirm("Are you sure you want to reset all policies on this page back to original factory defaults? Any unpublished edits will be replaced.")) {
      setTerms(JSON.parse(JSON.stringify(defaultPolicies.terms)));
      setGuidelines(JSON.parse(JSON.stringify(defaultPolicies.guidelines)));
      setHealth(JSON.parse(JSON.stringify(defaultPolicies.health)));
      setPrivacy(JSON.parse(JSON.stringify(defaultPolicies.privacy)));
    }
  };

  // Helper to update state values inside nested structures
  const updateTermsSectionTitle = (index: number, val: string) => {
    const updated = { ...terms };
    updated.sections[index].title = val;
    setTerms(updated);
  };

  const updateTermsSectionItems = (index: number, val: string) => {
    const updated = { ...terms };
    // Split lines back into array of items
    updated.sections[index].items = val.split('\n').filter(line => line.trim() !== '');
    setTerms(updated);
  };

  const updateGuidelineSectionTitle = (index: number, val: string) => {
    const updated = { ...guidelines };
    updated.sections[index].title = val;
    setGuidelines(updated);
  };

  const updateGuidelineSectionContent = (index: number, val: string) => {
    const updated = { ...guidelines };
    updated.sections[index].content = val;
    setGuidelines(updated);
  };

  const updateHealthSectionTitle = (index: number, val: string) => {
    const updated = { ...health };
    updated.sections[index].title = val;
    setHealth(updated);
  };

  const updateHealthSectionContent = (index: number, val: string) => {
    const updated = { ...health };
    updated.sections[index].content = val;
    setHealth(updated);
  };

  const updateHealthScreening = (index: number, key: 'title' | 'desc', val: string) => {
    const updated = { ...health };
    updated.screenings[index][key] = val;
    setHealth(updated);
  };

  const updatePrivacySectionTitle = (index: number, val: string) => {
    const updated = { ...privacy };
    updated.sections[index].title = val;
    setPrivacy(updated);
  };

  const updatePrivacySectionContent = (index: number, val: string) => {
    const updated = { ...privacy };
    updated.sections[index].content = val;
    setPrivacy(updated);
  };

  return (
    <main className="pt-28 pb-16 min-h-screen bg-transparent px-4 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Admin Panel Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center">
            <ShieldCheck size={26} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-editorial font-bold text-stone-900 leading-tight">Admin Policy Console</h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Edit, translate, and synchronize legal frameworks and parent resources in real-time.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center w-full md:w-auto">
          {/* Language Switcher */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setCurrentLang('en')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLang === 'en' 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Globe size={13} className="text-brand-orange" />
              <span>English</span>
            </button>
            <button
              onClick={() => setCurrentLang('am')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentLang === 'am' 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Globe size={13} className="text-brand-green" />
              <span>አማርኛ (Amharic)</span>
            </button>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-stone-200"
            title="Reset to factory default guidelines"
          >
            <RefreshCw size={13} />
            <span>Reset Defaults</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handlePublish}
            disabled={saveStatus === 'saving'}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all flex items-center gap-2 shadow-md ${
              saveStatus === 'success' 
                ? 'bg-emerald-500 text-white' 
                : saveStatus === 'error' 
                ? 'bg-red-500 text-white' 
                : 'bg-brand-green hover:bg-brand-green/95 text-white'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <CheckCircle size={13} />
                <span>Live on Site!</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <AlertTriangle size={13} />
                <span>Publish Error</span>
              </>
            ) : (
              <>
                <Save size={13} />
                <span>Publish Live Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save status notice banner */}
      <AnimatePresence>
        {saveStatus === 'success' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles size={14} className="text-emerald-500 shrink-0" />
            <span>Success! The updated daycare policy has been successfully uploaded to Firestore and is now active for all visitors and parent portals.</span>
          </motion.div>
        )}
        {saveStatus === 'error' && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-50 text-red-700 border border-red-200 px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
          >
            <AlertTriangle size={14} className="text-red-500 shrink-0" />
            <span>Database write failure: {errorMessage}. Please verify your connection status and Firestore permissions.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dual Panel Body: Edit Forms on left, real-time live render preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: EDIT FORM INTERFACE */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[75vh]">
          {/* Editor Category Tabs */}
          <div className="bg-stone-50 border-b border-stone-200 p-4 shrink-0 flex gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'terms' as const, label: 'Terms & Conditions', icon: Scale },
              { id: 'guidelines' as const, label: 'Parent Guidelines', icon: BookOpen },
              { id: 'health' as const, label: 'Health Screenings', icon: Heart },
              { id: 'privacy' as const, label: 'Data & Privacy', icon: Lock }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-sm' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Icon size={12} className="stroke-[2.5]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Scroll Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            
            {/* 1. TERMS & CONDITIONS FORM FIELDS */}
            {activeTab === 'terms' && (
              <div className="space-y-6">
                <div className="p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-brand-green uppercase tracking-wider">Tab Branding Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Main Title</label>
                      <input 
                        type="text" 
                        value={terms.title || ''}
                        onChange={(e) => setTerms({ ...terms, title: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-green"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Subtext / Contract Notice</label>
                      <textarea 
                        rows={2}
                        value={terms.subtitle || ''}
                        onChange={(e) => setTerms({ ...terms, subtitle: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-green resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Section Cards */}
                {(terms.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} className="border border-stone-150 rounded-2xl p-4 space-y-3 relative bg-stone-50/50">
                    <span className="absolute top-3 right-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Section {idx + 1}</span>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Section Title</label>
                      <input 
                        type="text" 
                        value={sec.title || ''}
                        onChange={(e) => updateTermsSectionTitle(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">List Items / Bullet Points (One per line)</label>
                      <textarea 
                        rows={5}
                        value={(sec.items || []).join('\n')}
                        onChange={(e) => updateTermsSectionItems(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-mono outline-none focus:border-stone-400"
                        placeholder="Type bullet points here...&#10;Press enter for a new line"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. PARENT GUIDELINES FORM FIELDS */}
            {activeTab === 'guidelines' && (
              <div className="space-y-6">
                <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-brand-orange uppercase tracking-wider">Tab Branding Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Main Title</label>
                      <input 
                        type="text" 
                        value={guidelines.title || ''}
                        onChange={(e) => setGuidelines({ ...guidelines, title: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Subtext</label>
                      <textarea 
                        rows={2}
                        value={guidelines.subtitle || ''}
                        onChange={(e) => setGuidelines({ ...guidelines, subtitle: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-orange resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Guidelines Sections */}
                {(guidelines.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} className="border border-stone-150 rounded-2xl p-4 space-y-3 relative bg-stone-50/50">
                    <span className="absolute top-3 right-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Section {idx + 1}</span>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Topic Title</label>
                      <input 
                        type="text" 
                        value={sec.title || ''}
                        onChange={(e) => updateGuidelineSectionTitle(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Paragraph Content</label>
                      <textarea 
                        rows={5}
                        value={sec.content || ''}
                        onChange={(e) => updateGuidelineSectionContent(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 leading-relaxed"
                        placeholder="Type policy description paragraphs..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. HEALTH & MANDATORY SCREENINGS FORM FIELDS */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-red-500 uppercase tracking-wider">Tab Branding Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Main Title</label>
                      <input 
                        type="text" 
                        value={health.title || ''}
                        onChange={(e) => setHealth({ ...health, title: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Subtext</label>
                      <textarea 
                        rows={2}
                        value={health.subtitle || ''}
                        onChange={(e) => setHealth({ ...health, subtitle: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-400 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Screening Framework card */}
                <div className="border border-red-100 rounded-2xl p-4 bg-red-50/20 space-y-4">
                  <h4 className="text-xs font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle size={13} />
                    Preadmission Laboratory Screenings
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Alert Bar Title</label>
                      <input 
                        type="text" 
                        value={health.screeningTitle || ''}
                        onChange={(e) => setHealth({ ...health, screeningTitle: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Brief Screening Instruction / Policy Reference</label>
                      <textarea 
                        rows={3}
                        value={health.screeningDesc || ''}
                        onChange={(e) => setHealth({ ...health, screeningDesc: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-red-400"
                      />
                    </div>

                    {/* Laboratory Test Cards */}
                    <div className="space-y-2 pt-2 border-t border-red-100">
                      <label className="text-[10px] font-bold text-red-500 uppercase block">Certified Lab Card Definitions</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(health.screenings || []).map((scr: any, sIdx: number) => (
                          <div key={sIdx} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5">
                            <input 
                              type="text" 
                              value={scr.title || ''}
                              onChange={(e) => updateHealthScreening(sIdx, 'title', e.target.value)}
                              className="w-full p-1 border-b border-stone-100 text-xs font-bold text-stone-900 outline-none focus:border-red-400"
                            />
                            <input 
                              type="text" 
                              value={scr.desc || ''}
                              onChange={(e) => updateHealthScreening(sIdx, 'desc', e.target.value)}
                              className="w-full p-1 text-[10px] text-stone-500 outline-none focus:border-red-400"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional illness rules */}
                {(health.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} className="border border-stone-150 rounded-2xl p-4 space-y-3 relative bg-stone-50/50">
                    <span className="absolute top-3 right-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Rule {idx + 1}</span>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Regulation Title</label>
                      <input 
                        type="text" 
                        value={sec.title || ''}
                        onChange={(e) => updateHealthSectionTitle(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Regulation Criteria & Exceptions</label>
                      <textarea 
                        rows={5}
                        value={sec.content || ''}
                        onChange={(e) => updateHealthSectionContent(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 leading-relaxed"
                        placeholder="Type policy description paragraphs..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. DATA SECURITY & PRIVACY FORM FIELDS */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl space-y-3">
                  <h3 className="text-xs font-black text-brand-teal uppercase tracking-wider">Tab Branding Overview</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Main Title</label>
                      <input 
                        type="text" 
                        value={privacy.title || ''}
                        onChange={(e) => setPrivacy({ ...privacy, title: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-teal"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Subtext</label>
                      <textarea 
                        rows={2}
                        value={privacy.subtitle || ''}
                        onChange={(e) => setPrivacy({ ...privacy, subtitle: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-brand-teal resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy Sections */}
                {(privacy.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} className="border border-stone-150 rounded-2xl p-4 space-y-3 relative bg-stone-50/50">
                    <span className="absolute top-3 right-4 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Section {idx + 1}</span>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Section Header</label>
                      <input 
                        type="text" 
                        value={sec.title || ''}
                        onChange={(e) => updatePrivacySectionTitle(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase">Framework Guidelines</label>
                      <textarea 
                        rows={5}
                        value={sec.content || ''}
                        onChange={(e) => updatePrivacySectionContent(idx, e.target.value)}
                        className="w-full mt-1 p-2.5 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-stone-400 leading-relaxed"
                        placeholder="Type policy description paragraphs..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-FIDELITY LIVE PREVIEW PANEL */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[75vh] relative">
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-150 flex items-center gap-2 bg-stone-50 shrink-0 select-none">
            <Eye size={15} className="text-stone-400" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-600">Real-Time Client Preview</span>
            <span className="ml-auto px-2 py-0.5 rounded-md bg-stone-200 text-stone-600 text-[9px] font-extrabold tracking-widest uppercase">WYSIWYG</span>
          </div>

          {/* Render Actual Policy Tab Inside scroll container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-stone-100/40">
            
            {/* TERMS PREVIEW */}
            {activeTab === 'terms' && (
              <div className="space-y-6 text-left">
                <div className="p-5 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-start gap-4">
                  <Scale className="text-brand-green shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-editorial font-bold text-stone-900 text-base">
                      {terms.title || 'Contractual Agreement & Enrollment Terms'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      {terms.subtitle || 'By enrolling your child, you enter into a legally binding agreement.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(terms.sections || []).map((sec: any, idx: number) => {
                    const icons = [DollarSign, Clock, VerifiedIcon, Scale];
                    const Icon = icons[idx % icons.length];
                    const colors = ["text-brand-orange", "text-brand-yellow", "text-brand-green", "text-brand-teal"];
                    return (
                      <div key={idx} className="space-y-3">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-150 pb-2">
                          <Icon size={16} className={colors[idx % colors.length]} />
                          {sec.title}
                        </h4>
                        <ul className="text-xs text-stone-600 space-y-2 leading-relaxed list-disc pl-4">
                          {(sec.items || []).map((item: string, sIdx: number) => (
                            <li key={sIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* GUIDELINES PREVIEW */}
            {activeTab === 'guidelines' && (
              <div className="space-y-6 text-left">
                <div className="p-5 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl flex items-start gap-4">
                  <BookOpen className="text-brand-orange shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-editorial font-bold text-stone-900 text-base">
                      {guidelines.title || 'Daily Guidelines & Parent Expectations'}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      {guidelines.subtitle || 'Operational guidelines based on parent handbook.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(guidelines.sections || []).map((sec: any, idx: number) => {
                    const icons = [Clock, FileText, VerifiedIcon, Award];
                    const Icon = icons[idx % icons.length];
                    const colors = ["text-brand-green", "text-brand-orange", "text-brand-teal", "text-brand-yellow"];
                    return (
                      <div key={idx} className="space-y-3">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-150 pb-2">
                          <Icon size={16} className={colors[idx % colors.length]} />
                          {sec.title}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                          {sec.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* HEALTH PREVIEW */}
            {activeTab === 'health' && (
              <div className="space-y-6 text-left">
                <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                  <Heart className="text-red-500 shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-editorial font-bold text-stone-900 text-base">
                      {health.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      {health.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                    <h4 className="font-bold text-red-500 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {health.screeningTitle}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mb-3 font-medium">
                      {health.screeningDesc}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(health.screenings || []).map((item: any, idx: number) => (
                        <div key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-150 text-center">
                          <div className="text-xs font-bold text-stone-900 mb-0.5">{item.title}</div>
                          <div className="text-[10px] text-stone-500 font-medium leading-tight">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(health.sections || []).map((sec: any, idx: number) => {
                      const icons = [Activity, FileText];
                      const Icon = icons[idx % icons.length];
                      return (
                        <div key={idx} className="space-y-3">
                          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-150 pb-2">
                            <Icon size={16} className={idx === 0 ? "text-red-500" : "text-brand-orange"} />
                            {sec.title}
                          </h4>
                          <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                            {sec.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PRIVACY PREVIEW */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 text-left">
                <div className="p-5 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl flex items-start gap-4">
                  <Lock className="text-brand-teal shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-editorial font-bold text-stone-900 text-base">
                      {privacy.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                      {privacy.subtitle}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
                  {(privacy.sections || []).map((sec: any, idx: number) => (
                    <div key={idx} className="space-y-3" style={{ wordBreak: 'break-word' }}>
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-150 pb-2">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer banner */}
          <div className="px-6 py-4 border-t border-stone-150 bg-stone-50 shrink-0 text-center select-none text-[10px] text-stone-400 font-bold uppercase tracking-wider">
            NURTURING MINDS • SHAPING FUTURES
          </div>
        </div>

      </div>

    </main>
  );
};

// ==========================================
// UNAUTHORIZED / PASSWORD BYPASS PANEL
// ==========================================
const AdminUnauthorized: React.FC<{ onBypass: () => void }> = ({ onBypass }) => {
  const navigate = useNavigate();
  const [bypassPass, setBypassPass] = useState('');
  const [error, setError] = useState('');

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bypassPass === '123456') {
      onBypass();
    } else {
      setError('Invalid local bypass code. Please try again.');
    }
  };

  return (
    <main className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-transparent px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-xl p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-editorial font-bold text-stone-950">Administrative Access Required</h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            This dashboard is restricted to certified Kidtopia Daycare Administrators. Please sign in with your administrator account or enter the authorization credentials.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleBypassSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Admin Access Passcode</label>
            <input 
              type="password" 
              value={bypassPass}
              onChange={(e) => setBypassPass(e.target.value)}
              placeholder="Enter passcode to bypass"
              className="w-full p-3 border border-stone-200 rounded-xl text-xs font-mono outline-none focus:border-stone-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs transition"
            >
              Sign In Page
            </button>
            <button
              type="submit"
              className="w-full py-3 bg-brand-green text-white hover:bg-brand-green/95 rounded-xl font-black text-xs transition uppercase tracking-wider"
            >
              Unlock Editor
            </button>
          </div>
        </form>

        <button
          onClick={() => navigate('/')}
          className="text-xs font-bold text-stone-400 hover:text-stone-600 transition-colors block mx-auto"
        >
          Return to Homepage
        </button>
      </motion.div>
    </main>
  );
};
