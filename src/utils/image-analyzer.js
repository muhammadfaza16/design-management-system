// DesignVault — Client-Side Image Analyzer
// Extracts color palette, suggests tags, component type, focal components, and title.
// Zero AI, zero API — pure Canvas pixel analysis.

export const FOCAL_COMPONENTS = [
  'navbar', 'hero-banner', 'cta-button', 'feature-grid', 'card-list',
  'pricing-table', 'testimonials', 'footer', 'sidebar', 'search-bar',
  'modal-dialog', 'form-input', 'stats-counter', 'logo-cloud', 'tabs',
  'breadcrumb', 'avatar', 'badge', 'toggle', 'notification',
  'image-gallery', 'video-embed', 'social-links', 'accordion', 'stepper',
];

/**
 * Analyze an image and return smart suggestions for form fields.
 * @param {string} base64 - base64 data URL of the image
 * @param {string} fileName - original filename (for title suggestion)
 * @returns {Promise<Object>} suggestions
 */
export async function analyzeImage(base64, fileName = '') {
  const img = await loadImage(base64);
  const { width, height } = img;
  const pixels = samplePixels(img, 5000);
  const dominantColors = extractDominantColors(pixels, 6);
  const avgLuminance = getAverageLuminance(pixels);
  const avgSaturation = getAverageSaturation(pixels);
  const aspectRatio = width / height;

  const componentType = suggestComponentType(aspectRatio);
  const tags = suggestTags(avgLuminance, avgSaturation, dominantColors, aspectRatio);
  const colorEntries = dominantColors.map(c => ({
    hex: rgbToHex(c.r, c.g, c.b),
    label: labelColor(c),
  }));

  return {
    title: suggestTitle({ tags, colors: colorEntries, luminance: avgLuminance, saturation: avgSaturation }),
    colors: colorEntries,
    tags,
    componentType,
    focalComponents: [],
    meta: {
      width, height, aspectRatio: aspectRatio.toFixed(2),
      luminance: avgLuminance.toFixed(2),
      saturation: avgSaturation.toFixed(2),
    },
  };
}

// ==========================================
// IMAGE LOADING
// ==========================================
function loadImage(base64) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

