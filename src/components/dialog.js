// DesignVault — Custom Dialog Utilities
// Replaces native browser prompt() and confirm() with styled in-app modals.

/**
 * Shows a custom confirm dialog.
 * @param {string} message - The confirmation message to display.
 * @param {object} [options]
 * @param {string} [options.title='Are you sure?'] - Dialog title.
 * @param {string} [options.confirmLabel='Confirm'] - Text for the confirm button.
 * @param {string} [options.cancelLabel='Cancel'] - Text for the cancel button.
 * @param {boolean} [options.danger=false] - If true, styles the confirm button as destructive.
 * @returns {Promise<boolean>} Resolves true if confirmed, false if cancelled.
 */
export function showConfirm(message, { title = 'Are you sure?', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false } = {}) {
  return new Promise((resolve) => {
    const root = document.getElementById('modal-root');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" style="max-width:420px">
        <div class="modal__header">
          <h2 class="modal__title" style="font-size:16px">${title}</h2>
        </div>
        <div class="modal__body">
          <p style="font-size:14px;color:var(--text-secondary);line-height:1.6;margin:0">${message}</p>
        </div>
        <div class="modal__footer">
          <button class="btn btn-secondary" id="dlg-cancel">${cancelLabel}</button>
          <button class="btn ${danger ? 'btn-ghost btn-danger' : 'btn-primary'}" id="dlg-confirm">${confirmLabel}</button>
        </div>
      </div>`;
    root.appendChild(backdrop);

    const close = (result) => {
      backdrop.style.animation = 'fadeOut 150ms ease forwards';
      setTimeout(() => backdrop.remove(), 150);
      resolve(result);
    };

    backdrop.querySelector('#dlg-confirm').addEventListener('click', () => close(true));
    backdrop.querySelector('#dlg-cancel').addEventListener('click', () => close(false));
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(false); });
    backdrop.querySelector('#dlg-cancel').focus();
  });
}

/**
 * Shows a custom prompt dialog with one or more input fields.
 * @param {object} options
 * @param {string} [options.title='Input Required'] - Dialog title.
 * @param {Array<{id: string, label: string, placeholder?: string, type?: string, value?: string, required?: boolean, hint?: string}>} options.fields - Input field definitions.
 * @param {string} [options.confirmLabel='Save'] - Text for the confirm button.
 * @returns {Promise<object|null>} Resolves with a {fieldId: value} map, or null if cancelled.
 */
export function showPrompt({ title = 'Input Required', fields = [], confirmLabel = 'Save' } = {}) {
  return new Promise((resolve) => {
    const root = document.getElementById('modal-root');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" style="max-width:500px">
        <div class="modal__header">
          <h2 class="modal__title" style="font-size:16px">${title}</h2>
          <button class="btn-icon" id="dlg-close">
            <img src="/assets/icons/status-error.svg" class="illustrative-icon" alt="Close" />
          </button>
        </div>
        <div class="modal__body" style="display:flex;flex-direction:column;gap:16px">
          ${fields.map(f => `
            <div class="modal__field">
              <label class="modal__label">${f.label}${f.required ? ' <span style="color:var(--red)">*</span>' : ''}</label>
              ${f.type === 'textarea'
                ? `<textarea id="dlg-${f.id}" class="form-control" placeholder="${f.placeholder || ''}" rows="4">${f.value || ''}</textarea>`
                : f.type === 'select'
                  ? `<select id="dlg-${f.id}" class="form-control">
                      ${(f.options || []).map(o => `<option value="${o.value}" ${f.value === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
                    </select>`
                  : `<input type="${f.type || 'text'}" id="dlg-${f.id}" class="form-control" placeholder="${f.placeholder || ''}" value="${f.value || ''}" />`
              }
              ${f.hint ? `<p style="font-size:11px;color:var(--text-secondary);margin-top:4px">${f.hint}</p>` : ''}
            </div>`).join('')}
        </div>
        <div class="modal__footer">
          <button class="btn btn-secondary" id="dlg-cancel">Cancel</button>
          <button class="btn btn-primary" id="dlg-confirm">${confirmLabel}</button>
        </div>
      </div>`;
    root.appendChild(backdrop);

    const close = (result) => {
      backdrop.style.animation = 'fadeOut 150ms ease forwards';
      setTimeout(() => backdrop.remove(), 150);
      resolve(result);
    };

    backdrop.querySelector('#dlg-close').addEventListener('click', () => close(null));
    backdrop.querySelector('#dlg-cancel').addEventListener('click', () => close(null));
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(null); });

    backdrop.querySelector('#dlg-confirm').addEventListener('click', () => {
      const result = {};
      for (const f of fields) {
        const el = backdrop.querySelector(`#dlg-${f.id}`);
        const val = el ? el.value.trim() : '';
        if (f.required && !val) {
          el.style.borderColor = 'var(--red)';
          el.focus();
          return;
        }
        result[f.id] = val;
      }
      close(result);
    });

    // Focus first input
    setTimeout(() => {
      const first = backdrop.querySelector('input, textarea, select');
      if (first) first.focus();
    }, 50);

    // Enter key submits for single-field modals
    backdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close(null);
    });
  });
}
