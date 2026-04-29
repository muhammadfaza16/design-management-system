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
          <div class="page__header" style="margin-bottom:var(--space-6); background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.1), transparent); padding: 32px; border-radius: var(--radius-xl); border: 1px solid rgba(var(--accent-rgb), 0.15);">
            <div>
              <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:var(--accent);color:#fff;border-radius:100px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">
                <img src="/assets/icons/misc-notes.svg" style="width:12px;height:12px;filter:brightness(0) invert(1);" /> Official Directives
              </div>
              <h1 class="page__title" style="font-size: 28px; margin-bottom: 8px;">Knowledge Bank</h1>
              <p class="page__subtitle" style="font-size: 14px; max-width: 600px;">
                A curated repository of foundational design principles paired with optimized AI prompts. Use these directives to guide models like Midjourney or GPT-4 in generating consistent, high-quality assets.
              </p>
            </div>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-8)" id="kb-tabs"></div>

          <div class="design-grid" id="kb-content" style="grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;"></div>
        </div>
      `;

      isInitialized = true;
    }

    // Dynamic Updates (Fixes stale tabs issue)
    const tabsContainer = container.querySelector('#kb-tabs');
    tabsContainer.innerHTML = `
      <button class="filter-chip ${!activeCategory ? 'active' : ''}" data-cat="" style="font-size:13px;padding:8px 16px;border-radius:100px;">
        All <span style="opacity:0.5;font-size:11px;margin-left:4px">${KNOWLEDGE_BANK.length}</span>
      </button>
      ${categories.map(c => {
        const count = KNOWLEDGE_BANK.filter(k => k.category === c).length;
        const icon = CATEGORY_ICONS[c] || '•';
        return `<button class="filter-chip ${activeCategory === c ? 'active' : ''}" data-cat="${c}" style="font-size:13px;padding:8px 16px;border-radius:100px;">
          <span style="font-size:14px;margin-right:6px;opacity:0.7">${icon}</span> ${c} <span style="opacity:0.5;font-size:11px;margin-left:4px">${count}</span>
        </button>`;
      }).join('')}
    `;

    // Tab Listeners (Re-attached on every load because we re-rendered them)
    tabsContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        load();
      });
    });

    // Render content
    container.querySelector('#kb-content').innerHTML = `
          ${items.map((k, i) => `
            <div class="design-card kb-card animate-fade-in-up stagger-${(i % 4) + 1}" style="display:flex;flex-direction:column; background: var(--bg-surface); border: 1px solid rgba(var(--text-rgb), 0.08); transition: all 0.3s ease; overflow: hidden;" data-category="${k.category}">
              
              <!-- Decorative Top Border -->
              <div style="height: 4px; background: linear-gradient(90deg, var(--accent), transparent); width: 100%;"></div>

              <div class="design-card__body" style="padding:24px;flex:1;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;gap:8px">
                  <span class="badge" style="font-size:10px; padding: 4px 8px; background: rgba(var(--text-rgb), 0.05); color: var(--text-secondary); border: 1px solid rgba(var(--text-rgb), 0.1);">${k.category}</span>
                </div>
                
                <h3 style="font-size:18px;font-weight:700;color:var(--text-primary);margin:0 0 12px; line-height: 1.3;">${k.title}</h3>
                
                <p style="font-size:13px;color:rgba(var(--text-rgb),0.65);line-height:1.6;margin:0 0 20px;">
                  ${k.description}
                </p>
                
                <div style="background:rgba(0,0,0,0.03); border-radius:8px; padding:16px; margin-top:auto; border:1px solid rgba(var(--text-rgb),0.06); position:relative;">
                  
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                    <div style="font-size:10px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.08em; display:flex; align-items:center; gap:6px;">
                      <div style="width:6px;height:6px;background:var(--accent);border-radius:50%;box-shadow:0 0 8px var(--accent);"></div> AI Directive
                    </div>
                    <button class="btn-icon kb-copy" data-id="${k.id}" style="width:24px;height:24px;background:rgba(var(--text-rgb),0.05);border-radius:4px;" title="Copy Directive">
                      <img src="/assets/icons/action-copy.svg" style="width:12px;height:12px;opacity:0.7" />
                    </button>
                  </div>
                  
                  <p style="font-family:var(--font-mono);font-size:12px;color:rgba(var(--text-rgb),0.7);margin:0;line-height:1.5;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;" title="${k.aiPrompt.replace(/"/g, '&quot;')}">
                    ${k.aiPrompt}
                  </p>
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
