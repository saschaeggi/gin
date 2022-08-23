((Drupal, drupalSettings, once) => {
  Drupal.behaviors.ginToolbar = {
    attach: context => {
      Drupal.ginToolbar.init(context);
    }
  }, Drupal.behaviors.ginEscapeAdmin = {
    attach: context => {
      once("ginEscapeAdmin", "[data-gin-toolbar-escape-admin]", context).forEach((el => {
        const escapeAdminPath = sessionStorage.getItem("escapeAdminPath");
        drupalSettings.path.currentPathIsAdmin && null !== escapeAdminPath && el.setAttribute("href", escapeAdminPath);
      }));
    }
  }, Drupal.ginToolbar = {
    init: function(context) {
      "classic" != drupalSettings.gin.toolbar_variant && localStorage.getItem("Drupal.toolbar.trayVerticalLocked") && localStorage.removeItem("Drupal.toolbar.trayVerticalLocked"), 
      "true" === localStorage.getItem("Drupal.gin.toolbarExpanded") ? (document.body.setAttribute("data-toolbar-menu", "open"), 
      document.querySelector(".toolbar-menu__trigger").classList.add("is-active")) : (document.body.setAttribute("data-toolbar-menu", ""), 
      document.querySelector(".toolbar-menu__trigger").classList.remove("is-active")), 
      once("ginToolbarShortcut", "#gin-toolbar-bar", context).forEach((() => document.addEventListener("keydown", (e => {
        !0 === e.altKey && "KeyT" === e.code && this.toggleToolbar();
      })))), once("ginToolbarToggle", ".toolbar-menu__trigger", context).forEach((el => el.addEventListener("click", (e => {
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