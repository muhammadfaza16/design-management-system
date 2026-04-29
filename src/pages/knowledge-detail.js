import { KNOWLEDGE_BANK } from '../utils/knowledge-base.js';
import { copyToClipboard } from '../utils/export.js';
import { showToast } from '../components/toast.js';

export async function renderKnowledgeDetail(container, navigate, params) {
  const item = KNOWLEDGE_BANK.find(k => k.id === params.id);
  
  if (!item) {
    container.innerHTML = `
      <div class="page" style="display:flex;align-items:center;justify-content:center;height:100vh;">
        <div class="empty-state">
          <div class="empty-state__title">Directive not found</div>
          <button class="btn btn-primary" id="kb-back-error" style="margin-top:16px;">Back to Knowledge Bank</button>
        </div>
      </div>
    `;
    container.querySelector('#kb-back-error')?.addEventListener('click', () => navigate('knowledge'));
    return;
  }

  // To make it look like a short article, we can split the description into paragraphs if possible, 
  // or present it with large, highly legible typography.
  // We'll also highlight the AI constraint strongly.
  
  const articleContent = `
    <div class="page animate-fade-in" style="max-width: 800px; margin: 0 auto; padding-bottom: 120px;">
      
      <!-- Back Navigation -->
      <div style="margin-bottom: 40px; margin-top: 16px;">
        <button class="btn btn-ghost" id="kb-back" style="padding-left:0; color: rgba(var(--text-rgb), 0.6);">
          <span style="margin-right:8px;">←</span> Back to Knowledge Bank
        </button>
      </div>

      <!-- Hero Header -->
      <header style="margin-bottom: 48px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom: 16px;">
          <span class="badge" style="font-size:12px; padding: 6px 12px; background: rgba(var(--accent-rgb), 0.1); color: var(--accent); border: 1px solid rgba(var(--accent-rgb), 0.2); border-radius: 100px;">
            ${item.category}
          </span>
          <span style="font-size:12px; color:rgba(var(--text-rgb), 0.4); font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
            Official Directive
          </span>
        </div>
        <h1 style="font-size: clamp(32px, 5vw, 48px); font-weight: 800; color: var(--text-primary); line-height: 1.1; margin: 0 0 24px; letter-spacing: -0.02em;">
          ${item.title}
        </h1>
      </header>

      <!-- Article Body -->
      <article style="font-size: 18px; line-height: 1.7; color: rgba(var(--text-rgb), 0.85);">
        
        <div style="background: var(--bg-surface); border: 1px solid rgba(var(--text-rgb), 0.08); border-radius: var(--radius-lg); padding: 32px; margin-bottom: 48px; border-left: 4px solid var(--accent); box-shadow: 0 12px 32px rgba(0,0,0,0.02);">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin: 0 0 16px; font-weight: 700;">Design Rationale</h3>
          <p style="margin: 0; font-size: 18px; font-weight: 500; color: var(--text-primary); line-height: 1.6;">
            ${item.description}
          </p>
        </div>

        <h2 style="font-size: 24px; font-weight: 700; margin: 48px 0 24px; color: var(--text-primary);">Implementation Constraint</h2>
        <p style="margin-bottom: 32px;">
          To enforce this principle in automated workflows or when pairing with AI, use the following strict directive. This prompt is engineered to remove ambiguity and enforce exact constraints.
        </p>

        <!-- AI Directive Console -->
        <div style="background: #0f111a; border-radius: 12px; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1);">
          
          <!-- Console Header -->
          <div style="background: rgba(255,255,255,0.05); padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; gap: 8px;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #ff5f56;"></div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffbd2e;"></div>
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #27c93f;"></div>
            </div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em;">
              Prompt Directive
            </div>
          </div>

          <!-- Console Body -->
          <div style="padding: 32px; position: relative;">
            <p style="font-family: var(--font-mono); font-size: 14px; color: #a1a1aa; line-height: 1.6; margin: 0;">
              <span style="color: #60a5fa;">></span> <span style="color: #e4e4e7;">${item.aiPrompt}</span>
            </p>
          </div>

          <!-- Console Footer -->
          <div style="background: rgba(0,0,0,0.2); padding: 16px 20px; display: flex; justify-content: flex-end; border-top: 1px solid rgba(255,255,255,0.05);">
            <button class="btn btn-primary" id="kb-copy-full" style="font-size: 13px; padding: 8px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; box-shadow: none;">
              Copy Full Directive
            </button>
          </div>

        </div>

      </article>

    </div>
  `;

  container.innerHTML = articleContent;

  // Listeners
  container.querySelector('#kb-back')?.addEventListener('click', () => {
    navigate('knowledge');
  });

  container.querySelector('#kb-copy-full')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    await copyToClipboard(item.aiPrompt);
    showToast('Directive copied to clipboard!', 'success');
    
    // Visual feedback
    const origText = btn.innerText;
    btn.innerText = 'Copied!';
    btn.style.background = 'var(--accent)';
    btn.style.borderColor = 'var(--accent)';
    
    setTimeout(() => {
      btn.innerText = origText;
      btn.style.background = 'rgba(255,255,255,0.1)';
      btn.style.borderColor = 'rgba(255,255,255,0.2)';
    }, 2000);
  });
}
