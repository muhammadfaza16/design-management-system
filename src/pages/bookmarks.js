// DesignVault — Bookmarks / Inspirations Page
import { getAllBookmarks, addBookmark, deleteBookmark } from '../db/store.js';
import { showToast } from '../components/toast.js';
import { timeAgo, debounce } from '../utils/helpers.js';

export async function renderBookmarks(container, navigate) {
  let searchQuery = '';

  async function load() {
    let bookmarks = await getAllBookmarks();

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      bookmarks = bookmarks.filter(b =>
        (b.title && b.title.toLowerCase().includes(q)) ||
        (b.url && b.url.toLowerCase().includes(q)) ||
        (b.publisher && b.publisher.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q))
      );
    }

    container.innerHTML = `
      <div class="page animate-fade-in">
        <div class="page__header" style="margin-bottom:var(--space-8)">
          <div>
            <h1 class="page__title">Bookmarks</h1>
            <p class="page__subtitle">Curate and save external design references and web inspirations.</p>
          </div>
        </div>

        <div style="margin-bottom: var(--space-10); background: var(--bg-surface); padding: 24px; border-radius: var(--radius-xl); border: 1px solid rgba(var(--text-rgb), 0.08);">
          <label style="font-size:11px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;display:block">Save New Link</label>
          <div class="bookmark-input-wrap">
            <input type="url" id="bookmark-url" class="form-control" placeholder="Paste a URL from X, Dribbble, or any website..." style="flex:1; padding: 14px 20px; font-size: 15px;" />
            <button id="bookmark-save" class="btn btn-primary" style="padding: 0 24px;">Save Link</button>
          </div>
        </div>

        <div class="lib-controls" style="margin-bottom:var(--space-6)">
          <div class="section-title" style="margin-bottom:0">Saved Links <span style="font-weight:400;opacity:0.5">(${bookmarks.length})</span></div>
          <div class="lib-search-wrap">
            <input type="text" id="bookmark-search" class="form-control" placeholder="Search bookmarks..." value="${searchQuery}" style="padding: 6px 12px; font-size: 13px;" />
          </div>
        </div>
        
        <div id="bookmarks-grid">
          ${bookmarks.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state__icon">
                <img src="/src/assets/icons/misc-brief.svg" class="illustrative-icon illustrative-icon--lg" style="opacity:0.1" alt="Empty" />
              </div>
              <div class="empty-state__title">${searchQuery ? 'No bookmarks match your search' : 'No bookmarks yet'}</div>
              <p class="text-muted" style="text-align:center;max-width:400px;margin:16px auto">
                ${searchQuery ? 'Try a different search term.' : 'Paste a link above to automatically fetch and save its preview image, title, and description.'}
              </p>
            </div>
          ` : `
            <div class="design-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
              ${bookmarks.map(b => `
                <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="design-card project-item-card" style="display:block; text-decoration:none;">
                  ${b.image ? `
                    <div class="design-card__thumb" style="aspect-ratio:16/10; padding:0; overflow:hidden;">
                      <img src="${b.image}" alt="${b.title}" style="width:100%; height:100%; object-fit:cover;" />
                    </div>
                  ` : `
                    <div class="design-card__thumb" style="aspect-ratio:16/10; background:var(--bg-input); display:flex; align-items:center; justify-content:center;">
                      <img src="/src/assets/icons/misc-camera.svg" class="illustrative-icon illustrative-icon--md" style="opacity:0.2;" />
                    </div>
                  `}
                  <div class="design-card__body" style="padding: 20px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                      ${b.logo ? `<img src="${b.logo}" style="width:16px; height:16px; border-radius:4px;" />` : ''}
                      <span style="font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.04em;">${b.publisher || new URL(b.url).hostname.replace('www.','')}</span>
                    </div>
                    <div class="design-card__title" style="font-size:15px; margin-bottom:8px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${b.title || b.url}</div>
                    <p class="detail-notes" style="font-size:12px; margin-top:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:unset;">
                      ${b.description || ''}
                    </p>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid rgba(var(--text-rgb),0.06); padding-top:16px;">
                      <span style="font-size:11px; color:rgba(var(--text-rgb),0.3); font-weight:600;">${timeAgo(b.createdAt)}</span>
                      <button class="btn btn-ghost btn-danger bookmark-delete" data-id="${b.id}" style="font-size:11px; padding:4px 8px;">Delete</button>
                    </div>
                  </div>
                </a>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    // Save Link Handler
    const urlInput = container.querySelector('#bookmark-url');
    const saveBtn = container.querySelector('#bookmark-save');

    const handleSave = async () => {
      const url = urlInput.value.trim();
      if (!url) return;

      let validUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        validUrl = 'https://' + url;
      }

      saveBtn.disabled = true;
      saveBtn.innerHTML = 'Saving...';
      urlInput.disabled = true;

      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(validUrl)}`);
        const data = await response.json();

        if (data.status === 'success') {
          await addBookmark({
            url: validUrl,
            title: data.data.title || '',
            description: data.data.description || '',
            image: data.data.image?.url || '',
            logo: data.data.logo?.url || '',
            publisher: data.data.publisher || ''
          });
          showToast('Bookmark saved', 'success');
          load();
        } else {
          throw new Error('Failed to fetch metadata');
        }
      } catch (err) {
        console.error('Microlink error:', err);
        await addBookmark({ url: validUrl });
        showToast('Saved URL without metadata', 'info');
        load();
      }
    };

    saveBtn.addEventListener('click', handleSave);
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSave();
    });

    // Search
    const searchInput = container.querySelector('#bookmark-search');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.trim();
        load();
      }, 300));
      setTimeout(() => {
        const input = container.querySelector('#bookmark-search');
        if (input && searchQuery) {
          input.focus();
          input.selectionStart = input.selectionEnd = input.value.length;
        }
      }, 0);
    }

    // Delete
    container.querySelectorAll('.bookmark-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this bookmark?')) {
          await deleteBookmark(btn.dataset.id);
          showToast('Bookmark deleted', 'info');
          load();
        }
      });
    });
  }

  load();
}
