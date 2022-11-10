import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { inputStyle } from './styles';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';

class ChromeCollapsed extends PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "focusHandler", evt => {
      /**
       * We need this magic for FireFox.
       * The reason we need it is, when, in FireFox, we have focus inside input,
       * and then we remove that input and move focus to another place programmatically,
       * for whatever reason UP/DOWN arrows don't work until you blur and focus editor manually.
       */
      if (this.input) {
        this.input.blur();
      }

      if (this.props.onFocus) {
        this.props.onFocus(evt);
      }
    });

    _defineProperty(this, "handleInputRef", ref => {
      this.input = ref;
    });
  }

  render() {
    const placeholder = this.props.text || this.props.intl.formatMessage(messages.chromeCollapsedPlaceholder);
    return jsx("input", {
      css: inputStyle,
      ref: this.handleInputRef,
      onFocus: this.focusHandler,
      placeholder: placeholder
    });
  }

}

export default injectIntl(ChromeCollapsed);