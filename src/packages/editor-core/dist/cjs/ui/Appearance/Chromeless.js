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

var _PluginSlot = _interopRequireDefault(require("../PluginSlot"));

var _WithPluginState = _interopRequireDefault(require("../WithPluginState"));

var _ContentStyles = require("../ContentStyles");

var _maxContentSize = require("../../plugins/max-content-size");

var _styles = require("../styles");

var _WithFlash = _interopRequireDefault(require("../WithFlash"));

var _templateObject, _templateObject2, _templateObject3;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var chromelessEditor = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  line-height: 20px;\n  height: auto;\n\n  overflow-x: hidden;\n  overflow-y: auto;\n  ", ";\n  max-width: inherit;\n  box-sizing: border-box;\n  word-wrap: break-word;\n\n  div > .ProseMirror {\n    outline: none;\n    white-space: pre-wrap;\n    padding: 0;\n    margin: 0;\n  }\n"])), _styles.scrollbarStyles);
var ContentArea = (0, _ContentStyles.createEditorContentStyle)();
ContentArea.displayName = 'ContentArea';

var Editor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Editor, _React$Component);

  var _super = _createSuper(Editor);

  function Editor() {
    var _this;

    (0, _classCallCheck2.default)(this, Editor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "appearance", 'chromeless');
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "containerElement", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderChrome", function (_ref) {
      var maxContentSize = _ref.maxContentSize;
      var _this$props = _this.props,
          editorDOMElement = _this$props.editorDOMElement,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          eventDispatcher = _this$props.eventDispatcher,
          providerFactory = _this$props.providerFactory,
          contentComponents = _this$props.contentComponents,
          customContentComponents = _this$props.customContentComponents,
          maxHeight = _this$props.maxHeight,
          _this$props$minHeight = _this$props.minHeight,
          minHeight = _this$props$minHeight === void 0 ? 30 : _this$props$minHeight,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          disabled = _this$props.disabled,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent;
      var maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
      return (0, _react2.jsx)(_WithFlash.default, {
        animate: maxContentSizeReached
      }, (0, _react2.jsx)("div", {
        css: [chromelessEditor, maxHeight && (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n                max-height: ", "px;\n              "])), maxHeight), (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n              min-height: ", "px;\n            "])), minHeight)],
        "data-testid": "chromeless-editor",
        ref: function ref(_ref2) {
          return _this.containerElement = _ref2;
        }
      }, (0, _react2.jsx)(ContentArea, {
        className: "ak-editor-content-area"
      }, customContentComponents, (0, _react2.jsx)(_PluginSlot.default, {
        editorView: editorView,
        editorActions: editorActions,
        eventDispatcher: eventDispatcher,
        providerFactory: providerFactory,
        appearance: _this.appearance,
        items: contentComponents,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement,
        containerElement: _this.containerElement,
        disabled: !!disabled,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        wrapperElement: _this.containerElement
      }), editorDOMElement)));
    });
    return _this;
  }

  (0, _createClass2.default)(Editor, [{
    key: "render",
    value: function render() {
      return (0, _react2.jsx)(_WithPluginState.default, {
        plugins: {
          maxContentSize: _maxContentSize.pluginKey
        },
        render: this.renderChrome
      });
    }
  }]);
  return Editor;
}(_react.default.Component);

exports.default = Editor;
(0, _defineProperty2.default)(Editor, "displayName", 'ChromelessEditorAppearance');