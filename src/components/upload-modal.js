// DesignVault — Upload / Edit Modal
import { addDesign, updateDesign } from '../db/store.js';
import { fileToBase64, COMPONENT_TYPES, STYLE_TAGS, getTagColor } from '../utils/helpers.js';
import { analyzeImage } from '../utils/image-analyzer.js';
import { showToast } from './toast.js';

/**
 * Opens the design modal in create or edit mode.
 * @param {Function} onComplete - callback after save
 * @param {Object|null} existing - if provided, opens in EDIT mode
 */
export function openUploadModal(onComplete, existing = null) {
  const root = document.getElementById('modal-root');
  const isEdit = !!existing;
  let imageData = existing?.imageData || null;
  let selectedTags = existing?.tags ? [...existing.tags] : [];
  let colors = existing?.colors ? [...existing.colors] : [];
  let focalComponents = existing?.focalComponents ? [...existing.focalComponents] : [];

  const tagOptions = [...STYLE_TAGS, ...COMPONENT_TYPES.slice(0, 6)];

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal" id="upload-modal">
      <div class="modal__header">
        <h2 class="modal__title">
          <img src="/src/assets/icons/${isEdit ? 'nav-library' : 'action-add'}.svg" class="illustrative-icon" alt="" />
          ${isEdit ? 'Edit Design Reference' : 'Add Design Reference'}
        </h2>
        <button class="btn-icon" id="modal-close">
          <img src="/src/assets/icons/status-error.svg" class="illustrative-icon" alt="Close" />
        </button>
      </div>
      <div class="modal__body">
        <div class="modal__field">
          <label class="modal__label">Screenshot</label>
          <div class="drop-zone" id="drop-zone">
            ${imageData ? `
              <img class="drop-zone__preview" src="${imageData}" alt="Preview" />
              <div class="drop-zone__text" style="margin-top:8px">Click or drop to replace</div>
            ` : `
              <div class="drop-zone__icon">
                <img src="/src/assets/icons/nav-library.svg" class="illustrative-icon illustrative-icon--lg" alt="Upload" />
              </div>
              <div class="drop-zone__text">Drop image here or <strong>click to browse</strong></div>
            `}
            <input type="file" accept="image/*" id="file-input" style="display:none" />
          </div>
        </div>
        <div class="modal__field">
          <label class="modal__label">Title</label>
          <input type="text" id="design-title" placeholder="e.g. Stripe Landing Hero" value="${existing?.title || ''}" />
        </div>
        <div class="modal__field">
          <label class="modal__label">Source URL</label>
          <input type="url" id="design-url" placeholder="https://..." value="${existing?.url || ''}" />
        </div>
        <div class="modal__field">
          <label class="modal__label">Component Type</label>
          <select id="design-component">
            <option value="">Select type...</option>
            ${COMPONENT_TYPES.map(t => `<option value="${t}" ${existing?.componentType === t ? 'selected' : ''}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('')}
          </select>
        </div>

        <!-- AI EXTRACTION SECTION — shown after image upload -->
        <div id="ai-extraction-section" style="${imageData || isEdit ? '' : 'display:none'}">
          <div style="border-top:1px solid rgba(0,0,0,0.06);margin:16px 0"></div>
          <div class="modal__field">
            <label class="modal__label">
              <img src="/src/assets/icons/ai-prompt.svg" class="illustrative-icon" alt="" style="vertical-align:middle;margin-right:4px" />
              AI Extraction
              <span style="opacity:0.4;font-weight:400;text-transform:none;letter-spacing:0">(one-shot complete analysis)</span>
            </label>
            <p style="font-size:11px;color:rgba(0,0,0,0.4);margin:0 0 10px">Copy the prompt below and paste it into your AI tool. The reference image will be copied to your clipboard alongside the prompt.</p>
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">
              <button class="btn btn-primary" id="copy-ai-bundle" type="button" style="font-size:12px;padding:6px 14px">
                <img src="/src/assets/icons/action-copy.svg" class="illustrative-icon" alt="" />
                Copy Prompt + Image
              </button>
              <button class="btn btn-secondary" id="copy-ai-text-only" type="button" style="font-size:12px;padding:6px 14px">
                Copy Text Only
              </button>
            </div>
            <textarea id="ai-extraction-prompt" rows="5" spellcheck="false" readonly
              style="font-size:11px;font-family:var(--font-mono);line-height:1.5;color:rgba(0,0,0,0.45);cursor:default;resize:none"></textarea>
          </div>
          <div class="modal__field">
            <label class="modal__label">AI Response <span style="opacity:0.4;font-weight:400;text-transform:none;letter-spacing:0">(paste full response, auto-fills everything)</span></label>
            <textarea id="design-ai-analysis" rows="6" placeholder="After pasting the prompt + image into your AI tool, copy the full response and paste it here. All fields will auto-populate from the analysis.">${existing?.aiAnalysis || ''}</textarea>
          </div>
          <div class="gen-chip-row" id="focal-chips" style="margin-bottom:10px"></div>
        </div>

        <div class="modal__field">
          <label class="modal__label">Notes</label>
          <textarea id="design-notes" placeholder="Your own observations — what do you like? What elements to replicate?" rows="2">${existing?.notes || ''}</textarea>
        </div>
        <div class="modal__field">
          <label class="modal__label">Tags</label>
          <div class="tag-input-wrap" id="tag-wrap">
            <input type="text" id="tag-input" placeholder="Type and press Enter..." />
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px">
            ${tagOptions.map(t => `<button class="filter-chip tag-suggestion ${selectedTags.includes(t) ? 'active' : ''}" data-tag="${t}">${t}</button>`).join('')}
          </div>
        </div>
        <div class="modal__field">
          <label class="modal__label">Extracted Palette <span style="opacity:0.4;font-weight:400;text-transform:none;letter-spacing:0">(auto-detected · click swatch to remove)</span></label>
          <div class="color-palette" id="color-palette" style="margin-bottom:8px"></div>
          <div id="color-manual-toggle">
            <button class="btn btn-ghost" id="show-color-picker" type="button" style="font-size:11px;padding:4px 10px">+ Add manually</button>
          </div>
          <div id="color-manual-row" style="display:none;margin-top:8px">
            <div style="display:flex;gap:8px;align-items:center">
              <input type="color" id="color-picker" value="#00d4ff" style="width:36px;height:36px;padding:2px;border-radius:8px;cursor:pointer;border:1px solid rgba(0,0,0,0.1)" />
              <input type="text" id="color-label" placeholder="Label (e.g. accent)" style="max-width:140px" />
              <button class="btn btn-secondary" id="add-color-btn" type="button" style="font-size:12px;padding:6px 14px">Add</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__footer">
        <button class="btn btn-secondary" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-save">
          <img src="/src/assets/icons/misc-brief.svg" class="illustrative-icon illustrative-icon--sm" alt="" />
          ${isEdit ? 'Update Design' : 'Save Design'}
        </button>
      </div>
    </div>
  `;

  root.appendChild(backdrop);

  const $ = (sel) => backdrop.querySelector(sel);

  // Close
  const close = () => { backdrop.style.animation = 'fadeOut 200ms ease forwards'; setTimeout(() => backdrop.remove(), 200); };
  $('#modal-close').addEventListener('click', close);
  $('#modal-cancel').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  // Drop zone
  const dropZone = $('#drop-zone');
  const fileInput = $('#file-input');
  dropZone.addEventListener('click', (e) => { if (e.target !== fileInput) fileInput.click(); });
  dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      imageData = await fileToBase64(file);
      showPreview();
      if (!isEdit) await processImage(file.name);
    }
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (file) {
      imageData = await fileToBase64(file);
      showPreview();
      if (!isEdit) await processImage(file.name);
    }
  });

  // Smart analysis — auto-populate form from image + generate AI prompt
  async function processImage(fileName) {
    try {
      showToast('Analyzing image...', 'info');
      const suggestions = await analyzeImage(imageData, fileName);

      // Title (only if empty)
      const titleInput = $('#design-title');
      if (!titleInput.value.trim() && suggestions.title) {
        titleInput.value = suggestions.title;
      }

      // Component type (only if not set)
      const compSelect = $('#design-component');
      if (!compSelect.value && suggestions.componentType) {
        compSelect.value = suggestions.componentType;
      }

      // Colors (merge, don't replace)
      if (suggestions.colors && suggestions.colors.length > 0) {
        suggestions.colors.forEach(c => {
          const alreadyExists = colors.some(existing => existing.hex === c.hex);
          if (!alreadyExists) colors.push(c);
        });
        renderColors();
      }

      // Tags (merge, don't replace)
      if (suggestions.tags && suggestions.tags.length > 0) {
        suggestions.tags.forEach(t => {
          if (!selectedTags.includes(t)) selectedTags.push(t);
        });
        renderTags();
        backdrop.querySelectorAll('.tag-suggestion').forEach(btn => {
          btn.classList.toggle('active', selectedTags.includes(btn.dataset.tag));
        });
      }

      showToast(`Detected: ${suggestions.colors.length} colors, ${suggestions.tags.length} tags`, 'success');

      // Show AI extraction section and generate the prompt
      showAiSection();
    } catch (err) {
      console.warn('Image analysis failed:', err);
    }
  }

  function showPreview() {
    dropZone.innerHTML = `<img class="drop-zone__preview" src="${imageData}" alt="Preview" />
      <div class="drop-zone__text" style="margin-top:8px">Click or drop to replace</div>
      <input type="file" accept="image/*" id="file-input" style="display:none" />`;
    const newInput = backdrop.querySelector('#file-input');
    newInput.addEventListener('change', async () => {
      const file = newInput.files[0];
      if (file) {
        imageData = await fileToBase64(file);
        showPreview();
        if (!isEdit) await processImage(file.name);
      }
    });
  }

  // =============================================
  // AI EXTRACTION — one-shot comprehensive prompt
  // =============================================
  function buildExtractionPrompt() {
    const url = $('#design-url').value.trim();
    const colorHints = colors.map(c => `${c.hex} (${c.label})`).join(', ');
    const tagHints = selectedTags.join(', ');

    return `You are a Visual Systems Engineer. The DESIGN SCREENSHOT attached is your PRIMARY SOURCE OF TRUTH.${url ? `\nReference URL: ${url}` : ''}

## YOUR TASK
Perform a COMPLETE visual style extraction. This is a ONE-SHOT analysis — your response must contain EVERYTHING needed to replicate this design's aesthetics for a different project.

${colorHints ? `## AUTO-DETECTED HINTS (verify against the image)\n- Colors detected: ${colorHints}\n- Style tags: ${tagHints}\nThese were extracted via pixel analysis. Verify, correct, and expand them.\n` : ''}
## EXTRACTION PROTOCOL

### A. GLOBAL DESIGN TOKENS
Extract as CSS custom properties (\`:root {}\`):
- Color palette: every color with semantic names (--color-bg-primary, --color-text-body, --color-accent, etc)
- Typography: font-family (closest Google Font), base size, scale ratio, weights used
- Spacing scale: padding/margin/gap values
- Border tokens: radius values, border-width, border-color patterns
- Shadow tokens: all box-shadow values
- Transition/animation: timing, easing, duration

### B. COMPONENT-LEVEL AUDIT
For EVERY distinct UI component visible:

#### [Component Name]
- **Background:** exact hex/rgba, gradient syntax, backdrop-filter
- **Typography:** font-family, size (px), weight, line-height, letter-spacing, color, text-transform
- **Spacing:** padding, margin, gap (exact px values)
- **Borders:** width, style, color with opacity, border-radius
- **Shadows:** full box-shadow shorthand
- **Layout:** display method, alignment, width constraints, responsive hints
- **Interactive states:** hover/focus color shifts, transitions
- **Micro-details:** icon size/style, badge treatment, divider style, unique treatments

### C. OVERALL COMPOSITION
- Layout system: grid columns, max-width, gutter size
- Visual hierarchy: what draws the eye first, second, third
- Color distribution: dominant/secondary/accent ratios
- Whitespace rhythm: spacing pattern between sections

## OUTPUT FORMAT
1. Start with the full \`:root {}\` CSS custom properties block
2. Then per-component breakdowns using ### headers
3. End with: \`COMPONENTS: component-1, component-2, ...\` (comma-separated list of all component names)
4. Last line: \`TYPE: [single word]\` — the primary component type (one of: hero, navbar, footer, card, pricing, dashboard, form, landing, sidebar, modal, table, profile, settings, checkout, blog, portfolio, other)

Be EXACT with CSS values — px, rem, hex, rgba. Do NOT describe content (text copy, images, logos). Extract ONLY visual styling. Flag uncertain values with [ESTIMATED].`;
  }

  function showAiSection() {
    const section = $('#ai-extraction-section');
    section.style.display = '';
    $('#ai-extraction-prompt').value = buildExtractionPrompt();
  }

  // Update prompt when URL changes
  const urlInput = $('#design-url');
  urlInput.addEventListener('input', () => {
    if ($('#ai-extraction-section').style.display !== 'none') {
      $('#ai-extraction-prompt').value = buildExtractionPrompt();
    }
  });

  // Copy Prompt + Image (uses ClipboardItem API)
  $('#copy-ai-bundle').addEventListener('click', async () => {
    const promptText = $('#ai-extraction-prompt').value;
    if (!promptText) { showToast('Upload an image first', 'error'); return; }

    try {
      if (imageData) {
        // Try to copy both text + image via ClipboardItem API
        const response = await fetch(imageData);
        const blob = await response.blob();
        const textBlob = new Blob([promptText], { type: 'text/plain' });

        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            [blob.type]: blob,
          })
        ]);
        showToast('Prompt + image copied! Paste directly into your AI tool.', 'success');
      } else {
        await navigator.clipboard.writeText(promptText);
        showToast('Prompt copied (no image to bundle)', 'info');
      }
    } catch (err) {
      // Fallback: copy text only
      console.warn('ClipboardItem failed, falling back to text:', err);
      await navigator.clipboard.writeText(promptText);
      showToast('Prompt copied! Attach the image manually in your AI tool.', 'info');
    }
  });

  // Copy text only
  $('#copy-ai-text-only').addEventListener('click', async () => {
    const promptText = $('#ai-extraction-prompt').value;
    if (!promptText) { showToast('Upload an image first', 'error'); return; }
    await navigator.clipboard.writeText(promptText);
    showToast('Prompt text copied!', 'success');
  });

  // Show section if editing with existing data
  if (isEdit && (imageData || existing?.aiAnalysis)) {
    showAiSection();
  }

  // =============================================
  // TAGS
  // =============================================
  const tagInput = $('#tag-input');
  const tagWrap = $('#tag-wrap');

  function renderTags() {
    tagWrap.querySelectorAll('.badge').forEach(b => b.remove());
    selectedTags.forEach(t => {
      const badge = document.createElement('span');
      badge.className = `badge badge${getTagColor(t)}`;
      badge.textContent = t;
      badge.title = 'Click to remove';
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', () => { selectedTags = selectedTags.filter(x => x !== t); renderTags(); });
      tagWrap.insertBefore(badge, tagInput);
    });
  }
  if (isEdit) renderTags();

  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && tagInput.value.trim()) {
      e.preventDefault();
      const val = tagInput.value.trim().toLowerCase();
      if (!selectedTags.includes(val)) { selectedTags.push(val); renderTags(); }
      tagInput.value = '';
    }
    if (e.key === 'Backspace' && !tagInput.value && selectedTags.length) {
      selectedTags.pop(); renderTags();
    }
  });

  backdrop.querySelectorAll('.tag-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.tag;
      if (!selectedTags.includes(t)) { selectedTags.push(t); renderTags(); }
      else { selectedTags = selectedTags.filter(x => x !== t); renderTags(); }
      btn.classList.toggle('active', selectedTags.includes(t));
    });
  });

  // =============================================
  // FOCAL COMPONENTS (dynamic from AI response)
  // =============================================
  const focalChipsEl = $('#focal-chips');

  function renderFocalChips() {
    focalChipsEl.innerHTML = focalComponents.map(f =>
      `<button class="filter-chip focal-chip active" data-focal="${f}">${f}</button>`
    ).join('');
    focalChipsEl.querySelectorAll('.focal-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        focalComponents = focalComponents.filter(x => x !== btn.dataset.focal);
        renderFocalChips();
      });
    });
  }
  renderFocalChips();

  // =============================================
  // AI RESPONSE AUTO-PARSE
  // =============================================
  $('#design-ai-analysis').addEventListener('input', debounceAnalysisParse());
  function debounceAnalysisParse() {
    let timer;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => parseAiAnalysis(), 600);
    };
  }

  function parseAiAnalysis() {
    const text = $('#design-ai-analysis').value;
    if (!text || text.length < 50) return;

    let changed = false;

    // Parse COMPONENTS: line
    const compLine = text.match(/^COMPONENTS?:\s*(.+)$/im);
    if (compLine) {
      const items = compLine[1].split(/[,]+/)
        .map(s => s.trim().toLowerCase().replace(/\s+/g, '-'))
        .filter(s => s.length > 1 && s.length < 40);
      items.forEach(f => {
        if (!focalComponents.includes(f)) { focalComponents.push(f); changed = true; }
      });
    }

    // Parse ### headers as component names
    const headers = text.matchAll(/^###\s+(.+)$/gm);
    for (const match of headers) {
      const name = match[1].trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      if (name.length > 1 && name.length < 40 && !focalComponents.includes(name)) {
        focalComponents.push(name);
        changed = true;
      }
    }

    // Parse TYPE: line → auto-set component type
    const typeLine = text.match(/^TYPE:\s*(.+)$/im);
    if (typeLine) {
      const typeVal = typeLine[1].trim().toLowerCase();
      const compSelect = $('#design-component');
      const compOptions = [...compSelect.options].map(o => o.value).filter(Boolean);
      if (compOptions.includes(typeVal)) {
        compSelect.value = typeVal;
      }
    }

    // Parse color values from :root block or inline
    const hexMatches = text.matchAll(/(#[0-9a-fA-F]{6})\b/g);
    const foundHexes = new Set();
    for (const m of hexMatches) {
      const hex = m[1].toLowerCase();
      if (!foundHexes.has(hex)) {
        foundHexes.add(hex);
        const alreadyExists = colors.some(c => c.hex.toLowerCase() === hex);
        if (!alreadyExists && colors.length < 12) {
          // Try to find a label near this hex in the text
          const labelMatch = text.match(new RegExp(`(--[\\w-]+)\\s*:\\s*${hex.replace('#', '#')}`, 'i'));
          colors.push({ hex, label: labelMatch ? labelMatch[1].replace('--', '') : 'ai-detected' });
          changed = true;
        }
      }
    }

    if (changed) {
      renderFocalChips();
      renderColors();

      // Auto-set component type from first matching focal if not set by TYPE:
      if (!typeLine) {
        const compSelect = $('#design-component');
        if (!compSelect.value) {
          const compOptions = [...compSelect.options].map(o => o.value).filter(Boolean);
          const match = focalComponents.find(p => compOptions.includes(p));
          if (match) compSelect.value = match;
        }
      }
    }
  }

  // =============================================
  // COLORS
  // =============================================
  $('#show-color-picker').addEventListener('click', () => {
    $('#color-manual-row').style.display = '';
    $('#color-manual-toggle').style.display = 'none';
  });
  $('#add-color-btn').addEventListener('click', () => {
    const hex = $('#color-picker').value;
    const label = $('#color-label').value.trim() || 'accent';
    colors.push({ hex, label });
    $('#color-label').value = '';
    renderColors();
  });

  function renderColors() {
    const palette = $('#color-palette');
    if (colors.length === 0) {
      palette.innerHTML = '<span style="font-size:12px;color:rgba(0,0,0,0.3)">Upload an image to auto-extract colors</span>';
      return;
    }
    palette.innerHTML = colors.map((c, i) =>
      `<div class="color-swatch-labeled" data-idx="${i}" title="Click to remove">
        <div class="color-swatch" style="background:${c.hex}"></div>
        <span class="color-swatch-hex">${c.hex}</span>
        <span class="color-swatch-label">${c.label}</span>
      </div>`
    ).join('');
    palette.querySelectorAll('.color-swatch-labeled').forEach(sw => {
      sw.addEventListener('click', () => {
        colors.splice(parseInt(sw.dataset.idx), 1);
        renderColors();
      });
    });
  }
  renderColors();

  // =============================================
  // SAVE / UPDATE
  // =============================================
  $('#modal-save').addEventListener('click', async () => {
    const title = $('#design-title').value.trim();
    if (!title) { showToast('Please enter a title', 'error'); return; }

    const data = {
      title,
      url: $('#design-url').value.trim(),
      componentType: $('#design-component').value,
      tags: selectedTags,
      focalComponents,
      aiAnalysis: $('#design-ai-analysis').value.trim(),
      notes: $('#design-notes').value.trim(),
      colors,
      imageData,
    };

    if (isEdit) {
      await updateDesign(existing.id, data);
      showToast('Design updated!', 'success');
    } else {
      await addDesign(data);
      showToast('Design saved!', 'success');
    }

    close();
    if (onComplete) onComplete();
  });
}
