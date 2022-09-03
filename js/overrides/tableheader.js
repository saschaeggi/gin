((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: function attach(context) {
      once('ginTableHeader', '.sticky-enabled', context).forEach(el => {
        // Watch sticky table header.
        const observer = new IntersectionObserver(
          ([e]) => {
            context.querySelector('.gin-table-scroll-wrapper').classList.toggle('--is-sticky', e.intersectionRatio < 1 || window.scrollY > context.querySelector('.gin-table-scroll-wrapper').offsetTop);
          },
          { threshold: [1], rootMargin: `-${this.stickyPosition()}px 0px 0px 0px` }
        );
        observer.observe(el.querySelector('thead'));

        // Create sticky element.
        this.createStickyHeader(el);

        // SelectAll handling.
        this.syncSelectAll();

        // Watch resize event.
        window.onresize = () => {
          Drupal.debounce(this.handleResize(el), 150);
        };
      });
    },
    stickyPosition: () => {
      let offsetTop = 0;
      if (!document.body.classList.contains('gin--classic-toolbar')) {
        offsetTop = document.querySelector('#gin-toolbar-bar').clientHeight + document.querySelector('.region-sticky').clientHeight;
      } else {
        offsetTop = document.querySelector('#toolbar-bar').clientHeight;
      }

      return offsetTop;
    },
    createStickyHeader: function createStickyHeader(table) {
      const header = table.querySelectorAll(':scope > thead')[0];
      const stickyTable = document.createElement('table');
      stickyTable.className = 'sticky-header';
      stickyTable.append(header.cloneNode(true));
      table.insertBefore(stickyTable, header);
      this.handleResize(table);
    },
    syncSelectAll: () => {
      document.querySelectorAll('table.sticky-header th.select-all').forEach(el => {
        const table = el.closest('table');
        table
          .querySelectorAll('th.select-all')
          .forEach(el => {
            el.addEventListener('click', event => {
              if (event.target.matches('input[type="checkbox"]')) {
                table
                  .nextSibling
                  .querySelectorAll('th.select-all')
                  .forEach(el => {
                    el.childNodes[0].click();
                  });
              }
            });
          });
      });
    },
    handleResize: (table) => {
      const header = table.querySelectorAll(':scope > thead')[0];
      header.querySelectorAll('th').forEach((el, i) => {
        document.querySelectorAll('table.sticky-header > thead th')[i].style.width = `${el.offsetWidth}px`;
      });
    },
  };
})(Drupal, once);
