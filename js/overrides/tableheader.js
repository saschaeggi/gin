((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: (context) => {
      Drupal.ginTableHeader.init(context);
    },
  };

  Drupal.ginTableHeader = {
    init: function (context) {
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
      const header = table.querySelector(':scope > thead');
      const stickyTable = document.createElement('table');
      stickyTable.className = 'sticky-header';
      stickyTable.append(header.cloneNode(true));
      table.insertBefore(stickyTable, header);
      this.handleResize(table);
    },
    syncSelectAll: () => {
      document.querySelectorAll('table.sticky-header th.select-all').forEach(tableHeaderSticky => {
        const table = tableHeaderSticky.closest('table');
        table.querySelectorAll(':scope th.select-all').forEach(tableHeader => {
          tableHeader.addEventListener('click', event => {
            if (event.target.matches('input[type="checkbox"]')) {
              table.nextSibling.querySelectorAll('th.select-all').forEach(siblingTableHeader => {
                siblingTableHeader.childNodes[0].click();
              });
            }
          });
        });
      });
    },
    handleResize: (table) => {
      const header = table.querySelector(':scope > thead');
      header.querySelectorAll('th').forEach((el, i) => {
        table.querySelector(`table.sticky-header > thead th:nth-of-type(${i+1})`).style.width = `${el.offsetWidth}px`;
      });
    },
  };

})(Drupal, once);
