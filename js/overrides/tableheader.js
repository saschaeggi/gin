((Drupal, once) => {
  Drupal.behaviors.ginStickyTable = {
    attach: function attach(context) {
      const ginStickyTable = once('ginStickyTable', context.querySelectorAll('.sticky-enabled'));
      ginStickyTable.forEach(el => {
        // Watch sticky table header
        const observer = new IntersectionObserver(
          ([e]) => {
            context.querySelector('.gin-table-scroll-wrapper').classList.toggle('--is-sticky', e.intersectionRatio < 1);
            if (document.querySelectorAll('table.sticky-header').length === 0) {
              this.createStickyHeader(el);
              this.syncSelectAll();
            }
          },
          { threshold: [1], rootMargin: `-${this.stickyPosition()}px 0px 0px 0px` }
        );
        observer.observe(el.querySelector('thead'));
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
    createStickyHeader: (table) => {
      const header = table.querySelectorAll(':scope > thead')[0];
      const stickyTable = document.createElement('table');
      stickyTable.className = 'sticky-header';
      stickyTable.append(header.cloneNode(true));
      table.insertBefore(stickyTable, header);

      header.querySelectorAll('th').forEach((el, i) => {
        document.querySelectorAll('table.sticky-header > thead th')[i].style.width = `${el.offsetWidth}px`;
      });
    },
    syncSelectAll: () => {
      const tableStickySelectAll = once('tableStickySelectAll', document.querySelector('table.sticky-header').querySelectorAll('th.select-all'));
      tableStickySelectAll.forEach(el => {
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
  };
})(Drupal, once);
