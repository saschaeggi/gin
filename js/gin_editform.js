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

        newParent.querySelectorAll('input[type="submit"]')
            .forEach((el) => {
              el.setAttribute('form', form.id);
              el.setAttribute('id', el.getAttribute('id') + '--gin-edit-form');
            });

        setTimeout(() => {
          sticky.classList.add('gin-sticky--visible');
        });
      }
    }
  };
})(jQuery, Drupal, drupalSettings);
