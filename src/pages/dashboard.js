// DesignVault — Dashboard Page
import { getStats } from '../db/store.js';
import { timeAgo } from '../utils/helpers.js';

export async function renderDashboard(container, navigate) {
  const stats = await getStats();

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
                      : `<img src="/src/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.2" alt="" />`}
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
                <img src="/src/assets/icons/action-add.svg" class="illustrative-icon" alt="" />
                <span>Add Reference</span>
              </button>
              <button class="quick-action" id="qa-new-project">
                <img src="/src/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
                <span>New Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Navigation
  container.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.nav));
  });
  container.querySelectorAll('[data-detail]').forEach(el => {
    el.addEventListener('click', () => navigate('detail', { id: el.dataset.detail }));
  });

  // Quick Actions
  container.querySelector('#qa-add-design')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-add-design'));
  });
  container.querySelector('#qa-new-project')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-new-project'));
  });
}
