/** @jsx jsx */
import { jsx } from '@emotion/react';
import { getAvatarColor } from '../utils';
import { badge } from './styles';
export var ColoredAvatarItem = function ColoredAvatarItem(props) {
  var color = getAvatarColor(props.sessionId).color.solid;
  var avatar = props.name.substr(0, 1).toUpperCase();
  return jsx("div", {
    css: badge(color),
    "data-testid": "editor-collab-badge"
  }, avatar);
};