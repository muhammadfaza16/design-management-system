/**
 * PocketBase Schema Setup Script
 * Run this ONCE after a fresh PocketBase install to create all collections.
 * Usage: node backend/setup.mjs
 */
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Helper: json field shortcut
const jsonField = (name) => ({
  name,
  type: 'json',
  required: false,
  options: { maxSize: 2000000 },
});

const textField = (name, required = false) => ({
  name,
  type: 'text',
  required,
  options: { min: null, max: null, pattern: '' },
});

async function setup() {
  // Step 1: Create admin (will fail silently if already exists)
  try {
    // PB v0.22 — first run needs admin creation via CLI or this
    // We assume the admin was already created via CLI
  } catch (e) {}

  // Step 2: Auth as admin
  await pb.admins.authWithPassword('admin@designvault.local', 'password123');
  console.log('✓ Authenticated as admin');

  // Step 3: Create collections in dependency order

  // --- project_folders (no dependencies) ---
  let foldersCol;
  try {
    foldersCol = await pb.collections.create({
      name: 'project_folders',
      type: 'base',
      schema: [
        textField('name', true),
        textField('color'),
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    });
    console.log('✓ Created project_folders');
  } catch (e) {
    console.log('⚠ project_folders:', e.response?.data || e.message);
    // Try to get existing
    const all = await pb.collections.getFullList();
    foldersCol = all.find(c => c.name === 'project_folders');
  }

  // --- designs (no dependencies) ---
  let designsCol;
  try {
    designsCol = await pb.collections.create({
      name: 'designs',
      type: 'base',
      schema: [
        textField('title', true),
        { name: 'url', type: 'url', required: false, options: { exceptDomains: null, onlyDomains: null } },
        { name: 'image', type: 'file', required: false, options: { maxSelect: 1, maxSize: 10485760, mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'], thumbs: [], protected: false } },
        textField('notes'),
        jsonField('tags'),
        jsonField('colors'),
        jsonField('palette'),
        textField('componentType'),
        { name: 'rating', type: 'number', required: false, options: { min: null, max: null, noDecimal: false } },
        jsonField('knowledgeInjections'),
        textField('specialSauceNote'),
        jsonField('aestheticFeatures'),
        jsonField('aestheticVibes'),
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    });
    console.log('✓ Created designs');
  } catch (e) {
    console.log('⚠ designs:', e.response?.data || e.message);
    const all = await pb.collections.getFullList();
    designsCol = all.find(c => c.name === 'designs');
  }

  // --- projects (depends on project_folders + designs) ---
  try {
    await pb.collections.create({
      name: 'projects',
      type: 'base',
      schema: [
        textField('title', true),
        textField('description'),
        textField('brief'),
        {
          name: 'folderId',
          type: 'relation',
          required: false,
          options: {
            collectionId: foldersCol?.id,
            cascadeDelete: false,
            minSelect: null,
            maxSelect: 1,
            displayFields: null,
          },
        },
        {
          name: 'designIds',
          type: 'relation',
          required: false,
          options: {
            collectionId: designsCol?.id,
            cascadeDelete: false,
            minSelect: null,
            maxSelect: null,
            displayFields: null,
          },
        },
        jsonField('designStatuses'),
        textField('masterPrompt'),
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    });
    console.log('✓ Created projects');
  } catch (e) {
    console.log('⚠ projects:', e.response?.data || e.message);
  }

  // --- bookmarks (no dependencies) ---
  try {
    await pb.collections.create({
      name: 'bookmarks',
      type: 'base',
      schema: [
        { name: 'url', type: 'url', required: true, options: { exceptDomains: null, onlyDomains: null } },
        textField('title'),
        textField('description'),
        textField('image'),
        textField('logo'),
        textField('publisher'),
        jsonField('tags'),
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    });
    console.log('✓ Created bookmarks');
  } catch (e) {
    console.log('⚠ bookmarks:', e.response?.data || e.message);
  }

  console.log('\n🎉 PocketBase schema setup complete!');
  console.log('   Collections: project_folders, designs, projects, bookmarks');
  console.log('   All rules set to public (empty string = anyone can access)');
}

setup().catch(err => {
  console.error('Fatal setup error:', err.message);
  process.exit(1);
});
