/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal) => {
  const breakpoint = 1024;
  const storageMobile = 'Drupal.gin.sidebarExpanded.mobile';
  const storageDesktop = 'Drupal.gin.sidebarExpanded.desktop';

  Drupal.behaviors.ginSidebar = {
    attach: () => {
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
      const ginSidebarShortcut = once('ginSidebarShortcut', document.querySelector('#gin_sidebar'));
      ginSidebarShortcut.forEach(() => document.addEventListener('keydown', e => {
        if (e.altKey === true && e.code === 'KeyS') {
          Drupal.behaviors.ginSidebar.toggleSidebar();
        }
      }));

      // Toolbar toggle
      const ginSidebarToggle = once('ginSidebarToggle', document.querySelector('.meta-sidebar__trigger'));
      ginSidebarToggle.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.removeInlineStyles();
        Drupal.behaviors.ginSidebar.toggleSidebar();
      }));

      // Toolbar close
      const ginSidebarClose = once('ginSidebarClose', document.querySelectorAll('.meta-sidebar__close, .meta-sidebar__overlay'));
      ginSidebarClose.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        Drupal.behaviors.ginSidebar.removeInlineStyles();
        Drupal.behaviors.ginSidebar.collapseSidebar();
      }));

      window.onresize = Drupal.debounce(Drupal.behaviors.ginSidebar.handleResize, 150);
    },
    toggleSidebar: () => {
      // Set active state.
      if (document.querySelector('.meta-sidebar__trigger').classList.contains('is-active')) {
        Drupal.behaviors.ginSidebar.collapseSidebar();
      }
      else {
        Drupal.behaviors.ginSidebar.showSidebar();
      }
    },
    showSidebar: () => {
      const chooseStorage = window.innerWidth < breakpoint ? storageMobile : storageDesktop;
      const showLabel = Drupal.t('Hide sidebar panel');
      // Change labels.
      document.querySelector('.meta-sidebar__trigger').setAttribute('title', showLabel);
      document.querySelector('.meta-sidebar__trigger span').innerHTML = showLabel;

      // Expose to localStorage.
      localStorage.setItem(chooseStorage, 'true');

      // Attributes.
      document.querySelector('.meta-sidebar__trigger').setAttribute('aria-expanded', 'true');
      document.querySelector('.meta-sidebar__trigger').classList.add('is-active');
      document.body.setAttribute('data-meta-sidebar', 'open');
    },
    collapseSidebar: () => {
      const chooseStorage = window.innerWidth < breakpoint ? storageMobile : storageDesktop;
      const hideLabel = Drupal.t('Show sidebar panel');
      // Change labels.
      document.querySelector('.meta-sidebar__trigger').setAttribute('title', hideLabel);
      document.querySelector('.meta-sidebar__trigger span').innerHTML = hideLabel;

      // Expose to localStorage.
      localStorage.setItem(chooseStorage, 'false');

      // Attributes.
      document.querySelector('.meta-sidebar__trigger').classList.remove('is-active');
      document.body.setAttribute('data-meta-sidebar', 'closed');
      document.querySelector('.meta-sidebar__trigger').setAttribute('aria-expanded', 'false');
    },
    handleResize: () => {
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
    removeInlineStyles: () => {
      // Remove init styles.
      if (document.querySelectorAll('.gin-sidebar-inline-styles').length > 0) {
        const removeElement = document.querySelector('.gin-sidebar-inline-styles');
        removeElement.parentNode.removeChild(removeElement);
      }
    }
  };
})(Drupal);
