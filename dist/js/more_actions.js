(Drupal => {
  Drupal.behaviors.ginFormActions = {
    attach: context => {
      Drupal.ginStickyFormActions.init(context);
    }
  }, Drupal.ginStickyFormActions = {
    init: function(context) {
      const newParent = document.querySelector(".gin-sticky-form-actions");
      newParent && (context.classList?.contains("gin--has-sticky-form-actions") && context.getAttribute("id") && this.updateLabelIds(newParent, context), 
      once("ginEditForm", ".region-content form.gin--has-sticky-form-actions", context).forEach((form => {
        this.updateLabelIds(newParent, context), this.moveFocus(newParent, form);
      })), once("ginMoreActionsToggle", ".gin-more-actions__trigger", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.toggleMoreActions(), document.addEventListener("click", this.closeMoreActionsOnClickOutside, !1);
      })))));
    },
    updateLabelIds: function(newParent, form) {
      const formActions = form.querySelector('[data-drupal-selector="edit-actions"]'), actionButtons = Array.from(formActions.children);
      actionButtons.length > 0 && actionButtons.forEach((el => {
        const drupalSelector = el.dataset.drupalSelector, buttonSelector = newParent.querySelector(`label[data-gin-sticky-form-selector="${drupalSelector}"]`);
        buttonSelector && (buttonSelector.setAttribute("for", el.id), buttonSelector.addEventListener("keydown", (e => {
          " " !== event.key && "Enter" !== event.key || (e.preventDefault(), e.target.click());
        })));
      }));
    },
    moveFocus: function(newParent, form) {
      once("ginMoveFocusToStickyBar", "[gin-move-focus-to-sticky-bar]", form).forEach((el => el.addEventListener("focus", (e => {
        e.preventDefault(), newParent.querySelector([ "label, button, input, select, textarea" ]).focus();
        let element = document.createElement("div");
        element.style.display = "contents", element.innerHTML = '<a href="#" class="visually-hidden" role="button" gin-move-focus-to-end-of-form>Moves focus back to form</a>', 
        newParent.appendChild(element), document.querySelector("[gin-move-focus-to-end-of-form]").addEventListener("focus", (eof => {
          eof.preventDefault(), element.remove(), e.target.nextElementSibling ? e.target.nextElementSibling.focus() : e.target.parentNode.nextElementSibling && e.target.parentNode.nextElementSibling.focus();
        }));
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