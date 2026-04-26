// DesignVault — Command Palette (Ctrl+K)
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
  ];

  function open() {
    if (isOpen) return;
    isOpen = true;

    const backdrop = document.createElement('div');
    backdrop.className = 'cmd-backdrop';
    backdrop.id = 'cmd-palette';
    backdrop.innerHTML = `
      <div class="cmd-palette">
        <div class="cmd-palette__search">
          <img src="/src/assets/icons/action-search.svg" class="illustrative-icon" alt="" />
          <input type="text" id="cmd-input" placeholder="Search or type a command..." autofocus />
          <kbd class="cmd-palette__esc">ESC</kbd>
        </div>
        <div class="cmd-palette__results" id="cmd-results">
          <div class="cmd-palette__section-label">Actions</div>
          ${ACTIONS.map((a, i) => `
            <div class="cmd-palette__item" data-action="${i}">
              <img src="/src/assets/icons/${a.icon}.svg" class="illustrative-icon" alt="" />
              <span>${a.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const input = backdrop.querySelector('#cmd-input');
    const resultsEl = backdrop.querySelector('#cmd-results');

    // Close
    const close = () => {
      isOpen = false;
      backdrop.style.animation = 'fadeOut 150ms ease forwards';
      setTimeout(() => backdrop.remove(), 150);
    };

    backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
    input.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    // Action clicks
    backdrop.querySelectorAll('[data-action]').forEach(el => {
      el.addEventListener('click', () => {
        const action = ACTIONS[parseInt(el.dataset.action)];
        close();
        action.action();
      });
    });

    // Search
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const q = input.value.trim();
        if (!q) {
          // Show default actions
          resultsEl.innerHTML = `
            <div class="cmd-palette__section-label">Actions</div>
            ${ACTIONS.map((a, i) => `
              <div class="cmd-palette__item" data-action="${i}">
                <img src="/src/assets/icons/${a.icon}.svg" class="illustrative-icon" alt="" />
                <span>${a.label}</span>
              </div>
            `).join('')}
          `;
          bindActionClicks(resultsEl, close);
          return;
        }

        // Filter actions + search data
        const matchedActions = ACTIONS.filter(a => a.label.toLowerCase().includes(q.toLowerCase()));
        const results = await searchAll(q);

        let html = '';

        if (matchedActions.length) {
          html += `<div class="cmd-palette__section-label">Actions</div>`;
          matchedActions.forEach((a, i) => {
            const idx = ACTIONS.indexOf(a);
            html += `
              <div class="cmd-palette__item" data-action="${idx}">
                <img src="/src/assets/icons/${a.icon}.svg" class="illustrative-icon" alt="" />
                <span>${a.label}</span>
              </div>
            `;
          });
        }

        if (results.designs.length) {
          html += `<div class="cmd-palette__section-label">References</div>`;
          results.designs.forEach(d => {
            html += `
              <div class="cmd-palette__item" data-goto="detail" data-id="${d.id}">
                <img src="/src/assets/icons/nav-library.svg" class="illustrative-icon" alt="" />
                <span>${d.title}</span>
                <span class="text-muted" style="margin-left:auto">${d.componentType || ''}</span>
              </div>
            `;
          });
        }

        if (results.projects.length) {
          html += `<div class="cmd-palette__section-label">Projects</div>`;
          results.projects.forEach(p => {
            html += `
              <div class="cmd-palette__item" data-goto="project-board" data-id="${p.id}">
                <img src="/src/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
                <span>${p.title}</span>
              </div>
            `;
          });
        }

        if (!html) {
          html = '<div class="text-muted" style="padding:20px;text-align:center">No results found</div>';
        }

        resultsEl.innerHTML = html;
        bindActionClicks(resultsEl, close);
        bindGotoClicks(resultsEl, navigate, close);
      }, 200);
    });

    function bindActionClicks(el, closeFn) {
      el.querySelectorAll('[data-action]').forEach(item => {
        item.addEventListener('click', () => {
          const action = ACTIONS[parseInt(item.dataset.action)];
          closeFn();
          action.action();
        });
      });
    }

    function bindGotoClicks(el, nav, closeFn) {
      el.querySelectorAll('[data-goto]').forEach(item => {
        item.addEventListener('click', () => {
          closeFn();
          const page = item.dataset.goto;
          const id = item.dataset.id;
          nav(page, id ? { id } : {});
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
    }
  });
}
