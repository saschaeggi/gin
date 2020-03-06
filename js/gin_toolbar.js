(function ($, Drupal) {
  Drupal.behaviors.ginToolbarChange = {
    attach: function attach(context, settings) {
      // Check if on node edit form
      if ($('body', context).hasClass('path-node')) {
        $('.toolbar-icon-system-admin-content').addClass('is-active');
      }

      // Change when clicked
      $('#toolbar-bar .toolbar-item', context).on('click', function() {
        $('body').attr('data-toolbar-tray', $(this).data('toolbar-tray'));

        // Sticky toolbar width
        $(document).ready(function() {
          $('.sticky-header').each(function() {
            $(this).width($('.sticky-table').width());
          });
        });
      });

      // Toolbar toggle
      $('.toolbar-menu__trigger', context).on('click', function() {
        $(this).toggleClass('is-active');

        if ($(this).hasClass('is-active')) {
          $('body').attr('data-toolbar-menu', 'open');
        } else {
          $('body').attr('data-toolbar-menu', '');
        }
      });
    }
  };
})(jQuery, Drupal);
