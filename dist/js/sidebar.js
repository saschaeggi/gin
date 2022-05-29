(($, Drupal) => {
  Drupal.behaviors.ginSidebar = {
    attach: function(context) {
      "true" === localStorage.getItem("Drupal.gin.sidebarExpanded") ? Drupal.behaviors.ginSidebar.showSidebar() : Drupal.behaviors.ginSidebar.collapseSidebar(), 
      $(".meta-sidebar__trigger", context).once("metaSidebarToggle").on("click", (function(e) {
        e.preventDefault(), Drupal.behaviors.ginSidebar.removeInlineStyles(), Drupal.behaviors.ginSidebar.toggleSidebar($(this));
      })), $(".meta-sidebar__close, .meta-sidebar__overlay", context).once("metaSidebarClose").on("click", (function(e) {
        e.preventDefault(), Drupal.behaviors.ginSidebar.removeInlineStyles(), Drupal.behaviors.ginSidebar.collapseSidebar();
      })), $(window).on("resize", Drupal.debounce(Drupal.behaviors.ginSidebar.collapseSidebarMobile, 150)).trigger("resize");
    },
    toggleSidebar: function(element) {
      element.hasClass("is-active") ? (Drupal.behaviors.ginSidebar.collapseSidebar(), 
      localStorage.setItem("Drupal.gin.sidebarExpanded", "false")) : (Drupal.behaviors.ginSidebar.showSidebar(), 
      localStorage.setItem("Drupal.gin.sidebarExpanded", "true"));
    },
    collapseSidebarMobile: function() {
      Drupal.behaviors.ginSidebar.removeInlineStyles(), "true" === localStorage.getItem("Drupal.gin.sidebarExpanded") && (window.innerWidth < 1024 ? Drupal.behaviors.ginSidebar.collapseSidebar() : Drupal.behaviors.ginSidebar.showSidebar());
    },
    showSidebar: function() {
      const showLabel = Drupal.t("Show sidebar panel");
      $(".meta-sidebar__trigger").attr("title", showLabel), $(".meta-sidebar__trigger span").html(showLabel), 
      $(".meta-sidebar__trigger").attr("aria-expanded", "true"), $(".meta-sidebar__trigger").addClass("is-active"), 
      $("body").attr("data-meta-sidebar", "open");
    },
    collapseSidebar: function() {
      const hideLabel = Drupal.t("Hide sidebar panel");
      $(".meta-sidebar__trigger").attr("title", hideLabel), $(".meta-sidebar__trigger span").html(hideLabel), 
      $(".meta-sidebar__trigger").removeClass("is-active"), $("body").attr("data-meta-sidebar", "closed"), 
      $(".meta-sidebar__trigger").attr("aria-expanded", "false");
    },
    removeInlineStyles: function() {
      $(".gin-sidebar-inline-styles").remove();
    }
  };
})(jQuery, Drupal);