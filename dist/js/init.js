(() => {
  function ginInitDarkmode() {
    1 == localStorage.getItem("Drupal.gin.darkmode") || "auto" === localStorage.getItem("Drupal.gin.darkmode") && window.matchMedia("(prefers-color-scheme: dark)").matches ? document.documentElement.classList.add("gin--dark-mode") : !0 === document.documentElement.classList.contains("gin--dark-mode") && document.documentElement.classList.remove("gin--dark-mode");
  }
  if (localStorage.getItem("GinDarkMode") && (localStorage.setItem("Drupal.gin.darkmode", localStorage.getItem("GinDarkMode")), 
  localStorage.removeItem("GinDarkMode")), localStorage.getItem("GinSidebarOpen") && (localStorage.setItem("Drupal.gin.toolbarExpanded", localStorage.getItem("GinSidebarOpen")), 
  localStorage.removeItem("GinSidebarOpen")), ginInitDarkmode(), window.addEventListener("DOMContentLoaded", (() => {
    localStorage.getItem("Drupal.gin.darkmode") || (localStorage.setItem("Drupal.gin.darkmode", drupalSettings.gin.darkmode), 
    ginInitDarkmode());
  })), localStorage.getItem("Drupal.gin.toolbarExpanded")) {
    const style = document.createElement("style"), className = "gin-toolbar-inline-styles";
    if (style.className = className, "true" === localStorage.getItem("Drupal.gin.toolbarExpanded")) {
      style.innerHTML = "\n    @media (min-width: 976px) {\n      body.gin--vertical-toolbar:not([data-toolbar-menu=open]) {\n        padding-inline-start: 240px;\n        transition: none;\n      }\n\n      .gin--vertical-toolbar .toolbar-menu-administration {\n        min-width: var(--ginToolbarWidth, 240px);\n        transition: none;\n      }\n    }\n    ";
      const scriptTag = document.querySelector("script");
      scriptTag.parentNode.insertBefore(style, scriptTag);
    } else document.getElementsByClassName(className).length > 0 && document.getElementsByClassName(className)[0].remove();
  }
  if (localStorage.getItem("Drupal.gin.sidebarExpanded.desktop")) {
    const style = document.createElement("style"), className = "gin-sidebar-inline-styles";
    if (style.className = className, window.innerWidth < 1024 || "false" === localStorage.getItem("Drupal.gin.sidebarExpanded.desktop")) {
      style.innerHTML = "\n    body {\n      --ginSidebarOffset: 0px;\n      padding-inline-end: 0;\n      transition: none;\n    }\n\n    .layout-region-node-secondary {\n      transform: translateX(var(--ginSidebarWidth, 360px));\n      transition: none;\n    }\n\n    .meta-sidebar__overlay {\n      display: none;\n    }\n    ";
      const scriptTag = document.querySelector("script");
      scriptTag.parentNode.insertBefore(style, scriptTag);
    } else document.getElementsByClassName(className).length > 0 && document.getElementsByClassName(className)[0].remove();
  }
})();