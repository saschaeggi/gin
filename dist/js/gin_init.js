!function() {
  if (localStorage.getItem("GinSidebarOpen")) {
    var style = document.createElement("style"), _className = "gin-toolbar-inline-styles";
    if (style.className = _className, "true" === localStorage.getItem("GinSidebarOpen")) {
      style.innerHTML = "\n    @media (min-width: 976px) {\n      body.gin--vertical-toolbar {\n        padding-left: 240px;\n        transition: none;\n      }\n\n      .gin--vertical-toolbar .toolbar-menu-administration {\n        width: 240px;\n        transition: none;\n      }\n    }\n    ";
      var scriptTag = document.querySelector("script");
      scriptTag.parentNode.insertBefore(style, scriptTag);
    } else document.getElementsByClassName(_className).length > 0 && document.getElementsByClassName(_className)[0].remove();
  }
  var accentColor = localStorage.getItem("GinAccentColorCustom");
  if (accentColor) {
    var _style = document.createElement("style"), strippedAccentColor = accentColor.replace("#", "");
    _style.className = "gin-custom-colors", _style.innerHTML = "\n    body:not(.gin-inactive) {\n      --colorGinPrimary: ".concat(accentColor, ";\n      --colorGinPrimaryHover: ").concat(shadeColor(accentColor, -10), ";\n      --colorGinPrimaryActive: ").concat(shadeColor(accentColor, -15), ";\n      --colorGinPrimaryLight: ").concat(accentColor).concat(Math.round(22.75), ";\n      --colorGinPrimaryLightHover: ").concat(accentColor).concat(Math.round(29.25), ";\n      --colorGinPrimaryLightActive: ").concat(accentColor).concat(Math.round(35.75), ";\n      --colorGinItemHover: ").concat(accentColor).concat(Math.round(9.75), ";\n    }\n    .form-element--type-select:hover,\n    .form-element--type-select:active,\n    .form-element--type-select:focus {\n      background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'%3E%3Cpath fill='none' stroke-width='1.5' d='M1 1L7 7L13 1' stroke='%23").concat(strippedAccentColor, "'/%3E%3C/svg%3E%0A\");\n    }\n  ");
    var _scriptTag = document.querySelector("script");
    _scriptTag.parentNode.insertBefore(_style, _scriptTag);
  } else document.getElementsByClassName("gin-custom-colors").length > 0 && document.getElementsByClassName("gin-custom-colors")[0].remove();
  function shadeColor(color, percent) {
    var num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 255) + amt, G = (255 & num) + amt;
    return "#".concat((16777216 + 65536 * (R < 255 ? R < 1 ? 0 : R : 255) + 256 * (B < 255 ? B < 1 ? 0 : B : 255) + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1));
  }
}();