// DesignVault — Smart Section Suggestions
// Maps website types to standard page/section architecture.
// This is deterministic knowledge, not heuristic guessing.

const WEB_TYPES = {
  landing: {
    label: 'Landing Page',
    keywords: ['landing', 'homepage', 'home page', 'one-page', 'single page'],
    sections: [
      { id: 'hero', label: 'Hero Section', desc: 'Headline, subline, primary CTA, optional visual/image' },
      { id: 'social-proof', label: 'Social Proof Bar', desc: 'Logo cloud, trust badges, "as seen in"' },
      { id: 'features', label: 'Features Grid', desc: 'Icon + title + description cards, usually 3-4 columns' },
      { id: 'how-it-works', label: 'How It Works', desc: 'Numbered steps or process flow, usually 3 steps' },
      { id: 'benefits', label: 'Benefits Section', desc: 'Value propositions with supporting visuals' },
      { id: 'testimonials', label: 'Testimonials', desc: 'Customer quotes with avatar, name, role' },
      { id: 'pricing', label: 'Pricing Table', desc: 'Tiered pricing cards with feature comparison' },
      { id: 'faq', label: 'FAQ Accordion', desc: 'Collapsible Q&A section' },
      { id: 'cta-final', label: 'Final CTA', desc: 'Bottom conversion section with headline + button' },
      { id: 'footer', label: 'Footer', desc: 'Links, legal, social icons, newsletter signup' },
    ],
  },
  saas: {
    label: 'SaaS Product',
    keywords: ['saas', 'software', 'app', 'platform', 'tool', 'product'],
    sections: [
      { id: 'hero', label: 'Hero Section', desc: 'Product headline, value prop, CTA, product screenshot/demo' },
      { id: 'social-proof', label: 'Social Proof', desc: 'Logo cloud, user count, ratings' },
      { id: 'features', label: 'Feature Showcase', desc: 'Alternating image+text blocks or tabbed feature grid' },
      { id: 'integrations', label: 'Integrations', desc: 'Logo grid of connected tools/services' },
      { id: 'use-cases', label: 'Use Cases', desc: 'Tabbed or segmented by audience (developers, marketers, etc.)' },
      { id: 'testimonials', label: 'Testimonials', desc: 'Customer stories with metrics/results' },
      { id: 'pricing', label: 'Pricing', desc: 'Monthly/annual toggle, tier cards, feature comparison' },
      { id: 'faq', label: 'FAQ', desc: 'Common objections addressed' },
      { id: 'cta-final', label: 'CTA Section', desc: 'Free trial or demo request with urgency' },
      { id: 'footer', label: 'Footer', desc: 'Product links, resources, legal, social' },
    ],
  },
  ecommerce: {
    label: 'E-Commerce',
    keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'retail', 'product'],
    sections: [
      { id: 'hero', label: 'Hero Banner', desc: 'Seasonal promo, featured collection, CTA' },
      { id: 'categories', label: 'Category Grid', desc: 'Visual category cards with images' },
      { id: 'featured-products', label: 'Featured Products', desc: 'Product cards with image, price, rating, add-to-cart' },
      { id: 'promo-banner', label: 'Promo Banner', desc: 'Sale countdown, discount code, limited offer' },
      { id: 'bestsellers', label: 'Bestsellers', desc: 'Carousel or grid of top-selling items' },
      { id: 'testimonials', label: 'Reviews', desc: 'Customer reviews with star rating' },
      { id: 'newsletter', label: 'Newsletter Signup', desc: 'Email capture with incentive (discount code)' },
      { id: 'trust', label: 'Trust Signals', desc: 'Free shipping, money-back guarantee, secure payment icons' },
      { id: 'footer', label: 'Footer', desc: 'Shop links, customer service, payment methods, social' },
    ],
  },
  portfolio: {
    label: 'Portfolio / Agency',
    keywords: ['portfolio', 'agency', 'freelance', 'studio', 'creative', 'designer'],
    sections: [
      { id: 'hero', label: 'Hero Introduction', desc: 'Name/brand, tagline, visual statement' },
      { id: 'work-grid', label: 'Work / Projects Grid', desc: 'Filterable project cards with hover preview' },
      { id: 'about', label: 'About Section', desc: 'Bio, philosophy, photo/avatar' },
      { id: 'services', label: 'Services', desc: 'What you offer, icon + description cards' },
      { id: 'process', label: 'Process', desc: 'How you work, step-by-step methodology' },
      { id: 'testimonials', label: 'Client Testimonials', desc: 'Quotes from past clients' },
      { id: 'contact', label: 'Contact', desc: 'Form, email, calendar booking link' },
      { id: 'footer', label: 'Footer', desc: 'Social links, legal, credits' },
    ],
  },
  blog: {
    label: 'Blog / Content',
    keywords: ['blog', 'magazine', 'news', 'content', 'article', 'editorial'],
    sections: [
      { id: 'hero', label: 'Featured Article', desc: 'Large hero card for latest/pinned post' },
      { id: 'article-grid', label: 'Article Grid', desc: 'Card layout with thumbnail, title, excerpt, date, tags' },
      { id: 'categories', label: 'Category Navigation', desc: 'Filter chips or sidebar category list' },
      { id: 'newsletter', label: 'Newsletter CTA', desc: 'Email subscription with preview of content type' },
      { id: 'sidebar', label: 'Sidebar', desc: 'Popular posts, tags cloud, about widget' },
      { id: 'author', label: 'Author Section', desc: 'Bio, avatar, social links' },
      { id: 'footer', label: 'Footer', desc: 'Archive links, categories, legal' },
    ],
  },
  dashboard: {
    label: 'Dashboard / Admin',
    keywords: ['dashboard', 'admin', 'panel', 'analytics', 'crm', 'management'],
    sections: [
      { id: 'sidebar-nav', label: 'Sidebar Navigation', desc: 'Collapsible nav with icons, nested items' },
      { id: 'top-bar', label: 'Top Bar', desc: 'Search, notifications, user avatar, breadcrumb' },
      { id: 'stats-row', label: 'Stats Overview', desc: 'KPI cards with number, trend arrow, sparkline' },
      { id: 'main-chart', label: 'Main Chart', desc: 'Primary data visualization (line/bar/area chart)' },
      { id: 'data-table', label: 'Data Table', desc: 'Sortable/filterable table with pagination' },
      { id: 'activity-feed', label: 'Activity Feed', desc: 'Recent actions/events timeline' },
      { id: 'quick-actions', label: 'Quick Actions', desc: 'Shortcut buttons for common tasks' },
    ],
  },
  restaurant: {
    label: 'Restaurant / F&B',
    keywords: ['restaurant', 'cafe', 'food', 'menu', 'dining', 'catering', 'bakery'],
    sections: [
      { id: 'hero', label: 'Hero', desc: 'Atmospheric photo, tagline, reservation CTA' },
      { id: 'menu', label: 'Menu Section', desc: 'Categorized items with price, description, dietary tags' },
      { id: 'about', label: 'About / Story', desc: 'Chef bio, restaurant philosophy, atmosphere photos' },
      { id: 'gallery', label: 'Photo Gallery', desc: 'Food photography, interior shots' },
      { id: 'testimonials', label: 'Reviews', desc: 'Customer reviews, Google/Yelp rating embed' },
      { id: 'reservation', label: 'Reservation', desc: 'Date/time picker, party size, contact form' },
      { id: 'location', label: 'Location & Hours', desc: 'Map embed, address, opening hours' },
      { id: 'footer', label: 'Footer', desc: 'Hours, social links, contact info' },
    ],
  },
  corporate: {
    label: 'Corporate / Business',
    keywords: ['corporate', 'business', 'company', 'enterprise', 'consulting', 'firm', 'furniture'],
    sections: [
      { id: 'hero', label: 'Hero Section', desc: 'Brand statement, visual, primary CTA' },
      { id: 'about', label: 'About / Mission', desc: 'Company story, values, vision' },
      { id: 'services', label: 'Services / Solutions', desc: 'Service cards with descriptions' },
      { id: 'stats', label: 'Stats / Numbers', desc: 'Key metrics, achievements, counter animations' },
      { id: 'portfolio', label: 'Portfolio / Clients', desc: 'Case studies, client logos, project highlights' },
      { id: 'team', label: 'Team Section', desc: 'Team member cards with photo, role, social' },
      { id: 'testimonials', label: 'Testimonials', desc: 'Client quotes, case study results' },
      { id: 'cta-final', label: 'Contact CTA', desc: 'Get in touch, request quote, schedule call' },
      { id: 'footer', label: 'Footer', desc: 'Office locations, legal, newsletter, social' },
    ],
  },
};

