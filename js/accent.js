/* eslint-disable no-bitwise, no-nested-ternary, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginSticky = {
    attach: function attach() {
      if (document.querySelectorAll('.region-sticky').length > 0) {
        // Watch sticky header
        const observer = new IntersectionObserver(
          ([e]) => document.querySelector('.region-sticky').classList.toggle('region-sticky--is-sticky', e.intersectionRatio < 1),
          { threshold: [1] }
        );

        if (document.querySelectorAll('.region-sticky-watcher').length > 0) {
          observer.observe(document.querySelector('.region-sticky-watcher'));
        }
      }
    }
  };

  Drupal.behaviors.ginAccent = {
    attach: function attach() {
      const path = drupalSettings.path.currentPath;

      // Check Darkmode.
      Drupal.behaviors.ginAccent.checkDarkmode();

      // Set focus color.
      Drupal.behaviors.ginAccent.setFocusColor();

      // Set accent color to localStorage if not set yet.
      if ((
          path.indexOf('user/login') === -1 &&
          path.indexOf('user/password') === -1 &&
          path.indexOf('user/register') === -1
        ) &&
        !localStorage.getItem('Drupal.gin.customAccentColor')
      ) {
        Drupal.behaviors.ginAccent.setAccentColor();

        const accentColorPreset = drupalSettings.gin.preset_accent_color;

        if (accentColorPreset === 'custom') {
          const accentColorSetting = drupalSettings.gin.accent_color;

          localStorage.setItem('Drupal.gin.customAccentColor', accentColorSetting);
        } else {
          localStorage.setItem('Drupal.gin.customAccentColor', '');
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

        const accentColor = accentColorSetting;

        if (accentColor) {
          Drupal.behaviors.ginAccent.clearAccentColor();

          const strippedAccentColor = accentColor.replace('#', '');
          const darkAccentColor = Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 65).replace('#', '');

          const styles = `<style class="gin-custom-colors">\
            [data-gin-accent="custom"] {\n\
              --colorGinPrimaryRGB: ${Drupal.behaviors.ginAccent.hexToRgb(accentColor)};\n\
              --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -10)};\n\
              --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -15)};\n\
              --colorGinAppBackgroundRGB: ${Drupal.behaviors.ginAccent.hexToRgb(Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 97))};\n\
              --colorGinTableHeader: ${Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 85)};\n\
            }\n\
            .gin--dark-mode[data-gin-accent="custom"],\n\
            .gin--dark-mode [data-gin-accent="custom"] {\n\
              --colorGinPrimaryRGB: ${Drupal.behaviors.ginAccent.hexToRgb(darkAccentColor)};\n\
              --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 55)};\n\
              --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 50)};\n\
              --colorGinTableHeader: ${Drupal.behaviors.ginAccent.mixColor('2A2A2D', darkAccentColor, 88)};\n\
            }\n\
            </style>`;

          $('body').append(styles);
        }
      } else {
        Drupal.behaviors.ginAccent.clearAccentColor();
      }
    },

    clearAccentColor: function clearAccentColor() {
      $('.gin-custom-colors').remove();
    },

    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRgb: function hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    },

    setFocusColor: function setFocusColor(preset = null, color = null) {
      const focusColorPreset = preset != null ? preset : drupalSettings.gin.preset_focus_color;
      const focusColorSetting = color != null ? color : drupalSettings.gin.focus_color;

      // First clear things up.
      Drupal.behaviors.ginAccent.clearFocusColor();

      // Set focus name.
      $('body').attr('data-gin-focus', focusColorPreset);

      if (focusColorSetting === 'custom') {
        $('body').css('--colorGinFocus', focusColorSetting);
      }
    },

    clearFocusColor: function clearFocusColor() {
      $('body').css('--colorGinFocus', '');
    },

    checkDarkmode: function checkDarkmode() {
      const darkmodeClass = drupalSettings.gin.darkmode_class;

      // Change to Darkmode.
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches && localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
          $('html').addClass(darkmodeClass);
        }
      });

      // Change to Lightmode.
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (e.matches && localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
          $('html').removeClass(darkmodeClass);
        }
      });
    },

    // https://gist.github.com/jedfoster/7939513
    mixColor: function mixColor(color_1, color_2, weight) {
      function d2h(d) { return d.toString(16); }
      function h2d(h) { return parseInt(h, 16); }

      weight = (typeof(weight) !== 'undefined') ? weight : 50;

      var color = "#";

      for (var i = 0; i <= 5; i += 2) {
        var v1 = h2d(color_1.substr(i, 2)),
            v2 = h2d(color_2.substr(i, 2)),
            val = d2h(Math.floor(v2 + (v1 - v2) * (weight / 100.0)));

        while(val.length < 2) { val = '0' + val; }
        color += val;
      }

      return color;
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
  };
})(jQuery, Drupal, drupalSettings);
