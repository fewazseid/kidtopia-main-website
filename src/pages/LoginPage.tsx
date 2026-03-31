import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../translations';
import { Link } from 'react-router-dom';

interface LoginPageProps {
  lang: Language;
}

export const LoginPage: React.FC<LoginPageProps> = ({ lang }) => {
  const t = translations[lang].login;
  const [role, setRole] = useState<'parent' | 'staff'>('parent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    console.log(`Logging in as ${role}`);
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="flex p-1 bg-stone-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setRole('parent')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  role === 'parent' 
                    ? 'bg-white text-brand-green shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <User size={18} />
                {t.parent}
              </button>
              <button
                type="button"
                onClick={() => setRole('staff')}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${
                  role === 'staff' 
                    ? 'bg-white text-brand-orange shadow-sm' 
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <ShieldCheck size={18} />
                {t.staff}
              </button>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                {t.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-stone-700">
                  {t.password}
                </label>
                <a href="#" className="text-xs font-medium text-brand-green hover:text-brand-orange transition-colors">
                  {t.forgotPassword}
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl text-white font-bold transition-all hover:opacity-90 active:scale-[0.98] ${
                role === 'parent' ? 'bg-brand-green' : 'bg-brand-orange'
              }`}
            >
              {t.submit}
            </button>
          </form>

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
