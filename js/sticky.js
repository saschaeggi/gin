/* eslint-disable no-bitwise, no-nested-ternary, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal) => {
  Drupal.behaviors.ginSticky = {
    attach: (context) => {
      const ginSticky = once('ginSticky', document.querySelectorAll('.region-sticky-watcher'));
      ginSticky.forEach(() => {
        // Watch sticky header
        const observer = new IntersectionObserver(
          ([e]) => context.querySelector('.region-sticky').classList.toggle('region-sticky--is-sticky', e.intersectionRatio < 1),
          { threshold: [1] }
        );
        observer.observe(context.querySelector('.region-sticky-watcher'));
      });
    }
  };
})(Drupal);
