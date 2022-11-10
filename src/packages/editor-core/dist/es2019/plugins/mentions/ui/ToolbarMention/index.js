import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { PureComponent } from 'react';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { INPUT_METHOD } from '../../../analytics';
import { createTypeAheadTools } from '../../../type-ahead/api';
import { injectIntl } from 'react-intl-next';
import { messages } from '../../messages';

class ToolbarMention extends PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleInsertMention", () => {
      if (!this.props.editorView) {
        return false;
      }

      createTypeAheadTools(this.props.editorView).openMention(INPUT_METHOD.INSERT_MENU);
      return true;
    });
  }

  render() {
    const mentionStringTranslated = this.props.intl.formatMessage(messages.mentionsIconLabel);
    return /*#__PURE__*/React.createElement(ToolbarButton, {
      testId: this.props.testId,
      buttonId: TOOLBAR_BUTTON.MENTION,
      spacing: "none",
      onClick: this.handleInsertMention,
      disabled: this.props.isDisabled,
      title: mentionStringTranslated + '@',
      iconBefore: /*#__PURE__*/React.createElement(MentionIcon, {
        label: mentionStringTranslated
      })
    });
  }

}

export default injectIntl(ToolbarMention);