(function ($, Drupal) {
  Drupal.behaviors.ginAccent = {
    attach: function attach(context, settings) {
      var preset_accent_color = settings.gin.preset_accent_color,
          accent_color = settings.gin.accent_color,
          preset_focus_color = settings.gin.preset_focus_color,
          focus_color = settings.gin.focus_color,
          darkmode_enabled = settings.gin.darkmode;

      var accent_colors = {
        'dark_purple': '#35009d',
        'purple': '#a43bcb',
        'teal': '#267c91',
        'green': '#26a769',
        'red': '#a55254',
        'orange': '#e07f34',
        'pink': '#aa439d'
      };

      function shadeColor(color, percent) {
        var R = parseInt(color.substring(1,3),16),
            G = parseInt(color.substring(3,5),16),
            B = parseInt(color.substring(5,7),16);

        R = parseInt(R * (100 + percent) / 100);
        G = parseInt(G * (100 + percent) / 100);
        B = parseInt(B * (100 + percent) / 100);

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        var RR = ((R.toString(16).length==1) ? '0' + R.toString(16) : R.toString(16)),
            GG = ((G.toString(16).length==1) ? '0' + G.toString(16) : G.toString(16)),
            BB = ((B.toString(16).length==1) ? '0' + B.toString(16) : B.toString(16));

        return '#' + RR + GG + BB;
      }

      // Set accent color.
      function set_accent_color(enabled=true) {
        if (preset_accent_color !== 'blue') {
          var set_accent_color;

          if (preset_accent_color == 'custom') {
            set_accent_color = accent_color;
          } else {
            set_accent_color = accent_colors[preset_accent_color];
          }

          var stripped_accent_color = set_accent_color.replace('#', '');

          if (enabled) {
            $('body', context).append("<style class=\"gin-custom-colors\">\
            body {\n\
              --colorGinPrimary: " + set_accent_color + ";\n\
              --colorGinPrimaryHover: " + shadeColor(set_accent_color, -15) + ";\n\
              --colorGinPrimaryActive: " + shadeColor(set_accent_color, -30) + ";\n\
            }\n\
            .form-element--type-select:hover,\n\
            .form-element--type-select:active,\n\
            .form-element--type-select:focus {\n\
              background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'%3E%3Cpath fill='none' stroke-width='1.5' d='M1 1L7 7L13 1' stroke='%23" + stripped_accent_color + "'/%3E%3C/svg%3E%0A\");\n\
            }\n\
            </style>");
          } else {
            clear_accent_color();
          }
        } else {
          clear_accent_color();
        }
      }

      function clear_accent_color() {
        $('.gin-custom-colors', context).remove();
      }

      // Toggle focus color.
      function set_focus_color(enabled=true) {
        if (preset_focus_color !== 'gin') {
          var set_color;

          switch(preset_focus_color) {
            case 'claro':
              set_color = '#26a769';
              break;
            case 'accent':
              set_color = 'var(--colorGinPrimary)';
              break;
            case 'custom':
              set_color = focus_color;
              break;
          }

          if (enabled) {
            $('body', context).css('--colorGinFocus', set_color);
          } else {
            clear_focus_color();
          }
        } else {
          clear_focus_color();
        }
      }

      function clear_focus_color() {
        $('body', context).css('--colorGinFocus', '');
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
        set_accent_color();
        set_focus_color();
      }

      // Watch Darkmode setting has changed.
      $('input[name="enable_darkmode"]', context).change(function() {
        var darkmode_enabled = $(this).is(':checked'),
            toggle_accent_color = darkmode_enabled == 1 ? false : true;

        // Toggle darkmode
        darkmode(darkmode_enabled);

        // Toggle Accent color
        set_accent_color(toggle_accent_color);
        set_focus_color(toggle_accent_color);
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_accent_color"]', context).change(function() {
        preset_accent_color = $(this).val();

        // Update
        clear_accent_color();
        set_accent_color();
      });

      // Watch Accent color setting has changed.
      $('input[name="accent_color"]', context).change(function() {
        accent_color = $(this).val();

        // Update
        clear_accent_color();
        set_accent_color();
      });

      // Watch Accent color setting has changed.
      $('select[name="preset_focus_color"]', context).change(function() {
        preset_focus_color = $(this).val();

        // Update
        clear_focus_color();
        set_focus_color();
      });

      // Watch Accent color setting has changed.
      $('input[name="focus_color"]', context).change(function() {
        focus_color = $(this).val();

        // Update
        clear_focus_color();
        set_focus_color();
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
