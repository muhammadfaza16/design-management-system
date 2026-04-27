// DesignVault — Knowledge Base Core
// Hardcoded design principles acting as both user documentation and AI prompt directives.

export const KNOWLEDGE_BANK = [

  // ==========================================
  // LAYOUT & COMPOSITION
  // ==========================================
  {
    id: 'k-8px-grid',
    category: 'Layout & Composition',
    title: '8px Spatial System',
    description: 'All dimensions, padding, margins, and gaps use base-8 increments (8, 16, 24, 32, 48, 64, 96). This guarantees pixel-perfect alignment on all screens and creates consistent visual rhythm across every component.',
    aiPrompt: 'SPACING CONSTRAINT: Strictly use an 8px spatial grid. All paddings, margins, gaps, widths, and heights MUST be multiples of 8 (8, 16, 24, 32, 48, 64, 96px). Never use arbitrary values like 5px, 15px, or 20px. Use 4px only for micro-adjustments (icon padding, border offsets).'
  },
  {
    id: 'k-golden-ratio',
    category: 'Layout & Composition',
    title: 'Golden Ratio Proportions',
    description: 'The ratio 1:1.618 produces naturally pleasing divisions. Apply it to sidebar vs main content widths, hero image vs text areas, and card aspect ratios for layouts that feel balanced without effort.',
    aiPrompt: 'PROPORTION CONSTRAINT: Apply the Golden Ratio (1:1.618) to major layout divisions. Two-column layouts should split ~38% / ~62%. Hero sections should divide text and media at this ratio. Card aspect ratios should approximate 1:1.618 or 1:1.414 (silver ratio).'
  },
  {
    id: 'k-visual-balance',
    category: 'Layout & Composition',
    title: 'Asymmetric Visual Balance',
    description: 'Symmetry is stable but boring. Offset layouts — a large element on one side balanced by multiple smaller elements on the other — create dynamic, modern compositions that still feel stable.',
    aiPrompt: 'COMPOSITION CONSTRAINT: Prefer asymmetric balance over rigid symmetry. Offset hero images to one side with text on the other. Use unequal column widths. Balance a single large visual with a cluster of smaller elements. Avoid perfectly centered layouts unless intentionally minimal.'
  },
  {
    id: 'k-whitespace',
    category: 'Layout & Composition',
    title: 'Strategic Whitespace',
    description: 'Empty space is not wasted space — it is a design tool. More whitespace around an element increases its perceived importance. Premium brands use generous whitespace; dense UIs feel cheap.',
    aiPrompt: 'WHITESPACE CONSTRAINT: Use generous whitespace as a deliberate design element. Section padding should be at least 64-96px vertical. Hero sections need 80-120px padding. Increase spacing around primary CTAs to draw attention. The ratio of content-to-whitespace should lean toward more whitespace, not less.'
  },
  {
    id: 'k-z-pattern',
    category: 'Layout & Composition',
    title: 'Z-Pattern & F-Pattern Scanning',
    description: 'Users scan pages in a Z or F pattern. Place your logo top-left, CTA top-right, key content center-left, and secondary CTA bottom-right. For text-heavy pages, front-load the first 2 words of every line.',
    aiPrompt: 'READING PATTERN CONSTRAINT: Structure layouts to respect natural eye scanning. For landing pages use Z-pattern: logo top-left, CTA top-right, hero visual center, conversion action bottom-right. For content pages use F-pattern: place the most important information in the first two lines and the left side of every row.'
  },

  // ==========================================
  // TYPOGRAPHY
  // ==========================================
  {
    id: 'k-type-scale',
    category: 'Typography',
    title: 'Modular Type Scale',
    description: 'Use a mathematical ratio (1.200 Minor Third, 1.250 Major Third, or 1.333 Perfect Fourth) to derive all font sizes. This creates a harmonious hierarchy that never looks arbitrary.',
    aiPrompt: 'TYPOGRAPHY SCALE CONSTRAINT: Use a strict modular scale (ratio 1.25 Major Third recommended). Example sizes: 12px caption, 14px small, 16px body, 20px h4, 24px h3, 32px h2, 40px h1. Never pick random font sizes. Line-heights: headings 1.1-1.2, body 1.5-1.6, captions 1.4.'
  },
  {
    id: 'k-type-pairing',
    category: 'Typography',
    title: 'Font Pairing Rules',
    description: 'Pair a geometric sans-serif (Inter, DM Sans) with a serif (Playfair, Lora) for contrast. Or use a single superfamily with weight variation. Never use more than 2 font families.',
    aiPrompt: 'FONT PAIRING CONSTRAINT: Use a maximum of 2 font families. For modern SaaS, use Inter or DM Sans as the primary. For editorial, pair a sans-serif body with a serif display font. Never mix two fonts from the same classification (two serifs, two geometric sans). Differentiate hierarchy through weight (400, 500, 600, 700) rather than adding more fonts.'
  },
  {
    id: 'k-type-measure',
    category: 'Typography',
    title: 'Optimal Line Length (Measure)',
    description: 'Body text should be 45-75 characters per line (including spaces). Too wide = eyes lose their place. Too narrow = constant line breaks disrupt reading flow.',
    aiPrompt: 'LINE LENGTH CONSTRAINT: Body text containers must be 45-75 characters wide (approximately 540-720px at 16px font size with a standard typeface). Never set body text in a full-width container without a max-width. Use max-width: 680px or similar for article content.'
  },
  {
    id: 'k-type-weight-hierarchy',
    category: 'Typography',
    title: 'Weight-Based Hierarchy',
    description: 'Use at most 3 font weights: Bold (700) for titles, Medium (500) for subheadings and labels, Regular (400) for body. Skip 300 (too thin on screens) and 900 (too heavy for UI).',
    aiPrompt: 'FONT WEIGHT CONSTRAINT: Use exactly 3 weights — 700 (bold) for headings and emphasis, 500 or 600 (medium/semibold) for subheadings, labels, and navigation, 400 (regular) for body text. Never use thin weights (100-300) for UI text. Reserve 800-900 for hero display text only.'
  },

  // ==========================================
  // COLOR THEORY
  // ==========================================
  {
    id: 'k-60-30-10',
    category: 'Color Theory',
    title: '60-30-10 Color Distribution',
    description: '60% dominant (background), 30% secondary (cards, surfaces), 10% accent (CTAs, active states). This is the golden rule of interior and interface design — it prevents visual chaos.',
    aiPrompt: 'COLOR DISTRIBUTION CONSTRAINT: Apply the 60/30/10 rule strictly. 60% = primary background color. 30% = secondary surfaces (cards, sidebars, inputs). 10% = accent color ONLY on primary CTAs, active navigation, and key highlights. Never spread the accent color beyond 10% or the UI loses focus.'
  },
  {
    id: 'k-color-contrast',
    category: 'Color Theory',
    title: 'WCAG Contrast Ratios',
    description: 'Normal text needs 4.5:1 contrast against its background. Large text (18px+ bold or 24px+ regular) needs 3:1. Icons and UI elements need 3:1. Test every color pair.',
    aiPrompt: 'ACCESSIBILITY CONSTRAINT: All text must meet WCAG AA contrast ratios. Body text: minimum 4.5:1 against background. Large headings (24px+): minimum 3:1. Interactive elements and icons: minimum 3:1. For dark mode, do not use pure white (#fff) on pure black (#000) — use off-white (#e5e7eb) on dark gray (#111827) to reduce eye strain.'
  },
  {
    id: 'k-color-opacity',
    category: 'Color Theory',
    title: 'Opacity-Based Color System',
    description: 'Instead of defining dozens of gray shades, use a single text color with varying opacity: 0.9 for primary, 0.6 for secondary, 0.35 for muted, 0.1 for borders. This auto-adapts to any background.',
    aiPrompt: 'COLOR SYSTEM CONSTRAINT: Build colors using opacity layering from a single base. Primary text: rgba(base, 0.87-0.92). Secondary text: rgba(base, 0.55-0.65). Muted/disabled: rgba(base, 0.3-0.4). Borders: rgba(base, 0.08-0.12). Hover overlays: rgba(base, 0.04). This creates perfect tonal consistency.'
  },
  {
    id: 'k-dark-mode',
    category: 'Color Theory',
    title: 'Dark Mode Design Principles',
    description: 'Dark mode is not just inverting colors. Use dark gray (#111, #1a1a2e) not pure black. Reduce saturation of accent colors. Flip elevation: higher surfaces = lighter in dark mode.',
    aiPrompt: 'DARK MODE CONSTRAINT: Never use pure black (#000) as background — use dark grays (#0a0a0f, #111827, #1a1a2e). Reduce accent color saturation by 10-15% to avoid eye strain. In dark mode, higher elevation surfaces must be LIGHTER (not darker). Cards should be slightly lighter than the page background. Reduce shadow opacity and use subtle light borders instead.'
  },
  {
    id: 'k-color-semantic',
    category: 'Color Theory',
    title: 'Semantic Color Mapping',
    description: 'Colors carry meaning: green = success, red = destructive, amber = warning, blue = informational. Never use red for a primary CTA unless it is a destructive action.',
    aiPrompt: 'SEMANTIC COLOR CONSTRAINT: Map colors to meaning consistently. Green/emerald: success, completion, positive. Red/rose: error, destructive, danger. Amber/yellow: warning, caution. Blue: informational, links, neutral action. Never use red for non-destructive primary buttons. Never use green for destructive actions.'
  },

  // ==========================================
  // DEPTH & ELEVATION
  // ==========================================
  {
    id: 'k-elevation-system',
    category: 'Depth & Elevation',
    title: 'Z-Axis Elevation System',
    description: 'Define 4-5 elevation levels: 0 (base), 1 (cards), 2 (dropdowns), 3 (modals), 4 (tooltips). Each level has progressively larger, softer shadows simulating a physical light source.',
    aiPrompt: 'ELEVATION CONSTRAINT: Implement a strict 5-level elevation system. Level 0 (base): no shadow. Level 1 (cards): 0 1px 3px rgba(0,0,0,0.08). Level 2 (dropdowns): 0 4px 16px rgba(0,0,0,0.12). Level 3 (modals): 0 16px 48px rgba(0,0,0,0.16). Level 4 (tooltips): 0 8px 24px rgba(0,0,0,0.2). Shadows come from a single top-left light source.'
  },
  {
    id: 'k-glassmorphism',
    category: 'Depth & Elevation',
    title: 'Premium Glassmorphism',
    description: 'Semi-transparent surfaces with backdrop blur create a sense of layered depth. Use sparingly — glass surfaces on top of busy backgrounds. Requires a 1px inner border to define edges.',
    aiPrompt: 'GLASSMORPHISM CONSTRAINT: Use semi-transparent backgrounds (rgba(255,255,255,0.03-0.08) dark mode or rgba(255,255,255,0.6-0.8) light mode). Apply backdrop-filter: blur(16-24px). Always add a 1px border with rgba(255,255,255,0.1) to define glass edges. Use sparingly — only on overlays, floating panels, and navbars, not every card.'
  },
  {
    id: 'k-surface-hierarchy',
    category: 'Depth & Elevation',
    title: 'Surface Hierarchy',
    description: 'A page should have 3-4 distinct surface levels: page background → card surface → input/well surface → overlay. Each level is slightly different in lightness to create depth without shadows.',
    aiPrompt: 'SURFACE CONSTRAINT: Define exactly 4 surface levels with distinct background colors. Level 0: page background (darkest in dark mode). Level 1: card/panel surface (slightly lighter). Level 2: input wells and recessed areas (slightly darker than cards). Level 3: overlays and floating elements (lightest). Each level should differ by 3-5% lightness.'
  },

  // ==========================================
  // MOTION & INTERACTION
  // ==========================================
  {
    id: 'k-easing-curves',
    category: 'Motion & Interaction',
    title: 'Natural Easing Curves',
    description: 'Never use linear easing for UI. Use ease-out for entrances (fast start, gentle stop), ease-in for exits (slow start, fast departure), and ease-in-out for state changes.',
    aiPrompt: 'EASING CONSTRAINT: Never use linear timing. Entrances/appearances: cubic-bezier(0.16, 1, 0.3, 1) (ease-out, fast start → gentle stop). Exits/removals: cubic-bezier(0.55, 0, 1, 0.45) (ease-in). State changes (color, size): cubic-bezier(0.4, 0, 0.2, 1) (Material ease). Duration: micro-interactions 150-200ms, layout changes 250-350ms, page transitions 400-500ms.'
  },
  {
    id: 'k-micro-animations',
    category: 'Motion & Interaction',
    title: 'Purposeful Micro-Animations',
    description: 'Every animation must serve a purpose: indicate a state change, guide attention, or provide feedback. Decorative animation without purpose is noise, not design.',
    aiPrompt: 'ANIMATION CONSTRAINT: Add micro-animations only for: (1) state feedback — button press scales to 0.97, inputs glow on focus; (2) attention guidance — new elements fade-in with 12px translateY; (3) spatial continuity — modals scale from 0.95, drawers slide from their edge. Duration must be 100-300ms. Never animate for decoration alone.'
  },
  {
    id: 'k-hover-states',
    category: 'Motion & Interaction',
    title: 'Interactive State Design',
    description: 'Every clickable element needs 4 states: default, hover, active/pressed, and disabled. Hover should be subtle (opacity change or slight background shift). Active should feel physical (slight scale down).',
    aiPrompt: 'INTERACTIVE STATE CONSTRAINT: Every interactive element must define 4 states. Default: base appearance. Hover: subtle background lightening (rgba overlay 0.04-0.08) with transition 150ms, optional translateY(-1px). Active/pressed: scale(0.98) or darker background. Disabled: opacity 0.4, cursor not-allowed. Focus-visible: 2px ring offset for keyboard accessibility.'
  },
  {
    id: 'k-loading-states',
    category: 'Motion & Interaction',
    title: 'Skeleton & Loading UX',
    description: 'Never show a blank screen while loading. Use skeleton screens (pulsing gray shapes mimicking the content layout) for content loads, and inline spinners for action confirmations.',
    aiPrompt: 'LOADING STATE CONSTRAINT: Replace empty loading states with skeleton screens. Skeleton shapes must mirror the exact layout of the real content (rectangles for text lines, circles for avatars, rounded rects for images). Animate with a shimmer gradient moving left-to-right at 1.5s intervals. For button actions, show an inline spinner inside the button and disable it.'
  },

  // ==========================================
  // UX PSYCHOLOGY
  // ==========================================
  {
    id: 'k-cognitive-load',
    category: 'UX Psychology',
    title: 'Minimize Cognitive Load',
    description: 'Group related elements using proximity. Hide secondary actions behind overflow menus. Use progressive disclosure — show only what is needed at each step. Fewer choices = faster decisions.',
    aiPrompt: 'COGNITIVE LOAD CONSTRAINT: Apply Gestalt proximity — group related items tightly (8px gap) and separate groups generously (24-32px). Show max 3-5 primary actions at once. Hide secondary/destructive actions behind "..." overflow menus. Use progressive disclosure — collapse advanced options behind expandable sections.'
  },
  {
    id: 'k-fitts-law',
    category: 'UX Psychology',
    title: 'Fitts\'s Law — Target Sizing',
    description: 'The time to reach a target is a function of its size and distance. Make primary CTAs large (min 44x44px touch target). Place frequently-used actions near the user\'s current focus area.',
    aiPrompt: 'TARGET SIZE CONSTRAINT (Fitts\'s Law): All interactive targets must be minimum 44x44px touch area (even if visually smaller). Primary CTAs should be the largest clickable elements on screen (min height 48px, padding 16px 32px). Place primary actions near the user\'s current focus — do not force long mouse/thumb travel for frequent actions.'
  },
  {
    id: 'k-hicks-law',
    category: 'UX Psychology',
    title: 'Hick\'s Law — Reduce Choices',
    description: 'Decision time increases logarithmically with the number of choices. Limit navigation to 5-7 items. Limit form fields to the minimum necessary. Use smart defaults to eliminate choices.',
    aiPrompt: 'CHOICE REDUCTION CONSTRAINT (Hick\'s Law): Navigation should have 5-7 items maximum. Forms should request minimum required fields. Provide smart defaults for selects and toggles. If offering more than 7 options, use categorized sub-menus, search filtering, or a "recommended" highlight to reduce cognitive burden.'
  },
  {
    id: 'k-visual-hierarchy',
    category: 'UX Psychology',
    title: 'Triple-Layer Visual Hierarchy',
    description: 'Every screen should have exactly 3 layers of information importance: Primary (what the user MUST see), Secondary (supporting context), Tertiary (metadata and actions). Differentiate them through size, weight, and opacity.',
    aiPrompt: 'HIERARCHY CONSTRAINT: Structure every view with 3 information layers. Primary: largest text, highest contrast (font-size 20-32px, weight 600-700, opacity 0.9). Secondary: medium text supporting primary (14-16px, weight 400-500, opacity 0.6). Tertiary: smallest, lowest contrast metadata (11-13px, weight 400, opacity 0.35). Never make all text the same visual weight.'
  },
  {
    id: 'k-gestalt-proximity',
    category: 'UX Psychology',
    title: 'Gestalt Principle of Proximity',
    description: 'Items that are physically closer together are perceived as a group. The space BETWEEN groups should be at least 2x the space within groups. This eliminates the need for dividers.',
    aiPrompt: 'GROUPING CONSTRAINT (Gestalt Proximity): Intra-group spacing must be tight (8-12px). Inter-group spacing must be at least 2x the intra-group value (24-32px). Use spacing alone to create visual groups — avoid relying on borders or dividers to separate content. If spacing clearly defines groups, lines and borders are redundant.'
  },

  // ==========================================
  // RESPONSIVE DESIGN
  // ==========================================
  {
    id: 'k-mobile-first',
    category: 'Responsive Design',
    title: 'Mobile-First Breakpoints',
    description: 'Design for the smallest screen first, then enhance for larger screens with min-width media queries. Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl).',
    aiPrompt: 'RESPONSIVE CONSTRAINT: Write CSS mobile-first. Base styles target phones (<640px). Use min-width breakpoints to enhance: @media (min-width: 640px) for tablets, (min-width: 1024px) for desktops, (min-width: 1280px) for wide screens. Grids should be 1 column on mobile, 2 on tablet, 3-4 on desktop. Never hide critical content on mobile — restructure it.'
  },
  {
    id: 'k-fluid-type',
    category: 'Responsive Design',
    title: 'Fluid Typography with Clamp',
    description: 'Instead of fixed font sizes at breakpoints, use CSS clamp() for smooth scaling: clamp(min, preferred, max). Headings grow fluidly from mobile to desktop without jarring jumps.',
    aiPrompt: 'FLUID TYPE CONSTRAINT: Use CSS clamp() for responsive typography. Example: h1: clamp(28px, 4vw + 1rem, 48px), h2: clamp(22px, 3vw + 0.5rem, 36px), body: clamp(14px, 1vw + 0.5rem, 16px). This eliminates the need for font-size media queries and provides smooth scaling across all viewport widths.'
  },
  {
    id: 'k-touch-targets',
    category: 'Responsive Design',
    title: 'Touch-Friendly Targets',
    description: 'On mobile, fingers are imprecise. All tap targets must be at least 44x44px with 8px minimum gap between adjacent targets. Navigation items, form inputs, and buttons all need this treatment.',
    aiPrompt: 'TOUCH TARGET CONSTRAINT: On mobile, all interactive elements must have a minimum touch area of 44x44px. Minimum gap between adjacent tap targets: 8px. Navigation items need min-height 48px. Form inputs need min-height 44px with 16px horizontal padding. Buttons on mobile must be full-width or have generous padding (12px 24px minimum).'
  },
  {
    id: 'k-container-queries',
    category: 'Responsive Design',
    title: 'Component-Level Responsiveness',
    description: 'Components should adapt to their container, not just the viewport. A card in a sidebar should look different from the same card in the main content area, regardless of screen size.',
    aiPrompt: 'COMPONENT RESPONSIVE CONSTRAINT: Design components that adapt to their container width, not viewport. Use min() and max() for widths. Cards should have min-width and max-width. Grid items should use minmax(280px, 1fr). Text truncation should use line-clamp based on available space. A component must look correct whether placed in a 300px sidebar or an 800px main area.'
  },

  // ==========================================
  // COMPONENT PATTERNS
  // ==========================================
  {
    id: 'k-button-hierarchy',
    category: 'Component Patterns',
    title: 'Button Hierarchy System',
    description: 'Every page needs max 1 primary (solid, accent color), unlimited secondary (outlined or subtle), and ghost (text-only) buttons. Primary = main action, secondary = alternative, ghost = cancel/dismiss.',
    aiPrompt: 'BUTTON HIERARCHY CONSTRAINT: Define exactly 3 button tiers. Primary: solid accent background, white text, used ONCE per logical section for the main action. Secondary: transparent with subtle border or light background, used for alternative actions. Ghost: text-only with hover background, for cancel/dismiss/tertiary actions. Never place two primary buttons side by side.'
  },
  {
    id: 'k-card-anatomy',
    category: 'Component Patterns',
    title: 'Card Component Anatomy',
    description: 'A well-designed card has: visual area (image/icon), title, metadata, description (optional), and action area. Maintain consistent internal padding and clear separation between zones.',
    aiPrompt: 'CARD ANATOMY CONSTRAINT: Every card must follow this structure: (1) Visual header — image or icon area with consistent aspect ratio (16:10 or 3:2). (2) Content body — 20-24px padding containing title (font-weight 600), metadata row (12px, muted), and optional description (14px, 2-line clamp). (3) Action footer — separated by subtle border or extra spacing, containing secondary buttons. Internal spacing must be consistent (12-16px between elements).'
  },
  {
    id: 'k-form-design',
    category: 'Component Patterns',
    title: 'Form Design Best Practices',
    description: 'Labels above inputs (not beside). One column layout. Group related fields. Show validation inline, not in alerts. Use placeholder text for examples, not labels.',
    aiPrompt: 'FORM DESIGN CONSTRAINT: Labels must be positioned ABOVE inputs, never beside or as placeholders. Forms should be single-column layout. Group related fields with a section title. Inputs need: 12-16px padding, visible border, focus ring (2px accent color), and error state (red border + inline error message below). Required fields marked with subtle indicator. Submit button must be full-width on mobile.'
  },
  {
    id: 'k-empty-states',
    category: 'Component Patterns',
    title: 'Meaningful Empty States',
    description: 'Never show a blank page. Empty states should have: an illustration or icon, a clear title explaining what goes here, a description with guidance, and a primary CTA to create the first item.',
    aiPrompt: 'EMPTY STATE CONSTRAINT: Every list/grid view must have a designed empty state containing: (1) A large, subtle illustration or icon (48-64px, opacity 0.1-0.2). (2) A title explaining the empty state ("No projects yet"). (3) A helpful description ("Create your first project to start organizing designs"). (4) A primary CTA button to take action. Center the empty state vertically in the available space.'
  }
];

// Helper to get all categories
export function getKnowledgeCategories() {
  const cats = KNOWLEDGE_BANK.map(k => k.category);
  return [...new Set(cats)];
}

// Helper to format injections for the prompt
export function formatKnowledgeInjections(selectedIds) {
  if (!selectedIds || selectedIds.length === 0) return '';
  
  const rules = selectedIds
    .map(id => KNOWLEDGE_BANK.find(k => k.id === id))
    .filter(Boolean)
    .map((k, i) => `${i + 1}. **${k.title}**: ${k.aiPrompt}`);
    
  if (rules.length === 0) return '';

  let s = '## ADVANCED DESIGN CONSTRAINTS (MANDATORY)\n';
  s += 'You MUST apply the following design principles to the generated code. These are absolute constraints, not suggestions:\n\n';
  s += rules.join('\n\n');
  s += '\n';
  
  return s;
}
