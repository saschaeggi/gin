/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.ginSettings = {
    attach: function attach(context) {
      // Watch Darkmode setting has changed.
      $('input[name="enable_darkmode"]', context).change(function () {
        const darkmode = $(this).is(':checked');
        const accentColorPreset = $('select[name="preset_accent_color"]').val();
        const focusColorPreset = $('select[name="preset_focus_color"]').val();

        // Toggle Darkmode
        Drupal.behaviors.ginAccent.darkmode(darkmode);

        // Toggle Accent color
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_accent_color"]', context).change(function () {
        const accentColorPreset = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
      });

      // Watch Accent color setting has changed.
      $('input[name="accent_color"]', context).change(function () {
        const accentColorPreset = $('select[name="preset_accent_color"]').val();
        const accentColorSetting = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset, accentColorSetting);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_focus_color"]', context).change(function () {
        const accentColorPreset = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setFocusColor(accentColorPreset);
      });

      // Watch Accent color setting has changed.
      $('input[name="focus_color"]', context).change(function () {
        const focusColorPreset = $('select[name="preset_focus_color"]').val();
        const focusColorSetting = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset, focusColorSetting);
      });
    }
  };
})(jQuery, Drupal);
