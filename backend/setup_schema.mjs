import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function setup() {
  try {
    console.log("Creating admin account...");
    const admin = await pb.admins.create({
      email: 'admin@designvault.local',
      password: 'password123',
      passwordConfirm: 'password123',
    });
    
    await pb.admins.authWithPassword('admin@designvault.local', 'password123');
    console.log("Authenticated as admin.");

    // Create project_folders
    try {
      await pb.collections.create({
        name: "project_folders",
        type: "base",
        schema: [
          { name: "name", type: "text", required: true },
          { name: "color", type: "text", required: false }
        ],
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
      });
      console.log("Created project_folders collection.");
    } catch (e) { console.log("project_folders already exists."); }

    // Create designs
    try {
      await pb.collections.create({
        name: "designs",
        type: "base",
        schema: [
          { name: "title", type: "text", required: true },
          { name: "url", type: "url", required: false },
          { name: "image", type: "file", required: false, options: { maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"] } },
          { name: "notes", type: "text", required: false },
          { name: "tags", type: "json", required: false },
          { name: "colors", type: "json", required: false },
          { name: "palette", type: "json", required: false },
          { name: "componentType", type: "text", required: false },
          { name: "rating", type: "number", required: false },
          { name: "knowledgeInjections", type: "json", required: false },
          { name: "specialSauceNote", type: "text", required: false },
          { name: "aestheticFeatures", type: "json", required: false },
          { name: "aestheticVibes", type: "json", required: false }
        ],
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
      });
      console.log("Created designs collection.");
    } catch (e) { console.log("designs already exists.", e.message); }

    // Create projects
    try {
      await pb.collections.create({
        name: "projects",
        type: "base",
        schema: [
          { name: "title", type: "text", required: true },
          { name: "description", type: "text", required: false },
          { name: "brief", type: "text", required: false },
          { name: "folderId", type: "relation", required: false, options: { collectionId: "project_folders", maxSelect: 1 } },
          { name: "designIds", type: "relation", required: false, options: { collectionId: "designs", maxSelect: null } },
          { name: "designStatuses", type: "json", required: false },
          { name: "masterPrompt", type: "text", required: false }
        ],
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
      });
      console.log("Created projects collection.");
    } catch (e) { console.log("projects already exists.", e.message); }

    // Create bookmarks
    try {
      await pb.collections.create({
        name: "bookmarks",
        type: "base",
        schema: [
          { name: "url", type: "url", required: true },
          { name: "title", type: "text", required: false },
          { name: "description", type: "text", required: false },
          { name: "image", type: "text", required: false },
          { name: "logo", type: "text", required: false },
          { name: "publisher", type: "text", required: false },
          { name: "tags", type: "json", required: false }
        ],
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
      });
      console.log("Created bookmarks collection.");
    } catch (e) { console.log("bookmarks already exists.", e.message); }

    console.log("PocketBase Setup Complete!");
  } catch (err) {
    console.error("Setup error:", err.message);
  }
}

setup();
