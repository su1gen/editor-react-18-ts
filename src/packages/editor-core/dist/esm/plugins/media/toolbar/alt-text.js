import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { openMediaAltTextMenu } from '../pm-plugins/alt-text/commands';
import { ToolTipContent, addAltText } from '../../../keymaps';
import { messages } from '../pm-plugins/alt-text/messages';
import AltTextEdit from '../pm-plugins/alt-text/ui/AltTextEdit';
import { CONTAINER_WIDTH_IN_PX } from '../pm-plugins/alt-text/ui/AltTextEdit';
import { getMediaNodeFromSelection } from '../utils/media-common';
import { ClassNames } from '../pm-plugins/alt-text/style';
export var altTextButton = function altTextButton(intl, state) {
  var mediaNode = getMediaNodeFromSelection(state);
  var message = mediaNode && mediaNode.attrs.alt ? messages.editAltText : messages.altText;
  var title = intl.formatMessage(message);
  return {
    title: title,
    id: 'editor.media.altText',
    type: 'button',
    onClick: openMediaAltTextMenu,
    showTitle: true,
    testId: 'alt-text-edit-button',
    tooltipContent: /*#__PURE__*/React.createElement(ToolTipContent, {
      description: title,
      keymap: addAltText
    })
  };
};
export var altTextEditComponent = function altTextEditComponent(options) {
  return {
    type: 'custom',
    fallback: [],
    render: function render(view, idx) {
      if (!view) {
        return null;
      }

      var mediaNode = getMediaNodeFromSelection(view.state);

      if (!mediaNode) {
        return null;
      }

      return /*#__PURE__*/React.createElement(AltTextEdit, {
        view: view,
        key: idx,
        value: mediaNode.attrs.alt,
        altTextValidator: options && options.altTextValidator
      });
    }
  };
};
export var getAltTextToolbar = function getAltTextToolbar(toolbarBaseConfig, options) {
  return _objectSpread(_objectSpread({}, toolbarBaseConfig), {}, {
    width: CONTAINER_WIDTH_IN_PX,
    className: ClassNames.FLOATING_TOOLBAR_COMPONENT,
    items: [altTextEditComponent(options)]
  });
};