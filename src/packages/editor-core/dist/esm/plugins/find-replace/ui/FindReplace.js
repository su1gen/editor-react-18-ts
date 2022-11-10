import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import Find from './Find';
import Replace from './Replace';
import { ruleStyles, wrapperStyles } from './styles';

var FindReplace = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FindReplace, _React$PureComponent);

  var _super = _createSuper(FindReplace);

  function FindReplace() {
    var _this;

    _classCallCheck(this, FindReplace);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "findTextfield", null);

    _defineProperty(_assertThisInitialized(_this), "replaceTextfield", null);

    _defineProperty(_assertThisInitialized(_this), "setFindTextfieldRef", function (findTextfieldRef) {
      _this.findTextfield = findTextfieldRef.current;
    });

    _defineProperty(_assertThisInitialized(_this), "setReplaceTextfieldRef", function (replaceTextfieldRef) {
      _this.replaceTextfield = replaceTextfieldRef.current;
    });

    _defineProperty(_assertThisInitialized(_this), "setFocusToFind", function () {
      if (_this.findTextfield) {
        _this.findTextfield.focus();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "setFocusToReplace", function () {
      if (_this.replaceTextfield) {
        _this.replaceTextfield.focus();
      }
    });

    return _this;
  }

  _createClass(FindReplace, [{
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
      return jsx("div", {
        css: wrapperStyles
      }, jsx(Find, {
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
      }), jsx("hr", {
        css: ruleStyles,
        id: "replace-hr-element"
      }), jsx(Replace, {
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
}(React.PureComponent);

export default FindReplace;