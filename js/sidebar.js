/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

((Drupal, once) => {
  const breakpoint = 1024;
  const storageMobile = 'Drupal.gin.sidebarExpanded.mobile';
  const storageDesktop = 'Drupal.gin.sidebarExpanded.desktop';

  Drupal.behaviors.ginSidebar = {
    attach: function attach() {
      Drupal.ginSidebar.init();
    },
  };

  Drupal.ginSidebar = {
    init: function () {
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
      once('ginSidebarShortcut', '#gin_sidebar').forEach(() => document.addEventListener('keydown', e => {
        if (e.altKey === true && e.code === 'KeyS') {
          this.toggleSidebar();
        }
      }));

      // Toolbar toggle
      once('ginSidebarToggle', '.meta-sidebar__trigger').forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.removeInlineStyles();
        this.toggleSidebar();
      }));

      // Toolbar close
      once('ginSidebarClose', '.meta-sidebar__close, .meta-sidebar__overlay').forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.removeInlineStyles();
        this.collapseSidebar();
      }))

      window.onresize = Drupal.debounce(this.handleResize, 150);
    },

    toggleSidebar: () => {
      // Set active state.
      if (document.querySelector('.meta-sidebar__trigger').classList.contains('is-active')) {
        Drupal.ginSidebar.collapseSidebar();
      }
      else {
        Drupal.ginSidebar.showSidebar();
      }
    },

    showSidebar: () => {
      const chooseStorage = window.innerWidth < breakpoint ? storageMobile : storageDesktop;
      const showLabel = Drupal.t('Hide sidebar panel');
      const sidebarTrigger = document.querySelector('.meta-sidebar__trigger');

      // Change labels.
      sidebarTrigger.setAttribute('title', showLabel);
      sidebarTrigger.querySelector('span').innerHTML = hideLabel;

      // Attributes.
      sidebarTrigger.setAttribute('aria-expanded', 'true');
      sidebarTrigger.classList.add('is-active');
      document.body.setAttribute('data-meta-sidebar', 'open');

      // Expose to localStorage.
      localStorage.setItem(chooseStorage, 'true');
    },

    collapseSidebar: () => {
      const chooseStorage = window.innerWidth < breakpoint ? storageMobile : storageDesktop;
      const hideLabel = Drupal.t('Show sidebar panel');
      const sidebarTrigger = document.querySelector('.meta-sidebar__trigger');

      // Change labels.
      sidebarTrigger.setAttribute('title', hideLabel);
      sidebarTrigger.querySelector('span').innerHTML = hideLabel;

      // Expose to localStorage.
      localStorage.setItem(chooseStorage, 'false');

      // Attributes.
      sidebarTrigger.setAttribute('aria-expanded', 'false');
      sidebarTrigger.classList.remove('is-active');
      document.body.setAttribute('data-meta-sidebar', 'closed');
    },

    handleResize: () => {
      Drupal.ginSidebar.removeInlineStyles();

      // If small viewport, always collapse sidebar.
      if (window.innerWidth < breakpoint) {
        Drupal.ginSidebar.collapseSidebar();
      } else {
        // If large viewport, show sidebar if it was open before.
        if (localStorage.getItem(storageDesktop) === 'true') {
          Drupal.ginSidebar.showSidebar();
        } else {
          Drupal.ginSidebar.collapseSidebar();
        }
      }
    },

    removeInlineStyles: () => {
      // Remove init styles.
      const elementToRemove = document.querySelector('.gin-sidebar-inline-styles');
      if (elementToRemove) {
        elementToRemove.parentNode.removeChild(elementToRemove);
      }
    },

  };
})(Drupal, once);
