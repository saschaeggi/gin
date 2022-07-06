((Drupal, drupalSettings) => {
  Drupal.behaviors.ginToolbarToggle = {
    attach: () => {
      "classic" != drupalSettings.gin.toolbar_variant && localStorage.getItem("Drupal.toolbar.trayVerticalLocked") && localStorage.removeItem("Drupal.toolbar.trayVerticalLocked"), 
      "true" === localStorage.getItem("Drupal.gin.toolbarExpanded") ? (document.body.setAttribute("data-toolbar-menu", "open"), 
      document.querySelector(".toolbar-menu__trigger").classList.add("is-active")) : (document.body.setAttribute("data-toolbar-menu", ""), 
      document.querySelector(".toolbar-menu__trigger").classList.remove("is-active")), 
      once("ginToolbarShortcut", document.querySelector("#gin-toolbar-bar")).forEach((() => document.addEventListener("keydown", (e => {
        !0 === e.altKey && "KeyT" === e.code && Drupal.behaviors.ginToolbarToggle.toggleToolbar();
      })))), once("ginToolbarToggle", document.querySelector(".toolbar-menu__trigger")).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), Drupal.behaviors.ginToolbarToggle.toggleToolbar();
      }))));
    },
    toggleToolbar: () => {
      const $this = document.querySelector(".toolbar-menu__trigger");
      $this.classList.toggle("is-active");
      let active = "true";
      if ($this.classList.contains("is-active")) document.body.setAttribute("data-toolbar-menu", "open"); else if (document.body.setAttribute("data-toolbar-menu", ""), 
      active = "false", document.querySelectorAll(".gin-toolbar-inline-styles").length > 0) {
        const removeElement = document.querySelector(".gin-toolbar-inline-styles");
        removeElement.parentNode.removeChild(removeElement);
      }
      localStorage.setItem("Drupal.gin.toolbarExpanded", active);
      const event = new CustomEvent("toolbar-toggle", {
        detail: "true" === active
      });
      document.dispatchEvent(event);
    }
  }, Drupal.behaviors.ginEscapeAdmin = {
    attach: () => {
      once("ginEscapeAdmin", document.querySelector("[data-gin-toolbar-escape-admin]")).forEach((el => {
        const escapeAdminPath = sessionStorage.getItem("escapeAdminPath");
        drupalSettings.path.currentPathIsAdmin && null !== escapeAdminPath && el.setAttribute("href", escapeAdminPath);
      }));
    }
  };
})(Drupal, drupalSettings);