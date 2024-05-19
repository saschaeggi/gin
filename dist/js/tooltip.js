((Drupal, once, _ref) => {
  let {computePosition, offset, shift, flip} = _ref;
  Drupal.theme.ginTooltipWrapper = (dataset, title) => `<div class="gin-tooltip ${dataset.drupalTooltipClass || ""}">\n      ${dataset.drupalTooltip || title}\n    </div>`, 
  Drupal.behaviors.ginTooltipInit = {
    attach: context => {
      once("ginTooltipInit", "[data-gin-tooltip]", context).forEach((trigger => {
        const title = trigger.title;
        title && (trigger.title = ""), trigger.insertAdjacentHTML("afterend", Drupal.theme.ginTooltipWrapper(trigger.dataset, title));
        const tooltip = trigger.nextElementSibling, updatePosition = () => {
          computePosition(trigger, tooltip, {
            strategy: "absolute",
            placement: trigger.dataset.drupalTooltipPosition || "bottom-end",
            middleware: [ flip({
              padding: 16
            }), offset(6), shift({
              padding: 16
            }) ]
          }).then((_ref2 => {
            let {x, y} = _ref2;
            Object.assign(tooltip.style, {
              left: `${x}px`,
              top: `${y}px`
            });
          }));
        };
        new ResizeObserver(updatePosition).observe(trigger), new MutationObserver(updatePosition).observe(trigger, {
          attributes: !0,
          childList: !0,
          subtree: !0
        }), trigger.addEventListener("mouseover", updatePosition), trigger.addEventListener("focus", updatePosition);
      }));
    }
  };
})(Drupal, once, FloatingUIDOM);