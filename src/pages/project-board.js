// DesignVault — Project Kanban Board Page
import JSZip from 'jszip';
import { getProject, updateProject, deleteProject, getAllDesigns, getDesign } from '../db/store.js';
import { generateMasterPrompt } from '../utils/prompt-generator.js';
import { copyToClipboard } from '../utils/export.js';
import { showToast } from '../components/toast.js';
import { openProjectModal } from '../pages/projects.js';

export async function renderProjectBoard(container, navigate, params) {
  const project = await getProject(params.id);
  if (!project) {
    container.innerHTML = `<div class="page"><div class="empty-state">Project not found</div></div>`;
    return;
  }

  // Ensure designStatuses object exists
  if (!project.designStatuses) project.designStatuses = {};

  const allDesigns = await getAllDesigns();
  const projectDesigns = [];
  
  for (const did of project.designIds) {
    const d = await getDesign(did);
    if (d) projectDesigns.push(d);
  }
  
  const availableDesigns = allDesigns.filter(d => !project.designIds.includes(d.id));

  // Organize by columns
  const COLUMNS = ['inspiration', 'approved', 'development'];
  const columns = {
    inspiration: [],
    approved: [],
    development: []
  };

  projectDesigns.forEach(d => {
    const status = project.designStatuses[d.id] || 'inspiration';
    if (columns[status]) columns[status].push(d);
    else columns.inspiration.push(d);
  });

  const renderCard = (d) => {
    const status = project.designStatuses[d.id] || 'inspiration';
    const colIdx = COLUMNS.indexOf(status);
    const canMoveLeft = colIdx > 0;
    const canMoveRight = colIdx < COLUMNS.length - 1;
    return `
    <div class="design-card kanban-card" data-id="${d.id}" draggable="true">
      <div class="design-card__thumb" style="aspect-ratio:16/9">
        ${d.imageData ? `<img src="${d.imageData}" alt="${d.title}" />` : `<div class="detail-image empty" style="height:100%;display:flex;align-items:center;justify-content:center;"><img src="/src/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.1" /></div>`}
      </div>
      <div class="design-card__body" style="padding:12px">
        <div class="design-card__title truncate" style="font-size:12px">${d.title}</div>
        <div class="kanban-card-actions" style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
          <div class="kanban-move-btns" style="display:flex;gap:4px">
            ${canMoveLeft ? `<button class="btn btn-ghost kanban-move" data-id="${d.id}" data-to="${COLUMNS[colIdx - 1]}" style="font-size:9px;padding:2px 6px" title="Move to ${COLUMNS[colIdx - 1]}">← ${COLUMNS[colIdx - 1].slice(0, 3)}</button>` : ''}
            ${canMoveRight ? `<button class="btn btn-ghost kanban-move" data-id="${d.id}" data-to="${COLUMNS[colIdx + 1]}" style="font-size:9px;padding:2px 6px" title="Move to ${COLUMNS[colIdx + 1]}">${COLUMNS[colIdx + 1].slice(0, 3)} →</button>` : ''}
          </div>
          <button class="btn btn-ghost btn-danger board-remove" data-id="${d.id}" style="font-size:10px;padding:2px 6px">Remove</button>
        </div>
      </div>
    </div>
    `;
  };

  container.innerHTML = `
    <div class="page animate-fade-in" style="max-width:100%; padding: 40px;">
      <div class="breadcrumb">
        <span class="breadcrumb-item" data-nav="projects">Projects</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item active">${project.title}</span>
      </div>

      <div class="page__header">
        <div>
          <h1 class="page__title">${project.title}</h1>
          <p class="page__subtitle">${project.description || 'No description'} · ${projectDesigns.length} designs</p>
        </div>
        <div class="page__actions" style="display:flex;gap:12px">
          <button class="btn btn-secondary" id="board-edit">Edit</button>
          <button class="btn btn-primary" id="board-export-zip">
            <img src="/src/assets/icons/nav-library.svg" class="illustrative-icon" style="transform:rotate(90deg)" alt="Export" />
            Export Starter Kit
          </button>
        </div>
      </div>

      ${project.brief ? `
      <div class="detail-section" style="margin-bottom: var(--space-8);">
        <div class="detail-section__title">Project Strategy / Brief</div>
        <p class="detail-notes">${project.brief}</p>
      </div>` : ''}

      <div class="kanban-board" style="display:flex;gap:24px;overflow-x:auto;padding-bottom:24px;min-height:500px">
        <!-- Inspiration Column -->
        <div class="kanban-col" data-col="inspiration" style="flex:1;min-width:300px;background:var(--bg-surface);border-radius:var(--radius-xl);padding:16px;border:1px solid rgba(var(--text-rgb),0.05)">
          <div style="font-size:12px;font-weight:700;color:rgba(var(--text-rgb),0.4);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px;display:flex;justify-content:space-between">
            <span>💡 Inspiration</span>
            <span>${columns.inspiration.length}</span>
          </div>
          <div class="kanban-dropzone" style="min-height:400px">
            ${columns.inspiration.map(renderCard).join('')}
          </div>
        </div>

        <!-- Approved Column -->
        <div class="kanban-col" data-col="approved" style="flex:1;min-width:300px;background:var(--bg-surface);border-radius:var(--radius-xl);padding:16px;border:1px solid rgba(var(--text-rgb),0.05)">
          <div style="font-size:12px;font-weight:700;color:var(--green);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px;display:flex;justify-content:space-between">
            <span>✅ Approved</span>
            <span>${columns.approved.length}</span>
          </div>
          <div class="kanban-dropzone" style="min-height:400px">
            ${columns.approved.map(renderCard).join('')}
          </div>
        </div>

        <!-- Development Column -->
        <div class="kanban-col" data-col="development" style="flex:1;min-width:300px;background:var(--bg-surface);border-radius:var(--radius-xl);padding:16px;border:1px solid rgba(var(--text-rgb),0.05)">
          <div style="font-size:12px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px;display:flex;justify-content:space-between">
            <span>🛠️ In Development</span>
            <span>${columns.development.length}</span>
          </div>
          <div class="kanban-dropzone" style="min-height:400px">
            ${columns.development.map(renderCard).join('')}
          </div>
        </div>
      </div>

      <div class="section-container" style="margin-top:var(--space-12)">
        <div class="section-title">Library / Add to Project</div>
        <div id="board-available" style="margin-top:var(--space-4)">
          ${availableDesigns.length === 0
            ? '<div class="text-muted">All library items are already in this project.</div>'
            : `<div class="design-grid">${availableDesigns.map(d => `
              <div class="design-card board-add-card" data-id="${d.id}">
                <div class="design-card__thumb" style="aspect-ratio:16/9">
                  ${d.imageData ? `<img src="${d.imageData}" alt="${d.title}" />` : `<div class="detail-image empty" style="height:100%;display:flex;align-items:center;justify-content:center;"><img src="/src/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.1" /></div>`}
                </div>
                <div class="design-card__body" style="padding:16px"><div class="design-card__title truncate" style="font-size:13px">${d.title}</div></div>
              </div>
            `).join('')}</div>`
          }
        </div>
      </div>
    </div>
  `;

  const $ = (sel) => container.querySelector(sel);

  // Kanban Drag and Drop Logic
  let draggedCardId = null;

  container.querySelectorAll('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedCardId = card.dataset.id;
      card.style.opacity = '0.5';
    });
    card.addEventListener('dragend', (e) => {
      card.style.opacity = '1';
      draggedCardId = null;
      container.querySelectorAll('.kanban-col').forEach(c => c.style.background = 'var(--bg-surface)');
    });
  });

  container.querySelectorAll('.kanban-col').forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.style.background = 'rgba(255,255,255,0.02)';
    });
    col.addEventListener('dragleave', () => {
      col.style.background = 'var(--bg-surface)';
    });
    col.addEventListener('drop', async (e) => {
      e.preventDefault();
      col.style.background = 'var(--bg-surface)';
      const targetStatus = col.dataset.col;
      
      if (draggedCardId) {
        project.designStatuses[draggedCardId] = targetStatus;
        await updateProject(project.id, { designStatuses: project.designStatuses });
        showToast('Status updated', 'success');
        renderProjectBoard(container, navigate, params);
      }
    });
  });

  // Mobile Move Buttons
  container.querySelectorAll('.kanban-move').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const to = btn.dataset.to;
      project.designStatuses[id] = to;
      await updateProject(project.id, { designStatuses: project.designStatuses });
      showToast(`Moved to ${to}`, 'success');
      renderProjectBoard(container, navigate, params);
    });
  });

  // Export Starter Kit
  $('#board-export-zip').addEventListener('click', async () => {
    const btn = $('#board-export-zip');
    btn.innerHTML = 'Generating...';
    btn.disabled = true;

    try {
      const zip = new JSZip();

      // 1. Master Prompt
      const prompt = generateMasterPrompt(projectDesigns, project);
      zip.file("MASTER_PROMPT.md", prompt);

      // 2. Extracted Variables (from Approved & Development)
      const activeDesigns = projectDesigns.filter(d => 
        ['approved', 'development'].includes(project.designStatuses[d.id])
      );
      
      let cssContent = `:root {\n  /* DesignVault Auto-Generated DNA */\n\n`;
      let colorIndex = 1;
      const seenColors = new Set();

      activeDesigns.forEach(d => {
        if (d.palette) {
          d.palette.forEach(hex => {
            if (!seenColors.has(hex)) {
              seenColors.add(hex);
              cssContent += `  --dv-color-${colorIndex++}: ${hex};\n`;
            }
          });
        }
      });
      cssContent += `}\n`;
      zip.file("variables.css", cssContent);

      // 3. Images folder
      const imgFolder = zip.folder("references");
      activeDesigns.forEach(d => {
        if (d.imageData) {
          // Extract base64 data
          const base64Data = d.imageData.split(',')[1];
          // Determine extension
          const ext = d.imageData.substring(d.imageData.indexOf('/') + 1, d.imageData.indexOf(';'));
          imgFolder.file(`${d.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`, base64Data, {base64: true});
        }
      });

      // Generate Zip
      const content = await zip.generateAsync({type: "blob"});
      
      // Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}-starter-kit.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      showToast('Starter Kit Exported!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Export failed', 'error');
    } finally {
      btn.innerHTML = '<img src="/src/assets/icons/nav-library.svg" class="illustrative-icon" style="transform:rotate(90deg)" alt="Export" /> Export Starter Kit';
      btn.disabled = false;
    }
  });

  // Breadcrumb
  container.querySelectorAll('.breadcrumb-item[data-nav]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.nav));
  });

  // Remove design
  container.querySelectorAll('.board-remove').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const newIds = project.designIds.filter(id => id !== btn.dataset.id);
      delete project.designStatuses[btn.dataset.id];
      await updateProject(project.id, { designIds: newIds, designStatuses: project.designStatuses });
      showToast('Reference removed', 'info');
      renderProjectBoard(container, navigate, params);
    });
  });

  // Add design
  container.querySelectorAll('.board-add-card').forEach(card => {
    card.addEventListener('click', async () => {
      const id = card.dataset.id;
      const newIds = [...project.designIds, id];
      project.designStatuses[id] = 'inspiration';
      await updateProject(project.id, { designIds: newIds, designStatuses: project.designStatuses });
      showToast('Added to project!', 'success');
      renderProjectBoard(container, navigate, params);
    });
  });

  // Edit project
  $('#board-edit').addEventListener('click', () => {
    openProjectModal(() => renderProjectBoard(container, navigate, params), project);
  });
}
