(function ($, Drupal) {
  Drupal.behaviors.ginAccent = {
    attach: function attach(context, settings) {
      var accent_color = settings.gin.accent_color,
          darkmode_enabled = settings.gin.darkmode;

      function shadeColor(color, percent) {
        var R = parseInt(color.substring(1,3),16);
        var G = parseInt(color.substring(3,5),16);
        var B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R<255)?R:255;
        G = (G<255)?G:255;
        B = (B<255)?B:255;

        var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
        var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
        var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

        return "#"+RR+GG+BB;
      }

      // Toggle accent color.
      function set_accent_color(enable) {
        if (enable) {
          $('body', context).css('--colorGinPrimary', accent_color);
          $('body', context).css('--colorGinPrimaryHover', shadeColor(accent_color, -10));
          $('body', context).css('--colorGinPrimaryActive', shadeColor(accent_color, -20));
        } else {
          $('body', context).css('--colorGinPrimary', '');
          $('body', context).css('--colorGinPrimaryHover', '');
          $('body', context).css('--colorGinPrimaryActive', '');
        }
      }

      // Toggle darkmode.
      function darkmode(darkmode) {
        var darkmodeClass = 'gin--dark-mode';

        if (darkmode == true) {
          $('body', context).addClass(darkmodeClass);
        } else {
          $('body', context).removeClass(darkmodeClass);
        }
      }

      // Enable darkmode?
      darkmode(darkmode_enabled);

      // Only if darkmode is disabled
      if (darkmode_enabled !== 1) {
        // Set Accent color
        set_accent_color(true);
      }

      // Watch Darkmode Setting changed
      $('input[name="enable_darkmode"]', context).change(function() {
        var darkmode_enabled = $(this).is(':checked'),
            toggle_accent_color = darkmode_enabled == 1 ? false : true;

        // Toggle darkmode
        darkmode(darkmode_enabled);

        // Disable Accent color
        set_accent_color(toggle_accent_color);
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
