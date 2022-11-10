import { css } from '@emotion/react';
import { blockquoteSharedStyles, headingsSharedStyles } from '@atlaskit/editor-common/styles';
export const blocktypeStyles = props => css`
  .ProseMirror {
    ${blockquoteSharedStyles};
    ${headingsSharedStyles(props)};
  }
`;