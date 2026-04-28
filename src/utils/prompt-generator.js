// DesignVault — Aesthetic DNA Prompt Engine
// Generates miss-proof, deep-scan prompts from design references.
// Output is meant to be pasted into Antigravity/ChatGPT alongside the reference image.
import { formatKnowledgeInjections } from './knowledge-base.js';

export function generatePrompt(design) {
  const s = [];

  // ============================================
  // HEADER — FORCE THE AI INTO EXTRACTION MODE
  // ============================================
  s.push('# INSTRUCTION: AESTHETIC DNA EXTRACTION & REPLICATION');
  s.push('');
  s.push('You are a Visual Systems Engineer. You have been given a design reference (screenshot or URL).');
  s.push('Your ONLY job is to perform a forensic visual audit and extract every styling decision made in this design.');
  s.push('');
  s.push('> CRITICAL RULE: Do NOT describe the content (text, images, logos, copy). Extract ONLY the visual system — the "Aesthetic DNA".');
  s.push('> Treat this reference as a CSS specification document, not a content document.');
  s.push('');

  // ============================================
  // REFERENCE CONTEXT & AESTHETIC DNA
  // ============================================
  s.push('---');
  s.push(`## REFERENCE: "${design.title}"`);
  if (design.url) s.push(`Source URL: ${design.url}`);
  if (design.componentType) s.push(`Component Classification: **${design.componentType}**`);
  if (design.notes) s.push(`Curator Notes: ${design.notes}`);
  s.push('');

  const hasFeatures = design.aestheticFeatures && design.aestheticFeatures.length > 0;
  const hasVibes = design.aestheticVibes && design.aestheticVibes.length > 0;

  if (hasFeatures || hasVibes || design.specialSauceNote) {
    s.push('### 🎯 HYPER-FOCUS: AESTHETIC DNA & SPECIAL SAUCE');
    s.push('This specific reference was saved because of its exceptional execution in the following areas. You MUST pay extra, hyper-focused attention to extracting these specific traits with extreme precision:');
    
    if (hasFeatures) {
      s.push('');
      s.push(`**Standout Features:** ${design.aestheticFeatures.join(', ')}`);
      s.push('> DO NOT rely on generic values for these features. Extract the EXACT values (hex codes, pixel gaps, easing curves, layout ratios, component anatomy) from the reference.');
    }
    
    if (hasVibes) {
      s.push('');
      s.push(`**Vibe & Mood:** ${design.aestheticVibes.join(', ')}`);
      s.push('> The final generated code MUST strictly capture this exact vibe.');
    }

    if (design.specialSauceNote) {
      s.push('');
      s.push(`**Designer's Note (The "Special Sauce"):** "${design.specialSauceNote}"`);
      s.push('> Ensure this specific detail is replicated perfectly in your output.');
    }
    s.push('');
  }

  // Inject known metadata as "seed hints"
  if (design.colors && design.colors.length > 0) {
    s.push('### Pre-Extracted Color Tokens (verify & expand):');
    design.colors.forEach(c => s.push(`- \`${c.hex}\` — ${c.label || 'unclassified'}`));
    s.push('');
  }
  if (design.tags && design.tags.length > 0) {
    s.push(`### Style Tags (seed hints): ${design.tags.join(', ')}`);
    s.push('');
  }
  if (design.focalComponents && design.focalComponents.length > 0) {
    s.push(`### Focal UI Components: ${design.focalComponents.join(', ')}`);
    s.push('For each focal component above, the extraction in Stage 1 must include its specific styling (borders, padding, typography, colors, shadows, interactive states).');
    s.push('');
  }
  if (design.aiAnalysis) {
    s.push('### EXTRACTED STYLE DNA:');
    s.push('The following per-component style analysis was extracted from the reference image. Use these values as your primary token source. Cross-check against the reference image for any discrepancies.');
    s.push('');
    s.push('```');
    s.push(design.aiAnalysis);
    s.push('```');
    s.push('');
  }

  // ============================================
  // STAGE 1 — DEEP TOKEN EXTRACTION MANDATE
  // ============================================
  s.push('---');
  s.push('## STAGE 1: FORENSIC TOKEN EXTRACTION');
  s.push('');
  s.push('Analyze the reference and extract the following with **exact values**. Do not approximate. If a value is ambiguous, state your best estimate with a confidence note.');
  s.push('');

  s.push('### 1.1 COLOR SYSTEM');
  s.push('- **Background Layers:** List every distinct background color from deepest surface to highest elevation (e.g., `#000000` → `#0a0a0a` → `#141414`).');
  s.push('- **Text Hierarchy:** Primary text color, secondary/muted text color, and tertiary/disabled text color with exact opacity values (e.g., `rgba(0,0,0,0.55)`).');
  s.push('- **Accent Colors:** Primary accent, secondary accent, success, warning, error colors.');
  s.push('- **Border Colors:** Extract border color AND opacity (e.g., `rgba(0,0,0,0.06)`).');
  s.push('- **Gradient Definitions:** If gradients are present, extract full `linear-gradient()` or `radial-gradient()` values including angle and color stops.');
  s.push('');

  s.push('### 1.2 TYPOGRAPHY');
  s.push('- **Font Family:** Identify the typeface(s) used — serif, sans-serif, monospace. Guess the closest Google Font match.');
  s.push('- **Font Scale:** List every distinct font-size used (heading 1-6, body, caption, label, badge).');
  s.push('- **Font Weights:** Which weights are used where (400, 500, 600, 700, 800)?');
  s.push('- **Letter-Spacing:** Identify tight (`-0.02em`), normal, or wide (`0.05em`) spacing per text level.');
  s.push('- **Line-Height:** Extract per text level (headings often 1.1-1.2, body 1.5-1.7).');
  s.push('- **Text Transform:** Where is `uppercase` used? Where is `capitalize`?');
  s.push('');

  s.push('### 1.3 SPACING & LAYOUT');
  s.push('- **Grid System:** Columns, gutters, max-width of content container.');
  s.push('- **Vertical Rhythm:** Spacing between sections (e.g., 48px, 64px, 80px).');
  s.push('- **Component Padding:** Internal padding of cards, buttons, inputs, modals.');
  s.push('- **Gap Patterns:** Flex/grid gap values between items (e.g., cards: 16px, badges: 8px).');
  s.push('');

  s.push('### 1.4 BORDERS & SURFACES');
  s.push('- **Border Width:** Extract exact pixel values (0.5px, 1px, 2px).');
  s.push('- **Border Style:** Solid, dashed, or none.');
  s.push('- **Border Opacity:** The alpha value if using rgba.');
  s.push('- **Border Radius:** Extract for every distinct element (buttons, cards, inputs, avatars, badges).');
  s.push('- **Surface Treatment:** Is there glassmorphism (`backdrop-filter: blur`)? Noise texture? Subtle gradient overlays?');
  s.push('');

  s.push('### 1.5 SHADOWS & DEPTH');
  s.push('- **Box-Shadow Values:** Full `box-shadow` shorthand for every distinct depth level (e.g., `0 4px 24px rgba(0,0,0,0.3)`).');
  s.push('- **Elevation Layers:** How many distinct z-levels exist? (flat surface, card, modal, tooltip).');
  s.push('- **Glow Effects:** Any `box-shadow` used for glow (spread with accent color)?');
  s.push('');

  s.push('### 1.6 INTERACTIVE STATES & MOTION');
  s.push('- **Hover States:** What changes on hover? (background shift, border glow, translateY, scale).');
  s.push('- **Transition Duration:** Extract timing (150ms, 200ms, 300ms) and easing (`ease-out`, `cubic-bezier`).');
  s.push('- **Active/Pressed States:** Scale down, darken, or color change?');
  s.push('- **Focus States:** Ring, outline, border change?');
  s.push('- **Animations:** Any entrance animations (fade-in, slide-up)? Stagger timing?');
  s.push('');

  s.push('### 1.7 MICRO-DETAILS');
  s.push('- **Icon Style:** Outline, filled, duotone? Size (14px, 16px, 20px)? Color treatment (monochrome, tinted)?');
  s.push('- **Badge/Chip Style:** Background opacity, padding, radius, font-size, font-weight.');
  s.push('- **Dividers/Separators:** `<hr>` style, border-top, or spacing-only?');
  s.push('- **Scrollbar:** Custom styled or default?');
  s.push('- **Selection Color:** Custom `::selection` styling?');
  s.push('');

  // ============================================
  // STAGE 2 — CSS VARIABLE OUTPUT
  // ============================================
  s.push('---');
  s.push('## STAGE 2: CSS DESIGN TOKEN OUTPUT');
  s.push('');
  s.push('After extraction, compile ALL tokens into a CSS custom properties block:');
  s.push('');
  s.push('```css');
  s.push(':root {');
  s.push('  /* Surfaces */');
  s.push('  --bg-base: [extracted];');
  s.push('  --bg-surface: [extracted];');
  s.push('  --bg-elevated: [extracted];');
  s.push('');
  s.push('  /* Text */');
  s.push('  --text-primary: [extracted];');
  s.push('  --text-secondary: [extracted];');
  s.push('  --text-tertiary: [extracted];');
  s.push('');
  s.push('  /* Accents */');
  s.push('  --accent-primary: [extracted];');
  s.push('  --accent-secondary: [extracted];');
  s.push('');
  s.push('  /* Borders */');
  s.push('  --border-subtle: [extracted];');
  s.push('  --border-medium: [extracted];');
  s.push('');
  s.push('  /* Radii */');
  s.push('  --radius-sm: [extracted];');
  s.push('  --radius-md: [extracted];');
  s.push('  --radius-lg: [extracted];');
  s.push('  --radius-xl: [extracted];');
  s.push('');
  s.push('  /* Shadows */');
  s.push('  --shadow-sm: [extracted];');
  s.push('  --shadow-md: [extracted];');
  s.push('  --shadow-lg: [extracted];');
  s.push('');
  s.push('  /* Typography */');
  s.push('  --font-sans: [extracted];');
  s.push('  --font-mono: [extracted];');
  s.push('');
  s.push('  /* Motion */');
  s.push('  --duration-fast: [extracted];');
  s.push('  --duration-normal: [extracted];');
  s.push('  --ease-out: [extracted];');
  s.push('}');
  s.push('```');
  s.push('');

  // ============================================
  // STAGE 3 — APPLICATION DIRECTIVE
  // ============================================
  s.push('---');
  s.push('## STAGE 3: APPLY DNA TO PROJECT');
  s.push('');
  if (design.useCase) {
    s.push(`**TARGET:** ${design.useCase}`);
    s.push('');
    if (design.selectedSections && design.selectedSections.length > 0) {
      s.push('### Required Sections (build all of these):');
      design.selectedSections.forEach((sec, i) => {
        s.push(`${i + 1}. **${sec.label}** — ${sec.desc}`);
      });
      s.push('');
      s.push('Build EVERY section listed above as a complete, styled component. Each section must use the extracted design tokens from this reference.');
    } else {
      s.push('Build the above using ONLY the extracted design tokens. The output must look like it belongs in the same design system as the reference.');
    }
  } else {
    s.push('**[No use case specified yet — describe what you want to build in the "Apply to Project" field]**');
  }
  s.push('');
  s.push('Implementation rules:');
  s.push('- Use ONLY the extracted design tokens — do not invent new colors, shadows, or spacing.');
  s.push('- Match the visual density and "breathability" of the original reference.');
  s.push('- Replicate the exact border treatment, radius curves, and surface hierarchy.');
  s.push('- Typography must use the same weight/size/spacing ratios as the reference.');
  s.push('- Interactive states must match the same hover/transition patterns.');
  s.push('- Output must be production-ready, complete code — not snippets.');
  s.push('- Use semantic HTML5 and CSS custom properties from the token block above.');
  s.push('- Add brief inline comments linking decisions back to extracted tokens.');
  s.push('');

  // ============================================
  // KNOWLEDGE INJECTIONS
  // ============================================
  if (design.knowledgeInjections && design.knowledgeInjections.length > 0) {
    s.push('---');
    s.push(formatKnowledgeInjections(design.knowledgeInjections));
  }

  // ============================================
  // ANTI-HALLUCINATION GUARD
  // ============================================
  s.push('---');
  s.push('## ⚠️ ANTI-HALLUCINATION RULES');
  s.push('- Do NOT invent styles that are not visible in the reference.');
  s.push('- Do NOT default to generic Bootstrap/Tailwind values — extract from the image.');
  s.push('- If a value cannot be determined, state "UNCERTAIN — best estimate: [value]".');
  s.push('- Every CSS property must be traceable back to a specific visual element in the reference.');

  return s.join('\n');
}

