!function() {
  function _slicedToArray(arr, i) {
    return function(arr) {
      if (Array.isArray(arr)) return arr;
    }(arr) || function(arr, i) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(arr)) {
        var _arr = [], _n = !0, _d = !1, _e = void 0;
        try {
          for (var _s, _i = arr[Symbol.iterator](); !(_n = (_s = _i.next()).done) && (_arr.push(_s.value), 
          !i || _arr.length !== i); _n = !0) ;
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
      }
    }(arr, i) || function(o, minLen) {
      if (o) {
        if ("string" == typeof o) return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        return "Object" === n && o.constructor && (n = o.constructor.name), "Map" === n || "Set" === n ? Array.from(o) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? _arrayLikeToArray(o, minLen) : void 0;
      }
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
    Drupal.behaviors.ginCKEditorContextMenu = {
      attach: function(context) {
        if ("undefined" != typeof CKEDITOR) {
          if (drupalSettings.path.currentPath.indexOf("admin/config/content/formats/manage") > -1) return;
          var accentCss = drupalSettings.gin.accent_css_path, contentsCss = drupalSettings.gin.ckeditor_css_path, accentColorPreset = drupalSettings.gin.preset_accent_color, ginClasses = new Array;
          drupalSettings.gin.darkmode && (ginClasses.push(drupalSettings.gin.darkmode_class), 
          CKEDITOR.config.bodyClass = drupalSettings.gin.darkmode_class), drupalSettings.gin.highcontrastmode && (ginClasses.push(drupalSettings.gin.highcontrastmode_class), 
          CKEDITOR.config.bodyClass = drupalSettings.gin.highcontrastmode_class), void 0 === CKEDITOR.config.contentsCss && (CKEDITOR.config.contentsCss.push(accentCss), 
          CKEDITOR.config.contentsCss.push(contentsCss)), void 0 === CKEDITOR.config.contextmenu_contentsCss && (CKEDITOR.config.contextmenu_contentsCss = new Array, 
          CKEDITOR.config.contextmenu_contentsCss.push(CKEDITOR.skin.getPath("editor")), CKEDITOR.config.contextmenu_contentsCss.push(accentCss), 
          CKEDITOR.config.contextmenu_contentsCss.push(contentsCss)), $(CKEDITOR.instances, context).once("gin_ckeditor").each((function(index, value) {
            CKEDITOR.on("instanceReady", (function() {
              Object.entries(value).forEach((function(_ref) {
                var _ref2 = _slicedToArray(_ref, 2), editor = (_ref2[0], _ref2[1]);
                $(editor.document.$).find("body").attr("data-gin-accent", accentColorPreset), editor.on("mode", (function() {
                  "wysiwyg" == this.mode && $(editor.document.$).find("body").attr("data-gin-accent", accentColorPreset);
                })), editor.on("menuShow", (function() {
                  $("body > .cke_menu_panel > iframe").contents().find("body").addClass(ginClasses).attr("data-gin-accent", accentColorPreset);
                }));
              }));
            }));
          }));
        }
      }
    };
  }(jQuery, Drupal, drupalSettings);
}();