// DesignVault — Library Page
import { searchDesigns, deleteDesign, getAllProjects } from '../db/store.js';
import { timeAgo, getTagColor, debounce, COMPONENT_TYPES } from '../utils/helpers.js';
import { openUploadModal } from '../components/upload-modal.js';
import { showToast } from '../components/toast.js';
import { generatePrompt } from '../utils/prompt-generator.js';
import { copyToClipboard } from '../utils/export.js';

export async function renderLibrary(container, navigate) {
  let currentQuery = '';
  let currentFilter = {};
  let viewMode = 'grid'; // grid or list

  async function render() {
    const projects = await getAllProjects();
    const designs = await searchDesigns(currentQuery, currentFilter);

    container.innerHTML = `
      <div class="page animate-fade-in">
        <div class="breadcrumb">
          <span>Library</span>
          <span class="breadcrumb-sep">/</span>
          <span>All Designs</span>
        </div>

        <div class="page__header">
          <div>
            <h1 class="page__title">Design Library</h1>
            <p class="page__subtitle">Your curated intelligence for design and code</p>
          </div>
          <div style="display:flex;gap:var(--space-4);align-items:center">
            <div class="segmented-control" id="view-mode-toggle">
              <div class="segmented-control__item ${viewMode === 'grid' ? 'active' : ''}" data-mode="grid">Grid</div>
              <div class="segmented-control__item ${viewMode === 'list' ? 'active' : ''}" data-mode="list">List</div>
            </div>
            <button class="btn btn-primary" id="lib-add-btn">
              <img src="/src/assets/icons/action-add.svg" class="illustrative-icon illustrative-icon--sm" alt="Add" />
              Add Reference
            </button>
          </div>
        </div>

        <div class="section-title">Collections</div>
        <div class="collection-grid">
          ${projects.map(p => `
            <div class="collection-card" data-project="${p.id}">
              <div class="collection-card__thumb">
                <img src="/src/assets/icons/nav-library.svg" class="collection-card__icon" alt="Folder" />
              </div>
              <div class="collection-card__info">
                <div class="collection-card__name">${p.title}</div>
                <div class="collection-card__count">${p.designIds.length} items</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="lib-controls">
          <div class="section-title" style="margin-bottom:0">All Designs</div>
          <div class="lib-search-wrap">
            <input type="text" id="lib-search" class="form-control" placeholder="Search by title or #tag..." value="${currentQuery}" style="padding: 6px 12px; font-size: 13px;" />
          </div>
          <div class="segmented-control" id="lib-filters">
            <button class="segmented-control__item ${!currentFilter.componentType ? 'active' : ''}" data-filter="">All</button>
            ${COMPONENT_TYPES.slice(0, 5).map(t => `<button class="segmented-control__item ${currentFilter.componentType === t ? 'active' : ''}" data-filter="${t}">${t}</button>`).join('')}
          </div>
        </div>

        <div id="lib-content">
          ${viewMode === 'grid' ? renderGridView(designs) : renderListView(designs)}
        </div>
      </div>
    `;

    setupEventListeners(designs, projects);
  }

  function renderGridView(designs) {
    if (designs.length === 0) return renderEmptyState();
    return `<div class="design-grid">${designs.map((d, i) => renderCard(d, i)).join('')}</div>`;
  }

  function renderListView(designs) {
    if (designs.length === 0) return renderEmptyState();
    return `
      <table class="table-view">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Tags</th>
            <th>Added</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${designs.map(d => `
            <tr data-id="${d.id}" style="cursor:pointer">
              <td>
                <div class="table-row-name">
                  <div class="table-row-icon">
                    <img src="/src/assets/icons/nav-library.svg" class="illustrative-icon" style="width:14px;opacity:0.6" alt="File" />
                  </div>
                  ${d.title}
                </div>
              </td>
              <td><span class="badge">${d.componentType || 'misc'}</span></td>
              <td>
                <div style="display:flex;gap:4px">
                  ${d.tags.slice(0, 2).map(t => `<span class="badge">${t}</span>`).join('')}
                </div>
              </td>
              <td>${timeAgo(d.createdAt)}</td>
              <td style="text-align:right">
                <button class="btn btn-ghost btn-danger table-delete" data-id="${d.id}" style="padding:4px 8px">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function renderEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-state__title">No items found</div>
        <p class="empty-state__desc">Try adjusting your search or filters.</p>
      </div>
    `;
  }

  function renderCard(d, i) {
    const stagger = i < 10 ? `stagger-${(i % 4) + 1}` : '';
    return `
      <div class="design-card animate-fade-in-up ${stagger}" data-id="${d.id}">
        <div class="design-card__thumb">
          ${d.imageData ? `<img src="${d.imageData}" alt="${d.title}" />` : `<div style="height:100%;display:flex;align-items:center;justify-content:center"><img src="/src/assets/icons/misc-camera.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.12" alt="No image" /></div>`}
        </div>
        <div class="design-card__body">
          <div class="design-card__title truncate">${d.title}</div>
          <div class="design-card__meta">
            <span class="badge">${d.componentType || 'Misc'}</span>
            <span>·</span>
            <span>${timeAgo(d.createdAt)}</span>
          </div>
        </div>
      </div>
    `;
  }

  function setupEventListeners(designs, projects) {
    // Navigation to Detail
    container.querySelectorAll('.design-card, .table-view tr[data-id]').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        navigate('detail', { id: el.dataset.id });
      });
    });

    // Navigation to Project
    container.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('click', () => {
        window.currentProjectId = card.dataset.project;
        navigate('project-board', { id: card.dataset.project });
      });
    });

    // Search
    const searchInput = container.querySelector('#lib-search');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        currentQuery = e.target.value.trim();
        render();
      }, 300));
      // Focus restoration
      setTimeout(() => {
        const input = container.querySelector('#lib-search');
        if (input && currentQuery) {
          input.focus();
          input.selectionStart = input.selectionEnd = input.value.length;
        }
      }, 0);
    }

    // View Toggle
    container.querySelectorAll('#view-mode-toggle .segmented-control__item').forEach(btn => {
      btn.addEventListener('click', () => {
        viewMode = btn.dataset.mode;
        render();
      });
    });

    // Filters
    container.querySelectorAll('#lib-filters .segmented-control__item').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter ? { componentType: btn.dataset.filter } : {};
        render();
      });
    });


    // Delete
    container.querySelectorAll('.table-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (confirm('Delete this design?')) {
          await deleteDesign(btn.dataset.id);
          showToast('Deleted');
          render();
        }
      });
    });

    // Add button
    container.querySelector('#lib-add-btn').addEventListener('click', () => openUploadModal(render));
  }

  render();
}
