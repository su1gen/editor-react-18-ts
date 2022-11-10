"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "getNearestNonTextNode", {
  enumerable: true,
  get: function get() {
    return _utils.getNearestNonTextNode;
  }
});
Object.defineProperty(exports, "getOffsetParent", {
  enumerable: true,
  get: function get() {
    return _utils.getOffsetParent;
  }
});
Object.defineProperty(exports, "handlePositionCalculatedWith", {
  enumerable: true,
  get: function get() {
    return _utils.handlePositionCalculatedWith;
  }
});

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _ui = require("@atlaskit/editor-common/ui");

var _styles = require("./styles");

var _utils = require("./utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FloatingToolbar = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(FloatingToolbar, _PureComponent);

  var _super = _createSuper(FloatingToolbar);

  function FloatingToolbar() {
    (0, _classCallCheck2.default)(this, FloatingToolbar);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(FloatingToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          target = _this$props.target,
          offset = _this$props.offset,
          fitWidth = _this$props.fitWidth,
          _this$props$fitHeight = _this$props.fitHeight,
          fitHeight = _this$props$fitHeight === void 0 ? 40 : _this$props$fitHeight,
          onPositionCalculated = _this$props.onPositionCalculated,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          className = _this$props.className,
          alignX = _this$props.alignX,
          alignY = _this$props.alignY,
          zIndex = _this$props.zIndex;

      if (!target) {
        return null;
      }

      return (0, _react.jsx)(_ui.Popup, {
        alignX: alignX,
        alignY: alignY,
        target: target,
        zIndex: zIndex,
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        offset: offset,
        fitWidth: fitWidth,
        fitHeight: fitHeight,
        onPositionCalculated: onPositionCalculated
      }, (0, _react.jsx)("div", {
        css: (0, _styles.container)(fitHeight),
        "data-testid": "popup-container",
        className: className
      }, children));
    }
  }]);
  return FloatingToolbar;
}(_react2.PureComponent);

exports.default = FloatingToolbar;