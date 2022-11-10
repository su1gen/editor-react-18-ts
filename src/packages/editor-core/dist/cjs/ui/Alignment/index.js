"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _reactIntlNext = require("react-intl-next");

var _iconMap = require("../../plugins/alignment/ui/ToolbarAlignment/icon-map");

var _AlignmentButton = _interopRequireDefault(require("./AlignmentButton"));

var _messages = require("./messages");

var _styles = require("./styles");

var _keymaps = require("../../keymaps");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var alignmentOptions = [{
  title: _messages.alignmentMessages.alignLeft,
  shortcut: _keymaps.alignLeft,
  value: 'start'
}, {
  title: _messages.alignmentMessages.alignCenter,
  value: 'center'
}, {
  title: _messages.alignmentMessages.alignRight,
  shortcut: _keymaps.alignRight,
  value: 'end'
}];

var Alignment = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(Alignment, _PureComponent);

  var _super = _createSuper(Alignment);

  function Alignment() {
    (0, _classCallCheck2.default)(this, Alignment);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Alignment, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onClick = _this$props.onClick,
          selectedAlignment = _this$props.selectedAlignment,
          className = _this$props.className,
          intl = _this$props.intl;
      return (0, _react.jsx)("div", {
        css: _styles.alignmentWrapper,
        className: className
      }, alignmentOptions.map(function (alignment) {
        var value = alignment.value,
            title = alignment.title,
            shortcut = alignment.shortcut;
        var message = intl.formatMessage(title);
        return (0, _react.jsx)(_AlignmentButton.default, {
          content: (0, _react.jsx)(_iconMap.IconMap, {
            alignment: value
          }),
          key: value,
          value: value,
          label: message,
          shortcut: shortcut,
          onClick: onClick,
          isSelected: value === selectedAlignment
        });
      }));
    }
  }]);
  return Alignment;
}(_react2.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(Alignment);

exports.default = _default;