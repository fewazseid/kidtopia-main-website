import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck, UserCircle, Users } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithGoogle, getUserRole, setUserRole } from '../firebase';

interface LoginPageProps {
  lang: Language;
}

type Role = 'admin' | 'staff' | 'parent';

export const LoginPage: React.FC<LoginPageProps> = ({ lang }) => {
  const t = useContent(lang).login;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('parent');

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginWithGoogle();
      const user = result.user;
      
      // Check if user is the hardcoded admin
      const isAdminEmail = user.email === 'fewazseidahmed@gmail.com';
      
      let role = await getUserRole(user.uid);
      
      if (!role) {
        // New user, assign selected role (unless they are the admin email)
        role = isAdminEmail ? 'admin' : selectedRole;
        await setUserRole(user.uid, role, user.email || '');
      } else if (isAdminEmail && role !== 'admin') {
        // Force admin role for the admin email
        role = 'admin';
        await setUserRole(user.uid, 'admin', user.email || '');
      }

      // Redirect based on role
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'staff':
          navigate('/staff');
          break;
        case 'parent':
          navigate('/parent');
          break;
        default:
          navigate('/');
      }
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

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-stone-700 flex items-center gap-2">
                <User size={16} />
                {t.role}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-2 ${
                    selectedRole === 'admin' 
                      ? 'bg-brand-green text-white border-brand-green shadow-lg shadow-brand-green/20' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-brand-green'
                  }`}
                >
                  <ShieldCheck size={18} />
                  {(t as any).admin || 'Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('staff')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-2 ${
                    selectedRole === 'staff' 
                      ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/20' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-brand-orange'
                  }`}
                >
                  <UserCircle size={18} />
                  {t.staff}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('parent')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center gap-2 ${
                    selectedRole === 'parent' 
                      ? 'bg-brand-teal text-white border-brand-teal shadow-lg shadow-brand-teal/20' 
                      : 'bg-white text-stone-600 border-stone-200 hover:border-brand-teal'
                  }`}
                >
                  <Users size={18} />
                  {t.parent}
                </button>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-stone-700 font-bold transition-all hover:bg-stone-50 active:scale-[0.98] border border-stone-200 bg-white disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {loading ? 'Logging in...' : 'Login with Google'}
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
