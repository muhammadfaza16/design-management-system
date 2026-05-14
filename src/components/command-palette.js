// DesignVault — Command Palette (Ctrl+K) with full keyboard navigation
import { searchAll } from '../db/store.js';

export function initCommandPalette(navigate) {
  let isOpen = false;
  let debounceTimer = null;

  const ACTIONS = [
    { label: 'Add Design Reference', icon: 'action-add', action: () => window.dispatchEvent(new CustomEvent('open-add-design')) },
    { label: 'New Project', icon: 'nav-projects', action: () => window.dispatchEvent(new CustomEvent('open-new-project')) },
    { label: 'Go to Dashboard', icon: 'nav-library', action: () => navigate('dashboard') },
    { label: 'Go to Library', icon: 'nav-library', action: () => navigate('library') },
    { label: 'Go to Projects', icon: 'nav-projects', action: () => navigate('projects') },
    { label: 'Go to Bookmarks', icon: 'misc-brief', action: () => navigate('bookmarks') },
    { label: 'Go to Knowledge Bank', icon: 'misc-notes', action: () => navigate('knowledge') },
    { label: 'Go to Prompt Vault', icon: 'ai-prompt', action: () => navigate('prompts') },
    { label: 'Go to Snippets', icon: 'action-copy', action: () => navigate('snippets') },
    { label: 'Go to Style Presets', icon: 'misc-tags', action: () => navigate('styles') },
  ];

  function open() {
    if (isOpen) return;
    isOpen = true;

    let activeIndex = 0;

    const backdrop = document.createElement('div');
    backdrop.className = 'cmd-backdrop';
    backdrop.id = 'cmd-palette';
    backdrop.innerHTML = `
      <div class="cmd-palette">
        <div class="cmd-palette__search">
          <img src="/assets/icons/action-search.svg" class="illustrative-icon" alt="" />
          <input type="text" id="cmd-input" placeholder="Search or type a command..." autofocus />
          <kbd class="cmd-palette__esc">ESC</kbd>
        </div>
        <div class="cmd-palette__results" id="cmd-results"></div>
        <div class="cmd-palette__footer" style="padding:8px 16px;border-top:1px solid rgba(var(--text-rgb),0.06);display:flex;gap:16px;font-size:11px;color:var(--text-tertiary)">
          <span><kbd style="padding:1px 5px;background:rgba(var(--text-rgb),0.06);border-radius:3px;font-size:10px;font-family:var(--font-mono)">↑↓</kbd> Navigate</span>
          <span><kbd style="padding:1px 5px;background:rgba(var(--text-rgb),0.06);border-radius:3px;font-size:10px;font-family:var(--font-mono)">↵</kbd> Select</span>
          <span><kbd style="padding:1px 5px;background:rgba(var(--text-rgb),0.06);border-radius:3px;font-size:10px;font-family:var(--font-mono)">esc</kbd> Close</span>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const input = backdrop.querySelector('#cmd-input');
    const resultsEl = backdrop.querySelector('#cmd-results');

    // Close handler
    const close = () => {
      isOpen = false;
      backdrop.style.animation = 'fadeOut 150ms ease forwards';
      setTimeout(() => backdrop.remove(), 150);
    };

    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });

    // ─── Highlight management ───
    function updateHighlight() {
      const items = resultsEl.querySelectorAll('.cmd-palette__item');
      items.forEach((item, i) => {
        if (i === activeIndex) {
          item.classList.add('cmd-active');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('cmd-active');
        }
      });
    }

    function getItemCount() {
      return resultsEl.querySelectorAll('.cmd-palette__item').length;
    }

    // Execute the currently highlighted item
    function executeActive() {
      const items = resultsEl.querySelectorAll('.cmd-palette__item');
      if (items[activeIndex]) {
        items[activeIndex].click();
      }
    }

    // ─── Keyboard navigation ───
    input.addEventListener('keydown', e => {
      const count = getItemCount();

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = count > 0 ? (activeIndex + 1) % count : 0;
        updateHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = count > 0 ? (activeIndex - 1 + count) % count : 0;
        updateHighlight();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeActive();
      } else if (e.key === 'Escape') {
        close();
      }
    });

    // ─── Rendering ───
    function renderResults(html) {
      resultsEl.innerHTML = html;
      activeIndex = 0;
      bindClicks(resultsEl, close);
      updateHighlight();

      // Hover-to-highlight
      resultsEl.querySelectorAll('.cmd-palette__item').forEach((item, i) => {
        item.addEventListener('mouseenter', () => {
          activeIndex = i;
          updateHighlight();
        });
      });
    }

    function renderDefaultActions() {
      let html = '<div class="cmd-palette__section-label">Actions</div>';
      ACTIONS.forEach((a, i) => {
        html += `
          <div class="cmd-palette__item" data-action="${i}">
            <img src="/assets/icons/${a.icon}.svg" class="illustrative-icon" alt="" />
            <span>${a.label}</span>
          </div>`;
      });
      renderResults(html);
    }

    // Initial render
    renderDefaultActions();

    // ─── Search ───
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const q = input.value.trim();
        if (!q) {
          renderDefaultActions();
          return;
        }

        // Filter actions + search data
        const matchedActions = ACTIONS.filter(a => a.label.toLowerCase().includes(q.toLowerCase()));
        const results = await searchAll(q);

        let html = '';

        if (matchedActions.length) {
          html += '<div class="cmd-palette__section-label">Actions</div>';
          matchedActions.forEach(a => {
            const idx = ACTIONS.indexOf(a);
            html += `
              <div class="cmd-palette__item" data-action="${idx}">
                <img src="/assets/icons/${a.icon}.svg" class="illustrative-icon" alt="" />
                <span>${a.label}</span>
              </div>`;
          });
        }

        if (results.designs.length) {
          html += '<div class="cmd-palette__section-label">References</div>';
          results.designs.forEach(d => {
            html += `
              <div class="cmd-palette__item" data-goto="detail" data-id="${d.id}">
                <img src="/assets/icons/nav-library.svg" class="illustrative-icon" alt="" />
                <span>${d.title}</span>
                <span class="text-muted" style="margin-left:auto">${d.componentType || ''}</span>
              </div>`;
          });
        }

        if (results.projects.length) {
          html += '<div class="cmd-palette__section-label">Projects</div>';
          results.projects.forEach(p => {
            html += `
              <div class="cmd-palette__item" data-goto="project-board" data-id="${p.id}">
                <img src="/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
                <span>${p.title}</span>
              </div>`;
          });
        }

        if (results.prompts && results.prompts.length) {
          html += '<div class="cmd-palette__section-label">Prompts</div>';
          results.prompts.forEach(p => {
            html += `
              <div class="cmd-palette__item" data-goto="prompts" data-id="${p.id}">
                <img src="/assets/icons/ai-prompt.svg" class="illustrative-icon" alt="" />
                <span>${p.title}</span>
                <span class="text-muted" style="margin-left:auto">${p.category || ''}</span>
              </div>`;
          });
        }

        if (results.snippets && results.snippets.length) {
          html += '<div class="cmd-palette__section-label">Snippets</div>';
          results.snippets.forEach(s => {
            html += `
              <div class="cmd-palette__item" data-goto="snippets" data-id="${s.id}">
                <img src="/assets/icons/action-copy.svg" class="illustrative-icon" alt="" />
                <span>${s.title}</span>
                <span class="text-muted" style="margin-left:auto">${s.language || ''}</span>
              </div>`;
          });
        }

        if (!html) {
          html = '<div class="text-muted" style="padding:20px;text-align:center">No results found</div>';
        }

        renderResults(html);
      }, 150);
    });

    // ─── Click bindings ───
    function bindClicks(el, closeFn) {
      el.querySelectorAll('[data-action]').forEach(item => {
        item.addEventListener('click', () => {
          const action = ACTIONS[parseInt(item.dataset.action)];
          closeFn();
          action.action();
        });
      });
      el.querySelectorAll('[data-goto]').forEach(item => {
        item.addEventListener('click', () => {
          closeFn();
          const page = item.dataset.goto;
          const id = item.dataset.id;
          navigate(page, id ? { id } : {});
        });
      });
    }
  }

  // Global keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) {
        document.getElementById('cmd-palette')?.remove();
        isOpen = false;
      } else {
        open();
      }
    } else if (e.key === '/' && !isOpen && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      e.preventDefault();
      open();
    }
  });
}
