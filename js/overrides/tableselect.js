/* eslint-disable no-bitwise, no-nested-ternary, no-mutable-exports, comma-dangle, strict */

'use strict';

((Drupal) => {
  Drupal.behaviors.tableSelect = {
    attach: (context) => {
      const tableSelect = once('tableSelect', context.querySelectorAll('th.select-all'));
      tableSelect.forEach(el => {
        if (el.closest('table')) {
          Drupal.tableSelect(el.closest('table'));
        }
      });
    }
  };

  Drupal.tableSelect = (table) => {
    if (table.querySelectorAll('td input[type="checkbox"]').length === 0) {
      return;
    }

    let checkboxes = 0;
    let lastChecked = 0;
    const strings = {
      selectAll: Drupal.t('Select all rows in this table'),
      selectNone: Drupal.t('Deselect all rows in this table')
    };
    const updateSelectAll = (state) => {
      table
        .querySelectorAll('th.select-all input[type="checkbox"]')
        .forEach(checkbox => {
          var stateChanged = checkbox.checked !== state;
          checkbox.setAttribute('title', state ? strings.selectNone : strings.selectAll);

          if (stateChanged) {
            checkbox.checked = state;
            checkbox.dispatchEvent(new Event('change'));
          }
        });
    };

    const setClass = 'is-sticky';
    const stickyHeader = table
      .closest('form')
      .querySelector('[data-drupal-selector*="edit-header"]');

    const updateSticky = (state) => {
      if (state === true) {
        stickyHeader.classList.add(setClass);
      }
      else {
        stickyHeader.classList.remove(setClass);
      }
    };

    table
      .querySelectorAll('th.select-all')
      .forEach(el => {
        el.innerHTML = Drupal.theme('checkbox') + el.innerHTML;
        el.querySelector('.form-checkbox').setAttribute('title', strings.selectAll);
        el.addEventListener('click', event => {
          if (event.target.matches('input[type="checkbox"]')) {
            checkboxes.forEach(checkbox => {
              const stateChanged = checkbox.checked !== event.target.checked;

              if (stateChanged) {
                checkbox.checked = event.target.checked;
                checkbox.dispatchEvent(new Event('change'));
              }

              checkbox.closest('tr').classList.toggle('selected', checkbox.checked);
            });

            updateSelectAll(event.target.checked);
            updateSticky(event.target.checked);
          }
        });
      });

    checkboxes = table.querySelectorAll('td input[type="checkbox"]:enabled');
    checkboxes.forEach(el => {
        el.addEventListener('click', e => {
          e.target
            .closest('tr')
            .classList.toggle('selected', this.checked);

          if (e.shiftKey && lastChecked && lastChecked !== e.target) {
            Drupal.tableSelectRange(
              document.querySelector(e.target).closest('tr')[0],
              document.querySelector(lastChecked).closest('tr')[0], e.target.checked
            );
          }

          const checkedCheckboxes = Array.from(checkboxes).filter(el => el.matches(':checked'));
          updateSelectAll(checkboxes.length === checkedCheckboxes.length);
          updateSticky(Boolean(checkedCheckboxes.length));

          lastChecked = e.target;
        });
      });

    const checkedCheckboxes = Array.from(checkboxes).filter(el => el.matches(':checked'));
    updateSelectAll(checkboxes.length === checkedCheckboxes.length);
    updateSticky(checkedCheckboxes.length);
  };

  Drupal.tableSelectRange = (from, to, state) => {
    var mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

    for (var i = from[mode]; i; i = i[mode]) {
      var $i = $(i);

      if (i.nodeType !== 1) {
        continue;
      }

      $i.classList.toggle('selected', state);
      $i.querySelectorAll('input[type="checkbox"]').checked = state;

      if (to.nodeType) {
        if (i === to) {
          break;
        }
      }
      else if ($.filter(to, [i]).r.length) {
        break;
      }
    }
  };
})(Drupal);
