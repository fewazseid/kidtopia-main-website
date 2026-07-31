/** Laravel Cloud is the only login / system dashboard. */
export const LARAVEL_LOGIN_URL =
  (import.meta as any).env?.VITE_LARAVEL_LOGIN_URL ||
  'https://kidtopia-main-u5x6pj.laravel.cloud/login';

export const redirectToLaravelLogin = () => {
  window.location.href = LARAVEL_LOGIN_URL;
};
