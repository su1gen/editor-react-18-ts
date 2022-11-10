import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl-next';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';
import { insertTaskDecisionCommand } from '../../commands';
export class ToolbarTask extends PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      disabled: false
    });

    _defineProperty(this, "handleInsertTask", () => {
      const {
        editorView
      } = this.props;

      if (!editorView) {
        return false;
      }

      insertTaskDecisionCommand('taskList')(editorView.state, editorView.dispatch);
      return true;
    });
  }

  render() {
    const {
      disabled
    } = this.state;
    const {
      isDisabled,
      isReducedSpacing,
      intl: {
        formatMessage
      }
    } = this.props;
    const label = formatMessage(messages.action);
    return /*#__PURE__*/React.createElement(ToolbarButton, {
      buttonId: TOOLBAR_BUTTON.TASK_LIST,
      onClick: this.handleInsertTask,
      disabled: disabled || isDisabled,
      spacing: isReducedSpacing ? 'none' : 'default',
      title: `${label} []`,
      iconBefore: /*#__PURE__*/React.createElement(TaskIcon, {
        label: label
      })
    });
  }

}
export default injectIntl(ToolbarTask);