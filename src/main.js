// DesignVault — Main Entry Point
import './styles/index.css';
import './styles/components.css';
import './styles/animations.css';

import { renderSidebar } from './components/sidebar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderLibrary } from './pages/library.js';
import { renderDesignDetail } from './pages/design-detail.js';
import { renderProjects, openNewProjectModal } from './pages/projects.js';
import { renderProjectBoard } from './pages/project-board.js';
import { renderBookmarks } from './pages/bookmarks.js';
import { renderPromptVault } from './pages/prompt-vault.js';
import { renderSnippets } from './pages/snippets.js';
import { renderStylePresets } from './pages/style-presets.js';
import { openUploadModal } from './components/upload-modal.js';
import { initCommandPalette } from './components/command-palette.js';

const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main-content');

let currentPage = 'dashboard';
let currentParams = {};

async function navigate(page, params = {}) {
  currentPage = page;
  currentParams = params;

  // Auto-close mobile sidebar on navigate
  document.body.classList.remove('sidebar-open');

  // Update sidebar
  await renderSidebar(sidebar, page, navigate);

  // Render page
  switch (page) {
    case 'dashboard':
      await renderDashboard(main, navigate);
      break;
    case 'library':
      await renderLibrary(main, navigate);
      break;
    case 'detail':
      await renderDesignDetail(main, navigate, params);
      break;
    case 'projects':
      await renderProjects(main, navigate);
      break;
    case 'project-board':
      await renderProjectBoard(main, navigate, params);
      break;
    case 'bookmarks':
      await renderBookmarks(main, navigate);
      break;
    case 'prompts':
      await renderPromptVault(main, navigate);
      break;
    case 'snippets':
      await renderSnippets(main, navigate);
      break;
    case 'styles':
      await renderStylePresets(main, navigate);
      break;
    default:
      await renderDashboard(main, navigate);
  }

  window.scrollTo(0, 0);
}

// Global Events
document.getElementById('mobile-nav-toggle')?.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-open');
});
document.getElementById('mobile-sidebar-overlay')?.addEventListener('click', () => {
  document.body.classList.remove('sidebar-open');
});

window.addEventListener('open-add-design', () => {
  openUploadModal(() => navigate(currentPage, currentParams));
});
window.addEventListener('open-new-project', () => {
  openNewProjectModal(() => {
    if (currentPage === 'projects') navigate('projects');
    else navigate(currentPage, currentParams);
  });
});

// Mouse glow
document.addEventListener('mousemove', e => {
  document.body.style.setProperty('--mouse-x', e.clientX + 'px');
  document.body.style.setProperty('--mouse-y', e.clientY + 'px');
});

// Theme handling
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

window.addEventListener('toggle-theme', () => {
  const current = document.documentElement.getAttribute('data-theme');
  if (current === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// Init command palette
initCommandPalette(navigate);

// Start
navigate('dashboard');
