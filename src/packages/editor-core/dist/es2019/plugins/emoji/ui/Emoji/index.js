/** @jsx jsx */
import { jsx } from '@emotion/react';
import { clickSelectWrapperStyle } from '../../../../ui/styles';
import { Emoji } from '@atlaskit/editor-common/emoji';
export default function EmojiNode(props) {
  return jsx("span", {
    css: clickSelectWrapperStyle
  }, jsx(Emoji, props));
}