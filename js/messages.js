/**
 * @file
 *   Main JavaScript file for Dismiss module
 */

/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal, once) => {
  Drupal.behaviors.ginMessagesDismiss = {
    attach: (context) => {
      const ginMessagesDismiss = once('ginMessagesDismiss', context.querySelectorAll('.messages .button--dismiss'));
      ginMessagesDismiss.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        const listItem = e.currentTarget.closest('.messages-list__item');
        listItem.style.opacity = 0;
        listItem.classList.add('visually-hidden');
      }));
    }
  }
})(Drupal, once);
