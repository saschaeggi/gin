/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal, drupalSettings) => {
  Drupal.behaviors.ginCKEditor = {
    attach: (context) => {
      const ginCKEditor = once('ginCKEditor', context.querySelectorAll('body'));
      ginCKEditor.forEach(() => {
        if (window.CKEDITOR && CKEDITOR !== undefined) {
          // If on CKEditor config, do nothing.
          if (drupalSettings.path.currentPath.indexOf('admin/config/content/formats/manage') > -1) {
            return;
          }

          // Get configs.
          const variablesCss = drupalSettings.gin.variables_css_path;
          const accentCss = drupalSettings.gin.accent_css_path;
          const contentsCss = drupalSettings.gin.ckeditor_css_path;
          const accentColorPreset = drupalSettings.gin.preset_accent_color;
          const accentColor = drupalSettings.gin.accent_color;
          const darkmodeClass = drupalSettings.gin.darkmode_class;

          // Class for Darkmode.
          if (
            localStorage.getItem('Drupal.gin.darkmode') == 1 ||
            localStorage.getItem('Drupal.gin.darkmode') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches
          ) {
            CKEDITOR.config.bodyClass = darkmodeClass;
          }

          // Content stylesheets.
          if (CKEDITOR.config.contentsCss === undefined) {
            CKEDITOR.config.contentsCss.push(
              variablesCss,
              accentCss,
              contentsCss
            );
          }

          // Contextmenu stylesheets.
          if (CKEDITOR.config.contextmenu_contentsCss === undefined) {
            CKEDITOR.config.contextmenu_contentsCss = new Array();

            // Check if skinName is set.
            if (typeof CKEDITOR.skinName === 'undefined') {
              CKEDITOR.skinName = CKEDITOR.skin.name;
            }

            CKEDITOR.config.contextmenu_contentsCss.push(
              CKEDITOR.skin.getPath('editor'),
              variablesCss,
              accentCss,
              contentsCss
            );
          }

          CKEDITOR.on('instanceReady', (element) => {
            const editor = element.editor;
            const editorBody = editor.document.$.body;

            // Initial accent color.
            editorBody.setAttribute('data-gin-accent', accentColorPreset);

            if (accentColorPreset === 'custom' && accentColor) {
              Drupal.behaviors.ginAccent.setCustomAccentColor(accentColor, document.querySelector(editor.document.$).querySelectorAll('head'));
            }

            // Change from Code to Editor.
            editor.on('mode', function() {
              if (this.mode == 'wysiwyg') {
                editorBody.setAttribute('data-gin-accent', accentColorPreset);

                if (accentColorPreset === 'custom' && accentColor) {
                  Drupal.behaviors.ginAccent.setCustomAccentColor(accentColor, document.querySelector(editor.document.$).querySelectorAll('head'));
                }

                if (localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    editorBody.classList.add(darkmodeClass);
                  } else {
                    editorBody.classList.remove(darkmodeClass);
                  }
                }
              }
            });

            // Contextual menu.
            editor.on('menuShow', function(element) {
              const darkModeClass = localStorage.getItem('Drupal.gin.darkmode') == 1 || localStorage.getItem('Drupal.gin.darkmode') === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches
                ? darkmodeClass
                : '';
              const iframeElement = element.data[0].element.$.childNodes[0].contentWindow.document;

              if (darkModeClass) {
                iframeElement.body.classList.add(darkModeClass);
              }

              iframeElement.body.setAttribute('data-gin-accent', accentColorPreset);

              if (accentColorPreset === 'custom' && accentColor) {
                Drupal.behaviors.ginAccent.setCustomAccentColor(accentColor, elementBody.head);
              }
            });

            // Toggle Darkmode.
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
              if (e.matches && localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
                editorBody.classList.add(darkmodeClass);

                if (document.querySelectorAll(`.${editor.id}.cke_panel`).length > 0) {
                  const iframeElement = document.querySelector(`.${editor.id}.cke_panel`).childNodes[0].contentWindow.document;
                  iframeElement.body.classList.add(darkmodeClass);
                }
              }
            });

            // Change to Lightmode.
            window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
              if (e.matches && localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
                editorBody.classList.remove(darkmodeClass);

                if (document.querySelectorAll(`.${editor.id}.cke_panel`).length > 0) {
                  const iframeElement = document.querySelector(`.${editor.id}.cke_panel`).childNodes[0].contentWindow.document;
                  iframeElement.body.classList.remove(darkmodeClass);
                }
              }
            });
          });
        }
      });
    }
  };
})(Drupal, drupalSettings);
