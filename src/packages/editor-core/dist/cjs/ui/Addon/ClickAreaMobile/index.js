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

var _clickAreaHelper = require("../click-area-helper");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * Fills the visible viewport height so that it can filter
 * clicks/taps within or below the content (e.g. if the content
 * doesn't exceed the viewport, or whether it overflows it).
 */
var clickWrapper = function clickWrapper(_ref) {
  var isExpanded = _ref.isExpanded,
      minHeight = _ref.minHeight;
  return (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n  ", ";\n"])), isExpanded && minHeight ? "min-height: ".concat(minHeight, "px") : '');
};

/**
 * Click Area is responsible for improving UX by ensuring the user
 * can always tap beneath the content area, to insert more content.
 *
 * This is achieved by inserting a new empty paragraph at the end of
 * the document (if one doesn't already exist).
 *
 * This is particularly important when the content exceeds the visible
 * viewport height, and if the last content node captures text selection
 * e.g. table, layouts, codeblock, etc.
 *
 * This relies on the Scroll Gutter plugin which inserts additional
 * whitespace at the end of the document when it overflows the viewport.
 */
var ClickAreaMobile = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ClickAreaMobile, _React$Component);

  var _super = _createSuper(ClickAreaMobile);

  function ClickAreaMobile() {
    var _this;

    (0, _classCallCheck2.default)(this, ClickAreaMobile);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "clickElementRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClick", function (event) {
      var _this$props = _this.props,
          view = _this$props.editorView,
          editorDisabled = _this$props.editorDisabled;

      if (!view) {
        return;
      }

      if (!editorDisabled) {
        // if the editor is disabled -- we don't want to intercept any click events
        (0, _clickAreaHelper.clickAreaClickHandler)(view, event);
      }

      var scrollGutterClicked = event.clientY > view.dom.getBoundingClientRect().bottom; // Reset the default prosemirror scrollIntoView logic by
      // clamping the scroll position to the bottom of the viewport.

      if (scrollGutterClicked) {
        event.preventDefault();

        if (_this.clickElementRef.current) {
          _this.clickElementRef.current.scrollIntoView(false);
        }
      }
    });
    return _this;
  }

  (0, _createClass2.default)(ClickAreaMobile, [{
    key: "render",
    value: function render() {
      return (0, _react2.jsx)("div", {
        css: clickWrapper({
          isExpanded: this.props.isExpanded,
          minHeight: this.props.minHeight
        }),
        className: "editor-click-wrapper",
        onClick: this.handleClick,
        ref: this.clickElementRef
      }, this.props.children);
    }
  }]);
  return ClickAreaMobile;
}(_react.default.Component);

exports.default = ClickAreaMobile;