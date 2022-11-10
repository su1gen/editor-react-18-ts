"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _adfSchema = require("@atlaskit/adf-schema");

var _utils = require("@atlaskit/editor-common/utils");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _width = require("../width");

var _LayoutButton = _interopRequireDefault(require("./ui/LayoutButton"));

var _constants = require("./constants");

var _pluginKey = require("./plugin-key");

var _findBreakoutNode = require("./utils/find-breakout-node");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var BreakoutView = /*#__PURE__*/function () {
  function BreakoutView(
  /**
   * Note: this is actually a PMMark -- however our version
   * of the prosemirror and prosemirror types mean using PMNode
   * is not problematic.
   */
  mark, view, eventDispatcher) {
    var _this = this;

    (0, _classCallCheck2.default)(this, BreakoutView);
    (0, _defineProperty2.default)(this, "updateWidth", function (widthState) {
      // we skip updating the width of breakout nodes if the editorView dom
      // element was hidden (to avoid breakout width and button thrashing
      // when an editor is hidden, re-rendered and unhidden).
      if (widthState.width === 0) {
        return;
      }

      var containerStyle = "";
      var contentStyle = "";
      var breakoutWidthPx = (0, _utils.calcBreakoutWidthPx)(_this.mark.attrs.mode, widthState.width);

      if (widthState.lineLength) {
        if (breakoutWidthPx < widthState.lineLength) {
          breakoutWidthPx = widthState.lineLength;
        }

        containerStyle += "\n        transform: none;\n        display: flex;\n        justify-content: center;\n        "; // There is a delay in the animation because widthState is delayed.
        // When the editor goes full width the animation for the editor
        // begins and finishes before widthState can update the new dimensions.

        contentStyle += "\n        min-width: ".concat(breakoutWidthPx, "px;\n        transition: min-width 0.5s ").concat(_editorSharedStyles.akEditorSwoopCubicBezier, ";\n      ");
      } else {
        // fallback method
        // (lineLength is not normally undefined, but might be in e.g. SSR or initial render)
        //
        // this approach doesn't work well with position: fixed, so
        // it breaks things like sticky headers
        containerStyle += "width: ".concat(breakoutWidthPx, "px; transform: translateX(-50%); margin-left: 50%;");
      } // NOTE: This is a hack to ignore mutation since mark NodeView doesn't support
      // `ignoreMutation` life-cycle event. @see ED-9947


      var viewDomObserver = _this.view.domObserver;

      if (viewDomObserver && _this.view.dom) {
        viewDomObserver.stop();
        setTimeout(function () {
          viewDomObserver.start();
        }, 0);
      }

      if (typeof _this.dom.style.cssText !== 'undefined') {
        _this.dom.style.cssText = containerStyle;
        _this.contentDOM.style.cssText = contentStyle;
      } else {
        _this.dom.setAttribute('style', containerStyle);

        _this.contentDOM.setAttribute('style', contentStyle);
      }
    });
    var contentDOM = document.createElement('div');
    contentDOM.className = _constants.BreakoutCssClassName.BREAKOUT_MARK_DOM;
    var dom = document.createElement('div');
    dom.className = _constants.BreakoutCssClassName.BREAKOUT_MARK;
    dom.setAttribute('data-layout', mark.attrs.mode);
    dom.appendChild(contentDOM);
    this.dom = dom;
    this.mark = mark;
    this.view = view;
    this.contentDOM = contentDOM;
    this.eventDispatcher = eventDispatcher;
    eventDispatcher.on(_width.pluginKey.key, this.updateWidth);
    this.updateWidth(_width.pluginKey.getState(this.view.state));
  }

  (0, _createClass2.default)(BreakoutView, [{
    key: "destroy",
    value: // NOTE: Lifecycle events doesn't work for mark NodeView. So currently this is a no-op.
    // @see https://github.com/ProseMirror/prosemirror/issues/1082
    function destroy() {
      this.eventDispatcher.off(_width.pluginKey.key, this.updateWidth);
    }
  }]);
  return BreakoutView;
}();

function shouldPluginStateUpdate(newBreakoutNode, currentBreakoutNode) {
  if (newBreakoutNode && currentBreakoutNode) {
    return !newBreakoutNode.eq(currentBreakoutNode);
  }

  return newBreakoutNode || currentBreakoutNode ? true : false;
}

function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      eventDispatcher = _ref.eventDispatcher;
  return new _safePlugin.SafePlugin({
    state: {
      init: function init() {
        return {
          breakoutNode: null
        };
      },
      apply: function apply(tr, pluginState) {
        var breakoutNode = (0, _findBreakoutNode.findSupportedNodeForBreakout)(tr.selection);
        var node = breakoutNode ? breakoutNode.node : null;

        if (shouldPluginStateUpdate(node, pluginState.breakoutNode)) {
          var nextPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            breakoutNode: node
          });

          dispatch(_pluginKey.pluginKey, nextPluginState);
          return nextPluginState;
        }

        return pluginState;
      }
    },
    key: _pluginKey.pluginKey,
    props: {
      nodeViews: {
        // Note: When we upgrade to prosemirror 1.27.2 -- we should
        // move this to markViews.
        // See the following link for more details:
        // https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews.
        breakout: function breakout(mark, view) {
          return new BreakoutView(mark, view, eventDispatcher);
        }
      }
    }
  });
}

var breakoutPlugin = function breakoutPlugin(options) {
  return {
    name: 'breakout',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'breakout',
        plugin: createPlugin
      }];
    },
    marks: function marks() {
      return [{
        name: 'breakout',
        mark: _adfSchema.breakout
      }];
    },
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsScrollableElement = _ref2.popupsScrollableElement;

      // This is a bit crappy, but should be resolved once we move to a static schema.
      if (options && !options.allowBreakoutButton) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          breakoutPluginState: _pluginKey.pluginKey,
          widthPluginState: _width.pluginKey
        },
        render: function render(_ref3) {
          var _breakoutPluginState$;

          var breakoutPluginState = _ref3.breakoutPluginState;
          return /*#__PURE__*/_react.default.createElement(_LayoutButton.default, {
            editorView: editorView,
            mountPoint: popupsMountPoint,
            boundariesElement: popupsBoundariesElement,
            scrollableElement: popupsScrollableElement,
            node: (_breakoutPluginState$ = breakoutPluginState === null || breakoutPluginState === void 0 ? void 0 : breakoutPluginState.breakoutNode) !== null && _breakoutPluginState$ !== void 0 ? _breakoutPluginState$ : null
          });
        }
      });
    }
  };
};

var _default = breakoutPlugin;
exports.default = _default;