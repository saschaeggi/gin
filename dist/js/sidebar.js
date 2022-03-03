(($, Drupal) => {
  Drupal.behaviors.ginSidebarToggle = {
    attach: function(context) {
      "true" === localStorage.getItem("GinMetaOpen") ? ($("body").attr("data-meta-sidebar", "open"), 
      $(".meta-sidebar__trigger").addClass("is-active")) : ($("body").attr("data-meta-sidebar", "closed"), 
      $(".meta-sidebar__trigger").removeClass("is-active")), $(".meta-sidebar__trigger", context).once("metaSidebarToggle").on("click", (function(e) {
        e.preventDefault(), $(this).toggleClass("is-active"), $(".gin-meta-inline-styles").remove(), 
        $(this).hasClass("is-active") ? ($("body").attr("data-meta-sidebar", "open"), localStorage.setItem("GinMetaOpen", "true")) : ($("body").attr("data-meta-sidebar", "closed"), 
        localStorage.setItem("GinMetaOpen", "false"));
      }));
    }
  };
})(jQuery, Drupal);