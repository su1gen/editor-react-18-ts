"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldPanelBePositionedOverEditor = exports.panel = exports.default = exports.content = exports.SwappableContentArea = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

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

var _Transition = _interopRequireDefault(require("react-transition-group/Transition"));

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _context = require("./context");

var _WithPluginState = _interopRequireDefault(require("../WithPluginState"));

var _contextPanel = require("../../plugins/context-panel");

var _width = require("../../plugins/width");

var _WithEditorActions = _interopRequireDefault(require("../WithEditorActions"));

var _document = require("../../utils/document");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ANIM_SPEED_MS = 500;
var EDITOR_WIDTH = _editorSharedStyles.akEditorDefaultLayoutWidth + _editorSharedStyles.akEditorBreakoutPadding;
var WIDE_EDITOR_WIDTH = _editorSharedStyles.akEditorWideLayoutWidth + _editorSharedStyles.akEditorBreakoutPadding;
var FULLWIDTH_MODE = 'full-width';
var WIDE_MODE = 'wide';
var absolutePanelStyles = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  right: 0;\n  height: calc(100% - ", ");\n"])), _editorSharedStyles.ATLASSIAN_NAVIGATION_HEIGHT);

var shouldPanelBePositionedOverEditor = function shouldPanelBePositionedOverEditor(editorWidth, panelWidth) {
  var lineLength = editorWidth.lineLength,
      _editorWidth$containe = editorWidth.containerWidth,
      containerWidth = _editorWidth$containe === void 0 ? 0 : _editorWidth$containe,
      contentBreakoutModes = editorWidth.contentBreakoutModes;
  var editorNotFullWidth = !(lineLength && lineLength > _editorSharedStyles.akEditorDefaultLayoutWidth);
  var hasSpaceForPanel = !contentBreakoutModes.length && containerWidth >= panelWidth * 2 + EDITOR_WIDTH;
  var hasSpaceForWideBreakoutsAndPanel = !contentBreakoutModes.includes(FULLWIDTH_MODE) && contentBreakoutModes.includes(WIDE_MODE) && containerWidth >= panelWidth * 2 + WIDE_EDITOR_WIDTH;
  return editorNotFullWidth && (hasSpaceForPanel || hasSpaceForWideBreakoutsAndPanel);
};

exports.shouldPanelBePositionedOverEditor = shouldPanelBePositionedOverEditor;
var panelHidden = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  width: 0;\n"])));
var panel = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  width: ", "px;\n  height: 100%;\n  transition: width ", "ms ", ";\n  overflow: hidden;\n  box-shadow: inset 2px 0 0 0 ", ";\n"])), _editorSharedStyles.akEditorContextPanelWidth, ANIM_SPEED_MS, _editorSharedStyles.akEditorSwoopCubicBezier, (0, _tokens.token)('color.border', _colors.N30));
exports.panel = panel;
var content = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  transition: width 600ms ", ";\n  box-sizing: border-box;\n  padding: 16px 16px 0px;\n  width: ", "px;\n  height: 100%;\n  overflow-y: auto;\n"])), _editorSharedStyles.akEditorSwoopCubicBezier, _editorSharedStyles.akEditorContextPanelWidth);
exports.content = content;

