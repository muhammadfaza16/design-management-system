// DesignVault — Helpers
export function formatDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s / 86400)}d ago`;
  return formatDate(ts);
}
export function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
export const COMPONENT_TYPES = [
  'hero', 'navbar', 'footer', 'card', 'pricing', 'dashboard',
  'form', 'landing', 'sidebar', 'modal', 'table', 'profile', 'settings', 'checkout', 'blog', 'portfolio', 'other'
];
export const STYLE_TAGS = [
  'glassmorphism', 'dark-mode', 'minimalist', 'brutalist', 'gradient',
  '3d', 'animated', 'retro', 'neon', 'pastel', 'bold-typography', 'illustration', 'flat', 'neumorphism'
];
export const TAG_COLORS = {
  hero: '', navbar: '--purple', footer: '--green', card: '--amber',
  pricing: '--pink', dashboard: '', landing: '--purple', default: ''
};
export function getTagColor(tag) {
  return TAG_COLORS[tag] || ['', '--purple', '--green', '--amber', '--pink'][Math.abs(hashCode(tag)) % 5];
}
function hashCode(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}

// Feature 1: Design DNA Extraction
export async function extractColorsFromImage(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Downscale for performance
      canvas.width = 100;
      canvas.height = (img.height / img.width) * 100;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts = {};
      
      for (let i = 0; i < imgData.length; i += 4) {
        let r = imgData[i];
        let g = imgData[i + 1];
        let b = imgData[i + 2];
        const a = imgData[i + 3];
        
        if (a < 128) continue; // Skip transparent
        
        // Cluster colors by rounding to nearest 32 to group similar shades
        r = Math.floor(r / 32) * 32;
        g = Math.floor(g / 32) * 32;
        b = Math.floor(b / 32) * 32;
        
        // Avoid pure white/black taking over everything
        if ((r > 240 && g > 240 && b > 240) || (r < 20 && g < 20 && b < 20)) continue;
        
        const hex = rgbToHex(r, g, b);
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }
      
      const sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => entry[0]);
        
      resolve(sortedColors.length ? sortedColors : ['#ffffff', '#000000']);
    };
    img.onerror = () => resolve([]);
    img.src = dataUrl;
  });
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
