// DesignVault — Lightbox Component

export function openLightbox(imageSrc) {
  const root = document.getElementById('lightbox-root');
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox__close btn-icon" id="lightbox-close">
      <img src="/assets/icons/status-error.svg" class="illustrative-icon" alt="Close" />
    </button>
    <img src="${imageSrc}" alt="Preview" />
  `;
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.id === 'lightbox-close') {
      lb.style.animation = 'fadeOut 200ms ease forwards';
      setTimeout(() => lb.remove(), 200);
    }
  });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      lb.remove();
      document.removeEventListener('keydown', handler);
    }
  });
  root.appendChild(lb);
}
