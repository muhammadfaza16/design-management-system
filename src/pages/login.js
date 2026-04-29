import { pb } from '../db/store.js';

export async function renderLogin(container, navigate) {
  container.innerHTML = `
    <div class="login-page" style="display:flex;align-items:center;justify-content:center;height:100vh;width:100vw;background:var(--bg-base);">
      <div class="login-card" style="background:var(--bg-surface);padding:40px;border-radius:var(--radius-xl);border:1px solid rgba(var(--text-rgb),0.1);width:100%;max-width:400px;box-shadow:0 12px 32px rgba(var(--text-rgb),0.05);">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="width:48px;height:48px;background:var(--text-primary);color:var(--bg-surface);border-radius:12px;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;margin-bottom:16px;">DV</div>
          <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.03em;margin-bottom:8px;">DesignVault</h1>
          <p style="font-size:14px;color:var(--text-secondary);">Sign in to your private vault</p>
        </div>
        
        <form id="login-form">
          <div style="margin-bottom:20px;">
            <label style="display:block;font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;">Email</label>
            <input type="email" id="login-email" class="form-control form-control--lg" placeholder="admin@designvault.local" required autocomplete="email" />
          </div>
          <div style="margin-bottom:24px;">
            <label style="display:block;font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;">Password</label>
            <input type="password" id="login-password" class="form-control form-control--lg" placeholder="••••••••" required autocomplete="current-password" />
          </div>
          <div id="login-error" style="color:var(--red);font-size:13px;font-weight:500;margin-bottom:16px;display:none;text-align:center;"></div>
          <button type="submit" class="btn btn-primary btn--lg" style="width:100%;">Sign In</button>
        </form>
      </div>
    </div>
  `;

  const form = container.querySelector('#login-form');
  const errorEl = container.querySelector('#login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    
    const email = container.querySelector('#login-email').value;
    const password = container.querySelector('#login-password').value;
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    try {
      await pb.admins.authWithPassword(email, password);
      // Reload page entirely to initialize app
      window.location.reload();
    } catch (err) {
      errorEl.textContent = 'Invalid credentials. Please try again.';
      errorEl.style.display = 'block';
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
