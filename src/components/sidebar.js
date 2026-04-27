// DesignVault — Sidebar
import { getDesignCount, getAllProjects } from '../db/store.js';

export async function renderSidebar(container, currentPage, navigate) {
  const designCount = await getDesignCount();
  const projects = await getAllProjects();

  container.innerHTML = `
    <div class="sidebar__logo">
      <div class="sidebar__logo-icon">DV</div>
      <span class="sidebar__logo-text">DesignVault</span>
    </div>

    <div class="search-bar">
      <span class="search-bar__icon">
        <img src="/src/assets/icons/action-search.svg" class="illustrative-icon" alt="" />
      </span>
      <input class="search-bar__input" id="sidebar-search" type="text" placeholder="Search..." />
      <span class="search-bar__shortcut">/</span>
    </div>

    <nav class="sidebar__nav">
      <div class="sidebar__section">
        <div class="sidebar__section-header">
          <div class="sidebar__section-label">Workspace</div>
        </div>
        <a class="sidebar__link ${currentPage === 'dashboard' ? 'active' : ''}" data-page="dashboard">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/nav-library.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Dashboard</span>
        </a>
        <a class="sidebar__link ${currentPage === 'library' ? 'active' : ''}" data-page="library">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/nav-library.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Library</span>
          <span class="sidebar__link-count">${designCount}</span>
        </a>
        <a class="sidebar__link ${currentPage === 'bookmarks' ? 'active' : ''}" data-page="bookmarks">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/misc-brief.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Bookmarks</span>
        </a>
      </div>

      <div class="sidebar__section">
        <div class="sidebar__section-header">
          <div class="sidebar__section-label">Toolkit</div>
        </div>
        <a class="sidebar__link ${currentPage === 'prompts' ? 'active' : ''}" data-page="prompts">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/ai-prompt.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Prompt Vault</span>
        </a>
        <a class="sidebar__link ${currentPage === 'snippets' ? 'active' : ''}" data-page="snippets">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/action-copy.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Snippets</span>
        </a>
        <a class="sidebar__link ${currentPage === 'styles' ? 'active' : ''}" data-page="styles">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/misc-tags.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Style Presets</span>
        </a>
      </div>

      <div class="sidebar__section">
        <div class="sidebar__section-header">
          <div class="sidebar__section-label">Projects</div>
          <button class="sidebar__section-action" id="sidebar-add-project" title="New Project">+</button>
        </div>
        <a class="sidebar__link ${currentPage === 'projects' ? 'active' : ''}" data-page="projects">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
          </span>
          <span>All Projects</span>
          <span class="sidebar__link-count">${projects.length}</span>
        </a>
        ${projects.slice(0, 8).map(p => `
          <a class="sidebar__link" data-project="${p.id}">
            <span class="sidebar__link-icon">
              <img src="/src/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
            </span>
            <span class="truncate">${p.title}</span>
            <span class="sidebar__link-count">${p.designIds.length}</span>
          </a>
        `).join('')}
        <a class="sidebar__link" id="sidebar-new-design">
          <span class="sidebar__link-icon">
            <img src="/src/assets/icons/action-add.svg" class="illustrative-icon" alt="" />
          </span>
          <span>Add Reference</span>
        </a>
      </div>
    </nav>

    <div class="sidebar__footer" style="display:flex; justify-content:space-between; align-items:center;">
      <div class="sidebar__kbd-hint">
        <kbd>⌘K</kbd> Command Palette
      </div>
      <button class="btn-icon" id="theme-toggle" style="width:24px;height:24px" title="Toggle Theme">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.6">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  `;

  // Navigation
  container.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate(link.dataset.page); });
  });
  container.querySelectorAll('[data-project]').forEach(link => {
    link.addEventListener('click', e => { e.preventDefault(); navigate('project-board', { id: link.dataset.project }); });
  });

  // Actions
  container.querySelector('#sidebar-add-project').addEventListener('click', e => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-new-project'));
  });
  container.querySelector('#sidebar-new-design').addEventListener('click', e => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('open-add-design'));
  });
  container.querySelector('#theme-toggle').addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('toggle-theme'));
  });

  // Search bar opens command palette
  const searchInput = container.querySelector('#sidebar-search');
  searchInput.addEventListener('focus', () => {
    searchInput.blur();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  });
}
