/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

((Drupal, drupalSettings, once) => {
  Drupal.behaviors.ginCoreNavigation = {
    attach: (context) => {
      Drupal.ginCoreNavigation.initKeyboardShortcut(context);
    },
  };

  Drupal.ginCoreNavigation = {
    initKeyboardShortcut: function (context) {
      once('ginToolbarKeyboardShortcutInit', '.toolbar-menu__trigger, .admin-toolbar__expand-button', context).forEach(() => {
        // Show toolbar navigation with shortcut:
        // OPTION + T (Mac) / ALT + T (Windows)
        document.addEventListener('keydown', e => {
          if (e.altKey === true && e.code === 'KeyT') {
            this.toggleToolbar();
          }
        });
      });
    },

    toggleToolbar: function () {
      let toolbarTrigger = document.querySelector('.admin-toolbar__expand-button');

      // Core navigation.
      if (toolbarTrigger) {
        toolbarTrigger.click();
        return;
      }
    },
  };

})(Drupal, drupalSettings, once);
