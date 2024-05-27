((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: (context) => {
      Drupal.ginTableHeader.init(context);
    },
  };

  Drupal.ginTableHeader = {
    init: function (context) {
      // Tables with new position-sticky enabled.
      once('ginTableHeaderSticky', 'table.position-sticky', context).forEach(el => {
        this.updateTableHeader(el);
        this.showTableHeaderOnInit();

        window.addEventListener('resize', () => {
          this.updateTableHeader(el);
        });
      });
    },
    showTableHeaderOnInit: function () {
      const tableHeader = document.querySelector('.gin--sticky-table-header');

      tableHeader.hidden = false;
      tableHeader.style.display = 'block';

      // Fixes whitespace issue in Chrome.
      document.body.style.overflowX = 'hidden';
    },
    updateTableHeader: function (el) {
      const tableHeader = document.querySelector('.gin--sticky-table-header');

      tableHeader.style.marginBottom = `-${el.querySelector('thead').getBoundingClientRect().height + 1}px`;

      tableHeader.querySelectorAll('thead th').forEach((th, index) => {
        th.style.width = `${el.querySelectorAll('thead th')[index].getBoundingClientRect().width}px`;
      });
    },
  };

})(Drupal, once);
