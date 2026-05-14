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
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;">
              <div>
                <div style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:var(--accent);color:#fff;border-radius:100px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px">
                  <img src="/assets/icons/misc-notes.svg" style="width:12px;height:12px;filter:brightness(0) invert(1);" /> Official Directives
                </div>
                <h1 class="page__title" style="font-size: 28px; margin-bottom: 8px;">Knowledge Bank</h1>
                <p class="page__subtitle" style="font-size: 14px; max-width: 600px;">
                  A curated repository of foundational design principles paired with optimized AI prompts. Use these directives to guide models like Midjourney or GPT-4 in generating consistent, high-quality assets.
                </p>
              </div>
              <div style="display:flex; gap: 8px;">
                <button class="btn btn-secondary" id="kb-export-all" style="background:var(--bg-surface); border-color:rgba(var(--text-rgb),0.15); box-shadow:0 4px 12px rgba(0,0,0,0.05); font-size:13px; padding: 8px 16px;">
                  <img src="/assets/icons/action-copy.svg" class="illustrative-icon" style="width:16px;height:16px;filter:var(--icon-filter);" alt=""/>
                  Copy
                </button>
                <button class="btn btn-primary" id="kb-download-md" style="font-size:13px; padding: 8px 16px; box-shadow:0 4px 12px rgba(var(--accent-rgb),0.15);">
                  <img src="/assets/icons/action-export.svg" class="illustrative-icon" style="width:16px;height:16px;filter:var(--icon-primary-filter);" alt=""/>
                  Download .md
                </button>
              </div>
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
            <div class="design-card kb-card animate-fade-in-up hover-lift stagger-${(i % 4) + 1}" style="cursor: pointer; display:flex;flex-direction:column; background: var(--bg-surface); border: 1px solid rgba(var(--text-rgb), 0.08); transition: all 0.3s ease; overflow: hidden;" data-id="${k.id}" data-category="${k.category}">
              
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

    // Card Click Listener for Navigation
    container.querySelectorAll('.kb-card').forEach(card => {
      card.addEventListener('click', () => {
        navigate('knowledge-detail', { id: card.dataset.id });
      });
    });

    // Export Master Prompt Logic
    function getMasterMarkdown() {
      let md = `# DesignVault Master Constraints\n\n`;
      md += `You are an expert AI design assistant. Adhere strictly to the following architectural and design principles. When generating code, UIs, or visual assets, format your output to align with these exact constraints.\n\n`;
      
      const grouped = {};
      KNOWLEDGE_BANK.forEach(k => {
        if (!grouped[k.category]) grouped[k.category] = [];
        grouped[k.category].push(k);
      });

      for (const [cat, items] of Object.entries(grouped)) {
        md += `## Category: ${cat}\n\n`;
        items.forEach(k => {
          md += `### ${k.title}\n`;
          md += `**Principle**: ${k.description}\n\n`;
          
          if (k.elaboration) {
             const temp = document.createElement('div');
             temp.innerHTML = k.elaboration;
             md += `**Details**: ${temp.innerText.trim()}\n\n`;
          }
          md += `**Constraint / Directive**:\n\`\`\`text\n${k.aiPrompt}\n\`\`\`\n\n`;
        });
      }
      return md;
    }

    container.querySelector('#kb-export-all')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      await copyToClipboard(getMasterMarkdown());
      showToast('Master constraints copied!', 'success');
      
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<img src="/assets/icons/status-success.svg" class="illustrative-icon" style="width:16px;height:16px;" alt=""/> Copied!';
      setTimeout(() => { btn.innerHTML = origHTML; }, 2000);
    });

    container.querySelector('#kb-download-md')?.addEventListener('click', () => {
      const md = getMasterMarkdown();
      const blob = new Blob([md], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DesignVault_Master_Constraints.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('File downloaded!', 'success');
    });
  }

  load();
}
