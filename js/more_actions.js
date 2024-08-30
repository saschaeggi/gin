/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal) => {
  Drupal.behaviors.ginFormActions = {
    attach: (context) => {
      Drupal.ginStickyFormActions.init(context);
    },
  };

  Drupal.ginStickyFormActions = {
    init: function (context) {
      const newParent = document.querySelector('.gin-sticky-form-actions');
      if (!newParent) { return }

      // If form updates, update form IDs.
      if (context.classList?.contains('gin--has-sticky-form-actions') && context.getAttribute('id')) {
        this.updateLabelIds(newParent, context);
      }

      once('ginEditForm', '.region-content form.gin--has-sticky-form-actions', context).forEach(form => {
        // Sync form ID.
        this.updateLabelIds(newParent, context);

        // Move focus to sticky header.
        this.moveFocus(newParent, form);
      });

      // More actions menu toggle
      once('ginMoreActionsToggle', '.gin-more-actions__trigger', context).forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.toggleMoreActions();
        document.addEventListener('click', this.closeMoreActionsOnClickOutside, false);
      }));
    },

    updateLabelIds: function (newParent, form) {
      // Attach form elements to main form
      const formActions = form.querySelector('[data-drupal-selector="edit-actions"]');
      const actionButtons = Array.from(formActions.children);

      if (actionButtons.length > 0) {
        actionButtons.forEach((el) => {
          const drupalSelector = el.dataset.drupalSelector;
          const buttonSelector = newParent.querySelector(`label[data-gin-sticky-form-selector="${drupalSelector}"]`);

          if (buttonSelector) {
            buttonSelector.setAttribute('for', el.id);

            // Add event listener to trigger click on spacebar or enter key
            buttonSelector.addEventListener('keydown', (e) => {
              if (event.key === ' ' || event.key === 'Enter') {
                e.preventDefault();
                e.target.click();
              }
            });
          }
        });
      }
    },

    moveFocus: function (newParent, form) {
      once('ginMoveFocusToStickyBar', '[gin-move-focus-to-sticky-bar]', form).forEach(el => el.addEventListener('focus', e => {
        e.preventDefault();
        const focusableElements = ['label, button, input, select, textarea'];

        // Moves focus to first item.
        newParent.querySelector(focusableElements).focus();

        // Add temporary element to handle moving focus back to end of form.
        const markup = '<a href="#" class="visually-hidden" role="button" gin-move-focus-to-end-of-form>Moves focus back to form</a>';
        let element = document.createElement('div');
        element.style.display = 'contents';
        element.innerHTML = markup;
        newParent.appendChild(element);

        document.querySelector('[gin-move-focus-to-end-of-form]').addEventListener('focus', eof => {
          eof.preventDefault();

          // Let's remove ourselves.
          element.remove();

          // Let's try to move focus back to end of form.
          if (e.target.nextElementSibling) {
            e.target.nextElementSibling.focus();
          } else if (e.target.parentNode.nextElementSibling) {
            e.target.parentNode.nextElementSibling.focus();
          }
        });
      }));
    },

    toggleMoreActions: function () {
      const trigger = document.querySelector('.gin-more-actions__trigger');
      const value = trigger.classList.contains('is-active');

      if (value) {
        this.hideMoreActions();
      } else {
        this.showMoreActions();
      }
    },

    showMoreActions: function () {
      const trigger = document.querySelector('.gin-more-actions__trigger');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.classList.add('is-active');
    },

    hideMoreActions: function () {
      const trigger = document.querySelector('.gin-more-actions__trigger');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.classList.remove('is-active');
      document.removeEventListener('click', this.closeMoreActionsOnClickOutside);
    },

    closeMoreActionsOnClickOutside: function (e) {
      const trigger = document.querySelector('.gin-more-actions__trigger');

      if (trigger.getAttribute('aria-expanded') === "false") return;

      if (!e.target.closest('.gin-more-actions')) {
        Drupal.ginStickyFormActions.hideMoreActions();
      }
    },

  };
})(Drupal);
