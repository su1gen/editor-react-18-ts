/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';
const spinnerWrapper = css`
  display: flex;
  justify-content: center;
  margin-top: 64px;
`;

const LoadingState = () => jsx("div", {
  css: spinnerWrapper
}, jsx(Spinner, {
  size: "small"
}));

export default LoadingState;