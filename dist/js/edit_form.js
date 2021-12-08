!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginEditForm = {
    attach: function() {
      var form = document.querySelector(".region-content form"), sticky = $(".gin-sticky").clone(!0, !0), newParent = document.querySelector(".region-sticky__items__inner");
      if (newParent && 0 === newParent.querySelectorAll(".gin-sticky").length) {
        sticky.appendTo($(newParent));
        var actionButtons = newParent.querySelectorAll('button[type="submit"], input[type="submit"]');
        actionButtons.length > 0 && actionButtons.forEach((function(el) {
          el.setAttribute("form", form.getAttribute("id")), el.setAttribute("id", el.getAttribute("id") + "--gin-edit-form");
        }));
        var statusToggle = document.querySelectorAll('.field--name-status [name="status[value]"]');
        statusToggle.length > 0 && statusToggle.forEach((function(publishedState) {
          publishedState.addEventListener("click", (function(event) {
            var value = event.target.checked;
            statusToggle.forEach((function(publishedState) {
              publishedState.checked = value;
            }));
          }));
        })), setTimeout((function() {
          sticky.addClass("gin-sticky--visible");
        }));
      }
    }
  };
}(jQuery, Drupal, drupalSettings);