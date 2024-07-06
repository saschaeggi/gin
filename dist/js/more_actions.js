(Drupal => {
  Drupal.behaviors.ginFormActions = {
    attach: context => {
      Drupal.ginStickyFormActions.init(context);
    }
  }, Drupal.ginStickyFormActions = {
    init: function(context) {
      var _context$classList;
      const newParent = document.querySelector(".gin-sticky-form-actions");
      null !== (_context$classList = context.classList) && void 0 !== _context$classList && _context$classList.contains("gin--has-sticky-form-actions") && context.getAttribute("id") && this.updateFormId(newParent, context), 
      once("ginEditForm", ".region-content form.gin--has-sticky-form-actions", context).forEach((form => {
        this.updateFormId(newParent, form), this.moveFocus(newParent, form);
      })), once("ginMoreActionsToggle", ".gin-more-actions__trigger", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.toggleMoreActions(), document.addEventListener("click", this.closeMoreActionsOnClickOutside, !1);
      }))));
    },
    updateFormId: function(newParent, form) {
      const actionButtons = newParent.querySelectorAll("button, input, select, textarea"), formId = form.getAttribute("id");
      actionButtons.length > 0 && actionButtons.forEach((el => {
        el.setAttribute("form", formId);
      }));
    },
    moveFocus: function(newParent, form) {
      once("ginMoveFocusToStickyBar", "[gin-move-focus-to-sticky-bar]", form).forEach((el => el.addEventListener("focus", (e => {
        e.preventDefault(), newParent.querySelector([ "button, input, select, textarea" ]).focus();
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