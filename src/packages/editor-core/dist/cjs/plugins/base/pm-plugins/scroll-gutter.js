"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GUTTER_SIZE_MOBILE_IN_PX = exports.GUTTER_SIZE_IN_PX = exports.GUTTER_SELECTOR = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _utils = require("../../../utils");

var _utils2 = require("../../mobile-dimensions/utils");

var GUTTER_SIZE_IN_PX = 120; // Default gutter size

exports.GUTTER_SIZE_IN_PX = GUTTER_SIZE_IN_PX;
var GUTTER_SIZE_MOBILE_IN_PX = 36; // Gutter size for Mobile

exports.GUTTER_SIZE_MOBILE_IN_PX = GUTTER_SIZE_MOBILE_IN_PX;
var GUTTER_SELECTOR = '#editor-scroll-gutter';
exports.GUTTER_SELECTOR = GUTTER_SELECTOR;
var MIN_TAP_SIZE_IN_PX = 40;

function supportsIntersectionObserver() {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    return true;
  }

  return false;
}

function listenForGutterVisibilityChanges(scrollElement, gutterIsVisible) {
  if (supportsIntersectionObserver()) {
    var observer = new IntersectionObserver(function (entries, _) {
      entries.forEach(function (entry) {
        gutterIsVisible(entry.intersectionRatio > 0);
      });
    }, {
      root: scrollElement,
      rootMargin: '0px',
      threshold: 0
    });
    return observer;
  }

  return undefined;
}
/**
 * Create a gutter element that can be added or removed from the DOM.
 */


function createGutter(gutterSize) {
  var gutter = document.createElement('div');
  gutter.style.paddingBottom = "".concat(gutterSize, "px");
  gutter.id = GUTTER_SELECTOR.substr(1);
  var initialized = false;
  var mounted = false;
  var currentParent = null;
  var observer;
  var isVisible = false;
  return {
    addGutter: function addGutter(parent) {
      if (parent) {
        currentParent = parent;
        parent.appendChild(gutter);
        mounted = true;

        if (observer) {
          observer.observe(gutter);
        }
      }
    },
    removeGutter: function removeGutter() {
      if (currentParent && mounted) {
        mounted = false;
        currentParent.removeChild(gutter);

        if (observer) {
          observer.unobserve(gutter);
        }
      }
    },
    element: function element() {
      return gutter;
    },
    isMounted: function isMounted() {
      return mounted;
    },
    visible: function visible() {
      // If we know whether it's visible we can avoid expensive calculations
      if (observer) {
        return isVisible;
      } // Fallback for legacy browsers assumes it's visible (if mounted)


      return mounted;
    },
    observe: function observe(scrollElement) {
      if (!initialized) {
        initialized = true;
        observer = listenForGutterVisibilityChanges(scrollElement, function (visible) {
          return isVisible = visible;
        });
      }
    },
    destroy: function destroy() {
      if (observer) {
        observer.disconnect();
      }

      observer = undefined;
      this.removeGutter();
      initialized = mounted = false;
    }
  };
}
/**
 * Get caret top position given the current selection,
 * use start container position as fallback
 */


function getCaretTopPosition() {
  var windowSelection = window.getSelection();

  if (windowSelection && windowSelection.rangeCount > 0) {
    var range = windowSelection.getRangeAt(0);

    if (range) {
      var clientRects = range.getClientRects(); // Return client rects

      if (clientRects && clientRects.length > 0) {
        return clientRects[0].top;
      } // Return container top


      var container = range.startContainer;

      if (container && container.getBoundingClientRect) {
        return container.getBoundingClientRect().top;
      }
    }
  }

  return;
}

function scrollToGutterElement(scrollContainer, gutterElement, gutterSize) {
  var viewportHeight = scrollContainer.offsetHeight;
  var viewportOffsetY = scrollContainer.getBoundingClientRect().top;
  var caretTopPosition = getCaretTopPosition();

  if (!caretTopPosition) {
    return false;
  }

  var caretTopFromContainer = caretTopPosition - viewportOffsetY;
  var gutterThresholdTop = viewportHeight - gutterSize - MIN_TAP_SIZE_IN_PX * 2;

  if (caretTopFromContainer < gutterThresholdTop) {
    return false;
  } // Clamp the scroll position to above the scroll gutter element.


  gutterElement.scrollIntoView(false); // Mark scrolling as handled so that other plugin's don't override our position.

  return true;
}

