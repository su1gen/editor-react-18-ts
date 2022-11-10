/** @jsx jsx */
import React, { useState, useEffect, Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { checkMediaType } from '../utils/check-media-type';
import ToolbarButton from '../../floating-toolbar/ui/Button';
import Separator from '../../floating-toolbar/ui/Separator';
import { linkToolbarMessages, linkMessages } from '../../../messages';
import { ToolTipContent, addLink } from '../../../keymaps';
import { stateKey } from '../pm-plugins/plugin-key';
import { currentMediaNode } from '../utils/current-media-node';
// need this wrapper, need to have 4px between items.
const wrapper = css`
  display: flex;
  align-items: center;
  margin-right: 4px;
`;
export const LinkToolbarAppearance = ({
  editorState,
  mediaLinkingState,
  intl,
  onAddLink,
  onEditLink,
  onOpenLink
}) => {
  const [showLinkingControls, setShowLinkingControls] = useState(false);
  useEffect(() => {
    var _stateKey$getState;

    setShowLinkingControls(false);
    const mediaNode = currentMediaNode(editorState);

    if (!mediaNode) {
      return;
    }

    const mediaClientConfig = (_stateKey$getState = stateKey.getState(editorState)) === null || _stateKey$getState === void 0 ? void 0 : _stateKey$getState.mediaClientConfig;

    if (!mediaClientConfig) {
      return;
    }

    checkMediaType(mediaNode, mediaClientConfig).then(mediaType => {
      if (mediaType === 'external' || mediaType === 'image') {
        setShowLinkingControls(true);
      }
    });
  }, [editorState]);

  if (!showLinkingControls) {
    return null;
  }

  if (mediaLinkingState && mediaLinkingState.editable) {
    const isValidUrl = isSafeUrl(mediaLinkingState.link);
    const title = intl.formatMessage(linkToolbarMessages.editLink);
    const linkTitle = intl.formatMessage(isValidUrl ? linkMessages.openLink : linkToolbarMessages.unableToOpenLink);
    return jsx(Fragment, null, jsx("div", {
      css: wrapper
    }, jsx(ToolbarButton, {
      onClick: onEditLink,
      title: title,
      tooltipContent: jsx(ToolTipContent, {
        description: title,
        keymap: addLink
      })
    }, title)), jsx("div", {
      css: wrapper
    }, jsx(Separator, null)), jsx(ToolbarButton, {
      target: "_blank",
      href: isValidUrl ? mediaLinkingState.link : undefined,
      disabled: !isValidUrl,
      onClick: onOpenLink,
      title: linkTitle,
      icon: jsx(OpenIcon, {
        label: linkTitle
      }),
      className: "hyperlink-open-link"
    }), jsx(Separator, null));
  } else {
    const title = intl.formatMessage(linkToolbarMessages.addLink);
    return jsx(Fragment, null, jsx(ToolbarButton, {
      testId: "add-link-button",
      onClick: onAddLink,
      title: title,
      tooltipContent: jsx(ToolTipContent, {
        description: title,
        keymap: addLink
      }),
      icon: jsx(LinkIcon, {
        label: title
      })
    }), jsx(Separator, null));
  }
};