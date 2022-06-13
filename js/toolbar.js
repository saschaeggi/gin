/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginToolbarToggle = {
    attach: function attach(context) {
      // Check for Drupal trayVerticalLocked and remove it.
      if (drupalSettings.gin.toolbar_variant != 'classic' && localStorage.getItem('Drupal.toolbar.trayVerticalLocked')) {
        localStorage.removeItem('Drupal.toolbar.trayVerticalLocked');
      }

      // Set sidebarState.
      if (localStorage.getItem('Drupal.gin.toolbarExpanded') === 'true') {
        $('body').attr('data-toolbar-menu', 'open');
        $('.toolbar-menu__trigger').addClass('is-active');
      }
      else {
        $('body').attr('data-toolbar-menu', '');
        $('.toolbar-menu__trigger').removeClass('is-active');
      }

      // Show toolbar navigation with shortcut:
      // OPTION + T (Mac) / ALT + T (Windows)
      $(document).once('ginToolbarShortcut').on('keydown', function (e) {
        if (e.altKey === true && e.keyCode === 84) {
          Drupal.behaviors.ginToolbarToggle.toggleToolbar();
        }
      });

      // Toolbar toggle
      $('.toolbar-menu__trigger', context).on('click', function (e) {
        e.preventDefault();
        Drupal.behaviors.ginToolbarToggle.toggleToolbar();
      });

      // Change when clicked
      $('#gin-toolbar-bar .toolbar-item', context).on('click', function () {
        $('body').attr('data-toolbar-tray', $(this).data('toolbar-tray'));

        // Sticky toolbar width
        $(document).ready(() => {
          $('.sticky-header').each(function () {
            $(this).width($('.sticky-table').width());
          });
        });
      });
    },
    toggleToolbar: function toggleToolbar(context) {
      $this = $('.toolbar-menu__trigger', context);

      // Toggle active class.
      $this.toggleClass('is-active');

      // Set active state.
      let active = 'true';
      if ($this.hasClass('is-active')) {
        $('body').attr('data-toolbar-menu', 'open');
      }
      else {
        $('body').attr('data-toolbar-menu', '');
        active = 'false';
        $('.gin-toolbar-inline-styles').remove();
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
    attach: function attach() {
      const toolbarEscape = once('ginEscapeAdmin', '[data-gin-toolbar-escape-admin]');
      const escapeAdminPath = sessionStorage.getItem('escapeAdminPath');

      if (toolbarEscape.length && drupalSettings.path.currentPathIsAdmin) {
        const $toolbarEscape = $(toolbarEscape);
        if (escapeAdminPath !== null) {
          $toolbarEscape.attr('href', escapeAdminPath);
        }
      }
    },
  };
})(jQuery, Drupal, drupalSettings);
