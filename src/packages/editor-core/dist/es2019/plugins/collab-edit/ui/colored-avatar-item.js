/** @jsx jsx */
import { jsx } from '@emotion/react';
import { getAvatarColor } from '../utils';
import { badge } from './styles';
export const ColoredAvatarItem = props => {
  const color = getAvatarColor(props.sessionId).color.solid;
  const avatar = props.name.substr(0, 1).toUpperCase();
  return jsx("div", {
    css: badge(color),
    "data-testid": "editor-collab-badge"
  }, avatar);
};