/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.ginSidebarToggle = {
    attach: function attach(context) {
      // Set sidebarState.
      if (localStorage.getItem('GinMetaOpen') === 'true') {
        $('body').attr('data-meta-sidebar', 'open');
        $('.sidebar__trigger').addClass('is-active');
      }
      else {
        $('body').attr('data-meta-sidebar', '');
        $('.sidebar__trigger').removeClass('is-active');
      }

      // Toolbar toggle
      $('.sidebar__trigger', context).once('metaSidebarToggle').on('click', function (e) {
        e.preventDefault();

        // Toggle active class.
        $(this).toggleClass('is-active');

        // Set active state.
        if ($(this).hasClass('is-active')) {
          $('body').attr('data-meta-sidebar', 'open');
          localStorage.setItem('GinMetaOpen', 'true');
        }
        else {
          $('body').attr('data-meta-sidebar', '');
          localStorage.setItem('GinMetaOpen', 'false');
          $('.gin-toolbar-inline-styles').remove();
        }
      });

      // Change when clicked
      // $('#toolbar-bar .toolbar-item', context).on('click', function () {
      //   $('body').attr('data-toolbar-tray', $(this).data('toolbar-tray'));
      //
      //   // Sticky toolbar width
      //   $(document).ready(() => {
      //     $('.sticky-header').each(function () {
      //       $(this).width($('.sticky-table').width());
      //     });
      //   });
      // });
    }
  };
})(jQuery, Drupal);
