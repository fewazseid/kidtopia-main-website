/**
 * Cross-app URLs (website ↔ Laravel system).
 * Set VITE_LARAVEL_APP_URL once; path overrides are optional.
 */
const env = (import.meta as any).env;

const trimSlash = (value: string) => value.replace(/\/$/, '');

/** Public marketing website origin (no trailing slash). */
export const SITE_URL = trimSlash(
  env?.VITE_SITE_URL || 'https://kidtopiainternational.com',
);

const DEFAULT_LARAVEL_APP_URL = 'https://app.kidtopiainternational.com';

/** Laravel system origin (no trailing slash). */
export const LARAVEL_APP_URL = trimSlash(
  env?.VITE_LARAVEL_APP_URL || DEFAULT_LARAVEL_APP_URL,
);

/** Laravel login page. */
export const LARAVEL_LOGIN_URL =
  env?.VITE_LARAVEL_LOGIN_URL || `${LARAVEL_APP_URL}/login`;

/** Laravel public enrollment form. */
export const LARAVEL_ENROLL_URL =
  env?.VITE_LARAVEL_ENROLL_URL || `${LARAVEL_APP_URL}/enroll`;

/**
 * Laravel API origin for browser calls (mail bridge, etc.).
 * Defaults to LARAVEL_APP_URL.
 */
export const LARAVEL_API_URL = trimSlash(
  env?.VITE_LARAVEL_API_URL || LARAVEL_APP_URL,
);

/** Shared with Laravel WEBSITE_MAIL_TOKEN. */
export const WEBSITE_MAIL_TOKEN = (env?.VITE_WEBSITE_MAIL_TOKEN || '') as string;

export const redirectToLaravelLogin = () => {
  window.location.href = LARAVEL_LOGIN_URL;
};

export const redirectToLaravelEnroll = () => {
  window.location.href = LARAVEL_ENROLL_URL;
};
