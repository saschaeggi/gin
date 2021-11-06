/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginCKEditorContextMenu = {
    attach: function attach(context) {
      if (typeof CKEDITOR != 'undefined') {
        // If on CKEditor config, do nothing.
        if (drupalSettings.path.currentPath.indexOf('admin/config/content/formats/manage') > -1) {
          return;
        }

        // Get configs.
        const accentCss = drupalSettings.gin.accent_css_path;
        const contentsCss = drupalSettings.gin.ckeditor_css_path;
        const accentColorPreset = drupalSettings.gin.preset_accent_color;

        // Collect Gin classes.
        let ginClasses = new Array();

        // Class for Darkmode.
        if (drupalSettings.gin.darkmode) {
          ginClasses.push(drupalSettings.gin.darkmode_class);
          CKEDITOR.config.bodyClass = drupalSettings.gin.darkmode_class;
        }

        // Class for Highcontrast mode.
        if (drupalSettings.gin.highcontrastmode) {
          ginClasses.push(drupalSettings.gin.highcontrastmode_class);
          CKEDITOR.config.bodyClass = drupalSettings.gin.highcontrastmode_class;
        }

        // Content stylesheets.
        if (CKEDITOR.config.contentsCss === undefined) {
          CKEDITOR.config.contentsCss.push(accentCss);
          CKEDITOR.config.contentsCss.push(contentsCss);
        }

        // Contextmenu stylesheets.
        if (CKEDITOR.config.contextmenu_contentsCss === undefined) {
          CKEDITOR.config.contextmenu_contentsCss = new Array();
          CKEDITOR.config.contextmenu_contentsCss.push(CKEDITOR.skin.getPath('editor'));
          CKEDITOR.config.contextmenu_contentsCss.push(accentCss);
          CKEDITOR.config.contextmenu_contentsCss.push(contentsCss);
        }

        $(CKEDITOR.instances, context).once('gin_ckeditor').each(function(index, value) {
          CKEDITOR.on('instanceReady', function() {
            Object.entries(value).forEach(([key, editor]) => {
              // Initial accent color.
              $(editor.document.$)
                  .find('body')
                  .attr('data-gin-accent', accentColorPreset);

              // Change from Code to Editor.
              editor.on('mode', function() {
                if (this.mode == 'wysiwyg') {
                  $(editor.document.$)
                    .find('body')
                    .attr('data-gin-accent', accentColorPreset);
                }
              });

              // Contextual menu.
              editor.on('menuShow', function() {
                $('body > .cke_menu_panel > iframe')
                  .contents()
                  .find('body')
                  .addClass(ginClasses)
                  .attr('data-gin-accent', accentColorPreset);
              });
            });
          });
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
