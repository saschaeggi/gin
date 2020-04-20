/* eslint-disable func-names, no-mutable-exports, no-continue, comma-dangle, strict */

'use strict';

(($, Drupal) => {
  Drupal.behaviors.tableSelect = {
    attach: function attach(context) {
      $(context)
        .find('th.select-all')
        .closest('table')
        .once('table-select')
        .each(Drupal.tableSelect);
    }
  };

  Drupal.tableSelect = function () {
    if ($(this).find('td input[type="checkbox"]').length === 0) {
      return;
    }

    const table = this;
    let checkboxes = 0;
    let lastChecked = 0;
    const $table = $(table);
    const strings = {
      selectAll: Drupal.t('Select all rows in this table'),
      selectNone: Drupal.t('Deselect all rows in this table')
    };
    const setClass = 'is-sticky';
    const $stickyHeader = $table
      .parent()
      .find('[data-drupal-selector*="edit-header"]');
    const updateSelectAll = function updateSelectAll(state) {
      $table
        .prev('table.sticky-header')
        .addBack()
        .find('th.select-all input[type="checkbox"]')
        .each(function () {
          const $checkbox = $(this);
          const stateChanged = $checkbox.prop('checked') !== state;

          $checkbox.attr('title', state ? strings.selectNone : strings.selectAll);

          if (stateChanged) {
            $checkbox.prop('checked', state).trigger('change');
          }
        });
    };
    const updateSticky = function updateSticky(state) {
      if (state === true) {
        $stickyHeader.addClass(setClass);
      }
      else {
        $stickyHeader.removeClass(setClass);
      }
    };

    $table
      .find('th.select-all')
      .prepend($(Drupal.theme('checkbox')).attr('title', strings.selectAll))
      .on('click', (event) => {
        if ($(event.target).is('input[type="checkbox"]')) {
          checkboxes.each(function () {
            const $checkbox = $(this);
            const stateChanged = $checkbox.prop('checked') !== event.target.checked;

            if (stateChanged) {
              $checkbox.prop('checked', event.target.checked).trigger('change');
            }

            $checkbox.closest('tr').toggleClass('selected', this.checked);
          });

          updateSelectAll(event.target.checked);
          updateSticky(event.target.checked);
        }
      });

    checkboxes = $table
      .find('td input[type="checkbox"]:enabled')
      .on('click', function (e) {
        $(this)
          .closest('tr')
          .toggleClass('selected', this.checked);

        if (e.shiftKey && lastChecked && lastChecked !== e.target) {
          Drupal.tableSelectRange($(e.target).closest('tr')[0], $(lastChecked).closest('tr')[0], e.target.checked);
        }

        updateSelectAll(checkboxes.length === checkboxes.filter(':checked').length);
        updateSticky(Boolean(Number(checkboxes.filter(':checked').length)));

        lastChecked = e.target;
      });

    updateSelectAll(checkboxes.length === checkboxes.filter(':checked').length);
    updateSticky(Boolean(Number(checkboxes.filter(':checked').length)));
  };

  Drupal.tableSelectRange = function (from, to, state) {
    const mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

    for (let i = from[mode]; i; i = i[mode]) {
      const $i = $(i);

      if (i.nodeType !== 1) {
        continue;
      }

      $i.toggleClass('selected', state);
      $i.find('input[type="checkbox"]').prop('checked', state);

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
})(jQuery, Drupal);
