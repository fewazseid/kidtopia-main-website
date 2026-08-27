import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../config';

type SeoConfig = {
  title: string;
  description: string;
  robots?: string;
};

const DEFAULT_DESCRIPTION =
  'Kidtopia International Daycare & Preschool in Addis Ababa — safe, bilingual early childhood care, programs, virtual tours, and easy enrollment for families.';

const PAGE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'Kidtopia International Daycare & Preschool | Addis Ababa',
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: 'About Kidtopia | International Daycare & Preschool',
    description:
      'Learn about Kidtopia’s mission, safety standards, and bilingual early childhood approach in Addis Ababa.',
  },
  '/programs': {
    title: 'Daycare & Preschool Programs | Kidtopia',
    description:
      'Explore Kidtopia age-based daycare and preschool programs designed for learning, play, and school readiness.',
  },
  '/virtual-tour': {
    title: 'Virtual Tour | Kidtopia International Daycare',
    description:
      'Take a virtual tour of Kidtopia classrooms and campus spaces before you visit in person.',
  },
  '/resources': {
    title: 'Parent Resources | Kidtopia',
    description:
      'Parent handbook, nutrition guidance, policies, and developmental resources from Kidtopia.',
  },
  '/testimonials': {
    title: 'Parent Testimonials | Kidtopia',
    description: 'Hear from families about their experience with Kidtopia International Daycare.',
  },
  '/contact': {
    title: 'Contact Kidtopia | Daycare in Addis Ababa',
    description: 'Contact Kidtopia International Daycare for questions, tours, and enrollment support.',
  },
  '/book-tour': {
    title: 'Book a Tour | Kidtopia International Daycare',
    description: 'Schedule an in-person or guided visit to Kidtopia International Daycare in Addis Ababa.',
  },
  '/enroll': {
    title: 'Enroll at Kidtopia | Online Enrollment Guide',
    description:
      'Prepare documents and continue to Kidtopia’s secure online enrollment form for daycare and preschool.',
  },
  '/login': {
    title: 'Login | Kidtopia',
    description: 'Sign in to the Kidtopia system dashboard.',
    robots: 'noindex, nofollow',
  },
  '/admin': {
    title: 'Website Admin | Kidtopia',
    description: 'Kidtopia website content management.',
    robots: 'noindex, nofollow',
  },
};

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const resolveSeo = (pathname: string): SeoConfig => {
  if (pathname.startsWith('/admin')) {
    return PAGE_SEO['/admin'];
  }
  if (pathname.startsWith('/reschedule')) {
    return {
      title: 'Reschedule Tour | Kidtopia',
      description: 'Reschedule your Kidtopia daycare tour appointment.',
      robots: 'noindex, nofollow',
    };
  }
  return (
    PAGE_SEO[pathname] || {
      title: 'Kidtopia International Daycare & Preschool',
      description: DEFAULT_DESCRIPTION,
    }
  );
};

/** Updates title, description, robots, canonical, and social tags on each route change. */
export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = resolveSeo(pathname);
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;

    document.title = seo.title;
    document.documentElement.lang = 'en';

    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', seo.robots || 'index, follow, max-image-preview:large');
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:image', `${SITE_URL}/favicon.png`);

    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', `${SITE_URL}/favicon.png`);
  }, [pathname]);

  return null;
}
