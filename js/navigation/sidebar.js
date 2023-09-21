((Drupal, once, { computePosition, offset, arrow, shift, flip }) => {
  /**
   * The wrapping element for the navigation sidebar.
   */
  let sidebar;

  /**
   * Informs in the navigation is expanded.
   *
   * @returns {boolean} - If the navigation is expanded.
   */
  function isNavExpanded() {
    return document.documentElement.classList.contains('navigation-active');
  }

  /**
   * If active item is in the menu trail, then expand the navigation so it is
   * open, and then scroll to it. This happens on page load and when
   * transitioning between expanded and collapsed states.
   */
  function autoExpandToActiveMenuItem() {
    const activeItem = sidebar.querySelector('.is-active');
    closeAllSubmenus();

    activeItem?.closest('.menu-item.level-2')?.classList.add('menu-item--expanded');

    // Only expand level one if sidebar is in expanded state.
    if (activeItem && isNavExpanded()) {
      activeItem.closest('.menu-item.level-1')?.classList.add('menu-item--expanded');
      // Scroll to the open trays so they're in view.
      const expandedTray = sidebar.querySelector('.menu-item.menu-item--expanded');
      expandedTray?.scrollIntoView({ behavior: 'smooth' });
    }

    checkOverflow();
  }

  /**
   * Searches the sidebar for all menu items, and when it finds the menu item
   * for the link that it's currently on, it will add relevant CSS classes to it
   * so it can be styled and opened to.
   *
   * @todo once we move into the Drupal core menu system, we should be able to
   * remove this.
   */
  function markCurrentPageInMenu() {
    // Check all links on the sidebar (that are not in the shortcutsNav
    // <div>) to see if they are the current page. If so, set a `current`
    // and `is-active` CSS class on the parent <li>.
    const sidebarLinks = sidebar.querySelectorAll('a.navigation-link:not(.menu--shortcuts *)');
    sidebarLinks.forEach(link => {
      if (link.href === document.URL) {
        link.parentElement.classList.add('current', 'is-active');
      }
    });
  }

  /**
   * Expand / collapse sidebar
   *
   * @param {boolean} toState - the state which the sidebar will be
   *   transitioning to (true if expanded, false if collapsed).
   */
  function expandCollapseSidebar(toState) {
    const expandCollapseButton = sidebar.querySelector('[aria-controls="navigation-sidebar"]');
    document.documentElement.classList.toggle('navigation-active', toState);
    Drupal.displace(true);
    sidebar.querySelector('#sidebar-state').textContent = toState ? Drupal.t('Collapse sidebar') : Drupal.t('Expand sidebar');
    expandCollapseButton.setAttribute('aria-expanded', toState);
    localStorage.setItem('Drupal.navigation.sidebarExpanded', toState);
    autoExpandToActiveMenuItem();

    if (toState) {
      flyoutDetach();
    }
    else {
      flyoutInit();
    }
  }

  /**
   * Show shadow on sticky section only when expanded and content is
   * overflowing.
   *
   * @todo this should be using either CSS only or Intersection Observer instead
   * of getBoundingClientRect().
   */
  function checkOverflow() {
    if (isNavExpanded()) {
      const stickyMenu = sidebar.querySelector('.navigation__sidebar--sticky-menu');
      const mainMenu = sidebar.querySelector('#menu-builder'); // @todo why are we using ID here?
      const stickyMenuTopPos = stickyMenu?.getBoundingClientRect().top;
      const mainMenuBottomPos = mainMenu?.getBoundingClientRect().bottom;
      stickyMenu?.classList.toggle('shadow', mainMenuBottomPos > stickyMenuTopPos);
    }
  }

  /**
   * Calculate and place flyouts relative to their parent links using the
   * floating UI library.
   *
   * @param {Element} anchorEl - <button> element within the navigation link
   *   that was hovered over.
   * @param {Element} flyoutEl - Top level <ul> that contains menu items to be
   *   shown.
   * @param {Element} arrowEl - Empty <div> that is styled as an arrow.
   */
  function positionFlyout(anchorEl, flyoutEl, arrowEl) {
    computePosition(anchorEl, flyoutEl, {
      placement: 'right',
      middleware: [
        offset(6),
        flip({ padding: 16 }),
        shift({ padding: 16 }),
        arrow({ element: arrowEl }),
      ],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(flyoutEl.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      // Accessing the data
      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];

      Object.assign(arrowEl.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px',
      });
    });
  }

  /**
   * When flyouts are active, any click outside of the flyout should close the
   * flyout.
   *
   * @param {Event} e - The click event.
   *
   * @todo can we refactor this to something like blur or focusout? It's only
   * called from one place.
   */
  function closeFlyoutOnClickOutside(e) {
    // This can trigger when expand/collapse button is clicked. We need to
    // ensure this only runs when navigation is collapsed.
    if (isNavExpanded()) return;

    if (!e.target.closest('.level-1.menu-item--expanded')) {
      closeAllSubmenus();
      document.removeEventListener('click', closeFlyoutOnClickOutside);
    }
  }

  /**
   * Open the flyout when in collapsed mode.
   *
   * @param {Event} e - The mouseenter event from the parentListItem.
   */
  function openFlyout(e) {
    const hoveredEl = e.target; // This is the <li> that was hovered over.
    const anchorEl = hoveredEl.querySelector('.navigation-link'); // This is the <button> element within the navigation link.
    const flyoutEl = hoveredEl.querySelector('.navigation-menu-wrapper'); // Top level <ul> that contains menu items to be shown.
    const arrowEl = hoveredEl.querySelector('.arrow-ref'); // Empty <div> that is styled as an arrow.

    // If the active submenu is not yet open (it might be open if it has
    // focus-within and the user did a  mouseleave and mouseenter).
    if (!hoveredEl.classList.contains('menu-item--expanded')) {
      closeAllSubmenus();

      // Only position if the submenu is not already open. This prevents the
      // flyout from unexpectedly shifting.
      positionFlyout(anchorEl, flyoutEl, arrowEl);
      autoExpandToActiveMenuItem();
    }
    hoveredEl.classList.add('menu-item--expanded');

    // When a flyout is open, listen for clicks outside the flyout.
    document.addEventListener('click', closeFlyoutOnClickOutside, false);
  }

  /**
   * Close the flyout.
   *
   * @param {Element} parentListItem - The top level <li> element that is
   * expanded.
   */
  function flyoutClose(parentListItem) {
    // Remove expanded class if sidebar is collapsed.
    if (!isNavExpanded()) {
      parentListItem?.classList.remove('menu-item--expanded');
    }
  }

  /**
   * Close the flyout after timer (if not hovered over again).
   *
   * @param {e} - mouseleave event.
   */
  function delayedFlyoutClose(e) {
    const parentListItem = e.currentTarget;

    // Do not close flyout if it contains focus.
    if (parentListItem.contains(document.activeElement)) return;

    timer = setTimeout(() => {
      flyoutClose(parentListItem);
      parentListItem.removeEventListener('mouseover', () => clearTimeout(timer), { once: true });
    }, 400);
    parentListItem.addEventListener('mouseover', () => clearTimeout(timer), { once: true });
  }

  /**
   * Flyout setup in the collapsed toolbar state. This gets called when toolbar
   * is put into a collapsed state.
   */
  function flyoutInit() {
    if (sidebar.querySelectorAll('.level-1 > .navigation-menu-wrapper')) {
      // @todo why are we not doing this in Twig? Talked to Claire and she's
      // okay with moving this to Twig.
      sidebar.querySelectorAll('.level-1 > .navigation-menu-wrapper').forEach(flyoutEl => {
        // Duplicate the level-1 icon and title append it to the first item in
        // the submenu.
        const parentListItem = flyoutEl.parentElement;
        const anchorEl = parentListItem.querySelector('.navigation-link');
        const menuTitle = `<li class="menu-item menu-item--title">${anchorEl.outerHTML}</li>`;
        const menu = flyoutEl.querySelector('.navigation-menu');
        if (!menu.querySelector('.menu-item--title')) {
          flyoutEl.querySelector('.navigation-menu').insertAdjacentHTML('afterbegin', menuTitle);
        }

        // when a level-1 list item is hovered, open the flyout
        parentListItem.addEventListener('mouseenter', openFlyout, false);

        // When a level-1 item hover ends, check if the flyout has focus and if
        // not, close it.
        parentListItem.addEventListener('mouseleave', delayedFlyoutClose, false);
      });
    }
  }

  /**
   * Remove all flyout related event listeners. This gets called when toolbar is
   * put into an expanded state.
   */
  function flyoutDetach() {
    sidebar.querySelectorAll('.level-1 > .navigation-menu-wrapper').forEach(flyoutEl => {
      // Duplicate the level-1 icon and title append it to the first item in the
      // submenu.
      const parentListItem = flyoutEl.parentElement;
      parentListItem.removeEventListener('mouseenter', openFlyout);
      parentListItem.removeEventListener('mouseleave', delayedFlyoutClose);
    });
  }

  /**
   * Close all submenus that are underneath the optional element parameter.
   *
   * @param {Element} [Element] - Optional element under which to close all
   * submenus.
   */
  function closeAllSubmenus(Element) {
    const submenuParentElement = Element ?? sidebar;
    const selectorsToIgnore = '.sidebar-toggle';
    submenuParentElement.querySelectorAll('.menu-item--expanded').forEach(el => el.classList.remove('menu-item--expanded'));
    submenuParentElement.querySelectorAll(`.navigation-link[aria-expanded="true"]:not(:is(${selectorsToIgnore}))`).forEach(el => {
      el.setAttribute('aria-expanded', false);
      el.querySelector('.action').textContent = Drupal.t('Extend');
    });
  }

  /**
   * Open or close the submenu. This can happen in both the open and closed
   * state.
   *
   * @param {Element} parentListItem - the parent <li> that needs to be opened
   *   or closed
   * @param {boolean} [state] - optional state where it will end up (true if
   *   opened, or false if closed). If omitted, state will be toggled.
   */
  function openCloseSubmenu(parentListItem, state) {
    toState = state ?? parentListItem.classList.contains('menu-item--expanded');
    const buttonEl = parentListItem.querySelector('button.navigation-link');

    // If we're clicking on a top level menu item, ensure that all other menu
    // items close. Otherwise just close any other sibling menu items.
    if (buttonEl.matches('.menu-item.level-1 > *')) {
      closeAllSubmenus()
    }
    else {
      closeAllSubmenus(parentListItem.parentElement);
    }

    parentListItem.classList.toggle('menu-item--expanded', !toState);
    buttonEl.setAttribute('aria-expanded', toState);
    buttonEl.querySelector('.action').textContent = toState ? Drupal.t('Extend') : Drupal.t('Collapse');
    checkOverflow();
  }

  /**
   * Initialize Drupal.displace()
   *
   * We add the displace attribute to a separate full width element because we
   * don't want this element to have transitions. Note that this element and the
   * navbar share the same exact width.
   */
  function initDisplace() {
    const displaceElement = sidebar.querySelector('.navigation__displace-placeholder');
    const edge = document.documentElement.dir === 'rtl' ? 'right' : 'left';
    displaceElement.setAttribute(`data-offset-${edge}`, '');
    Drupal.displace(true);
  }

  /**
   * Initialize everything.
   */
  function init(el) {
    sidebar = el;
    const expandCollapseButton = sidebar.querySelector('[aria-controls="navigation-sidebar"]');

    markCurrentPageInMenu();
    expandCollapseSidebar(localStorage.getItem('Drupal.navigation.sidebarExpanded') !== 'false');
    initDisplace();

    // Event listener to expand/collapse the sidebar.
    expandCollapseButton.addEventListener('click', () => expandCollapseSidebar(!isNavExpanded()));

    // Safari does not give focus to <button> elements on click (other browsers
    // do). This event listener normalizes the behavior across browsers.
    sidebar.addEventListener('click', e => {
      if (e.target.matches('button, button *')) {
        e.target.closest('button').focus();
      }
    });

    // Add click event listeners to all buttons and then contains the callback
    // to expand / collapse the button's menus.
    sidebar.querySelectorAll('.menu-item--has-dropdown > button').forEach(el => el.addEventListener('click', (e) => {
      openCloseSubmenu(e.currentTarget.parentElement);
    }));

    // Gin Custom start ---------------------
    // Show toolbar navigation with shortcut:
    // OPTION + T (Mac) / ALT + T (Windows)
    document.addEventListener('keydown', e => {
      if (e.altKey === true && e.code === 'KeyT') {
        expandCollapseSidebar(!isNavExpanded());
      }
    });
    // Gin Custom end ------------------------
  }

  Drupal.behaviors.navigation = {
    attach(context) {
      once('navigation', '.navigation__sidebar', context).forEach(init);
    },
  };
})(Drupal, once, FloatingUIDOM);
