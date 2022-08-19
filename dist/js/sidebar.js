((Drupal, once) => {
  const storageDesktop = "Drupal.gin.sidebarExpanded.desktop";
  Drupal.behaviors.ginSidebar = {
    attach: function() {
      Drupal.ginSidebar.init();
    }
  }, Drupal.ginSidebar = {
    init: function() {
      localStorage.getItem(storageDesktop) || localStorage.setItem(storageDesktop, "true"), 
      window.innerWidth >= 1024 && ("true" === localStorage.getItem(storageDesktop) ? this.showSidebar() : this.collapseSidebar()), 
      once("ginSidebarShortcut", document.querySelector("#gin_sidebar")).forEach((() => document.addEventListener("keydown", (e => {
        !0 === e.altKey && "KeyS" === e.code && this.toggleSidebar();
      })))), once("ginSidebarToggle", document.querySelector(".meta-sidebar__trigger")).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.removeInlineStyles(), this.toggleSidebar();
      })))), once("ginSidebarClose", document.querySelectorAll(".meta-sidebar__close, .meta-sidebar__overlay")).forEach((el => el.addEventListener("click", (e => {
        e.preventDefault(), this.removeInlineStyles(), this.collapseSidebar();
      })))), window.onresize = Drupal.debounce(this.handleResize, 150);
    },
    toggleSidebar: () => {
      document.querySelector(".meta-sidebar__trigger").classList.contains("is-active") ? Drupal.ginSidebar.collapseSidebar() : Drupal.ginSidebar.showSidebar();
    },
    showSidebar: () => {
      const chooseStorage = window.innerWidth < 1024 ? "Drupal.gin.sidebarExpanded.mobile" : storageDesktop, showLabel = Drupal.t("Hide sidebar panel");
      document.querySelector(".meta-sidebar__trigger").setAttribute("title", showLabel), 
      document.querySelector(".meta-sidebar__trigger span").innerHTML = showLabel, localStorage.setItem(chooseStorage, "true"), 
      document.querySelector(".meta-sidebar__trigger").setAttribute("aria-expanded", "true"), 
      document.querySelector(".meta-sidebar__trigger").classList.add("is-active"), document.body.setAttribute("data-meta-sidebar", "open");
    },
    collapseSidebar: () => {
      const chooseStorage = window.innerWidth < 1024 ? "Drupal.gin.sidebarExpanded.mobile" : storageDesktop, hideLabel = Drupal.t("Show sidebar panel");
      document.querySelector(".meta-sidebar__trigger").setAttribute("title", hideLabel), 
      document.querySelector(".meta-sidebar__trigger span").innerHTML = hideLabel, localStorage.setItem(chooseStorage, "false"), 
      document.querySelector(".meta-sidebar__trigger").classList.remove("is-active"), 
      document.body.setAttribute("data-meta-sidebar", "closed"), document.querySelector(".meta-sidebar__trigger").setAttribute("aria-expanded", "false");
    },
    handleResize: () => {
      Drupal.ginSidebar.removeInlineStyles(), window.innerWidth < 1024 ? Drupal.ginSidebar.collapseSidebar() : "true" === localStorage.getItem(storageDesktop) ? Drupal.ginSidebar.showSidebar() : Drupal.ginSidebar.collapseSidebar();
    },
    removeInlineStyles: () => {
      const elementToRemove = document.querySelector(".gin-sidebar-inline-styles");
      elementToRemove && elementToRemove.parentNode.removeChild(elementToRemove);
    }
  };
})(Drupal, once);