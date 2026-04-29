// DesignVault — IndexedDB Store (v4)
import { openDB } from 'idb';

const DB_NAME = 'designvault';
const DB_VERSION = 4;

let dbPromise;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v1 stores
        if (!db.objectStoreNames.contains('designs')) {
          const ds = db.createObjectStore('designs', { keyPath: 'id' });
          ds.createIndex('createdAt', 'createdAt');
          ds.createIndex('rating', 'rating');
        }
        if (!db.objectStoreNames.contains('projects')) {
          const ps = db.createObjectStore('projects', { keyPath: 'id' });
          ps.createIndex('createdAt', 'createdAt');
        }

        // v2 stores
        if (!db.objectStoreNames.contains('prompts')) {
          const pr = db.createObjectStore('prompts', { keyPath: 'id' });
          pr.createIndex('createdAt', 'createdAt');
          pr.createIndex('useCount', 'useCount');
        }
        if (!db.objectStoreNames.contains('styles')) {
          const st = db.createObjectStore('styles', { keyPath: 'id' });
          st.createIndex('createdAt', 'createdAt');
        }
        if (!db.objectStoreNames.contains('snippets')) {
          const sn = db.createObjectStore('snippets', { keyPath: 'id' });
          sn.createIndex('createdAt', 'createdAt');
          sn.createIndex('language', 'language');
        }

        // v3 stores
        if (!db.objectStoreNames.contains('project_folders')) {
          const pf = db.createObjectStore('project_folders', { keyPath: 'id' });
          pf.createIndex('createdAt', 'createdAt');
        }

        // v4 stores
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bm = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bm.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

