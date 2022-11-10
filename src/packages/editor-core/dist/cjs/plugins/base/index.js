"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isChromeWithSelectionBug = exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorCommands = require("prosemirror-commands");

var _prosemirrorHistory = require("prosemirror-history");

var _utils = require("@atlaskit/editor-common/utils");

var _adfSchema = require("@atlaskit/adf-schema");

var _filterSteps = _interopRequireDefault(require("./pm-plugins/filter-steps"));

var _focusHandler = _interopRequireDefault(require("./pm-plugins/focus-handler"));

var _fixChrome88Selection = _interopRequireDefault(require("./pm-plugins/fix-chrome-88-selection"));

var _disableSpellChecking = _interopRequireDefault(require("./pm-plugins/disable-spell-checking"));

var _contextIdentifier = _interopRequireDefault(require("./pm-plugins/context-identifier"));

var _newlinePreserveMarks = _interopRequireDefault(require("./pm-plugins/newline-preserve-marks"));

var _inlineCursorTarget = _interopRequireDefault(require("./pm-plugins/inline-cursor-target"));

var _betterTypeHistory = _interopRequireDefault(require("./pm-plugins/better-type-history"));

var _reactNodeview = require("./pm-plugins/react-nodeview");

var _decoration = _interopRequireDefault(require("./pm-plugins/decoration"));

var _scrollGutter = _interopRequireDefault(require("./pm-plugins/scroll-gutter"));

var _keymap = require("../../utils/keymap");

var _frozenEditor = _interopRequireDefault(require("./pm-plugins/frozen-editor"));

var _composition = _interopRequireDefault(require("./pm-plugins/composition"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// Chrome >= 88
var isChromeWithSelectionBug = _utils.browser.chrome && _utils.browser.chrome_version >= 88;
exports.isChromeWithSelectionBug = isChromeWithSelectionBug;

var basePlugin = function basePlugin(options) {
  return {
    name: 'base',
    pmPlugins: function pmPlugins() {
      var plugins = [{
        name: 'filterStepsPlugin',
        plugin: function plugin(_ref) {
          var dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
          return (0, _filterSteps.default)(dispatchAnalyticsEvent);
        }
      }]; // In Chrome, when the selection is placed between adjacent nodes which are not contenteditatble
      // the cursor appears at the right most point of the parent container.
      // In Firefox, when the selection is placed between adjacent nodes which are not contenteditatble
      // no cursor is presented to users.
      // In Safari, when the selection is placed between adjacent nodes which are not contenteditatble
      // it is not possible to navigate with arrow keys.
      // This plugin works around the issues by inserting decorations between
      // inline nodes which are set as contenteditable, and have a zero width space.

      plugins.push({
        name: 'inlineCursorTargetPlugin',
        plugin: function plugin() {
          return options && options.allowInlineCursorTarget ? (0, _inlineCursorTarget.default)() : undefined;
        }
      });
      plugins.push({
        name: 'focusHandlerPlugin',
        plugin: function plugin(_ref2) {
          var dispatch = _ref2.dispatch;
          return (0, _focusHandler.default)(dispatch);
        }
      }, {
        name: 'newlinePreserveMarksPlugin',
        plugin: _newlinePreserveMarks.default
      }, {
        name: 'reactNodeView',
        plugin: function plugin() {
          return _reactNodeview.plugin;
        }
      }, {
        name: 'frozenEditor',
        plugin: function plugin(_ref3) {
          var _options$inputTrackin;

          var dispatchAnalyticsEvent = _ref3.dispatchAnalyticsEvent;
          return options !== null && options !== void 0 && (_options$inputTrackin = options.inputTracking) !== null && _options$inputTrackin !== void 0 && _options$inputTrackin.enabled || options !== null && options !== void 0 && options.ufo ? (0, _frozenEditor.default)(dispatchAnalyticsEvent, options.inputTracking, options.browserFreezeTracking, options.ufo) : undefined;
        }
      }, {
        name: 'decorationPlugin',
        plugin: function plugin() {
          return (0, _decoration.default)();
        }
      }, {
        name: 'history',
        plugin: function plugin() {
          return (0, _prosemirrorHistory.history)();
        }
      }, // should be last :(
      {
        name: 'codeBlockIndent',
        plugin: function plugin() {
          return (0, _keymap.keymap)(_objectSpread(_objectSpread({}, _prosemirrorCommands.baseKeymap), {}, {
            'Mod-[': function Mod() {
              return true;
            },
            'Mod-]': function Mod() {
              return true;
            }
          }));
        }
      }, {
        name: 'contextIdentifier',
        plugin: function plugin(_ref4) {
          var dispatch = _ref4.dispatch,
              providerFactory = _ref4.providerFactory;
          return (0, _contextIdentifier.default)(dispatch, providerFactory);
        }
      }, {
        name: 'betterTypeHistory',
        plugin: function plugin(_ref5) {
          var dispatch = _ref5.dispatch,
              providerFactory = _ref5.providerFactory;
          return (0, _betterTypeHistory.default)();
        }
      });

      if (options && options.allowScrollGutter) {
        plugins.push({
          name: 'scrollGutterPlugin',
          plugin: function plugin() {
            return (0, _scrollGutter.default)(options.allowScrollGutter);
          }
        });
      }

      if (isChromeWithSelectionBug) {
        plugins.push({
          name: 'fixChrome88SelectionPlugin',
          plugin: function plugin() {
            return (0, _fixChrome88Selection.default)();
          }
        });
      }

      plugins.push({
        name: 'disableSpellcheckingPlugin',
        plugin: function plugin() {
          return (0, _disableSpellChecking.default)();
        }
      });
      plugins.push({
        name: 'compositionPlugin',
        plugin: function plugin() {
          return (0, _composition.default)();
        }
      });
      return plugins;
    },
    nodes: function nodes() {
      return [{
        name: 'doc',
        node: _adfSchema.doc
      }, {
        name: 'paragraph',
        node: _adfSchema.paragraph
      }, {
        name: 'text',
        node: _adfSchema.text
      }];
    }
  };
};

var _default = basePlugin;
exports.default = _default;