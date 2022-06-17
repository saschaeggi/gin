(($, Drupal) => {
  const storageDesktop = "Drupal.gin.sidebarExpanded.desktop";
  Drupal.behaviors.ginSidebar = {
    attach: function(context) {
      localStorage.getItem(storageDesktop) || localStorage.setItem(storageDesktop, "true"), 
      window.innerWidth >= 1024 && ("true" === localStorage.getItem(storageDesktop) ? Drupal.behaviors.ginSidebar.showSidebar() : Drupal.behaviors.ginSidebar.collapseSidebar()), 
      $(document).once("ginMetaSidebarShortcut").on("keydown", (function(e) {
        !0 === e.altKey && 83 === e.keyCode && Drupal.behaviors.ginSidebar.toggleSidebar();
      })), $(".meta-sidebar__trigger", context).once("ginMetaSidebarToggle").on("click", (function(e) {
        e.preventDefault(), Drupal.behaviors.ginSidebar.removeInlineStyles(), Drupal.behaviors.ginSidebar.toggleSidebar();
      })), $(".meta-sidebar__close, .meta-sidebar__overlay", context).once("ginMetaSidebarClose").on("click", (function(e) {
        e.preventDefault(), Drupal.behaviors.ginSidebar.removeInlineStyles(), Drupal.behaviors.ginSidebar.collapseSidebar();
      })), $(window).once("ginMetaSidebarResize").on("resize", Drupal.debounce(Drupal.behaviors.ginSidebar.handleResize, 150)).trigger("resize");
    },
    toggleSidebar: function() {
      $(".meta-sidebar__trigger").hasClass("is-active") ? Drupal.behaviors.ginSidebar.collapseSidebar() : Drupal.behaviors.ginSidebar.showSidebar();
    },
    showSidebar: function() {
      const chooseStorage = window.innerWidth < 1024 ? "Drupal.gin.sidebarExpanded.mobile" : storageDesktop, showLabel = Drupal.t("Hide sidebar panel");
      $(".meta-sidebar__trigger").attr("title", showLabel), $(".meta-sidebar__trigger span").html(showLabel), 
      localStorage.setItem(chooseStorage, "true"), $(".meta-sidebar__trigger").attr("aria-expanded", "true"), 
      $(".meta-sidebar__trigger").addClass("is-active"), $("body").attr("data-meta-sidebar", "open");
    },
    collapseSidebar: function() {
      const chooseStorage = window.innerWidth < 1024 ? "Drupal.gin.sidebarExpanded.mobile" : storageDesktop, hideLabel = Drupal.t("Show sidebar panel");
      $(".meta-sidebar__trigger").attr("title", hideLabel), $(".meta-sidebar__trigger span").html(hideLabel), 
      localStorage.setItem(chooseStorage, "false"), $(".meta-sidebar__trigger").removeClass("is-active"), 
      $("body").attr("data-meta-sidebar", "closed"), $(".meta-sidebar__trigger").attr("aria-expanded", "false");
    },
    handleResize: function() {
      Drupal.behaviors.ginSidebar.removeInlineStyles(), window.innerWidth < 1024 ? Drupal.behaviors.ginSidebar.collapseSidebar() : "true" === localStorage.getItem(storageDesktop) ? Drupal.behaviors.ginSidebar.showSidebar() : Drupal.behaviors.ginSidebar.collapseSidebar();
    },
    removeInlineStyles: function() {
      $(".gin-sidebar-inline-styles").remove();
    }
  };
})(jQuery, Drupal);