/**
 * Analyze use case text and return matching web type + suggested sections.
 * @param {string} text - The use case description
 * @returns {{ type: object|null, sections: Array, allTypes: Array }}
 */
export function suggestSections(text) {
  const lower = (text || '').toLowerCase();
  const allTypes = Object.values(WEB_TYPES);

  if (!lower) return { type: null, sections: [], allTypes };

  // Score each type by keyword matches
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, typeData] of Object.entries(WEB_TYPES)) {
    let score = 0;
    for (const kw of typeData.keywords) {
      if (lower.includes(kw)) score += kw.length; // longer match = higher confidence
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { key, ...typeData };
    }
  }

  if (bestMatch && bestScore > 0) {
    return {
      type: bestMatch,
      sections: bestMatch.sections,
      allTypes,
    };
  }

  // Fallback: return landing page sections as default
  return {
    type: { key: 'landing', ...WEB_TYPES.landing },
    sections: WEB_TYPES.landing.sections,
    allTypes,
  };
}

/**
 * Format selected sections into a prompt-ready list.
 * @param {Array} sections - Array of section objects with id, label, desc
 * @returns {string}
 */
export function formatSectionsForPrompt(sections) {
  if (!sections.length) return '';
  return sections.map((s, i) =>
    `${i + 1}. **${s.label}** — ${s.desc}`
  ).join('\n');
}
