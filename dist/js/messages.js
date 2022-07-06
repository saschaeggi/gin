(Drupal => {
  Drupal.behaviors.ginMessagesDismiss = {
    attach: context => {
      once("ginMessagesDismiss", context.querySelectorAll(".messages .button--dismiss")).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault();
        const listItem = e.currentTarget.closest(".messages-list__item");
        listItem.style.opacity = 0, listItem.classList.add("visually-hidden");
      }))));
    }
  };
})(Drupal);