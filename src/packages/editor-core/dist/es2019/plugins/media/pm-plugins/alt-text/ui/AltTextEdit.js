import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { N100, N30, R400, N80 } from '@atlaskit/theme/colors';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { messages } from '../messages';
import { injectIntl } from 'react-intl-next';
import Button from '../../../../floating-toolbar/ui/Button';
import PanelTextInput from '../../../../../ui/PanelTextInput';
import * as keymaps from '../../../../../keymaps';
import { ToolTipContent } from '../../../../../keymaps';
import { closeMediaAltTextMenu, updateAltText } from '../commands';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, fireAnalyticsEvent, ACTION } from '../../../../analytics';
import { RECENT_SEARCH_WIDTH_IN_PX } from '../../../../../ui/LinkSearch/ToolbarComponents';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { ErrorMessage } from '@atlaskit/editor-common/ui';
import { token } from '@atlaskit/tokens';
export const CONTAINER_WIDTH_IN_PX = RECENT_SEARCH_WIDTH_IN_PX;
export const MAX_ALT_TEXT_LENGTH = 510; // double tweet length

const supportText = css`
  color: ${token('color.text.subtlest', N100)};
  font-size: ${relativeFontSizeToBase16(12)};
  padding: 12px 40px;
  line-height: 20px;
  border-top: 1px solid ${token('color.border', N30)};
  margin: 0;
`;
const container = css`
  width: ${CONTAINER_WIDTH_IN_PX}px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  line-height: 2;
`;
const inputWrapper = css`
  display: flex;
  line-height: 0;
  padding: 5px 0;
  align-items: center;
`;
const validationWrapper = css`
  display: flex;
  line-height: 0;
  padding: 12px 24px 12px 0;
  margin: 0 12px 0 40px;
  border-top: 1px solid ${token('color.border.danger', R400)};
  align-items: start;
  flex-direction: column;
`;
const buttonWrapper = css`
  display: flex;
  padding: 4px 8px;
`;
const clearText = css`
  color: ${token('color.icon.subtle', N80)};
`;
export class AltTextEditComponent extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      showClearTextButton: Boolean(this.props.value),
      validationErrors: this.props.value ? this.getValidationErrors(this.props.value) : [],
      lastValue: this.props.value
    });

    _defineProperty(this, "closeMediaAltTextMenu", () => {
      const {
        view
      } = this.props;
      closeMediaAltTextMenu(view.state, view.dispatch);
    });

    _defineProperty(this, "dispatchCancelEvent", event => {
      const {
        view
      } = this.props; // We need to pass down the ESCAPE keymap
      // because when we focus on the Toolbar, Prosemirror blur,
      // making all keyboard shortcuts not working

      view.someProp('handleKeyDown', fn => fn(view, event));
    });

    _defineProperty(this, "updateAltText", newAltText => {
      const {
        view
      } = this.props;
      const newValue = newAltText.length === 0 ? '' : newAltText;
      updateAltText(newValue)(view.state, view.dispatch);
    });

    _defineProperty(this, "handleOnChange", newAltText => {
      const validationErrors = this.getValidationErrors(newAltText);
      this.setState({
        showClearTextButton: Boolean(newAltText),
        validationErrors,
        lastValue: newAltText
      }, () => {
        if (!validationErrors || !validationErrors.length) {
          this.updateAltText(newAltText);
        }
      });
    });

    _defineProperty(this, "handleOnBlur", () => {
      // Handling the trimming onBlur() because PanelTextInput doesn't sync
      // defaultValue properly during unmount
      const {
        value
      } = this.props;
      const newValue = (this.state.lastValue || value || '').trim();
      this.handleOnChange(newValue);
    });

    _defineProperty(this, "handleClearText", () => {
      this.handleOnChange('');
    });

    const {
      createAnalyticsEvent
    } = props;
    this.fireCustomAnalytics = fireAnalyticsEvent(createAnalyticsEvent);
  }

  componentDidMount() {
    this.prevValue = this.props.value;
  }

  componentWillUnmount() {
    this.fireAnalytics(ACTION.CLOSED);

    if (!this.prevValue && this.props.value) {
      this.fireAnalytics(ACTION.ADDED);
    }

    if (this.prevValue && !this.props.value) {
      this.fireAnalytics(ACTION.CLEARED);
    }

    if (this.prevValue && this.prevValue !== this.props.value) {
      this.fireAnalytics(ACTION.EDITED);
    }
  }

  getValidationErrors(value) {
    const {
      altTextValidator
    } = this.props;

    if (value && typeof altTextValidator === 'function') {
      return altTextValidator(value) || [];
    }

    return [];
  }

  render() {
    const {
      intl: {
        formatMessage
      }
    } = this.props;
    const {
      showClearTextButton
    } = this.state;
    const backButtonMessage = formatMessage(messages.back);
    const backButtonMessageComponent = jsx(ToolTipContent, {
      description: backButtonMessage,
      keymap: keymaps.escape,
      shortcutOverride: "Esc"
    });
    const errorsList = (this.state.validationErrors || []).map(function (error, index) {
      return jsx(ErrorMessage, {
        key: index
      }, error);
    });
    return jsx("div", {
      css: container
    }, jsx("section", {
      css: inputWrapper
    }, jsx("div", {
      css: buttonWrapper
    }, jsx(Button, {
      title: formatMessage(messages.back),
      icon: jsx(ChevronLeftLargeIcon, {
        label: formatMessage(messages.back)
      }),
      tooltipContent: backButtonMessageComponent,
      onClick: this.closeMediaAltTextMenu
    })), jsx(PanelTextInput, {
      testId: "alt-text-input",
      ariaLabel: formatMessage(messages.placeholder),
      describedById: "support-text",
      placeholder: formatMessage(messages.placeholder),
      defaultValue: this.state.lastValue,
      onCancel: this.dispatchCancelEvent,
      onChange: this.handleOnChange,
      onBlur: this.handleOnBlur,
      onSubmit: this.closeMediaAltTextMenu,
      maxLength: MAX_ALT_TEXT_LENGTH,
      autoFocus: true
    }), showClearTextButton && jsx("div", {
      css: buttonWrapper
    }, jsx(Button, {
      testId: "alt-text-clear-button",
      title: formatMessage(messages.clear),
      icon: jsx("span", {
        css: clearText
      }, jsx(CrossCircleIcon, {
        label: formatMessage(messages.clear)
      })),
      tooltipContent: formatMessage(messages.clear),
      onClick: this.handleClearText
    }))), !!errorsList.length && jsx("section", {
      css: validationWrapper
    }, errorsList), jsx("p", {
      css: supportText,
      id: "support-text"
    }, formatMessage(messages.supportText)));
  }

  fireAnalytics(actionType) {
    const {
      createAnalyticsEvent
    } = this.props;

    if (createAnalyticsEvent && this.fireCustomAnalytics) {
      this.fireCustomAnalytics({
        payload: {
          action: actionType,
          actionSubject: ACTION_SUBJECT.MEDIA,
          actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
          eventType: EVENT_TYPE.TRACK
        }
      });
    }
  }

}
export default withAnalyticsEvents()(injectIntl(AltTextEditComponent));