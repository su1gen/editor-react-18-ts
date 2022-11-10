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

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _Find = _interopRequireDefault(require("./Find"));

var _Replace = _interopRequireDefault(require("./Replace"));

var _styles = require("./styles");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FindReplace = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(FindReplace, _React$PureComponent);

  var _super = _createSuper(FindReplace);

  function FindReplace() {
    var _this;

    (0, _classCallCheck2.default)(this, FindReplace);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "findTextfield", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "replaceTextfield", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setFindTextfieldRef", function (findTextfieldRef) {
      _this.findTextfield = findTextfieldRef.current;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setReplaceTextfieldRef", function (replaceTextfieldRef) {
      _this.replaceTextfield = replaceTextfieldRef.current;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setFocusToFind", function () {
      if (_this.findTextfield) {
        _this.findTextfield.focus();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setFocusToReplace", function () {
      if (_this.replaceTextfield) {
        _this.replaceTextfield.focus();
      }
    });
    return _this;
  }

  (0, _createClass2.default)(FindReplace, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          findText = _this$props.findText,
          count = _this$props.count,
          shouldFocus = _this$props.shouldFocus,
          onFind = _this$props.onFind,
          onFindBlur = _this$props.onFindBlur,
          onFindNext = _this$props.onFindNext,
          onFindPrev = _this$props.onFindPrev,
          onCancel = _this$props.onCancel,
          replaceText = _this$props.replaceText,
          onReplace = _this$props.onReplace,
          onReplaceAll = _this$props.onReplaceAll,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          allowMatchCase = _this$props.allowMatchCase,
          shouldMatchCase = _this$props.shouldMatchCase,
          onToggleMatchCase = _this$props.onToggleMatchCase;
      return (0, _react2.jsx)("div", {
        css: _styles.wrapperStyles
      }, (0, _react2.jsx)(_Find.default, {
        allowMatchCase: allowMatchCase,
        shouldMatchCase: shouldMatchCase,
        onToggleMatchCase: onToggleMatchCase,
        findText: findText,
        count: count,
        shouldFocus: shouldFocus,
        onFind: onFind,
        onFindBlur: onFindBlur,
        onFindPrev: onFindPrev,
        onFindNext: onFindNext,
        onFindTextfieldRefSet: this.setFindTextfieldRef,
        onCancel: onCancel,
        onArrowDown: this.setFocusToReplace
      }), (0, _react2.jsx)("hr", {
        css: _styles.ruleStyles,
        id: "replace-hr-element"
      }), (0, _react2.jsx)(_Replace.default, {
        canReplace: count.total > 0,
        replaceText: replaceText,
        onReplace: onReplace,
        onReplaceAll: onReplaceAll,
        onReplaceTextfieldRefSet: this.setReplaceTextfieldRef,
        onArrowUp: this.setFocusToFind,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent
      }));
    }
  }]);
  return FindReplace;
}(_react.default.PureComponent);

var _default = FindReplace;
exports.default = _default;