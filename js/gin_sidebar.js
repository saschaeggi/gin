/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.ginSidebarToggle = {
    attach: function attach(context) {
      // Set meta sidebar state.
      if (localStorage.getItem('GinMetaOpen') === 'true') {
        $('body').attr('data-meta-sidebar', 'open');
        $('.meta-sidebar__trigger').addClass('is-active');
      }
      else {
        $('body').attr('data-meta-sidebar', 'closed');
        $('.meta-sidebar__trigger').removeClass('is-active');
      }

      // Toolbar toggle
      $('.meta-sidebar__trigger', context).once('metaSidebarToggle').on('click', function (e) {
        e.preventDefault();

        // Toggle active class.
        $(this).toggleClass('is-active');
        // Remove init styles.
        $('.gin-meta-inline-styles').remove();

        // Set active state.
        if ($(this).hasClass('is-active')) {
          $('body').attr('data-meta-sidebar', 'open');
          localStorage.setItem('GinMetaOpen', 'true');
        }
        else {
          $('body').attr('data-meta-sidebar', 'closed');
          localStorage.setItem('GinMetaOpen', 'false');
        }
      });
    }
  };
})(jQuery, Drupal);
