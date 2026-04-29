// DesignVault — Design Detail Page
import { getDesign, updateDesign, deleteDesign, addDesign, getAllProjects, updateProject } from '../db/store.js';
import { generatePrompt } from '../utils/prompt-generator.js';
import { suggestSections, formatSectionsForPrompt } from '../utils/section-suggestions.js';
import { copyToClipboard, downloadMarkdown } from '../utils/export.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/dialog.js';
import { openLightbox } from '../components/lightbox.js';
import { openUploadModal } from '../components/upload-modal.js';
import { formatDate, getTagColor, extractColorsFromImage } from '../utils/helpers.js';
import { KNOWLEDGE_BANK } from '../utils/knowledge-base.js';

export async function renderDesignDetail(container, navigate, params) {
  const DNA_FEATURES = ['Typography', 'Color Palette', 'Layout & Grid', 'Shadows & Elevation', 'Micro-interactions', 'Imagery & Illustration', 'Card Anatomy', 'Borders & Shapes', 'Data Viz'];
  const DNA_VIBES = ['Minimalist', 'Premium', 'Playful', 'Brutalist', 'Enterprise SaaS', 'Editorial', 'Dark Mode', 'Glassmorphism', 'Retro'];

  const [design, projects] = await Promise.all([
    getDesign(params.id),
    getAllProjects()
  ]);
  if (!design) {
    container.innerHTML = `
      <div class="page">
        <div class="empty-state">
          <div class="empty-state__title">Design not found</div>
          <button class="btn btn-secondary" id="back-btn">
            <img src="/assets/icons/nav-library.svg" class="illustrative-icon illustrative-icon--sm" style="transform: rotate(180deg);" alt="Back" />
            Back to Library
          </button>
        </div>
      </div>
    `;
    container.querySelector('#back-btn')?.addEventListener('click', () => navigate('library'));
    return;
  }

  // Feature 1: Design DNA Extraction
  if (!design.palette && design.imageData) {
    design.palette = await extractColorsFromImage(design.imageData);
    await updateDesign(design.id, { palette: design.palette });
  }

  const currentPrompt = design.prompt || generatePrompt(design);

  container.innerHTML = `
    <div class="page animate-fade-in">
      <div class="breadcrumb">
        <span class="breadcrumb-item" data-nav="library">Library</span>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item active">${design.title}</span>
      </div>

      <div class="page__header">
        <div style="display:flex;align-items:center;gap:var(--space-4)">
          <div>
            <h1 class="page__title">${design.title}</h1>
            <p class="page__subtitle">
              ${design.url ? `<a href="${design.url}" target="_blank" class="link-styled">${design.url}</a>` : 'No source URL'} 
              · Added ${formatDate(design.createdAt)}
            </p>
          </div>
        </div>
        <div class="page__actions" style="display:flex;gap:12px">
          <button class="btn btn-ghost btn-danger" id="detail-delete">
            Delete
          </button>
          <button class="btn btn-secondary" id="detail-duplicate">
            Duplicate
          </button>
          <button class="btn btn-secondary" id="detail-edit">
            Edit
          </button>
          <button class="btn btn-secondary" id="detail-download">
            <img src="/assets/icons/action-export.svg" class="illustrative-icon" alt="Export" />
            Export
          </button>
          <button class="btn btn-primary" id="detail-copy-prompt">
            <img src="/assets/icons/action-copy.svg" class="illustrative-icon" alt="Copy" />
            Copy Prompt
          </button>
        </div>
      </div>

      <div class="detail-layout">
        <div class="detail-main">
          ${design.imageData ? `
            <div class="detail-image" id="detail-img">
              <img src="${design.imageData}" alt="${design.title}" />
            </div>
          ` : `
            <div class="detail-image empty" style="aspect-ratio:16/10;display:flex;align-items:center;justify-content:center;">
              <img src="/assets/icons/misc-camera.svg" class="illustrative-icon illustrative-icon--lg" style="opacity: 0.1;" alt="No image" />
            </div>
          `}
          
          ${design.palette && design.palette.length > 0 ? `
          <div class="detail-section" style="margin-top:var(--space-6);margin-bottom:var(--space-2)">
            <div class="detail-section__title">
              <img src="/assets/icons/misc-brief.svg" class="illustrative-icon" alt="Palette" />
              Design DNA Colors
            </div>
            <div class="color-palette">
              ${design.palette.map(hex => `
                <div class="color-swatch-labeled dna-swatch" data-hex="${hex}" title="Click to copy">
                  <div class="color-swatch" style="background:${hex}"></div>
                  <div class="color-swatch-hex">${hex.toUpperCase()}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <!-- AESTHETIC DNA EXTRACTION LAYER -->
          <div class="detail-section" style="margin-top:var(--space-8); background:rgba(var(--text-rgb),0.02); padding:24px; border-radius:12px; border:1px solid rgba(var(--text-rgb),0.06)">
            <div class="detail-section__title" style="margin-bottom:16px">
              <img src="/assets/icons/misc-tags.svg" class="illustrative-icon" alt="DNA" />
              Aesthetic DNA Extraction
            </div>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:20px;margin-top:-8px">
              What makes this reference special? Extracting its DNA helps you find it later and generates a hyper-focused AI prompt.
            </p>

            <div style="margin-bottom:20px">
              <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Standout Features</label>
              <div style="display:flex;flex-wrap:wrap;gap:8px" id="dna-features">
                ${DNA_FEATURES.map(f => `
                  <button class="filter-chip dna-chip ${design.aestheticFeatures && design.aestheticFeatures.includes(f) ? 'active' : ''}" data-type="feature" data-val="${f}">
                    ${f}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="margin-bottom:20px">
              <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Vibe & Mood</label>
              <div style="display:flex;flex-wrap:wrap;gap:8px" id="dna-vibes">
                ${DNA_VIBES.map(v => `
                  <button class="filter-chip dna-chip ${design.aestheticVibes && design.aestheticVibes.includes(v) ? 'active' : ''}" data-type="vibe" data-val="${v}">
                    ${v}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label style="font-size:11px;font-weight:700;color:var(--text-secondary);display:block;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">The Special Sauce (Note)</label>
              <textarea id="dna-sauce" class="form-control" rows="2" placeholder="e.g., 'The way the glassmorphism card overlaps the dark hero section...'"
                style="resize:vertical;min-height:60px;background:var(--bg-surface)">${design.specialSauceNote || ''}</textarea>
            </div>
          </div>

          <div class="detail-section" style="margin-top:var(--space-8)">
            <div class="detail-section__title" style="margin-bottom:12px">
              <img src="/assets/icons/misc-brief.svg" class="illustrative-icon" alt="Apply" />
              Apply to Project
            </div>
            
            <div style="margin-bottom:12px">
              <label style="font-size:11px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">Target Project</label>
              <select id="project-select" class="form-control" style="margin-bottom:12px">
                <option value="">-- Standalone (No Project) --</option>
                ${projects.map(p => `<option value="${p.id}" ${design.projectId === p.id ? 'selected' : ''}>${p.title}</option>`).join('')}
              </select>
            </div>

            <label style="font-size:11px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">Specific Use Case / Notes</label>
            <textarea id="use-case-input" class="form-control" rows="3" placeholder="What exactly do you want to build using this reference?"
              style="margin-bottom:8px;resize:vertical;min-height:80px">${design.useCase || ''}</textarea>
            
            <div id="section-suggestions" style="margin-top:12px"></div>
            
            <!-- Knowledge Injection UI -->
            <div style="margin-top:20px;margin-bottom:12px">
              <label style="font-size:11px;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">
                Inject Design Principles
                <span style="opacity:0.4;font-weight:400;text-transform:none;letter-spacing:0">(optional)</span>
              </label>
              <div style="display:flex;flex-wrap:wrap;gap:6px" id="knowledge-injections">
                ${KNOWLEDGE_BANK.map(k => `
                  <button class="filter-chip knowledge-chip ${design.knowledgeInjections && design.knowledgeInjections.includes(k.id) ? 'active' : ''}" data-kid="${k.id}" title="${k.description}">
                    + ${k.title}
                  </button>
                `).join('')}
              </div>
            </div>

            <div style="display:flex;gap:8px;margin-top:12px">
              <button class="btn btn-primary" id="generate-final" style="font-size:13px">
                <img src="/assets/icons/ai-prompt.svg" class="illustrative-icon" alt="" />
                Generate Final Prompt
              </button>
            </div>
          </div>

          <div class="prompt-editor" style="margin-top:var(--space-8)">
            <div class="prompt-editor__header">
              <div class="prompt-editor__title">
                <img src="/assets/icons/ai-prompt.svg" class="illustrative-icon" alt="AI" />
                Final Prompt
              </div>
              <div class="prompt-editor__actions" style="display:flex;gap:8px">
                <button class="btn-icon" id="prompt-regenerate" title="Regenerate from metadata">
                  <img src="/assets/icons/nav-library.svg" class="illustrative-icon" style="width:16px;height:16px" alt="Regenerate" />
                </button>
                <button class="btn-icon" id="prompt-copy" title="Copy Prompt">
                  <img src="/assets/icons/action-copy.svg" class="illustrative-icon" style="width:16px;height:16px" alt="Copy" />
                </button>
              </div>
            </div>
            <textarea class="prompt-editor__textarea" id="prompt-textarea" spellcheck="false">${currentPrompt}</textarea>
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/rating-star.svg" class="illustrative-icon" alt="Rating" />
              Intelligence Rating
            </div>
            <div class="star-rating" id="star-rating">
              ${[1,2,3,4,5].map(i => `
                <span class="star-rating__star ${i <= design.rating ? 'filled' : ''}" data-val="${i}">
                  <img src="/assets/icons/rating-star.svg" class="illustrative-icon" alt="Star" />
                </span>
              `).join('')}
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/misc-tags.svg" class="illustrative-icon" alt="Tags" />
              Meta Tags
            </div>
            <div class="tag-input-wrap" id="tag-container">
              ${design.tags.map(t => `<span class="badge badge--${getTagColor(t)} tag-remove" data-tag="${t}" title="Click to remove">${t} ×</span>`).join('')}
              <input type="text" id="tag-input" placeholder="Add tag..." />
            </div>
          </div>

          ${design.componentType ? `
          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/nav-components.svg" class="illustrative-icon" alt="Component" />
              Classification
            </div>
            <span class="badge badge--${getTagColor(design.componentType)}">${design.componentType}</span>
          </div>` : ''}

          ${design.focalComponents && design.focalComponents.length > 0 ? `
          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/nav-components.svg" class="illustrative-icon" alt="Focal" />
              Focal Elements
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px">
              ${design.focalComponents.map(f => `<span class="badge">${f}</span>`).join('')}
            </div>
          </div>` : ''}

          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/nav-library.svg" class="illustrative-icon" alt="Colors" />
              Color Palette
            </div>
            <div class="color-palette">
              ${design.colors.length ? design.colors.map(c =>
                `<div class="color-swatch" style="background:${c.hex}" title="${c.hex} — ${c.label}" data-hex="${c.hex}"></div>`
              ).join('') : '<span class="text-muted">No colors extracted</span>'}
            </div>
          </div>

          ${design.aiAnalysis ? `
          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/ai-prompt.svg" class="illustrative-icon" alt="DNA" />
              Style DNA
            </div>
            <pre style="font-size:11px;font-family:var(--font-mono);color:rgba(0,0,0,0.55);white-space:pre-wrap;word-break:break-word;max-height:300px;overflow-y:auto;padding:12px;background:rgba(0,0,0,0.02);border:1px solid rgba(0,0,0,0.06);border-radius:8px">${design.aiAnalysis}</pre>
          </div>` : ''}

          ${design.notes ? `
          <div class="detail-section">
            <div class="detail-section__title">
              <img src="/assets/icons/misc-notes.svg" class="illustrative-icon" alt="Notes" />
              Curation Notes
            </div>
            <p class="detail-notes">${design.notes}</p>
          </div>` : ''}
        </div>
      </div>
    </div>
  `;

  // --- Listeners ---
  const $ = (sel) => container.querySelector(sel);

  // Breadcrumb / Back
  container.querySelectorAll('.breadcrumb-item[data-nav]').forEach(item => {
    item.addEventListener('click', () => navigate(item.dataset.nav));
  });

  // Lightbox
  const detailImg = $('#detail-img');
  if (detailImg) detailImg.addEventListener('click', () => openLightbox(design.imageData));

  // Copy DNA colors
  container.querySelectorAll('.dna-swatch').forEach(swatch => {
    swatch.addEventListener('click', async () => {
      const hex = swatch.dataset.hex;
      await copyToClipboard(hex);
      showToast(`Copied ${hex.toUpperCase()}!`, 'success');
    });
  });

  // Rating
  container.querySelectorAll('.star-rating__star').forEach(star => {
    star.addEventListener('click', async () => {
      const val = parseInt(star.dataset.val);
      await updateDesign(design.id, { rating: val });
      container.querySelectorAll('.star-rating__star').forEach((s, i) => {
        s.classList.toggle('filled', i < val);
      });
      showToast(`Rated ${val} stars`, 'success');
    });
  });

  // Tagging
  function renderTags() {
    const tagContainer = $('#tag-container');
    if (!tagContainer) return;
    
    const tagsHTML = design.tags.map(t => `<span class="badge badge--${getTagColor(t)} tag-remove" data-tag="${t}" title="Click to remove">${t} ×</span>`).join('');
    tagContainer.innerHTML = tagsHTML + '<input type="text" id="tag-input" placeholder="Add tag..." />';
    
    const tagInput = $('#tag-input');
    tagInput.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = tagInput.value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
        if (val && !design.tags.includes(val)) {
          design.tags.push(val);
          await updateDesign(design.id, { tags: design.tags });
          showToast('Tag added', 'success');
          renderTags();
          setTimeout(() => $('#tag-input').focus(), 0);
        } else {
          tagInput.value = '';
        }
      }
    });

    container.querySelectorAll('.tag-remove').forEach(badge => {
      badge.addEventListener('click', async () => {
        const t = badge.dataset.tag;
        design.tags = design.tags.filter(tag => tag !== t);
        await updateDesign(design.id, { tags: design.tags });
        showToast('Tag removed', 'info');
        renderTags();
      });
    });
  }

  renderTags();

  // Actions
  const copyPromptText = async () => {
    const text = $('#prompt-textarea').value;
    await copyToClipboard(text);
    showToast('Prompt copied!', 'success');
  };
  $('#detail-copy-prompt').addEventListener('click', copyPromptText);
  $('#prompt-copy').addEventListener('click', copyPromptText);
  // =============================================
  // SECTION SUGGESTIONS, KNOWLEDGE INJECTIONS & DNA
  // =============================================
  let selectedSections = design.selectedSections ? [...design.selectedSections] : [];
  let selectedKnowledge = design.knowledgeInjections ? [...design.knowledgeInjections] : [];
  let aestheticFeatures = design.aestheticFeatures ? [...design.aestheticFeatures] : [];
  let aestheticVibes = design.aestheticVibes ? [...design.aestheticVibes] : [];
  
  const suggestionsEl = container.querySelector('#section-suggestions');

  function renderSuggestions(text) {
    const { type, sections } = suggestSections(text);
    if (!type || !sections.length) {
      suggestionsEl.innerHTML = '';
      return;
    }

    // Auto-select all on first detection if nothing selected yet
    if (selectedSections.length === 0) {
      selectedSections = sections.map(s => ({ ...s }));
    }

    suggestionsEl.innerHTML = `
      <div style="margin-bottom:8px;display:flex;align-items:center;gap:8px">
        <span style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:rgba(0,0,0,0.4)">
          Detected: ${type.label}
        </span>
        <button class="btn btn-ghost" id="toggle-all-sections" style="font-size:10px;padding:2px 8px">
          ${selectedSections.length === sections.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${sections.map(s => {
          const isActive = selectedSections.some(ss => ss.id === s.id);
          return `<button class="filter-chip section-chip ${isActive ? 'active' : ''}" data-section-id="${s.id}" title="${s.desc}">${s.label}</button>`;
        }).join('')}
      </div>
    `;

    // Toggle individual sections
    suggestionsEl.querySelectorAll('.section-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.sectionId;
        const section = sections.find(s => s.id === id);
        const idx = selectedSections.findIndex(s => s.id === id);
        if (idx >= 0) {
          selectedSections.splice(idx, 1);
          chip.classList.remove('active');
        } else {
          selectedSections.push({ ...section });
          chip.classList.add('active');
        }
      });
    });

    // Toggle all
    const toggleBtn = suggestionsEl.querySelector('#toggle-all-sections');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (selectedSections.length === sections.length) {
          selectedSections = [];
        } else {
          selectedSections = sections.map(s => ({ ...s }));
        }
        renderSuggestions(text);
      });
    }
  }

  // Debounced input handler
  let suggestTimer;
  container.querySelector('#use-case-input').addEventListener('input', (e) => {
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(() => {
      selectedSections = []; // reset on new input
      renderSuggestions(e.target.value.trim());
    }, 400);
  });

  // Initial render if existing use case
  if (design.useCase) {
    renderSuggestions(design.useCase);
  }

  // Knowledge toggle
  container.querySelectorAll('.knowledge-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const kid = chip.dataset.kid;
      if (selectedKnowledge.includes(kid)) {
        selectedKnowledge = selectedKnowledge.filter(id => id !== kid);
        chip.classList.remove('active');
      } else {
        selectedKnowledge.push(kid);
        chip.classList.add('active');
      }
    });
  });

  // DNA Extraction toggle
  container.querySelectorAll('.dna-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      const type = chip.dataset.type;
      const val = chip.dataset.val;
      const targetArr = type === 'feature' ? aestheticFeatures : aestheticVibes;
      
      if (targetArr.includes(val)) {
        const idx = targetArr.indexOf(val);
        targetArr.splice(idx, 1);
        chip.classList.remove('active');
      } else {
        targetArr.push(val);
        chip.classList.add('active');
      }
      
      // Auto-save
      await updateDesign(design.id, { aestheticFeatures, aestheticVibes });
      design.aestheticFeatures = aestheticFeatures;
      design.aestheticVibes = aestheticVibes;
    });
  });

  // Auto-save Special Sauce
  $('#dna-sauce').addEventListener('blur', async () => {
    const specialSauceNote = $('#dna-sauce').value.trim();
    if (specialSauceNote !== (design.specialSauceNote || '')) {
      await updateDesign(design.id, { specialSauceNote });
      design.specialSauceNote = specialSauceNote;
      showToast('DNA Note saved');
    }
  });

  // Generate Final Prompt with use case + sections + knowledge
  $('#generate-final').addEventListener('click', async () => {
    const useCase = $('#use-case-input').value.trim();
    const projectId = $('#project-select').value;
    
    if (!useCase && !projectId) {
      showToast('Select a project or describe your use case first', 'error');
      return;
    }
    
    // Update design with project linkage and knowledge
    await updateDesign(design.id, { useCase, selectedSections, projectId, knowledgeInjections: selectedKnowledge });
    design.useCase = useCase;
    design.selectedSections = selectedSections;
    design.projectId = projectId;
    design.knowledgeInjections = selectedKnowledge;
    
    // If a project is selected, ensure this design is added to its designIds
    if (projectId) {
      const proj = projects.find(p => p.id === projectId);
      if (proj && !proj.designIds.includes(design.id)) {
        await updateProject(projectId, { designIds: [...proj.designIds, design.id] });
      }
    }

    // Optionally fetch project brief to append to prompt context
    let fullContext = useCase;
    if (projectId) {
      const proj = projects.find(p => p.id === projectId);
      if (proj && proj.brief) {
        fullContext = `Project Context: ${proj.brief}\n\nSpecific Task: ${useCase}`;
      }
    }
    
    // Temporarily swap useCase for generation if we have project context
    const originalUseCase = design.useCase;
    if (fullContext) design.useCase = fullContext;
    
    $('#prompt-textarea').value = generatePrompt(design);
    
    design.useCase = originalUseCase; // restore
    
    showToast('Final prompt generated!', 'success');
  });

  $('#prompt-regenerate').addEventListener('click', () => {
    design.useCase = $('#use-case-input').value.trim();
    design.selectedSections = selectedSections;
    $('#prompt-textarea').value = generatePrompt(design);
    showToast('Prompt regenerated', 'info');
  });

  // Auto-save on blur
  $('#use-case-input').addEventListener('blur', async () => {
    const useCase = $('#use-case-input').value.trim();
    const projectId = $('#project-select').value;
    if (useCase !== (design.useCase || '')) {
      await updateDesign(design.id, { useCase, selectedSections, projectId, knowledgeInjections: selectedKnowledge });
      design.useCase = useCase;
      design.selectedSections = selectedSections;
      design.projectId = projectId;
      design.knowledgeInjections = selectedKnowledge;
    }
  });

  $('#project-select').addEventListener('change', async () => {
    const useCase = $('#use-case-input').value.trim();
    const projectId = $('#project-select').value;
    await updateDesign(design.id, { useCase, selectedSections, projectId, knowledgeInjections: selectedKnowledge });
    design.projectId = projectId;
    showToast('Project link updated', 'info');
  });

  $('#detail-download').addEventListener('click', () => {
    const text = $('#prompt-textarea').value;
    downloadMarkdown(text, `${design.title.replace(/\s+/g, '-').toLowerCase()}-prompt.md`);
    showToast('Prompt exported!', 'success');
  });

  // Edit
  $('#detail-edit').addEventListener('click', () => {
    openUploadModal(() => renderDesignDetail(container, navigate, params), design);
  });

  // Duplicate
  $('#detail-duplicate').addEventListener('click', async () => {
    const clone = await addDesign({
      title: design.title + ' (Copy)',
      url: design.url,
      notes: design.notes,
      tags: [...design.tags],
      componentType: design.componentType,
      colors: design.colors ? [...design.colors] : [],
      rating: design.rating,
      prompt: design.prompt,
      imageData: design.imageData,
      focalComponents: design.focalComponents ? [...design.focalComponents] : [],
      aiAnalysis: design.aiAnalysis || '',
      palette: design.palette ? [...design.palette] : [],
    });
    showToast('Design duplicated!', 'success');
    navigate('detail', { id: clone.id });
  });

  // Delete
  $('#detail-delete').addEventListener('click', async () => {
    const ok = await showConfirm(`"${design.title}" will be permanently deleted.`, { title: 'Delete Design?', confirmLabel: 'Delete', danger: true });
    if (ok) {
      await deleteDesign(design.id);
      showToast('Design deleted', 'info');
      navigate('library');
    }
  });

  // Auto-save
  $('#prompt-textarea').addEventListener('blur', async (e) => {
    await updateDesign(design.id, { prompt: e.target.value });
  });

  // Color Swatch copy
  container.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      copyToClipboard(sw.dataset.hex);
      showToast(`Color ${sw.dataset.hex} copied!`, 'info');
    });
  });
}
