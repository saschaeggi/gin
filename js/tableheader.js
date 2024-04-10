((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: (context) => {
      Drupal.ginTableHeader.init(context);
    },
  };

  Drupal.ginTableHeader = {
    init: function (context) {
      // Tables with new position-sticky enabled.
      // Fix for overflow issue.
      once('ginTableHeaderSticky', 'table.position-sticky', context).forEach(el => {
        // Prepare table.
        this.prepareTableHeader(el);

        // Watch sticky table header.
        const observer = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) {
              window.addEventListener('scroll', () => {
                this.setScrollBehavior(el)
              });

            } else {
              window.removeEventListener('scroll', this.setScrollBehavior);
              this.resetScrollBehavior(el);
            }

            Drupal.displace(true);
          },
          { threshold: 1.0, rootMargin: `-60px 0px 0px 0px` }
        );

        // Watch thead.
        observer.observe(el.querySelector('thead'));
      });
    },
    prepareTableHeader: function (el) {
      // Fixes whitespace issue in Chrome.
      document.body.style.overflowX = 'hidden';

      // Set inital placement after DOM is loaded.
      window.addEventListener('DOMContentLoaded', () => {
        Drupal.displace(true);
        this.setScrollBehavior(el);
      });
    },
    setScrollBehavior: function (el) {
      let value = 0;
      const thead = el.querySelector('thead');

      if (thead.parentNode.getBoundingClientRect().top * -1 >= -60) {
        value = Math.round((thead.parentNode.getBoundingClientRect().top * -1) + Drupal.displace.offsets.top - 3);
      }

      thead.style.transform = `translate3d(0, ${value}px, 0)`;
    },
    resetScrollBehavior: function (el) {
      el.querySelector('thead').style.transform = '';
    },

  };

})(Drupal, once);
