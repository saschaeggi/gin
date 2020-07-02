/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginToolbarActiveItem = {
    attach: function attach() {
      const path = drupalSettings.path.currentPath;

      // Check if on node edit form
      if (
        path.indexOf('admin/content') > -1 ||
        path.indexOf('/edit') > -1
      ) {
        $('.toolbar-icon-system-admin-content').addClass('is-active');
      }
      // If Structure
      else if (path.indexOf('admin/structure') > -1) {
        $('.toolbar-icon-system-admin-structure').addClass('is-active');
      }
      // If Appearance
      else if (
        path.indexOf('admin/appearance') > -1 ||
        path.indexOf('admin/theme') > -1
      ) {
        $('.toolbar-icon-system-themes-page').addClass('is-active');
      }
      // If Modules
      else if (path.indexOf('admin/modules') > -1) {
        $('.toolbar-icon-system-modules-list').addClass('is-active');
      }
      // If Configuration
      else if (path.indexOf('admin/config') > -1) {
        $('.toolbar-icon-system-admin-config').addClass('is-active');
      }
      // If People
      else if (path.indexOf('admin/people') > -1) {
        $('.toolbar-icon-entity-user-collection').addClass('is-active');
      }
      // If Reports
      else if (path.indexOf('admin/reports') > -1) {
        $('.toolbar-icon-system-admin-reports').addClass('is-active');
      }
      // If Help
      else if (path.indexOf('admin/help') > -1) {
        $('.toolbar-icon-help-main').addClass('is-active');
      }

      // If Commerce
      else if (path.indexOf('admin/commerce') > -1) {
        $('.toolbar-icon-commerce-admin-commerce').addClass('is-active');
      }
    }
  };

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
        if ($(this).hasClass('is-active')) {
          $('body').attr('data-toolbar-menu', 'open');
          localStorage.setItem('GinSidebarOpen', 'true');
        }
        else {
          $('body').attr('data-toolbar-menu', '');
          localStorage.setItem('GinSidebarOpen', 'false');
          $('.gin-toolbar-inline-styles').remove();
        }
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
