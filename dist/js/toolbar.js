(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginToolbarToggle = {
    attach: function(context) {
      "classic" != drupalSettings.gin.toolbar_variant && localStorage.getItem("Drupal.toolbar.trayVerticalLocked") && localStorage.removeItem("Drupal.toolbar.trayVerticalLocked"), 
      "true" === localStorage.getItem("Drupal.gin.toolbarExpanded") ? ($("body").attr("data-toolbar-menu", "open"), 
      $(".toolbar-menu__trigger").addClass("is-active")) : ($("body").attr("data-toolbar-menu", ""), 
      $(".toolbar-menu__trigger").removeClass("is-active")), $(document).once("ginToolbarShortcut").on("keydown", (function(e) {
        !0 === e.altKey && 84 === e.keyCode && Drupal.behaviors.ginToolbarToggle.toggleToolbar();
      })), $(".toolbar-menu__trigger", context).on("click", (function(e) {
        e.preventDefault(), Drupal.behaviors.ginToolbarToggle.toggleToolbar();
      })), $("#gin-toolbar-bar .toolbar-item", context).on("click", (function() {
        $("body").attr("data-toolbar-tray", $(this).data("toolbar-tray")), $(document).ready((() => {
          $(".sticky-header").each((function() {
            $(this).width($(".sticky-table").width());
          }));
        }));
      }));
    },
    toggleToolbar: function(context) {
      $this = $(".toolbar-menu__trigger", context), $this.toggleClass("is-active");
      let active = "true";
      $this.hasClass("is-active") ? $("body").attr("data-toolbar-menu", "open") : ($("body").attr("data-toolbar-menu", ""), 
      active = "false", $(".gin-toolbar-inline-styles").remove()), localStorage.setItem("Drupal.gin.toolbarExpanded", active);
      const event = new CustomEvent("toolbar-toggle", {
        detail: "true" === active
      });
      document.dispatchEvent(event);
    }
  }, Drupal.behaviors.ginEscapeAdmin = {
    attach: function() {
      const toolbarEscape = once("ginEscapeAdmin", "[data-gin-toolbar-escape-admin]"), escapeAdminPath = sessionStorage.getItem("escapeAdminPath");
      if (toolbarEscape.length && drupalSettings.path.currentPathIsAdmin) {
        const $toolbarEscape = $(toolbarEscape);
        null !== escapeAdminPath && $toolbarEscape.attr("href", escapeAdminPath);
      }
    }
  };
})(jQuery, Drupal, drupalSettings);