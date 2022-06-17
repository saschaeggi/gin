/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  const breakpoint = 1024;
  const storageMobile = 'Drupal.gin.sidebarExpanded.mobile';
  const storageDesktop = 'Drupal.gin.sidebarExpanded.desktop';

  Drupal.behaviors.ginSidebar = {
    attach: function attach(context) {
      // If variable does not exist, create it, default being to show sidebar.
      if (!localStorage.getItem(storageDesktop)) {
        localStorage.setItem(storageDesktop, 'true');
      }

      // Set mobile initial to false.
      if (window.innerWidth >= breakpoint) {
        if (localStorage.getItem(storageDesktop) === 'true') {
          Drupal.behaviors.ginSidebar.showSidebar();
        }
        else {
          Drupal.behaviors.ginSidebar.collapseSidebar();
        }
      }

      // Show navigation with shortcut:
      // OPTION + S (Mac) / ALT + S (Windows)
      $(document).once('ginMetaSidebarShortcut').on('keydown', function (e) {
        if (e.altKey === true && e.keyCode === 83) {
          Drupal.behaviors.ginSidebar.toggleSidebar();
        }
      });

      // Toolbar toggle
      $('.meta-sidebar__trigger', context).once('ginMetaSidebarToggle').on('click', function (e) {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.removeInlineStyles();
        Drupal.behaviors.ginSidebar.toggleSidebar();
      });

      // Toolbar close
      $('.meta-sidebar__close, .meta-sidebar__overlay', context).once('ginMetaSidebarClose').on('click', function (e) {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.removeInlineStyles();
        Drupal.behaviors.ginSidebar.collapseSidebar();
      });

      $(window)
        .once('ginMetaSidebarResize')
        .on('resize', Drupal.debounce(Drupal.behaviors.ginSidebar.handleResize, 150))
        .trigger('resize');
    },
    toggleSidebar: function toggleSidebar() {
      // Set active state.
      if ($('.meta-sidebar__trigger').hasClass('is-active')) {
        Drupal.behaviors.ginSidebar.collapseSidebar();
      }
      else {
        Drupal.behaviors.ginSidebar.showSidebar();
      }
    },
    showSidebar: function showSidebar() {
      const chooseStorage = window.innerWidth < breakpoint ? storageMobile : storageDesktop;
      const showLabel = Drupal.t('Hide sidebar panel');
      // Change labels.
      $('.meta-sidebar__trigger').attr('title', showLabel);
      $('.meta-sidebar__trigger span').html(showLabel);

      // Expose to localStorage.
      localStorage.setItem(chooseStorage, 'true');

      // Attributes.
      $('.meta-sidebar__trigger').attr('aria-expanded', 'true');
      $('.meta-sidebar__trigger').addClass('is-active');
      $('body').attr('data-meta-sidebar', 'open');
    },
    collapseSidebar: function collapseSidebar() {
      const chooseStorage = window.innerWidth < breakpoint ? storageMobile : storageDesktop;
      const hideLabel = Drupal.t('Show sidebar panel');
      // Change labels.
      $('.meta-sidebar__trigger').attr('title', hideLabel);
      $('.meta-sidebar__trigger span').html(hideLabel);

      // Expose to localStorage.
      localStorage.setItem(chooseStorage, 'false');

      // Attributes.
      $('.meta-sidebar__trigger').removeClass('is-active');
      $('body').attr('data-meta-sidebar', 'closed');
      $('.meta-sidebar__trigger').attr('aria-expanded', 'false');
    },
    handleResize: function handleResize() {
      Drupal.behaviors.ginSidebar.removeInlineStyles();

      // If small viewport, always collapse sidebar.
      if (window.innerWidth < breakpoint) {
        Drupal.behaviors.ginSidebar.collapseSidebar();
      } else {
        // If large viewport, show sidebar if it was open before.
        if (localStorage.getItem(storageDesktop) === 'true') {
          Drupal.behaviors.ginSidebar.showSidebar();
        } else {
          Drupal.behaviors.ginSidebar.collapseSidebar();
        }
      }
    },
    removeInlineStyles: function removeInlineStyles() {
      // Remove init styles.
      $('.gin-sidebar-inline-styles').remove();
    }
  };
})(jQuery, Drupal);
