"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Decision = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _taskDecision = require("@atlaskit/task-decision");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var messages = (0, _reactIntlNext.defineMessages)({
  placeholder: {
    id: 'fabric.editor.decisionPlaceholder',
    defaultMessage: 'Add a decision…',
    description: 'Placeholder description for an empty decision in the editor'
  }
});

var Decision = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Decision, _React$Component);

  var _super = _createSuper(Decision);

  function Decision() {
    (0, _classCallCheck2.default)(this, Decision);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Decision, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          contentRef = _this$props.contentRef,
          showPlaceholder = _this$props.showPlaceholder,
          formatMessage = _this$props.intl.formatMessage;
      var placeholder = formatMessage(messages.placeholder);
      return /*#__PURE__*/_react.default.createElement(_taskDecision.DecisionItem, {
        contentRef: contentRef,
        placeholder: placeholder,
        showPlaceholder: showPlaceholder
      });
    }
  }]);
  return Decision;
}(_react.default.Component);

exports.Decision = Decision;
(0, _defineProperty2.default)(Decision, "displayName", 'Decision');

var _default = (0, _reactIntlNext.injectIntl)(Decision);

exports.default = _default;