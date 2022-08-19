((Drupal, drupalSettings, once) => {
  Drupal.behaviors.ginToolbar = {
    attach: function() {
      Drupal.ginToolbar.init();
    }
  }, Drupal.behaviors.ginEscapeAdmin = {
    attach: () => {
      once("ginEscapeAdmin", document.querySelector("[data-gin-toolbar-escape-admin]")).forEach((el => {
        const escapeAdminPath = sessionStorage.getItem("escapeAdminPath");
        drupalSettings.path.currentPathIsAdmin && null !== escapeAdminPath && el.setAttribute("href", escapeAdminPath);
      }));
    }
  }, Drupal.ginToolbar = {
    init: function() {
      "classic" != drupalSettings.gin.toolbar_variant && localStorage.getItem("Drupal.toolbar.trayVerticalLocked") && localStorage.removeItem("Drupal.toolbar.trayVerticalLocked"), 
      "true" === localStorage.getItem("Drupal.gin.toolbarExpanded") ? (document.body.setAttribute("data-toolbar-menu", "open"), 
      document.querySelector(".toolbar-menu__trigger").classList.add("is-active")) : (document.body.setAttribute("data-toolbar-menu", ""), 
      document.querySelector(".toolbar-menu__trigger").classList.remove("is-active")), 
      once("ginToolbarShortcut", document.querySelector("#gin-toolbar-bar")).forEach((() => document.addEventListener("keydown", (e => {
        !0 === e.altKey && "KeyT" === e.code && this.toggleToolbar();
      })))), once("ginToolbarToggle", document.querySelector(".toolbar-menu__trigger")).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.toggleToolbar();
      }))));
    },
    toggleToolbar: () => {
      const $this = document.querySelector(".toolbar-menu__trigger");
      $this.classList.toggle("is-active");
      let active = "true";
      if ($this.classList.contains("is-active")) document.body.setAttribute("data-toolbar-menu", "open"); else {
        document.body.setAttribute("data-toolbar-menu", ""), active = "false";
        const elementToRemove = document.querySelector(".gin-toolbar-inline-styles");
        elementToRemove && elementToRemove.parentNode.removeChild(elementToRemove);
      }
      localStorage.setItem("Drupal.gin.toolbarExpanded", active);
      const event = new CustomEvent("toolbar-toggle", {
        detail: "true" === active
      });
      document.dispatchEvent(event);
    }
  };
})(Drupal, drupalSettings, once);