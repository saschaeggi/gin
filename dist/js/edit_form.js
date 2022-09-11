(Drupal => {
  Drupal.behaviors.ginEditForm = {
    attach: context => {
      once("ginEditForm", context.querySelector(".region-content form.gin-node-edit-form")).forEach((form => {
        const sticky = context.querySelector(".gin-sticky"), newParent = context.querySelector(".region-sticky__items__inner");
        if (newParent && 0 === newParent.querySelectorAll(".gin-sticky").length) {
          newParent.appendChild(sticky);
          const actionButtons = newParent.querySelectorAll("button, input, select, textarea");
          actionButtons.length > 0 && actionButtons.forEach((el => {
            el.setAttribute("form", form.getAttribute("id")), el.setAttribute("id", el.getAttribute("id") + "--gin-edit-form");
          }));
        }
      }));
    }
  };
})(Drupal);