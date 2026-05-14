// DesignVault — Undo Toast Utility
// Shows a toast with an "Undo" button. If the user doesn't click Undo within
// the grace period, the onCommit callback fires (actually deletes the item).
// If they click Undo, the onUndo callback fires (restores state).

const UNDO_DURATION_MS = 5000;

/**
 * @param {string} message - Toast message
 * @param {object} opts
 * @param {Function} opts.onCommit - called after grace period if user doesn't undo
 * @param {Function} opts.onUndo - called if user clicks Undo
 */
export function showUndoToast(message, { onCommit, onUndo }) {
  const container = document.getElementById('toast-root');

  // Ensure container exists and is styled
  if (!container.querySelector('.toast-container')) {
    const tc = document.createElement('div');
    tc.className = 'toast-container';
    container.appendChild(tc);
  }
  const toastContainer = container.querySelector('.toast-container');

  const toast = document.createElement('div');
  toast.className = 'toast toast--undo';
  toast.innerHTML = `
    <span style="flex:1">${message}</span>
    <button class="undo-btn" style="
      background: rgba(var(--text-rgb), 0.08);
      border: 1px solid rgba(var(--text-rgb), 0.12);
      border-radius: 6px;
      padding: 4px 12px;
      font-size: 12px;
      font-weight: 700;
      color: var(--accent);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    ">Undo</button>
    <div class="undo-progress" style="
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: var(--accent);
      border-radius: 0 0 12px 12px;
      width: 100%;
      animation: undoShrink ${UNDO_DURATION_MS}ms linear forwards;
    "></div>
  `;
  toast.style.position = 'relative';
  toast.style.overflow = 'hidden';

  toastContainer.appendChild(toast);

  let committed = false;
  let undone = false;

  const timer = setTimeout(() => {
    if (!undone) {
      committed = true;
      if (onCommit) onCommit();
      removeToast();
    }
  }, UNDO_DURATION_MS);

  const undoBtn = toast.querySelector('.undo-btn');
  undoBtn.addEventListener('click', () => {
    if (committed) return;
    undone = true;
    clearTimeout(timer);
    if (onUndo) onUndo();
    removeToast();
  });

  // Hover pauses the timer visually (optional enhancement)
  undoBtn.addEventListener('mouseenter', () => {
    undoBtn.style.background = 'rgba(var(--text-rgb), 0.12)';
  });
  undoBtn.addEventListener('mouseleave', () => {
    undoBtn.style.background = 'rgba(var(--text-rgb), 0.08)';
  });

  function removeToast() {
    toast.style.animation = 'fadeOut 200ms ease forwards';
    setTimeout(() => toast.remove(), 200);
  }
}
