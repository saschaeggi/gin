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
        // Darkmode colors.
        var accentColors = {
          'dark_purple': '#976bef',
          'purple': '#dba5ef',
          'teal': '#85d4e6',
          'green': '#6bd4a1',
          'red': '#ca6d6d',
          'orange': '#f79576',
          'yellow': '#f1c970',
          'pink': '#e79da3'
        };
      } else {
        // Light theme colors.
        var accentColors = {
          'dark_purple': '#35009d',
          'purple': '#a43bcb',
          'teal': '#267c91',
          'green': '#26a769',
          'red': '#a55254',
          'orange': '#e07f34',
          'yellow': '#d69400',
          'pink': '#c5636b'
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
          --colorGinPrimaryHover: " + Drupal.behaviors.ginAccent.shadeColor(setAccentColor, -10) + ";\n\
          --colorGinPrimaryActive: " + Drupal.behaviors.ginAccent.shadeColor(setAccentColor, -15) + ";\n\
          --colorGinPrimaryLight: " + setAccentColor + "35;\n\
          --colorGinPrimaryLightHover: " + setAccentColor + "45;\n\
          --colorGinPrimaryLightActive: " + setAccentColor + "55;\n\
          --colorGinItemHover: " + setAccentColor + "15;\n\
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
      var num = parseInt(color.replace("#",""),16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          B = (num >> 8 & 0x00FF) + amt,
          G = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
    }
  };
})(jQuery, Drupal, drupalSettings);
