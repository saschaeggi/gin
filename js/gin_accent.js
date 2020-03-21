(function ($, Drupal) {
  Drupal.behaviors.ginAccent = {
    attach: function attach(context, settings) {
      // Set Colors
      Drupal.behaviors.ginAccent.setAccentColor();
      Drupal.behaviors.ginAccent.setFocusColor();
    },

    darkmode: function darkmode(darkmode=null) {
      var darkmodeEnabled = darkmode != null ? darkmode : drupalSettings.gin.darkmode,
          darkmodeClass = drupalSettings.gin.darkmode_class;

      if (darkmodeEnabled == true) {
        $('body').addClass(darkmodeClass);
      } else {
        $('body').removeClass(darkmodeClass);
      }
    },

    colorDefinition: function colorDefinition(darkmode=null) {
      var darkmodeEnabled = darkmode != null ? darkmode : drupalSettings.gin.darkmode;

      if (darkmodeEnabled == 1) {
        var accentColors = {
          'dark_purple': '#976bef',
          'purple': '#d180ef',
          'teal': '#67d1ea',
          'green': '#6bd4a1',
          'red': '#ce6060',
          'orange': '#f99271',
          'pink': '#ff8ef1'
        };
      } else {
        var accentColors = {
          'dark_purple': '#35009d',
          'purple': '#a43bcb',
          'teal': '#267c91',
          'green': '#26a769',
          'red': '#a55254',
          'orange': '#e07f34',
          'pink': '#aa439d'
        };
      }

      return accentColors;
    },

    setAccentColor: function setAccentColor(preset=null, color=null) {
      var accentColorPreset = preset != null ? preset : drupalSettings.gin.preset_accent_color,
          accentColorSetting = color != null ? color : drupalSettings.gin.accent_color,
          darkmode = preset != null ? $('input[name="enable_darkmode"]').is(':checked') : drupalSettings.gin.darkmode,
          darkmodeClass = drupalSettings.gin.darkmode_class,
          accentColors = Drupal.behaviors.ginAccent.colorDefinition(darkmode);

      // First clear things up.
      Drupal.behaviors.ginAccent.clearAccentColor();

      if (accentColorPreset !== 'blue') {
        var setAccentColor;

        if (accentColorPreset == 'custom') {
          setAccentColor = accentColorSetting;
        } else {
          setAccentColor = accentColors[accentColorPreset];
        }

        var strippedAccentColor = setAccentColor.replace('#', ''),
            body = darkmode ? '.' + darkmodeClass : 'body';

        $('body').append("<style class=\"gin-custom-colors\">\
        " + body + " {\n\
          --colorGinPrimary: " + setAccentColor + ";\n\
          --colorGinPrimaryHover: " + Drupal.behaviors.ginAccent.shadeColor(setAccentColor, -15) + ";\n\
          --colorGinPrimaryActive: " + Drupal.behaviors.ginAccent.shadeColor(setAccentColor, -30) + ";\n\
        }\n\
        .form-element--type-select:hover,\n\
        .form-element--type-select:active,\n\
        .form-element--type-select:focus {\n\
          background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'%3E%3Cpath fill='none' stroke-width='1.5' d='M1 1L7 7L13 1' stroke='%23" + strippedAccentColor + "'/%3E%3C/svg%3E%0A\");\n\
        }\n\
        </style>");
      }
    },

    clearAccentColor: function clearAccentColor() {
      $('.gin-custom-colors').remove();
    },

    setFocusColor: function setFocusColor(preset=null, color=null) {
      var focusColorPreset = preset != null ? preset : drupalSettings.gin.preset_focus_color,
          focusColorSetting = color != null ? color : drupalSettings.gin.focus_color;

      // First clear things up.
      Drupal.behaviors.ginAccent.clearFocusColor();

      if (focusColorPreset !== 'gin') {
        var setColor;

        switch(focusColorPreset) {
          case 'claro':
            setColor = '#26a769';
            break;
          case 'accent':
            setColor = 'var(--colorGinPrimary)';
            break;
          case 'custom':
            setColor = focusColorSetting;
            break;
        }

        $('body').css('--colorGinFocus', setColor);
      }
    },

    clearFocusColor: function clearFocusColor() {
      $('body').css('--colorGinFocus', '');
    },

    shadeColor: function shadeColor(color, percent) {
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
  };
})(jQuery, Drupal, drupalSettings);
