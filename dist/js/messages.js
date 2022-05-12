(($, Drupal, drupalSettings) => {
  Drupal.behaviors.ginMessagesDismiss = {
    attach: function(context) {
      $(".js-message-close", context).once("messages-dismiss").click((function(event) {
        event.preventDefault();
        const $elem = $(this).parents(".messages-list");
        $elem.css("opacity", 0), $elem.bind("transitionend", (function() {
          $(this).addClass("visually-hidden"), $(this).css("opacity", 1);
        }));
      }));
    }
  }, Drupal.theme.message = (_ref, _ref2) => {
    let {text} = _ref, {type, id} = _ref2;
    const messagesTypes = Drupal.Message.getMessageTypeLabels(), messageWrapper = document.createElement("div");
    return messageWrapper.setAttribute("class", `messages messages--${type}`), messageWrapper.setAttribute("role", "error" === type || "warning" === type ? "alert" : "status"), 
    messageWrapper.setAttribute("aria-labelledby", `${id}-title`), messageWrapper.setAttribute("data-drupal-message-id", id), 
    messageWrapper.setAttribute("data-drupal-message-type", type), messageWrapper.innerHTML = `\n      <div class="messages__header">\n        <h2 id="${id}-title" class="messages__title">\n          <button type="button" class="button button--dismiss js-message-close" title="${Drupal.t("Dismiss")}"><span class="icon-close"></span>${Drupal.t("Close")}</button>\n          ${messagesTypes[type]}\n        </h2>\n      </div>\n      <div class="messages__content">\n        ${text}\n      </div>\n    `, 
    Drupal.behaviors.ginMessagesDismiss.attach(messageWrapper), messageWrapper;
  };
})(jQuery, Drupal, drupalSettings);