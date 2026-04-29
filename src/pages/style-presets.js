// DesignVault — Style Presets Page
import { getAllStylePresets, addStylePreset, deleteStylePreset } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { showPrompt, showConfirm } from '../components/dialog.js';
import { copyToClipboard } from '../utils/export.js';
import { timeAgo } from '../utils/helpers.js';

export async function renderStylePresets(container, navigate) {

  let isInitialized = false;

  async function load() {
    const presets = await getAllStylePresets();

    if (!isInitialized) {
      container.innerHTML = `
        <div class="page animate-fade-in">
          <div class="page__header">
            <div>
              <h1 class="page__title">Style Presets</h1>
              <p class="page__subtitle">Saved design token sets and visual systems</p>
            </div>
            <button class="btn btn-primary" id="style-add">
              <img src="/assets/icons/action-add.svg" class="illustrative-icon illustrative-icon--sm" alt="Add" />
              New Preset
            </button>
          </div>

          <div id="style-list"></div>
        </div>
      `;

      // Add
      container.querySelector('#style-add').addEventListener('click', async () => {
        const result = await showPrompt({
          title: 'New Style Preset',
          confirmLabel: 'Save Preset',
          fields: [
            { id: 'name', label: 'Preset Name', placeholder: 'e.g. Dark SaaS Theme', required: true },
            { id: 'description', label: 'Description', placeholder: 'Optional short description' },
            { id: 'colors', label: 'Colors', placeholder: '#000000, #ffffff, #3b82f6', hint: 'Comma-separated hex values' },
            { id: 'fonts', label: 'Font Families', placeholder: 'Inter, Roboto', hint: 'Comma-separated font names' },
            { id: 'radius', label: 'Border Radius', placeholder: 'e.g. 8px or 12px' },
          ]
        });
        if (!result) return;
        const colors = result.colors.split(',').map(c => c.trim()).filter(Boolean);
        const fonts = result.fonts.split(',').map(f => f.trim()).filter(Boolean);
        await addStylePreset({ name: result.name, description: result.description, tokens: { colors, fonts, radius: result.radius } });
        showToast('Style preset saved!', 'success');
        load();
      });

      isInitialized = true;
    }

    container.querySelector('#style-list').innerHTML = presets.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state__icon"><img src="/assets/icons/misc-tags.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.1" /></div>
        <div class="empty-state__title">No style presets yet</div>
        <p class="empty-state__desc">Save color palettes, typography scales, and spacing systems extracted from your design references.</p>
      </div>
    ` : `
      <div class="design-grid">
        ${presets.map(s => `
          <div class="design-card" data-id="${s.id}">
            <div class="design-card__body" style="padding:24px">
              <div style="font-weight:600;font-size:16px;color:var(--text-primary);margin-bottom:6px">${s.name}</div>
              ${s.description ? `<p style="font-size:12px;color:rgba(var(--text-rgb),0.5);margin-bottom:12px">${s.description}</p>` : ''}
              
              ${s.tokens.colors && s.tokens.colors.length > 0 ? `
                <div style="margin-bottom:12px">
                  <div style="font-size:10px;font-weight:700;color:rgba(var(--text-rgb),0.3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Colors</div>
                  <div class="color-palette">
                    ${s.tokens.colors.map(c => `<div class="color-swatch" style="background:${c};width:24px;height:24px" title="${c}" data-hex="${c}"></div>`).join('')}
                  </div>
                </div>
              ` : ''}

              ${s.tokens.fonts && s.tokens.fonts.length > 0 ? `
                <div style="margin-bottom:12px">
                  <div style="font-size:10px;font-weight:700;color:rgba(var(--text-rgb),0.3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Fonts</div>
                  <div style="font-size:12px;color:rgba(var(--text-rgb),0.5)">${s.tokens.fonts.join(', ')}</div>
                </div>
              ` : ''}

              ${s.tokens.radius ? `
                <div style="margin-bottom:12px">
                  <div style="font-size:10px;font-weight:700;color:rgba(var(--text-rgb),0.3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Border Radius</div>
                  <div style="font-size:12px;color:rgba(var(--text-rgb),0.5)">${s.tokens.radius}</div>
                </div>
              ` : ''}

              <div class="design-card__meta" style="margin-top:16px;justify-content:space-between">
                <span>${timeAgo(s.createdAt)}</span>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-secondary style-copy-css" data-id="${s.id}" style="font-size:11px;padding:4px 10px">Copy CSS</button>
                  <button class="btn btn-ghost btn-danger style-delete" data-id="${s.id}" style="font-size:11px;padding:4px 8px">Delete</button>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Reattach dynamic listeners
    // Copy CSS
    container.querySelectorAll('.style-copy-css').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const s = presets.find(x => x.id === btn.dataset.id);
        if (!s) return;

        let css = ':root {\n';
        if (s.tokens.colors) {
          s.tokens.colors.forEach((c, i) => {
            css += `  --color-${i + 1}: ${c};\n`;
          });
        }
        if (s.tokens.fonts) {
          s.tokens.fonts.forEach((f, i) => {
            css += `  --font-${i === 0 ? 'primary' : 'secondary'}: '${f}', sans-serif;\n`;
          });
        }
        if (s.tokens.radius) {
          css += `  --radius: ${s.tokens.radius};\n`;
        }
        css += '}';

        await copyToClipboard(css);
        showToast('CSS variables copied!', 'success');
      });
    });

    // Delete
    container.querySelectorAll('.style-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await showConfirm('This style preset will be permanently deleted.', { title: 'Delete Preset?', confirmLabel: 'Delete', danger: true });
        if (ok) {
          await deleteStylePreset(btn.dataset.id);
          showToast('Preset deleted', 'info');
          load();
        }
      });
    });

    // Color swatch copy
    container.querySelectorAll('.color-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        if (sw.dataset.hex) {
          copyToClipboard(sw.dataset.hex);
          showToast(`Copied ${sw.dataset.hex}`, 'info');
        }
      });
    });
  }

  load();
}
