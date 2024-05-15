(Drupal => {
  Drupal.behaviors.ginEditForm = {
    attach: context => {
      once("ginEditForm", ".region-content form.gin-sticky-form-actions", context).forEach((form => {
        const sticky = context.querySelector(".gin-sticky"), newParent = context.querySelector(".region-sticky__items__inner");
        if (newParent && 0 === newParent.querySelectorAll(".gin-sticky").length) {
          newParent.appendChild(sticky);
          const actionButtons = newParent.querySelectorAll("button, input, select, textarea"), formLabels = newParent.querySelectorAll("label");
          actionButtons.length > 0 && (actionButtons.forEach((el => {
            el.setAttribute("form", form.getAttribute("id")), el.setAttribute("id", el.getAttribute("id") + "--gin-edit-form");
          })), formLabels.forEach((el => {
            el.setAttribute("for", el.getAttribute("for") + "--gin-edit-form");
          }))), document.querySelector("#block-gin-local-actions").querySelectorAll(".button--primary").forEach((button => {
            button.classList.remove("button--primary"), button.classList.remove("button--secondary");
          }));
        }
      }));
    }
  };
})(Drupal);