((Drupal, once) => {
  Drupal.behaviors.tableSelect = {
    attach: (context) => {
      once('tableSelect', 'th.select-all', context).forEach((el) => {
        if (el.closest('table')) {
          Drupal.tableSelect(el.closest('table'));
        }
      });
    },
  };

  Drupal.tableSelect = (table) => {
    if (table.querySelector('td input[type="checkbox"]') === null) {
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
          const stateChanged = checkbox.checked !== state;
          checkbox.setAttribute(
            'title',
            state ? strings.selectNone : strings.selectAll
          );

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

    const checkedCheckboxes = (checkboxes) => {
      const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.matches(':checked'));
      updateSelectAll(checkboxes.length === checkedCheckboxes.length);
      updateSticky(!!checkedCheckboxes.length);
    };

    table.querySelectorAll('th.select-all').forEach(el => {
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
            e.target.closest('tr'),
            lastChecked.closest('tr'),
            e.target.checked
          );
        }

        checkedCheckboxes(checkboxes);
        lastChecked = e.target;
      });
    });

    checkedCheckboxes(checkboxes);
  };

  Drupal.tableSelectRange = function (from, to, state) {
    const mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

    for (let i = from[mode]; i; i = i[mode]) {
      if (i.nodeType !== 1) {
        continue;
      }

      i.classList.toggle('selected', state);
      i.querySelector('input[type="checkbox"]').checked = state;

      if (to.nodeType) {
        if (i === to) {
          break;
        }
      } else if ([i].filter(y => y === to).length) {
        break;
      }
    }
  };

})(Drupal, once);
