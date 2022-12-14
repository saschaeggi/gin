(Drupal => {
  Drupal.behaviors.ginSticky = {
    attach: context => {
      once("ginSticky", document.querySelectorAll(".region-sticky-watcher")).forEach((() => {
        let f = new IntersectionObserver((_ref => {
          let [e] = _ref;
          return context.querySelector(".region-sticky").classList.toggle("region-sticky--is-sticky", e.intersectionRatio < 1);
        }), {
          threshold: [ 1 ]
        });
        let g = context.querySelector(".region-sticky-watcher");
        if (g) {
          f.observe(g);
        }
      }));
    }
  };
})(Drupal);
