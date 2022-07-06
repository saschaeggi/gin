(Drupal => {
  Drupal.behaviors.ginSticky = {
    attach: context => {
      once("ginSticky", document.querySelectorAll(".region-sticky-watcher")).forEach((() => {
        new IntersectionObserver((_ref => {
          let [e] = _ref;
          return context.querySelector(".region-sticky").classList.toggle("region-sticky--is-sticky", e.intersectionRatio < 1);
        }), {
          threshold: [ 1 ]
        }).observe(context.querySelector(".region-sticky-watcher"));
      }));
    }
  };
})(Drupal);