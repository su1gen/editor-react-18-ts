import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { defineMessages, injectIntl } from 'react-intl-next';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import { akEditorFloatingPanelZIndex, akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../ui/ToolbarButton';
import Dropdown from '../../../ui/Dropdown';
import FindReplace from './FindReplace';
import { TRIGGER_METHOD } from '../../analytics/types';
import { ToolTipContent, findKeymapByDescription } from '../../../keymaps';
const toolbarButtonWrapper = css`
  display: flex;
  flex: 1 1 auto;
  flex-grow: 0;
  justify-content: flex-end;
  align-items: center;
  padding: 0 8px;
  @media (max-width: ${akEditorMobileMaxWidth}px) {
    justify-content: center;
    padding: 0;
  }
`;
const toolbarButtonWrapperFullWith = css`
  flex-grow: 1;
`;
const wrapper = css`
  display: flex;
  flex-direction: column;
`;
const messages = defineMessages({
  findReplaceToolbarButton: {
    id: 'fabric.editor.findReplaceToolbarButton',
    defaultMessage: 'Find and replace',
    description: '"Find" highlights all instances of a word or phrase on the document, and "Replace" changes one or all of those instances to something else'
  }
});

class FindReplaceToolbarButton extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "toggleOpen", () => {
      if (this.props.isActive) {
        this.props.onCancel({
          triggerMethod: TRIGGER_METHOD.TOOLBAR
        });
      } else {
        this.props.onActivate();
      }
    });
  }

  render() {
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      findText,
      replaceText,
      isActive,
      index,
      numMatches,
      intl: {
        formatMessage
      },
      takeFullWidth
    } = this.props;
    const title = formatMessage(messages.findReplaceToolbarButton);
    const stackBelowOtherEditorFloatingPanels = akEditorFloatingPanelZIndex - 1;
    return jsx("div", {
      css: [toolbarButtonWrapper, takeFullWidth && toolbarButtonWrapperFullWith]
    }, jsx(Dropdown, {
      mountTo: popupsMountPoint,
      boundariesElement: popupsBoundariesElement,
      scrollableElement: popupsScrollableElement,
      isOpen: isActive,
      handleEscapeKeydown: () => {
        if (isActive) {
          this.props.onCancel({
            triggerMethod: TRIGGER_METHOD.KEYBOARD
          });
        }
      },
      fitWidth: 352,
      zIndex: stackBelowOtherEditorFloatingPanels,
      trigger: jsx(ToolbarButton, {
        buttonId: TOOLBAR_BUTTON.FIND_REPLACE,
        spacing: isReducedSpacing ? 'none' : 'default',
        selected: isActive,
        title: jsx(ToolTipContent, {
          description: title,
          keymap: findKeymapByDescription('Find')
        }),
        iconBefore: jsx(EditorSearchIcon, {
          label: title
        }),
        onClick: this.toggleOpen,
        "aria-expanded": isActive,
        "aria-haspopup": true
      })
    }, jsx("div", {
      css: wrapper
    }, jsx(FindReplace, _extends({
      findText: findText,
      replaceText: replaceText,
      count: {
        index,
        total: numMatches
      }
    }, this.props)))));
  }

}

export default injectIntl(FindReplaceToolbarButton);