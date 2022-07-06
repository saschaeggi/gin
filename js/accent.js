/* eslint-disable no-bitwise, no-nested-ternary, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal, drupalSettings) => {
  Drupal.behaviors.ginAccent = {
    attach: (context) => {
      const ginAccent = once('ginAccent', context.querySelectorAll('body'));
      ginAccent.forEach(() => {
        // Check Darkmode.
        Drupal.behaviors.ginAccent.checkDarkmode();

        // Set accent color.
        Drupal.behaviors.ginAccent.setAccentColor();

        // Set focus color.
        Drupal.behaviors.ginAccent.setFocusColor();
      });
    },

    setAccentColor: (preset = null, color = null) => {
      const accentColorPreset = preset != null ? preset : drupalSettings.gin.preset_accent_color;
      document.body.setAttribute('data-gin-accent', accentColorPreset);

      if (accentColorPreset === 'custom') {
        Drupal.behaviors.ginAccent.setCustomAccentColor(color);
      }
    },

    setCustomAccentColor: (color = null) => {
      // If custom color is set, generate colors through JS.
      const accentColor = color != null ? color : drupalSettings.gin.accent_color;
      if (accentColor) {
        Drupal.behaviors.ginAccent.clearAccentColor();

        const strippedAccentColor = accentColor.replace('#', '');
        const darkAccentColor = Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 65).replace('#', '');
        const style = document.createElement('style');
        const className = 'gin-custom-focus';
        style.className = className;
        style.innerHTML = `
          [data-gin-accent="custom"] {\n\
            --colorGinPrimaryRGB: ${Drupal.behaviors.ginAccent.hexToRgb(accentColor)};\n\
            --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -10)};\n\
            --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -15)};\n\
            --colorGinAppBackgroundRGB: ${Drupal.behaviors.ginAccent.hexToRgb(Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 97))};\n\
            --colorGinTableHeader: ${Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 85)};\n\
            --colorGinStickyRGB: ${Drupal.behaviors.ginAccent.hexToRgb(Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 92))};\n\
          }\n\
          .gin--dark-mode[data-gin-accent="custom"],\n\
          .gin--dark-mode [data-gin-accent="custom"] {\n\
            --colorGinPrimaryRGB: ${Drupal.behaviors.ginAccent.hexToRgb(darkAccentColor)};\n\
            --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 55)};\n\
            --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 50)};\n\
            --colorGinTableHeader: ${Drupal.behaviors.ginAccent.mixColor('2A2A2D', darkAccentColor, 88)};\n\
          }\n\
        `;

        const scriptTag = document.querySelector('script');
        scriptTag.parentNode.insertBefore(style, scriptTag);
      }
    },

    clearAccentColor: () => {
      if (document.querySelectorAll('.gin-custom-colors').length > 0) {
        const removeElement = document.querySelector('.gin-custom-colors');
        removeElement.parentNode.removeChild(removeElement);
      }
    },

    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRgb: (hex) => {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    },

    setFocusColor: (preset = null, color = null) => {
      const focusColorPreset = preset != null ? preset : drupalSettings.gin.preset_focus_color;
      document.body.setAttribute('data-gin-focus', focusColorPreset);

      if (focusColorPreset === 'custom') {
       Drupal.behaviors.ginAccent.setCustomFocusColor(color);
      }
    },

    setCustomFocusColor: (color = null) => {
      const accentColor = color != null ? color : drupalSettings.gin.focus_color;

      // Set preset color.
      if (accentColor) {
        Drupal.behaviors.ginAccent.clearFocusColor();

        const strippedAccentColor = accentColor.replace('#', '');
        const darkAccentColor = Drupal.behaviors.ginAccent.mixColor('ffffff', strippedAccentColor, 65);
        const style = document.createElement('style');
        const className = 'gin-custom-focus';
        style.className = className;
        style.innerHTML = `
          [data-gin-focus="custom"] {\n\
            --colorGinFocus: ${accentColor};\n\
          }\n\
          .gin--dark-mode[data-gin-focus="custom"],\n\
          .gin--dark-mode [data-gin-focus="custom"] {\n\
            --colorGinFocus: ${darkAccentColor};\n\
          }
        `;

        const scriptTag = document.querySelector('script');
        scriptTag.parentNode.insertBefore(style, scriptTag);
      }
    },

    clearFocusColor: () => {
      if (document.querySelectorAll('.gin-custom-focus').length > 0) {
        const removeElement = document.querySelector('.gin-custom-focus');
        removeElement.parentNode.removeChild(removeElement);
      }
    },

    checkDarkmode: () => {
      const darkmodeClass = drupalSettings.gin.darkmode_class;

      // Change to Darkmode.
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches && localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
          document.querySelector('html').classList.add(darkmodeClass);
        }
      });

      // Change to Lightmode.
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (e.matches && localStorage.getItem('Drupal.gin.darkmode') === 'auto') {
          document.querySelector('html').classList.remove(darkmodeClass);
        }
      });
    },

    // https://gist.github.com/jedfoster/7939513
    mixColor: (color_1, color_2, weight) => {
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

    shadeColor: (color, percent) => {
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
})(Drupal, drupalSettings);
