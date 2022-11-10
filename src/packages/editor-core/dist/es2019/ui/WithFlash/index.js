import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx, keyframes } from '@emotion/react';
import { R100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
const pulseBackground = keyframes`
  50% {
    background-color: ${token('color.blanket.danger', R100)};
  }
`;
const pulseBackgroundReverse = keyframes`
  0% {
    background-color: ${token('color.blanket.danger', R100)};
  }
  50% {
    background-color: auto;
  }
  100% {
    background-color: ${token('color.blanket.danger', R100)};
  }
`;
const flashWrapper = css`
  &.-flash > div {
    animation: 0.25s ease-in-out ${pulseBackgroundReverse};
  }

  & > div {
    animation: 'none';
  }
`;
const flashWrapperAnimated = css`
  ${flashWrapper}

  & > div {
    animation: 0.25s ease-in-out ${pulseBackground};
  }
`;
export default class WithFlash extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "toggle", false);
  }

  render() {
    const {
      animate,
      children
    } = this.props;
    this.toggle = animate && !this.toggle;
    return jsx("div", {
      css: animate ? flashWrapperAnimated : flashWrapper,
      className: this.toggle ? '-flash' : ''
    }, children);
  }

}