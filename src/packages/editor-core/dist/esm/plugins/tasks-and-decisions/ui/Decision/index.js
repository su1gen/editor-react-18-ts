import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { defineMessages, injectIntl } from 'react-intl-next';
import { DecisionItem } from '@atlaskit/task-decision';
var messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.decisionPlaceholder',
    defaultMessage: 'Add a decision…',
    description: 'Placeholder description for an empty decision in the editor'
  }
});
export var Decision = /*#__PURE__*/function (_React$Component) {
  _inherits(Decision, _React$Component);

  var _super = _createSuper(Decision);

  function Decision() {
    _classCallCheck(this, Decision);

    return _super.apply(this, arguments);
  }

  _createClass(Decision, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          contentRef = _this$props.contentRef,
          showPlaceholder = _this$props.showPlaceholder,
          formatMessage = _this$props.intl.formatMessage;
      var placeholder = formatMessage(messages.placeholder);
      return /*#__PURE__*/React.createElement(DecisionItem, {
        contentRef: contentRef,
        placeholder: placeholder,
        showPlaceholder: showPlaceholder
      });
    }
  }]);

  return Decision;
}(React.Component);

_defineProperty(Decision, "displayName", 'Decision');

export default injectIntl(Decision);