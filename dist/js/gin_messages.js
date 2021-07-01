!function($, Drupal, drupalSettings) {
  Drupal.behaviors.ginMessagesDismiss = {
    attach: function(context) {
      $(".js-message-close", context), $(".js-message-close", context).once("messages-dismiss").click((function(event) {
        event.preventDefault();
        var $elem = $(this).parents(".messages-list");
        $elem.css("opacity", 0), $elem.bind("transitionend", (function() {
          $(this).addClass("visually-hidden"), $(this).css("opacity", 1);
        }));
      }));
    }
  };
}(jQuery, Drupal, drupalSettings);