// DesignVault — Knowledge Base Core
// Hardcoded design principles acting as both user documentation and AI prompt directives.

export const KNOWLEDGE_BANK = [
  // ==========================================
  // DESIGN 101: THE FUNDAMENTALS
  // ==========================================
  {
    id: 'k-spacing-8px',
    category: 'Design 101',
    title: '8px Spatial System',
    description: 'Use base-8 increments (8, 16, 24, 32, 48, 64) for all dimensions, padding, and margins. This ensures perfect pixel alignment and consistent rhythm.',
    aiPrompt: 'SPACING CONSTRAINT: Strictly adhere to an 8px grid system. All paddings, margins, gaps, and dimensions MUST be multiples of 8 (e.g., 8px, 16px, 24px, 32px, 48px, 64px, 96px). Do not use arbitrary numbers like 15px or 20px.'
  },
  {
    id: 'k-color-60-30-10',
    category: 'Design 101',
    title: '60-30-10 Color Rule',
    description: 'A classic rule: 60% dominant color (usually background), 30% secondary color (surfaces/cards), and 10% accent color (CTAs and highlights).',
    aiPrompt: 'COLOR DISTRIBUTION CONSTRAINT: Apply the 60/30/10 rule. The primary background should dominate 60% of the UI. Secondary surfaces (cards, sidebars) should take 30%. The accent/brand color must be strictly reserved for the remaining 10% (primary buttons, active states, key highlights) to maximize emphasis.'
  },
  {
    id: 'k-typography-scale',
    category: 'Design 101',
    title: 'Modular Typography Scale',
    description: 'Use a mathematical ratio (like 1.25 Major Third or 1.200 Minor Third) to size headings. Don\'t guess font sizes.',
    aiPrompt: 'TYPOGRAPHY CONSTRAINT: Use a strict modular scale for typography (e.g., Major Third ratio of 1.25). Define discrete font sizes for h1, h2, h3, body, and caption. Do not use arbitrary font sizes. Ensure line-heights are tighter for headings (1.1 - 1.2) and looser for body text (1.5 - 1.6).'
  },
  {
    id: 'k-hierarchy-contrast',
    category: 'Design 101',
    title: 'Visual Hierarchy via Contrast',
    description: 'If everything is bold, nothing is. Use size, weight, and color opacity to establish what the user should read first, second, and third.',
    aiPrompt: 'HIERARCHY CONSTRAINT: Establish clear visual hierarchy using contrast. Primary text must be high contrast (e.g., opacity 0.9 or 1). Secondary text must use lower opacity (0.5 to 0.6) or lighter weight. De-emphasize metadata and elevate primary data.'
  },

  // ==========================================
  // ADVANCED KNOWLEDGE
  // ==========================================
  {
    id: 'k-golden-ratio',
    category: 'Advanced UX',
    title: 'Golden Ratio Layouts',
    description: 'The Golden Ratio (1:1.618) creates naturally pleasing proportions. Great for sidebar-to-main-content widths or hero text-to-image ratios.',
    aiPrompt: 'PROPORTION CONSTRAINT: Apply the Golden Ratio (approx. 1:1.618) to macro-layout divisions. For example, if creating a 2-column layout, the main content should be roughly 62% width and the sidebar 38% width. Apply this mathematical proportion to hero sections and grid divisions.'
  },
  {
    id: 'k-cognitive-load',
    category: 'Advanced UX',
    title: 'Minimize Cognitive Load',
    description: 'Group related elements (Gestalt principle of proximity), hide secondary actions behind menus, and use progressive disclosure.',
    aiPrompt: 'UX CONSTRAINT: Minimize cognitive load using Progressive Disclosure and Gestalt Proximity. Group related elements tightly. Hide destructive or secondary actions behind a hover state or an ellipsis menu. Ensure the interface does not overwhelm the user with too many simultaneous choices.'
  },
  {
    id: 'k-optical-alignment',
    category: 'Advanced UX',
    title: 'Optical Alignment',
    description: 'Math isn\'t always perfect. Round objects or text with overhanging characters (like \'T\') often need slight negative margins to look visually aligned with straight lines.',
    aiPrompt: 'MICRO-UX CONSTRAINT: Use optical alignment. If placing icons next to text, align them by optical center, not mathematical baseline. If using avatars or circular elements at the edge of a container, apply slight negative margins to optically align them with the text grid.'
  },
  {
    id: 'k-glassmorphism',
    category: 'Advanced UX',
    title: 'Premium Glassmorphism',
    description: 'Layering blurred, semi-transparent surfaces over colorful or noisy backgrounds creates depth and a modern premium feel.',
    aiPrompt: 'AESTHETIC CONSTRAINT: Implement premium glassmorphism. Use a semi-transparent surface background (e.g., rgba(255,255,255,0.05) in dark mode), apply a backdrop-filter blur (e.g., 12px to 24px), and add a subtle 1px semi-transparent inner border to simulate a physical glass edge.'
  },
  {
    id: 'k-depth-layering',
    category: 'Advanced UX',
    title: 'Elevation and Shadow Depth',
    description: 'Simulate physical depth by making objects closer to the user cast larger, softer shadows and (in dark mode) have lighter backgrounds.',
    aiPrompt: 'ELEVATION CONSTRAINT: Create a strict Z-axis elevation system. Base surfaces have no shadow. Interactive cards have a subtle, tight shadow (e.g., 0 2px 8px rgba(0,0,0,0.05)). Floating elements (modals, dropdowns) must cast large, soft, diffused shadows (e.g., 0 24px 48px rgba(0,0,0,0.12)) to signify they are on the highest Z-layer.'
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
  s += 'You MUST apply the following design principles to the generated code. These are absolute constraints:\n\n';
  s += rules.join('\n\n');
  s += '\n';
  
  return s;
}
