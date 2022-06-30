(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginMessagesDismiss = {
    attach: function(context) {
      const $messagesClick = $(".messages .button--dismiss", context).click((function(event) {
        event.preventDefault();
        const $elem = $(this).parents(".messages-list__item");
        $elem.css("opacity", 0), $elem.bind("transitionend", (function() {
          $(this).addClass("visually-hidden"), $(this).css("opacity", 1);
        }));
      }));
      once("messages-dismiss", $messagesClick);
    }
  };
})(jQuery, Drupal, drupalSettings);