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
      once('ginEditForm', '.region-content form.gin-sticky-form-actions', context).forEach(form => {
        const sticky = context.querySelector('.gin-sticky');
        const newParent = context.querySelector('.region-sticky__items__inner');

        if (newParent) {
          // If action buttons are not moved via hook, move them via JS.
          if (newParent.querySelectorAll('.gin-sticky').length === 0) {
            newParent.appendChild(sticky);
          } else {
            document.querySelector('.region-content form.gin-sticky-form-actions .gin-sticky')?.remove();
          }

          // Attach form elements to main form
          const actionButtons = newParent.querySelectorAll('button, input, select, textarea');

          if (actionButtons.length > 0) {
            actionButtons.forEach((el) => {
              el.setAttribute('form', form.getAttribute('id'));
            });
          }

          const localActions = document.querySelector('#block-gin-local-actions');

          localActions?.querySelectorAll('.button--primary').forEach(button => {
            button.classList.remove('button--primary');
            button.classList.remove('button--secondary');
          });
        }
      });

      // More actions menu toggle
      once('ginMoreActionsToggle', '.gin-more-actions__trigger', context).forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.toggleMoreActions();
        document.addEventListener('click', this.closeMoreActionsOnClickOutside, false);
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
