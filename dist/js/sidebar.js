((Drupal, once) => {
  const storageDesktop = "Drupal.gin.sidebarExpanded.desktop";
  Drupal.behaviors.ginSidebar = {
    attach: function() {
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
    toggleSidebar: function() {
      document.querySelector(".meta-sidebar__trigger").classList.contains("is-active") ? this.collapseSidebar() : this.showSidebar();
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
    handleResize: function() {
      this.removeInlineStyles(), window.innerWidth < 1024 ? this.collapseSidebar() : "true" === localStorage.getItem(storageDesktop) ? this.showSidebar() : this.collapseSidebar();
    },
    removeInlineStyles: () => {
      if (document.querySelectorAll(".gin-sidebar-inline-styles").length > 0) {
        const removeElement = document.querySelector(".gin-sidebar-inline-styles");
        removeElement.parentNode.removeChild(removeElement);
      }
    }
  };
})(Drupal, once);