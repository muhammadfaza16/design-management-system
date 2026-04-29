import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_PB_URL || 'http://127.0.0.1:8090');

// Map PB records to existing DesignVault formats for backwards compatibility
function mapDesign(record) {
  if (!record) return null;
  return {
    ...record,
    // Provide a valid URL for the image if it exists
    imageData: record.image ? pb.files.getUrl(record, record.image) : null,
    createdAt: new Date(record.created).getTime(),
    updatedAt: new Date(record.updated).getTime(),
  };
}

function mapProject(record) {
  if (!record) return null;
  return {
    ...record,
    createdAt: new Date(record.created).getTime(),
    updatedAt: new Date(record.updated).getTime(),
  };
}

function mapFolder(record) {
  if (!record) return null;
  return {
    ...record,
    createdAt: new Date(record.created).getTime(),
  };
}

function mapBookmark(record) {
  if (!record) return null;
  return {
    ...record,
    createdAt: new Date(record.created).getTime(),
  };
}

// ==========================================
// DESIGNS CRUD
// ==========================================
export async function addDesign(data) {
  // If we have base64 imageData, we need to convert it to a File object for PB
  const formData = new FormData();
  formData.append('title', data.title || 'Untitled');
  if (data.url) formData.append('url', data.url);
  if (data.notes) formData.append('notes', data.notes);
  if (data.componentType) formData.append('componentType', data.componentType);
  if (data.rating) formData.append('rating', data.rating);
  
  if (data.tags) formData.append('tags', JSON.stringify(data.tags));
  if (data.colors) formData.append('colors', JSON.stringify(data.colors));
  if (data.palette) formData.append('palette', JSON.stringify(data.palette));
  if (data.knowledgeInjections) formData.append('knowledgeInjections', JSON.stringify(data.knowledgeInjections));
  if (data.aestheticFeatures) formData.append('aestheticFeatures', JSON.stringify(data.aestheticFeatures));
  if (data.aestheticVibes) formData.append('aestheticVibes', JSON.stringify(data.aestheticVibes));
  if (data.specialSauceNote) formData.append('specialSauceNote', data.specialSauceNote);

  if (data.imageData && data.imageData.startsWith('data:image')) {
    const res = await fetch(data.imageData);
    const blob = await res.blob();
    // Guess extension
    const ext = blob.type.split('/')[1] || 'png';
    formData.append('image', blob, `design.${ext}`);
  }

  const record = await pb.collection('designs').create(formData);
  return mapDesign(record);
}

export async function updateDesign(id, updates) {
  const formData = new FormData();
  for (const key of Object.keys(updates)) {
    if (key === 'imageData') continue; // Handled below
    if (key === 'createdAt' || key === 'updatedAt' || key === 'id') continue;
    
    if (typeof updates[key] === 'object' && updates[key] !== null) {
      formData.append(key, JSON.stringify(updates[key]));
    } else {
      formData.append(key, updates[key]);
    }
  }

  if (updates.imageData && updates.imageData.startsWith('data:image')) {
    const res = await fetch(updates.imageData);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'png';
    formData.append('image', blob, `design.${ext}`);
  }

  const record = await pb.collection('designs').update(id, formData);
  return mapDesign(record);
}

export async function deleteDesign(id) {
  await pb.collection('designs').delete(id);
}

export async function getDesign(id) {
  try {
    const record = await pb.collection('designs').getOne(id);
    return mapDesign(record);
  } catch (e) {
    return null;
  }
}

export async function getAllDesigns() {
  try {
    const records = await pb.collection('designs').getFullList({
      sort: '-created',
    });
    return records.map(mapDesign);
  } catch(e) { return []; }
}

export async function getDesignCount() {
  try {
    const list = await pb.collection('designs').getList(1, 1);
    return list.totalItems;
  } catch(e) { return 0; }
}

// ==========================================
// PROJECTS CRUD
// ==========================================
export async function addProject(data) {
  const record = await pb.collection('projects').create({
    title: data.title || 'Untitled Project',
    description: data.description || '',
    brief: data.brief || '',
    folderId: data.folderId || null,
    designIds: data.designIds || [],
    designStatuses: data.designStatuses || {},
    masterPrompt: data.masterPrompt || '',
  });
  return mapProject(record);
}

export async function updateProject(id, updates) {
  const cleanUpdates = { ...updates };
  delete cleanUpdates.id;
  delete cleanUpdates.createdAt;
  delete cleanUpdates.updatedAt;
  
  const record = await pb.collection('projects').update(id, cleanUpdates);
  return mapProject(record);
}

export async function deleteProject(id) {
  await pb.collection('projects').delete(id);
}

export async function getProject(id) {
  try {
    const record = await pb.collection('projects').getOne(id);
    return mapProject(record);
  } catch(e) { return null; }
}

export async function getAllProjects() {
  try {
    const records = await pb.collection('projects').getFullList({ sort: '-created' });
    return records.map(mapProject);
  } catch(e) { return []; }
}

