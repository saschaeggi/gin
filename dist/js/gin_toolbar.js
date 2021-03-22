!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginToolbarToggle = {
    attach: function(context) {
      "true" === localStorage.getItem("GinSidebarOpen") ? ($("body").attr("data-toolbar-menu", "open"), 
      $(".toolbar-menu__trigger").addClass("is-active")) : ($("body").attr("data-toolbar-menu", ""), 
      $(".toolbar-menu__trigger").removeClass("is-active")), $(".toolbar-menu__trigger", context).on("click", (function(e) {
        e.preventDefault(), $(this).toggleClass("is-active");
        var active = "true";
        $(this).hasClass("is-active") ? $("body").attr("data-toolbar-menu", "open") : ($("body").attr("data-toolbar-menu", ""), 
        active = "false", $(".gin-toolbar-inline-styles").remove()), localStorage.setItem("GinSidebarOpen", active);
        var event = new CustomEvent("toolbar-toggle", {
          detail: "true" === active
        });
        document.dispatchEvent(event);
      })), $("#toolbar-bar .toolbar-item", context).on("click", (function() {
        $("body").attr("data-toolbar-tray", $(this).data("toolbar-tray")), $(document).ready((function() {
          $(".sticky-header").each((function() {
            $(this).width($(".sticky-table").width());
          }));
        }));
      }));
    }
  };
}(jQuery, Drupal, drupalSettings);