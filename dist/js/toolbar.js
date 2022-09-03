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
      once("ginToolbarInit", "#gin-toolbar-bar", context).forEach((() => {
        const toolbarTrigger = document.querySelector(".toolbar-menu__trigger");
        "classic" != drupalSettings.gin.toolbar_variant && localStorage.getItem("Drupal.toolbar.trayVerticalLocked") && localStorage.removeItem("Drupal.toolbar.trayVerticalLocked"), 
        "true" === localStorage.getItem("Drupal.gin.toolbarExpanded") ? (document.body.setAttribute("data-toolbar-menu", "open"), 
        toolbarTrigger.classList.add("is-active")) : (document.body.setAttribute("data-toolbar-menu", ""), 
        toolbarTrigger.classList.remove("is-active")), document.addEventListener("keydown", (e => {
          !0 === e.altKey && "KeyT" === e.code && this.toggleToolbar();
        }));
      })), once("ginToolbarToggle", ".toolbar-menu__trigger", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.toggleToolbar();
      }))));
    },
    toggleToolbar: () => {
      const toolbarTrigger = document.querySelector(".toolbar-menu__trigger");
      toolbarTrigger.classList.toggle("is-active");
      let active = "true";
      if (toolbarTrigger.classList.contains("is-active")) document.body.setAttribute("data-toolbar-menu", "open"); else {
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