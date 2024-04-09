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
        // Watch sticky table header.
        const observer = new IntersectionObserver(
          ([e]) => {
            if (!e.isIntersecting) {
              window.addEventListener('scroll', handleScroll);
            } else {
              window.removeEventListener('scroll', handleScroll);
              el.querySelectorAll('thead .sticky-header__content').forEach(th => {
                th.style.transform = '';
              });
            }

            Drupal.displace(true);
          },
          { threshold: 1.0, rootMargin: `-60px 0px 0px 0px` }
        );
        observer.observe(el.querySelector('thead'));

        const thHeight = `${el.querySelector('thead th').offsetHeight}px`;
        el.querySelectorAll('thead .sticky-header__content').forEach(th => {
          th.parentNode.style.height = thHeight;
          th.style.height = thHeight;
        });

        function handleScroll() {
          el.querySelectorAll('thead .sticky-header__content').forEach(th => {
            let value = 0;

            if (th.parentNode.getBoundingClientRect().top * -1 >= -60) {
              value = (th.parentNode.getBoundingClientRect().top * -1) + Drupal.displace.offsets.top - 3;
            }

            th.style.transform = `translate3d(0, ${value}px, 0)`;
          });
        }
      });
    },
  };

})(Drupal, once);
