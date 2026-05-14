// DesignVault — Snippets Page
import { getAllSnippets, addSnippet, deleteSnippet, incrementSnippetUse } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { showPrompt, showConfirm } from '../components/dialog.js';
import { showUndoToast } from '../components/undo-toast.js';
import { copyToClipboard } from '../utils/export.js';
import { timeAgo, debounce } from '../utils/helpers.js';

export async function renderSnippets(container, navigate) {
  let searchQuery = '';
  let filterLang = '';

  let isInitialized = false;

  async function load() {
    let snippets = await getAllSnippets();

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      snippets = snippets.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (filterLang) {
      snippets = snippets.filter(s => s.language === filterLang);
    }

    const languages = ['javascript', 'css', 'html', 'react', 'vue', 'python'];

    if (!isInitialized) {
      container.innerHTML = `
        <div class="page animate-fade-in">
          <div class="page__header">
            <div>
              <h1 class="page__title">Snippets</h1>
              <p class="page__subtitle">Reusable code fragments for your projects</p>
            </div>
            <button class="btn btn-primary" id="snippet-add">
              <img src="/assets/icons/action-add.svg" class="illustrative-icon illustrative-icon--sm" alt="Add" />
              New Snippet
            </button>
          </div>

          <div class="lib-controls">
            <div class="lib-search-wrap">
              <input type="text" id="snippet-search" class="form-control" placeholder="Search snippets..." value="${searchQuery}" style="padding:6px 12px;font-size:13px" />
            </div>
            <div class="segmented-control" id="snippet-filters">
              <button class="segmented-control__item ${!filterLang ? 'active' : ''}" data-lang="">All</button>
              ${languages.map(l => `<button class="segmented-control__item ${filterLang === l ? 'active' : ''}" data-lang="${l}">${l}</button>`).join('')}
            </div>
          </div>

          <div id="snippet-list"></div>
        </div>
      `;

      // Add
      container.querySelector('#snippet-add').addEventListener('click', async () => {
        const languages = ['javascript', 'css', 'html', 'react', 'vue', 'python'];
        const result = await showPrompt({
          title: 'New Snippet',
          confirmLabel: 'Save Snippet',
          fields: [
            { id: 'title', label: 'Snippet Title', placeholder: 'e.g. Glassmorphism Card CSS', required: true },
            { id: 'language', label: 'Language', type: 'select', options: languages.map(l => ({ value: l, label: l })), value: 'javascript' },
            { id: 'code', label: 'Code', type: 'textarea', placeholder: 'Paste your code here...', required: true },
          ]
        });
        if (!result) return;
        await addSnippet({ title: result.title, code: result.code, language: result.language });
        showToast('Snippet saved!', 'success');
        load();
      });

      // Search
      const searchInput = container.querySelector('#snippet-search');
      if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
          searchQuery = e.target.value.trim();
          load();
        }, 300));
      }

      // Filter
      container.querySelectorAll('#snippet-filters .segmented-control__item').forEach(btn => {
        btn.addEventListener('click', () => {
          filterLang = btn.dataset.lang;
          container.querySelectorAll('#snippet-filters .segmented-control__item').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          load();
        });
      });

      isInitialized = true;
    }

    container.querySelector('#snippet-list').innerHTML = snippets.length === 0 ? `
      <div class="empty-state">
        <div class="empty-state__icon"><img src="/assets/icons/action-copy.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.1" /></div>
        <div class="empty-state__title">${searchQuery ? 'No snippets match' : 'No snippets yet'}</div>
        <p class="empty-state__desc">Save reusable code fragments — CSS patterns, component templates, utilities.</p>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:24px">
        ${snippets.map(s => `
          <div class="prompt-card" data-id="${s.id}">
            <div class="prompt-card__header" style="padding-bottom: 8px;">
              <div style="flex:1;min-width:0">
                <div class="prompt-card__title">${s.title}</div>
                <div class="prompt-card__meta" style="margin-top: 8px;">
                  <span class="badge badge--purple">${s.language}</span>
                  ${s.framework ? `<span class="badge">${s.framework}</span>` : ''}
                  <span style="font-size: 12px; margin-left: 4px;">Used ${s.useCount || 0}× · ${timeAgo(s.createdAt)}</span>
                </div>
                ${s.description ? `<p style="font-size:13px; color:rgba(var(--text-rgb),0.55); margin-top:12px; margin-bottom:0; line-height: 1.5; max-width: 800px;">${s.description}</p>` : ''}
              </div>
              <div class="prompt-card__actions" style="margin-top: 4px;">
                <button class="btn btn-secondary snippet-copy" data-id="${s.id}">
                  <img src="/assets/icons/action-copy.svg" class="illustrative-icon" alt="" style="width:14px;height:14px" />
                  Copy
                </button>
                <button class="btn btn-icon btn-danger snippet-delete" data-id="${s.id}" title="Delete snippet">
                  <img src="/assets/icons/status-error.svg" class="illustrative-icon" alt="" style="width:16px;height:16px" />
                </button>
              </div>
            </div>
            <div class="prompt-card__code" style="margin-top: 16px; margin-bottom: 24px; max-height: 240px; overflow-y: auto;">
              <code>${s.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Reattach dynamic listeners
    // Copy
    container.querySelectorAll('.snippet-copy').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const s = snippets.find(x => x.id === btn.dataset.id);
        if (s) {
          await copyToClipboard(s.code);
          await incrementSnippetUse(s.id);
          showToast('Code copied!', 'success');
          load();
        }
      });
    });

    // Delete (soft-delete with undo)
    container.querySelectorAll('.snippet-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const s = snippets.find(x => x.id === btn.dataset.id);
        if (!s) return;
        const card = btn.closest('.prompt-card');
        if (card) card.style.display = 'none';
        showUndoToast(`"${s.title}" deleted`, {
          onCommit: async () => {
            await deleteSnippet(btn.dataset.id);
            load();
          },
          onUndo: () => {
            if (card) card.style.display = '';
            showToast('Delete cancelled', 'success');
          }
        });
      });
    });
  }

  load();
}
