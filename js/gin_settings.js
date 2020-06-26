/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginSettings = {
    attach: function attach(context) {
      // Watch Darkmode setting has changed.
      $('input[name="enable_darkmode"]', context).change(function () {
        const darkmode = $(this).is(':checked');
        const accentColorPreset = $('select[name="preset_accent_color"]').val();
        const focusColorPreset = $('select[name="preset_focus_color"]').val();

        // Toggle Darkmode.
        Drupal.behaviors.ginAccent.darkmode(darkmode);

        // Toggle Accent color.
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_accent_color"]', context).change(function () {
        const accentColorPreset = $(this).val();

        // Update.
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
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
        Drupal.behaviors.ginAccent.setHighContrastMode(highContrastMode);
      });

      // Watch user settings has changed.
      $('input[name="enable_user_settings"]', context).change(function () {
        const active = $(this).is(':checked');

        let darkmode = $('input[name="enable_darkmode"]').is(':checked');
        let accentColorPreset = $('select[name="preset_accent_color"]').val();
        let focusColorPreset = $('select[name="preset_focus_color"]').val();
        let highContrastMode = $('input[name="high_contrast_mode"]').is(':checked');

        // User setting disabled, use default settings instead.
        if (!active) {
          darkmode = drupalSettings.gin.default_darkmode;
          accentColorPreset = drupalSettings.gin.default_preset_accent_color;
          highContrastMode = drupalSettings.gin.default_high_contrast_mode;
        }

        // Update.
        Drupal.behaviors.ginAccent.darkmode(darkmode);
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
        Drupal.behaviors.ginAccent.setHighContrastMode(highContrastMode);
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
