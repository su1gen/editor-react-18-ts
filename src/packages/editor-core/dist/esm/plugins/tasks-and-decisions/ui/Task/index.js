import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["providers", "intl"];

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl-next';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import TaskItemWithProviders from './task-item-with-providers';
var messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.taskPlaceholder',
    defaultMessage: "Type your action, use '@' to assign to someone.",
    description: 'Placeholder description for an empty action/task in the editor'
  }
});
export var TaskItem = /*#__PURE__*/function (_PureComponent) {
  _inherits(TaskItem, _PureComponent);

  var _super = _createSuper(TaskItem);

  function TaskItem(props) {
    var _this;

    _classCallCheck(this, TaskItem);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "renderWithProvider", function (providers) {
      var _this$props = _this.props,
          _providerFactory = _this$props.providers,
          formatMessage = _this$props.intl.formatMessage,
          otherProps = _objectWithoutProperties(_this$props, _excluded);

      var taskDecisionProvider = providers.taskDecisionProvider,
          contextIdentifierProvider = providers.contextIdentifierProvider;
      var placeholder = formatMessage(messages.placeholder);
      return /*#__PURE__*/React.createElement(TaskItemWithProviders, _extends({}, otherProps, {
        placeholder: placeholder,
        taskDecisionProvider: taskDecisionProvider,
        contextIdentifierProvider: contextIdentifierProvider
      }));
    });

    _this.providerFactory = props.providers || new ProviderFactory();
    return _this;
  }

  _createClass(TaskItem, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.providers) {
        // new ProviderFactory is created if no `providers` has been set
        // in this case when component is unmounted it's safe to destroy this providerFactory
        this.providerFactory.destroy();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['taskDecisionProvider', 'contextIdentifierProvider'],
        providerFactory: this.providerFactory,
        renderNode: this.renderWithProvider
      });
    }
  }]);

  return TaskItem;
}(PureComponent);

_defineProperty(TaskItem, "displayName", 'TaskItem');

export default injectIntl(TaskItem);