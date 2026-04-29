// DesignVault — Prompt Vault Page
import { getAllPrompts, addPrompt, updatePrompt, deletePrompt, incrementPromptUse } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { showPrompt, showConfirm } from '../components/dialog.js';
import { copyToClipboard } from '../utils/export.js';
import { timeAgo, debounce } from '../utils/helpers.js';

export async function renderPromptVault(container, navigate) {
  let searchQuery = '';
  let filterCategory = '';

  let isInitialized = false;

  async function load() {
    let prompts = await getAllPrompts();

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      prompts = prompts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (filterCategory) {
      prompts = prompts.filter(p => p.category === filterCategory);
    }

    const categories = ['general', 'extraction', 'component', 'layout', 'animation', 'refactor'];

    if (!isInitialized) {
      container.innerHTML = `
        <div class="page animate-fade-in">
          <div class="page__header">
            <div>
              <h1 class="page__title">Prompt Vault</h1>
              <p class="page__subtitle">Reusable AI prompts for your design-to-code workflow</p>
            </div>
            <button class="btn btn-primary" id="prompt-add">
              <img src="/assets/icons/action-add.svg" class="illustrative-icon illustrative-icon--sm" alt="Add" />
              New Prompt
            </button>
          </div>

          <div class="lib-controls">
            <div class="lib-search-wrap">
              <input type="text" id="prompt-search" class="form-control" placeholder="Search prompts..." value="${searchQuery}" style="padding:6px 12px;font-size:13px" />
            </div>
            <div class="segmented-control" id="prompt-filters">
              <button class="segmented-control__item ${!filterCategory ? 'active' : ''}" data-cat="">All</button>
              ${categories.map(c => `<button class="segmented-control__item ${filterCategory === c ? 'active' : ''}" data-cat="${c}">${c}</button>`).join('')}
            </div>
          </div>

          <div id="prompt-list"></div>
        </div>
      `;

      // Add
      container.querySelector('#prompt-add').addEventListener('click', async () => {
        const categories = ['general', 'extraction', 'component', 'layout', 'animation', 'refactor'];
        const result = await showPrompt({
          title: 'New Prompt',
          confirmLabel: 'Save Prompt',
          fields: [
            { id: 'title', label: 'Prompt Title', placeholder: 'e.g. Extract Color Palette', required: true },
            { id: 'category', label: 'Category', type: 'select', options: categories.map(c => ({ value: c, label: c })), value: 'general' },
            { id: 'content', label: 'Prompt Content', type: 'textarea', placeholder: 'Write your AI prompt here...', required: true },
          ]
        });
        if (!result) return;
        await addPrompt({ title: result.title, content: result.content, category: result.category });
        showToast('Prompt saved!', 'success');
        load();
      });

      // Search
      const searchInput = container.querySelector('#prompt-search');
      if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
          searchQuery = e.target.value.trim();
          load();
        }, 300));
      }

      // Filter
      container.querySelectorAll('#prompt-filters .segmented-control__item').forEach(btn => {
        btn.addEventListener('click', () => {
          filterCategory = btn.dataset.cat;
          // Update active class immediately for UI responsiveness
          container.querySelectorAll('#prompt-filters .segmented-control__item').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          load();
        });
      });

      isInitialized = true;
    }

    container.querySelector('#prompt-list').innerHTML = prompts.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state__icon"><img src="/assets/icons/ai-prompt.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.1" /></div>
        <div class="empty-state__title">${searchQuery ? 'No prompts match your search' : 'No prompts saved yet'}</div>
        <p class="empty-state__desc">Create reusable prompt templates for common design extraction tasks.</p>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        ${prompts.map(p => `
          <div class="prompt-card" data-id="${p.id}">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:15px;color:var(--text-primary);margin-bottom:4px">${p.title}</div>
                <div style="font-size:12px;color:rgba(var(--text-rgb),0.4);display:flex;gap:12px;align-items:center">
                  <span class="badge">${p.category}</span>
                  <span>Used ${p.useCount || 0}×</span>
                  <span>${timeAgo(p.createdAt)}</span>
                </div>
              </div>
              <div style="display:flex;gap:6px;flex-shrink:0">
                <button class="btn btn-secondary prompt-copy" data-id="${p.id}" style="font-size:11px;padding:4px 10px">Copy</button>
                <button class="btn btn-ghost btn-danger prompt-delete" data-id="${p.id}" style="font-size:11px;padding:4px 8px">Delete</button>
              </div>
            </div>
            <pre class="prompt-preview" style="margin-top:12px;font-size:11px;font-family:var(--font-mono);color:rgba(var(--text-rgb),0.5);white-space:pre-wrap;word-break:break-word;max-height:100px;overflow:hidden;line-height:1.5">${p.content.slice(0, 300)}${p.content.length > 300 ? '...' : ''}</pre>
          </div>
        `).join('')}
      </div>
    `;

    // Reattach dynamic listeners
    // Copy
    container.querySelectorAll('.prompt-copy').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const p = prompts.find(x => x.id === btn.dataset.id);
        if (p) {
          await copyToClipboard(p.content);
          await incrementPromptUse(p.id);
          showToast('Prompt copied!', 'success');
          load();
        }
      });
    });

    // Delete
    container.querySelectorAll('.prompt-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const ok = await showConfirm('This prompt will be permanently deleted.', { title: 'Delete Prompt?', confirmLabel: 'Delete', danger: true });
        if (ok) {
          await deletePrompt(btn.dataset.id);
          showToast('Prompt deleted', 'info');
          load();
        }
      });
    });
  }

  load();
}
