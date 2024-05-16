(Drupal => {
  Drupal.behaviors.ginFormActions = {
    attach: context => {
      Drupal.ginStickyFormActions.init(context);
    }
  }, Drupal.ginStickyFormActions = {
    init: function(context) {
      once("ginEditForm", ".region-content form.gin-sticky-form-actions", context).forEach((form => {
        const sticky = context.querySelector(".gin-sticky"), newParent = context.querySelector(".region-sticky__items__inner");
        if (newParent && 0 === newParent.querySelectorAll(".gin-sticky").length) {
          newParent.appendChild(sticky);
          const actionButtons = newParent.querySelectorAll("button, input, select, textarea"), formLabels = newParent.querySelectorAll("label");
          actionButtons.length > 0 && (actionButtons.forEach((el => {
            el.setAttribute("form", form.getAttribute("id")), el.setAttribute("id", el.getAttribute("id") + "--gin-edit-form");
          })), formLabels.forEach((el => {
            el.setAttribute("for", el.getAttribute("for") + "--gin-edit-form");
          })));
          const localActions = document.querySelector("#block-gin-local-actions");
          null == localActions || localActions.querySelectorAll(".button--primary").forEach((button => {
            button.classList.remove("button--primary"), button.classList.remove("button--secondary");
          }));
        }
      })), once("ginMoreActionsToggle", ".gin-more-actions__trigger", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.toggleMoreActions(), document.addEventListener("click", this.closeMoreActionsOnClickOutside, !1);
      }))));
    },
    toggleMoreActions: function() {
      document.querySelector(".gin-more-actions__trigger").classList.contains("is-active") ? this.hideMoreActions() : this.showMoreActions();
    },
    showMoreActions: function() {
      const trigger = document.querySelector(".gin-more-actions__trigger");
      trigger.setAttribute("aria-expanded", "true"), trigger.classList.add("is-active");
    },
    hideMoreActions: function() {
      const trigger = document.querySelector(".gin-more-actions__trigger");
      trigger.setAttribute("aria-expanded", "false"), trigger.classList.remove("is-active"), 
      document.removeEventListener("click", this.closeMoreActionsOnClickOutside);
    },
    closeMoreActionsOnClickOutside: function(e) {
      "false" !== document.querySelector(".gin-more-actions__trigger").getAttribute("aria-expanded") && (e.target.closest(".gin-more-actions") || Drupal.ginStickyFormActions.hideMoreActions());
    }
  };
})(Drupal);