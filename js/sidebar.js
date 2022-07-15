/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal, once) => {
  const breakpoint = 1024;
  const storageMobile = 'Drupal.gin.sidebarExpanded.mobile';
  const storageDesktop = 'Drupal.gin.sidebarExpanded.desktop';

  Drupal.behaviors.ginSidebar = {
    attach: function attach() {
      // If variable does not exist, create it, default being to show sidebar.
      if (!localStorage.getItem(storageDesktop)) {
        localStorage.setItem(storageDesktop, 'true');
      }

      // Set mobile initial to false.
      if (window.innerWidth >= breakpoint) {
        if (localStorage.getItem(storageDesktop) === 'true') {
          this.showSidebar();
        }
        else {
          this.collapseSidebar();
        }
      }

      // Show navigation with shortcut:
      // OPTION + S (Mac) / ALT + S (Windows)
      const ginSidebarShortcut = once('ginSidebarShortcut', document.querySelector('#gin_sidebar'));
      ginSidebarShortcut.forEach(() => document.addEventListener('keydown', e => {
        if (e.altKey === true && e.code === 'KeyS') {
          this.toggleSidebar();
        }
      }));

      // Toolbar toggle
      const ginSidebarToggle = once('ginSidebarToggle', document.querySelector('.meta-sidebar__trigger'));
      ginSidebarToggle.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.removeInlineStyles();
        this.toggleSidebar();
      }));

      // Toolbar close
      const ginSidebarClose = once('ginSidebarClose', document.querySelectorAll('.meta-sidebar__close, .meta-sidebar__overlay'));
      ginSidebarClose.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.removeInlineStyles();
        this.collapseSidebar();
      }));

      window.onresize = Drupal.debounce(this.handleResize, 150);
    },
    toggleSidebar: function toggleSidebar() {
      // Set active state.
      if (document.querySelector('.meta-sidebar__trigger').classList.contains('is-active')) {
        this.collapseSidebar();
      }
      else {
        this.showSidebar();
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
    handleResize: function handleResize() {
      this.removeInlineStyles();

      // If small viewport, always collapse sidebar.
      if (window.innerWidth < breakpoint) {
        this.collapseSidebar();
      } else {
        // If large viewport, show sidebar if it was open before.
        if (localStorage.getItem(storageDesktop) === 'true') {
          this.showSidebar();
        } else {
          this.collapseSidebar();
        }
      }
    },
    removeInlineStyles: () => {
      // Remove init styles.
      const elementToRemove = document.querySelector('.gin-sidebar-inline-styles');
      if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
      }
    }
  };
})(Drupal, once);
