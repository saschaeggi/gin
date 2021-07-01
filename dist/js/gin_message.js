!function(Drupal) {
  Drupal.theme.message = function(_ref, _ref2) {
    var text = _ref.text, type = _ref2.type, id = _ref2.id, messagesTypes = Drupal.Message.getMessageTypeLabels(), messageWrapper = document.createElement("div");
    return messageWrapper.setAttribute("class", "messages messages--".concat(type)), 
    messageWrapper.setAttribute("role", "error" === type || "warning" === type ? "alert" : "status"), 
    messageWrapper.setAttribute("aria-labelledby", "".concat(id, "-title")), messageWrapper.setAttribute("data-drupal-message-id", id), 
    messageWrapper.setAttribute("data-drupal-message-type", type), messageWrapper.innerHTML = '\n    <div class="messages__header">\n      <h2 id="'.concat(id, '-title" class="messages__title">\n        <button type="button" class="button button--dismiss js-message-close" title="Dismiss"><span class="icon-close"></span>').concat(Drupal.t("Close"), "</button>\n        ").concat(messagesTypes[type], '\n      </h2>\n    </div>\n    <div class="messages__content">\n      ').concat(text, "\n    </div>\n  "), 
    Drupal.behaviors.ginMessagesDismiss.attach(messageWrapper), messageWrapper;
  };
}(Drupal);