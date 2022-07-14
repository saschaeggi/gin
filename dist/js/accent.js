((Drupal, drupalSettings) => {
  Drupal.behaviors.ginAccent = {
    attach: context => {
      once("ginAccent", context.querySelectorAll("body")).forEach((() => {
        Drupal.behaviors.ginAccent.checkDarkmode(), Drupal.behaviors.ginAccent.setAccentColor(), 
        Drupal.behaviors.ginAccent.setFocusColor();
      }));
    },
    setAccentColor: function() {
      let preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      const accentColorPreset = null != preset ? preset : drupalSettings.gin.preset_accent_color;
      document.body.setAttribute("data-gin-accent", accentColorPreset), "custom" === accentColorPreset && Drupal.behaviors.ginAccent.setCustomAccentColor(color);
    },
    setCustomAccentColor: function() {
      let color = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, element = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.body;
      const accentColor = null != color ? color : drupalSettings.gin.accent_color;
      if (accentColor) {
        Drupal.behaviors.ginAccent.clearAccentColor(element);
        const strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 65).replace("#", ""), style = document.createElement("style"), className = "gin-custom-colors";
        style.className = className, style.innerHTML = `\n          [data-gin-accent="custom"] {\n            --colorGinPrimaryRGB: ${Drupal.behaviors.ginAccent.hexToRgb(accentColor)};\n            --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -10)};\n            --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.shadeColor(accentColor, -15)};\n            --colorGinAppBackgroundRGB: ${Drupal.behaviors.ginAccent.hexToRgb(Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 97))};\n            --colorGinTableHeader: ${Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 85)};\n          }\n          .gin--dark-mode[data-gin-accent="custom"],\n          .gin--dark-mode [data-gin-accent="custom"] {\n            --colorGinPrimaryRGB: ${Drupal.behaviors.ginAccent.hexToRgb(darkAccentColor)};\n            --colorGinPrimaryHover: ${Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 55)};\n            --colorGinPrimaryActive: ${Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 50)};\n            --colorGinTableHeader: ${Drupal.behaviors.ginAccent.mixColor("2A2A2D", darkAccentColor, 88)};\n          }\n        `, 
        element.parentNode.querySelector(":scope > :last-child").append(style);
      }
    },
    clearAccentColor: function() {
      let element = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body;
      if (element.querySelectorAll(".gin-custom-colors").length > 0) {
        const removeElement = element.querySelector(".gin-custom-colors");
        removeElement.parentNode.removeChild(removeElement);
      }
    },
    hexToRgb: hex => {
      hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(m, r, g, b) {
        return r + r + g + g + b + b;
      }));
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    },
    setFocusColor: function() {
      let preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      const focusColorPreset = null != preset ? preset : drupalSettings.gin.preset_focus_color;
      document.body.setAttribute("data-gin-focus", focusColorPreset), "custom" === focusColorPreset && Drupal.behaviors.ginAccent.setCustomFocusColor(color);
    },
    setCustomFocusColor: function() {
      let color = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, element = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.body;
      const accentColor = null != color ? color : drupalSettings.gin.focus_color;
      if (accentColor) {
        Drupal.behaviors.ginAccent.clearFocusColor(element);
        const strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 65), style = document.createElement("style"), className = "gin-custom-focus";
        style.className = className, style.innerHTML = `\n          [data-gin-focus="custom"] {\n            --colorGinFocus: ${accentColor};\n          }\n          .gin--dark-mode[data-gin-focus="custom"],\n          .gin--dark-mode [data-gin-focus="custom"] {\n            --colorGinFocus: ${darkAccentColor};\n          }\n        `, 
        element.parentNode.querySelector(":scope > :last-child").append(style);
      }
    },
    clearFocusColor: function() {
      let element = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body;
      if (element.querySelectorAll(".gin-custom-focus").length > 0) {
        const removeElement = element.querySelector(".gin-custom-focus");
        removeElement.parentNode.removeChild(removeElement);
      }
    },
    checkDarkmode: () => {
      const darkmodeClass = drupalSettings.gin.darkmode_class;
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e => {
        e.matches && "auto" === localStorage.getItem("Drupal.gin.darkmode") && document.querySelector("html").classList.add(darkmodeClass);
      })), window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e => {
        e.matches && "auto" === localStorage.getItem("Drupal.gin.darkmode") && document.querySelector("html").classList.remove(darkmodeClass);
      }));
    },
    mixColor: (color_1, color_2, weight) => {
      function h2d(h) {
        return parseInt(h, 16);
      }
      weight = void 0 !== weight ? weight : 50;
      for (var color = "#", i = 0; i <= 5; i += 2) {
        for (var v1 = h2d(color_1.substr(i, 2)), v2 = h2d(color_2.substr(i, 2)), val = Math.floor(v2 + weight / 100 * (v1 - v2)).toString(16); val.length < 2; ) val = "0" + val;
        color += val;
      }
      return color;
    },
    shadeColor: (color, percent) => {
      const num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 255) + amt, G = (255 & num) + amt;
      return `#${(16777216 + 65536 * (R < 255 ? R < 1 ? 0 : R : 255) + 256 * (B < 255 ? B < 1 ? 0 : B : 255) + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1)}`;
    }
  };
})(Drupal, drupalSettings);