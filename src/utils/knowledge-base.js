// DesignVault — Knowledge Base Core
// Hardcoded design principles acting as both user documentation and AI prompt directives.

export const KNOWLEDGE_BANK = [

  // ==========================================
  // LAYOUT & COMPOSITION
  // ==========================================
  {
    id: 'k-8px-grid',
    elaboration: `<p>The 8px spatial system is the bedrock of modern UI design. Because the vast majority of popular screen sizes are divisible by 8 on at least one axis, an 8px grid ensures that your layouts scale cleanly without sub-pixel rendering issues (which cause blurry lines and soft edges).</p><h3>The Math Behind the Grid</h3><p>By restricting your spacing options to multiples of 8 (8, 16, 24, 32, 40, 48, 64, etc.), you drastically reduce decision fatigue. You no longer have to debate whether a margin should be 15px or 20px. It is either 16px or 24px. This strict limitation actually speeds up the design and development process, resulting in a rhythm that users subconsciously perceive as reliable and professional.</p><h3>Micro-adjustments</h3><p>While 8px is the base, a 4px half-step is permissible for tight component-internal spacing—such as the gap between an icon and its text label, or the padding inside a small badge. However, structural layout spacing should always adhere to the strict 8px progression.</p>`,
    category: 'Layout & Composition',
    title: '8px Spatial System',
    description: 'All dimensions, padding, margins, and gaps use base-8 increments (8, 16, 24, 32, 48, 64, 96). This guarantees pixel-perfect alignment on all screens and creates consistent visual rhythm across every component.',
    aiPrompt: 'SPACING CONSTRAINT: Strictly use an 8px spatial grid. All paddings, margins, gaps, widths, and heights MUST be multiples of 8 (8, 16, 24, 32, 48, 64, 96px). Never use arbitrary values like 5px, 15px, or 20px. Use 4px only for micro-adjustments (icon padding, border offsets).'
  },
  {
    id: 'k-golden-ratio',
    elaboration: `<p>The Golden Ratio (approximately 1:1.618) has been used in art and architecture for centuries to achieve organic, aesthetically pleasing proportions. In digital interface design, applying this ratio helps in dividing screen real estate in a way that feels inherently balanced without appearing overly rigid.</p><h3>Applying the Ratio</h3><p>When designing a dashboard with a sidebar, instead of arbitrarily assigning widths, try sizing the main content area to be roughly 1.618 times wider than the sidebar (e.g., a 38% / 62% split). Similarly, when designing a hero section with text on the left and an image on the right, applying the golden ratio creates a more dynamic composition than a basic 50/50 split.</p><p>By grounding your layout decisions in this mathematical constant, you bring a subtle, natural harmony to the user interface that elevates it from basic to premium.</p>`,
    category: 'Layout & Composition',
    title: 'Golden Ratio Proportions',
    description: 'The ratio 1:1.618 produces naturally pleasing divisions. Apply it to sidebar vs main content widths, hero image vs text areas, and card aspect ratios for layouts that feel balanced without effort.',
    aiPrompt: 'PROPORTION CONSTRAINT: Apply the Golden Ratio (1:1.618) to major layout divisions. Two-column layouts should split ~38% / ~62%. Hero sections should divide text and media at this ratio. Card aspect ratios should approximate 1:1.618 or 1:1.414 (silver ratio).'
  },
  {
    id: 'k-visual-balance',
    elaboration: `<p>Visual balance does not equal symmetry. While symmetrical layouts (where both sides mirror each other) provide stability, they often result in static, unengaging designs. Modern interfaces thrive on asymmetrical balance, where elements of different sizes, weights, and colors are arranged to counterbalance each other.</p><h3>Creating Asymmetry</h3><p>To achieve asymmetrical balance, you might place a single, large, visually heavy element (like a bold hero image) on the right side of the screen, and balance it on the left with a cluster of smaller, lighter elements (like a headline, subheadline, and a pair of CTA buttons). The total visual weight on both sides feels equal, but the composition is far more dynamic.</p><h3>The Role of Negative Space</h3><p>Negative space (whitespace) plays a critical role in this balance. You can use large areas of whitespace to counterbalance visually heavy imagery, allowing the user's eyes to rest while keeping the layout engaging.</p>`,
    category: 'Layout & Composition',
    title: 'Asymmetric Visual Balance',
    description: 'Symmetry is stable but boring. Offset layouts — a large element on one side balanced by multiple smaller elements on the other — create dynamic, modern compositions that still feel stable.',
    aiPrompt: 'COMPOSITION CONSTRAINT: Prefer asymmetric balance over rigid symmetry. Offset hero images to one side with text on the other. Use unequal column widths. Balance a single large visual with a cluster of smaller elements. Avoid perfectly centered layouts unless intentionally minimal.'
  },
  {
    id: 'k-whitespace',
    elaboration: `<p>Whitespace, or negative space, is often the most misunderstood tool in a designer's arsenal. It is not merely "empty space" waiting to be filled with content; it is an active design element that provides breathing room, organizes content, and directs the user's attention.</p><h3>Macro vs. Micro Whitespace</h3><p><strong>Macro whitespace</strong> refers to the large spaces between major layout sections and around the edges of the page. Generous macro whitespace gives a design a premium, sophisticated feel (think of high-end fashion or tech websites). <strong>Micro whitespace</strong> refers to the small gaps between elements within a component, such as the space between a heading and a paragraph, or between items in a list. Tightening micro whitespace helps group related items, while expanding it separates them.</p><p>When in doubt, add more whitespace. A common amateur mistake is crowding too much information into a small area, which increases cognitive load and overwhelms the user.</p>`,
    category: 'Layout & Composition',
    title: 'Strategic Whitespace',
    description: 'Empty space is not wasted space — it is a design tool. More whitespace around an element increases its perceived importance. Premium brands use generous whitespace; dense UIs feel cheap.',
    aiPrompt: 'WHITESPACE CONSTRAINT: Use generous whitespace as a deliberate design element. Section padding should be at least 64-96px vertical. Hero sections need 80-120px padding. Increase spacing around primary CTAs to draw attention. The ratio of content-to-whitespace should lean toward more whitespace, not less.'
  },
  {
    id: 'k-z-pattern',
    elaboration: `<p>Eye-tracking studies have consistently shown that users in Western cultures (who read left-to-right, top-to-bottom) tend to scan screens in predictable patterns. For pages with sparse content, such as landing pages, this takes the form of a Z-pattern. For text-heavy pages, it forms an F-pattern.</p><h3>Designing for the Z-Pattern</h3><p>The Z-pattern begins at the top-left (usually the logo), moves horizontally to the top-right (often the primary navigation or a "Sign Up" button), cuts diagonally down to the bottom-left (where the main headline sits), and finally moves horizontally to the bottom-right (the primary Call to Action). By aligning your critical information and conversion goals along this Z-path, you capture the user's attention naturally without forcing them to search the page.</p><p>Understanding scanning patterns ensures your design works *with* human psychology, rather than against it.</p>`,
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
    elaboration: `<p>A modular type scale is a sequence of font sizes derived from a specific mathematical ratio (such as the Major Third, 1.25, or the Perfect Fourth, 1.333). Instead of picking font sizes randomly based on what "looks right," a modular scale creates a predictable, harmonious rhythm throughout your typography.</p><h3>Why Ratios Matter</h3><p>If your base paragraph size is 16px, multiplying it by 1.25 gives you 20px (for an H4). Multiplying 20px by 1.25 gives you 25px (for an H3), and so on. This ensures that the contrast in size between a heading and body text is consistent and intentional. It prevents the "Frankenstein" effect where headings are slightly too large or slightly too small relative to the content they introduce.</p><h3>Implementation</h3><p>When implementing a scale in CSS, define these values as root variables (`--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, etc.). This allows you to globally adjust the scale ratio for different breakpoints while maintaining the mathematical harmony.</p>`,
    category: 'Typography',
    title: 'Modular Type Scale',
    description: 'Use a mathematical ratio (1.200 Minor Third, 1.250 Major Third, or 1.333 Perfect Fourth) to derive all font sizes. This creates a harmonious hierarchy that never looks arbitrary.',
    aiPrompt: 'TYPOGRAPHY SCALE CONSTRAINT: Use a strict modular scale (ratio 1.25 Major Third recommended). Example sizes: 12px caption, 14px small, 16px body, 20px h4, 24px h3, 32px h2, 40px h1. Never pick random font sizes. Line-heights: headings 1.1-1.2, body 1.5-1.6, captions 1.4.'
  },
  {
    id: 'k-type-pairing',
    elaboration: `<p>Typography pairing is an art form, but it is governed by a few strict rules to maintain legibility and visual coherence. The most critical rule is achieving contrast without conflict. When pairing two distinct typefaces, they must be different enough to establish clear hierarchy, but share similar underlying structures (like x-height or letter proportions) so they don't clash.</p><h3>The Golden Combinations</h3><p>A fail-safe approach for modern digital design is pairing a sturdy, geometric sans-serif (like Inter, Roboto, or DM Sans) for body text with an expressive serif (like Playfair Display or Lora) for headings. Alternatively, using a single "superfamily" (a typeface that comes in both serif and sans-serif variations) guarantees perfect harmony.</p><h3>The Two-Font Limit</h3><p>Never use more than two distinct font families on a single interface. Introducing a third font almost always creates visual chaos. If you need more variation, use different weights, tracking (letter-spacing), or casing (uppercase) of your existing two fonts.</p>`,
    category: 'Typography',
    title: 'Font Pairing Rules',
    description: 'Pair a geometric sans-serif (Inter, DM Sans) with a serif (Playfair, Lora) for contrast. Or use a single superfamily with weight variation. Never use more than 2 font families.',
    aiPrompt: 'FONT PAIRING CONSTRAINT: Use a maximum of 2 font families. For modern SaaS, use Inter or DM Sans as the primary. For editorial, pair a sans-serif body with a serif display font. Never mix two fonts from the same classification (two serifs, two geometric sans). Differentiate hierarchy through weight (400, 500, 600, 700) rather than adding more fonts.'
  },
  {
    id: 'k-type-measure',
    elaboration: `<p>The "measure" of typography refers to the width of a line of text. The length of a line profoundly impacts readability and reading comprehension. If a line is too long, the reader's eye struggles to track back to the beginning of the next line, causing them to lose their place. If a line is too short, the constant back-and-forth eye movement disrupts the reading flow and causes fatigue.</p><h3>The 45-75 Rule</h3><p>The optimal line length for body text is generally considered to be between 45 and 75 characters, including spaces. For a standard 16px or 18px font, this usually translates to a maximum container width of roughly 600px to 720px.</p><h3>Responsive Considerations</h3><p>Never allow a text block to stretch the full width of a high-resolution desktop monitor. Always constrain reading column widths using CSS `max-width`. On mobile devices, line lengths naturally become shorter, which is acceptable, but ensure your font size isn't so large that you only fit 2-3 words per line.</p>`,
    category: 'Typography',
    title: 'Optimal Line Length (Measure)',
    description: 'Body text should be 45-75 characters per line (including spaces). Too wide = eyes lose their place. Too narrow = constant line breaks disrupt reading flow.',
    aiPrompt: 'LINE LENGTH CONSTRAINT: Body text containers must be 45-75 characters wide (approximately 540-720px at 16px font size with a standard typeface). Never set body text in a full-width container without a max-width. Use max-width: 680px or similar for article content.'
  },
  {
    id: 'k-type-weight-hierarchy',
    elaboration: `<p>While modern typefaces often offer 8 or 9 different weights (from Thin 100 to Black 900), using too many weights in a single interface dilutes your visual hierarchy and drastically increases the file size of your web application.</p><h3>The Three-Weight System</h3><p>A robust interface can be built using exactly three font weights: Regular (400), Medium or Semibold (500/600), and Bold (700).</p><ul><li><strong>Regular (400):</strong> Used for all body copy, paragraphs, and long-form reading.</li><li><strong>Medium (500):</strong> Perfect for UI labels, secondary navigation, button text, and subtitles where you need a slight emphasis without shouting.</li><li><strong>Bold (700):</strong> Reserved strictly for primary headings, crucial data points, and emphasis within body copy.</li></ul><p>Avoid "Thin" or "Light" weights (100-300) for standard UI elements, as they render poorly on low-resolution screens and severely compromise accessibility.</p>`,
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
    elaboration: `<p>The 60-30-10 rule is a classic design principle borrowed from interior design that translates perfectly to user interfaces. It provides a foolproof formula for balancing colors and ensuring your design never looks overwhelming or chaotic.</p><h3>The Breakdown</h3><ul><li><strong>60% Dominant Color:</strong> This is your base. In a light theme, this is usually a white or off-white background. It unifies the design and provides the negative space needed for other elements to stand out.</li><li><strong>30% Secondary Color:</strong> This color supports the dominant color but provides contrast. It's typically used for surface areas like cards, sidebars, secondary buttons, or input fields.</li><li><strong>10% Accent Color:</strong> This is your "pop" of color. It should be used sparingly and strategically to draw the eye to critical conversion points: primary Call-to-Action buttons, active states in navigation, or important notification badges.</li></ul><p>When a design feels "too busy," it is almost always because the accent color has bled past the 10% mark.</p>`,
    category: 'Color Theory',
    title: '60-30-10 Color Distribution',
    description: '60% dominant (background), 30% secondary (cards, surfaces), 10% accent (CTAs, active states). This is the golden rule of interior and interface design — it prevents visual chaos.',
    aiPrompt: 'COLOR DISTRIBUTION CONSTRAINT: Apply the 60/30/10 rule strictly. 60% = primary background color. 30% = secondary surfaces (cards, sidebars, inputs). 10% = accent color ONLY on primary CTAs, active navigation, and key highlights. Never spread the accent color beyond 10% or the UI loses focus.'
  },
  {
    id: 'k-color-contrast',
    elaboration: `<p>Color contrast is not just an aesthetic choice; it is a fundamental accessibility requirement. Designing with low contrast text excludes users with visual impairments, older users, and anyone trying to read their screen in bright sunlight. The Web Content Accessibility Guidelines (WCAG) provide mathematical ratios to ensure legibility.</p><h3>The Magic Numbers</h3><p>For standard body text (usually anything under 18px), the contrast ratio against its background must be at least <strong>4.5:1</strong> to meet WCAG AA standards. For large text (18px and bold, or 24px and regular), the ratio can drop slightly to <strong>3:1</strong>. UI components, such as input borders and icons, must also maintain a 3:1 ratio.</p><p>Never rely on your own eyesight to judge contrast. Always use a contrast checker tool. When designing "subtle" muted text, be incredibly careful not to drop below the 4.5:1 threshold, as "subtle" quickly becomes "invisible" for many users.</p>`,
    category: 'Color Theory',
    title: 'WCAG Contrast Ratios',
    description: 'Normal text needs 4.5:1 contrast against its background. Large text (18px+ bold or 24px+ regular) needs 3:1. Icons and UI elements need 3:1. Test every color pair.',
    aiPrompt: 'ACCESSIBILITY CONSTRAINT: All text must meet WCAG AA contrast ratios. Body text: minimum 4.5:1 against background. Large headings (24px+): minimum 3:1. Interactive elements and icons: minimum 3:1. For dark mode, do not use pure white (#fff) on pure black (#000) — use off-white (#e5e7eb) on dark gray (#111827) to reduce eye strain.'
  },
  {
    id: 'k-color-opacity',
    elaboration: `<p>Managing a color system with dozens of hardcoded gray hex values (gray-100, gray-200... gray-900) can become a maintenance nightmare, especially when dealing with multiple themes or colored backgrounds. An opacity-based color system solves this elegantly.</p><h3>Layering with Alpha</h3><p>Instead of defining a specific hex color for secondary text, define it as the primary text color (e.g., pure black or dark navy) at 60% opacity (`rgba(0, 0, 0, 0.6)`). </p><p>This approach shines because the color automatically adapts to whatever background it sits on. If you place your 60% opacity text on a white background, it looks gray. If you place it on a pale blue background, it absorbs the blue tint and looks like a harmonized, cool gray. This eliminates the "muddy" look that happens when placing a hardcoded, neutral gray text on top of a vibrant, colored background.</p>`,
    category: 'Color Theory',
    title: 'Opacity-Based Color System',
    description: 'Instead of defining dozens of gray shades, use a single text color with varying opacity: 0.9 for primary, 0.6 for secondary, 0.35 for muted, 0.1 for borders. This auto-adapts to any background.',
    aiPrompt: 'COLOR SYSTEM CONSTRAINT: Build colors using opacity layering from a single base. Primary text: rgba(base, 0.87-0.92). Secondary text: rgba(base, 0.55-0.65). Muted/disabled: rgba(base, 0.3-0.4). Borders: rgba(base, 0.08-0.12). Hover overlays: rgba(base, 0.04). This creates perfect tonal consistency.'
  },
  {
    id: 'k-dark-mode',
    elaboration: `<p>Designing a proper dark mode requires much more than simply inverting white to black and black to white. Pure black (`#000000`) combined with pure white text (`#FFFFFF`) creates extremely high contrast that causes severe halation (a glowing effect around text) and eye strain in dark environments.</p><h3>Sophisticated Darkness</h3><p>Instead of pure black, use dark, desaturated grays (like `#121212`, `#18181B`, or `#0F172A`) for your backgrounds. These softer darks are easier on the eyes and allow you to show elevation through lighter gray surfaces.</p><h3>Desaturating Accents</h3><p>Bright, saturated accent colors that look fantastic on a white background will visually "vibrate" and cause eye fatigue on dark backgrounds. In dark mode, you must dial back the saturation and increase the lightness of your accent colors (moving towards pastel hues) to ensure they remain legible and comfortable to look at.</p>`,
    category: 'Color Theory',
    title: 'Dark Mode Design Principles',
    description: 'Dark mode is not just inverting colors. Use dark gray (#111, #1a1a2e) not pure black. Reduce saturation of accent colors. Flip elevation: higher surfaces = lighter in dark mode.',
    aiPrompt: 'DARK MODE CONSTRAINT: Never use pure black (#000) as background — use dark grays (#0a0a0f, #111827, #1a1a2e). Reduce accent color saturation by 10-15% to avoid eye strain. In dark mode, higher elevation surfaces must be LIGHTER (not darker). Cards should be slightly lighter than the page background. Reduce shadow opacity and use subtle light borders instead.'
  },
  {
    id: 'k-color-semantic',
    elaboration: `<p>Semantic colors communicate meaning to the user instantly, bypassing the need to read labels or text. Because these color associations are deeply ingrained in human psychology and digital literacy, violating them causes immediate user confusion and errors.</p><h3>Universal Meanings</h3><ul><li><strong>Green/Emerald:</strong> Success, completion, positive trends, "Go".</li><li><strong>Red/Rose:</strong> Danger, destruction, errors, irreversible actions, "Stop".</li><li><strong>Yellow/Amber:</strong> Warning, caution, pending states, attention required.</li><li><strong>Blue:</strong> Informational, neutral actions, hyperlinks.</li></ul><p>The most common and dangerous mistake is using your brand's primary color (if it happens to be Red) for neutral or positive actions like a "Save" or "Next" button. If your brand is red, you must carefully desaturate it or use a secondary brand color for primary actions to avoid triggering a subconscious "Danger" response in your users.</p>`,
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
    elaboration: `<p>In the physical world, we understand depth and hierarchy through light and shadow. When an object is closer to the light source (elevated), it casts a larger, softer shadow. Digital elevation systems mimic this physics to help users understand which UI elements overlap or take precedence.</p><h3>Defining the Z-Axis</h3><p>A rigorous elevation system defines distinct "levels" along the Z-axis. </p><ul><li><strong>Level 0:</strong> The background floor. No shadows.</li><li><strong>Level 1 (Cards/Buttons):</strong> Rests just above the floor. Features a tight, crisp shadow (e.g., 2px blur) to indicate it is clickable or separate from the background.</li><li><strong>Level 2 (Dropdowns/Menus):</strong> Floats above cards. Uses a wider, softer shadow.</li><li><strong>Level 3 (Modals/Dialogs):</strong> The highest elevation. Uses a massive, diffuse shadow (e.g., 24px+ blur) to completely separate it from the UI below, demanding immediate attention.</li></ul><p>Never mix shadow styles arbitrarily. An element's shadow must accurately reflect its Z-index relative to the rest of the page.</p>`,
    category: 'Depth & Elevation',
    title: 'Z-Axis Elevation System',
    description: 'Define 4-5 elevation levels: 0 (base), 1 (cards), 2 (dropdowns), 3 (modals), 4 (tooltips). Each level has progressively larger, softer shadows simulating a physical light source.',
    aiPrompt: 'ELEVATION CONSTRAINT: Implement a strict 5-level elevation system. Level 0 (base): no shadow. Level 1 (cards): 0 1px 3px rgba(0,0,0,0.08). Level 2 (dropdowns): 0 4px 16px rgba(0,0,0,0.12). Level 3 (modals): 0 16px 48px rgba(0,0,0,0.16). Level 4 (tooltips): 0 8px 24px rgba(0,0,0,0.2). Shadows come from a single top-left light source.'
  },
  {
    id: 'k-glassmorphism',
    elaboration: `<p>Glassmorphism simulates frosted glass, allowing the background to subtly bleed through the surface via a blur effect. When executed correctly, it adds a layer of premium, modern sophistication to an interface. When executed poorly, it destroys legibility and feels chaotic.</p><h3>The Rules of Glass</h3><p>Glassmorphism relies on the CSS `backdrop-filter: blur()` property, but blur alone is not enough. To sell the illusion of physical glass, you must include three elements:</p><ol><li><strong>The Blur:</strong> Usually between 12px and 24px.</li><li><strong>The Tint:</strong> A semi-transparent fill (e.g., `rgba(255,255,255, 0.6)` for light themes, or `rgba(0,0,0, 0.4)` for dark themes) to ensure the text on top remains readable regardless of what is underneath.</li><li><strong>The Edge:</strong> A 1px semi-transparent inner border (often white at 20% opacity) that catches the "light" and defines the physical edge of the glass pane.</li></ol><p>Reserve glassmorphism for floating elements like navigation bars, sticky headers, or modals. Never use it for dense data tables or primary reading content.</p>`,
    category: 'Depth & Elevation',
    title: 'Premium Glassmorphism',
    description: 'Semi-transparent surfaces with backdrop blur create a sense of layered depth. Use sparingly — glass surfaces on top of busy backgrounds. Requires a 1px inner border to define edges.',
    aiPrompt: 'GLASSMORPHISM CONSTRAINT: Use semi-transparent backgrounds (rgba(255,255,255,0.03-0.08) dark mode or rgba(255,255,255,0.6-0.8) light mode). Apply backdrop-filter: blur(16-24px). Always add a 1px border with rgba(255,255,255,0.1) to define glass edges. Use sparingly — only on overlays, floating panels, and navbars, not every card.'
  },
  {
    id: 'k-surface-hierarchy',
    elaboration: `<p>Shadows are not the only way to convey depth. Modern, "flat" or "clean" interfaces often rely on surface hierarchy—using subtle shifts in background lightness to differentiate overlapping planes.</p><h3>Light and Dark Surfaces</h3><p>In a light theme, the lowest base layer is typically a very light gray (e.g., `#F3F4F6`), while the cards resting on top are pure white (`#FFFFFF`). The contrast between the gray floor and the white card defines the boundary without needing a shadow.</p><p>In dark mode, the physics are inverted. Because you cannot cast a dark shadow on a dark background effectively, higher elevations must be communicated by making the surface <em>lighter</em>. The base layer might be `#121212`, a card resting on it might be `#1E1E1E`, and a dropdown floating above that might be `#2C2C2C`. This "lightness as elevation" principle is critical for building dark modes that don't feel flat and suffocating.</p>`,
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
    elaboration: `<p>Nothing in the physical world moves at a constant, robotic speed. Objects accelerate as they start moving and decelerate as they come to a stop due to friction and mass. Applying this physical reality to digital animations is what separates amateur motion design from premium UX.</p><h3>The Holy Trinity of Easing</h3><p>Linear easing (constant speed) should almost never be used in UI. Instead, use these three bezier curves:</p><ul><li><strong>Ease-Out (Deceleration):</strong> Used when elements enter the screen. The object enters quickly (catching the user's attention) and smoothly slows down to its final resting place.</li><li><strong>Ease-In (Acceleration):</strong> Used when elements leave the screen. The object starts moving slowly and accelerates off-screen, getting out of the user's way as fast as possible.</li><li><strong>Ease-In-Out (Standard):</strong> Used for elements moving from one point on the screen to another, or for state changes (like a button expanding). It accelerates up to the midpoint and decelerates to a stop.</li></ul>`,
    category: 'Motion & Interaction',
    title: 'Natural Easing Curves',
    description: 'Never use linear easing for UI. Use ease-out for entrances (fast start, gentle stop), ease-in for exits (slow start, fast departure), and ease-in-out for state changes.',
    aiPrompt: 'EASING CONSTRAINT: Never use linear timing. Entrances/appearances: cubic-bezier(0.16, 1, 0.3, 1) (ease-out, fast start → gentle stop). Exits/removals: cubic-bezier(0.55, 0, 1, 0.45) (ease-in). State changes (color, size): cubic-bezier(0.4, 0, 0.2, 1) (Material ease). Duration: micro-interactions 150-200ms, layout changes 250-350ms, page transitions 400-500ms.'
  },
  {
    id: 'k-micro-animations',
    elaboration: `<p>Micro-animations are small, functional animations that occur over fractions of a second. They are not meant to be the star of the show; their purpose is to provide immediate, intuitive feedback to user interactions.</p><h3>Feedback and Continuity</h3><p>When a user clicks a button, a 100ms micro-animation scaling the button down to 97% mimics the physical compression of a real button, reassuring the user that the system registered their click. When a new item is added to a list, animating its height from 0 to 100% pushes the existing items down smoothly, maintaining spatial continuity rather than causing the layout to aggressively snap and disorient the user.</p><p>The golden rule of micro-animation is speed. Anything longer than 300ms feels sluggish and makes your application feel slow. Keep UI transitions snappy, usually between 150ms and 250ms.</p>`,
    category: 'Motion & Interaction',
    title: 'Purposeful Micro-Animations',
    description: 'Every animation must serve a purpose: indicate a state change, guide attention, or provide feedback. Decorative animation without purpose is noise, not design.',
    aiPrompt: 'ANIMATION CONSTRAINT: Add micro-animations only for: (1) state feedback — button press scales to 0.97, inputs glow on focus; (2) attention guidance — new elements fade-in with 12px translateY; (3) spatial continuity — modals scale from 0.95, drawers slide from their edge. Duration must be 100-300ms. Never animate for decoration alone.'
  },
  {
    id: 'k-hover-states',
    elaboration: `<p>Hover states are the digital equivalent of reaching out and touching an object before interacting with it. They communicate interactivity, affordance, and system readiness. Without them, an interface feels dead and unresponsive.</p><h3>The Four-State Model</h3><p>Every interactive element must account for four distinct states:</p><ol><li><strong>Default:</strong> How it looks at rest.</li><li><strong>Hover:</strong> The user's cursor is over the element. The change should be subtle but unmistakable—a 5% darkening of the background, a slight lift in shadow, or a shift in text color.</li><li><strong>Active/Focus:</strong> The user is currently clicking the mouse, or has navigated to the element via keyboard. This requires high-visibility styling, usually a sharp focus ring, to ensure accessibility.</li><li><strong>Disabled:</strong> The action is unavailable. The element should drop to around 40% opacity and change the cursor to `not-allowed`.</li></ol>`,
    category: 'Motion & Interaction',
    title: 'Interactive State Design',
    description: 'Every clickable element needs 4 states: default, hover, active/pressed, and disabled. Hover should be subtle (opacity change or slight background shift). Active should feel physical (slight scale down).',
    aiPrompt: 'INTERACTIVE STATE CONSTRAINT: Every interactive element must define 4 states. Default: base appearance. Hover: subtle background lightening (rgba overlay 0.04-0.08) with transition 150ms, optional translateY(-1px). Active/pressed: scale(0.98) or darker background. Disabled: opacity 0.4, cursor not-allowed. Focus-visible: 2px ring offset for keyboard accessibility.'
  },
  {
    id: 'k-loading-states',
    elaboration: `<p>System latency is unavoidable, but user frustration is not. The way an interface handles the gap between a user's action and the server's response dictates the perceived performance of the entire application.</p><h3>Beyond the Spinner</h3><p>A full-page loading spinner traps the user in a state of uncertainty. Instead, use <strong>Skeleton Screens</strong>. Skeletons are gray, pulsing placeholders that mimic the exact layout of the content that is about to load (a circle for an avatar, lines for text). This tricks the brain into feeling that the content is already arriving, significantly reducing the perceived wait time.</p><p>For button interactions (like submitting a form), never redirect the user to a generic loading page. Instead, disable the button and swap its label for an inline spinner. This keeps the user grounded in their current context while acknowledging their action.</p>`,
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
    elaboration: `<p>Cognitive load refers to the amount of mental processing power required to use your interface. The human brain has a limited amount of working memory. When an interface presents too much information, too many choices, or a chaotic layout, the user's cognitive load maxes out, leading to frustration, abandonment, and churn.</p><h3>Designing for Lazy Brains</h3><p>Your goal is to do the heavy lifting so the user doesn't have to. You can minimize cognitive load by:</p><ul><li><strong>Chunking Information:</strong> Break long forms into multi-step wizards.</li><li><strong>Progressive Disclosure:</strong> Hide advanced settings behind an "Advanced" toggle. Don't show the user controls they don't need right now.</li><li><strong>Visual Consistency:</strong> Use the same icons, colors, and layout patterns throughout the app. If a user learns how to filter data on the Dashboard, that exact same filter design should be used on the Reports page. Every time a user has to re-learn a pattern, cognitive load increases.</li></ul>`,
    category: 'UX Psychology',
    title: 'Minimize Cognitive Load',
    description: 'Group related elements using proximity. Hide secondary actions behind overflow menus. Use progressive disclosure — show only what is needed at each step. Fewer choices = faster decisions.',
    aiPrompt: 'COGNITIVE LOAD CONSTRAINT: Apply Gestalt proximity — group related items tightly (8px gap) and separate groups generously (24-32px). Show max 3-5 primary actions at once. Hide secondary/destructive actions behind "..." overflow menus. Use progressive disclosure — collapse advanced options behind expandable sections.'
  },
  {
    id: 'k-fitts-law',
    elaboration: `<p>Fitts's Law is a fundamental principle of human-computer interaction. It dictates that the time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target. In plain English: <strong>big, close things are easy to click; small, far things are hard to click.</strong></p><h3>Designing for Touch and Mouse</h3><p>To apply Fitts's Law, your primary Call-to-Action buttons should be large and prominently placed near the center of the user's visual focus. Conversely, destructive actions (like "Delete Account") can be made smaller and placed further away to prevent accidental clicks.</p><p>On touch devices, the rule is absolute: the average adult finger pad requires a minimum target size of 44x44 CSS pixels. If your text links or icon buttons are smaller than this, users will experience rage-clicks and tap errors, severely degrading their experience.</p>`,
    category: 'UX Psychology',
    title: 'Fitts\'s Law — Target Sizing',
    description: 'The time to reach a target is a function of its size and distance. Make primary CTAs large (min 44x44px touch target). Place frequently-used actions near the user\'s current focus area.',
    aiPrompt: 'TARGET SIZE CONSTRAINT (Fitts\'s Law): All interactive targets must be minimum 44x44px touch area (even if visually smaller). Primary CTAs should be the largest clickable elements on screen (min height 48px, padding 16px 32px). Place primary actions near the user\'s current focus — do not force long mouse/thumb travel for frequent actions.'
  },
  {
    id: 'k-hicks-law',
    elaboration: `<p>Hick's Law states that the time it takes for a person to make a decision increases logarithmically as the number of choices increases. If you present a user with a menu of 20 options, they will experience analysis paralysis. If you present them with 5, they will decide instantly.</p><h3>Curation is Design</h3><p>Design is not just adding features; it is aggressively curating them. To apply Hick's Law:</p><ul><li><strong>Limit Navigation:</strong> Keep top-level navigation to 5-7 items. Use categorized dropdowns for the rest.</li><li><strong>Smart Defaults:</strong> Pre-select the most common option in dropdowns and forms so the majority of users don't have to make a choice at all.</li><li><strong>Categorize:</strong> If you must present a massive list (like a country selector), group them logically or provide a search/filter mechanism. Never dump raw data onto the user and expect them to sort it out.</li></ul>`,
    category: 'UX Psychology',
    title: 'Hick\'s Law — Reduce Choices',
    description: 'Decision time increases logarithmically with the number of choices. Limit navigation to 5-7 items. Limit form fields to the minimum necessary. Use smart defaults to eliminate choices.',
    aiPrompt: 'CHOICE REDUCTION CONSTRAINT (Hick\'s Law): Navigation should have 5-7 items maximum. Forms should request minimum required fields. Provide smart defaults for selects and toggles. If offering more than 7 options, use categorized sub-menus, search filtering, or a "recommended" highlight to reduce cognitive burden.'
  },
  {
    id: 'k-visual-hierarchy',
    elaboration: `<p>Visual hierarchy is the arrangement of elements in a way that implies importance. It is the invisible track that guides the user's eye through the screen in the exact order you intend. Without clear hierarchy, everything on the screen screams for attention at the same volume, resulting in a noisy, confusing experience.</p><h3>The Triple-Layer Rule</h3><p>A well-designed component typically features three distinct layers of information:</p><ol><li><strong>Primary:</strong> The most critical piece of info (e.g., a headline or a total balance). This should be the largest, darkest, and heaviest text on the screen.</li><li><strong>Secondary:</strong> Supporting context (e.g., a subheadline or a description). This is smaller and slightly lighter in color.</li><li><strong>Tertiary:</strong> Metadata or minor actions (e.g., a date stamp or a subtle "edit" icon). This should be the smallest element, pushed to the background using a muted, low-contrast color.</li></ol>`,
    category: 'UX Psychology',
    title: 'Triple-Layer Visual Hierarchy',
    description: 'Every screen should have exactly 3 layers of information importance: Primary (what the user MUST see), Secondary (supporting context), Tertiary (metadata and actions). Differentiate them through size, weight, and opacity.',
    aiPrompt: 'HIERARCHY CONSTRAINT: Structure every view with 3 information layers. Primary: largest text, highest contrast (font-size 20-32px, weight 600-700, opacity 0.9). Secondary: medium text supporting primary (14-16px, weight 400-500, opacity 0.6). Tertiary: smallest, lowest contrast metadata (11-13px, weight 400, opacity 0.35). Never make all text the same visual weight.'
  },
  {
    id: 'k-gestalt-proximity',
    elaboration: `<p>The Gestalt principle of proximity states that objects that are near, or proximate to each other, tend to be grouped together. It is the most powerful tool you have for organizing information without relying on heavy borders, lines, or boxes.</p><h3>Spacing as Structure</h3><p>If you have a form with a "First Name" and "Last Name" input, placing them 8px apart tells the brain "these are related." If you then place an 32px gap before the "Billing Address" section, the brain instantly understands that a new logical section has begun, without needing a line drawn between them.</p><p>Amateur designs often suffer from equidistant spacing—where the gap between a headline and its paragraph is the same as the gap between that paragraph and the next section. This destroys proximity, forcing the user to read the text to understand the structure, rather than grasping it intuitively at a glance.</p>`,
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
    elaboration: `<p>Mobile-first design is a methodology that assumes the default state of your application is a small screen, and that you progressively enhance the layout as the screen gets larger. This is not just a coding technique; it forces a critical prioritization of content.</p><h3>Content Prioritization</h3><p>When you design for a 375px wide screen, you don't have room for decorative sidebars, massive hero images, or complex multi-column layouts. You are forced to answer the question: <em>What is the single most important thing the user needs to see right now?</em> </p><h3>Progressive Enhancement</h3><p>In CSS, this means writing your base styles without any media queries. Your default CSS is your mobile CSS. You only introduce `@media (min-width: 768px)` when the screen becomes wide enough to comfortably support a more complex layout, such as snapping a single column of cards into a two-column grid. This approach is faster to render and easier to maintain.</p>`,
    category: 'Responsive Design',
    title: 'Mobile-First Breakpoints',
    description: 'Design for the smallest screen first, then enhance for larger screens with min-width media queries. Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl).',
    aiPrompt: 'RESPONSIVE CONSTRAINT: Write CSS mobile-first. Base styles target phones (<640px). Use min-width breakpoints to enhance: @media (min-width: 640px) for tablets, (min-width: 1024px) for desktops, (min-width: 1280px) for wide screens. Grids should be 1 column on mobile, 2 on tablet, 3-4 on desktop. Never hide critical content on mobile — restructure it.'
  },
  {
    id: 'k-fluid-type',
    elaboration: `<p>Historically, responsive typography meant writing multiple media queries to bump the font size up at specific breakpoints (e.g., 16px on mobile, 18px on tablet, 20px on desktop). This creates jarring "snaps" in the layout as the user resizes their window.</p><h3>The Power of Clamp</h3><p>Modern CSS provides the `clamp(minimum, preferred, maximum)` function. By using a viewport width (`vw`) unit for the preferred value, typography becomes perfectly fluid. For example, `clamp(24px, 4vw, 48px)` tells the browser: "Make this heading 4% of the screen width, but never let it get smaller than 24px or larger than 48px."</p><p>This means your typography scales smoothly on every possible device size, from an iPhone SE to a massive ultrawide monitor, maintaining perfect proportions without a single media query.</p>`,
    category: 'Responsive Design',
    title: 'Fluid Typography with Clamp',
    description: 'Instead of fixed font sizes at breakpoints, use CSS clamp() for smooth scaling: clamp(min, preferred, max). Headings grow fluidly from mobile to desktop without jarring jumps.',
    aiPrompt: 'FLUID TYPE CONSTRAINT: Use CSS clamp() for responsive typography. Example: h1: clamp(28px, 4vw + 1rem, 48px), h2: clamp(22px, 3vw + 0.5rem, 36px), body: clamp(14px, 1vw + 0.5rem, 16px). This eliminates the need for font-size media queries and provides smooth scaling across all viewport widths.'
  },
  {
    id: 'k-touch-targets',
    elaboration: `<p>Designing for mouse pointers is fundamentally different than designing for human fingers. A mouse cursor operates at a single-pixel level of precision. A human thumb operating a smartphone while walking is wildly imprecise.</p><h3>The 44px Minimum</h3><p>Apple's Human Interface Guidelines and Google's Material Design both stipulate that interactive elements must have a minimum physical hit area of roughly 44x44 CSS pixels (or 48x48px in Material). </p><p>If you have a visually small element, like a 16px "X" close icon, you must use CSS padding to expand its clickable area to 44x44px. Furthermore, if you have two buttons next to each other, you must ensure there is at least an 8px dead zone between their touch targets to prevent the user from accidentally triggering the wrong action. Failing to respect touch targets is the fastest way to frustrate mobile users.</p>`,
    category: 'Responsive Design',
    title: 'Touch-Friendly Targets',
    description: 'On mobile, fingers are imprecise. All tap targets must be at least 44x44px with 8px minimum gap between adjacent targets. Navigation items, form inputs, and buttons all need this treatment.',
    aiPrompt: 'TOUCH TARGET CONSTRAINT: On mobile, all interactive elements must have a minimum touch area of 44x44px. Minimum gap between adjacent tap targets: 8px. Navigation items need min-height 48px. Form inputs need min-height 44px with 16px horizontal padding. Buttons on mobile must be full-width or have generous padding (12px 24px minimum).'
  },
  {
    id: 'k-container-queries',
    elaboration: `<p>For the past decade, responsive design was dictated by the width of the viewport (the browser window). However, in modern component-based frameworks (like React or Vue), a component doesn't know where it will be placed. A "Product Card" might be placed in a wide main content area, or squeezed into a narrow sidebar.</p><h3>Micro-Responsiveness</h3><p>Container queries (`@container`) solve this by allowing a component to adapt its layout based on the size of its parent container, rather than the entire screen. If the card's container is wider than 400px, it can display a horizontal layout (image on the left, text on the right). If the container drops below 400px, it snaps to a stacked vertical layout.</p><p>This allows designers to build truly modular, "write once, place anywhere" components that intelligently adapt to their micro-environment, vastly improving the flexibility and robustness of the design system.</p>`,
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
    elaboration: `<p>Buttons are the steering wheel of your interface. If a user doesn't know which button to press, they are lost. Establishing a strict visual hierarchy for your actions removes hesitation and guides the user toward the happy path.</p><h3>The Three Tiers</h3><ol><li><strong>Primary:</strong> The single most important action on the screen (e.g., "Submit Payment"). It uses a solid, high-contrast accent background. There should rarely be more than one primary button visible in a given viewport.</li><li><strong>Secondary:</strong> Alternative actions (e.g., "Save as Draft"). These use an outlined style or a subtle, low-opacity background. They are clearly clickable but don't compete with the primary action.</li><li><strong>Ghost/Tertiary:</strong> Low-priority or dismissive actions (e.g., "Cancel"). These appear as simple text links that only reveal a background shape when hovered over.</li></ol><p>If you place a solid "Cancel" button next to a solid "Save" button, you force the user to read the text to distinguish them. By using hierarchy (Solid Save, Ghost Cancel), the brain recognizes the primary action instantly through visual weight alone.</p>`,
    category: 'Component Patterns',
    title: 'Button Hierarchy System',
    description: 'Every page needs max 1 primary (solid, accent color), unlimited secondary (outlined or subtle), and ghost (text-only) buttons. Primary = main action, secondary = alternative, ghost = cancel/dismiss.',
    aiPrompt: 'BUTTON HIERARCHY CONSTRAINT: Define exactly 3 button tiers. Primary: solid accent background, white text, used ONCE per logical section for the main action. Secondary: transparent with subtle border or light background, used for alternative actions. Ghost: text-only with hover background, for cancel/dismiss/tertiary actions. Never place two primary buttons side by side.'
  },
  {
    id: 'k-card-anatomy',
    elaboration: `<p>The card is the foundational building block of modern web design. It acts as a contained, digestible capsule of information. However, cards only work when their internal anatomy is structured consistently.</p><h3>The Anatomy of a Card</h3><p>A high-quality card defines specific, isolated zones:</p><ul><li><strong>The Visual Zone:</strong> The top section, usually a flush-edge image or a branded icon block. It establishes the context immediately.</li><li><strong>The Content Zone:</strong> The middle section containing the title (high hierarchy) and a brief description (lower hierarchy). Padding here must be generous (e.g., 24px) to let the text breathe.</li><li><strong>The Action Zone:</strong> The bottom section. Often separated by a subtle border or pushed to the bottom using `margin-top: auto`, this area contains the interactive elements (buttons, links).</li></ul><p>By enforcing this strict anatomy, you ensure that no matter what data is fed into the card, the layout remains predictable, scannable, and visually pleasing.</p>`,
    category: 'Component Patterns',
    title: 'Card Component Anatomy',
    description: 'A well-designed card has: visual area (image/icon), title, metadata, description (optional), and action area. Maintain consistent internal padding and clear separation between zones.',
    aiPrompt: 'CARD ANATOMY CONSTRAINT: Every card must follow this structure: (1) Visual header — image or icon area with consistent aspect ratio (16:10 or 3:2). (2) Content body — 20-24px padding containing title (font-weight 600), metadata row (12px, muted), and optional description (14px, 2-line clamp). (3) Action footer — separated by subtle border or extra spacing, containing secondary buttons. Internal spacing must be consistent (12-16px between elements).'
  },
  {
    id: 'k-form-design',
    elaboration: `<p>Forms are where conversion happens. They are also the point of highest friction in any application. Poor form design directly translates to lost revenue and frustrated users.</p><h3>Rules for Frictionless Forms</h3><ul><li><strong>Top-Aligned Labels:</strong> Always place labels above the input field, not to the left. Top-aligned labels require fewer eye fixations to read and process, drastically speeding up form completion.</li><li><strong>Never Use Placeholders as Labels:</strong> Placeholder text disappears as soon as the user starts typing. If the placeholder was the label, the user loses the context of what they are filling out, causing memory strain.</li><li><strong>Single Column:</strong> With rare exceptions (like First Name / Last Name), forms should be a single vertical column. Multi-column forms cause users to zig-zag their eyes, increasing the chance they skip a field.</li><li><strong>Clear Error States:</strong> Never rely solely on color (like a red border) to indicate an error. Always provide clear, inline text below the specific input explaining exactly what went wrong and how to fix it.</li></ul>`,
    category: 'Component Patterns',
    title: 'Form Design Best Practices',
    description: 'Labels above inputs (not beside). One column layout. Group related fields. Show validation inline, not in alerts. Use placeholder text for examples, not labels.',
    aiPrompt: 'FORM DESIGN CONSTRAINT: Labels must be positioned ABOVE inputs, never beside or as placeholders. Forms should be single-column layout. Group related fields with a section title. Inputs need: 12-16px padding, visible border, focus ring (2px accent color), and error state (red border + inline error message below). Required fields marked with subtle indicator. Submit button must be full-width on mobile.'
  },
  {
    id: 'k-empty-states',
    elaboration: `<p>An empty state occurs when a user views a list, table, or dashboard for the first time, before they have created any data. This is a critical moment in the user journey. A blank screen with zero content is a dead end that feels broken and uninviting.</p><h3>The Opportunity of Emptiness</h3><p>Empty states are prime real estate for onboarding and education. A well-designed empty state consists of three elements:</p><ol><li><strong>Visual Delight:</strong> A friendly, branded illustration or a large, subtle icon that makes the empty space look intentional rather than broken.</li><li><strong>Educational Text:</strong> A clear, concise explanation of what this page is for and why the user should care about it (e.g., "Your saved templates will appear here, allowing you to deploy servers in seconds.").</li><li><strong>The Next Step:</strong> A prominent, primary Call-to-Action button that immediately allows the user to populate the page (e.g., "Create First Template").</li></ol><p>Never leave your users staring at a blank wall. Always provide a door.</p>`,
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
