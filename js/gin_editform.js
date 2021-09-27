/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginEditForm = {
    attach: function attach() {
      const form = document.querySelector('.region-content form');
      const sticky = document.querySelector('.gin-sticky').cloneNode(true);
      const newParent = document.querySelector('.region-sticky__items__inner');

      if (newParent.querySelectorAll('.gin-sticky').length === 0) {
        newParent.appendChild(sticky);

        // Input Elements
        newParent.querySelectorAll('input[type="submit"]')
          .forEach((el) => {
            el.setAttribute('form', form.getAttribute('id'));
            el.setAttribute('id', el.getAttribute('id') + '--gin-edit-form');
          });

        // Make Published Status reactive
        document.querySelectorAll('.field--name-status [name="status[value]"]').forEach((publishedState) => {
          publishedState.addEventListener('click', (event) => {
            const value = event.target.checked;
            // Sync value
            document.querySelectorAll('.field--name-status [name="status[value]"]').forEach((publishedState) => {
              publishedState.checked = value;
            });
          });
        });

        setTimeout(() => {
          sticky.classList.add('gin-sticky--visible');
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
