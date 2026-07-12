import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Shield, FileText, Heart, ShieldCheck, Scale, Award, 
  Clock, DollarSign, Activity, Lock, BookOpen, AlertCircle, Printer
} from 'lucide-react';
import { Language } from '../translations';

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

  const isEn = lang === 'en';

  const tabs = [
    { id: 'terms' as const, label: isEn ? 'Terms & Conditions' : 'ውሎች እና ሁኔታዎች', icon: Scale },
    { id: 'guidelines' as const, label: isEn ? 'Parent Guidelines' : 'የወላጅ መመሪያዎች', icon: BookOpen },
    { id: 'health' as const, label: isEn ? 'Health & Medical Policy' : 'የጤና እና የህክምና ፖሊሲ', icon: Heart },
    { id: 'privacy' as const, label: isEn ? 'Data Security & Privacy' : 'የግል መረጃ እና ደህንነት', icon: Lock }
  ];

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
                    {isEn ? 'Contractual Agreement & Enrollment terms' : 'ውል ስምምነት እና የምዝገባ ሁኔታዎች'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {isEn 
                      ? 'By enrolling your child at Kidtopia Daycare, you enter into a legally binding agreement in strict alignment with local directives.'
                      : 'ልጅዎን በኪድቶፒያ የህጻናት ማቆያ ውስጥ ሲያስመዘግቡ፣ በአገር ውስጥ መመሪያዎች መሰረት ህጋዊ አስገዳጅነት ባለው ስምምነት ውስጥ ይገባሉ።'}
                  </p>
                </div>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <DollarSign size={16} className="text-brand-orange" />
                    {isEn ? '1. Tuition & Late Fees' : '1. ክፍያዎች እና የቅጣት ውሎች'}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2 leading-relaxed list-disc pl-4">
                    {isEn ? (
                      <>
                        <li>Tuition payments are strictly due on the <strong>1st day of each calendar month</strong>.</li>
                        <li>A <strong>10% late payment fee</strong> will be automatically added to outstanding balances on the 6th day of the month.</li>
                        <li>Non-payment of tuition by the <strong>10th of the month</strong> will result in immediate suspension of child care services.</li>
                        <li>We do not offer credits or refunds for sick days, vacation days, or holidays.</li>
                      </>
                    ) : (
                      <>
                        <li>የወርሃዊ ክፍያ የሚጠናቀቀው <strong>በየወሩ 1ኛው ቀን ላይ ብቻ</strong> ነው።</li>
                        <li>ከእያንዳንዱ ወር 5ኛ ቀን በኋላ ላልተከፈሉ እዳዎች <strong>የ10% የዘግይቶ መክፈያ ቅጣት</strong> በራስ-ሰር ይታሰባል።</li>
                        <li>እስከ እያንዳንዱ ወር <strong>10ኛው ቀን</strong> ድረስ ካልተከፈለ አገልግሎት ለጊዜው ይቋረጣል።</li>
                        <li>ልጁ በታመመባቸው፣ ፈቃድ በወሰደባቸው ወይም በበዓላት ቀናት ክፍያ ተመላሽ አይደረግም።</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <Clock size={16} className="text-brand-yellow" />
                    {isEn ? '2. Hours & Late Pick-ups' : '2. የስራ ሰዓት እና ዘግይቶ መረከብ'}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2 leading-relaxed list-disc pl-4">
                    {isEn ? (
                      <>
                        <li>Operating hours are strictly from <strong>7:30 AM to 6:00 PM</strong>, Monday through Friday.</li>
                        <li>A late pick-up penalty of <strong>$1 (or equivalent local rate) per minute</strong> is strictly applied for any pickups after 6:00 PM.</li>
                        <li>Late fees will be added directly to the following month’s invoice and must be cleared prior to attendance.</li>
                        <li>Repeated late pick-ups (more than 3 times in a term) may result in enrollment termination.</li>
                      </>
                    ) : (
                      <>
                        <li>የስራ ሰዓት ከሰኞ እስከ አርብ ከጠዋቱ <strong>1:30 (7:30 AM) እስከ ማታ 12:00 (6:00 PM)</strong> ነው።</li>
                        <li>ከምሽቱ 12:00 (6:00 PM) በኋላ ለሚደረጉ መረከቦች <strong>በደቂቃ $1 (ወይም በየቀኑ በኢትዮጵያ ብር ተመጣጣኝ ዋጋ)</strong> ቅጣት በጥብቅ ተፈጻሚ ይሆናል።</li>
                        <li>ዘግይቶ የመውሰጃ ቅጣት በሚቀጥለው ወር ደረሰኝ ላይ በቀጥታ የሚታከል ሲሆን አገልግሎቱ ከመቀጠሉ በፊት መከፈል አለበት።</li>
                        <li>በተደጋጋሚ (ከ3 ጊዜ በላይ) ዘግይቶ መረከብ ከማቆያው መሰረዝን ያስከትላል።</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <ShieldCheck size={16} className="text-brand-green" />
                    {isEn ? '3. Withdrawal & Security Deposit' : '3. ምዝገባ ስረዛ እና የዋስትና ተቀማጭ'}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2 leading-relaxed list-disc pl-4">
                    {isEn ? (
                      <>
                        <li>Parents must provide a minimum of <strong>30 days written withdrawal notice</strong> to the Administration.</li>
                        <li>Failure to provide a full 30 days notice will result in the <strong>complete forfeiture of the security deposit</strong>.</li>
                        <li>The final month's tuition will not be prorated.</li>
                        <li>The center reserves the right to terminate enrollment immediately for severe non-compliance or safety concerns.</li>
                      </>
                    ) : (
                      <>
                        <li>ወላጆች ምዝገባ ለመሰረዝ ቢያንስ <strong>የ30 ቀናት ቅድመ የጽሁፍ ማስጠንቀቂያ</strong> ለአስተዳደሩ ማቅረብ አለባቸው።</li>
                        <li>የ30 ቀናት ቅድመ ማስጠንቀቂያ ሳያቀርቡ ሲቀሩ <strong>የያዙት የዋስትና ክፍያ (Security Deposit) ሙሉ በሙሉ አይመለስም</strong>።</li>
                        <li>የመጨረሻው ወር ክፍያ በተናጠል አይሰላም።</li>
                        <li>ከባድ ደንብ መተላለፍ ወይም የደህንነት ስጋት በሚኖርበት ጊዜ ማቆያው ወዲያውኑ ምዝገባ የመሰረዝ መብቱ የተጠበቀ ነው።</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <Scale size={16} className="text-brand-teal" />
                    {isEn ? '4. Security & Pick-up Permissions' : '4. የደህንነት እና የልጅ መረከቢያ ፈቃድ'}
                  </h4>
                  <ul className="text-xs text-stone-600 space-y-2 leading-relaxed list-disc pl-4">
                    {isEn ? (
                      <>
                        <li>Children will ONLY be released to individuals listed as <strong>Authorized Pick-up Persons</strong> in our registration database.</li>
                        <li>All pick-up persons must register their fingerprint and present a valid government-issued photo ID upon entry.</li>
                        <li>No children will be released to individuals under the age of 18 or anyone suspected of being under the influence.</li>
                        <li>Ad-hoc pickup authorizations must be submitted in writing via the parent portal software at least 2 hours in advance.</li>
                      </>
                    ) : (
                      <>
                        <li>ልጆች የሚለቀቁት በምዝገባ ዳታቤዛችን ውስጥ በስም ለተመዘገቡ <strong>ፈቃድ ላላቸው ሰዎች ብቻ</strong> ነው።</li>
                        <li>ሁሉም ልጁን የሚረከቡ ሰዎች የጣት አሻራ መመዝገብ እና ህጋዊ መታወቂያ ማቅረብ አለባቸው።</li>
                        <li>ዕድሜያቸው ከ18 ዓመት በታች ለሆኑ ወይም የአእምሮ ዝግጁነት ለሌላቸው ሰዎች ልጆች ተላልፈው አይሰጡም።</li>
                        <li>ድንገተኛ የልጅ መረከቢያ ጥያቄዎች ቢያንስ ከ2 ሰዓት በፊት በወላጆች መገናኛ ሶፍትዌር በኩል መላክ አለባቸው።</li>
                      </>
                    )}
                  </ul>
                </div>
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
                    {isEn ? 'Daily Guidelines & Parent Expectations' : 'ዕለታዊ መመሪያዎች እና የወላጆች ግዴታ'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {isEn 
                      ? 'Operational guidelines based on our Kidtopia Parent Handbook to maintain premium care standards.'
                      : 'የኪድቶፒያ የወላጅ መመሪያን መሠረት ያደረጉ ዕለታዊ የስራ መመሪያዎች።'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <Clock size={16} className="text-brand-green" />
                    {isEn ? '1. Daily Routine & Napping' : '1. ዕለታዊ ፕሮግራም እና የእንቅልፍ ሰዓት'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isEn ? (
                      <>
                        A restorative rest/nap period is enforced daily from <strong>1:00 PM to 3:00 PM</strong> for all toddler and preschool classes. 
                        Kidtopia provides customized, age-appropriate sanitized bedding which is laundered daily in-house. 
                        No outside toys, heavy blankets, or personal pillows are permitted to minimize allergy risks.
                      </>
                    ) : (
                      <>
                        ለሁሉም ታዳጊዎች እና የቅድመ ትምህርት ቤት ህጻናት በየቀኑ ከቀኑ <strong>ከ7:00 (1:00 PM) እስከ 9:00 (3:00 PM) ሰዓት</strong> የእንቅልፍ እና የጸጥታ ሰዓት ነው። 
                        ኪድቶፒያ በየቀኑ በማቆያው ውስጥ በንጽህና የታጠቡ አልጋዎችን እና አንሶላዎችን ያቀርባል። 
                        ከአለርጂ ስጋቶች ለመከላከል የውጭ መጫወቻዎች፣ የግል ብርድ ልብሶች ወይም ትራሶች አይፈቀዱም።
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <FileText size={16} className="text-brand-orange" />
                    {isEn ? '2. Parent-Teacher Communication' : '2. የወላጅ እና አስተማሪ መገናኛ መጻሕፍት'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isEn ? (
                      <>
                        Every child has an interactive digital <strong>Communication Log</strong> inside our Daycare Control Software. 
                        Teachers log diaper changes, toilet training, food intake, naps, and educational milestone progress daily. 
                        Parents are highly encouraged to check these logs daily and leave active comments.
                      </>
                    ) : (
                      <>
                        እያንዳንዱ ህጻን በማቆያ መቆጣጠሪያ ሶፍትዌራችን ውስጥ ዲጂታል <strong>የመገናኛ ደብተር</strong> አለው። 
                        አስተማሪዎች የሽንት ጨርቅ መቀየርን፣ የምግብ ፍጆታን፣ የእንቅልፍ ሰዓትን እና የልጁን የእለት ተእለት የእውቀት ደረጃ መዝገብ እዚህ ያሰፍራሉ። 
                        ወላጆች ይህንን በየቀኑ እንዲያዩ እና አስተያየት እንዲለግሱ በጥብቅ እናበረታታለን።
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <ShieldCheck size={16} className="text-brand-teal" />
                    {isEn ? '3. Standard Clothing & Personal Care' : '3. የልብስ እና የግል ንጽህና ደንብ'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isEn ? (
                      <>
                        Please dress your child in comfortable, play-friendly clothes that can withstand arts/crafts. 
                        Parents must provide <strong>at least two complete changes of extra clothes</strong>, labeled clearly with the child's name, to be kept in their individual locker cubby. 
                        For children in diapers, a weekly stock of diapers and wipes must be replenished.
                      </>
                    ) : (
                      <>
                        እባክዎን ለልጅዎ ምቹ፣ ለመጫወት እና ለስዕል ስራዎች የሚሆኑ ልብሶችን ያለብሷቸው። 
                        ወላጆች <strong>ቢያንስ ሁለት ጥንድ ትርፍ ልብሶችን</strong> በልጁ ስም ምልክት ተደርጎባቸው በማቆያው የግል መቆለፊያ ውስጥ ማስቀመጥ አለባቸው። 
                        የሽንት ጨርቅ ለሚጠቀሙ ህጻናት፣ በየሳምንቱ የሽንት ጨርቅ እና የጽዳት ጥቅል ማቅረብ አለባቸው።
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <Award size={16} className="text-brand-yellow" />
                    {isEn ? '4. Positive Guidance Policy' : '4. አዎንታዊ የስነ-ምግባር መመሪያዎች'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {isEn ? (
                      <>
                        Consistent with our policy, Kidtopia operates a strict <strong>Zero Corporal Punishment Policy</strong>. 
                        We guide child behaviors through positive reinforcement, logical redirection, and structured emotional coaching. 
                        Physical discipline, isolation, or verbal shaming of any child is strictly prohibited by all staff members.
                      </>
                    ) : (
                      <>
                        ከኪድቶፒያ ደንቦች ጋር በተገናኘ፣ ኪድቶፒያ ጥብቅ <strong>የአካል ቅጣት ክልከላ (Zero Corporal Punishment)</strong> ፖሊሲ ይከተላል። 
                        የልጆችን ባህሪ የምንመራው በአዎንታዊ ማበረታቻ፣ በስነ-ልቦናዊ ትምህርት እና ትኩረታቸውን በመቀየር ብቻ ነው። 
                        በልጆች ላይ የአካል ወይም የስሜት ቅጣት እንዲሁም ማግለል በሰራተኞች ዘንድ ፈጽሞ አይፈቀድም።
                      </>
                    )}
                  </p>
                </div>
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
                    {isEn ? 'Mandatory Medical Screenings & Illness Policy' : 'አስገዳጅ የጤና ምርመራዎች እና የታመሙ ልጆች ደንብ'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {isEn 
                      ? 'Rigid medical screening criteria to safeguard your child.'
                      : 'የልጅዎን ጤንነት ለመጠበቅ የተቀመጡ አስገዳጅ የህክምና ደንቦች።'}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2.5 text-red-500 flex items-center gap-2">
                    <AlertCircle size={14} />
                    {isEn ? 'Mandatory Pre-Admission Medical Screenings' : 'ቅድመ ምዝገባ አስገዳጅ የህክምና ምርመራዎች'}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {isEn ? (
                      <>
                        In compliance with our health policies, <strong>all children must provide official, stamped laboratory test certificates</strong> before they can attend their first day. No exceptions:
                      </>
                    ) : (
                      <>
                        በደንቦቻችን መሰረት፣ <strong>ሁሉም ልጆች ከመጀመሪያው ቀን በፊት ህጋዊ የላብራቶሪ ምርመራ ማረጋገጫ ማቅረብ አለባቸው</strong>። ምንም ልዩ ሁኔታ አይፈቀድም፦
                      </>
                    )}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { title: isEn ? 'TB Clearance' : 'የቲቢ ምርመራ', desc: isEn ? 'Tuberculosis medical clearance' : 'ሳንባ ነቀርሳ (TB) ነጻ መሆን' },
                      { title: isEn ? 'Immunization' : 'የክትባት ካርድ', desc: isEn ? 'Up-to-date vaccine chart' : 'የተሟላ የክትባት ሰነድ' },
                      { title: isEn ? 'HIV Screening' : 'የኤችአይቪ ምርመራ', desc: isEn ? 'Certified laboratory result' : 'የኤችአይቪ ደህንነት ምርመራ' },
                      { title: isEn ? 'Hepatitis B' : 'የሄፓታይተስ ምርመራ', desc: isEn ? 'Hep B screening report' : 'ሄፓታይተስ ቢ (Hepatitis B) ምርመራ' }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                        <div className="text-xs font-bold text-stone-900 mb-0.5">{item.title}</div>
                        <div className="text-[10px] text-stone-500 font-medium">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <Activity size={16} className="text-red-500" />
                      {isEn ? 'When a Child Must Stay Home' : 'ልጆች ቤት መቆየት ያለባቸው መቼ ነው?'}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isEn ? (
                        <>
                          Children exhibiting any of the following symptoms will not be admitted to the facility:
                          <br />
                          • Fever over <strong>38°C (100.4°F)</strong>
                          <br />
                          • Diarrhea or vomiting within the past 24 hours
                          <br />
                          • Unexplained skin rashes, raw sores, or conjunctivitis (pink eye)
                          <br />
                          • Active, continuous coughing or severe congestion
                          <br />
                          Children must be <strong>entirely symptom-free for 24 hours</strong> without fever-reducing medication before returning.
                        </>
                      ) : (
                        <>
                          የሚከተሉት ምልክቶች የሚታዩባቸው ልጆች ወደ ማቆያው መግባት አይችሉም፦
                          <br />
                          • ትኩሳት ከ <strong>38°C (100.4°F)</strong> በላይ ሲሆን
                          <br />
                          • ተቅማጥ ወይም ማስመለስ ባለፉት 24 ሰዓታት ውስጥ ሲኖር
                          <br />
                          • ያልታወቁ ሽፍታዎች፣ ቁስሎች ወይም የአይን በሽታ ሲከሰት
                          <br />
                          • ከባድ እና የማያቋርጥ ሳል ወይም የትንፋሽ መጥበብ
                          <br />
                          ልጆች ትኩሳት ማስታገሻ ሳይወስዱ <strong>ለ24 ሰዓታት ሙሉ በሙሉ ከምልክት ነጻ</strong> መሆናቸው መረጋገጥ አለበት።
                        </>
                      )}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                      <FileText size={16} className="text-brand-orange" />
                      {isEn ? 'Medication Administration Rules' : 'የመድሃኒት አሰጣጥ ደንቦች'}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {isEn ? (
                        <>
                          Daycare nurses will only administer medications if:
                          <br />
                          1. A completed, signed <strong>Medication Authorization Form</strong> is submitted by the parent.
                          <br />
                          2. Prescription drugs are in their <strong>original pharmaceutical container</strong>, labeled clearly with the child's name, prescription number, dosage, and date.
                          <br />
                          3. Over-the-counter medicine must be new and accompanied by a pediatrician's printed instruction letter.
                        </>
                      ) : (
                        <>
                          የማቆያው ነርሶች መድሃኒት የሚሰጡት የሚከተሉት ሲሟሉ ብቻ ነው፦
                          <br />
                          1. በወላጅ የተፈረመ <strong>የመድሃኒት አስተዳደር ፈቃድ ቅጽ</strong> ሲቀርብ።
                          <br />
                          2. መድሃኒቶች በታዘዙበት <strong>ኦሪጅናል ማሸጊያ ላይ</strong> ሆነው የልጁ ስም፣ የመጠን መመሪያ እና ቀኑ በግልጽ ሲቀመጥ።
                          <br />
                          3. ያለ ሃኪም ትዕዛዝ የሚወሰዱ መድሃኒቶች አዲስ መሆን አለባቸው እና ከህጻናት ሀኪም የተጻፈ ደብዳቤ መያዝ አለባቸው።
                        </>
                      )}
                    </p>
                  </div>
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
                    {isEn ? 'Biometrics, Data Protection & Privacy Standard' : 'የጣት አሻራ፣ የውሂብ ጥበቃ እና ሚስጥራዊነት ደረጃ'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    {isEn 
                      ? 'Secure framework designed under international data and local security standards.'
                      : 'በዓለም አቀፍ የውሂብ ጥበቃ እና በአገር ውስጥ ደህንነት ደረጃዎች መሰረት የተዘጋጀ ጥበቃ።'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    {isEn ? '1. Biometric Security' : '1. የጣት አሻራ ደህንነት'}
                  </h4>
                  <p>
                    {isEn ? (
                      <>
                        Kidtopia utilizes an encrypted <strong>Fingerprint Registry System</strong> to coordinate child pick-ups. 
                        No raw fingerprint images are stored; instead, they are instantly converted into encrypted digital hashes which reside on a isolated, secure on-premise server. 
                        All biometric logs are permanently destroyed once your child graduates or withdraws from the center.
                      </>
                    ) : (
                      <>
                        ኪድቶፒያ ልጆችን ደህንነቱ በተጠበቀ ሁኔታ ለመረከብ ምስጠራ የተደረገበት <strong>የጣት አሻራ መዝገብ ስርዓት</strong> ይጠቀማል። 
                        የጣት አሻራ ምስሎች በኦሪጅናልነት አይቀመጡም፤ ይልቁንም በተናጠል አገልጋይ (Server) ላይ ወደ ሚስጥራዊ ኮድ ይቀየራሉ። 
                        ልጅዎ ከማቆያው በሚወጣበት ጊዜ ሁሉም የጣት አሻራ ውሂብ በቋሚነት ይሰረዛል።
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    {isEn ? '2. Media Consent & Safety' : '2. የምስል እና የሚዲያ ፈቃድ'}
                  </h4>
                  <p>
                    {isEn ? (
                      <>
                        Photos or videos of children are captured solely to document educational milestones and update parents inside the secure Parent Portal. 
                        No photos or videos of any child will be used for marketing, public social media, or website updates without an explicit, signed <strong>Bilingual Media Consent Waiver</strong> from the parent. 
                        Staff cellphones are strictly banned inside playrooms.
                      </>
                    ) : (
                      <>
                        የልጆች ፎቶዎች ወይም ቪዲዮዎች የሚቀረጹት ለትምህርታዊ ክንዋኔዎች እና ለወላጆች በዲጂታል ፖርታል በኩል መረጃ ለመስጠት ብቻ ነው። 
                        ያለ ወላጆች ፈቃድ ማናቸውም ምስሎች ለማስታወቂያ ወይም ለማህበራዊ ሚዲያ ፍጆታ አይውሉም። 
                        የሰራተኞች የግል ስልኮች በክፍሎች ውስጥ በጥብቅ የተከለከሉ ናቸው።
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    {isEn ? '3. Health Records Privacy' : '3. የጤና መዛግብት ሚስጥራዊነት'}
                  </h4>
                  <p>
                    {isEn ? (
                      <>
                        All mandatory medical screening reports (TB, HIV, Hep B) are treated as highly confidential. 
                        These records are only accessible to the on-site Daycare Nurse, Director, and verified auditing officials from the Ministry of Health. 
                        Health records are kept in a dual-locked safe cabinet and are returned to the family upon departure.
                      </>
                    ) : (
                      <>
                        ሁሉም አስገዳጅ የጤና ምርመራዎች (የሳንባ ነቀርሳ፣ ኤችአይቪ፣ ሄፓታይተስ) እጅግ ሚስጥራዊ ሆነው ይያዛሉ። 
                        እነዚህን ሰነዶች ማየት የሚችሉት የማቆያው ነርስ፣ አስተዳዳሪው እና የጤና ጥበቃ ሚኒስቴር ተቆጣጣሪዎች ብቻ ናቸው። 
                        ሁሉም የጤና መዛግብት በጥብቅ ቁልፍ ስር የሚቀመጡ ሲሆን ልጁ በሚሰረዝበት ጊዜ ለቤተሰቡ ይመለሳሉ።
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    {isEn ? '4. Security Log Audits' : '4. የደህንነት መዝገብ ቁጥጥር'}
                  </h4>
                  <p>
                    {isEn ? (
                      <>
                        Activity logs, including check-in/check-out times, authorized picking person names, and communication entries, are compiled for regulatory compliance. 
                        These database logs are reviewed weekly by our Security Compliance team. 
                        No parent data, emails, or phone numbers are shared or sold to third-party marketing services under any circumstances.
                      </>
                    ) : (
                      <>
                        የመግቢያ/መውጫ ሰዓት፣ ህጻናትን የተረከቡ ወላጆች ስም እና የመገናኛ ደብተር መዝገብ ለቁጥጥር ሲባል ይቀመጣሉ። 
                        እነዚህ የደህንነት ምዝግቦች በየሳምንቱ በደህንነት ቁጥጥር ክፍላችን ይገመገማሉ። 
                        የወላጆች የግል መረጃ፣ ኢሜይል ወይም የስልክ ቁጥሮች ለማንኛውም ሌላ አካል ተላልፈው አይሰጡም።
                      </>
                    )}
                  </p>
                </div>
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
