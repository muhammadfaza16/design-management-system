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
import { renderKnowledgeBank } from './pages/knowledge-bank.js';
import { renderKnowledgeDetail } from './pages/knowledge-detail.js';
import { openUploadModal } from './components/upload-modal.js';
import { initCommandPalette } from './components/command-palette.js';

const sidebar = document.getElementById('sidebar');
const main = document.getElementById('main-content');

let currentPage = 'dashboard';
let currentParams = {};

// ─── URL ↔ Route mapping ───────────────────────────────────────────────
function pageToHash(page, params = {}) {
  let hash = `#/${page}`;
  if (params.id) hash += `/${params.id}`;
  return hash;
}

function hashToRoute(hash) {
  if (!hash || hash === '#' || hash === '#/') {
    return { page: 'dashboard', params: {} };
  }
  const parts = hash.replace('#/', '').split('/');
  const page = parts[0] || 'dashboard';
  const params = parts[1] ? { id: parts[1] } : {};
  return { page, params };
}

// ─── Navigation ────────────────────────────────────────────────────────
async function navigate(page, params = {}, { pushState = true } = {}) {
  currentPage = page;
  currentParams = params;

  // Update URL hash without triggering hashchange
  if (pushState) {
    const newHash = pageToHash(page, params);
    if (window.location.hash !== newHash) {
      history.pushState({ page, params }, '', newHash);
    }
  }

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
    case 'knowledge':
      await renderKnowledgeBank(main, navigate);
      break;
    case 'knowledge-detail':
      await renderKnowledgeDetail(main, navigate, params);
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

// ─── Browser back/forward support ──────────────────────────────────────
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) {
    navigate(e.state.page, e.state.params || {}, { pushState: false });
  } else {
    // Fallback: parse from hash
    const { page, params } = hashToRoute(window.location.hash);
    navigate(page, params, { pushState: false });
  }
});

// ─── Global Events ─────────────────────────────────────────────────────
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

// ─── Start: restore from URL or default to dashboard ───────────────────
import { seedDummyData } from './db/store.js';

seedDummyData().then(() => {
  const { page: initialPage, params: initialParams } = hashToRoute(window.location.hash);
  navigate(initialPage, initialParams);
});
