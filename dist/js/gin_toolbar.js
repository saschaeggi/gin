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

eval("(function ($, Drupal) {\n  Drupal.behaviors.ginToolbarChange = {\n    attach: function attach(context, settings) {\n      // Check if on node edit form\n      if (window.location.href.indexOf('admin/content') > -1) {\n        $('.toolbar-icon-system-admin-content').addClass('is-active');\n      } // If Structure\n      else if (window.location.href.indexOf('admin/structure') > -1) {\n          $('.toolbar-icon-system-admin-structure').addClass('is-active');\n        } // If Appearance\n        else if (window.location.href.indexOf('admin/appearance') > -1 || window.location.href.indexOf('admin/theme') > -1) {\n            $('.toolbar-icon-system-themes-page').addClass('is-active');\n          } // If Modules\n          else if (window.location.href.indexOf('admin/modules') > -1) {\n              $('.toolbar-icon-system-modules-list').addClass('is-active');\n            } // If Configuration\n            else if (window.location.href.indexOf('admin/config') > -1) {\n                $('.toolbar-icon-system-admin-config').addClass('is-active');\n              } // If People\n              else if (window.location.href.indexOf('admin/people') > -1) {\n                  $('.toolbar-icon-entity-user-collection').addClass('is-active');\n                } // If Reports\n                else if (window.location.href.indexOf('admin/reports') > -1) {\n                    $('.toolbar-icon-system-admin-reports').addClass('is-active');\n                  } // If Help\n                  else if (window.location.href.indexOf('admin/help') > -1) {\n                      $('.toolbar-icon-help-main').addClass('is-active');\n                    } // Change when clicked\n\n\n      $('#toolbar-bar .toolbar-item', context).on('click', function () {\n        $('body').attr('data-toolbar-tray', $(this).data('toolbar-tray')); // Sticky toolbar width\n\n        $(document).ready(function () {\n          $('.sticky-header').each(function () {\n            $(this).width($('.sticky-table').width());\n          });\n        });\n      }); // Toolbar toggle\n\n      $('.toolbar-menu__trigger', context).on('click', function () {\n        $(this).toggleClass('is-active');\n\n        if ($(this).hasClass('is-active')) {\n          $('body').attr('data-toolbar-menu', 'open');\n        } else {\n          $('body').attr('data-toolbar-menu', '');\n        }\n      });\n    }\n  };\n})(jQuery, Drupal);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qcy9naW5fdG9vbGJhci5qcz82ODA5Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vanMvZ2luX3Rvb2xiYXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCQsIERydXBhbCkge1xuICBEcnVwYWwuYmVoYXZpb3JzLmdpblRvb2xiYXJDaGFuZ2UgPSB7XG4gICAgYXR0YWNoOiBmdW5jdGlvbiBhdHRhY2goY29udGV4dCwgc2V0dGluZ3MpIHtcbiAgICAgIC8vIENoZWNrIGlmIG9uIG5vZGUgZWRpdCBmb3JtXG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignYWRtaW4vY29udGVudCcpID4gLTEpIHtcbiAgICAgICAgJCgnLnRvb2xiYXItaWNvbi1zeXN0ZW0tYWRtaW4tY29udGVudCcpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgIH1cbiAgICAgIC8vIElmIFN0cnVjdHVyZVxuICAgICAgZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignYWRtaW4vc3RydWN0dXJlJykgPiAtMSkge1xuICAgICAgICAkKCcudG9vbGJhci1pY29uLXN5c3RlbS1hZG1pbi1zdHJ1Y3R1cmUnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICB9XG4gICAgICAvLyBJZiBBcHBlYXJhbmNlXG4gICAgICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdhZG1pbi9hcHBlYXJhbmNlJykgPiAtMSB8fCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdhZG1pbi90aGVtZScpID4gLTEpIHtcbiAgICAgICAgJCgnLnRvb2xiYXItaWNvbi1zeXN0ZW0tdGhlbWVzLXBhZ2UnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICB9XG4gICAgICAvLyBJZiBNb2R1bGVzXG4gICAgICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdhZG1pbi9tb2R1bGVzJykgPiAtMSkge1xuICAgICAgICAkKCcudG9vbGJhci1pY29uLXN5c3RlbS1tb2R1bGVzLWxpc3QnKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICB9XG4gICAgICAvLyBJZiBDb25maWd1cmF0aW9uXG4gICAgICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdhZG1pbi9jb25maWcnKSA+IC0xKSB7XG4gICAgICAgICQoJy50b29sYmFyLWljb24tc3lzdGVtLWFkbWluLWNvbmZpZycpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgIH1cbiAgICAgIC8vIElmIFBlb3BsZVxuICAgICAgZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignYWRtaW4vcGVvcGxlJykgPiAtMSkge1xuICAgICAgICAkKCcudG9vbGJhci1pY29uLWVudGl0eS11c2VyLWNvbGxlY3Rpb24nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICB9XG4gICAgICAvLyBJZiBSZXBvcnRzXG4gICAgICBlbHNlIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdhZG1pbi9yZXBvcnRzJykgPiAtMSkge1xuICAgICAgICAkKCcudG9vbGJhci1pY29uLXN5c3RlbS1hZG1pbi1yZXBvcnRzJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgfVxuICAgICAgLy8gSWYgSGVscFxuICAgICAgZWxzZSBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignYWRtaW4vaGVscCcpID4gLTEpIHtcbiAgICAgICAgJCgnLnRvb2xiYXItaWNvbi1oZWxwLW1haW4nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoYW5nZSB3aGVuIGNsaWNrZWRcbiAgICAgICQoJyN0b29sYmFyLWJhciAudG9vbGJhci1pdGVtJywgY29udGV4dCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJ2JvZHknKS5hdHRyKCdkYXRhLXRvb2xiYXItdHJheScsICQodGhpcykuZGF0YSgndG9vbGJhci10cmF5JykpO1xuXG4gICAgICAgIC8vIFN0aWNreSB0b29sYmFyIHdpZHRoXG4gICAgICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQoJy5zdGlja3ktaGVhZGVyJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykud2lkdGgoJCgnLnN0aWNreS10YWJsZScpLndpZHRoKCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUb29sYmFyIHRvZ2dsZVxuICAgICAgJCgnLnRvb2xiYXItbWVudV9fdHJpZ2dlcicsIGNvbnRleHQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAkKCdib2R5JykuYXR0cignZGF0YS10b29sYmFyLW1lbnUnLCAnb3BlbicpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQoJ2JvZHknKS5hdHRyKCdkYXRhLXRvb2xiYXItbWVudScsICcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSkoalF1ZXJ5LCBEcnVwYWwpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./js/gin_toolbar.js\n");

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