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
      const leftAligned = null !== el.closest(".node-form"), secondaryAction = el.querySelector(".secondary-action"), dropbuttonItems = el.querySelector(".dropbutton__items"), toggleHeight = el.offsetHeight, dropbuttonHeight = dropbuttonItems.offsetHeight, boundingRect = secondaryAction.getBoundingClientRect(), spaceBelow = window.innerHeight - dropbuttonHeight - boundingRect.height;
      let dropbuttonItemsPosition = "fixed", dropbuttonItemsTop = `${toggleHeight}px`, dropbuttonItemsLeft = leftAligned ? `${boundingRect.left}px` : "auto", dropbuttonItemsRight = leftAligned ? "auto" : window.innerWidth - boundingRect.right + "px";
      spaceBelow >= dropbuttonHeight ? dropbuttonItemsTop = `${boundingRect.bottom}px` : (dropbuttonItemsPosition = "absolute", 
      dropbuttonItemsLeft = "auto", dropbuttonItemsRight = "auto"), dropbuttonItems.style.position = dropbuttonItemsPosition, 
      dropbuttonItems.style.left = dropbuttonItemsLeft, dropbuttonItems.style.right = dropbuttonItemsRight, 
      dropbuttonItems.style.top = dropbuttonItemsTop;
    }
  };
})(Drupal, once);