!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginEditForm = {
    attach: function() {
      var form = document.querySelector(".region-content form"), sticky = document.querySelector(".gin-sticky").cloneNode(!0), newParent = document.querySelector(".region-sticky__items__inner");
      0 === newParent.querySelectorAll(".gin-sticky").length && (newParent.appendChild(sticky), 
      newParent.querySelectorAll('input[type="submit"]').forEach((function(el) {
        el.setAttribute("form", form.id), el.setAttribute("id", el.getAttribute("id") + "--gin-edit-form");
      })), setTimeout((function() {
        sticky.classList.add("gin-sticky--visible");
      })));
    }
  };
}(jQuery, Drupal, drupalSettings);