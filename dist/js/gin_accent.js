!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginAccent = {
    attach: function() {
      var path = drupalSettings.path.currentPath;
      if (Drupal.behaviors.ginAccent.setFocusColor(), -1 !== path.indexOf("user/login") || -1 !== path.indexOf("user/password") || -1 !== path.indexOf("user/register") || localStorage.getItem("GinAccentColorCustom")) Drupal.behaviors.ginAccent.setAccentColor(); else if (Drupal.behaviors.ginAccent.setAccentColor(), 
      "custom" === drupalSettings.gin.preset_accent_color) {
        var accentColorSetting = drupalSettings.gin.accent_color;
        localStorage.setItem("GinAccentColorCustom", accentColorSetting);
      } else localStorage.setItem("GinAccentColorCustom", "");
    },
    setAccentColor: function() {
      var preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, accentColorPreset = null != preset ? preset : drupalSettings.gin.preset_accent_color;
      "custom" === accentColorPreset ? ($("body").attr("data-gin-accent", preset), Drupal.behaviors.ginAccent.setCustomAccentColor("custom", color)) : $("body").attr("data-gin-accent", accentColorPreset);
    },
    setCustomAccentColor: function() {
      var preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, accentColorSetting = null != color ? color : drupalSettings.gin.accent_color;
      if ("custom" === preset) {
        $("body").attr("data-gin-accent", preset);
        var darkmode = null != preset ? $('input[name="enable_darkmode"]').is(":checked") : drupalSettings.gin.darkmode, ratio = (drupalSettings.gin.darkmode_class, 
        darkmode ? 10 : 6.5), accentColor = accentColorSetting;
        if (accentColor) {
          Drupal.behaviors.ginAccent.clearAccentColor();
          var strippedAccentColor = accentColor.replace("#", ""), styles = '<style class="gin-custom-colors">            body:not(.gin-inactive) {\n              --colorGinPrimary: '.concat(accentColor, ";\n              --colorGinPrimaryHover: ").concat(Drupal.behaviors.ginAccent.shadeColor(accentColor, -10), ";\n              --colorGinPrimaryActive: ").concat(Drupal.behaviors.ginAccent.shadeColor(accentColor, -15), ";\n              --colorGinPrimaryLight: ").concat(accentColor).concat(Math.round(3.5 * ratio), ";\n              --colorGinPrimaryLightHover: ").concat(accentColor).concat(Math.round(4.5 * ratio), ";\n              --colorGinPrimaryLightActive: ").concat(accentColor).concat(Math.round(5.5 * ratio), ";\n              --colorGinPrimaryLightShadow: ").concat(accentColor).concat(Math.round(10 * ratio), ";\n              --colorGinItemHover: ").concat(accentColor).concat(Math.round(1.5 * ratio), ";\n            }\n            .form-element--type-select:hover,\n            .form-element--type-select:active,\n            .form-element--type-select:focus {\n              background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'%3E%3Cpath fill='none' stroke-width='1.5' d='M1 1L7 7L13 1' stroke='%23").concat(strippedAccentColor, "'/%3E%3C/svg%3E%0A\");\n            }\n            </style>");
          $("body").append(styles);
        }
      }
    },
    clearAccentColor: function() {
      $(".gin-custom-colors").remove();
    },
    shadeColor: function(color, percent) {
      var num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 255) + amt, G = (255 & num) + amt;
      return "#".concat((16777216 + 65536 * (R < 255 ? R < 1 ? 0 : R : 255) + 256 * (B < 255 ? B < 1 ? 0 : B : 255) + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1));
    },
    setFocusColor: function() {
      var preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, focusColorPreset = null != preset ? preset : drupalSettings.gin.preset_focus_color, focusColorSetting = null != color ? color : drupalSettings.gin.focus_color;
      if (Drupal.behaviors.ginAccent.clearFocusColor(), "gin" !== focusColorPreset) {
        var setColor;
        switch (focusColorPreset) {
         default:
         case "claro":
          setColor = "#26a769";
          break;

         case "green":
          setColor = "#08a390";
          break;

         case "orange":
          setColor = "#ec7c57";
          break;

         case "dark":
          setColor = "#5c5a67";
          break;

         case "accent":
          setColor = "var(--colorGinPrimary)";
          break;

         case "custom":
          setColor = focusColorSetting;
        }
        $("body").css("--colorGinFocus", setColor);
      }
    },
    clearFocusColor: function() {
      $("body").css("--colorGinFocus", "");
    }
  };
}(jQuery, Drupal, drupalSettings);