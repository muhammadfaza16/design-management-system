// DesignVault — Project Kanban Board Page
import JSZip from 'jszip';
import { getProject, updateProject, getAllDesigns, getDesign } from '../db/store.js';
import { generateMasterPrompt } from '../utils/prompt-generator.js';
import { generateAssetPrompt } from '../utils/asset-prompt-engine.js';
import { copyToClipboard } from '../utils/export.js';
import { showToast } from '../components/toast.js';
import { openProjectModal } from '../pages/projects.js';

export async function renderProjectBoard(container, navigate, params) {
  let isInitialized = false;
  let draggedCardId = null;

  // Mutable live refs — updated every load() so static listeners always use fresh data (fixes Bug #3)
  let liveProject = null;
  let liveProjectAssets = [];

  async function load() {
    const project = await getProject(params.id);
    if (!project) {
      container.innerHTML = `<div class="page"><div class="empty-state">Project not found</div></div>`;
      return;
    }

    if (!project.designStatuses) project.designStatuses = {};

    const allDesigns = await getAllDesigns();
    const projectDesigns = [];
    for (const did of project.designIds) {
      const d = await getDesign(did);
      if (d) projectDesigns.push(d);
    }
    const availableDesigns = allDesigns.filter(d => !project.designIds.includes(d.id));

    const COLUMNS = ['inspiration', 'approved', 'development'];
    const columns = { inspiration: [], approved: [], development: [] };

    const assetTypes = ['illustration', 'iconography', '3d-asset', 'project-asset'];
    const projectAssets = projectDesigns.filter(d => assetTypes.includes(d.componentType));
    const kanbanDesigns = projectDesigns.filter(d => !assetTypes.includes(d.componentType));

    // Update live refs so static listeners always see current data (Bug #3 fix)
    liveProject = project;
    liveProject.populatedDesigns = projectDesigns;
    liveProjectAssets = projectAssets;

    kanbanDesigns.forEach(d => {
      const status = project.designStatuses[d.id] || 'inspiration';
      (columns[status] || columns.inspiration).push(d);
    });

    const renderCard = (d) => {
      const status = project.designStatuses[d.id] || 'inspiration';
      const colIdx = COLUMNS.indexOf(status);
      return `
        <div class="design-card kanban-card" data-id="${d.id}" draggable="true">
          <div class="design-card__thumb" style="aspect-ratio:16/9">
            ${d.imageData
              ? `<img src="${d.imageData}" alt="${d.title}" />`
              : `<div class="detail-image empty" style="height:100%;display:flex;align-items:center;justify-content:center;"><img src="/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.1" /></div>`}
          </div>
          <div class="design-card__body" style="padding:12px">
            <div class="design-card__title truncate" style="font-size:12px">${d.title}</div>
            <div class="kanban-card-actions" style="margin-top:8px;display:flex;justify-content:space-between;align-items:center">
              <div style="display:flex;gap:4px">
                ${colIdx > 0 ? `<button class="btn btn-ghost kanban-move" data-id="${d.id}" data-to="${COLUMNS[colIdx - 1]}" style="font-size:9px;padding:2px 6px">← ${COLUMNS[colIdx - 1].slice(0, 3)}</button>` : ''}
                ${colIdx < COLUMNS.length - 1 ? `<button class="btn btn-ghost kanban-move" data-id="${d.id}" data-to="${COLUMNS[colIdx + 1]}" style="font-size:9px;padding:2px 6px">${COLUMNS[colIdx + 1].slice(0, 3)} →</button>` : ''}
              </div>
              <button class="btn btn-ghost btn-danger board-remove" data-id="${d.id}" style="font-size:10px;padding:2px 6px">Remove</button>
            </div>
          </div>
        </div>`;
    };

    // ── STATIC SHELL (rendered once) ──────────────────────────────────────────
    if (!isInitialized) {
      container.innerHTML = `
        <div class="page animate-fade-in" style="max-width:100%;padding:40px;">
          <div class="breadcrumb">
            <span class="breadcrumb-item" data-nav="projects">Projects</span>
            <span class="breadcrumb-sep">/</span>
            <span class="breadcrumb-item active">${project.title}</span>
          </div>

          <div class="page__header">
            <div>
              <h1 class="page__title">${project.title}</h1>
              <p class="page__subtitle" id="proj-subtitle"></p>
            </div>
            <div class="page__actions" style="display:flex;gap:12px">
              <button class="btn btn-secondary" id="board-edit">Edit</button>
              <button class="btn btn-primary" id="board-export-zip">
                <img src="/assets/icons/nav-library.svg" class="illustrative-icon" style="transform:rotate(90deg)" alt="Export" />
                Export Starter Kit
              </button>
            </div>
          </div>

          <div id="board-brief-section"></div>

          <div class="kanban-board" style="display:flex;gap:24px;overflow-x:auto;padding-bottom:24px;min-height:500px">
            ${COLUMNS.map(col => `
              <div class="kanban-col" data-col="${col}" style="flex:1;min-width:300px;background:var(--bg-surface);border-radius:var(--radius-xl);padding:16px;border:1px solid rgba(var(--text-rgb),0.05)">
                <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px;display:flex;justify-content:space-between;color:${col === 'approved' ? 'var(--green)' : col === 'development' ? 'var(--accent)' : 'rgba(var(--text-rgb),0.4)'}">
                  <span>${col === 'inspiration' ? '💡 Inspiration' : col === 'approved' ? '✅ Approved' : '🛠️ In Development'}</span>
                  <span class="kanban-count" data-col="${col}"></span>
                </div>
                <div class="kanban-dropzone" data-col="${col}" style="min-height:400px"></div>
              </div>`).join('')}
          </div>

          <div class="section-container" style="margin-top:var(--space-12);background:var(--bg-surface);padding:24px;border-radius:var(--radius-xl);border:1px solid rgba(var(--text-rgb),0.05)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
              <div class="section-title" style="margin-bottom:0">🎨 Brand Assets &amp; Illustrations</div>
            </div>
            <div style="display:flex;gap:24px;flex-wrap:wrap">
              <div style="flex:1;min-width:300px;background:var(--bg-base);padding:20px;border-radius:var(--radius-lg);border:1px solid rgba(var(--text-rgb),0.06)">
                <div style="font-weight:600;font-size:14px;margin-bottom:12px">Asset Prompt Generator</div>
                <p style="font-size:12px;color:var(--text-secondary);margin-bottom:16px">Generate Midjourney prompts synced with this project's aesthetic DNA.</p>
                <input type="text" id="asset-subject-input" class="form-control" placeholder="e.g. A friendly mascot holding a laptop..." style="margin-bottom:12px" />
                <button class="btn btn-primary" id="btn-generate-asset-prompt" style="width:100%;justify-content:center">Generate Prompt</button>
                <div id="asset-prompt-result" style="display:none;margin-top:16px">
                  <textarea class="form-control" id="asset-prompt-text" rows="4" readonly style="font-family:var(--font-mono);font-size:11px;background:rgba(0,0,0,0.2)"></textarea>
                  <button class="btn btn-secondary" id="btn-copy-asset-prompt" style="width:100%;margin-top:8px;justify-content:center">Copy Prompt</button>
                </div>
              </div>
              <div style="flex:2;min-width:400px" id="project-assets-container"></div>
            </div>
          </div>

          <div class="section-container" style="margin-top:var(--space-12)">
            <div class="section-title">Library / Add to Project</div>
            <div id="board-available" style="margin-top:var(--space-4)"></div>
          </div>
        </div>`;

      const $ = sel => container.querySelector(sel);

      // Breadcrumb
      container.querySelectorAll('.breadcrumb-item[data-nav]').forEach(item => {
        item.addEventListener('click', () => navigate(item.dataset.nav));
      });

      // Edit — uses liveProject ref so always edits current data (Bug #3)
      $('#board-edit').addEventListener('click', () => openProjectModal(load, liveProject));

      // Asset Prompt Generator — uses liveProject & liveProjectAssets refs (Bug #3)
      $('#btn-generate-asset-prompt').addEventListener('click', () => {
        const subject = $('#asset-subject-input').value.trim();
        if (!subject) { showToast('Please enter a subject for the illustration.', 'error'); return; }
        const prompt = generateAssetPrompt(subject, liveProject, liveProjectAssets);
        $('#asset-prompt-text').value = prompt;
        $('#asset-prompt-result').style.display = 'block';
      });

      $('#btn-copy-asset-prompt').addEventListener('click', () => {
        copyToClipboard($('#asset-prompt-text').value);
        const btn = $('#btn-copy-asset-prompt');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy Prompt'; }, 2000);
      });

      // Export Zip — uses liveProject ref (Bug #3)
      $('#board-export-zip').addEventListener('click', async () => {
        const btn = $('#board-export-zip');
        btn.innerHTML = 'Generating...';
        btn.disabled = true;
        try {
          const zip = new JSZip();
          zip.file('MASTER_PROMPT.md', generateMasterPrompt(liveProject.populatedDesigns, liveProject));

          const activeDesigns = liveProject.populatedDesigns.filter(d =>
            ['approved', 'development'].includes(liveProject.designStatuses[d.id])
          );
          let cssContent = `:root {\n  /* DesignVault Auto-Generated DNA */\n\n`;
          let colorIndex = 1;
          const seenColors = new Set();
          activeDesigns.forEach(d => {
            (d.palette || []).forEach(hex => {
              if (!seenColors.has(hex)) { seenColors.add(hex); cssContent += `  --dv-color-${colorIndex++}: ${hex};\n`; }
            });
          });
          cssContent += `}\n`;
          zip.file('variables.css', cssContent);

          const imgFolder = zip.folder('references');
          activeDesigns.forEach(d => {
            if (d.imageData) {
              const base64Data = d.imageData.split(',')[1];
              const ext = d.imageData.substring(d.imageData.indexOf('/') + 1, d.imageData.indexOf(';'));
              imgFolder.file(`${d.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`, base64Data, { base64: true });
            }
          });

          const blob = await zip.generateAsync({ type: 'blob' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${liveProject.title.replace(/\s+/g, '-').toLowerCase()}-starter-kit.zip`;
          link.click();
          URL.revokeObjectURL(link.href);
          showToast('Starter Kit Exported!', 'success');
        } catch (err) {
          console.error(err);
          showToast('Export failed', 'error');
        } finally {
          btn.innerHTML = '<img src="/assets/icons/nav-library.svg" class="illustrative-icon" style="transform:rotate(90deg)" alt="Export" /> Export Starter Kit';
          btn.disabled = false;
        }
      });

      // Kanban column drag listeners — attached once to persistent elements (Bug #4 fix)
      container.querySelectorAll('.kanban-col').forEach(col => {
        col.addEventListener('dragover', e => { e.preventDefault(); col.style.background = 'rgba(255,255,255,0.02)'; });
        col.addEventListener('dragleave', () => { col.style.background = 'var(--bg-surface)'; });
        col.addEventListener('drop', async e => {
          e.preventDefault();
          col.style.background = 'var(--bg-surface)';
          if (!draggedCardId) return;
          liveProject.designStatuses[draggedCardId] = col.dataset.col;
          await updateProject(liveProject.id, { designStatuses: liveProject.designStatuses });
          showToast('Status updated', 'success');
          load();
        });
      });

      isInitialized = true;
    }

    // ── DYNAMIC UPDATES (every load) ─────────────────────────────────────────
    const $d = sel => container.querySelector(sel);

    $d('#proj-subtitle').textContent = `${project.description || 'No description'} · ${projectDesigns.length} designs`;

    // Update brief section
    $d('#board-brief-section').innerHTML = project.brief
      ? `<div class="detail-section" style="margin-bottom:var(--space-8)"><div class="detail-section__title">Project Strategy / Brief</div><p class="detail-notes">${project.brief}</p></div>`
      : '';

    // 1. Kanban columns — re-render cards, then attach drag listeners to NEW card nodes (Bug #4)
    COLUMNS.forEach(colName => {
      const dropzone = container.querySelector(`.kanban-dropzone[data-col="${colName}"]`);
      const countEl = container.querySelector(`.kanban-count[data-col="${colName}"]`);
      if (columns[colName].length === 0) {
        dropzone.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:200px;opacity:0.25;font-size:12px;font-style:italic;">Drop designs here</div>`;
      } else {
        dropzone.innerHTML = columns[colName].map(renderCard).join('');
      }
      countEl.textContent = columns[colName].length;
    });

    // Drag listeners on cards — re-attached after innerHTML update (Bug #4)
    container.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', () => { draggedCardId = card.dataset.id; card.style.opacity = '0.5'; });
      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
        draggedCardId = null;
        container.querySelectorAll('.kanban-col').forEach(c => c.style.background = 'var(--bg-surface)');
      });
    });

    // Kanban move buttons
    container.querySelectorAll('.kanban-move').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        project.designStatuses[btn.dataset.id] = btn.dataset.to;
        await updateProject(project.id, { designStatuses: project.designStatuses });
        showToast(`Moved to ${btn.dataset.to}`, 'success');
        load();
      });
    });

    // Remove from project (Bug #7 — designStatuses entry cleaned up)
    container.querySelectorAll('.board-remove').forEach(btn => {
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        const newIds = project.designIds.filter(id => id !== btn.dataset.id);
        delete project.designStatuses[btn.dataset.id];
        await updateProject(project.id, { designIds: newIds, designStatuses: project.designStatuses });
        showToast('Reference removed', 'info');
        load();
      });
    });

    // 2. Project Assets grid — asset cards use navigate() not hash (Bug #1)
    $d('#project-assets-container').innerHTML = `
      <div style="font-weight:600;font-size:14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center">
        <span>Project Assets</span>
        <button class="btn btn-ghost" id="btn-go-library" style="font-size:12px;color:var(--accent);padding:0">+ Add from Library</button>
      </div>
      ${projectAssets.length === 0
        ? `<div class="empty-state" style="padding:24px">No assets added yet. Add illustrations or icons from the Library.</div>`
        : `<div class="design-grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
            ${projectAssets.map(a => `
              <div class="design-card asset-detail-card" data-id="${a.id}" style="cursor:pointer">
                <div class="design-card__thumb" style="aspect-ratio:1;background:var(--bg-base)">
                  ${a.imageData ? `<img src="${a.imageData}" alt="${a.title}" style="object-fit:cover" />` : `<div style="display:flex;align-items:center;justify-content:center;height:100%"><span style="font-size:24px">🖼️</span></div>`}
                </div>
                <div class="design-card__body" style="padding:12px">
                  <div class="design-card__title truncate" style="font-size:12px">${a.title}</div>
                  <div style="font-size:10px;color:var(--text-secondary);margin-top:4px">${a.componentType}</div>
                </div>
              </div>`).join('')}
          </div>`}`;

    // Asset card → navigate via router, not hash (Bug #1)
    container.querySelectorAll('.asset-detail-card').forEach(card => {
      card.addEventListener('click', () => navigate('detail', { id: card.dataset.id }));
    });

    // "Add from Library" → proper router navigation (Bug #5)
    const goLibBtn = $d('#btn-go-library');
    if (goLibBtn) goLibBtn.addEventListener('click', () => navigate('library'));

    // 3. Available designs (add to project)
    $d('#board-available').innerHTML = availableDesigns.length === 0
      ? '<div class="text-muted">All library items are already in this project.</div>'
      : `<div class="design-grid">${availableDesigns.map(d => `
          <div class="design-card board-add-card" data-id="${d.id}">
            <div class="design-card__thumb" style="aspect-ratio:16/9">
              ${d.imageData ? `<img src="${d.imageData}" alt="${d.title}" />` : `<div class="detail-image empty" style="height:100%;display:flex;align-items:center;justify-content:center;"><img src="/assets/icons/misc-camera.svg" class="illustrative-icon" style="opacity:0.1" /></div>`}
            </div>
            <div class="design-card__body" style="padding:16px"><div class="design-card__title truncate" style="font-size:13px">${d.title}</div></div>
          </div>`).join('')}</div>`;

    container.querySelectorAll('.board-add-card').forEach(card => {
      card.addEventListener('click', async () => {
        const id = card.dataset.id;
        project.designStatuses[id] = 'inspiration';
        await updateProject(project.id, { designIds: [...project.designIds, id], designStatuses: project.designStatuses });
        showToast('Added to project!', 'success');
        load();
      });
    });
  }

  load();
}
