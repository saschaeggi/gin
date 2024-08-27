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

       // Define position vars.
      let dropbuttonItemsPosition   = 'fixed';
      let dropbuttonItemsLeft       = 'auto';
      let dropbuttonItemsRight      = 'auto';
      let dropbuttonItemsTop        = 'auto';

      if (leftAligned) {
        dropbuttonItemsLeft = `${boundingRect.left}px`;
      } else {
        dropbuttonItemsRight = `${window.innerWidth - boundingRect.right}px`;
      }

      //Space below can be negative, meaning we don't have enough space in the top
      if ((spaceBelow < dropbuttonHeight) && spaceBelow > 0) {
        dropbuttonItemsTop = `${boundingRect.top - toggleHeight - dropbuttonHeight}px`;
      } else if(spaceBelow > dropbuttonHeight)  {
        dropbuttonItemsTop = `${boundingRect.bottom}px`;
      } else {
        // Consider case when space bellow is negative
        dropbuttonItemsPosition   = 'absolute';
        dropbuttonItemsTop        = `${toggleHeight}px`;
        dropbuttonItemsLeft       = 'auto';
        dropbuttonItemsRight      = 'auto'
      }

      dropbuttonItems.style.position = dropbuttonItemsPosition;
      dropbuttonItems.style.left    = dropbuttonItemsLeft;
      dropbuttonItems.style.right   = dropbuttonItemsRight;
      dropbuttonItems.style.top     = dropbuttonItemsTop;

    },

  };

})(Drupal, once);
