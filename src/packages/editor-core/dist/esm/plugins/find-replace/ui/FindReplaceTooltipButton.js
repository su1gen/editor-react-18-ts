import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { ToolTipContent, findKeymapByDescription } from '../../../keymaps';
import Button from '@atlaskit/button/standard-button';
export var FindReplaceTooltipButton = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FindReplaceTooltipButton, _React$PureComponent);

  var _super = _createSuper(FindReplaceTooltipButton);

  function FindReplaceTooltipButton() {
    var _this;

    _classCallCheck(this, FindReplaceTooltipButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "buttonRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "handleClick", function () {
      _this.props.onClick(_this.buttonRef);
    });

    return _this;
  }

  _createClass(FindReplaceTooltipButton, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          icon = _this$props.icon,
          keymapDescription = _this$props.keymapDescription,
          disabled = _this$props.disabled,
          isPressed = _this$props.isPressed;

      var pressedProps = _objectSpread({}, typeof isPressed === 'boolean' && {
        'aria-pressed': isPressed
      });

      return /*#__PURE__*/React.createElement(Tooltip, {
        content: /*#__PURE__*/React.createElement(ToolTipContent, {
          description: title,
          keymap: findKeymapByDescription(keymapDescription)
        }),
        hideTooltipOnClick: true,
        position: 'top'
      }, /*#__PURE__*/React.createElement(Button, _extends({
        label: title,
        appearance: "subtle",
        testId: title,
        ref: this.buttonRef,
        iconBefore: icon,
        isDisabled: disabled,
        onClick: this.handleClick,
        isSelected: isPressed,
        shouldFitContainer: true
      }, pressedProps)));
    }
  }]);

  return FindReplaceTooltipButton;
}(React.PureComponent);

_defineProperty(FindReplaceTooltipButton, "defaultProps", {
  keymapDescription: 'no-keymap'
});