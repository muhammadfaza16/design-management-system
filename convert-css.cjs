const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'styles', 'components.css');
let content = fs.readFileSync(file, 'utf8');

// Replace all hardcoded light mode values with CSS variables
content = content.replace(/rgba\(0,0,0,/g, 'rgba(var(--text-rgb),');
content = content.replace(/#1a1a1a/g, 'var(--text-primary)');
content = content.replace(/#ffffff/g, 'var(--bg-surface)');
content = content.replace(/#f0eeeb/g, 'var(--bg-thumb-design)');

// Some specific overrides for backgrounds/borders
content = content.replace(/background: rgba\(var\(--text-rgb\),0.02\)/g, 'background: var(--bg-card)');
content = content.replace(/background: rgba\(var\(--text-rgb\),0.03\)/g, 'background: var(--bg-input)');
content = content.replace(/background: rgba\(var\(--text-rgb\),0.04\)/g, 'background: var(--bg-input)');

// Icon filters
content = content.replace(/filter: brightness\(0\) invert\(1\)/g, 'filter: var(--icon-primary-filter)');
content = content.replace(/filter: none/g, 'filter: var(--icon-filter)');

fs.writeFileSync(file, content);

const animFile = path.join(__dirname, 'src', 'styles', 'animations.css');
let animContent = fs.readFileSync(animFile, 'utf8');
animContent = animContent.replace(/#f0eeeb/g, 'var(--bg-elevated)');
animContent = animContent.replace(/#e8e6e3/g, 'rgba(var(--text-rgb), 0.04)');
fs.writeFileSync(animFile, animContent);

console.log('Conversion complete');
