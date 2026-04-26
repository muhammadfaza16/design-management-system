// DesignVault — Toast Component
const toastRoot = document.getElementById('toast-root');

export function showToast(message, type = 'info', duration = 3000) {
  if (!toastRoot.querySelector('.toast-container')) {
    const c = document.createElement('div');
    c.className = 'toast-container';
    toastRoot.appendChild(c);
  }
  const container = toastRoot.querySelector('.toast-container');

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}
