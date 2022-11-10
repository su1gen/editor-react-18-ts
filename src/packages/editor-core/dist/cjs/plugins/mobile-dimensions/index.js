"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MIN_TAP_SIZE_PX = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _commands = require("./commands");

var _pluginFactory = require("./plugin-factory");

// 44 pixels squared is the minimum size for a tap target as per Apple's UX design guidelines
var MIN_TAP_SIZE_PX = 44;
exports.MIN_TAP_SIZE_PX = MIN_TAP_SIZE_PX;

var getInitialState = function getInitialState() {
  return {
    keyboardHeight: -1,
    mobilePaddingTop: 0,
    windowHeight: window.innerHeight,
    isExpanded: false
  };
};
/**
 * Plugin to store the dimensions of the mobile such as keyboard height and window size
 */


var createPlugin = function createPlugin(dispatch) {
  var rafId;
  return new _safePlugin.SafePlugin({
    state: (0, _pluginFactory.createPluginState)(dispatch, getInitialState),
    key: _pluginFactory.mobileDimensionsPluginKey,
    props: {
      scrollThreshold: {
        top: 12,
        left: 0,
        right: 0,
        bottom: 12
      },
      scrollMargin: {
        top: 12,
        bottom: 12,
        left: 0,
        right: 0
      }
    },
    view: function view(editorView) {
      var handleResize = function handleResize() {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
        }

        var windowInnerHeight = window.innerHeight;
        var count = 0;

        var checkWindowHeight = function checkWindowHeight() {
          // wait for height to stabilise before we commit to set it
          // this helps handle menu transitions in Android which we don't want to scroll for
          if (window.innerHeight === windowInnerHeight) {
            count++;

            if (count >= 5) {
              rafId = undefined;
              (0, _commands.setWindowHeight)(window.innerHeight)(editorView.state, editorView.dispatch);
            } else {
              rafId = requestAnimationFrame(checkWindowHeight);
            }
          } else {
            rafId = requestAnimationFrame(checkWindowHeight);
          }

          windowInnerHeight = window.innerHeight;
        };

        rafId = requestAnimationFrame(checkWindowHeight);
      }; // the window will resize on Android when the keyboard shows/hides


      window.addEventListener('resize', handleResize);
      return {
        destroy: function destroy() {
          window.removeEventListener('resize', handleResize);

          if (rafId) {
            window.cancelAnimationFrame(rafId);
          }
        }
      };
    }
  });
};

var mobileDimensionsPlugin = function mobileDimensionsPlugin() {
  return {
    name: 'mobileDimensions',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'mobileDimensions',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }];
    }
  };
};

var _default = mobileDimensionsPlugin;
exports.default = _default;