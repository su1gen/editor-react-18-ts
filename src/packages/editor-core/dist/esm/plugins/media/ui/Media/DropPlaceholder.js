import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import { B400, B300, B200 } from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { hexToRgba } from '@atlaskit/adf-schema';
import { injectIntl } from 'react-intl-next';
import { dropPlaceholderMessages } from './drop-placeholder-messages';
import { token } from '@atlaskit/tokens';
import { MEDIA_HEIGHT, FILE_WIDTH } from '../../nodeviews/mediaNodeView/media';
var iconWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: ", ";\n  background: ", ";\n  border-radius: ", "px;\n  margin: 5px 3px 25px;\n  width: ", "px;\n  min-height: ", "px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])), token('color.icon.accent.blue', hexToRgba(B400, 0.4) || B400), token('color.background.accent.blue.subtle', hexToRgba(B300, 0.6) || B300), borderRadius(), FILE_WIDTH, MEDIA_HEIGHT);
var dropLine = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  background: ", ";\n  border-radius: ", "px;\n  margin: 2px 0;\n  width: 100%;\n  height: 2px;\n"])), token('color.border.focused', B200), borderRadius());

var IconWrapperComponent = function IconWrapperComponent(props) {
  var intl = props.intl;
  var dropPlaceholderLabel = dropPlaceholderMessages.dropPlaceholderLabel;
  return jsx("div", {
    css: iconWrapper
  }, jsx(DocumentFilledIcon, {
    label: intl.formatMessage(dropPlaceholderLabel),
    size: "medium"
  }));
};

var IntlIconWrapper = injectIntl(IconWrapperComponent);
export default (function (_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'group' : _ref$type;
  return type === 'single' ? jsx("div", {
    css: dropLine
  }) : jsx(IntlIconWrapper, null);
});