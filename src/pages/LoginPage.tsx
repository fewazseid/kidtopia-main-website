import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck, UserCircle, Users, Eye, EyeOff } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithGoogle, getUserRole, setUserRole, loginWithEmail, registerWithEmail, getAdminConfig, updateCurrentUserPassword } from '../firebase';

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
  const [showPassword, setShowPassword] = useState(false);

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
      let adminConfig = { username: 'admin', password: '123456', email: 'admin@kidtopiadaycare.com', firebasePassword: 'admin123' };
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
        emailToUse = adminConfig.email || 'admin@kidtopia.com';
        passToUse = password;
        fallbackPass = adminConfig.firebasePassword || 'admin123';
      } else if (!username.includes('@')) {
        // If it's a username without @, treat as internal email
        emailToUse = `${username.toLowerCase()}@kidtopia.com`;
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
          // If no role, check if it's the admin email from config
          if (user.email === adminConfig.email) {
            role = 'admin';
            await setUserRole(user.uid, role, user.email || '');
          } else {
            // Deny access if no role exists (user was deleted)
            throw new Error('Your account has been deactivated. Please contact the administrator.');
          }
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
      let adminConfig = { email: 'admin@kidtopiadaycare.com' };
      try {
        const remoteConfig = await getAdminConfig();
        adminConfig = { ...adminConfig, ...remoteConfig };
      } catch (e) {
        console.warn('Using default admin config for Google login check', e);
      }

      const isAdminEmail = user.email === adminConfig.email;
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all pr-12"
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
              className="w-full flex items-center justify-center gap-3 py-4 px-4 rounded-xl text-stone-700 font-bold text-lg transition-all hover:bg-stone-50 active:scale-[0.98] border border-stone-200 bg-white disabled:opacity-50"
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
