((Drupal, once) => {
  Drupal.behaviors.ginTableHeader = {
    attach: context => {
      Drupal.ginTableHeader.init(context);
    }
  }, Drupal.ginTableHeader = {
    init: function(context) {
      once("ginTableHeaderSticky", "table.position-sticky", context).forEach((el => {
        this.updateTableHeader(el), this.showTableHeaderOnInit(), window.addEventListener("resize", (() => {
          this.updateTableHeader(el);
        })), document.querySelector('.gin--sticky-bulk-select > input[type="checkbox"]').addEventListener("click", (event => {
          event.stopImmediatePropagation(), event.checked = !event.checked, document.querySelector(".gin-table-scroll-wrapper table.sticky-enabled thead .select-all > input").click();
        }));
      }));
    },
    showTableHeaderOnInit: function() {
      const tableHeader = document.querySelector(".gin--sticky-table-header");
      tableHeader && (tableHeader.hidden = !1, tableHeader.style.display = "block", tableHeader.style.visibility = "visible", 
      document.body.style.overflowX = "hidden");
    },
    updateTableHeader: function(el) {
      const tableHeader = document.querySelector(".gin--sticky-table-header");
      tableHeader && (tableHeader.style.marginBottom = `-${el.querySelector("thead").getBoundingClientRect().height + 1}px`, 
      tableHeader.querySelectorAll("thead th").forEach(((th, index) => {
        th.style.width = `${el.querySelectorAll("thead th")[index].getBoundingClientRect().width}px`;
      })));
    }
  };
})(Drupal, once);