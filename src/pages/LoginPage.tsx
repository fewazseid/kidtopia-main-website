import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Language } from '../translations';
import { useContent } from '../ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithGoogle } from '../firebase';

interface LoginPageProps {
  lang: Language;
}

export const LoginPage: React.FC<LoginPageProps> = ({ lang }) => {
  const t = useContent(lang).login;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/admin');
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
                <span className="px-2 bg-white text-stone-500">Admin Access Only</span>
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
