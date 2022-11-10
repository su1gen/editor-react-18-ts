import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

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
var wrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  align-items: center;\n  margin-right: 4px;\n"])));
export var LinkToolbarAppearance = function LinkToolbarAppearance(_ref) {
  var editorState = _ref.editorState,
      mediaLinkingState = _ref.mediaLinkingState,
      intl = _ref.intl,
      onAddLink = _ref.onAddLink,
      onEditLink = _ref.onEditLink,
      onOpenLink = _ref.onOpenLink;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showLinkingControls = _useState2[0],
      setShowLinkingControls = _useState2[1];

  useEffect(function () {
    var _stateKey$getState;

    setShowLinkingControls(false);
    var mediaNode = currentMediaNode(editorState);

    if (!mediaNode) {
      return;
    }

    var mediaClientConfig = (_stateKey$getState = stateKey.getState(editorState)) === null || _stateKey$getState === void 0 ? void 0 : _stateKey$getState.mediaClientConfig;

    if (!mediaClientConfig) {
      return;
    }

    checkMediaType(mediaNode, mediaClientConfig).then(function (mediaType) {
      if (mediaType === 'external' || mediaType === 'image') {
        setShowLinkingControls(true);
      }
    });
  }, [editorState]);

  if (!showLinkingControls) {
    return null;
  }

  if (mediaLinkingState && mediaLinkingState.editable) {
    var isValidUrl = isSafeUrl(mediaLinkingState.link);
    var title = intl.formatMessage(linkToolbarMessages.editLink);
    var linkTitle = intl.formatMessage(isValidUrl ? linkMessages.openLink : linkToolbarMessages.unableToOpenLink);
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
    var _title = intl.formatMessage(linkToolbarMessages.addLink);

    return jsx(Fragment, null, jsx(ToolbarButton, {
      testId: "add-link-button",
      onClick: onAddLink,
      title: _title,
      tooltipContent: jsx(ToolTipContent, {
        description: _title,
        keymap: addLink
      }),
      icon: jsx(LinkIcon, {
        label: _title
      })
    }), jsx(Separator, null));
  }
};