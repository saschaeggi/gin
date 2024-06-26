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
      const secondaryAction = el.querySelector('.secondary-action');
      const dropbuttonItems = el.querySelector('.dropbutton__items');
      const toggleHeight = el.offsetHeight;
      const dropbuttonHeight = dropbuttonItems.offsetHeight;
      const boundingRect = secondaryAction.getBoundingClientRect();
      const spaceBelow = window.innerHeight - boundingRect.bottom;

      dropbuttonItems.style.position = 'fixed';
      dropbuttonItems.style.right = `${window.innerWidth - boundingRect.right}px`;

      if (spaceBelow < dropbuttonHeight) {
        dropbuttonItems.style.top = `${boundingRect.top - toggleHeight - dropbuttonHeight}px`;
      } else {
        dropbuttonItems.style.top = `${boundingRect.bottom}px`;
      }
    },

  };

})(Drupal, once);
