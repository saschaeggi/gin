((Drupal, once) => {
  Drupal.behaviors.ginDropbutton = {
    attach: function (context) {
      once('ginDropbutton', '.dropbutton-multiple:has(.dropbutton--gin)', context).forEach(el => {
        el.querySelector('.dropbutton__toggle').addEventListener('click', () => {
          this.updatePosition(el);
        });

        window.addEventListener('scroll', () => this.updatePosition(el));
        window.addEventListener('resize', () => this.updatePosition(el));
      });
    },

    updatePosition: function (el) {
      const leftAligned = el.closest('.node-form') !== null;
      const secondaryAction = el.querySelector('.secondary-action');
      const dropbuttonItems = el.querySelector('.dropbutton__items');
      const toggleHeight = el.offsetHeight;
      const dropbuttonHeight = dropbuttonItems.offsetHeight;
      const boundingRect = secondaryAction.getBoundingClientRect();
      const spaceBelow = window.innerHeight - dropbuttonHeight - boundingRect.height;

      // Define initial position variables.
      let dropbuttonItemsPosition = 'fixed';
      let dropbuttonItemsTop= `${toggleHeight}px`;
      let dropbuttonItemsLeft = leftAligned ? `${boundingRect.left}px` : 'auto';
      let dropbuttonItemsRight = leftAligned ? 'auto' : `${window.innerWidth - boundingRect.right}px`;

      // Calculate the top position based on available space.
      if (spaceBelow >= dropbuttonHeight) {
        dropbuttonItemsTop = `${boundingRect.bottom}px`;
      } else {
        // Not enough space either above, use absolute positioning.
        dropbuttonItemsPosition = 'absolute';
        // Reset left and right to avoid conflicts with fixed positioning.
        dropbuttonItemsLeft = 'auto';
        dropbuttonItemsRight = 'auto';
      }
      dropbuttonItems.style.position = dropbuttonItemsPosition;
      dropbuttonItems.style.left    = dropbuttonItemsLeft;
      dropbuttonItems.style.right   = dropbuttonItemsRight;
      dropbuttonItems.style.top     = dropbuttonItemsTop;

    },

  };

})(Drupal, once);
