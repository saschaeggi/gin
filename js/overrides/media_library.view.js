((Drupal) => {
  Drupal.behaviors.MediaLibrarySelectAll = {
    attach: function attach(context) {
      const views = once('media-library-select-all', document.querySelectorAll('.js-media-library-view[data-view-display-id="page"]'));
      views.forEach(el => {
        if (el.querySelectorAll('.js-media-library-item').length) {
          const header = document.querySelector('.media-library-views-form');
          const selectAll = document.createElement('label');
          selectAll.className = 'media-library-select-all';
          selectAll.innerHTML = Drupal.theme('checkbox') + Drupal.t('Select all media');
          header.prepend(selectAll);

          selectAll.children[0].addEventListener('click', e => {
            const currentTarget = e.currentTarget;
            const checkboxes = currentTarget
              .closest('.js-media-library-view')
              .querySelectorAll('.js-media-library-item .form-boolean');

            checkboxes.forEach(checkbox => {
              const stateChanged = checkbox.checked !== currentTarget.checked;

              if (stateChanged) {
                checkbox.checked = currentTarget.checked;
                checkbox.dispatchEvent(new Event('change'));
              }
            });

            const announcement = currentTarget.checked ? Drupal.t('All @count items selected', {
              '@count': checkboxes.length
            }) : Drupal.t('Zero items selected');
            Drupal.announce(announcement);
          });
        }

        // Media Library select
        context.querySelectorAll('.media-library-view .form-checkbox')
          .forEach(el => {
            el.addEventListener('click', () => {
              Drupal.behaviors.MediaLibrarySelectAll.bulkOperations();
            });
          });

        // Media Library select
        context.querySelectorAll('.media-library-view .media-library-item__click-to-select-trigger')
          .forEach(el => {
            el.addEventListener('click', () => {
              Drupal.behaviors.MediaLibrarySelectAll.bulkOperations();

              const selectAll = document.querySelector('.media-library-select-all .form-boolean');
              const checkboxes = document.querySelectorAll('.media-library-view .media-library-item .form-boolean');

              if (selectAll.checked === true && checkboxes.length !== Array.from(checkboxes).filter(el => el.checked === true).length) {
                selectAll.checked = false;
                selectAll.dispatchEvent(new Event('change'));
              } else if (checkboxes.length === Array.from(checkboxes).filter(el => el.checked === true).length) {
                selectAll.checked = true;
                selectAll.dispatchEvent(new Event('change'));
              }
            });
          });
      });
    },
    bulkOperations: () => {
      const bulkOperations = document.querySelector('.media-library-view [data-drupal-selector*="edit-header"]');

      if (document.querySelectorAll('.media-library-view .form-checkbox:checked').length > 0) {
        bulkOperations.classList.add('is-sticky');
      } else {
        bulkOperations.classList.remove('is-sticky');
      }
    },
  };
})(Drupal);
