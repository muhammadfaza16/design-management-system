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

// ==========================================
// IMPORT / RESTORE BACKUP
// ==========================================

/**
 * Clears ALL data from every object store.
 */
export async function clearAllData() {
  const db = await getDB();
  const storeNames = ['designs', 'projects', 'bookmarks', 'prompts', 'snippets', 'styles', 'project_folders'];
  const tx = db.transaction(storeNames, 'readwrite');
  for (const name of storeNames) {
    await tx.objectStore(name).clear();
  }
  await tx.done;
}

/**
 * Preview what a backup file contains without importing.
 * @param {object} backup - parsed JSON backup
 * @returns {{ valid: boolean, counts: object, version: number, exportedAt: string, error?: string }}
 */
export function previewBackup(backup) {
  if (!backup || typeof backup !== 'object') {
    return { valid: false, error: 'File is not valid JSON.' };
  }
  if (!backup.data || typeof backup.data !== 'object') {
    return { valid: false, error: 'Invalid backup format — missing "data" field.' };
  }

  const storeKeys = ['designs', 'projects', 'bookmarks', 'prompts', 'snippets', 'stylePresets'];
  const counts = {};
  for (const key of storeKeys) {
    const items = backup.data[key];
    counts[key] = Array.isArray(items) ? items.length : 0;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return { valid: false, error: 'Backup file contains no data.' };
  }

  return {
    valid: true,
    counts,
    version: backup.version || 1,
    exportedAt: backup.exportedAt || 'Unknown',
  };
}

/**
 * Import backup data into IndexedDB.
 * @param {object} backup - parsed JSON backup object
 * @param {'merge'|'replace'} mode
 *   - 'merge': add new items, skip existing by ID
 *   - 'replace': clear all existing data first, then import everything
 * @returns {Promise<{ imported: object, skipped: number }>}
 */
export async function importBackup(backup, mode = 'merge') {
  const db = await getDB();

  if (mode === 'replace') {
    await clearAllData();
  }

  // Map backup keys → IndexedDB store names
  const storeMap = [
    { key: 'designs',      store: 'designs' },
    { key: 'projects',     store: 'projects' },
    { key: 'bookmarks',    store: 'bookmarks' },
    { key: 'prompts',      store: 'prompts' },
    { key: 'snippets',     store: 'snippets' },
    { key: 'stylePresets', store: 'styles' },
  ];

  const imported = {};
  let skipped = 0;

  for (const { key, store } of storeMap) {
    const items = backup.data[key];
    if (!Array.isArray(items) || items.length === 0) {
      imported[key] = 0;
      continue;
    }

    let count = 0;
    const tx = db.transaction(store, 'readwrite');
    for (const item of items) {
      if (!item || !item.id) { skipped++; continue; }

      if (mode === 'merge') {
        const existing = await tx.store.get(item.id);
        if (existing) { skipped++; continue; }
      }

      await tx.store.put(item);
      count++;
    }
    await tx.done;
    imported[key] = count;
  }

  return { imported, skipped };
}

export async function seedDummyData(force = false) {
  const db = await getDB();
  const tx = db.transaction('designs', 'readonly');
  const count = await tx.store.count();
  if (count > 0 && !force) return; // Only seed if completely empty or forced

  const now = Date.now();
  
  // 1. Library (Design Reference)
  await addDesign({
    title: 'Acme Corp — SaaS Dashboard Analytics',
    url: 'https://dribbble.com/shots/12345-Acme-SaaS-Dashboard',
    notes: 'Incredible use of negative space and typography hierarchy. Notice how the primary metrics use Inter 600 at 36px with a tight letter-spacing (-0.03em), while the secondary labels use uppercase tracking. The subtle radial gradient in the background behind the main chart prevents the container from feeling flat without distracting from the data.\n\nImplementation ideas:\n- Use chart.js for the spline curves\n- The glassmorphism on the side panel is backdrop-filter: blur(12px) with rgba(255,255,255,0.05)',
    tags: ['dashboard', 'saas', 'dark-mode', 'dataviz', 'glassmorphism'],
    componentType: 'Dashboard',
    colors: ['#0A0A0A', '#FFFFFF', '#3B82F6', '#10B981', '#1F2937'],
    rating: 5,
    prompt: 'A highly detailed dark mode SaaS analytics dashboard, clean modern UI, glowing blue metrics, glassmorphism sidebar, highly legible typography, Dribbble aesthetic --ar 16:9',
  });

  // 2. Project
  await addProject({
    title: 'FinTech Mobile App Redesign',
    description: 'Comprehensive redesign of the core banking experience focusing on Gen-Z user acquisition. Key deliverables include the home tab, P2P transfer flow, and budgeting insights. The aesthetic should be punchy, vibrant, and trustworthy without feeling "legacy corporate".\n\nGoals:\n1. Reduce transfer time by 40%\n2. Increase feature discovery for savings pots\n3. Modernize the design language',
    status: 'in-progress',
    tags: ['mobile', 'fintech', 'redesign'],
  });

  // 3. Bookmark
  await db.put('bookmarks', {
    id: genId(),
    title: 'Stripe Press — Beautiful Web Typography',
    url: 'https://press.stripe.com/',
    notes: 'The gold standard for modern editorial web design. The way they handle image carousels with smooth physical inertia and the custom serif typeface is mind-blowing. Perfect reference for our upcoming editorial project.',
    tags: ['inspiration', 'typography', 'editorial'],
    createdAt: now,
  });

  // 4. Prompt
  await db.put('prompts', {
    id: genId(),
    title: 'Ultra-Minimalist Product Landing Page',
    content: 'UI/UX design of a minimalist product landing page for a smart home device, Apple aesthetic, vast white space, massive bold typography, stark contrast, lifestyle photography integrated into the layout, soft natural lighting, high resolution, web design, Dribbble, Behance --ar 16:9 --v 6.0',
    tags: ['midjourney', 'landing-page', 'minimalist', 'apple-style'],
    useCount: 12,
    createdAt: now,
    updatedAt: now,
  });

  // 5. Snippet
  await db.put('snippets', {
    id: genId(),
    title: 'Smooth Reveal Animation (Framer Motion)',
    language: 'javascript',
    code: `import { motion } from "framer-motion";

export const Reveal = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] // Custom snappy ease-out
      }}
    >
      {children}
    </motion.div>
  );
};`,
    description: 'A reusable wrapper component for scrolling reveals. Uses a custom cubic-bezier for a snappy physical feel and a slight blur filter during entrance to make it look premium.',
    tags: ['react', 'framer-motion', 'animation'],
    createdAt: now,
    updatedAt: now,
  });

  // 6. Style Preset
  await db.put('styles', {
    id: genId(),
    name: 'Cyberpunk Neon Dark',
    description: 'High contrast dark theme with vibrant neon accents. Perfect for crypto or gaming interfaces. Use the magenta for primary actions and cyan for secondary.',
    colors: [
      { hex: '#050511', name: 'Deep Space Void' },
      { hex: '#120F24', name: 'Surface Elevated' },
      { hex: '#00F0FF', name: 'Neon Cyan (Accent)' },
      { hex: '#FF003C', name: 'Electric Magenta' },
      { hex: '#FCEE0A', name: 'Cyber Yellow' },
      { hex: '#E2E8F0', name: 'Text Primary' }
    ],
    typography: 'Primary: "Space Grotesk", sans-serif\nSecondary: "JetBrains Mono", monospace',
    createdAt: now,
    updatedAt: now,
  });
}