var _default = function _default() {
  var pluginOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var getScrollElement = pluginOptions.getScrollElement,
      allowCustomScrollHandler = pluginOptions.allowCustomScrollHandler,
      _pluginOptions$gutter = pluginOptions.gutterSize,
      gutterSize = _pluginOptions$gutter === void 0 ? GUTTER_SIZE_IN_PX : _pluginOptions$gutter;

  if (!getScrollElement) {
    return undefined;
  }

  var gutter = createGutter(gutterSize);
  var scrollElement = null; // | undefined;

  return new _safePlugin.SafePlugin({
    props: {
      // Determines the distance (in pixels) between the cursor and the end of the visible viewport at which point,
      // when scrolling the cursor into view, scrolling takes place.
      // Defaults to 0: https://prosemirror.net/docs/ref/#view.EditorProps.scrollThreshold
      scrollThreshold: gutterSize / 2,
      // Determines the extra space (in pixels) that is left above or below the cursor when it is scrolled into view.
      // Defaults to 5: https://prosemirror.net/docs/ref/#view.EditorProps.scrollMargin
      scrollMargin: gutterSize,
      // Called when the view, after updating its state, tries to scroll the selection into view
      // https://prosemirror.net/docs/ref/#view.EditorProps.handleScrollToSelection
      handleScrollToSelection: function handleScrollToSelection() {
        if (allowCustomScrollHandler === false) {
          return false;
        }

        if (!gutter.isMounted() || !gutter.visible() || !scrollElement) {
          // Avoid scrolling until applicable
          return false;
        }

        return scrollToGutterElement(scrollElement, gutter.element(), gutterSize);
      }
    },
    view: function (_view) {
      function view(_x) {
        return _view.apply(this, arguments);
      }

      view.toString = function () {
        return _view.toString();
      };

      return view;
    }(function (view) {
      // Store references to avoid lookups on successive checks.
      scrollElement = getScrollElement(view);
      var editorElement = view.dom;
      var editorParentElement = editorElement.parentElement;
      return {
        destroy: function destroy() {
          // Remove if it's mounted
          gutter.destroy();
          scrollElement = editorParentElement = editorElement = null;
        },

        /**
         * Toggle the Scroll Gutter Element
         */
        update: function update(view, prevState) {
          if (!scrollElement || !editorParentElement) {
            return;
          }

          var state = view.state;

          if (prevState.selection === state.selection) {
            // No need to recheck if the selected node hasn't changed.
            return;
          }

          var gutterMounted = gutter.isMounted();

          var addAndObserveGutter = function addAndObserveGutter() {
            if (!gutterMounted) {
              gutter.observe(scrollElement);
              gutter.addGutter(editorParentElement);
            }
          };

          if (pluginOptions.persistScrollGutter) {
            if (!(0, _utils.isEmptyDocument)(state.doc)) {
              addAndObserveGutter();
            } else {
              gutter.removeGutter();
            }

            return;
          } // Determine whether we need to consider Keyboard Height


          var mobileDimensionsPluginState = (0, _utils2.getMobileDimensionsPluginState)(state);
          var viewportHeight = scrollElement.offsetHeight - (mobileDimensionsPluginState && mobileDimensionsPluginState.keyboardHeight ? mobileDimensionsPluginState.keyboardHeight : 0);
          var contentHeight = editorParentElement.offsetHeight - (gutterMounted ? gutterSize : 0); // Add or remove the gutter based on whether the content is about to exceed the viewport height.
          // We do this to ensure there is sufficient white space below the last content node in order to
          // see any UI control elements which may sit beneath it.

          var gutterThresholdHeight = viewportHeight - gutterSize;

          if (contentHeight >= gutterThresholdHeight) {
            addAndObserveGutter();
          } else {
            if (gutterMounted) {
              gutter.removeGutter();
            }
          }
        }
      };
    })
  });
};

exports.default = _default;