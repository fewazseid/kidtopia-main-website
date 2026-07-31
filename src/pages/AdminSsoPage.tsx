import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithCustomToken, getUserRole, logout } from '../firebase';
import { LARAVEL_LOGIN_URL } from '../config';

/**
 * Receives a Firebase custom token from Laravel "Manage Website"
 * and signs the admin into this CMS.
 * Expected URL: /admin/sso?token=...
 */
export const AdminSsoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setError('Missing access token. Open Manage Website from the Laravel admin dashboard.');
        return;
      }

      try {
        const credential = await loginWithCustomToken(token);
        const role = await getUserRole(credential.user.uid);

        if (cancelled) return;

        if (role !== 'admin') {
          await logout();
          setError('This account is not authorized to edit the website.');
          return;
        }

        // Drop token from the address bar
        navigate('/admin', { replace: true });
      } catch (err: any) {
        if (cancelled) return;
        console.error('SSO sign-in failed', err);
        setError(err?.message || 'Sign-in failed. Please try Manage Website again from Laravel.');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-brand-cream/40">
      {error ? (
        <div className="max-w-md w-full text-center space-y-4 card-rounded p-8 bg-white/80">
          <h1 className="text-xl font-bold text-stone-900">Website access failed</h1>
          <p className="text-sm text-stone-600">{error}</p>
          <a
            href={LARAVEL_LOGIN_URL}
            className="inline-block mt-2 px-6 py-2.5 rounded-full bg-brand-green text-white font-bold text-sm hover:opacity-90"
          >
            Go to Laravel login
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
          <p className="text-sm text-stone-600 font-medium">Signing you into the website editor…</p>
        </div>
      )}
    </div>
  );
};
