import { AITool, PageRoute, ToolCategory } from '../types';

const SITE_NAME = 'AI Directory — Zmpto Tool';
const BASE_URL = 'https://zmpto.ai';

const META: Record<PageRoute, { title: string; description: string }> = {
  home: {
    title: 'AI Tools & Autonomous Agent Directory',
    description: 'Discover, compare, and benchmark AI tools and autonomous agents with ratings, features, pricing, and independent reviews.'
  },
  'all-tools': {
    title: 'All AI Tools Directory',
    description: 'Browse curated AI tools for coding, writing, design, research, productivity, and audio.'
  },
  'best-ai-tools': {
    title: 'Best AI Tools & Buyer Guides',
    description: 'Explore expert rankings and buyer guides for the best AI tools across popular categories.'
  },
  compare: {
    title: 'Compare AI Tools',
    description: 'Compare AI tools side by side by features, pricing, benchmarks, strengths, and weaknesses.'
  },
  'submit-tool': {
    title: 'Submit an AI Tool',
    description: 'Submit an AI tool to the Zmpto Tool AI Directory for review and publication.'
  },
  about: {
    title: 'About AI Directory',
    description: 'Learn about the AI Directory editorial standards, review process, and commitment to independent analysis.'
  },
  contact: {
    title: 'Contact AI Directory',
    description: 'Contact the Zmpto Tool team about listings, partnerships, corrections, and general questions.'
  },
  'affiliate-disclosure': {
    title: 'Affiliate Disclosure',
    description: 'Read the affiliate and sponsorship disclosure for the Zmpto Tool AI Directory.'
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Review how Zmpto Tool AI Directory handles privacy and personal data.'
  },
  'terms-of-use': {
    title: 'Terms of Use',
    description: 'Review the terms governing use of Zmpto Tool AI Directory.'
  },
  'tool-details': {
    title: 'AI Tool Review',
    description: 'Read an in-depth AI tool review covering features, pricing, pros, cons, and benchmarks.'
  },
  category: {
    title: 'AI Tools by Category',
    description: 'Browse AI tools grouped by category and use case.'
  }
};

const setMeta = (selector: string, value: string, attribute = 'name') => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${selector}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, selector);
    document.head.appendChild(element);
  }
  element.content = value;
};

const setJsonLd = (data: object) => {
  let script = document.head.querySelector<HTMLScriptElement>('script[data-seo-jsonld]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoJsonld = 'true';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export function getCategorySlug(category: ToolCategory): string {
  return category.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function updateSeo(options: {
  route: PageRoute;
  tool?: AITool;
  category?: ToolCategory;
  compareA?: AITool;
  compareB?: AITool;
}) {
  const { route, tool, category, compareA, compareB } = options;
  let meta = META[route];

  if (route === 'tool-details' && tool) {
    meta = {
      title: `${tool.name} Review, Features & Pricing`,
      description: `${tool.tagline}. Explore pricing, pros, cons, features, and benchmarks for ${tool.name}.`
    };
  } else if (route === 'category' && category) {
    meta = {
      title: `Best ${category} AI Tools`,
      description: `Discover and compare the best ${category.toLowerCase()} AI tools, features, ratings, and pricing.`
    };
  } else if (route === 'compare' && compareA && compareB) {
    meta = {
      title: `${compareA.name} vs ${compareB.name}: Comparison`,
      description: `Compare ${compareA.name} and ${compareB.name} on features, pricing, ratings, pros, and cons.`
    };
  }

  const title = `${meta.title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${window.location.pathname}${window.location.search}`;

  document.title = title;
  setMeta('description', meta.description);
  setMeta('robots', 'index, follow, max-image-preview:large');
  setMeta('og:title', title, 'property');
  setMeta('og:description', meta.description, 'property');
  setMeta('og:type', 'website', 'property');
  setMeta('og:url', canonical, 'property');
  setMeta('og:site_name', SITE_NAME, 'property');
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', meta.description);

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonical;

  if (route === 'tool-details' && tool) {
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      applicationCategory: tool.category,
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: tool.pricing === 'Free' ? '0' : undefined, priceCurrency: 'USD' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: tool.rating, reviewCount: tool.reviewCount }
    });
  } else if (route === 'compare' && compareA && compareB) {
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${compareA.name} vs ${compareB.name}`,
      itemListElement: [compareA, compareB].map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        description: item.description
      }))
    });
  } else {
    setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: 'Zmpto Tool AI Directory',
      url: BASE_URL,
      description: 'Curated AI tools directory with reviews, pricing, comparisons, and benchmarks.'
    });
  }
}
