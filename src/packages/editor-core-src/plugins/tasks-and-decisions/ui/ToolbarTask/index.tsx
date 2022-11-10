import React, { PureComponent } from 'react';

import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';

import TaskIcon from '@atlaskit/icon/glyph/editor/task';

import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';
import { insertTaskDecisionCommand } from '../../commands';

export interface Props {
  editorView?: EditorView;
  isDisabled?: boolean;
  isReducedSpacing?: boolean;
}

export interface State {
  disabled: boolean;
}

export class ToolbarTask extends PureComponent<
  Props & WrappedComponentProps,
  State
> {
  state: State = { disabled: false };

  render() {
    const { disabled } = this.state;
    const {
      isDisabled,
      isReducedSpacing,
      intl: { formatMessage },
    } = this.props;

    const label = formatMessage(messages.action);

    return (
      <ToolbarButton
        buttonId={TOOLBAR_BUTTON.TASK_LIST}
        onClick={this.handleInsertTask}
        disabled={disabled || isDisabled}
        spacing={isReducedSpacing ? 'none' : 'default'}
        title={`${label} []`}
        iconBefore={<TaskIcon label={label} />}
      />
    );
  }

  private handleInsertTask = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    insertTaskDecisionCommand('taskList')(
      editorView.state,
      editorView.dispatch,
    );
    return true;
  };
}

export default injectIntl(ToolbarTask);
