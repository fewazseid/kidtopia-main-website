import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, Shield, FileText, Heart, ShieldCheck, Scale, Award, 
  Clock, DollarSign, Activity, Lock, BookOpen, AlertCircle, Printer
} from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'terms' | 'guidelines' | 'health' | 'privacy';
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ 
  isOpen, 
  onClose, 
  lang, 
  initialTab = 'terms' 
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'guidelines' | 'health' | 'privacy'>(initialTab);

  if (!isOpen) return null;

  const content = useContent(lang);
  const isEn = lang === 'en';
  
  // Dynamic policies from state/DB context
  const policies = content.resources?.policies || {};

  const tabs = [
    { id: 'terms' as const, label: isEn ? 'Terms & Conditions' : 'ውሎች እና ሁኔታዎች', icon: Scale },
    { id: 'guidelines' as const, label: isEn ? 'Parent Guidelines' : 'የወላጅ መመሪያዎች', icon: BookOpen },
    { id: 'health' as const, label: isEn ? 'Health & Medical Policy' : 'የጤና እና የህክምና ፖሊሲ', icon: Heart },
    { id: 'privacy' as const, label: isEn ? 'Data Security & Privacy' : 'የግል መረጃ እና ደህንነት', icon: Lock }
  ];

  // 1. TERMS
  const termsData = policies.terms || { title: '', subtitle: '', sections: [] };

  // 2. GUIDELINES
  const guidelinesData = policies.guidelines || { title: '', subtitle: '', sections: [] };

  // 3. HEALTH
  const healthData = policies.health || { 
    title: '', 
    subtitle: '', 
    screeningTitle: '', 
    screeningDesc: '', 
    screenings: [], 
    sections: [] 
  };

  // 4. PRIVACY
  const privacyData = policies.privacy || { title: '', subtitle: '', sections: [] };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative z-10 border border-stone-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-150 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Shield size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-editorial font-bold text-stone-900 leading-tight">
                {isEn ? 'Kidtopia Daycare Policies & Framework' : 'የኪድቶፒያ የህፃናት ማቆያ ፖሊሲዎች እና ደንቦች'}
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {isEn 
                  ? 'Kidtopia Daycare Policies & Handbook Standards' 
                  : 'ኪድቶፒያ የህፃናት ማቆያ ፖሊሲዎች እና የወላጅ መመሪያ ደረጃዎች'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 py-2 bg-stone-50 border-b border-stone-200 shrink-0 flex gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all whitespace-nowrap select-none ${
                  isActive 
                    ? 'bg-brand-green text-white shadow-md' 
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon size={14} className="stroke-[2.5]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* TERMS & CONDITIONS TAB */}
          {activeTab === 'terms' && (
            <div className="space-y-6 text-left">
              <div className="p-5 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-start gap-4">
                <Scale className="text-brand-green shrink-0 mt-0.5" size={22} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-base">
                    {termsData.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {termsData.subtitle}
                  </p>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(termsData.sections || []).map((sec: any, idx: number) => {
                  const icons = [DollarSign, Clock, ShieldCheck, Scale];
                  const Icon = icons[idx % icons.length];
                  const colors = ["text-brand-orange", "text-brand-yellow", "text-brand-green", "text-brand-teal"];
                  return (
                    <div key={idx} className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
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

          {/* PARENT GUIDELINES TAB */}
          {activeTab === 'guidelines' && (
            <div className="space-y-6 text-left">
              <div className="p-5 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl flex items-start gap-4">
                <BookOpen className="text-brand-orange shrink-0 mt-0.5" size={22} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-base">
                    {guidelinesData.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {guidelinesData.subtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(guidelinesData.sections || []).map((sec: any, idx: number) => {
                  const icons = [Clock, FileText, ShieldCheck, Award];
                  const Icon = icons[idx % icons.length];
                  const colors = ["text-brand-green", "text-brand-orange", "text-brand-teal", "text-brand-yellow"];
                  return (
                    <div key={idx} className="space-y-3">
                      <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
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

          {/* HEALTH & MEDICAL POLICY TAB */}
          {activeTab === 'health' && (
            <div className="space-y-6 text-left">
              <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                <Heart className="text-red-500 shrink-0 mt-0.5" size={22} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-base">
                    {healthData.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {healthData.subtitle}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2.5 text-red-500 flex items-center gap-2">
                    <AlertCircle size={14} />
                    {healthData.screeningTitle}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3 font-medium">
                    {healthData.screeningDesc}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {(healthData.screenings || []).map((item: any, idx: number) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                        <div className="text-xs font-bold text-stone-900 mb-0.5">{item.title}</div>
                        <div className="text-[10px] text-stone-500 font-medium">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(healthData.sections || []).map((sec: any, idx: number) => {
                    const icons = [Activity, FileText];
                    const Icon = icons[idx % icons.length];
                    return (
                      <div key={idx} className="space-y-3">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
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

          {/* PRIVACY POLICY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-left">
              <div className="p-5 bg-brand-teal/10 border border-brand-teal/20 rounded-2xl flex items-start gap-4">
                <Lock className="text-brand-teal shrink-0 mt-0.5" size={22} />
                <div>
                  <h3 className="font-editorial font-bold text-stone-900 text-base">
                    {privacyData.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {privacyData.subtitle}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
                {(privacyData.sections || []).map((sec: any, idx: number) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
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

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-150 flex justify-between items-center bg-stone-50 shrink-0">
          <p className="text-[10px] text-stone-400 font-medium">
            {isEn 
              ? 'Kidtopia Daycare is fully certified under Ethiopian Child Care Regulations.'
              : 'ኪድቶፒያ የህጻናት ማቆያ በኢትዮጵያ የህፃናት እንክብካቤ ደንቦች መሰረት ሙሉ በሙሉ የተረጋገጠ ነው።'}
          </p>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-brand-green text-white rounded-xl text-xs font-black shadow-md hover:bg-brand-green/95 transition flex items-center gap-2"
          >
            <Printer size={13} />
            <span>{isEn ? 'Download / Print Framework' : 'ደንቦቹን አውርድ / አትም'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