export async function getProjectCount() {
  try {
    const list = await pb.collection('projects').getList(1, 1);
    return list.totalItems;
  } catch(e) { return 0; }
}

// ==========================================
// PROJECT FOLDERS CRUD
// ==========================================
export async function addProjectFolder(data) {
  const record = await pb.collection('project_folders').create({
    name: data.name || 'New Folder',
    color: data.color || '#3b82f6',
  });
  return mapFolder(record);
}

export async function updateProjectFolder(id, updates) {
  const cleanUpdates = { ...updates };
  delete cleanUpdates.id;
  delete cleanUpdates.createdAt;
  const record = await pb.collection('project_folders').update(id, cleanUpdates);
  return mapFolder(record);
}

export async function deleteProjectFolder(id) {
  // Cascading relation clear
  try {
    const projects = await pb.collection('projects').getFullList({ filter: `folderId="${id}"` });
    for (const p of projects) {
      await pb.collection('projects').update(p.id, { folderId: null });
    }
  } catch(e) {}
  await pb.collection('project_folders').delete(id);
}

export async function getAllProjectFolders() {
  try {
    const records = await pb.collection('project_folders').getFullList({ sort: 'created' });
    return records.map(mapFolder);
  } catch(e) { return []; }
}

// ==========================================
// BOOKMARKS CRUD
// ==========================================
export async function addBookmark(data) {
  const record = await pb.collection('bookmarks').create({
    url: data.url,
    title: data.title || '',
    description: data.description || '',
    image: data.image || '',
    logo: data.logo || '',
    publisher: data.publisher || '',
    tags: data.tags || [],
  });
  return mapBookmark(record);
}

export async function updateBookmark(id, updates) {
  const cleanUpdates = { ...updates };
  delete cleanUpdates.id;
  delete cleanUpdates.createdAt;
  const record = await pb.collection('bookmarks').update(id, cleanUpdates);
  return mapBookmark(record);
}

export async function deleteBookmark(id) {
  await pb.collection('bookmarks').delete(id);
}

export async function getAllBookmarks() {
  try {
    const records = await pb.collection('bookmarks').getFullList({ sort: '-created' });
    return records.map(mapBookmark);
  } catch(e) { return []; }
}

// ==========================================
// DUMMY IMPLEMENTATIONS (for missing tables)
// ==========================================
export async function getStats() {
  const [designs, projects, bookmarks] = await Promise.all([
    getAllDesigns(),
    getAllProjects(),
    getAllBookmarks(),
  ]);

  // Compute top tags
  const tagMap = {};
  for (const d of designs) {
    if (d.tags && Array.isArray(d.tags)) {
      for (const t of d.tags) {
        tagMap[t] = (tagMap[t] || 0) + 1;
      }
    }
  }
  const topTags = Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    totalDesigns: designs.length,
    totalProjects: projects.length,
    totalBookmarks: bookmarks.length,
    totalTags: Object.keys(tagMap).length,
    totalPrompts: 0,
    recentDesigns: designs.slice(0, 5),
    recentProjects: projects.slice(0, 5),
    topTags,
  };
}

export async function getAllSnippets() { return []; }
export async function getAllStyles() { return []; }
export async function getAllPrompts() { return []; }
export async function addPrompt(data) { return null; }
export async function updatePrompt(id, updates) { return null; }
export async function deletePrompt(id) {}
export async function incrementPromptUse(id) {}

export async function addSnippet(data) { return null; }
export async function updateSnippet(id, updates) { return null; }
export async function deleteSnippet(id) {}

export async function incrementSnippetUse(id) {}

export async function getAllStylePresets() { return []; }
export async function addStylePreset(data) { return null; }
export async function updateStylePreset(id, updates) { return null; }
export async function deleteStylePreset(id) {}

export async function searchAll(query) {
  const q = query.toLowerCase();
  const designs = await getAllDesigns();
  const projects = await getAllProjects();
  
  return [
    ...designs.filter(d => d.title.toLowerCase().includes(q)).map(d => ({ ...d, type: 'design' })),
    ...projects.filter(p => p.title.toLowerCase().includes(q)).map(p => ({ ...p, type: 'project' }))
  ];
}
export async function searchDesigns(query, filters = {}) {
  const designs = await getAllDesigns();
  let result = designs;

  if (query) {
    const q = query.toLowerCase();
    result = result.filter(d => 
      (d.title && d.title.toLowerCase().includes(q)) || 
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) ||
      (d.notes && d.notes.toLowerCase().includes(q))
    );
  }

  if (filters.componentType && filters.componentType !== 'all') {
    result = result.filter(d => d.componentType === filters.componentType);
  }

  if (filters.aestheticFeature && filters.aestheticFeature !== 'all') {
    result = result.filter(d => d.aestheticFeatures && d.aestheticFeatures.includes(filters.aestheticFeature));
  }

  if (filters.aestheticVibe && filters.aestheticVibe !== 'all') {
    result = result.filter(d => d.aestheticVibes && d.aestheticVibes.includes(filters.aestheticVibe));
  }

  return result;
}
