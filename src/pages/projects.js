// DesignVault — Projects Page
import { getAllProjects, addProject, updateProject, deleteProject, getAllProjectFolders, addProjectFolder } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { timeAgo } from '../utils/helpers.js';

let currentFolderId = 'all';

export async function renderProjects(container, navigate) {
  let isInitialized = false;

  async function load() {
    const [projects, folders] = await Promise.all([
      getAllProjects(),
      getAllProjectFolders()
    ]);

    const filteredProjects = currentFolderId === 'all' 
      ? projects 
      : projects.filter(p => p.folderId === currentFolderId);

    if (!isInitialized) {
      container.innerHTML = `
        <div class="page animate-fade-in">
          <div class="page__header">
            <div>
              <h1 class="page__title">Projects</h1>
              <p class="page__subtitle">Organize designs by client or project intelligence</p>
            </div>
            <button class="btn btn-primary" id="proj-add">
              <img src="/assets/icons/action-add.svg" class="illustrative-icon" alt="Add" />
              New Project
            </button>
          </div>

          <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;overflow-x:auto;padding-bottom:8px" id="proj-tabs"></div>
          
          <div id="proj-grid"></div>
        </div>
      `;

      // New project
      container.querySelector('#proj-add').addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('open-new-project'));
      });

      isInitialized = true;
    }

    // Render Tabs
    container.querySelector('#proj-tabs').innerHTML = `
      <button class="filter-chip ${currentFolderId === 'all' ? 'active' : ''}" data-folder="all">All Projects</button>
      ${folders.map(f => `
        <button class="filter-chip ${currentFolderId === f.id ? 'active' : ''}" data-folder="${f.id}" style="display:flex;align-items:center;gap:6px">
          <span style="width:8px;height:8px;border-radius:50%;background:${f.color}"></span>
          ${f.name}
        </button>
      `).join('')}
      <button class="btn-ghost" id="folder-add" style="font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;display:flex;align-items:center;gap:4px">
        <img src="/assets/icons/action-add.svg" class="illustrative-icon illustrative-icon--sm" alt="Add" />
        New Folder
      </button>
    `;

    // Folder Add Listener (Since tabs are re-rendered)
    container.querySelector('#folder-add').addEventListener('click', async () => {
      const name = prompt('Folder Name (e.g. Landing Pages):');
      if (!name) return;
      const colors = ['#8b5cf6', '#10b981', '#d97706', '#ec4899', '#3b82f6', '#f43f5e', '#14b8a6'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const folder = await addProjectFolder({ name, color });
      currentFolderId = folder.id;
      showToast('Folder created', 'success');
      load();
    });

    // Tab Listeners
    container.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFolderId = btn.dataset.folder;
        load();
      });
    });

    // Render Content
    container.querySelector('#proj-grid').innerHTML = `
          ${filteredProjects.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state__icon">
                <img src="/assets/icons/nav-projects.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.1" alt="Empty" />
              </div>
              <div class="empty-state__title">${currentFolderId === 'all' ? 'No active projects' : 'Folder is empty'}</div>
              <p class="text-muted" style="text-align:center;max-width:400px;margin:16px auto">
                Create a project to group design references and generate master intelligence prompts for your workflow.
              </p>
            </div>
          ` : `
            <div class="design-grid">
              ${filteredProjects.map(p => {
                const f = folders.find(folder => folder.id === p.folderId);
                return `
                <div class="design-card project-item-card" data-id="${p.id}">
                  <div class="design-card__body" style="padding:32px">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start">
                      <div class="design-card__title" style="font-size:18px">${p.title}</div>
                      <div class="badge badge--purple">${p.designIds.length} Refs</div>
                    </div>
                    ${f ? `
                      <div style="display:flex;align-items:center;gap:6px;margin-top:6px;font-size:10px;font-weight:600;color:rgba(var(--text-rgb),0.4)">
                        <span style="width:6px;height:6px;border-radius:50%;background:${f.color}"></span>
                        ${f.name}
                      </div>
                    ` : ''}
                    <p class="detail-notes" style="margin-top:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:44px">
                      ${p.description || 'No description provided.'}
                    </p>
                    ${p.designIds.length > 0 ? (() => {
                      const statuses = p.designStatuses || {};
                      const insp = p.designIds.filter(id => !statuses[id] || statuses[id] === 'inspiration').length;
                      const appr = p.designIds.filter(id => statuses[id] === 'approved').length;
                      const dev = p.designIds.filter(id => statuses[id] === 'development').length;
                      const total = p.designIds.length;
                      return `
                        <div style="margin-top:16px">
                          <div style="display:flex;height:4px;border-radius:4px;overflow:hidden;background:rgba(var(--text-rgb),0.06)">
                            ${insp > 0 ? `<div style="width:${insp/total*100}%;background:rgba(var(--text-rgb),0.2)"></div>` : ''}
                            ${appr > 0 ? `<div style="width:${appr/total*100}%;background:#3b82f6"></div>` : ''}
                            ${dev > 0 ? `<div style="width:${dev/total*100}%;background:#10b981"></div>` : ''}
                          </div>
                          <div style="display:flex;gap:12px;margin-top:6px;font-size:10px;font-weight:600;color:rgba(var(--text-rgb),0.35)">
                            <span>${insp} Insp</span>
                            <span style="color:#3b82f6">${appr} Appr</span>
                            <span style="color:#10b981">${dev} Dev</span>
                          </div>
                        </div>
                      `;
                    })() : ''}
                    <div class="design-card__meta" style="margin-top:24px;justify-content:space-between">
                      <span>Updated ${timeAgo(p.updatedAt)}</span>
                      <div style="display:flex;gap:4px">
                        <button class="btn btn-ghost proj-edit" data-id="${p.id}" style="font-size:11px">Edit</button>
                        <button class="btn btn-ghost btn-danger proj-delete" data-id="${p.id}" style="font-size:11px">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
                `;
              }).join('')}
            </div>
          `}
    `;
    
    // Dynamic Listeners

    // Navigate to project
    container.querySelectorAll('.project-item-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.proj-delete') || e.target.closest('.proj-edit')) return;
        navigate('project-board', { id: card.dataset.id });
      });
    });

    // Edit
    container.querySelectorAll('.proj-edit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const proj = projects.find(p => p.id === btn.dataset.id);
        if (proj) openProjectModal(load, proj);
      });
    });

    // Delete
    container.querySelectorAll('.proj-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Delete this project? This action cannot be undone.')) {
          await deleteProject(btn.dataset.id);
          showToast('Project deleted', 'info');
          load();
        }
      });
    });
  }

  load();
}

/**
 * Opens the project modal in create or edit mode.
 * @param {Function} onComplete - callback after save
 * @param {Object|null} existing - if provided, opens in EDIT mode
 */
export async function openProjectModal(onComplete, existing = null) {
  const folders = await getAllProjectFolders();
  const root = document.getElementById('modal-root');
  const isEdit = !!existing;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">
          <img src="/assets/icons/nav-projects.svg" class="illustrative-icon" alt="" />
          ${isEdit ? 'Edit Project' : 'New Project'}
        </h2>
        <button class="btn-icon" id="proj-modal-close">
          <img src="/assets/icons/status-error.svg" class="illustrative-icon" alt="Close" />
        </button>
      </div>
      <div class="modal__body">
        <div class="modal__field">
          <label class="modal__label">Project Title</label>
          <input type="text" id="proj-title" placeholder="e.g. Client Landing Page Redesign" value="${existing?.title || ''}" autofocus />
        </div>
        <div class="modal__field">
          <label class="modal__label">Executive Summary</label>
          <textarea id="proj-desc" placeholder="Brief description of the project..." rows="2">${existing?.description || ''}</textarea>
        </div>
        ${folders.length > 0 ? `
          <div class="modal__field">
            <label class="modal__label">Folder / Category</label>
            <select id="proj-folder">
              <option value="">No Folder</option>
              ${folders.map(f => `
                <option value="${f.id}" ${existing?.folderId === f.id ? 'selected' : ''}>${f.name}</option>
              `).join('')}
            </select>
          </div>
        ` : ''}
        <div class="modal__field">
          <label class="modal__label">Intelligence Brief / Strategy</label>
          <textarea id="proj-brief" placeholder="Requirements, goals, target audience, and key design constraints..." rows="4">${existing?.brief || ''}</textarea>
        </div>
      </div>
      <div class="modal__footer">
        <button class="btn btn-secondary" id="proj-modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="proj-modal-save">${isEdit ? 'Update Project' : 'Create Project'}</button>
      </div>
    </div>
  `;
  root.appendChild(backdrop);

  const close = () => { backdrop.style.animation = 'fadeOut 200ms ease forwards'; setTimeout(() => backdrop.remove(), 200); };
  backdrop.querySelector('#proj-modal-close').addEventListener('click', close);
  backdrop.querySelector('#proj-modal-cancel').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  backdrop.querySelector('#proj-modal-save').addEventListener('click', async () => {
    const title = backdrop.querySelector('#proj-title').value.trim();
    if (!title) { showToast('Enter a project name', 'error'); return; }

    const data = {
      title,
      description: backdrop.querySelector('#proj-desc').value.trim(),
      brief: backdrop.querySelector('#proj-brief').value.trim(),
    };
    
    const folderSelect = backdrop.querySelector('#proj-folder');
    if (folderSelect) {
      data.folderId = folderSelect.value || null;
    }

    if (isEdit) {
      await updateProject(existing.id, data);
      showToast('Project updated!', 'success');
    } else {
      await addProject(data);
      showToast('Project created!', 'success');
    }

    close();
    if (onComplete) onComplete();
  });
}

// Legacy alias for backward compatibility
export const openNewProjectModal = (onComplete) => openProjectModal(onComplete, null);
