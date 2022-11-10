/** @jsx jsx */
import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import UndoIcon from '@atlaskit/icon/glyph/undo';
import RedoIcon from '@atlaskit/icon/glyph/redo';
import { undo as undoKeymap, redo as redoKeymap, ToolTipContent } from '../../../../keymaps';
import { buttonGroupStyle, separatorStyles } from '../../../../ui/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../messages';
import { createTypeAheadTools } from '../../../type-ahead/api';
import { undoFromToolbar, redoFromToolbar } from '../../commands';

const closeTypeAheadAndRunCommand = editorView => command => {
  if (!editorView) {
    return;
  }

  const tool = createTypeAheadTools(editorView);

  if (tool.isOpen()) {
    tool.close({
      attachCommand: command,
      insertCurrentQueryAsRawText: false
    });
  } else {
    command(editorView.state, editorView.dispatch);
  }
};

const forceFocus = editorView => command => {
  closeTypeAheadAndRunCommand(editorView)(command);

  if (!editorView.hasFocus()) {
    editorView.focus();
  }
};

export class ToolbarUndoRedo extends PureComponent {
  render() {
    const {
      disabled,
      isReducedSpacing,
      historyState,
      editorView,
      intl: {
        formatMessage
      }
    } = this.props;

    const handleUndo = () => {
      forceFocus(editorView)(undoFromToolbar);
    };

    const handleRedo = () => {
      forceFocus(editorView)(redoFromToolbar);
    };

    const labelUndo = formatMessage(messages.undo);
    const labelRedo = formatMessage(messages.redo);
    const {
      canUndo,
      canRedo
    } = historyState;
    return jsx("span", {
      css: buttonGroupStyle
    }, jsx(ToolbarButton, {
      buttonId: TOOLBAR_BUTTON.UNDO,
      spacing: isReducedSpacing ? 'none' : 'default',
      onClick: handleUndo,
      disabled: !canUndo || disabled,
      "aria-label": labelUndo,
      title: jsx(ToolTipContent, {
        description: labelUndo,
        keymap: undoKeymap
      }),
      iconBefore: jsx(UndoIcon, {
        label: ""
      }),
      testId: "ak-editor-toolbar-button-undo"
    }), jsx(ToolbarButton, {
      spacing: isReducedSpacing ? 'none' : 'default',
      buttonId: TOOLBAR_BUTTON.REDO,
      onClick: handleRedo,
      disabled: !canRedo || disabled,
      title: jsx(ToolTipContent, {
        description: labelRedo,
        keymap: redoKeymap
      }),
      iconBefore: jsx(RedoIcon, {
        label: ""
      }),
      testId: "ak-editor-toolbar-button-redo",
      "aria-label": labelRedo
    }), jsx("span", {
      css: separatorStyles
    }));
  }

}
export default injectIntl(ToolbarUndoRedo);