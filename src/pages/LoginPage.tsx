import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck, UserCircle, Users, Eye, EyeOff, Download, Globe, LayoutDashboard, ArrowLeft, ExternalLink, Edit3 } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithGoogle, getUserRole, setUserRole, loginWithEmail, registerWithEmail, getAdminConfig, updateCurrentUserPassword } from '../firebase';
import { InstallAppModal } from '../components/InstallAppModal';

interface LoginPageProps {
  lang: Language;
  onOpenInstallModal?: () => void;
}

type Role = 'admin' | 'staff' | 'parent';

export const LoginPage: React.FC<LoginPageProps> = ({ lang, onOpenInstallModal }) => {
  const t = useContent(lang).login;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 'select' mode by default: choose between Website Editing vs Dashboard
  const [portalMode, setPortalMode] = useState<'select' | 'website_login'>('select');
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const installed = window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true ||
        localStorage.getItem('kidtopia_app_installed') === 'true';
      setIsAppInstalled(installed);
    };

    checkInstalled();
    window.addEventListener('appinstalled', checkInstalled);
    window.addEventListener('storage', checkInstalled);
    return () => {
      window.removeEventListener('appinstalled', checkInstalled);
      window.removeEventListener('storage', checkInstalled);
    };
  }, []);

  // Auto popup timer disabled
  useEffect(() => {
    // Disabled auto modal trigger
  }, []);

  const handleRedirect = (role: string) => {
    if (role === 'admin') {
      navigate('/admin');
      return;
    }
    setError('Access Denied. Only administrator accounts are authorized to log in.');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let user;
      let emailToUse = username;
      let passToUse = password;

      // Fetch dynamic admin config
      let adminConfig = { username: 'admin', password: '123456', email: 'admin@kidtopiaet.com', firebasePassword: 'admin123' };
      try {
        const remoteConfig = await getAdminConfig();
        adminConfig = { ...adminConfig, ...remoteConfig };
      } catch (e) {
        console.warn('Using default admin config', e);
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Handle dynamic admin shortcut
      let fallbackPass = '';
      if (username.toLowerCase() === adminConfig.username.toLowerCase()) {
        emailToUse = adminConfig.email || 'admin@kidtopiaet.com';
        passToUse = password;
        fallbackPass = adminConfig.firebasePassword || 'admin123';
      } else if (!username.includes('@')) {
        emailToUse = `${username.toLowerCase()}@kidtopiaet.com`;
      }

      try {
        const result = await loginWithEmail(emailToUse, passToUse);
        user = result.user;
      } catch (err: any) {
        if ((err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') && fallbackPass && password === adminConfig.password) {
          try {
            const fallbackResult = await loginWithEmail(emailToUse, fallbackPass);
            user = fallbackResult.user;
            await updateCurrentUserPassword(password);
          } catch (fallbackErr) {
            console.log('DEBUG: Fallback login failed.');
          }
        }

        if (!user && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && username.toLowerCase() === adminConfig.username.toLowerCase()) {
          try {
            const result = await registerWithEmail(emailToUse, passToUse);
            user = result.user;
            await setUserRole(user.uid, 'admin', emailToUse);
          } catch (regErr: any) {
            if (regErr.code === 'auth/email-already-in-use') {
              throw err;
            }
            throw regErr;
          }
        } else {
          throw err;
        }
      }

      if (user) {
        let role = await getUserRole(user.uid);
        if (!role) {
          if (user.email === adminConfig.email || 
              user.email === 'admin@kidtopiaet.com' || 
              user.email === 'fewazseidahmed@gmail.com' ||
              user.email === 'system_worker@kidtopiaet.internal' ||
              user.email === 'system_worker_v2@kidtopiaet.internal' ||
              user.email === 'system_worker_v4@kidtopiaet.internal' ||
              user.email === 'system_worker_v5@kidtopiaet.internal' ||
              user.email?.endsWith('@kidtopiaet.internal')) {
            role = 'admin';
            await setUserRole(user.uid, role, user.email || '');
          } else {
            throw new Error('Your account has been deactivated. Please contact the administrator.');
          }
        }
        if (role !== 'admin') {
          throw new Error('Access Denied. Only administrator accounts are authorized to log in.');
        }
        handleRedirect(role);
      }
    } catch (err: any) {
      let msg = 'Incorrect username or password. Please try again.';
      
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password login is currently disabled in Firebase Console. Please enable it under Authentication > Sign-in method.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect username or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'The username or email format is invalid.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please try again later.';
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      const user = result.user;
      
      let adminConfig = { email: 'admin@kidtopiaet.com' };
      try {
        const remoteConfig = await getAdminConfig();
        adminConfig = { ...adminConfig, ...remoteConfig };
      } catch (e) {
        console.warn('Using default admin config for Google login check', e);
      }

      const isAdminEmail = user.email === adminConfig.email || 
                           user.email === 'admin@kidtopiaet.com' || 
                           user.email === 'fewazseidahmed@gmail.com' ||
                           user.email?.endsWith('@kidtopiaet.internal');
      let role = await getUserRole(user.uid);
      
      if (!role) {
        if (isAdminEmail) {
          role = 'admin';
          await setUserRole(user.uid, role, user.email || '');
        } else {
          throw new Error('Access Denied. Only administrator accounts are authorized to log in.');
        }
      } else if (role !== 'admin') {
        throw new Error('Access Denied. Only administrator accounts are authorized to log in.');
      }
      handleRedirect(role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGuide = () => {
    if (onOpenInstallModal) {
      onOpenInstallModal();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <main className="pt-28 pb-24 min-h-screen flex items-center justify-center bg-transparent px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg space-y-6"
      >
        {/* Prominent Install App Banner at the VERY TOP of Login Page */}
        <div className="bg-brand-cream text-stone-800 p-5 rounded-[28px] border border-stone-200/90 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-3 bg-white border border-stone-200/80 rounded-2xl text-brand-green font-black shrink-0 shadow-sm">
              <Download size={22} />
            </div>
            <div>
              <h4 className="font-display font-black text-sm sm:text-base text-stone-900">
                {lang === 'en' ? 'Install Kidtopia App' : 'የኪድቶፒያ አፕሊኬሽን ጫን'}
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                {lang === 'en' ? 'Install on your device for fast 1-tap access.' : 'ለበለጠ ፍጥነት አፕሊኬሽኑን በስልክዎ ይጫኑ።'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenGuide}
            className="w-full sm:w-auto px-5 py-3 bg-brand-green hover:bg-brand-green/90 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap z-10 border border-brand-green/30"
          >
            <Download size={15} />
            <span>{lang === 'en' ? 'Install App' : 'አፕሊኬሽኑን ጫን'}</span>
          </button>
        </div>

        <div className="card-rounded p-8 sm:p-10">
          {portalMode === 'select' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-center"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mb-2">
                  {lang === 'en' ? 'Choose Destination' : 'መዳረሻ ይምረጡ'}
                </h1>
                <p className="text-stone-500 text-sm">
                  {lang === 'en' 
                    ? 'Select whether you want to edit website content or open the Kidtopia Dashboard.' 
                    : 'የድረ-ገፁን ይዘት ለማስተካከል ወይም ወደ ኪድቶፒያ ዳሽቦርድ ለመሄድ ይምረጡ።'}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Option 1: Website Editing */}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setPortalMode('website_login');
                  }}
                  className="w-full p-5 bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-brand-green rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex items-start gap-4 group cursor-pointer"
                >
                  <div className="p-3 bg-brand-green/10 text-brand-green rounded-xl group-hover:bg-brand-green group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Edit3 size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-stone-900 text-base sm:text-lg group-hover:text-brand-green transition-colors">
                        {lang === 'en' ? 'Website Editing' : 'የድረ-ገጽ ማስተካከያ'}
                      </h3>
                      <span className="text-xs font-bold text-stone-400 group-hover:text-brand-green transition-colors">
                        →
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {lang === 'en' 
                        ? 'Admin sign in required to update programs, gallery, daily schedules & parent resources.' 
                        : 'የድረ-ገፅ ይዘቶችን ለማስተካከል የአድሚን መግቢያ ያስፈልጋል።'}
                    </p>
                  </div>
                </button>

                {/* Option 2: Kidtopia Dashboard */}
                <a
                  href="https://kidtopia-main-u5x6pj.laravel.cloud/login"
                  className="w-full p-5 bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-brand-orange rounded-2xl shadow-sm hover:shadow-md transition-all text-left flex items-start gap-4 group cursor-pointer block"
                >
                  <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl group-hover:bg-brand-orange group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <LayoutDashboard size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-stone-900 text-base sm:text-lg group-hover:text-brand-orange transition-colors flex items-center gap-1.5">
                        {lang === 'en' ? 'Kidtopia Dashboard' : 'የኪድቶፒያ ዳሽቦርድ'}
                        <ExternalLink size={14} className="opacity-60" />
                      </h3>
                      <span className="text-xs font-bold text-stone-400 group-hover:text-brand-orange transition-colors">
                        →
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {lang === 'en' 
                        ? 'Open student records, staff portal, attendance, and administrative dashboard.' 
                        : 'ወደ ተማሪዎች ዝርዝር፣ ሰራተኞች እና ዋና ዳሽቦርድ ይሂዱ።'}
                    </p>
                  </div>
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setPortalMode('select');
                }}
                className="mb-6 flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-green transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>{lang === 'en' ? 'Back to Selection' : 'ወደ መምረጫው ተመለስ'}</span>
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Globe size={24} />
                </div>
                <h1 className="text-2xl font-bold text-stone-900 mb-1">
                  {lang === 'en' ? 'Website Editing Sign In' : 'የድረ-ገጽ ማስተካከያ መግቢያ'}
                </h1>
                <p className="text-xs text-stone-500">
                  {lang === 'en' ? 'Sign in with administrator account to edit website' : 'ድረ-ገጹን ለማስተካከል በአድሚን መለያ ይግቡ'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                    <User size={16} />
                    Username / Email
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input-ios outline-none transition-all text-stone-900"
                    placeholder="Enter username or email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                    <Lock size={16} />
                    {t.password}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input-ios outline-none transition-all pr-12 text-stone-900"
                      placeholder="6-digit password"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand-green transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 bg-brand-green text-white rounded-xl font-bold text-lg transition-all hover:bg-brand-green/90 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Processing...' : t.submit}
                </button>
              </form>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/35"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-stone-500 font-bold bg-transparent">OR</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-xl text-stone-700 font-bold text-lg transition-all hover:bg-white/50 active:scale-[0.98] border border-white/60 bg-white/40 backdrop-blur-md shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Login with Google
                </button>
              </div>

              <div className="mt-8 text-center text-sm text-stone-500">
                <p>
                  {t.noAccount}{' '}
                  <Link to="/contact" className="font-medium text-brand-green hover:text-brand-orange transition-colors">
                    {t.contactUs}
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Direct Download Action Modal */}
      <InstallAppModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
      />
    </main>
  );
};

