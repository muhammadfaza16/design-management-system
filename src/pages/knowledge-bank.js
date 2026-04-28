// DesignVault — Knowledge Bank Page
import { KNOWLEDGE_BANK, getKnowledgeCategories } from '../utils/knowledge-base.js';
import { copyToClipboard } from '../utils/export.js';
import { showToast } from '../components/toast.js';

const CATEGORY_ICONS = {
  'Layout & Composition': '⊞',
  'Typography': 'Aa',
  'Color Theory': '◑',
  'Depth & Elevation': '◇',
  'Motion & Interaction': '↝',
  'UX Psychology': '◉',
  'Responsive Design': '⊟',
  'Component Patterns': '☐'
};

export async function renderKnowledgeBank(container, navigate) {
  let activeCategory = '';
  const categories = getKnowledgeCategories();

  let isInitialized = false;

  function load() {
    const items = activeCategory
      ? KNOWLEDGE_BANK.filter(k => k.category === activeCategory)
      : KNOWLEDGE_BANK;

    if (!isInitialized) {
      container.innerHTML = `
        <div class="page animate-fade-in">
          <div class="page__header" style="margin-bottom:var(--space-6)">
            <div>
              <h1 class="page__title">Knowledge Bank</h1>
              <p class="page__subtitle">${KNOWLEDGE_BANK.length} design principles & AI prompt directives across ${categories.length} categories</p>
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-8)" id="kb-tabs">
            <button class="filter-chip ${!activeCategory ? 'active' : ''}" data-cat="" style="font-size:12px;padding:6px 14px">
              All (${KNOWLEDGE_BANK.length})
            </button>
            ${categories.map(c => {
              const count = KNOWLEDGE_BANK.filter(k => k.category === c).length;
              const icon = CATEGORY_ICONS[c] || '•';
              return `<button class="filter-chip ${activeCategory === c ? 'active' : ''}" data-cat="${c}" style="font-size:12px;padding:6px 14px">
                <span style="font-size:14px;margin-right:4px;opacity:0.6">${icon}</span> ${c} (${count})
              </button>`;
            }).join('')}
          </div>

          <div class="design-grid" id="kb-content" style="grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));"></div>
        </div>
      `;

      // Tab Listeners (Only attach once)
      container.querySelectorAll('#kb-tabs .filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          load();
        });
      });

      isInitialized = true;
    }

    // Update active tab styles
    container.querySelectorAll('#kb-tabs .filter-chip').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === activeCategory);
    });

    // Render content
    container.querySelector('#kb-content').innerHTML = `
          ${items.map(k => `
            <div class="design-card kb-card" style="display:flex;flex-direction:column;" data-category="${k.category}">
              <div class="design-card__body" style="padding:24px;flex:1;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;gap:8px">
                  <span class="badge" style="font-size:10px;flex-shrink:0">${k.category}</span>
                </div>
                <h3 style="font-size:16px;font-weight:600;color:var(--text-primary);margin:8px 0 0;">${k.title}</h3>
                <p style="font-size:13px;color:rgba(var(--text-rgb),0.6);line-height:1.55;margin:10px 0 16px;">
                  ${k.description}
                </p>
                <div style="background:var(--bg-input);border-radius:8px;padding:12px;margin-top:auto;border:1px solid rgba(var(--text-rgb),0.04)">
                  <div style="font-size:10px;font-weight:700;color:rgba(var(--text-rgb),0.35);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">AI Directive</div>
                  <p style="font-family:var(--font-mono);font-size:11px;color:rgba(var(--text-rgb),0.5);margin:0;line-height:1.45;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;" title="${k.aiPrompt.replace(/"/g, '&quot;')}">
                    ${k.aiPrompt}
                  </p>
                </div>
                <div style="margin-top:12px;display:flex;justify-content:flex-end;">
                  <button class="btn btn-secondary kb-copy" data-id="${k.id}" style="font-size:11px;padding:6px 14px;">
                    Copy Directive
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        `;

    // Copy Listeners
    container.querySelectorAll('.kb-copy').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const item = KNOWLEDGE_BANK.find(k => k.id === btn.dataset.id);
        if (item) {
          await copyToClipboard(item.aiPrompt);
          showToast('Directive copied!', 'success');
        }
      });
    });
  }

  load();
}
