!function(e){function t(o){if(n[o])return n[o].exports;var c=n[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,t),c.l=!0,c.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var c in e)t.d(o,c,function(t){return e[t]}.bind(null,c));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=53)}({53:function(e,t,n){e.exports=n(54)},54:function(){"use strict";var e,t,n;e=jQuery,t=Drupal,n=drupalSettings,t.behaviors.ginSettings={attach:function(o){e('input[name="enable_darkmode"]',o).change((function(){var n=e(this).is(":checked"),c=e('select[name="preset_accent_color"]').val(),r=e('select[name="preset_focus_color"]').val();if(t.behaviors.ginSettings.darkmode(n),"custom"===c){var a=e('input[name="accent_color"]',o).val();t.behaviors.ginAccent.setCustomAccentColor("custom",a)}else t.behaviors.ginAccent.setAccentColor(c);t.behaviors.ginAccent.setFocusColor(r)})),e('select[name="preset_accent_color"]',o).change((function(){var n=e(this).val();if(t.behaviors.ginAccent.clearAccentColor(),t.behaviors.ginAccent.setAccentColor(n),"custom"===n){var o=e('input[name="accent_color"]').val();t.behaviors.ginAccent.setCustomAccentColor("custom",o)}})),e('input[name="accent_color"]',o).change((function(){var n=e(this).val();t.behaviors.ginAccent.setCustomAccentColor("custom",n)})),e('select[name="preset_focus_color"]',o).change((function(){var n=e(this).val();t.behaviors.ginAccent.setFocusColor(n)})),e('input[name="focus_color"]',o).change((function(){var n=e('select[name="preset_focus_color"]').val(),o=e(this).val();t.behaviors.ginAccent.setFocusColor(n,o)})),e('input[name="high_contrast_mode"]',o).change((function(){var n=e(this).is(":checked");t.behaviors.ginSettings.setHighContrastMode(n)})),e('input[name="enable_user_settings"]',o).change((function(){var c=e(this).is(":checked"),r=e('input[name="enable_darkmode"]').is(":checked"),a=e('input[name="accent_color"]',o).val(),i=e('select[name="preset_accent_color"]').val(),s=e('input[name="high_contrast_mode"]').is(":checked");c||(r=n.gin.default_darkmode,a=n.gin.default_accent_color,i=n.gin.default_preset_accent_color,s=n.gin.default_high_contrast_mode),t.behaviors.ginSettings.darkmode(r),t.behaviors.ginAccent.setAccentColor(i,a),t.behaviors.ginSettings.setHighContrastMode(s)})),e('[data-drupal-selector="edit-submit"]',o).click((function(){var t=e('select[name="preset_accent_color"]').val(),c=e('input[name="accent_color"]',o).val();0<e(this).parents('[data-drupal-selector="user-form"]').length&&(e('input[name="enable_user_settings"]',o).is(":checked")||(c=n.gin.default_accent_color,t=n.gin.default_preset_accent_color)),"custom"===t?localStorage.setItem("GinAccentColorCustom",c):localStorage.setItem("GinAccentColorCustom","")}))},darkmode:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,o=null==t?n.gin.darkmode:t,c=n.gin.darkmode_class;!0===o||1===o?e("body").addClass(c):e("body").removeClass(c)},setHighContrastMode:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,o=null==t?n.gin.highcontrastmode:t,c=n.gin.highcontrastmode_class;!0===o||1===o?e("body").addClass(c):e("body").removeClass(c)}}}});