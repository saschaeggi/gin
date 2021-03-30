/* eslint-disable no-bitwise, no-nested-ternary, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginAccent = {
    attach: function attach() {
      const path = drupalSettings.path.currentPath;

      // Set focus color.
      Drupal.behaviors.ginAccent.setFocusColor();

      // Set accent color to localStorage if not set yet.
      if ((
          path.indexOf('user/login') === -1 &&
          path.indexOf('user/password') === -1 &&
          path.indexOf('user/register') === -1
        ) &&
        !localStorage.getItem('GinAccentColorCustom')
      ) {
        Drupal.behaviors.ginAccent.setAccentColor();

        const accentColorPreset = drupalSettings.gin.preset_accent_color;

        if (accentColorPreset === 'custom') {
          const accentColorSetting = drupalSettings.gin.accent_color;

          localStorage.setItem('GinAccentColorCustom', accentColorSetting);
        } else {
          localStorage.setItem('GinAccentColorCustom', '');
        }
      } else {
        Drupal.behaviors.ginAccent.setAccentColor();
      }
    },

    setAccentColor: function setAccentColor(preset = null, color = null) {
      const accentColorPreset = preset != null ? preset : drupalSettings.gin.preset_accent_color;

      // Clear things up if not custom color is set.
      if (accentColorPreset === 'custom') {
        // Set preset color.
        $('body').attr('data-gin-accent', preset);
        Drupal.behaviors.ginAccent.setCustomAccentColor('custom', color);
      } else {
        // Set preset color.
        $('body').attr('data-gin-accent', accentColorPreset);
      }
    },

    setCustomAccentColor: function setCustomAccentColor(preset = null, color = null) {
      const accentColorSetting = color != null ? color : drupalSettings.gin.accent_color;

      // If custom color is set, generate colors through JS.
      if (preset === 'custom') {
        // Set preset color.
        $('body').attr('data-gin-accent', preset);

        const darkmode = preset != null
        ? $('input[name="enable_darkmode"]').is(':checked')
        : drupalSettings.gin.darkmode;
        const darkmodeClass = drupalSettings.gin.darkmode_class;
        const ratio = darkmode ? 10 : 6.5;
        const accentColor = accentColorSetting;

        if (accentColor) {
          Drupal.behaviors.ginAccent.clearAccentColor();

          const strippedAccentColor = accentColor.replace('#', '');

          const styles = `<style class="gin-custom-colors">\
            body:not(.gin-inactive) {\n\
              --colorGinPrimary: ${accentColor};\n\
              --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -10)};\n\
              --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -15)};\n\
              --colorGinPrimaryLight: ${accentColor}${Math.round(ratio * 3.5)};\n\
              --colorGinPrimaryLightHover: ${accentColor}${Math.round(ratio * 4.5)};\n\
              --colorGinPrimaryLightActive: ${accentColor}${Math.round(ratio * 5.5)};\n\
              --colorGinPrimaryLightShadow: ${accentColor}${Math.round(ratio * 10)};\n\
              --colorGinItemHover: ${accentColor}${Math.round(ratio * 1.5)};\n\
            }\n\
            .form-element--type-select:hover,\n\
            .form-element--type-select:active,\n\
            .form-element--type-select:focus {\n\
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'%3E%3Cpath fill='none' stroke-width='1.5' d='M1 1L7 7L13 1' stroke='%23${strippedAccentColor}'/%3E%3C/svg%3E%0A");\n\
            }\n\
            </style>`;

          $('body').append(styles);
        }
      }
    },

    clearAccentColor: function clearAccentColor() {
      $('.gin-custom-colors').remove();
    },

    shadeColor: function shadeColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = (num >> 16) + amt;
      const B = ((num >> 8) & 0x00ff) + amt;
      const G = (num & 0x0000ff) + amt;

      return `#${(
        0x1000000
        + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000
        + (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100
        + (G < 255 ? (G < 1 ? 0 : G) : 255)
      )
        .toString(16)
        .slice(1)}`;
    },

    setFocusColor: function setFocusColor(preset = null, color = null) {
      const focusColorPreset = preset != null ? preset : drupalSettings.gin.preset_focus_color;
      const focusColorSetting = color != null ? color : drupalSettings.gin.focus_color;

      // First clear things up.
      Drupal.behaviors.ginAccent.clearFocusColor();

      if (focusColorPreset !== 'gin') {
        let setColor;

        switch (focusColorPreset) {
          default:
          case 'claro':
            setColor = '#26a769';
            break;
          case 'green':
            setColor = '#08a390';
            break;
          case 'orange':
            setColor = '#ec7c57';
            break;
          case 'dark':
            setColor = '#5c5a67';
            break;
          case 'accent':
            setColor = 'var(--colorGinPrimary)';
            break;
          case 'custom':
            setColor = focusColorSetting;
            break;
        }

        $('body').css('--colorGinFocus', setColor);
      }
    },

    clearFocusColor: function clearFocusColor() {
      $('body').css('--colorGinFocus', '');
    },
  };
})(jQuery, Drupal, drupalSettings);
