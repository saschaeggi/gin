!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginCKEditorContextMenu = {
    attach: function() {
      if (window.CKEDITOR && void 0 !== CKEDITOR) {
        if (drupalSettings.path.currentPath.indexOf("admin/config/content/formats/manage") > -1) return;
        var accentCss = drupalSettings.gin.accent_css_path, contentsCss = drupalSettings.gin.ckeditor_css_path, accentColorPreset = drupalSettings.gin.preset_accent_color, ginClasses = new Array;
        drupalSettings.gin.darkmode && ginClasses.push(drupalSettings.gin.darkmode_class), 
        drupalSettings.gin.highcontrastmode && ginClasses.push(drupalSettings.gin.highcontrastmode_class), 
        void 0 === CKEDITOR.config.contextmenu_contentsCss && (CKEDITOR.config.contextmenu_contentsCss = new Array, 
        CKEDITOR.config.contextmenu_contentsCss.push(CKEDITOR.skin.getPath("editor")), CKEDITOR.config.contextmenu_contentsCss.push(accentCss), 
        CKEDITOR.config.contextmenu_contentsCss.push(contentsCss)), CKEDITOR.on("instanceReady", (function() {
          $(".cke_wysiwyg_frame").contents().find("body").addClass(ginClasses).attr("data-gin-accent", accentColorPreset);
        })), new MutationObserver((function() {
          $("body > .cke_menu_panel > iframe").contents().find("body").addClass(ginClasses).attr("data-gin-accent", accentColorPreset);
        })).observe(document.body, {
          childList: !0
        });
      }
    }
  };
}(jQuery, Drupal, drupalSettings);