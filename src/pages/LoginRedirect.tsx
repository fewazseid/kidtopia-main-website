import { useEffect } from 'react';
import { redirectToLaravelLogin, LARAVEL_LOGIN_URL } from '../config';

/** Website no longer has its own login — send users to Laravel Cloud. */
export function LoginRedirect() {
  useEffect(() => {
    redirectToLaravelLogin();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
      <p className="text-sm text-stone-600">
        Redirecting to login…{' '}
        <a href={LARAVEL_LOGIN_URL} className="text-brand-green underline font-medium">
          Continue
        </a>
      </p>
    </div>
  );
}
