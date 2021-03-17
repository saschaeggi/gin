!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginToolbarActiveItem = {
    attach: function() {
      var path = drupalSettings.path.currentPath;
      path.indexOf("admin/content") > -1 || path.indexOf("/edit") > -1 ? $(".toolbar-icon-system-admin-content").addClass("is-active") : path.indexOf("admin/structure") > -1 ? $(".toolbar-icon-system-admin-structure").addClass("is-active") : path.indexOf("admin/appearance") > -1 || path.indexOf("admin/theme") > -1 ? $(".toolbar-icon-system-themes-page").addClass("is-active") : path.indexOf("admin/modules") > -1 ? $(".toolbar-icon-system-modules-list").addClass("is-active") : path.indexOf("admin/config") > -1 ? $(".toolbar-icon-system-admin-config").addClass("is-active") : path.indexOf("admin/people") > -1 ? $(".toolbar-icon-entity-user-collection").addClass("is-active") : path.indexOf("admin/reports") > -1 ? $(".toolbar-icon-system-admin-reports").addClass("is-active") : path.indexOf("admin/help") > -1 ? $(".toolbar-icon-help-main").addClass("is-active") : path.indexOf("admin/commerce") > -1 && $(".toolbar-icon-commerce-admin-commerce").addClass("is-active");
    }
  }, Drupal.behaviors.ginToolbarToggle = {
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