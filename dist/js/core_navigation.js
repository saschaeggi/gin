((Drupal, drupalSettings, once) => {
  Drupal.behaviors.ginCoreNavigation = {
    attach: context => {
      Drupal.ginCoreNavigation.initKeyboardShortcut(context);
    }
  }, Drupal.ginCoreNavigation = {
    initKeyboardShortcut: function(context) {
      once("ginToolbarKeyboardShortcutInit", ".toolbar-menu__trigger, .admin-toolbar__expand-button", context).forEach((() => {
        document.addEventListener("keydown", (e => {
          !0 === e.altKey && "KeyT" === e.code && this.toggleToolbar();
        }));
      }));
    },
    toggleToolbar: function() {
      let toolbarTrigger = document.querySelector(".admin-toolbar__expand-button");
      toolbarTrigger && toolbarTrigger.click();
    }
  };
})(Drupal, drupalSettings, once);