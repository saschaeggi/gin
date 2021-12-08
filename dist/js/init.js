(() => {
  function ginInitDarkmode() {
    1 == localStorage.getItem("GinDarkMode") || "auto" === localStorage.getItem("GinDarkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches ? document.documentElement.classList.add("gin--dark-mode") : !0 === document.documentElement.classList.contains("gin--dark-mode") && document.documentElement.classList.remove("gin--dark-mode");
  }
  if (ginInitDarkmode(), window.addEventListener("DOMContentLoaded", (function(e) {
    localStorage.getItem("GinDarkMode") || (localStorage.setItem("GinDarkMode", drupalSettings.gin.darkmode), 
    ginInitDarkmode());
  })), localStorage.getItem("GinSidebarOpen")) {
    var style = document.createElement("style"), className = "gin-toolbar-inline-styles";
    if (style.className = className, "true" === localStorage.getItem("GinSidebarOpen")) {
      style.innerHTML = "\n    @media (min-width: 976px) {\n      body.gin--vertical-toolbar {\n        padding-left: 240px;\n        transition: none;\n      }\n\n      .gin--vertical-toolbar .toolbar-menu-administration {\n        width: 240px;\n        transition: none;\n      }\n    }\n    ";
      var scriptTag = document.querySelector("script");
      scriptTag.parentNode.insertBefore(style, scriptTag);
    } else document.getElementsByClassName(className).length > 0 && document.getElementsByClassName(className)[0].remove();
  }
})();