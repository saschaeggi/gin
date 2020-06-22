/* eslint-disable no-bitwise, no-nested-ternary, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginAccent = {
    attach: function attach() {
      // Set Colors
      Drupal.behaviors.ginAccent.setAccentColor();
      Drupal.behaviors.ginAccent.setFocusColor();
    },

    darkmode: function darkmode(darkmodeParam = null) {
      const darkmodeEnabled = darkmodeParam != null ? darkmodeParam : drupalSettings.gin.darkmode;
      const darkmodeClass = drupalSettings.gin.darkmode_class;

      // Needs to check for both: backwards compabitility.
      if (darkmodeEnabled === true || darkmodeEnabled === 1) {
        $('body').addClass(darkmodeClass);
      }
      else {
        $('body').removeClass(darkmodeClass);
      }
    },

    colorDefinition: function colorDefinition(darkmodeParam = null) {
      let accentColors = {};
      const darkmodeEnabled = darkmodeParam != null ? darkmodeParam : drupalSettings.gin.darkmode;

      // Needs to check for both: backwards compabitility.
      if (darkmodeEnabled === true || darkmodeEnabled === 1) {
        // Darkmode colors.
        accentColors = {
          claro_blue: '#7391d8',
          light_blue: '#82bfe8',
          dark_purple: '#976bef',
          purple: '#dba5ef',
          teal: '#67efce',
          green: '#6bd4a1',
          red: '#ca6d6d',
          orange: '#f79576',
          yellow: '#f1c970',
          pink: '#e79da3'
        };
      }
      else {
        // Light theme colors.
        accentColors = {
          claro_blue: '#003cc5',
          light_blue: '#047eb5',
          dark_purple: '#35009d',
          purple: '#5b00ff',
          teal: '#10857f',
          green: '#26a769',
          red: '#b34547',
          orange: '#ef5c20',
          yellow: '#d69400',
          pink: '#e23177'
        };
      }

      return accentColors;
    },

    setAccentColor: function setAccentColor(preset = null, color = null) {
      const accentColorPreset = preset != null ? preset : drupalSettings.gin.preset_accent_color;
      const accentColorSetting = color != null ? color : drupalSettings.gin.accent_color;
      const darkmode = preset != null
        ? $('input[name="enable_darkmode"]').is(':checked')
        : drupalSettings.gin.darkmode;
      const darkmodeClass = drupalSettings.gin.darkmode_class;
      const accentColors = Drupal.behaviors.ginAccent.colorDefinition(darkmode);
      const ratio = darkmode ? 10 : 6.5;
      let accentColor;

      // First clear things up.
      Drupal.behaviors.ginAccent.clearAccentColor();

      // if (accentColorPreset !== 'blue') {
        if (accentColorPreset === 'custom') {
          accentColor = accentColorSetting;
        }
        else {
          accentColor = accentColors[accentColorPreset];
        }

        if (accentColor) {
          const strippedAccentColor = accentColor.replace('#', '');
          const body = darkmode ? `.${darkmodeClass}` : 'body';
          const styles = `<style class="gin-custom-colors">\
            ${body} {\n\
              --colorGinPrimary: ${accentColor};\n\
              --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -10)};\n\
              --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -15)};\n\
              --colorGinPrimaryLight: ${accentColor}${Math.round(ratio * 3.5)};\n\
              --colorGinPrimaryLightHover: ${accentColor}${Math.round(ratio * 4.5)};\n\
              --colorGinPrimaryLightActive: ${accentColor}${Math.round(ratio * 5.5)};\n\
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
      // }
    },

    clearAccentColor: function clearAccentColor() {
      $('.gin-custom-colors').remove();
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
    }
  };

  Drupal.behaviors.ginTableCheckbox = {
    attach: function (context) {
      if ( $("table td .checkbox-toggle", context).length > 0 ) {
        $("table td .checkbox-toggle", context).once().bind('click', function () {
          var checkBoxes = $(this).siblings("input");
          checkBoxes.prop("checked", !checkBoxes.prop("checked"));
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
