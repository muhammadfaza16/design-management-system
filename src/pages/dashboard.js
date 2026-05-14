// DesignVault — Dashboard Page
import { getStats, getAllDesigns, getAllProjects, getAllBookmarks, getAllPrompts, getAllSnippets, getAllStylePresets, previewBackup, importBackup } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/dialog.js';
import { timeAgo } from '../utils/helpers.js';

export async function renderDashboard(container, navigate) {
  let isInitialized = false;

  async function load() {
    const stats = await getStats();

    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    if (!isInitialized) {
      container.innerHTML = `
    <div class="page animate-fade-in">
      <div class="page__header" style="margin-bottom: 24px;">
        <div>
          <h1 class="page__title">${greeting}, Designer.</h1>
          <p class="page__subtitle">${today} · Your design intelligence at a glance</p>
        </div>
      </div>

      <div style="background: linear-gradient(135deg, rgba(var(--text-rgb),0.03) 0%, rgba(var(--text-rgb),0.01) 100%); border: 1px solid rgba(var(--text-rgb),0.06); border-radius: 20px; padding: 24px 32px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden;">
        <div style="position: absolute; right: -10%; top: -50%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(var(--accent-rgb, 37, 99, 235), 0.1) 0%, transparent 70%); pointer-events: none;"></div>
        <div>
          <div style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">Welcome to DesignVault</div>
          <div style="font-size: 14px; color: var(--text-secondary); max-width: 500px; line-height: 1.6;">Build your ultimate swipe file, manage project moodboards, and catalog your reusable prompt engineering patterns.</div>
        </div>
        <button class="btn btn-primary" id="qa-add-design-hero" style="position: relative; z-index: 1;">
          <img src="/assets/icons/action-add.svg" class="illustrative-icon" alt="" style="filter: brightness(0) invert(1);" />
          Add Reference
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card" data-nav="library" style="position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 1;">
            <div class="stat-card__value">${stats.totalDesigns}</div>
            <div class="stat-card__label">References</div>
          </div>
          <svg style="position: absolute; bottom: 0; right: 0; opacity: 0.03; width: 80px; height: 80px;" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-card" data-nav="projects" style="position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 1;">
            <div class="stat-card__value">${stats.totalProjects}</div>
            <div class="stat-card__label">Projects</div>
          </div>
          <svg style="position: absolute; bottom: -10px; right: -10px; opacity: 0.03; width: 100px; height: 100px;" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
        </div>
        <div class="stat-card" data-nav="bookmarks" style="position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 1;">
            <div class="stat-card__value">${stats.totalBookmarks}</div>
            <div class="stat-card__label">Bookmarks</div>
          </div>
          <svg style="position: absolute; bottom: -5px; right: 0; opacity: 0.03; width: 80px; height: 80px;" viewBox="0 0 24 24" fill="currentColor"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
        </div>
        <div class="stat-card" style="position: relative; overflow: hidden;">
          <div style="position: relative; z-index: 1;">
            <div class="stat-card__value">${stats.totalTags}</div>
            <div class="stat-card__label">Tags</div>
          </div>
          <svg style="position: absolute; bottom: 0; right: 5px; opacity: 0.03; width: 70px; height: 70px;" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V8c0-2.761 2.239-5 5-5z"/></svg>
        </div>
      </div>

      <div class="dashboard-grid" style="margin-bottom: 24px;">
        <div class="dashboard-panel" style="grid-column: span 2;">
          <div class="dashboard-panel__header">
            <div class="section-title" style="margin:0">Quick Actions</div>
          </div>
          <div class="dashboard-panel__body" style="padding:20px">
            <div class="quick-actions" style="display: flex; gap: 16px; flex-wrap: wrap;">
              <button class="quick-action" id="qa-add-design" style="flex: 1; justify-content: center; min-width: 140px;">
                <img src="/assets/icons/action-add.svg" class="illustrative-icon" alt="" />
                <span>Add Reference</span>
              </button>
              <button class="quick-action" id="qa-new-project" style="flex: 1; justify-content: center; min-width: 140px;">
                <img src="/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
                <span>New Project</span>
              </button>
              <button class="quick-action" id="qa-seed-data" style="flex: 1; justify-content: center; min-width: 140px; color: var(--accent); background: rgba(var(--accent-rgb, 37, 99, 235), 0.1); border-color: rgba(var(--accent-rgb, 37, 99, 235), 0.2);">
                <img src="/assets/icons/nav-knowledge.svg" class="illustrative-icon" alt="" style="filter: brightness(0) saturate(100%) invert(35%) sepia(85%) saturate(2250%) hue-rotate(215deg) brightness(96%) contrast(93%);" />
                <span>Seed Dummy Data</span>
              </button>
              <button class="quick-action" id="qa-export" style="flex: 1; justify-content: center; min-width: 140px;">
                <img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="" />
                <span>Export Backup</span>
              </button>
              <button class="quick-action" id="qa-import" style="flex: 1; justify-content: center; min-width: 140px;">
                <img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="" style="transform:rotate(180deg)" />
                <span>Import Backup</span>
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
      container.querySelector('#qa-add-design-hero')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-add-design'));
      });
      container.querySelector('#qa-new-project')?.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-new-project'));
      });
      container.querySelector('#qa-seed-data')?.addEventListener('click', async () => {
        const { seedDummyData } = await import('../db/store.js');
        try {
          await seedDummyData(true); // force true
          showToast('Dummy data seeded successfully! Reloading...', 'success');
          isInitialized = false;
          setTimeout(() => load(), 500);
        } catch (e) {
          showToast('Failed to seed data.', 'error');
        }
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

      // Import Backup
      container.querySelector('#qa-import')?.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json,application/json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', async () => {
          const file = fileInput.files[0];
          fileInput.remove();
          if (!file) return;

          try {
            const text = await file.readAsText ? file.text() : await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsText(file);
            });

            let backup;
            try {
              backup = JSON.parse(text);
            } catch {
              showToast('Invalid file — could not parse JSON.', 'error');
              return;
            }

            const preview = previewBackup(backup);
            if (!preview.valid) {
              showToast(preview.error, 'error');
              return;
            }

            // Build a rich confirmation dialog
            const c = preview.counts;
            const summaryLines = [
              c.designs > 0 ? `${c.designs} design references` : null,
              c.projects > 0 ? `${c.projects} projects` : null,
              c.bookmarks > 0 ? `${c.bookmarks} bookmarks` : null,
              c.prompts > 0 ? `${c.prompts} prompts` : null,
              c.snippets > 0 ? `${c.snippets} snippets` : null,
              c.stylePresets > 0 ? `${c.stylePresets} style presets` : null,
            ].filter(Boolean);

            // Show import mode selection dialog
            const root = document.getElementById('modal-root');
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop';
            backdrop.innerHTML = `
              <div class="modal" style="max-width:480px">
                <div class="modal__header">
                  <h2 class="modal__title" style="font-size:16px">
                    <img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="" style="transform:rotate(180deg)" />
                    Import Backup
                  </h2>
                  <button class="btn-icon" id="import-close">
                    <img src="/assets/icons/status-error.svg" class="illustrative-icon" alt="Close" />
                  </button>
                </div>
                <div class="modal__body">
                  <div style="background:rgba(var(--text-rgb),0.03);border-radius:var(--radius-lg);padding:20px;border:1px solid rgba(var(--text-rgb),0.06);margin-bottom:20px">
                    <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-secondary);margin-bottom:12px">
                      Backup Contents
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px">
                      ${summaryLines.map(line => `<span class="badge" style="font-size:12px;padding:6px 12px">${line}</span>`).join('')}
                    </div>
                    <div style="font-size:11px;color:var(--text-tertiary);margin-top:12px">
                      Version ${preview.version} · Exported ${preview.exportedAt !== 'Unknown' ? new Date(preview.exportedAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>

                  <div style="margin-bottom:8px">
                    <label class="modal__label" style="margin-bottom:12px;display:block">Import Mode</label>
                    <div style="display:flex;flex-direction:column;gap:10px">
                      <label style="display:flex;align-items:flex-start;gap:10px;padding:14px;background:rgba(var(--text-rgb),0.02);border-radius:var(--radius-md);border:1px solid rgba(var(--text-rgb),0.06);cursor:pointer;transition:all 150ms ease" class="import-mode-option">
                        <input type="radio" name="import-mode" value="merge" checked style="margin-top:2px" />
                        <div>
                          <div style="font-weight:600;font-size:13px;color:var(--text-primary)">Merge (Recommended)</div>
                          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Add new items only. Existing data stays untouched.</div>
                        </div>
                      </label>
                      <label style="display:flex;align-items:flex-start;gap:10px;padding:14px;background:rgba(var(--text-rgb),0.02);border-radius:var(--radius-md);border:1px solid rgba(var(--text-rgb),0.06);cursor:pointer;transition:all 150ms ease" class="import-mode-option">
                        <input type="radio" name="import-mode" value="replace" style="margin-top:2px" />
                        <div>
                          <div style="font-weight:600;font-size:13px;color:var(--red)">Replace All</div>
                          <div style="font-size:12px;color:var(--text-secondary);margin-top:2px">Erase all current data and replace with backup contents.</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="modal__footer">
                  <button class="btn btn-secondary" id="import-cancel">Cancel</button>
                  <button class="btn btn-primary" id="import-confirm">
                    <img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="" style="transform:rotate(180deg);filter:brightness(0) invert(1)" />
                    Import Data
                  </button>
                </div>
              </div>`;

            root.appendChild(backdrop);

            const closeModal = () => {
              backdrop.style.animation = 'fadeOut 150ms ease forwards';
              setTimeout(() => backdrop.remove(), 150);
            };

            backdrop.querySelector('#import-close').addEventListener('click', closeModal);
            backdrop.querySelector('#import-cancel').addEventListener('click', closeModal);
            backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });

            backdrop.querySelector('#import-confirm').addEventListener('click', async () => {
              const mode = backdrop.querySelector('input[name="import-mode"]:checked').value;

              // If replace mode, double-confirm
              if (mode === 'replace') {
                const ok = await showConfirm(
                  'This will permanently erase ALL your current data before importing. This cannot be undone. Are you sure?',
                  { title: '⚠️ Replace All Data?', confirmLabel: 'Yes, Replace Everything', danger: true }
                );
                if (!ok) return;
              }

              const confirmBtn = backdrop.querySelector('#import-confirm');
              confirmBtn.innerHTML = '<span>Importing...</span>';
              confirmBtn.disabled = true;

              try {
                const result = await importBackup(backup, mode);
                closeModal();

                const importedTotal = Object.values(result.imported).reduce((a, b) => a + b, 0);
                const parts = [];
                if (result.imported.designs > 0) parts.push(`${result.imported.designs} designs`);
                if (result.imported.projects > 0) parts.push(`${result.imported.projects} projects`);
                if (result.imported.bookmarks > 0) parts.push(`${result.imported.bookmarks} bookmarks`);
                if (result.imported.prompts > 0) parts.push(`${result.imported.prompts} prompts`);
                if (result.imported.snippets > 0) parts.push(`${result.imported.snippets} snippets`);
                if (result.imported.stylePresets > 0) parts.push(`${result.imported.stylePresets} style presets`);

                if (importedTotal > 0) {
                  showToast(`Imported ${parts.join(', ')}${result.skipped > 0 ? ` (${result.skipped} skipped)` : ''}`, 'success');
                } else {
                  showToast(`No new items to import (${result.skipped} already exist)`, 'info');
                }

                // Force full dashboard re-render
                isInitialized = false;
                load();
              } catch (err) {
                console.error('Import failed:', err);
                showToast('Import failed. The file may be corrupted.', 'error');
                confirmBtn.innerHTML = '<span>Import Data</span>';
                confirmBtn.disabled = false;
              }
            });

          } catch (err) {
            console.error('Import error:', err);
            showToast('Failed to read file.', 'error');
          }
        });

        fileInput.click();
      });

      isInitialized = true;
    }

    // --- Dynamic content updates ---
    const dynamicGrid = container.querySelector('#dash-dynamic-grid');
    dynamicGrid.innerHTML = `
      <div class="dashboard-panel" style="grid-column: span 2;">
        <div class="dashboard-panel__header">
          <div class="section-title" style="margin:0">Recent References</div>
          <button class="btn btn-ghost" data-nav="library">View All</button>
        </div>
        <div class="dashboard-panel__body">
          ${stats.recentDesigns.length === 0
            ? '<div class="empty-state" style="padding:40px"><div class="empty-state__icon"><img src="/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.2; width:48px; height:48px;" alt=""/></div><div class="empty-state__title">No references yet</div><div class="empty-state__desc">Your library is empty. Start saving design inspiration.</div></div>'
            : `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding: 20px;">
                ${stats.recentDesigns.slice(0, 3).map(d => `
                  <div class="design-card hover-lift" data-detail="${d.id}" style="border-radius: 12px; margin: 0;">
                    <div class="design-card__thumb" style="aspect-ratio: 16/9;">
                      ${d.imageData 
                        ? `<img src="${d.imageData}" alt="" />`
                        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:var(--bg-input);"><img src="/assets/icons/misc-camera.svg" style="width:24px; opacity:0.2" alt=""/></div>`}
                    </div>
                    <div class="design-card__body" style="padding: 16px;">
                      <div class="design-card__title" style="font-size: 14px;">${d.title}</div>
                      <div class="design-card__meta">${d.componentType || 'misc'} · ${timeAgo(d.createdAt)}</div>
                    </div>
                  </div>
                `).join('')}
               </div>`}
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

  load();
}
