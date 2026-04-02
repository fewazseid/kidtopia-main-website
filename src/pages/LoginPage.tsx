import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck, UserCircle, Users } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithGoogle, getUserRole, setUserRole, loginWithEmail, registerWithEmail, getAdminConfig } from '../firebase';

interface LoginPageProps {
  lang: Language;
}

type Role = 'admin' | 'staff' | 'parent';

export const LoginPage: React.FC<LoginPageProps> = ({ lang }) => {
  const t = useContent(lang).login;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRedirect = (role: string) => {
    switch (role) {
      case 'admin': navigate('/admin'); break;
      case 'staff': navigate('/staff'); break;
      case 'parent': navigate('/parent'); break;
      default: navigate('/');
    }
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
      let adminConfig = { username: 'admin', password: 'admin', email: 'admin@kidtopia.com', firebasePassword: 'admin123' };
      try {
        const remoteConfig = await getAdminConfig();
        adminConfig = { ...adminConfig, ...remoteConfig };
      } catch (e) {
        console.warn('Using default admin config', e);
      }

      // Handle dynamic admin shortcut
      if (username.toLowerCase() === adminConfig.username.toLowerCase() && password === adminConfig.password) {
        emailToUse = adminConfig.email;
        passToUse = adminConfig.firebasePassword || 'admin123';
      } else if (!username.includes('@')) {
        // If it's a username without @, treat as internal email
        emailToUse = `${username.toLowerCase()}@kidtopia.com`;
      }

      console.log('DEBUG: Attempting login with:', emailToUse, 'password length:', passToUse.length);

      try {
        const result = await loginWithEmail(emailToUse, passToUse);
        user = result.user;
      } catch (err: any) {
        console.log('DEBUG: Login failed, error code:', err.code);
        // If user doesn't exist and it's the admin attempt, try to register it once
        if (err.code === 'auth/user-not-found' && username.toLowerCase() === adminConfig.username.toLowerCase()) {
          console.log('DEBUG: User not found, attempting registration...');
          const result = await registerWithEmail(emailToUse, passToUse);
          user = result.user;
          await setUserRole(user.uid, 'admin', emailToUse);
        } else {
          throw err;
        }
      }

      if (user) {
        let role = await getUserRole(user.uid);
        if (!role) {
          // Default role for new users
          role = user.email === adminConfig.email || user.email === 'fewazseidahmed@gmail.com' ? 'admin' : 'parent';
          await setUserRole(user.uid, role, user.email || '');
        }
        handleRedirect(role);
      }
    } catch (err: any) {
      let msg = err.message === 'auth/invalid-credential' ? 'Invalid username or password' : err.message;
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password login is currently disabled in Firebase Console. Please enable it under Authentication > Sign-in method.';
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
      const isAdminEmail = user.email === 'fewazseidahmed@gmail.com';
      let role = await getUserRole(user.uid);
      
      if (!role) {
        role = isAdminEmail ? 'admin' : 'parent';
        await setUserRole(user.uid, role, user.email || '');
      }
      handleRedirect(role);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="card-rounded p-8 sm:p-10">
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
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                placeholder="Enter username or email"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <Lock size={16} />
                {t.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand-green text-white rounded-xl font-bold transition-all hover:bg-brand-green/90 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : t.submit}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-500">OR</span>
            </div>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-stone-700 font-bold transition-all hover:bg-stone-50 active:scale-[0.98] border border-stone-200 bg-white disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Login with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-stone-500">Secure Access</span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-stone-500">
            <p>
              {t.noAccount}{' '}
              <Link to="/contact" className="font-medium text-brand-green hover:text-brand-orange transition-colors">
                {t.contactUs}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
};
