/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

((Drupal, drupalSettings, once) => {
  Drupal.behaviors.ginToolbar = {
    attach: (context) => {
      Drupal.ginToolbar.init(context);
    },

  };

  /**
   * Replaces the "Home" link with "Back to site" link.
   *
   * Back to site link points to the last non-administrative page the user
   * visited within the same browser tab.
   */
  Drupal.behaviors.ginEscapeAdmin = {
    attach: (context) => {
      once('ginEscapeAdmin', '[data-gin-toolbar-escape-admin]', context).forEach(el => {
        const escapeAdminPath = sessionStorage.getItem('escapeAdminPath');

        if (drupalSettings.path.currentPathIsAdmin && escapeAdminPath !== null) {
          el.setAttribute('href', escapeAdminPath);
        }
      });
    },
  };

  Drupal.ginToolbar = {
    init: function (context) {
      once('ginToolbarInit', '#gin-toolbar-bar', context).forEach(() => {
        const toolbarTrigger = document.querySelector('.toolbar-menu__trigger');

        // Check for Drupal trayVerticalLocked and remove it.
        if (drupalSettings.gin.toolbar_variant != 'classic' && localStorage.getItem('Drupal.toolbar.trayVerticalLocked')) {
          localStorage.removeItem('Drupal.toolbar.trayVerticalLocked');
        }

        // Set sidebarState.
        if (localStorage.getItem('Drupal.gin.toolbarExpanded') === 'true') {
          document.body.setAttribute('data-toolbar-menu', 'open');
          toolbarTrigger.classList.add('is-active');
        }
        else {
          document.body.setAttribute('data-toolbar-menu', '');
          toolbarTrigger.classList.remove('is-active');
        }

        // Show toolbar navigation with shortcut:
        // OPTION + T (Mac) / ALT + T (Windows)
        document.addEventListener('keydown', e => {
          if (e.altKey === true && e.code === 'KeyT') {
            this.toggleToolbar();
          }
        });

        this.initDisplace();
      });

      // Toolbar toggle
      once('ginToolbarToggle', '.toolbar-menu__trigger', context).forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.toggleToolbar();
      }));
    },

    initDisplace: () => {
      const toolbar = document.querySelector('#gin-toolbar-bar .toolbar-menu-administration');
      const toolbarVariant = drupalSettings.gin.toolbar_variant;

      if (toolbar) {
        if (toolbarVariant === 'vertical') {
          toolbar.setAttribute('data-offset-left', '');
        } else {
          toolbar.setAttribute('data-offset-top', '');
        }
      }
    },

    toggleToolbar: () => {
      const toolbarTrigger = document.querySelector('.toolbar-menu__trigger');

      // Toggle active class.
      toolbarTrigger.classList.toggle('is-active');

      // Set active state.
      let active = 'true';
      if (toolbarTrigger.classList.contains('is-active')) {
        document.body.setAttribute('data-toolbar-menu', 'open');
      }
      else {
        document.body.setAttribute('data-toolbar-menu', '');

        active = 'false';
        const elementToRemove = document.querySelector('.gin-toolbar-inline-styles');
        if (elementToRemove) {
          elementToRemove.parentNode.removeChild(elementToRemove);
        }
      }

      // Write state to localStorage.
      localStorage.setItem('Drupal.gin.toolbarExpanded', active);

      // Dispatch event.
      const event = new CustomEvent('toolbar-toggle', { detail: active === 'true'})
      document.dispatchEvent(event);

      // Displace.
      ontransitionend = () => {
        Drupal.displace(true);
      };
    },

  };

})(Drupal, drupalSettings, once);
