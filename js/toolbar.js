/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal, drupalSettings, once) => {
  Drupal.behaviors.ginToolbarToggle = {
    attach: function attach() {
      // Check for Drupal trayVerticalLocked and remove it.
      if (drupalSettings.gin.toolbar_variant != 'classic' && localStorage.getItem('Drupal.toolbar.trayVerticalLocked')) {
        localStorage.removeItem('Drupal.toolbar.trayVerticalLocked');
      }

      // Set sidebarState.
      if (localStorage.getItem('Drupal.gin.toolbarExpanded') === 'true') {
        document.body.setAttribute('data-toolbar-menu', 'open');
        document.querySelector('.toolbar-menu__trigger').classList.add('is-active');
      }
      else {
        document.body.setAttribute('data-toolbar-menu', '');
        document.querySelector('.toolbar-menu__trigger').classList.remove('is-active');
      }

      // Show toolbar navigation with shortcut:
      // OPTION + T (Mac) / ALT + T (Windows)
      const ginToolbarShortcut = once('ginToolbarShortcut', document.querySelector('#gin-toolbar-bar'));
      ginToolbarShortcut.forEach(() => document.addEventListener('keydown', e => {
        if (e.altKey === true && e.code === 'KeyT') {
          this.toggleToolbar();
        }
      }));

      // Toolbar toggle
      const ginToolbarToggle = once('ginToolbarToggle', document.querySelector('.toolbar-menu__trigger'));
      ginToolbarToggle.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.toggleToolbar();
      }));
    },
    toggleToolbar: () => {
      const $this = document.querySelector('.toolbar-menu__trigger');

      // Toggle active class.
      $this.classList.toggle('is-active');

      // Set active state.
      let active = 'true';
      if ($this.classList.contains('is-active')) {
        document.body.setAttribute('data-toolbar-menu', 'open');
      }
      else {
        document.body.setAttribute('data-toolbar-menu', '');
        active = 'false';
        const elementToRemove = document.querySelectorAll('.gin-toolbar-inline-styles');
        if (elementToRemove) {
          elementToRemove.parentNode.removeChild(elementToRemove);
        }
      }

      // Write state to localStorage.
      localStorage.setItem('Drupal.gin.toolbarExpanded', active);

      // Dispatch event.
      const event = new CustomEvent('toolbar-toggle', { detail: active === 'true'})
      document.dispatchEvent(event);
    }
  };

  /**
   * Replaces the "Home" link with "Back to site" link.
   *
   * Back to site link points to the last non-administrative page the user
   * visited within the same browser tab.
   */
  Drupal.behaviors.ginEscapeAdmin = {
    attach: () => {
      const ginEscapeAdmin = once('ginEscapeAdmin', document.querySelector('[data-gin-toolbar-escape-admin]'));
      ginEscapeAdmin.forEach(el => {
        const escapeAdminPath = sessionStorage.getItem('escapeAdminPath');

        if (drupalSettings.path.currentPathIsAdmin && escapeAdminPath !== null) {
          el.setAttribute('href', escapeAdminPath);
        }
      });
    },
  };
})(Drupal, drupalSettings, once);
