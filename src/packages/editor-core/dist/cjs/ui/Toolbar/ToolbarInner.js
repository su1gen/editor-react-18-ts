"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarInner = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var toolbarComponentsWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n\n  @media (max-width: ", "px) {\n    justify-content: space-between;\n  }\n"])), _editorSharedStyles.akEditorMobileMaxWidth);

var ToolbarInner = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ToolbarInner, _React$Component);

  var _super = _createSuper(ToolbarInner);

  function ToolbarInner() {
    (0, _classCallCheck2.default)(this, ToolbarInner);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ToolbarInner, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.toolbarSize !== this.props.toolbarSize || nextProps.disabled !== this.props.disabled || nextProps.popupsMountPoint === this.props.popupsMountPoint || nextProps.popupsBoundariesElement === this.props.popupsBoundariesElement || nextProps.popupsScrollableElement === this.props.popupsScrollableElement || nextProps.isReducedSpacing !== this.props.isToolbarReducedSpacing;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          appearance = _this$props.appearance,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          eventDispatcher = _this$props.eventDispatcher,
          providerFactory = _this$props.providerFactory,
          items = _this$props.items,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          toolbarSize = _this$props.toolbarSize,
          disabled = _this$props.disabled,
          isToolbarReducedSpacing = _this$props.isToolbarReducedSpacing,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          containerElement = _this$props.containerElement;

      if (!items || !items.length) {
        return null;
      }

      return (0, _react2.jsx)("div", {
        css: toolbarComponentsWrapper
      }, items.map(function (component, key) {
        var props = {
          key: key
        };
        var element = component({
          editorView: editorView,
          editorActions: editorActions,
          eventDispatcher: eventDispatcher,
          providerFactory: providerFactory,
          appearance: appearance,
          popupsMountPoint: popupsMountPoint,
          popupsBoundariesElement: popupsBoundariesElement,
          popupsScrollableElement: popupsScrollableElement,
          disabled: disabled,
          toolbarSize: toolbarSize,
          isToolbarReducedSpacing: isToolbarReducedSpacing,
          containerElement: containerElement,
          isLastItem: key === items.length - 1,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          wrapperElement: null
        });
        return element && /*#__PURE__*/_react.default.cloneElement(element, props);
      }));
    }
  }]);
  return ToolbarInner;
}(_react.default.Component);

exports.ToolbarInner = ToolbarInner;