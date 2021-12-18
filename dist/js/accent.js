(() => {
  function _slicedToArray(arr, i) {
    return function(arr) {
      if (Array.isArray(arr)) return arr;
    }(arr) || function(arr, i) {
      var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
      if (null == _i) return;
      var _s, _e, _arr = [], _n = !0, _d = !1;
      try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), !i || _arr.length !== i); _n = !0) ;
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          _n || null == _i.return || _i.return();
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }(arr, i) || function(o, minLen) {
      if (!o) return;
      if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      "Object" === n && o.constructor && (n = o.constructor.name);
      if ("Map" === n || "Set" === n) return Array.from(o);
      if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }(arr, i) || function() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }();
  }
  function _arrayLikeToArray(arr, len) {
    (null == len || len > arr.length) && (len = arr.length);
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  !function($, Drupal, drupalSettings) {
    Drupal.behaviors.ginSticky = {
      attach: function() {
        if (document.querySelectorAll(".region-sticky").length > 0) {
          var observer = new IntersectionObserver((function(_ref) {
            var e = _slicedToArray(_ref, 1)[0];
            return document.querySelector(".region-sticky").classList.toggle("region-sticky--is-sticky", e.intersectionRatio < 1);
          }), {
            threshold: [ 1 ]
          });
          document.querySelectorAll(".region-sticky-watcher").length > 0 && observer.observe(document.querySelector(".region-sticky-watcher"));
        }
      }
    }, Drupal.behaviors.ginAccent = {
      attach: function() {
        var path = drupalSettings.path.currentPath;
        if (Drupal.behaviors.ginAccent.checkDarkmode(), Drupal.behaviors.ginAccent.setFocusColor(), 
        -1 !== path.indexOf("user/login") || -1 !== path.indexOf("user/password") || -1 !== path.indexOf("user/register") || localStorage.getItem("Drupal.gin.customAccentColor")) Drupal.behaviors.ginAccent.setAccentColor(); else if (Drupal.behaviors.ginAccent.setAccentColor(), 
        "custom" === drupalSettings.gin.preset_accent_color) {
          var accentColorSetting = drupalSettings.gin.accent_color;
          localStorage.setItem("Drupal.gin.customAccentColor", accentColorSetting);
        } else localStorage.setItem("Drupal.gin.customAccentColor", "");
      },
      setAccentColor: function() {
        var preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, accentColorPreset = null != preset ? preset : drupalSettings.gin.preset_accent_color;
        "custom" === accentColorPreset ? ($("body").attr("data-gin-accent", preset), Drupal.behaviors.ginAccent.setCustomAccentColor("custom", color)) : $("body").attr("data-gin-accent", accentColorPreset);
      },
      setCustomAccentColor: function() {
        var preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, accentColorSetting = null != color ? color : drupalSettings.gin.accent_color;
        if ("custom" === preset) {
          $("body").attr("data-gin-accent", preset);
          var accentColor = accentColorSetting;
          if (accentColor) {
            Drupal.behaviors.ginAccent.clearAccentColor();
            var strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 65).replace("#", ""), styles = '<style class="gin-custom-colors">            [data-gin-accent="custom"] {\n              --colorGinPrimaryRGB: '.concat(Drupal.behaviors.ginAccent.hexToRgb(accentColor), ";\n              --colorGinPrimaryHover: ").concat(Drupal.behaviors.ginAccent.shadeColor(accentColor, -10), ";\n              --colorGinPrimaryActive: ").concat(Drupal.behaviors.ginAccent.shadeColor(accentColor, -15), ";\n              --colorGinAppBackgroundRGB: ").concat(Drupal.behaviors.ginAccent.hexToRgb(Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 97)), ";\n              --colorGinTableHeader: ").concat(Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 85), ';\n            }\n            .gin--dark-mode[data-gin-accent="custom"],\n            .gin--dark-mode [data-gin-accent="custom"] {\n              --colorGinPrimaryRGB: ').concat(Drupal.behaviors.ginAccent.hexToRgb(darkAccentColor), ";\n              --colorGinPrimaryHover: ").concat(Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 55), ";\n              --colorGinPrimaryActive: ").concat(Drupal.behaviors.ginAccent.mixColor("ffffff", strippedAccentColor, 50), ";\n              --colorGinTableHeader: ").concat(Drupal.behaviors.ginAccent.mixColor("2A2A2D", darkAccentColor, 88), ";\n            }\n            </style>");
            $("body").append(styles);
          }
        } else Drupal.behaviors.ginAccent.clearAccentColor();
      },
      clearAccentColor: function() {
        $(".gin-custom-colors").remove();
      },
      hexToRgb: function(hex) {
        hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(m, r, g, b) {
          return r + r + g + g + b + b;
        }));
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? "".concat(parseInt(result[1], 16), ", ").concat(parseInt(result[2], 16), ", ").concat(parseInt(result[3], 16)) : null;
      },
      setFocusColor: function() {
        var preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null, focusColorPreset = null != preset ? preset : drupalSettings.gin.preset_focus_color, focusColorSetting = null != color ? color : drupalSettings.gin.focus_color;
        Drupal.behaviors.ginAccent.clearFocusColor(), $("body").attr("data-gin-focus", focusColorPreset), 
        "custom" === focusColorSetting && $("body").css("--colorGinFocus", focusColorSetting);
      },
      clearFocusColor: function() {
        $("body").css("--colorGinFocus", "");
      },
      checkDarkmode: function() {
        var darkmodeClass = drupalSettings.gin.darkmode_class;
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (function(e) {
          e.matches && "auto" === localStorage.getItem("Drupal.gin.darkmode") && $("html").addClass(darkmodeClass);
        })), window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (function(e) {
          e.matches && "auto" === localStorage.getItem("Drupal.gin.darkmode") && $("html").removeClass(darkmodeClass);
        }));
      },
      mixColor: function(color_1, color_2, weight) {
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
      shadeColor: function(color, percent) {
        var num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 255) + amt, G = (255 & num) + amt;
        return "#".concat((16777216 + 65536 * (R < 255 ? R < 1 ? 0 : R : 255) + 256 * (B < 255 ? B < 1 ? 0 : B : 255) + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1));
      }
    };
  }(jQuery, Drupal, drupalSettings);
})();