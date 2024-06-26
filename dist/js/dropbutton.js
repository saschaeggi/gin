((Drupal, once) => {
  Drupal.behaviors.ginDropbutton = {
    attach: function(context) {
      once("ginDropbutton", ".dropbutton-multiple:has(.dropbutton--gin)", context).forEach((el => {
        el.querySelector(".dropbutton__toggle").addEventListener("click", (() => {
          this.updatePosition(el);
        })), window.addEventListener("scroll", (() => this.updatePosition(el))), window.addEventListener("resize", (() => this.updatePosition(el)));
      }));
    },
    updatePosition: function(el) {
      const secondaryAction = el.querySelector(".secondary-action"), dropbuttonItems = el.querySelector(".dropbutton__items"), toggleHeight = el.offsetHeight, dropbuttonHeight = dropbuttonItems.offsetHeight, boundingRect = secondaryAction.getBoundingClientRect(), spaceBelow = window.innerHeight - boundingRect.bottom;
      dropbuttonItems.style.position = "fixed", dropbuttonItems.style.right = window.innerWidth - boundingRect.right + "px", 
      dropbuttonItems.style.top = spaceBelow < dropbuttonHeight ? boundingRect.top - toggleHeight - dropbuttonHeight + "px" : `${boundingRect.bottom}px`;
    }
  };
})(Drupal, once);