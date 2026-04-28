// DesignVault — Asset (Illustration) Prompt Engine
// Generates Midjourney/DALL-E optimized prompts that sync with the UI's Aesthetic DNA.

export function generateAssetPrompt(subject, project, references) {
  const s = [];

  // Core Subject
  s.push(subject);

  // Synthesize Project Aesthetic DNA
  // We want the illustration to match the project's vibe.
  const vibes = [];
  const features = [];
  const colors = new Set();

  // Extract from the project's saved designs (UI references)
  if (project.designIds && project.designIds.length > 0) {
    // If the project object passed includes populated designs, we can extract from them.
    // Assuming `project.populatedDesigns` exists (we will attach it before calling this).
    if (project.populatedDesigns) {
      project.populatedDesigns.forEach(d => {
        if (d.aestheticVibes) d.aestheticVibes.forEach(v => vibes.push(v));
        if (d.aestheticFeatures) d.aestheticFeatures.forEach(f => features.push(f));
        if (d.colors) d.colors.forEach(c => colors.add(c.hex));
        if (d.palette) d.palette.forEach(c => colors.add(c));
      });
    }
  }

  // Deduplicate and get top vibes/features
  const topVibes = [...new Set(vibes)].slice(0, 3);
  const topFeatures = [...new Set(features)].filter(f => f.includes('Gradients') || f.includes('Colors') || f.includes('Shape') || f.includes('Minimal')).slice(0, 3);
  const topColors = [...colors].slice(0, 4);

  // Style Modifiers
  if (topVibes.length > 0) {
    s.push(`${topVibes.join(', ')} UI design asset style`);
  } else {
    s.push(`modern UI design asset style`);
  }

  if (topFeatures.length > 0) {
    s.push(`featuring ${topFeatures.join(', ')}`);
  }

  // Medium / Engine Directives
  s.push('clean geometric shapes');
  s.push('high quality vector illustration style');
  s.push('isolated on white background'); // Helps with UI integration

  // Color Constraints
  if (topColors.length > 0) {
    s.push(`strict color palette: ${topColors.join(', ')}`);
  }

  // Reference Instructions (Midjourney Image Prompts)
  let prefix = '';
  if (references && references.length > 0) {
    const urls = references.filter(r => r.url || r.imageData).map(r => r.url || '<image_url>');
    if (urls.length > 0) {
      prefix = urls.join(' ') + ' ';
    }
  }

  // Parameters (Midjourney specific)
  s.push('--ar 16:9 --v 6.0 --stylize 250 --no text, fonts, letters, watermark');

  return prefix + s.join(', ');
}
