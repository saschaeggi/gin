!function(Drupal) {
  Drupal.behaviors.formDescriptionToggle = {
    attach: function(context) {
      context.querySelectorAll(".help-icon__description-toggle").forEach((function(elem) {
        elem.dataset.formDescriptionToggleAttached || (elem.dataset.formDescriptionToggleAttached = !0, 
        elem.addEventListener("click", (function(event) {
          event.preventDefault(), event.currentTarget.focus(), event.currentTarget.closest(".help-icon__description-container").querySelectorAll(".claro-details__description, .fieldset__description, .form-item__description").forEach((function(description) {
            description.classList.toggle("visually-hidden");
          }));
        })));
      }));
    }
  };
}(Drupal);