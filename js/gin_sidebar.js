/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.ginSidebarToggle = {
    attach: function attach(context) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 3053e8f (js toggle)
        e.preventDefault();

        // Toggle active class.
        $(this).toggleClass('is-active');
<<<<<<< HEAD
        // Remove init styles.
        $('.gin-meta-inline-styles').remove();
=======
>>>>>>> 3053e8f (js toggle)

        // Set active state.
        if ($(this).hasClass('is-active')) {
          $('body').attr('data-meta-sidebar', 'open');
          localStorage.setItem('GinMetaOpen', 'true');
        }
        else {
<<<<<<< HEAD
          $('body').attr('data-meta-sidebar', 'closed');
          localStorage.setItem('GinMetaOpen', 'false');
        }
      });
=======
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
>>>>>>> 3053e8f (js toggle)
    }
  };
})(jQuery, Drupal);
