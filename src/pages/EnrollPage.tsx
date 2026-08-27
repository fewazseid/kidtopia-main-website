import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useContent } from "../ContentContext";
import { Language } from "../translations";
import {
  CheckCircle,
  ClipboardList,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LARAVEL_ENROLL_URL } from "../config";

interface EnrollPageProps {
  lang: Language;
}

export const EnrollPage: React.FC<EnrollPageProps> = ({ lang }) => {
  const t = useContent(lang);
  const data = t.enrollmentPage || {
    title: "Enrollment Information & Required Documents",
    subtitle:
      "Welcome to the Kidtopia enrollment guide. Please prepare the following documents before proceeding to our online registration form.",
    processTitle: "Our 4-Step Enrollment Process",
    processSteps: [],
    documentsTitle: "Required Enrollment Documents",
    documentsDesc:
      "All documents below must be uploaded or presented during registration to secure your child's spot.",
    documentsList: [],
    proceedButton: "Proceed to Online Enrollment Form",
  };

  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const totalDocs = data.documentsList?.length || 0;
  const checkedCount = Object.values(checkedDocs).filter(Boolean).length;
  const progressPercent =
    totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const [activeTab, setActiveTab] = useState<
    "rules" | "handbook" | "nutrition" | "milestones"
  >("rules");

  // Load parent resources data from synced translations
  const resData = t.resources || {};
  const handbookChapters = resData.handbookChapters || [];
  const menuDays = resData.menuDays || [];
  const milestonesData = resData.milestonesData || {};
  const policiesAndRegulations = resData.policiesAndRegulations || [];

  return (
    <main className="pt-28 pb-20 bg-transparent min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-brand-green font-medium hover:text-brand-orange transition-colors mb-6 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span>{lang === "am" ? "ወደ መነሻ ገጽ ይመለሱ" : "Back to Home"}</span>
        </Link>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card-rounded p-8 md:p-12 mb-8 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-bl-full z-0" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <ClipboardList size={16} />
              <span>
                {lang === "am" ? "በቅድሚያ መዘጋጀት ያለባቸው" : "Prerequisites Guide"}
              </span>
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-4 tracking-tight">
              {data.title}
            </h1>
            <p className="text-stone-600 text-lg max-w-2xl leading-relaxed">
              {data.subtitle}
            </p>
          </div>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-rounded p-8 md:p-10 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-brand-green" size={26} />
            <span>{data.processTitle}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {data.processSteps?.map((p: any, idx: number) => (
              <div
                key={idx}
                className="relative flex flex-col md:items-start group"
              >
                {/* Visual Connector Line */}
                {idx < data.processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-12 right-0 h-0.5 bg-stone-100 group-hover:bg-brand-yellow/50 transition-colors z-0" />
                )}
                <div className="flex items-center gap-4 md:flex-col md:items-start relative z-10">
                  <div className="w-12 h-12 bg-brand-green text-white font-bold rounded-full flex items-center justify-center text-lg shadow-sm border-4 border-brand-cream group-hover:bg-brand-orange transition-colors">
                    {p.step}
                  </div>
                  <div className="flex-1 md:mt-2">
                    <h3 className="font-serif font-bold text-stone-900 group-hover:text-brand-green transition-colors text-lg mb-1">
                      {p.title}
                    </h3>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Active Checklist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card-rounded p-8 md:p-10 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-stone-900 mb-2 flex items-center gap-2">
                <FileCheck className="text-brand-green" size={26} />
                <span>{data.documentsTitle}</span>
              </h2>
              <p className="text-stone-500 text-sm max-w-xl">
                {data.documentsDesc}
              </p>
            </div>

            {/* Live Progress Bar */}
            <div className="bg-brand-cream/80 px-4 py-3 rounded-2xl border border-stone-100 min-w-[180px] self-start md:self-auto">
              <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
                <span>{lang === "am" ? "የተዘጋጁ ሰነዶች" : "Documents Ready"}</span>
                <span className="text-brand-green">
                  {checkedCount}/{totalDocs}
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className="bg-brand-green h-2 rounded-full transition-all duration-350"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {data.documentsList?.map((doc: any, idx: number) => {
              const isChecked = checkedDocs[idx] || false;
              // Check if doc contains medical keywords to highlight it subtly
              const isMedical =
                doc.title.toLowerCase().includes("medical") ||
                doc.title.toLowerCase().includes("screening") ||
                doc.title.toLowerCase().includes("vacc") ||
                doc.title.toLowerCase().includes("በሽታ") ||
                doc.title.toLowerCase().includes("የጤና") ||
                doc.title.toLowerCase().includes("ምርመራ");
              return (
                <div
                  key={idx}
                  onClick={() => toggleDoc(idx)}
                  className={`p-4 md:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 select-none ${
                    isChecked
                      ? "border-brand-green/35 bg-brand-green/5"
                      : isMedical
                        ? "border-brand-orange/20 hover:border-brand-orange/40 bg-brand-orange/3 animate-pulse-subtle"
                        : "border-stone-100 hover:border-stone-200 hover:bg-stone-50/50"
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckCircle
                        className="text-brand-green fill-brand-green/10"
                        size={22}
                      />
                    ) : (
                      <div
                        className={`w-[22px] h-[22px] rounded-full border-2 transition-all ${
                          isMedical ? "border-brand-orange" : "border-stone-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`font-serif font-bold text-stone-900 text-lg ${isChecked ? "line-through text-stone-400" : ""}`}
                      >
                        {doc.title}
                      </h4>
                      {isMedical && !isChecked && (
                        <span className="inline-flex items-center gap-0.5 bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {lang === "am" ? "አስፈላጊ የጤና" : "Strict Medical"}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-stone-500 text-sm mt-1 leading-relaxed ${isChecked ? "text-stone-400" : ""}`}
                    >
                      {doc.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress encouraging prompt */}
          {progressPercent > 0 && progressPercent < 100 && (
            <div className="mt-6 flex items-center gap-2 bg-brand-yellow/10 text-stone-700 p-4 rounded-2xl border border-brand-yellow/25 text-sm">
              <Info
                size={16}
                className="text-brand-orange shrink-0 animate-bounce"
              />
              <span>
                {lang === "am"
                  ? `በጣም ጥሩ ነው! ${checkedCount} ሰነዶችን አዘጋጅተዋል። ሁሉንም ለማዘጋጀት ${totalDocs - checkedCount} ሰነድ ይቀራል።`
                  : `Great progress! You prepared ${checkedCount} documents. Just ${totalDocs - checkedCount} more to go!`}
              </span>
            </div>
          )}

          {progressPercent === 100 && (
            <div className="mt-6 flex items-center gap-2 bg-brand-green/10 text-brand-green p-4 rounded-2xl border border-brand-green/20 text-sm">
              <CheckCircle size={18} className="shrink-0" />
              <span>
                {lang === "am"
                  ? "ሁሉም ሰነዶች ተዘጋጅተዋል! አሁኑኑ የምዝገባ ፎርሙን መሙላት ይችላሉ።"
                  : "Perfect! You have prepared all required documents and screening papers."}
              </span>
            </div>
          )}
        </motion.div>


        {/* Enrollment Terms and Conditions Card with Parent Resources Integration */}
        <motion.div
          id="terms-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className={`bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border shadow-sm mb-8 transition-all duration-350 ${
            showWarning && !termsAccepted
              ? "border-brand-orange/50 bg-brand-orange/3 ring-2 ring-brand-orange/10"
              : "border-white/40"
          }`}
        >
          <h3 className="font-serif font-bold text-stone-900 text-xl mb-2 flex items-center gap-2">
            <FileCheck className="text-brand-green" size={24} />
            <span>
              {lang === "am"
                ? "የምዝገባ ደንቦች እና የወላጅ መመሪያዎች"
                : "Enrollment Terms, Policies & Parent Guides"}
            </span>
          </h3>
          <p className="text-stone-500 text-xs mb-6 leading-relaxed">
            {lang === "am"
              ? "እባክዎ ከመመዝገብዎ በፊት እያንዳንዱን ትር ጠቅ በማድረግ ሁሉንም መመሪያዎች፣ የወላጅ መመሪያ ምዕራፎችን፣ ሳምንታዊ ምግቦችን እና የልጅ እድገት ደረጃዎችን ያንብቡ።"
              : "Please review all information, parent handbook chapters, nutritional guides, and milestones by clicking each tab before checking the acceptance box."}
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-5 border-b border-stone-200/60 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("rules")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "rules"
                  ? "bg-brand-green text-white shadow-md"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60"
              }`}
            >
              {lang === "am" ? "ፖሊሲዎች እና ደንቦች" : "Policies & Regulations"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("handbook")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "handbook"
                  ? "bg-brand-green text-white shadow-md"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60"
              }`}
            >
              {lang === "am" ? "የወላጅ መመሪያ ምዕራፎች" : "Handbook Chapters"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("nutrition")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "nutrition"
                  ? "bg-brand-green text-white shadow-md"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60"
              }`}
            >
              {lang === "am" ? "የምግብ መመሪያ" : "Nutrition & Meals"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("milestones")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "milestones"
                  ? "bg-brand-green text-white shadow-md"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-600 border border-stone-200/60"
              }`}
            >
              {lang === "am" ? "የእድገት ደረጃዎች" : "Development Milestones"}
            </button>
          </div>

          {/* Dynamic Content Container */}
          <div className="bg-stone-50 rounded-2xl p-5 text-sm text-stone-600 mb-6 max-h-[350px] overflow-y-auto border border-stone-200/60 scrollbar-thin scrollbar-thumb-stone-200">
            {activeTab === "rules" && (
              <div className="space-y-4">
                {policiesAndRegulations.length === 0 ? (
                  <p className="text-stone-400 text-center py-4">
                    {lang === "am"
                      ? "ምንም ፖሊሲዎች እና ደንቦች አልተገኙም።"
                      : "No policies or regulations found."}
                  </p>
                ) : (
                  policiesAndRegulations.map((policy: any, i: number) => (
                    <div
                      key={i}
                      className="pb-3 border-b border-stone-200/50 last:border-0 last:pb-0"
                    >
                      <h4 className="font-bold text-stone-850 mb-1">
                        {policy.title}
                      </h4>
                      <p className="leading-relaxed text-xs text-stone-600">
                        {policy.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "handbook" && (
              <div className="space-y-4">
                {handbookChapters.length === 0 ? (
                  <p className="text-stone-400 text-center py-4">
                    {lang === "am"
                      ? "ምንም ምዕራፎች አልተገኙም።"
                      : "No chapters available."}
                  </p>
                ) : (
                  handbookChapters.map((ch: any, i: number) => (
                    <div
                      key={i}
                      className="pb-3 border-b border-stone-200/50 last:border-0 last:pb-0"
                    >
                      <h4 className="font-bold text-stone-850 mb-1">
                        {ch.title}
                      </h4>
                      <p className="leading-relaxed text-xs text-stone-600">
                        {ch.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "nutrition" && (
              <div className="space-y-4">
                <p className="text-xs font-medium text-stone-500 mb-3">
                  {lang === "am"
                    ? "ለልጅዎ የተመጣጠነ ምግብ ለማቅረብ የምንከተለው ሳምንታዊ የምግብ እቅድ የሚከተለው ነው።"
                    : "Our daily meal layout focused on optimal nutrition and balanced dietary intake:"}
                </p>
                {menuDays.length === 0 ? (
                  <p className="text-stone-400 text-center py-4">
                    {lang === "am"
                      ? "ምንም የምግብ እቅድ አልተገኘም።"
                      : "No menu planner days found."}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {menuDays.map((d: any, i: number) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-stone-150 rounded-xl"
                      >
                        <h4 className="font-bold text-brand-green text-sm mb-1.5">
                          {d.day}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="font-bold text-stone-700 block">
                              {lang === "am" ? "ቁርስ:" : "Breakfast:"}
                            </span>
                            <span className="text-stone-500">
                              {d.breakfast}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-700 block">
                              {lang === "am" ? "ምሳ:" : "Lunch:"}
                            </span>
                            <span className="text-stone-500">{d.lunch}</span>
                          </div>
                          <div>
                            <span className="font-bold text-stone-700 block">
                              {lang === "am" ? "ትኩስ መክሰስ:" : "Snack:"}
                            </span>
                            <span className="text-stone-500">{d.snack}</span>
                          </div>
                        </div>
                        {d.allergens && d.allergens.length > 0 && (
                          <div className="mt-2 text-[10px] text-brand-orange font-bold uppercase tracking-wider">
                            ⚠️ {lang === "am" ? "አለርጂዎች:" : "Allergens:"}{" "}
                            {d.allergens.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "milestones" && (
              <div className="space-y-5">
                {Object.keys(milestonesData).length === 0 ? (
                  <p className="text-stone-400 text-center py-4">
                    {lang === "am"
                      ? "ምንም የልጅ እድገት ደረጃዎች አልተገኙም።"
                      : "No milestones data available."}
                  </p>
                ) : (
                  Object.keys(milestonesData).map((catKey) => {
                    const category = milestonesData[catKey];
                    return (
                      <div
                        key={catKey}
                        className="p-3 bg-white border border-stone-150 rounded-xl"
                      >
                        <h4 className="font-bold text-stone-850 text-sm mb-2 pb-1.5 border-b border-stone-100">
                          {category.title}
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-xs text-stone-600">
                          {category.items?.map((item: any, idx: number) => (
                            <li key={item.id || idx}>{item.text}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (e.target.checked) setShowWarning(false);
                }}
                className="mt-1 h-5 w-5 rounded border-stone-300 text-brand-green focus:ring-brand-green/30 cursor-pointer accent-brand-green transition-all"
              />
              <span className="text-stone-700 text-sm font-medium leading-relaxed group-hover:text-stone-900 transition-colors">
                {lang === "am"
                  ? "ሁሉንም የምዝገባ ደንቦች፣ የወላጅ መመሪያ ምዕራፎችን፣ የጤና እና የምግብ መግለጫዎችን አንብቤያለሁ፣ በተገለጹት መመሪያዎችም ሙሉ በሙሉ ተስማምቻለሁ።"
                  : "I have read, understood, and voluntarily accept all of the enrollment Terms & Conditions, Parent Handbook chapters, health guidelines, and milestones policies of Kidtopia."}
              </span>
            </label>

            {showWarning && !termsAccepted && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-brand-orange text-xs font-semibold mt-1"
              >
                <AlertCircle size={14} />
                <span>
                  {lang === "am"
                    ? "እባክዎ ከመቀጠልዎ በፊት በደንቦች እና ሁኔታዎች መስማማትዎን ለማረጋገጥ ሳጥኑን ምልክት ያድርጉ"
                    : "Please check the box to accept the terms and conditions before proceeding."}
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-3xl"
        >
          <div className="text-center sm:text-left">
            <h4 className="font-serif font-bold text-stone-900 text-lg">
              {lang === "am" ? "ምዝገባቸውን ለመቀጠል ዝግጁ ነዎት?" : "Ready to begin?"}
            </h4>
            <p className="text-stone-500 text-xs mt-0.5">
              {lang === "am"
                ? "ሊንኩ ወደ ረዳት ኦፊሴላዊ ፎርሙ ይወስዳል"
                : "Redirects to the secure, authorized application form"}
            </p>
          </div>

          {termsAccepted ? (
            <a
              href={LARAVEL_ENROLL_URL}
              target="_self"
              className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 btn-secondary text-base font-bold tracking-wide px-8 py-4 px-10 shadow-lg shadow-brand-orange/20 hover:scale-[1.02] transition-transform"
            >
              <span>{data.proceedButton}</span>
              <ArrowRight size={18} />
            </a>
          ) : (
            <button
              onClick={() => {
                setShowWarning(true);
                const section = document.getElementById("terms-section");
                if (section) {
                  section.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }}
              className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 bg-stone-100 text-stone-400 font-semibold text-base py-4 px-10 rounded-full border border-stone-200 cursor-pointer hover:bg-stone-200/60 active:scale-95 transition-all"
            >
              <span>{data.proceedButton}</span>
              <ArrowRight size={18} />
            </button>
          )}
        </motion.div>
      </div>
    </main>
  );
};
