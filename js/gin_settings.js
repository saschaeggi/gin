/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginSettings = {
    attach: function attach(context) {
      // Watch Darkmode setting has changed.
      $('input[name="enable_darkmode"]', context).change(function () {
        const darkmode = $(this).is(':checked');
        const accentColorPreset = $('[data-drupal-selector="edit-preset-accent-color"] input:checked').val();
        const focusColorPreset = $('select[name="preset_focus_color"]').val();

        // Toggle Darkmode.
        Drupal.behaviors.ginSettings.darkmode(darkmode);

        // Set custom color if 'custom' is set.
        if (accentColorPreset === 'custom') {
          const accentColorSetting = $('input[name="accent_color"]', context).val();

          Drupal.behaviors.ginAccent.setCustomAccentColor('custom', accentColorSetting);
        } else {
          Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
        }

        // Toggle Focus color.
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset);
      });

      // Watch Accent color setting has changed.
      $('[data-drupal-selector="edit-preset-accent-color"] input', context).change(function () {
        const accentColorPreset = $(this).val();

        // Update.
        Drupal.behaviors.ginAccent.clearAccentColor();
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);

        // Set custom color if 'custom' is set.
        if (accentColorPreset === 'custom') {
          const accentColorSetting = $('input[name="accent_color"]').val();

          Drupal.behaviors.ginAccent.setCustomAccentColor('custom', accentColorSetting);
        }
      });

      // Watch Accent color setting has changed.
      $('input[name="accent_color"]', context).change(function () {
        const accentColorSetting = $(this).val();

        // Update.
        Drupal.behaviors.ginAccent.setCustomAccentColor('custom', accentColorSetting);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_focus_color"]', context).change(function () {
        const accentColorPreset = $(this).val();

        // Update.
        Drupal.behaviors.ginAccent.setFocusColor(accentColorPreset);
      });

      // Watch Accent color setting has changed.
      $('input[name="focus_color"]', context).change(function () {
        const focusColorPreset = $('select[name="preset_focus_color"]').val();
        const focusColorSetting = $(this).val();

        // Update.
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset, focusColorSetting);
      });

      // Watch Hight contrast mode setting has changed.
      $('input[name="high_contrast_mode"]', context).change(function () {
        const highContrastMode = $(this).is(':checked');

        // Update.
        Drupal.behaviors.ginSettings.setHighContrastMode(highContrastMode);
      });

      // Watch user settings has changed.
      $('input[name="enable_user_settings"]', context).change(function () {
        const active = $(this).is(':checked');

        let darkmode = $('input[name="enable_darkmode"]').is(':checked');
        let accentColorSetting = $('input[name="accent_color"]', context).val();
        let accentColorPreset = $('[data-drupal-selector="edit-preset-accent-color"] input:checked').val();
        let highContrastMode = $('input[name="high_contrast_mode"]').is(':checked');

        // User setting disabled, use default settings instead.
        if (!active) {
          darkmode = drupalSettings.gin.default_darkmode;
          accentColorSetting = drupalSettings.gin.default_accent_color;
          accentColorPreset = drupalSettings.gin.default_preset_accent_color;
          highContrastMode = drupalSettings.gin.default_high_contrast_mode;
        }

        // Update.
        Drupal.behaviors.ginSettings.darkmode(darkmode);
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset, accentColorSetting);
        Drupal.behaviors.ginSettings.setHighContrastMode(highContrastMode);
      });

      // Watch save
      $('[data-drupal-selector="edit-submit"]', context).click(function() {
        let accentColorPreset = $('[data-drupal-selector="edit-preset-accent-color"] input:checked').val();
        let accentColorSetting = $('input[name="accent_color"]', context).val();

        // If on user form, check if we enable or disable the overrides.
        if ($(this).parents('[data-drupal-selector="user-form"]').length > 0) {
          const userSettings = $('input[name="enable_user_settings"]', context).is(':checked');

          if (!userSettings) {
            accentColorSetting = drupalSettings.gin.default_accent_color;
            accentColorPreset = drupalSettings.gin.default_preset_accent_color;
          }
        }

        // Set custom color if 'custom' is set.
        if (accentColorPreset === 'custom') {
          localStorage.setItem('GinAccentColorCustom', accentColorSetting);
        } else {
          localStorage.setItem('GinAccentColorCustom', '');
        }
      });
    },

    darkmode: function darkmode(darkmodeParam = null) {
      const darkmodeEnabled = darkmodeParam != null ? darkmodeParam : drupalSettings.gin.darkmode;
      const darkmodeClass = drupalSettings.gin.darkmode_class;

      // Needs to check for both: backwards compatibility.
      if (darkmodeEnabled === true || darkmodeEnabled === 1) {
        $('body').addClass(darkmodeClass);
      }
      else {
        $('body').removeClass(darkmodeClass);
      }
    },

    setHighContrastMode: function setHighContrastMode(param = null) {
      const enabled = param != null ? param : drupalSettings.gin.highcontrastmode;
      const className = drupalSettings.gin.highcontrastmode_class;

      // Needs to check for both: backwards compatibility.
      if (enabled === true || enabled === 1) {
        $('body').addClass(className);
      }
      else {
        $('body').removeClass(className);
      }
    },
  };
})(jQuery, Drupal, drupalSettings);
