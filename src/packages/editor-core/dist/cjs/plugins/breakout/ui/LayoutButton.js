"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _reactIntlNext = require("react-intl-next");

var _prosemirrorUtils = require("prosemirror-utils");

var _ui = require("@atlaskit/editor-common/ui");

var _collapse = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/collapse"));

var _expand = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/expand"));

var _ToolbarButton = _interopRequireDefault(require("../../../ui/ToolbarButton"));

var _getBreakoutMode = require("../utils/get-breakout-mode");

var _setBreakoutMode = require("../commands/set-breakout-mode");

var _removeBreakout = require("../commands/remove-breakout");

var _messages = _interopRequireDefault(require("../../../messages"));

var _constants = require("../constants");

var _isBreakoutMarkAllowed = require("../utils/is-breakout-mark-allowed");

var _pluginKey = require("../plugin-key");

var _prosemirrorState = require("prosemirror-state");

var _isSupportedNode = require("../utils/is-supported-node");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var toolbarButtonWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  && button {\n    background: ", ";\n    color: ", ";\n    :hover {\n      background: ", ";\n      color: ", " !important;\n    }\n  }\n"])), (0, _tokens.token)('color.background.neutral', _colors.N20A), (0, _tokens.token)('color.icon', _colors.N300), (0, _tokens.token)('color.background.neutral.hovered', _colors.B300), (0, _tokens.token)('color.icon', 'white'));
var BREAKOUT_MODE = {
  FULL_WIDTH: 'full-width',
  CENTER: 'center',
  WIDE: 'wide'
};

var getNextBreakoutMode = function getNextBreakoutMode(currentMode) {
  if (currentMode === BREAKOUT_MODE.FULL_WIDTH) {
    return BREAKOUT_MODE.CENTER;
  } else if (currentMode === BREAKOUT_MODE.WIDE) {
    return BREAKOUT_MODE.FULL_WIDTH;
  }

  return BREAKOUT_MODE.WIDE;
};

var getTitle = function getTitle(layout) {
  switch (layout) {
    case BREAKOUT_MODE.FULL_WIDTH:
      return _messages.default.layoutFixedWidth;

    case BREAKOUT_MODE.WIDE:
      return _messages.default.layoutFullWidth;

    default:
      return _messages.default.layoutWide;
  }
};

function getBreakoutNodeElement(pluginState, selection, editorView) {
  if (selection instanceof _prosemirrorState.NodeSelection && (0, _isSupportedNode.isSupportedNodeForBreakout)(selection.node)) {
    return (0, _prosemirrorUtils.findDomRefAtPos)(selection.from, editorView.domAtPos.bind(editorView));
  }

  return (0, _prosemirrorUtils.findParentDomRefOfType)(pluginState.breakoutNode.type, editorView.domAtPos.bind(editorView))(selection);
}

var LayoutButton = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(LayoutButton, _React$Component);

  var _super = _createSuper(LayoutButton);

  function LayoutButton() {
    var _this;

    (0, _classCallCheck2.default)(this, LayoutButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClick", function (breakoutMode) {
      return function () {
        var _this$props$editorVie = _this.props.editorView,
            state = _this$props$editorVie.state,
            dispatch = _this$props$editorVie.dispatch;

        if ([BREAKOUT_MODE.WIDE, BREAKOUT_MODE.FULL_WIDTH].indexOf(breakoutMode) !== -1) {
          (0, _setBreakoutMode.setBreakoutMode)(breakoutMode)(state, dispatch);
        } else {
          (0, _removeBreakout.removeBreakout)()(state, dispatch);
        }
      };
    });
    return _this;
  }

  (0, _createClass2.default)(LayoutButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          formatMessage = _this$props.intl.formatMessage,
          mountPoint = _this$props.mountPoint,
          boundariesElement = _this$props.boundariesElement,
          scrollableElement = _this$props.scrollableElement,
          editorView = _this$props.editorView,
          node = _this$props.node;
      var state = editorView.state;

      if (!node || !(0, _isBreakoutMarkAllowed.isBreakoutMarkAllowed)(state)) {
        return null;
      }

      var breakoutMode = (0, _getBreakoutMode.getBreakoutMode)(editorView.state);
      var titleMessage = getTitle(breakoutMode);
      var title = formatMessage(titleMessage);
      var nextBreakoutMode = getNextBreakoutMode(breakoutMode);
      var pluginState = (0, _pluginKey.getPluginState)(state);
      var element = getBreakoutNodeElement(pluginState, state.selection, editorView);

      if (!element) {
        return null;
      }

      var closestEl = element.querySelector(".".concat(_constants.BreakoutCssClassName.BREAKOUT_MARK_DOM));

      if (closestEl && closestEl.firstChild) {
        element = closestEl.firstChild;
      }

      return (0, _react2.jsx)(_ui.Popup, {
        ariaLabel: title,
        target: element,
        offset: [5, 0],
        alignY: "start",
        alignX: "end",
        mountTo: mountPoint,
        boundariesElement: boundariesElement,
        scrollableElement: scrollableElement,
        stick: true,
        forcePlacement: true
      }, (0, _react2.jsx)("div", {
        css: toolbarButtonWrapper
      }, (0, _react2.jsx)(_ToolbarButton.default, {
        title: title,
        testId: titleMessage.id,
        onClick: this.handleClick(nextBreakoutMode),
        iconBefore: breakoutMode === BREAKOUT_MODE.FULL_WIDTH ? (0, _react2.jsx)(_collapse.default, {
          label: title
        }) : (0, _react2.jsx)(_expand.default, {
          label: title
        })
      })));
    }
  }]);
  return LayoutButton;
}(_react.default.Component);

(0, _defineProperty2.default)(LayoutButton, "displayName", 'LayoutButton');

var _default = (0, _reactIntlNext.injectIntl)(LayoutButton);

exports.default = _default;