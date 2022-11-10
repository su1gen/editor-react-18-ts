import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl-next';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';
import { insertTaskDecisionCommand } from '../../commands';
export var ToolbarTask = /*#__PURE__*/function (_PureComponent) {
  _inherits(ToolbarTask, _PureComponent);

  var _super = _createSuper(ToolbarTask);

  function ToolbarTask() {
    var _this;

    _classCallCheck(this, ToolbarTask);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      disabled: false
    });

    _defineProperty(_assertThisInitialized(_this), "handleInsertTask", function () {
      var editorView = _this.props.editorView;

      if (!editorView) {
        return false;
      }

      insertTaskDecisionCommand('taskList')(editorView.state, editorView.dispatch);
      return true;
    });

    return _this;
  }

  _createClass(ToolbarTask, [{
    key: "render",
    value: function render() {
      var disabled = this.state.disabled;
      var _this$props = this.props,
          isDisabled = _this$props.isDisabled,
          isReducedSpacing = _this$props.isReducedSpacing,
          formatMessage = _this$props.intl.formatMessage;
      var label = formatMessage(messages.action);
      return /*#__PURE__*/React.createElement(ToolbarButton, {
        buttonId: TOOLBAR_BUTTON.TASK_LIST,
        onClick: this.handleInsertTask,
        disabled: disabled || isDisabled,
        spacing: isReducedSpacing ? 'none' : 'default',
        title: "".concat(label, " []"),
        iconBefore: /*#__PURE__*/React.createElement(TaskIcon, {
          label: label
        })
      });
    }
  }]);

  return ToolbarTask;
}(PureComponent);
export default injectIntl(ToolbarTask);