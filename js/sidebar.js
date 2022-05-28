/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.ginSidebar = {
    attach: function attach(context) {
      // Set meta sidebar state.
      if (localStorage.getItem('Drupal.gin.sidebarExpanded') === 'true') {
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
        Drupal.behaviors.ginSidebar.toggleSidebar($(this));
      });

      // Toolbar close
      $('.meta-sidebar__close, .meta-sidebar__overlay', context).once('metaSidebarClose').on('click', function (e) {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.collapseSidebar();
      });

      $(window)
        .on('resize', Drupal.debounce(Drupal.behaviors.ginSidebar.collapseSidebarMobile, 150))
        .trigger('resize');
    },
    toggleSidebar: function toggleSidebar(element) {
      // Remove init styles.
      Drupal.behaviors.ginSidebar.removeInlineStyles();

      // Set active state.
      if (element.hasClass('is-active')) {
        element.removeClass('is-active');
        $('body').attr('data-meta-sidebar', 'closed');
        localStorage.setItem('Drupal.gin.sidebarExpanded', 'false');
      }
      else {
        element.addClass('is-active');
        $('body').attr('data-meta-sidebar', 'open');
        localStorage.setItem('Drupal.gin.sidebarExpanded', 'true');
      }
    },
    collapseSidebarMobile: function collapseSidebarMobile() {
      // If small viewport, collapse sidebar.
      if (localStorage.getItem('Drupal.gin.sidebarExpanded') === 'true') {
        if (window.innerWidth < 1024) {
          Drupal.behaviors.ginSidebar.collapseSidebar();
        } else {
          Drupal.behaviors.ginSidebar.showSidebar();
        }
      }
    },
    showSidebar: function showSidebar() {
      // Remove init styles.
      Drupal.behaviors.ginSidebar.removeInlineStyles();

      // Remove attributes.
      $('.meta-sidebar__trigger').addClass('is-active');
      $('body').attr('data-meta-sidebar', 'open');
    },
    collapseSidebar: function collapseSidebar() {
      // Remove init styles.
      Drupal.behaviors.ginSidebar.removeInlineStyles();

      // Remove attributes.
      $('.meta-sidebar__trigger').removeClass('is-active');
      $('body').attr('data-meta-sidebar', 'closed');
    },
    removeInlineStyles: function removeInlineStyles() {
      // Remove init styles.
      $('.gin-sidebar-inline-styles').remove();
    }
  };
})(jQuery, Drupal);
