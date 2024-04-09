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
      const thHeight = `${el.querySelector("thead th").offsetHeight}px`;
      el.querySelectorAll("thead .sticky-header__content").forEach((th => {
        th.parentNode.style.height = thHeight, th.style.height = thHeight;
      })), window.addEventListener("DOMContentLoaded", (() => {
        Drupal.displace(!0), this.setScrollBehavior(el);
      }));
    },
    setScrollBehavior: function(el) {
      el.querySelectorAll("thead .sticky-header__content").forEach((th => {
        let value = 0;
        -1 * th.parentNode.getBoundingClientRect().top >= -60 && (value = -1 * th.parentNode.getBoundingClientRect().top + Drupal.displace.offsets.top - 3), 
        th.style.transform = `translate3d(0, ${value}px, 0)`;
      }));
    },
    resetScrollBehavior: function(el) {
      el.querySelectorAll("thead .sticky-header__content").forEach((th => {
        th.style.transform = "";
      }));
    }
  };
})(Drupal, once);