!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginSettings = {
    attach: function(context) {
      $('input[name="enable_darkmode"]', context).change((function() {
        var darkmode = $(this).is(":checked"), accentColorPreset = $('[data-drupal-selector="edit-preset-accent-color"] input:checked').val(), focusColorPreset = $('select[name="preset_focus_color"]').val();
        if (Drupal.behaviors.ginSettings.darkmode(darkmode), "custom" === accentColorPreset) {
          var accentColorSetting = $('input[name="accent_color"]', context).val();
          Drupal.behaviors.ginAccent.setCustomAccentColor("custom", accentColorSetting);
        } else Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset);
      })), $('[data-drupal-selector="edit-preset-accent-color"] input', context).change((function() {
        var accentColorPreset = $(this).val();
        if (Drupal.behaviors.ginAccent.clearAccentColor(), Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset), 
        "custom" === accentColorPreset) {
          var accentColorSetting = $('input[name="accent_color"]').val();
          Drupal.behaviors.ginAccent.setCustomAccentColor("custom", accentColorSetting);
        }
      })), $('input[name="accent_color"]', context).change((function() {
        var accentColorSetting = $(this).val();
        Drupal.behaviors.ginAccent.setCustomAccentColor("custom", accentColorSetting);
      })), $('select[name="preset_focus_color"]', context).change((function() {
        var accentColorPreset = $(this).val();
        Drupal.behaviors.ginAccent.setFocusColor(accentColorPreset);
      })), $('input[name="focus_color"]', context).change((function() {
        var focusColorPreset = $('select[name="preset_focus_color"]').val(), focusColorSetting = $(this).val();
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset, focusColorSetting);
      })), $('input[name="high_contrast_mode"]', context).change((function() {
        var highContrastMode = $(this).is(":checked");
        Drupal.behaviors.ginSettings.setHighContrastMode(highContrastMode);
      })), $('input[name="enable_user_settings"]', context).change((function() {
        var active = $(this).is(":checked"), darkmode = $('input[name="enable_darkmode"]').is(":checked"), accentColorSetting = $('input[name="accent_color"]', context).val(), accentColorPreset = $('[data-drupal-selector="edit-preset-accent-color"] input:checked').val(), highContrastMode = $('input[name="high_contrast_mode"]').is(":checked");
        active || (darkmode = drupalSettings.gin.default_darkmode, accentColorSetting = drupalSettings.gin.default_accent_color, 
        accentColorPreset = drupalSettings.gin.default_preset_accent_color, highContrastMode = drupalSettings.gin.default_high_contrast_mode), 
        Drupal.behaviors.ginSettings.darkmode(darkmode), Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset, accentColorSetting), 
        Drupal.behaviors.ginSettings.setHighContrastMode(highContrastMode);
      })), $('[data-drupal-selector="edit-submit"]', context).click((function() {
        var accentColorPreset = $('[data-drupal-selector="edit-preset-accent-color"] input:checked').val(), accentColorSetting = $('input[name="accent_color"]', context).val();
        $(this).parents('[data-drupal-selector="user-form"]').length > 0 && ($('input[name="enable_user_settings"]', context).is(":checked") || (accentColorSetting = drupalSettings.gin.default_accent_color, 
        accentColorPreset = drupalSettings.gin.default_preset_accent_color)), "custom" === accentColorPreset ? localStorage.setItem("GinAccentColorCustom", accentColorSetting) : localStorage.setItem("GinAccentColorCustom", "");
      }));
    },
    darkmode: function() {
      var darkmodeParam = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, darkmodeEnabled = null != darkmodeParam ? darkmodeParam : drupalSettings.gin.darkmode, darkmodeClass = drupalSettings.gin.darkmode_class;
      !0 === darkmodeEnabled || 1 === darkmodeEnabled ? $("body").addClass(darkmodeClass) : $("body").removeClass(darkmodeClass);
    },
    setHighContrastMode: function() {
      var param = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, enabled = null != param ? param : drupalSettings.gin.highcontrastmode, className = drupalSettings.gin.highcontrastmode_class;
      !0 === enabled || 1 === enabled ? $("body").addClass(className) : $("body").removeClass(className);
    }
  };
}(jQuery, Drupal, drupalSettings);