// ---- Helpers ----
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ==========================================
// DESIGNS CRUD
// ==========================================
export async function addDesign(data) {
  const db = await getDB();
  const design = {
    id: genId(),
    title: data.title || 'Untitled',
    url: data.url || '',
    notes: data.notes || '',
    tags: data.tags || [],
    componentType: data.componentType || '',
    colors: data.colors || [],
    rating: data.rating || 0,
    prompt: data.prompt || '',
    promptVersions: [],
    imageData: data.imageData || null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put('designs', design);
  return design;
}

export async function updateDesign(id, updates) {
  const db = await getDB();
  const design = await db.get('designs', id);
  if (!design) return null;
  const updated = { ...design, ...updates, updatedAt: Date.now() };
  await db.put('designs', updated);
  return updated;
}

export async function deleteDesign(id) {
  const db = await getDB();
  await db.delete('designs', id);
}

export async function getDesign(id) {
  const db = await getDB();
  return db.get('designs', id);
}

export async function getAllDesigns() {
  const db = await getDB();
  const all = await db.getAll('designs');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDesignCount() {
  const db = await getDB();
  return (await db.getAll('designs')).length;
}

// ==========================================
// PROJECTS CRUD
// ==========================================
export async function addProject(data) {
  const db = await getDB();
  const project = {
    id: genId(),
    title: data.title || 'Untitled Project',
    description: data.description || '',
    brief: data.brief || '',
    status: data.status || 'research',
    folderId: data.folderId || null,
    designIds: data.designIds || [],
    designStatuses: data.designStatuses || {},
    masterPrompt: data.masterPrompt || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put('projects', project);
  return project;
}

export async function updateProject(id, updates) {
  const db = await getDB();
  const proj = await db.get('projects', id);
  if (!proj) return null;
  const updated = { ...proj, ...updates, updatedAt: Date.now() };
  await db.put('projects', updated);
  return updated;
}

export async function deleteProject(id) {
  const db = await getDB();
  await db.delete('projects', id);
}

export async function getProject(id) {
  const db = await getDB();
  return db.get('projects', id);
}

export async function getAllProjects() {
  const db = await getDB();
  const all = await db.getAll('projects');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getProjectCount() {
  const db = await getDB();
  return (await db.getAll('projects')).length;
}

// ==========================================
// PROJECT FOLDERS CRUD
// ==========================================
export async function addProjectFolder(data) {
  const db = await getDB();
  const folder = {
    id: genId(),
    name: data.name || 'New Folder',
    color: data.color || 'var(--bg-card)',
    createdAt: Date.now(),
  };
  await db.put('project_folders', folder);
  return folder;
}

export async function updateProjectFolder(id, updates) {
  const db = await getDB();
  const f = await db.get('project_folders', id);
  if (!f) return null;
  const updated = { ...f, ...updates };
  await db.put('project_folders', updated);
  return updated;
}

export async function deleteProjectFolder(id) {
  const db = await getDB();
  // We should ideally remove this folderId from all projects that have it
  const tx = db.transaction(['project_folders', 'projects'], 'readwrite');
  await tx.objectStore('project_folders').delete(id);
  const projectsStore = tx.objectStore('projects');
  const allProjects = await projectsStore.getAll();
  for (const p of allProjects) {
    if (p.folderId === id) {
      p.folderId = null;
      p.updatedAt = Date.now();
      await projectsStore.put(p);
    }
  }
  await tx.done;
}

export async function getAllProjectFolders() {
  const db = await getDB();
  const all = await db.getAll('project_folders');
  return all.sort((a, b) => a.createdAt - b.createdAt); // oldest first looks better for folders
}

// ==========================================
// PROMPTS CRUD (Prompt Vault)
// ==========================================
export async function addPrompt(data) {
  const db = await getDB();
  const prompt = {
    id: genId(),
    title: data.title || 'Untitled Prompt',
    content: data.content || '',
    category: data.category || 'general',
    framework: data.framework || '',
    tags: data.tags || [],
    rating: data.rating || 0,
    useCount: data.useCount || 0,
    isFavorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put('prompts', prompt);
  return prompt;
}

export async function updatePrompt(id, updates) {
  const db = await getDB();
  const p = await db.get('prompts', id);
  if (!p) return null;
  const updated = { ...p, ...updates, updatedAt: Date.now() };
  await db.put('prompts', updated);
  return updated;
}

export async function deletePrompt(id) {
  const db = await getDB();
  await db.delete('prompts', id);
}

export async function getPrompt(id) {
  const db = await getDB();
  return db.get('prompts', id);
}

export async function getAllPrompts() {
  const db = await getDB();
  const all = await db.getAll('prompts');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function incrementPromptUse(id) {
  const db = await getDB();
  const p = await db.get('prompts', id);
  if (!p) return null;
  p.useCount = (p.useCount || 0) + 1;
  p.updatedAt = Date.now();
  await db.put('prompts', p);
  return p;
}

// ==========================================
// STYLE PRESETS CRUD
// ==========================================
export async function addStylePreset(data) {
  const db = await getDB();
  const style = {
    id: genId(),
    name: data.name || 'Untitled Style',
    description: data.description || '',
    tokens: {
      colors: data.tokens?.colors || [],
      fonts: data.tokens?.fonts || [],
      radius: data.tokens?.radius || '',
      spacing: data.tokens?.spacing || '',
    },
    tags: data.tags || [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put('styles', style);
  return style;
}

export async function updateStylePreset(id, updates) {
  const db = await getDB();
  const s = await db.get('styles', id);
  if (!s) return null;
  const updated = { ...s, ...updates, updatedAt: Date.now() };
  await db.put('styles', updated);
  return updated;
}

export async function deleteStylePreset(id) {
  const db = await getDB();
  await db.delete('styles', id);
}

export async function getAllStylePresets() {
  const db = await getDB();
  const all = await db.getAll('styles');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

// ==========================================
// SNIPPETS CRUD
// ==========================================
export async function addSnippet(data) {
  const db = await getDB();
  const snippet = {
    id: genId(),
    title: data.title || 'Untitled Snippet',
    code: data.code || '',
    language: data.language || 'javascript',
    framework: data.framework || '',
    tags: data.tags || [],
    description: data.description || '',
    useCount: data.useCount || 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put('snippets', snippet);
  return snippet;
}

export async function updateSnippet(id, updates) {
  const db = await getDB();
  const s = await db.get('snippets', id);
  if (!s) return null;
  const updated = { ...s, ...updates, updatedAt: Date.now() };
  await db.put('snippets', updated);
  return updated;
}

export async function deleteSnippet(id) {
  const db = await getDB();
  await db.delete('snippets', id);
}

export async function getAllSnippets() {
  const db = await getDB();
  const all = await db.getAll('snippets');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

// ==========================================
// BOOKMARKS CRUD
// ==========================================
export async function addBookmark(data) {
  const db = await getDB();
  const bookmark = {
    id: genId(),
    url: data.url,
    title: data.title || '',
    description: data.description || '',
    image: data.image || '',
    logo: data.logo || '',
    publisher: data.publisher || '',
    createdAt: Date.now(),
  };
  await db.put('bookmarks', bookmark);
  return bookmark;
}

export async function deleteBookmark(id) {
  const db = await getDB();
  await db.delete('bookmarks', id);
}

export async function updateBookmark(id, updates) {
  const db = await getDB();
  const b = await db.get('bookmarks', id);
  if (!b) return null;
  const updated = { ...b, ...updates, updatedAt: Date.now() };
  await db.put('bookmarks', updated);
  return updated;
}

export async function getAllBookmarks() {
  const db = await getDB();
  const all = await db.getAll('bookmarks');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function incrementSnippetUse(id) {
  const db = await getDB();
  const s = await db.get('snippets', id);
  if (!s) return null;
  s.useCount = (s.useCount || 0) + 1;
  s.updatedAt = Date.now();
  await db.put('snippets', s);
  return s;
}

// ==========================================
// SEARCH & FILTER
// ==========================================
export async function searchDesigns(query = '', filters = {}) {
  const all = await getAllDesigns();
  return all.filter(d => {
    const q = query.toLowerCase();
    const tagMatch = d.tags && d.tags.some(t => t.toLowerCase().includes(q));
    const typeMatch = d.componentType && d.componentType.toLowerCase().includes(q);
    const matchesQuery = !q || d.title.toLowerCase().includes(q) || (d.notes && d.notes.toLowerCase().includes(q)) || (d.url && d.url.toLowerCase().includes(q)) || tagMatch || typeMatch;
    const matchesTag = !filters.tag || (d.tags && d.tags.includes(filters.tag));
    const matchesComponent = !filters.componentType || d.componentType === filters.componentType;
    const matchesRating = !filters.minRating || d.rating >= filters.minRating;
    const matchesFeature = !filters.aestheticFeature || (d.aestheticFeatures && d.aestheticFeatures.includes(filters.aestheticFeature));
    const matchesVibe = !filters.aestheticVibe || (d.aestheticVibes && d.aestheticVibes.includes(filters.aestheticVibe));
    
    return matchesQuery && matchesTag && matchesComponent && matchesRating && matchesFeature && matchesVibe;
  });
}

export async function searchAll(query = '') {
  if (!query) return { designs: [], prompts: [], snippets: [], projects: [] };
  const q = query.toLowerCase();
  const [designs, prompts, snippets, projects] = await Promise.all([
    getAllDesigns(), getAllPrompts(), getAllSnippets(), getAllProjects()
  ]);
  return {
    designs: designs.filter(d => d.title.toLowerCase().includes(q) || (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) || (d.componentType && d.componentType.toLowerCase().includes(q))).slice(0, 5),
    prompts: prompts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)).slice(0, 5),
    snippets: snippets.filter(s => s.title.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)).slice(0, 5),
    projects: projects.filter(p => p.title.toLowerCase().includes(q)).slice(0, 5),
  };
}

// ==========================================
// STATS
// ==========================================
export async function getStats() {
  const [designs, projects, prompts, snippets, bookmarks] = await Promise.all([
    getAllDesigns(), getAllProjects(), getAllPrompts(), getAllSnippets(), getAllBookmarks()
  ]);
  const allTags = designs.flatMap(d => d.tags);
  const uniqueTags = [...new Set(allTags)];
  return {
    totalDesigns: designs.length,
    totalProjects: projects.length,
    totalPrompts: prompts.length,
    totalSnippets: snippets.length,
    totalBookmarks: bookmarks.length,
    totalTags: uniqueTags.length,
    topTags: uniqueTags.map(t => ({ tag: t, count: allTags.filter(x => x === t).length }))
      .sort((a, b) => b.count - a.count).slice(0, 10),
    topPrompts: prompts.sort((a, b) => b.useCount - a.useCount).slice(0, 5),
    recentDesigns: designs.slice(0, 5),
    recentProjects: projects.slice(0, 5),
  };
}
