((Drupal, drupalSettings, once) => {
  const toolbarVariant = drupalSettings.gin.toolbar_variant, storageDesktop = "Drupal.gin.sidebarExpanded.desktop";
  Drupal.behaviors.ginSidebar = {
    attach: function(context) {
      Drupal.ginSidebar.init(context);
    }
  }, Drupal.ginSidebar = {
    init: function(context) {
      once("ginSidebarInit", "#gin_sidebar", context).forEach((() => {
        localStorage.getItem(storageDesktop) || localStorage.setItem(storageDesktop, "true"), 
        window.innerWidth >= 1024 && ("true" === localStorage.getItem(storageDesktop) ? this.showSidebar() : this.collapseSidebar()), 
        document.addEventListener("keydown", (e => {
          !0 === e.altKey && "KeyS" === e.code && this.toggleSidebar();
        })), new ResizeObserver((entries => {
          for (let entry of entries) Drupal.debounce(this.handleResize(entry.contentRect), 150);
        })).observe(document.querySelector("html"));
      })), once("ginSidebarToggle", ".meta-sidebar__trigger", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.removeInlineStyles(), this.toggleSidebar();
      })))), once("ginSidebarClose", ".meta-sidebar__close, .meta-sidebar__overlay", context).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.removeInlineStyles(), this.collapseSidebar();
      }))));
    },
    toggleSidebar: () => {
      var _Drupal$ginStickyForm, _Drupal$ginStickyForm2;
      document.querySelector(".meta-sidebar__trigger").classList.contains("is-active") ? (Drupal.ginSidebar.collapseSidebar(), 
      null === (_Drupal$ginStickyForm = Drupal.ginStickyFormActions) || void 0 === _Drupal$ginStickyForm || _Drupal$ginStickyForm.hideMoreActions()) : (Drupal.ginSidebar.showSidebar(), 
      null === (_Drupal$ginStickyForm2 = Drupal.ginStickyFormActions) || void 0 === _Drupal$ginStickyForm2 || _Drupal$ginStickyForm2.hideMoreActions());
    },
    showSidebar: () => {
      const chooseStorage = window.innerWidth < 1024 ? "Drupal.gin.sidebarExpanded.mobile" : storageDesktop, hideLabel = Drupal.t("Hide sidebar panel"), sidebarTrigger = document.querySelector(".meta-sidebar__trigger");
      var _Drupal$ginCoreNaviga;
      if (sidebarTrigger.querySelector("span").innerHTML = hideLabel, sidebarTrigger.setAttribute("title", hideLabel), 
      sidebarTrigger.nextSibling.innerHTML = hideLabel, sidebarTrigger.setAttribute("aria-expanded", "true"), 
      sidebarTrigger.classList.add("is-active"), document.body.setAttribute("data-meta-sidebar", "open"), 
      localStorage.setItem(chooseStorage, "true"), window.innerWidth < 1280) if (null === (_Drupal$ginCoreNaviga = Drupal.ginCoreNavigation) || void 0 === _Drupal$ginCoreNaviga || _Drupal$ginCoreNaviga.collapseToolbar(), 
      "vertical" === toolbarVariant) Drupal.ginToolbar.collapseToolbar(); else if ("new" === toolbarVariant) {
        var _Drupal$behaviors$gin;
        null === (_Drupal$behaviors$gin = Drupal.behaviors.ginNavigation) || void 0 === _Drupal$behaviors$gin || _Drupal$behaviors$gin.collapseSidebar();
      }
    },
    collapseSidebar: () => {
      const chooseStorage = window.innerWidth < 1024 ? "Drupal.gin.sidebarExpanded.mobile" : storageDesktop, showLabel = Drupal.t("Show sidebar panel"), sidebarTrigger = document.querySelector(".meta-sidebar__trigger");
      sidebarTrigger.querySelector("span").innerHTML = showLabel, sidebarTrigger.setAttribute("title", showLabel), 
      sidebarTrigger.nextSibling.innerHTML = showLabel, sidebarTrigger.setAttribute("aria-expanded", "false"), 
      sidebarTrigger.classList.remove("is-active"), document.body.setAttribute("data-meta-sidebar", "closed"), 
      localStorage.setItem(chooseStorage, "false");
    },
    handleResize: function() {
      let windowSize = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : window;
      Drupal.ginSidebar.removeInlineStyles(), windowSize.width < 1024 ? Drupal.ginSidebar.collapseSidebar() : "true" === localStorage.getItem(storageDesktop) ? Drupal.ginSidebar.showSidebar() : Drupal.ginSidebar.collapseSidebar();
    },
    removeInlineStyles: () => {
      const elementToRemove = document.querySelector(".gin-sidebar-inline-styles");
      elementToRemove && elementToRemove.parentNode.removeChild(elementToRemove);
    }
  };
})(Drupal, drupalSettings, once);