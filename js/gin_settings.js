(function ($, Drupal) {
  Drupal.behaviors.ginSettings = {
    attach: function (context, settings) {
      // Watch Darkmode setting has changed.
      $('input[name="enable_darkmode"]', context).change(function() {
        var darkmode = $(this).is(':checked'),
            accentColorPreset = $('select[name="preset_accent_color"]').val(),
            focusColorPreset = $('select[name="preset_focus_color"]').val();

        // Toggle Darkmode
        Drupal.behaviors.ginAccent.darkmode(darkmode);

        // Toggle Accent color
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_accent_color"]', context).change(function() {
        var accentColorPreset = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset);
      });

      // Watch Accent color setting has changed.
      $('input[name="accent_color"]', context).change(function() {
        var accentColorPreset = $('select[name="preset_accent_color"]').val(),
            accentColorSetting = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setAccentColor(accentColorPreset, accentColorSetting);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_focus_color"]', context).change(function() {
        var accentColorPreset = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setFocusColor(accentColorPreset);
      });

      // Watch Accent color setting has changed.
      $('input[name="focus_color"]', context).change(function() {
        var focusColorPreset = $('select[name="preset_focus_color"]').val(),
            focusColorSetting = $(this).val();

        // Update
        Drupal.behaviors.ginAccent.setFocusColor(focusColorPreset, focusColorSetting);
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
