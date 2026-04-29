// DesignVault — Dashboard Page
import { getStats, getAllDesigns, getAllProjects, getAllBookmarks, getAllPrompts, getAllSnippets, getAllStylePresets } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { timeAgo } from '../utils/helpers.js';

export async function renderDashboard(container, navigate) {
  let isInitialized = false;

  async function load() {
    const stats = await getStats();

    if (!isInitialized) {
      container.innerHTML = `
    <div class="page animate-fade-in">
      <div class="page__header">
        <div>
          <h1 class="page__title">Dashboard</h1>
          <p class="page__subtitle">Your design intelligence at a glance</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card" data-nav="library">
          <div class="stat-card__value">${stats.totalDesigns}</div>
          <div class="stat-card__label">References</div>
        </div>
        <div class="stat-card" data-nav="projects">
          <div class="stat-card__value">${stats.totalProjects}</div>
          <div class="stat-card__label">Projects</div>
        </div>
        <div class="stat-card" data-nav="bookmarks">
          <div class="stat-card__value">${stats.totalBookmarks}</div>
          <div class="stat-card__label">Bookmarks</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">${stats.totalTags}</div>
          <div class="stat-card__label">Tags</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-panel">
          <div class="dashboard-panel__header">
            <div class="section-title" style="margin:0">Recent References</div>
            <button class="btn btn-ghost" data-nav="library">View All</button>
          </div>
          <div class="dashboard-panel__body">
            ${stats.recentDesigns.length === 0
              ? '<div class="text-muted" style="padding:20px">No references yet. Add your first design reference.</div>'
              : stats.recentDesigns.map(d => `
                <div class="dashboard-list-item" data-detail="${d.id}">
                  <div class="dashboard-list-item__icon">
                    ${d.imageData
                      ? `<img src="${d.imageData}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;filter:none" />`
                      : `<img src="/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.2" alt="" />`}
                  </div>
                  <div class="dashboard-list-item__info">
                    <div class="dashboard-list-item__title">${d.title}</div>
                    <div class="dashboard-list-item__meta">${d.componentType || 'misc'} · ${timeAgo(d.createdAt)}</div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>

        <div class="dashboard-panel">
          <div class="dashboard-panel__header">
            <div class="section-title" style="margin:0">Recent Projects</div>
            <button class="btn btn-ghost" data-nav="projects">View All</button>
          </div>
          <div class="dashboard-panel__body">
            ${stats.recentProjects.length === 0
              ? '<div class="text-muted" style="padding:20px">No projects yet.</div>'
              : stats.recentProjects.map(p => `
                <div class="dashboard-list-item" data-project="${p.id}">
                  <div class="dashboard-list-item__icon">
                    <img src="/assets/icons/nav-projects.svg" class="illustrative-icon" style="opacity:0.3" alt="" />
                  </div>
                  <div class="dashboard-list-item__info">
                    <div class="dashboard-list-item__title">${p.title}</div>
                    <div class="dashboard-list-item__meta">${p.designIds.length} refs · ${timeAgo(p.createdAt)}</div>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>

        <div class="dashboard-panel">
          <div class="dashboard-panel__header">
            <div class="section-title" style="margin:0">Top Tags</div>
          </div>
          <div class="dashboard-panel__body" style="padding:20px">
            ${stats.topTags.length === 0
              ? '<div class="text-muted">No tags yet.</div>'
              : `<div style="display:flex;flex-wrap:wrap;gap:8px">
                  ${stats.topTags.map(t => `
                    <div class="tag-stat">
                      <span class="tag-stat__name">${t.tag}</span>
                      <span class="tag-stat__count">${t.count}</span>
                    </div>
                  `).join('')}
                </div>`}
          </div>
        </div>

        <div class="dashboard-panel">
          <div class="dashboard-panel__header">
            <div class="section-title" style="margin:0">Quick Actions</div>
          </div>
          <div class="dashboard-panel__body" style="padding:20px">
            <div class="quick-actions">
              <button class="quick-action" id="qa-add-design">
                <img src="/assets/icons/action-add.svg" class="illustrative-icon" alt="" />
                <span>Add Reference</span>
              </button>
              <button class="quick-action" id="qa-new-project">
                <img src="/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
                <span>New Project</span>
              </button>
              <button class="quick-action" id="qa-export">
                <img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="" />
                <span>Export Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" id="dash-dynamic-grid"></div>
    </div>
  `;

      // Navigation (static elements only)
      container.querySelectorAll('[data-nav]').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.nav));
      });

      // Quick Actions
      container.querySelector('#qa-add-design')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-add-design'));
      });
      container.querySelector('#qa-new-project')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-new-project'));
      });

      // Export Backup (full — all DB stores)
      container.querySelector('#qa-export')?.addEventListener('click', async () => {
        const btn = container.querySelector('#qa-export');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="" /><span>Exporting...</span>';
        btn.disabled = true;
        try {
          const [designs, projects, bookmarks, prompts, snippets, stylePresets] = await Promise.all([
            getAllDesigns(), getAllProjects(), getAllBookmarks(),
            getAllPrompts(), getAllSnippets(), getAllStylePresets()
          ]);
          const backup = {
            version: 2,
            exportedAt: new Date().toISOString(),
            data: { designs, projects, bookmarks, prompts, snippets, stylePresets }
          };
          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `designvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          showToast('Backup exported successfully!', 'success');
        } catch (err) {
          console.error('Export failed:', err);
          showToast('Export failed. Please try again.', 'error');
        } finally {
          btn.innerHTML = originalHTML;
          btn.disabled = false;
        }
      });

      isInitialized = true;
    }

    // --- Dynamic content updates ---
    const dynamicGrid = container.querySelector('#dash-dynamic-grid');
    dynamicGrid.innerHTML = `
      <div class="dashboard-panel">
        <div class="dashboard-panel__header">
          <div class="section-title" style="margin:0">Recent References</div>
          <button class="btn btn-ghost" data-nav="library">View All</button>
        </div>
        <div class="dashboard-panel__body">
          ${stats.recentDesigns.length === 0
            ? '<div class="text-muted" style="padding:20px">No references yet. Add your first design reference.</div>'
            : stats.recentDesigns.map(d => `
              <div class="dashboard-list-item" data-detail="${d.id}">
                <div class="dashboard-list-item__icon">
                  ${d.imageData
                    ? `<img src="${d.imageData}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;filter:none" />`
                    : `<img src="/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.2" alt="" />`}
                </div>
                <div class="dashboard-list-item__info">
                  <div class="dashboard-list-item__title">${d.title}</div>
                  <div class="dashboard-list-item__meta">${d.componentType || 'misc'} · ${timeAgo(d.createdAt)}</div>
                </div>
              </div>
            `).join('')}
        </div>
      </div>

      <div class="dashboard-panel">
        <div class="dashboard-panel__header">
          <div class="section-title" style="margin:0">Recent Projects</div>
          <button class="btn btn-ghost" data-nav="projects">View All</button>
        </div>
        <div class="dashboard-panel__body">
          ${stats.recentProjects.length === 0
            ? '<div class="text-muted" style="padding:20px">No projects yet.</div>'
            : stats.recentProjects.map(p => `
              <div class="dashboard-list-item" data-project="${p.id}">
                <div class="dashboard-list-item__icon">
                  <img src="/assets/icons/nav-projects.svg" class="illustrative-icon" style="opacity:0.3" alt="" />
                </div>
                <div class="dashboard-list-item__info">
                  <div class="dashboard-list-item__title">${p.title}</div>
                  <div class="dashboard-list-item__meta">${p.designIds.length} refs · ${timeAgo(p.createdAt)}</div>
                </div>
              </div>
            `).join('')}
        </div>
      </div>

      <div class="dashboard-panel">
        <div class="dashboard-panel__header">
          <div class="section-title" style="margin:0">Top Tags</div>
        </div>
        <div class="dashboard-panel__body" style="padding:20px">
          ${stats.topTags.length === 0
            ? '<div class="text-muted">No tags yet.</div>'
            : `<div style="display:flex;flex-wrap:wrap;gap:8px">
                ${stats.topTags.map(t => `
                  <div class="tag-stat">
                    <span class="tag-stat__name">${t.tag}</span>
                    <span class="tag-stat__count">${t.count}</span>
                  </div>
                `).join('')}
              </div>`}
        </div>
      </div>
    `;

    // Re-attach dynamic navigation listeners
    dynamicGrid.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', () => navigate(el.dataset.nav));
    });
    dynamicGrid.querySelectorAll('[data-detail]').forEach(el => {
      el.addEventListener('click', () => navigate('detail', { id: el.dataset.detail }));
    });
    dynamicGrid.querySelectorAll('[data-project]').forEach(el => {
      el.addEventListener('click', () => navigate('project-board', { id: el.dataset.project }));
    });
  }

  // Navigation
  container.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.nav));
  });
  container.querySelectorAll('[data-detail]').forEach(el => {
    el.addEventListener('click', () => navigate('detail', { id: el.dataset.detail }));
  });
  container.querySelectorAll('[data-project]').forEach(el => {
    el.addEventListener('click', () => navigate('project-board', { id: el.dataset.project }));
  });

  // Quick Actions
  container.querySelector('#qa-add-design')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-add-design'));
  });
  container.querySelector('#qa-new-project')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-new-project'));
  });

  // Export Backup
  container.querySelector('#qa-export')?.addEventListener('click', async () => {
    try {
      const [designs, projects, bookmarks] = await Promise.all([
        getAllDesigns(), getAllProjects(), getAllBookmarks()
      ]);
      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: { designs, projects, bookmarks }
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `designvault-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  });
}
