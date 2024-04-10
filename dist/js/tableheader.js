((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: context => {
      Drupal.ginTableHeader.init(context);
    }
  }, Drupal.ginTableHeader = {
    init: function(context) {
      once("ginTableHeaderSticky", "table.position-sticky", context).forEach((el => {
        this.prepareTableHeader(el), new IntersectionObserver((_ref => {
          let [e] = _ref;
          e.isIntersecting ? (window.removeEventListener("scroll", this.setScrollBehavior), 
          this.resetScrollBehavior(el)) : window.addEventListener("scroll", (() => {
            this.setScrollBehavior(el);
          })), Drupal.displace(!0);
        }), {
          threshold: 1,
          rootMargin: "-60px 0px 0px 0px"
        }).observe(el.querySelector("thead"));
      }));
    },
    prepareTableHeader: function(el) {
      document.body.style.overflowX = "hidden", window.addEventListener("DOMContentLoaded", (() => {
        Drupal.displace(!0), this.setScrollBehavior(el);
      }));
    },
    setScrollBehavior: function(el) {
      let value = 0;
      const thead = el.querySelector("thead");
      -1 * thead.parentNode.getBoundingClientRect().top >= -60 && (value = Math.round(-1 * thead.parentNode.getBoundingClientRect().top + Drupal.displace.offsets.top - 3)), 
      thead.style.transform = `translate3d(0, ${value}px, 0)`;
    },
    resetScrollBehavior: function(el) {
      el.querySelector("thead").style.transform = "";
    }
  };
})(Drupal, once);