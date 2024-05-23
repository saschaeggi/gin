(Drupal => {
  Drupal.behaviors.ginFormActions = {
    attach: context => {
      Drupal.ginStickyFormActions.init(context);
    }
  }, Drupal.ginStickyFormActions = {
    init: function(context) {
      once("ginEditForm", ".region-content form.gin-sticky-form-actions", context).forEach((form => {
        const sticky = context.querySelector(".gin-sticky"), newParent = document.querySelector(".region-sticky__items__inner");
        if (newParent) {
          var _document$querySelect;
          0 === newParent.querySelectorAll(".gin-sticky").length ? newParent.appendChild(sticky) : null === (_document$querySelect = document.querySelector(".region-content form.gin-sticky-form-actions .gin-sticky")) || void 0 === _document$querySelect || _document$querySelect.remove();
          const localActions = document.querySelector("#block-gin-local-actions");
          null == localActions || localActions.querySelectorAll(".button--primary").forEach((button => {
            button.classList.remove("button--primary"), button.classList.remove("button--secondary");
          }));
        }
        this.updateFormId(newParent, form);
      })), once("ginMoreActionsToggle", ".gin-more-actions__trigger", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.toggleMoreActions(), document.addEventListener("click", this.closeMoreActionsOnClickOutside, !1);
      }))));
    },
    updateFormId: function(newParent, form) {
      const actionButtons = newParent.querySelectorAll("button, input, select, textarea");
      actionButtons.length > 0 && actionButtons.forEach((el => {
        el.setAttribute("form", form.getAttribute("id"));
      }));
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