export function generateMasterPrompt(designs, project) {
  const s = [];

  s.push('# PROJECT AESTHETIC DNA SYNTHESIS');
  s.push('');
  s.push(`## Project: ${project.title}`);
  if (project.brief) {
    s.push('');
    s.push('### Project Brief');
    s.push(project.brief);
  }
  s.push('');
  s.push('You have been given multiple design references for this project.');
  s.push('Your job is to find the COMMON AESTHETIC DNA across all references and synthesize a unified visual system.');
  s.push('');
  s.push('> CRITICAL: Extract styles, not content. Find the patterns that repeat across references.');
  s.push('');

  // ============================================
  // INDIVIDUAL REFERENCE ANALYSIS
  // ============================================
  s.push('---');
  s.push(`## REFERENCE INVENTORY (${designs.length} total)`);
  s.push('');

  designs.forEach((d, i) => {
    s.push(`### Reference ${i + 1}: "${d.title}"`);
    if (d.url) s.push(`- URL: ${d.url}`);
    if (d.componentType) s.push(`- Component: **${d.componentType}**`);
    if (d.tags && d.tags.length) s.push(`- Style Tags: ${d.tags.join(', ')}`);
    if (d.notes) s.push(`- Notes: ${d.notes}`);
    if (d.colors && d.colors.length) s.push(`- Colors: ${d.colors.map(c => `\`${c.hex}\``).join(', ')}`);
    s.push('');
    s.push('**For this reference, extract:** Color hierarchy, typography scale, border treatment, shadow depth, spacing rhythm, and interactive states.');
    s.push('');
  });

  // ============================================
  // SYNTHESIS DIRECTIVE
  // ============================================
  s.push('---');
  s.push('## SYNTHESIS TASK');
  s.push('');
  s.push('After analyzing all references individually:');
  s.push('1. Identify the **dominant color palette** that appears across 2+ references.');
  s.push('2. Identify the **dominant typography pattern** (weight, spacing, scale).');
  s.push('3. Identify the **dominant surface treatment** (dark/light, glassmorphism, flat, etc).');
  s.push('4. Identify the **dominant border/radius convention**.');
  s.push('5. Compile into a UNIFIED `:root` CSS variable block.');
  s.push('');

  // Aggregate colors
  const allColors = designs.flatMap(d => d.colors || []);
  if (allColors.length) {
    s.push('### Pre-Extracted Color Pool (verify & deduplicate):');
    const unique = [...new Map(allColors.map(c => [c.hex, c])).values()];
    unique.forEach(c => s.push(`- \`${c.hex}\` — ${c.label || ''}`));
    s.push('');
  }

  // Aggregate tags
  const allTags = designs.flatMap(d => d.tags || []);
  const uniqueTags = [...new Set(allTags)];
  if (uniqueTags.length) {
    s.push(`### Combined Style Direction: ${uniqueTags.join(', ')}`);
    s.push('');
  }

  // Aggregate Project Assets
  const projectAssets = designs.filter(d => d.componentType === 'project-asset');
  if (projectAssets.length > 0) {
    s.push('### 🖼️ FINALIZED BRAND ASSETS & ILLUSTRATIONS');
    s.push('The following assets have been generated and approved for this project. You MUST integrate these assets into the UI code (e.g., as hero illustrations, background textures, or avatar placeholders) using the context provided:');
    projectAssets.forEach((a, i) => {
      s.push(`${i + 1}. **Asset**: "${a.title}"`);
      if (a.notes) s.push(`   - **Usage Context**: ${a.notes}`);
      if (a.url) s.push(`   - **URL/Source**: \`${a.url}\``);
    });
    s.push('');
    s.push('> IMPORTANT: Do not use generic placeholders like "image.jpg" if an asset above fits the context. Use the specific context and URLs provided above.');
    s.push('');
  }

  s.push('---');
  s.push('## FINAL OUTPUT');
  s.push('');
  s.push('Using the synthesized design system, build **[DESCRIBE YOUR USE CASE HERE]** with:');
  s.push('- The unified CSS custom properties block as the styling foundation.');
  s.push('- Visual density and rhythm matching the dominant reference.');
  s.push('- All interactive states replicated from the reference patterns.');
  s.push('- Production-ready, complete code with inline comments linking to extracted tokens.');
  s.push('');
  s.push('> ⚠️ Do NOT hallucinate styles. Every property must be traceable to at least one reference.');

  return s.join('\n');
}
