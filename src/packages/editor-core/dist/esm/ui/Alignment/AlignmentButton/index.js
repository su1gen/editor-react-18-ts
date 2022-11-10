import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { PureComponent } from 'react';
import ToolbarButton from '../../ToolbarButton';
import { ToolTipContent } from '../../../keymaps';

var AlignmentButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(AlignmentButton, _PureComponent);

  var _super = _createSuper(AlignmentButton);

  function AlignmentButton() {
    var _this;

    _classCallCheck(this, AlignmentButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onClick", function (e) {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          value = _this$props.value;
      e.preventDefault();
      onClick(value);
    });

    return _this;
  }

  _createClass(AlignmentButton, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          label = _this$props2.label,
          isSelected = _this$props2.isSelected,
          content = _this$props2.content,
          shortcut = _this$props2.shortcut;
      return /*#__PURE__*/React.createElement(ToolbarButton, {
        disabled: false,
        selected: isSelected,
        title: /*#__PURE__*/React.createElement(ToolTipContent, {
          description: label,
          keymap: shortcut
        }),
        "aria-label": label,
        "aria-pressed": isSelected,
        onClick: this.onClick,
        iconBefore: content
      });
    }
  }]);

  return AlignmentButton;
}(PureComponent);

export default AlignmentButton;