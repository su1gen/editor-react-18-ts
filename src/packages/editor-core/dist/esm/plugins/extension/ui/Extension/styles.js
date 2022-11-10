import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

import { css } from '@emotion/react';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { N20, DN50, DN700, B200, N20A, N70 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { EXTENSION_PADDING, BODIED_EXT_PADDING } from '@atlaskit/editor-common/styles';
export { EXTENSION_PADDING as padding, BODIED_EXT_PADDING };
export var wrapperDefault = function wrapperDefault(theme) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: ", ";\n  border-radius: ", "px;\n  color: ", ";\n  position: relative;\n  vertical-align: middle;\n\n  .ProseMirror-selectednode > span > & > .extension-overlay {\n    box-shadow: inset 0px 0px 0px 2px ", ";\n    opacity: 1;\n  }\n\n  &.with-overlay {\n    .extension-overlay {\n      background: ", ";\n      color: transparent;\n    }\n\n    &:hover .extension-overlay {\n      opacity: 1;\n    }\n  }\n"])), themed({
    light: token('color.background.neutral', N20),
    dark: token('color.background.neutral', DN50)
  })(theme), borderRadius(), themed({
    dark: token('color.text', DN700)
  })(theme), token('color.border.selected', B200), token('color.background.neutral.hovered', N20A));
};
export var overlay = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  border-radius: ", "px;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.3s;\n"])), borderRadius());
export var placeholderFallback = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: inline-flex;\n  align-items: center;\n\n  & > img {\n    margin: 0 4px;\n  }\n  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */\n  /* stylelint-disable-next-line */\n  label: placeholder-fallback;\n"])));
export var placeholderFallbackParams = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: inline-block;\n  max-width: 200px;\n  margin-left: 5px;\n  color: ", ";\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n"])), token('color.text.subtlest', N70));
export var styledImage = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  max-height: 16px;\n  max-width: 16px;\n  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */\n  /* stylelint-disable-next-line */\n  label: lozenge-image;\n"])));