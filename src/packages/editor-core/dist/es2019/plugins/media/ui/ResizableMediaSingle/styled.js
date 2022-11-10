import { css } from '@emotion/react';
import { MediaSingleDimensionHelper } from '@atlaskit/editor-common/ui';
export const wrapperStyle = props => css`
  & > div {
    ${MediaSingleDimensionHelper(props)};
    position: relative;
    clear: both;
  }
`;