import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import debounce from 'lodash/debounce';
import React from 'react';
import { css, jsx } from '@emotion/react';
const statusDebounceMillis = 1400;
const assitiveTextStyles = css({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  marginbottom: '-1px',
  marginright: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whitespace: 'nowrap',
  width: '1px'
});

class AssistveTextComponent extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      bump: false,
      //when the same text needs to be read again, Hence it needs to be toggled between __status--A and __status--B
      debounced: false,
      silenced: false
    });
  }

  componentWillMount() {
    this.debounceStatusUpdate = debounce(() => {
      if (!this.state.debounced) {
        const shouldSilence = !this.props.isInFocus;
        this.setState(({
          bump
        }) => ({
          bump: !bump,
          debounced: true,
          silenced: shouldSilence
        }));
      }
    }, statusDebounceMillis);
  }

  componentWillUnmount() {}

  componentWillReceiveProps() {
    this.setState(({
      bump
    }) => ({
      bump: !bump,
      debounced: false
    }));
  }

  render() {
    const {
      assistiveText,
      id
    } = this.props;
    const {
      bump,
      debounced,
      silenced
    } = this.state;
    this.debounceStatusUpdate();
    return jsx("div", {
      css: assitiveTextStyles
    }, jsx("div", {
      id: id + '__status--A',
      role: "status",
      "aria-atomic": "true",
      "aria-live": "polite"
    }, `${!silenced && debounced && bump ? assistiveText : ''}`), jsx("div", {
      id: id + '__status--B',
      role: "status",
      "aria-atomic": "true",
      "aria-live": "polite"
    }, `${!silenced && debounced && !bump ? assistiveText : ''}`));
  }

}

_defineProperty(AssistveTextComponent, "defaultProps", {
  statusDebounceMillis: 1400,
  debounce: true,
  assistiveText: '',
  isInFocus: false,
  id: ''
});

export const AssistiveText = AssistveTextComponent;