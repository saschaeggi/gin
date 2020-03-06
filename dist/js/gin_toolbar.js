/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/gin_toolbar.js":
/*!***************************!*\
  !*** ./js/gin_toolbar.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function ($, Drupal) {\n  Drupal.behaviors.ginToolbarChange = {\n    attach: function attach(context, settings) {\n      // Check if on node edit form\n      if ($('body', context).hasClass('path-node')) {\n        $('.toolbar-icon-system-admin-content').addClass('is-active');\n      } // Change when clicked\n\n\n      $('#toolbar-bar .toolbar-item', context).on('click', function () {\n        $('body').attr('data-toolbar-tray', $(this).data('toolbar-tray')); // Sticky toolbar width\n\n        $(document).ready(function () {\n          $('.sticky-header').each(function () {\n            $(this).width($('.sticky-table').width());\n          });\n        });\n      }); // Toolbar toggle\n\n      $('.toolbar-menu__trigger', context).on('click', function () {\n        $(this).toggleClass('is-active');\n\n        if ($(this).hasClass('is-active')) {\n          $('body').attr('data-toolbar-menu', 'open');\n        } else {\n          $('body').attr('data-toolbar-menu', '');\n        }\n      });\n    }\n  };\n})(jQuery, Drupal);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9naW5fdG9vbGJhci5qcz82ODA5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vanMvZ2luX3Rvb2xiYXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCQsIERydXBhbCkge1xuICBEcnVwYWwuYmVoYXZpb3JzLmdpblRvb2xiYXJDaGFuZ2UgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiBhdHRhY2goY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIC8vIENoZWNrIGlmIG9uIG5vZGUgZWRpdCBmb3JtXG4gICAgICBpZiAoJCgnYm9keScsIGNvbnRleHQpLmhhc0NsYXNzKCdwYXRoLW5vZGUnKSkge1xuICAgICAgICAkKCcudG9vbGJhci1pY29uLXN5c3RlbS1hZG1pbi1jb250ZW50JykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGFuZ2Ugd2hlbiBjbGlja2VkXG4gICAgICAkKCcjdG9vbGJhci1iYXIgLnRvb2xiYXItaXRlbScsIGNvbnRleHQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCdib2R5JykuYXR0cignZGF0YS10b29sYmFyLXRyYXknLCAkKHRoaXMpLmRhdGEoJ3Rvb2xiYXItdHJheScpKTtcblxuICAgICAgICAvLyBTdGlja3kgdG9vbGJhciB3aWR0aFxuICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgICAkKCcuc3RpY2t5LWhlYWRlcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLndpZHRoKCQoJy5zdGlja3ktdGFibGUnKS53aWR0aCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gVG9vbGJhciB0b2dnbGVcbiAgICAgICQoJy50b29sYmFyLW1lbnVfX3RyaWdnZXInLCBjb250ZXh0KS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAgICAgJCgnYm9keScpLmF0dHIoJ2RhdGEtdG9vbGJhci1tZW51JywgJ29wZW4nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKCdib2R5JykuYXR0cignZGF0YS10b29sYmFyLW1lbnUnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pKGpRdWVyeSwgRHJ1cGFsKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./js/gin_toolbar.js\n");

/***/ }),

/***/ "./styles/gin_toolbar.scss":
/*!*********************************!*\
  !*** ./styles/gin_toolbar.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZXMvZ2luX3Rvb2xiYXIuc2Nzcz80MGUyIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6Ii4vc3R5bGVzL2dpbl90b29sYmFyLnNjc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./styles/gin_toolbar.scss\n");

/***/ }),

/***/ 1:
/*!***********************************************************!*\
  !*** multi ./js/gin_toolbar.js ./styles/gin_toolbar.scss ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./js/gin_toolbar.js */"./js/gin_toolbar.js");
module.exports = __webpack_require__(/*! ./styles/gin_toolbar.scss */"./styles/gin_toolbar.scss");


/***/ })

/******/ });
//# sourceMappingURL=gin_toolbar.js.map