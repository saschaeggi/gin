((Drupal, once, { computePosition, offset, shift, flip }) => {
  /**
   * Theme function for a tooltip.
   *
   * @param {object} dataset
   *   The dataset object.
   * @param {string} dataset.drupalTooltipClass
   *   Extra class for theming.
   * @param {string} dataset.drupalTooltip
   *   The text for tooltip.
   * @param {string} dataset.title
   *   Fallback text for tooltip.
   *
   * @return {HTMLElement}
   *   A DOM Node.
   */
  Drupal.theme.ginTooltipWrapper = (dataset, title) =>
    `<div class="gin-tooltip ${dataset.drupalTooltipClass || ''}">
      ${dataset.drupalTooltip || title}
    </div>`;

  /**
   * Attaches the tooltip behavior to all required triggers.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the tooltip behavior.
   */
  Drupal.behaviors.ginTooltipInit = {
    attach: (context) => {
      once('ginTooltipInit', '[data-gin-tooltip]', context).forEach(
        (trigger) => {
          const title = trigger.title;

          // Remove title attribute
          if (title) {
            trigger.title = '';
          }

          trigger.insertAdjacentHTML(
            'afterend',
            Drupal.theme.ginTooltipWrapper(trigger.dataset, title),
          );
          const tooltip = trigger.nextElementSibling;

          const updatePosition = () => {
            computePosition(trigger, tooltip, {
              strategy: 'absolute',
              placement: trigger.dataset.drupalTooltipPosition || 'bottom-end',
              middleware: [
                flip({ padding: 16 }),
                offset(6),
                shift({ padding: 16 }),
              ],
            }).then(({ x, y }) => {
              Object.assign(tooltip.style, {
                left: `${x}px`,
                top: `${y}px`,
              });
            });
          };

          // Small trick to avoid tooltip stays on same place when button size changed.
          const ro = new ResizeObserver(updatePosition);
          ro.observe(trigger);

          const mo = new MutationObserver(updatePosition);
          mo.observe(trigger, {
            attributes: true,
            childList: true,
            subtree: true,
          });

          trigger.addEventListener('mouseover', updatePosition);
          trigger.addEventListener('focus', updatePosition);
        },
      );
    },
  };
})(Drupal, once, FloatingUIDOM);