var SwappableContentArea = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(SwappableContentArea, _React$PureComponent);

  var _super = _createSuper(SwappableContentArea);

  function SwappableContentArea() {
    var _this;

    (0, _classCallCheck2.default)(this, SwappableContentArea);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      mounted: false,
      currentPluginContent: undefined
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "showPluginContent", function () {
      var pluginContent = _this.props.pluginContent;
      var currentPluginContent = _this.state.currentPluginContent;

      if (!currentPluginContent) {
        return;
      }

      return (0, _react2.jsx)(_Transition.default, {
        timeout: _this.state.mounted ? ANIM_SPEED_MS : 0,
        in: !!pluginContent,
        mountOnEnter: true,
        unmountOnExit: true,
        onExited: function onExited() {
          return _this.unsetPluginContent();
        }
      }, currentPluginContent);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "showProvidedContent", function (isVisible) {
      var children = _this.props.children;

      if (!children) {
        return;
      }

      return (0, _react2.jsx)(_Transition.default, {
        timeout: _this.state.mounted ? ANIM_SPEED_MS : 0,
        in: isVisible,
        mountOnEnter: true,
        unmountOnExit: true
      }, children);
    });
    return _this;
  }

  (0, _createClass2.default)(SwappableContentArea, [{
    key: "unsetPluginContent",
    value: function unsetPluginContent() {
      this.setState({
        currentPluginContent: undefined
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // use this to trigger an animation
      this.setState({
        mounted: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var editorWidth = this.props.editorWidth;
      var width = _editorSharedStyles.akEditorContextPanelWidth;
      var userVisible = !!this.props.visible;
      var visible = userVisible || !!this.state.currentPluginContent;
      return (0, _react2.jsx)(_context.ContextPanelConsumer, null, function (_ref) {
        var broadcastWidth = _ref.broadcastWidth,
            broadcastPosition = _ref.broadcastPosition,
            positionedOverEditor = _ref.positionedOverEditor;
        var newPosition = editorWidth ? shouldPanelBePositionedOverEditor(editorWidth, width) : false;
        broadcastWidth(visible ? width : 0);
        (newPosition && visible) !== positionedOverEditor && broadcastPosition(newPosition && visible);
        return (0, _react2.jsx)("div", {
          css: [panel, !visible && panelHidden,
          /**
           * Only use absolute position for panel when screen size is wide enough
           * to accommodate breakout content and editor is not in wide mode.
           */
          newPosition && absolutePanelStyles],
          "data-testid": "context-panel-panel",
          "aria-labelledby": "context-panel-title",
          role: "dialog"
        }, (0, _react2.jsx)("div", {
          "data-testid": "context-panel-content",
          css: [content, !visible && panelHidden]
        }, _this2.showPluginContent() || _this2.showProvidedContent(userVisible)));
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.pluginContent !== state.currentPluginContent) {
        return _objectSpread(_objectSpread({}, state), {}, {
          currentPluginContent: props.pluginContent
        });
      }

      return null;
    }
  }]);
  return SwappableContentArea;
}(_react.default.PureComponent);

exports.SwappableContentArea = SwappableContentArea;

var ContextPanel = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ContextPanel, _React$Component);

  var _super2 = _createSuper(ContextPanel);

  function ContextPanel() {
    (0, _classCallCheck2.default)(this, ContextPanel);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2.default)(ContextPanel, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      return (0, _react2.jsx)(_WithEditorActions.default, {
        render: function render(actions) {
          var eventDispatcher = actions._privateGetEventDispatcher();

          var editorView = actions._privateGetEditorView();

          if (!eventDispatcher) {
            return (0, _react2.jsx)(SwappableContentArea, (0, _extends2.default)({
              editorView: editorView
            }, _this3.props));
          }

          return (0, _react2.jsx)(_WithPluginState.default, {
            eventDispatcher: eventDispatcher,
            plugins: {
              contextPanel: _contextPanel.pluginKey,
              widthState: _width.pluginKey
            },
            render: function render(_ref2) {
              var contextPanel = _ref2.contextPanel,
                  _ref2$widthState = _ref2.widthState,
                  widthState = _ref2$widthState === void 0 ? {
                width: 0,
                containerWidth: 0,
                lineLength: _editorSharedStyles.akEditorDefaultLayoutWidth
              } : _ref2$widthState;
              var firstContent = contextPanel && contextPanel.contents.find(Boolean);

              var editorWidth = _objectSpread(_objectSpread({}, widthState), {}, {
                contentBreakoutModes: editorView ? (0, _document.getChildBreakoutModes)(editorView.state.doc, editorView.state.schema) : []
              });

              return (0, _react2.jsx)(SwappableContentArea, (0, _extends2.default)({}, _this3.props, {
                editorView: editorView,
                pluginContent: firstContent,
                editorWidth: editorWidth
              }));
            }
          });
        }
      });
    }
  }]);
  return ContextPanel;
}(_react.default.Component);

exports.default = ContextPanel;