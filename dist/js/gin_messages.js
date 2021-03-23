!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginMessagesDismiss = {
    attach: function(context, settings) {
      $(".messages .button--dismiss").once("messages-dismiss").click((function(event) {
        event.preventDefault();
        var $elem = $(this).parents(".messages-list__item");
        $elem.css("opacity", 0), $elem.bind("transitionend", (function() {
          $(this).addClass("visually-hidden"), $(this).css("opacity", 1);
        }));
      }));
    }
  };
}(jQuery, Drupal, drupalSettings);