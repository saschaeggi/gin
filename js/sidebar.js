/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.ginSidebar = {
    attach: function attach(context) {
      // Set meta sidebar state.
      if (localStorage.getItem('Drupal.gin.sidebarExpanded') === 'true') {
        Drupal.behaviors.ginSidebar.showSidebar();
      }
      else {
        Drupal.behaviors.ginSidebar.collapseSidebar();
      }

      // Toolbar toggle
      $('.meta-sidebar__trigger', context).once('ginMetaSidebarToggle').on('click', function (e) {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.removeInlineStyles();
        Drupal.behaviors.ginSidebar.toggleSidebar($(this));
      });

      // Toolbar close
      $('.meta-sidebar__close, .meta-sidebar__overlay', context).once('ginMetaSidebarClose').on('click', function (e) {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.removeInlineStyles();
        Drupal.behaviors.ginSidebar.collapseSidebar();
      });

      $(window)
        .once('ginMetaSidebarMobileResize')
        .on('resize', Drupal.debounce(Drupal.behaviors.ginSidebar.collapseSidebarMobile, 150))
        .trigger('resize');
    },
    toggleSidebar: function toggleSidebar(element) {
      // Set active state.
      if (element.hasClass('is-active')) {
        Drupal.behaviors.ginSidebar.collapseSidebar();
        localStorage.setItem('Drupal.gin.sidebarExpanded', 'false');
      }
      else {
        Drupal.behaviors.ginSidebar.showSidebar();
        localStorage.setItem('Drupal.gin.sidebarExpanded', 'true');
      }
    },
    collapseSidebarMobile: function collapseSidebarMobile() {
      Drupal.behaviors.ginSidebar.removeInlineStyles();

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
      const showLabel = Drupal.t('Show sidebar panel');
      // Change labels.
      $('.meta-sidebar__trigger').attr('title', showLabel);
      $('.meta-sidebar__trigger span').html(showLabel);

      // Attributes.
      $('.meta-sidebar__trigger').attr('aria-expanded', 'true');
      $('.meta-sidebar__trigger').addClass('is-active');
      $('body').attr('data-meta-sidebar', 'open');
    },
    collapseSidebar: function collapseSidebar() {
      const hideLabel = Drupal.t('Hide sidebar panel');
      // Change labels.
      $('.meta-sidebar__trigger').attr('title', hideLabel);
      $('.meta-sidebar__trigger span').html(hideLabel);

      // Attributes.
      $('.meta-sidebar__trigger').removeClass('is-active');
      $('body').attr('data-meta-sidebar', 'closed');
      $('.meta-sidebar__trigger').attr('aria-expanded', 'false');
    },
    removeInlineStyles: function removeInlineStyles() {
      // Remove init styles.
      $('.gin-sidebar-inline-styles').remove();
    }
  };
})(jQuery, Drupal);
