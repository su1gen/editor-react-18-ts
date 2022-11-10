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
const iconWrapper = css`
  color: ${token('color.icon.accent.blue', hexToRgba(B400, 0.4) || B400)};
  background: ${token('color.background.accent.blue.subtle', hexToRgba(B300, 0.6) || B300)};
  border-radius: ${borderRadius()}px;
  margin: 5px 3px 25px;
  width: ${FILE_WIDTH}px;
  min-height: ${MEDIA_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const dropLine = css`
  background: ${token('color.border.focused', B200)};
  border-radius: ${borderRadius()}px;
  margin: 2px 0;
  width: 100%;
  height: 2px;
`;

const IconWrapperComponent = props => {
  const {
    intl
  } = props;
  const {
    dropPlaceholderLabel
  } = dropPlaceholderMessages;
  return jsx("div", {
    css: iconWrapper
  }, jsx(DocumentFilledIcon, {
    label: intl.formatMessage(dropPlaceholderLabel),
    size: "medium"
  }));
};

const IntlIconWrapper = injectIntl(IconWrapperComponent);
export default (({
  type = 'group'
}) => type === 'single' ? jsx("div", {
  css: dropLine
}) : jsx(IntlIconWrapper, null));