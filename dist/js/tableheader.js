((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: context => {
      Drupal.ginTableHeader.init(context);
    }
  }, Drupal.ginTableHeader = {
    init: function(context) {
      once("ginTableHeaderSticky", "table.position-sticky", context).forEach((el => {
        new IntersectionObserver((_ref => {
          let [e] = _ref;
          e.isIntersecting ? (window.removeEventListener("scroll", handleScroll), el.querySelectorAll("thead .sticky-header__content").forEach((th => {
            th.style.transform = "";
          }))) : window.addEventListener("scroll", handleScroll), Drupal.displace(!0);
        }), {
          threshold: 1,
          rootMargin: "-60px 0px 0px 0px"
        }).observe(el.querySelector("thead"));
        const thHeight = `${el.querySelector("thead th").offsetHeight}px`;
        function handleScroll() {
          el.querySelectorAll("thead .sticky-header__content").forEach((th => {
            let value = 0;
            -1 * th.parentNode.getBoundingClientRect().top >= -60 && (value = -1 * th.parentNode.getBoundingClientRect().top + Drupal.displace.offsets.top - 3), 
            th.style.transform = `translate3d(0, ${value}px, 0)`;
          }));
        }
        el.querySelectorAll("thead .sticky-header__content").forEach((th => {
          th.parentNode.style.height = thHeight, th.style.height = thHeight;
        }));
      }));
    }
  };
})(Drupal, once);