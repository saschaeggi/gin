((Drupal) => {
  Drupal.behaviors.formDescriptionToggle = {
    attach: function attach(context) {
      context
        .querySelectorAll('.help-icon__description-toggle')
        .forEach((elem) => {
          if (elem.dataset.formDescriptionToggleAttached) {
            return;
          }
          elem.dataset.formDescriptionToggleAttached = true;

          elem.addEventListener('click', (event) => {
            const toggleFunction = (description) => {
              description.classList.toggle('visually-hidden');
            };
            event.preventDefault();
            event.currentTarget.focus(); // firefox button focus issue
            event.currentTarget
              .closest('.help-icon__description-container')
              .querySelectorAll(
                '.claro-details__description, .fieldset__description, .form-item__description',
              )
              .forEach(toggleFunction);
          });
        });
    },
  };
})(Drupal);
