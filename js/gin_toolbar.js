/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginToolbarToggle = {
    attach: function attach(context) {
      // Set sidebarState.
      if (localStorage.getItem('GinSidebarOpen') === 'true') {
        $('body').attr('data-toolbar-menu', 'open');
        $('.toolbar-menu__trigger').addClass('is-active');
      }
      else {
        $('body').attr('data-toolbar-menu', '');
        $('.toolbar-menu__trigger').removeClass('is-active');
      }

      // Toolbar toggle
      $('.toolbar-menu__trigger', context).on('click', function (e) {
        e.preventDefault();

        // Toggle active class.
        $(this).toggleClass('is-active');

        // Set active state.
        let active = 'true';
        if ($(this).hasClass('is-active')) {
          $('body').attr('data-toolbar-menu', 'open');
        }
        else {
          $('body').attr('data-toolbar-menu', '');
          active = 'false';
          $('.gin-toolbar-inline-styles').remove();
        }

        // Write state to localStorage.
        localStorage.setItem('GinSidebarOpen', active);

        // Dispatch event.
        const event = new CustomEvent('toolbar-toggle', { detail: active === 'true'})
        document.dispatchEvent(event);
      });

      // Change when clicked
      $('#toolbar-bar .toolbar-item', context).on('click', function () {
        $('body').attr('data-toolbar-tray', $(this).data('toolbar-tray'));

        // Sticky toolbar width
        $(document).ready(() => {
          $('.sticky-header').each(function () {
            $(this).width($('.sticky-table').width());
          });
        });
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