// ==========================================
// PIXEL SAMPLING (via offscreen Canvas)
// ==========================================
function samplePixels(img, sampleCount = 5000) {
  const canvas = document.createElement('canvas');
  // Downsample for performance
  const scale = Math.min(1, 200 / Math.max(img.width, img.height));
  canvas.width = Math.floor(img.width * scale);
  canvas.height = Math.floor(img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const totalPixels = canvas.width * canvas.height;
  const step = Math.max(1, Math.floor(totalPixels / sampleCount));

  const pixels = [];
  for (let i = 0; i < totalPixels; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    if (a < 128) continue; // skip transparent
    pixels.push({ r, g, b });
  }
  return pixels;
}

// ==========================================
// COLOR CLUSTERING (Median Cut simplified)
// ==========================================
function extractDominantColors(pixels, count = 6) {
  if (pixels.length === 0) return [];

  // Quantize to reduce noise
  const quantized = pixels.map(p => ({
    r: Math.round(p.r / 16) * 16,
    g: Math.round(p.g / 16) * 16,
    b: Math.round(p.b / 16) * 16,
  }));

  // Count frequency
  const freq = {};
  quantized.forEach(p => {
    const key = `${p.r},${p.g},${p.b}`;
    freq[key] = (freq[key] || 0) + 1;
  });

  // Sort by frequency
  const sorted = Object.entries(freq)
    .map(([key, count]) => {
      const [r, g, b] = key.split(',').map(Number);
      return { r, g, b, count };
    })
    .sort((a, b) => b.count - a.count);

  // Filter out colors too close to each other
  const result = [];
  for (const color of sorted) {
    if (result.length >= count) break;
    const tooClose = result.some(existing =>
      colorDistance(existing, color) < 60
    );
    if (!tooClose) result.push(color);
  }

  return result;
}

function colorDistance(a, b) {
  return Math.sqrt(
    (a.r - b.r) ** 2 +
    (a.g - b.g) ** 2 +
    (a.b - b.b) ** 2
  );
}

// ==========================================
// COLOR UTILITIES
// ==========================================
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function getLuminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getAverageLuminance(pixels) {
  if (pixels.length === 0) return 0.5;
  const sum = pixels.reduce((acc, p) => acc + getLuminance(p.r, p.g, p.b), 0);
  return sum / pixels.length;
}

function getAverageSaturation(pixels) {
  if (pixels.length === 0) return 0;
  const sum = pixels.reduce((acc, p) => {
    const { s } = rgbToHsl(p.r, p.g, p.b);
    return acc + s;
  }, 0);
  return sum / pixels.length;
}

// ==========================================
// SMART LABELING
// ==========================================
function labelColor(color) {
  const { h, s, l } = rgbToHsl(color.r, color.g, color.b);

  // Neutrals
  if (s < 8) {
    if (l < 10) return 'deep-black';
    if (l < 25) return 'dark-surface';
    if (l < 45) return 'mid-gray';
    if (l < 70) return 'light-gray';
    if (l < 90) return 'off-white';
    return 'white';
  }

  // Chromatic
  let hueLabel;
  if (h < 15 || h >= 345) hueLabel = 'red';
  else if (h < 35) hueLabel = 'orange';
  else if (h < 65) hueLabel = 'yellow';
  else if (h < 160) hueLabel = 'green';
  else if (h < 200) hueLabel = 'cyan';
  else if (h < 260) hueLabel = 'blue';
  else if (h < 300) hueLabel = 'purple';
  else hueLabel = 'pink';

  // Intensity
  if (l < 25) return `dark-${hueLabel}`;
  if (l > 75) return `light-${hueLabel}`;
  if (s > 70) return `vivid-${hueLabel}`;
  return `${hueLabel}-accent`;
}

function suggestTitle({ tags, colors, luminance, saturation }) {
  const parts = [];

  // Part 1: Theme (Dark / Light / Neutral)
  if (luminance < 0.25) parts.push('Dark');
  else if (luminance > 0.7) parts.push('Light');
  else parts.push('Neutral');

  // Part 2: Style modifier (from tags)
  if (tags.includes('minimalist')) parts.push('Minimalist');
  else if (tags.includes('neon')) parts.push('Neon');
  else if (tags.includes('pastel')) parts.push('Pastel');
  else if (tags.includes('vivid-colors')) parts.push('Vivid');
  else if (tags.includes('monochrome')) parts.push('Mono');
  else if (tags.includes('gradient')) parts.push('Gradient');

  parts.push('Reference');

  // Part 4: Accent color descriptor (find first chromatic color)
  const accent = colors.find(c =>
    !c.label.includes('black') &&
    !c.label.includes('white') &&
    !c.label.includes('gray') &&
    !c.label.includes('surface')
  );

  if (accent) {
    // Extract the base hue name from the label (e.g., "vivid-blue" → "Blue")
    const hueName = accent.label
      .replace(/^(dark-|light-|vivid-)/, '')
      .replace(/-accent$/, '');
    const capitalized = hueName.charAt(0).toUpperCase() + hueName.slice(1);
    parts.push(`— ${capitalized} Accent`);
  } else if (tags.includes('gradient')) {
    parts.push('— Gradient');
  }

  return parts.join(' ');
}

function suggestTags(luminance, saturation, colors, aspectRatio) {
  const tags = [];

  // Theme detection
  if (luminance < 0.25) tags.push('dark-mode');
  else if (luminance > 0.75) tags.push('light-mode');

  // Saturation-based
  if (saturation > 50) tags.push('vivid-colors');
  else if (saturation < 15) tags.push('monochrome');

  // Color variety
  const chromatic = colors.filter(c => {
    const { s } = rgbToHsl(c.r, c.g, c.b);
    return s > 20;
  });
  if (chromatic.length >= 4) tags.push('colorful');
  if (chromatic.length <= 1) tags.push('minimalist');

  // Check for gradient potential (high color variety in similar hues)
  if (chromatic.length >= 2) {
    const hues = chromatic.map(c => rgbToHsl(c.r, c.g, c.b).h);
    const hueRange = Math.max(...hues) - Math.min(...hues);
    if (hueRange < 60 && hueRange > 10) tags.push('gradient');
  }

  // Check for neon/glow (very saturated + dark background)
  if (luminance < 0.3 && chromatic.some(c => {
    const { s, l } = rgbToHsl(c.r, c.g, c.b);
    return s > 70 && l > 40 && l < 70;
  })) {
    tags.push('neon');
  }

  // Pastel detection
  const pastels = chromatic.filter(c => {
    const { s, l } = rgbToHsl(c.r, c.g, c.b);
    return s > 20 && s < 60 && l > 60 && l < 85;
  });
  if (pastels.length >= 2) tags.push('pastel');

  return tags;
}

// Rough aspect-ratio suggestion — overridden by AI analysis
function suggestComponentType(ratio) {
  if (ratio > 1.8) return 'hero';
  if (ratio > 1.3) return 'landing';
  if (ratio > 0.8) return 'card';
  if (ratio > 0.5) return 'sidebar';
  return 'landing';
}
