import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl-next';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../../insert-block/ui/ToolbarInsertBlock/messages';
import { insertTaskDecisionCommand } from '../../commands';
export class ToolbarDecision extends PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      disabled: false
    });

    _defineProperty(this, "handleInsertDecision", () => {
      const {
        editorView
      } = this.props;

      if (!editorView) {
        return false;
      }

      insertTaskDecisionCommand('decisionList')(editorView.state, editorView.dispatch);
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
    const label = formatMessage(messages.decision);
    return /*#__PURE__*/React.createElement(ToolbarButton, {
      buttonId: TOOLBAR_BUTTON.DECISION_LIST,
      onClick: this.handleInsertDecision,
      disabled: disabled || isDisabled,
      spacing: isReducedSpacing ? 'none' : 'default',
      title: `${label} <>`,
      iconBefore: /*#__PURE__*/React.createElement(DecisionIcon, {
        label: label
      })
    });
  }

}
export default injectIntl(ToolbarDecision);