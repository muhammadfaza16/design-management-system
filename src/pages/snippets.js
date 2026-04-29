// DesignVault — Snippets Page
import { getAllSnippets, addSnippet, deleteSnippet, incrementSnippetUse } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { copyToClipboard } from '../utils/export.js';
import { timeAgo, debounce } from '../utils/helpers.js';

export async function renderSnippets(container, navigate) {
  let searchQuery = '';
  let filterLang = '';

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

        <div id="snippet-list">
          ${snippets.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state__icon"><img src="/assets/icons/action-copy.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.1" /></div>
              <div class="empty-state__title">${searchQuery ? 'No snippets match' : 'No snippets yet'}</div>
              <p class="empty-state__desc">Save reusable code fragments — CSS patterns, component templates, utilities.</p>
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;gap:var(--space-4)">
              ${snippets.map(s => `
                <div class="prompt-card" data-id="${s.id}">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
                    <div style="flex:1;min-width:0">
                      <div style="font-weight:600;font-size:15px;color:var(--text-primary);margin-bottom:4px">${s.title}</div>
                      <div style="font-size:12px;color:rgba(var(--text-rgb),0.4);display:flex;gap:12px;align-items:center">
                        <span class="badge">${s.language}</span>
                        ${s.framework ? `<span class="badge">${s.framework}</span>` : ''}
                        <span>Used ${s.useCount || 0}×</span>
                        <span>${timeAgo(s.createdAt)}</span>
                      </div>
                      ${s.description ? `<p style="font-size:12px;color:rgba(var(--text-rgb),0.5);margin-top:6px;margin-bottom:0">${s.description}</p>` : ''}
                    </div>
                    <div style="display:flex;gap:6px;flex-shrink:0">
                      <button class="btn btn-secondary snippet-copy" data-id="${s.id}" style="font-size:11px;padding:4px 10px">Copy</button>
                      <button class="btn btn-ghost btn-danger snippet-delete" data-id="${s.id}" style="font-size:11px;padding:4px 8px">Delete</button>
                    </div>
                  </div>
                  <pre style="margin-top:12px;font-size:11px;font-family:var(--font-mono);color:rgba(var(--text-rgb),0.55);white-space:pre-wrap;word-break:break-word;max-height:120px;overflow:hidden;line-height:1.5;background:rgba(var(--text-rgb),0.02);padding:12px;border-radius:8px;border:1px solid rgba(var(--text-rgb),0.06)">${s.code.slice(0, 400)}${s.code.length > 400 ? '...' : ''}</pre>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Add
    container.querySelector('#snippet-add').addEventListener('click', () => {
      const title = prompt('Snippet title:');
      if (!title) return;
      const code = prompt('Code content:');
      if (!code) return;
      const language = prompt('Language (javascript, css, html, react, vue, python):') || 'javascript';
      addSnippet({ title, code, language }).then(() => {
        showToast('Snippet saved!', 'success');
        load();
      });
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
        load();
      });
    });

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

    // Delete
    container.querySelectorAll('.snippet-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Delete this snippet?')) {
          await deleteSnippet(btn.dataset.id);
          showToast('Snippet deleted', 'info');
          load();
        }
      });
    });
  }

  load();
}
