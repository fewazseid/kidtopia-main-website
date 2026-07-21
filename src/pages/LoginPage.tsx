import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck, UserCircle, Users, Eye, EyeOff, Download } from 'lucide-react';
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

  const [isAdminSelect, setIsAdminSelect] = useState(false);

  // Automatically invite user to download / install the app ONCE when entering the login page
  useEffect(() => {
    const isPwa = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const isDismissed = localStorage.getItem('kidtopia_install_prompt_dismissed') === 'true';

    if (!isPwa && !isDismissed) {
      const timer = setTimeout(() => {
        if (onOpenInstallModal) {
          onOpenInstallModal();
        } else {
          setIsModalOpen(true);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [onOpenInstallModal]);

  const handleRedirect = (role: string) => {
    if (role === 'admin') {
      setIsAdminSelect(true);
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

      // Enforce 6-digit password for non-admin shortcut if needed, 
      // but Firebase requires at least 6 chars anyway.
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
        // If it's a username without @, treat as internal email
        emailToUse = `${username.toLowerCase()}@kidtopiaet.com`;
      }

      console.log('DEBUG: Attempting login with:', emailToUse, 'password length:', passToUse.length);

      try {
        console.log('DEBUG: Attempting login with:', emailToUse);
        const result = await loginWithEmail(emailToUse, passToUse);
        user = result.user;
        console.log('DEBUG: Login successful for:', user.email);
      } catch (err: any) {
        console.log('DEBUG: Login failed, error code:', err.code, 'message:', err.message);
        
        // Migration logic: If they used the shortcut, and it failed, try the old fallback password
        if ((err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') && fallbackPass && password === adminConfig.password) {
          console.log('DEBUG: Attempting login with fallback password...');
          try {
            const fallbackResult = await loginWithEmail(emailToUse, fallbackPass);
            user = fallbackResult.user;
            console.log('DEBUG: Fallback login successful, updating password to match shortcut...');
            // Update the password to match what they typed (the shortcut password)
            await updateCurrentUserPassword(password);
          } catch (fallbackErr) {
            console.log('DEBUG: Fallback login also failed.');
          }
        }

        // If user doesn't exist and it's the admin attempt, try to register it once
        if (!user && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') && username.toLowerCase() === adminConfig.username.toLowerCase()) {
          console.log('DEBUG: User not found or invalid credential for admin shortcut, attempting registration/fix...');
          try {
            const result = await registerWithEmail(emailToUse, passToUse);
            user = result.user;
            console.log('DEBUG: Registration successful for:', user.email);
            await setUserRole(user.uid, 'admin', emailToUse);
          } catch (regErr: any) {
            // If registration fails because user already exists, it means the password was wrong
            if (regErr.code === 'auth/email-already-in-use') {
              console.log('DEBUG: Admin user already exists, re-throwing original login error.');
              throw err; // Re-throw the original login error
            }
            console.error('DEBUG: Registration failed:', regErr.code, regErr.message);
            throw regErr;
          }
        } else {
          throw err;
        }
      }

      if (user) {
        let role = await getUserRole(user.uid);
        if (!role) {
          // If no role, check if it's the admin email from config or hardcoded administrative emails
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
            // Deny access if no role exists (user was deleted)
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
      
      // Fetch dynamic admin config to check if this email is the configured admin
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
        <div className="bg-stone-900 text-white p-5 rounded-3xl border border-stone-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/15 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-3 bg-gradient-to-tr from-brand-orange to-brand-yellow rounded-2xl text-stone-950 font-black shrink-0 shadow-lg">
              <Download size={22} />
            </div>
            <div>
              <h4 className="font-display font-black text-sm sm:text-base text-white">
                {lang === 'en' ? 'Install Kidtopia App' : 'የኪድቶፒያ አፕሊኬሽን ጫን'}
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                {lang === 'en' ? 'Install on your device for fast 1-tap access.' : 'ለበለጠ ፍጥነት አፕሊኬሽኑን በስልክዎ ይጫኑ።'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenGuide}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-brand-orange via-brand-orange to-brand-yellow text-stone-950 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap z-10 border border-white/20"
          >
            <Download size={15} />
            <span>{lang === 'en' ? 'Install App' : 'አፕሊኬሽኑን ጫን'}</span>
          </button>
        </div>

        <div className="card-rounded p-8 sm:p-10">
          {isAdminSelect ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={36} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 mb-2">Welcome Back, Admin!</h1>
              <p className="text-stone-500 mb-8 max-w-sm mx-auto">Please choose your destination to continue.</p>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full py-4 px-4 bg-brand-green text-white rounded-xl font-bold text-lg transition-all hover:bg-brand-green/90 active:scale-[0.98] shadow-lg shadow-brand-green/10 flex items-center justify-center gap-2"
                >
                  Continue Website Editing
                </button>

                <a
                  href="https://kidtopia-main-u5x6pj.laravel.cloud/dashboard"
                  className="w-full py-4 px-4 bg-brand-orange text-white rounded-xl font-bold text-lg transition-all hover:bg-brand-orange/90 active:scale-[0.98] shadow-lg shadow-brand-orange/10 flex items-center justify-center gap-2 text-center"
                >
                  Continue to Dashboard
                </a>

                <button
                  onClick={() => setIsAdminSelect(false)}
                  className="w-full text-center text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors pt-4 block"
                >
                  Back to Sign In
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">{t.title}</h1>
                <p className="text-stone-500">{t.subtitle}</p>
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
                  className="w-full py-4 px-4 bg-brand-green text-white rounded-xl font-bold text-lg transition-all hover:bg-brand-green/90 active:scale-[0.98] disabled:opacity-50"
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
                  className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-xl text-stone-700 font-bold text-lg transition-all hover:bg-white/50 active:scale-[0.98] border border-white/60 bg-white/40 backdrop-blur-md shadow-sm disabled:opacity-50"
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
            </>
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
