<<<<<<< HEAD
!function($, Drupal) {
  Drupal.behaviors.ginSidebarToggle = {
    attach: function(context) {
      "true" === localStorage.getItem("GinMetaOpen") ? ($("body").attr("data-meta-sidebar", "open"), 
      $(".meta-sidebar__trigger").addClass("is-active")) : ($("body").attr("data-meta-sidebar", "closed"), 
      $(".meta-sidebar__trigger").removeClass("is-active")), $(".meta-sidebar__trigger", context).once("metaSidebarToggle").on("click", (function(e) {
        e.preventDefault(), $(this).toggleClass("is-active"), $(".gin-meta-inline-styles").remove(), 
        $(this).hasClass("is-active") ? ($("body").attr("data-meta-sidebar", "open"), localStorage.setItem("GinMetaOpen", "true")) : ($("body").attr("data-meta-sidebar", "closed"), 
        localStorage.setItem("GinMetaOpen", "false"));
      }));
    }
  };
}(jQuery, Drupal);
=======
!function(e){function t(a){if(r[a])return r[a].exports;var n=r[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,a){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:a})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(t.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)t.d(a,n,function(t){return e[t]}.bind(null,n));return a},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="../",t(t.s=67)}({67:function(e,t,r){r(68),e.exports=r(69)},68:function(){"use strict";var e;e=jQuery,Drupal.behaviors.ginSidebarToggle={attach:function(t){"true"===localStorage.getItem("GinMetaOpen")?(e("body").attr("data-meta-sidebar","open"),e(".sidebar__trigger").addClass("is-active")):(e("body").attr("data-meta-sidebar",""),e(".sidebar__trigger").removeClass("is-active")),e(".sidebar__trigger",t).once("metaSidebarToggle").on("click",(function(t){t.preventDefault(),e(this).toggleClass("is-active"),e(this).hasClass("is-active")?(e("body").attr("data-meta-sidebar","open"),localStorage.setItem("GinMetaOpen","true")):(e("body").attr("data-meta-sidebar",""),localStorage.setItem("GinMetaOpen","false"),e(".gin-toolbar-inline-styles").remove())}))}}},69:function(){}});
>>>>>>> 3053e8f (js toggle)
