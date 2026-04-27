// DesignVault — Knowledge Bank Page
import { KNOWLEDGE_BANK, getKnowledgeCategories } from '../utils/knowledge-base.js';
import { copyToClipboard } from '../utils/export.js';
import { showToast } from '../components/toast.js';

export async function renderKnowledgeBank(container, navigate) {
  let activeCategory = 'Design 101';
  const categories = getKnowledgeCategories();

  function load() {
    const items = KNOWLEDGE_BANK.filter(k => k.category === activeCategory);

    container.innerHTML = `
      <div class="page animate-fade-in">
        <div class="page__header" style="margin-bottom:var(--space-8)">
          <div>
            <h1 class="page__title">Knowledge Bank</h1>
            <p class="page__subtitle">Design principles and advanced UX rules, formulated as AI prompt directives.</p>
          </div>
        </div>

        <div class="segmented-control" id="kb-tabs" style="margin-bottom:var(--space-6); display:inline-flex;">
          ${categories.map(c => `
            <button class="segmented-control__item ${activeCategory === c ? 'active' : ''}" data-cat="${c}">${c}</button>
          `).join('')}
        </div>

        <div class="design-grid" style="grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));">
          ${items.map(k => `
            <div class="design-card" style="display:flex;flex-direction:column;">
              <div class="design-card__body" style="padding:24px;flex:1;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                  <h3 style="font-size:16px;font-weight:600;color:var(--text-primary);margin:0;">${k.title}</h3>
                </div>
                <p style="font-size:13px;color:rgba(var(--text-rgb),0.6);line-height:1.5;margin-bottom:16px;">
                  ${k.description}
                </p>
                <div style="background:var(--bg-input);border-radius:8px;padding:12px;margin-top:auto;">
                  <div style="font-size:10px;font-weight:700;color:rgba(var(--text-rgb),0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">AI Directive</div>
                  <p style="font-family:var(--font-mono);font-size:11px;color:rgba(var(--text-rgb),0.5);margin:0;line-height:1.4;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;" title="${k.aiPrompt}">
                    ${k.aiPrompt}
                  </p>
                </div>
                <div style="margin-top:16px;display:flex;justify-content:flex-end;">
                  <button class="btn btn-secondary kb-copy" data-id="${k.id}" style="font-size:11px;padding:6px 12px;">
                    <img src="/src/assets/icons/action-copy.svg" class="illustrative-icon illustrative-icon--sm" alt="" />
                    Copy Directive
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Tab Listeners
    container.querySelectorAll('#kb-tabs .segmented-control__item').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        load();
      });
    });

    // Copy Listeners
    container.querySelectorAll('.kb-copy').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const item = KNOWLEDGE_BANK.find(k => k.id === btn.dataset.id);
        if (item) {
          await copyToClipboard(item.aiPrompt);
          showToast('Directive copied to clipboard!', 'success');
        }
      });
    });
  }

  load();
}
