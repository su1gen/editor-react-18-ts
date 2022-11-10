import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { hideLinkingToolbar, setUrlToMedia, unlink } from '../commands/linking';
import { getMediaLinkingState } from '../pm-plugins/linking';
import MediaLinkingToolbar from '../ui/MediaLinkingToolbar';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '../../../ui/LinkSearch/ToolbarComponents';
export function shouldShowMediaLinkToolbar(editorState) {
  var mediaLinkingState = getMediaLinkingState(editorState);

  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return false;
  }

  var _editorState$schema = editorState.schema,
      media = _editorState$schema.nodes.media,
      link = _editorState$schema.marks.link;
  var node = editorState.doc.nodeAt(mediaLinkingState.mediaPos);

  if (!node || node.type !== media) {
    return false;
  }

  var _editorState$doc$reso = editorState.doc.resolve(mediaLinkingState.mediaPos),
      parent = _editorState$doc$reso.parent;

  return parent && parent.type.allowsMarkType(link);
}
export var getLinkingToolbar = function getLinkingToolbar(toolbarBaseConfig, mediaLinkingState, state, intl, providerFactory) {
  var link = mediaLinkingState.link,
      visible = mediaLinkingState.visible,
      editing = mediaLinkingState.editable,
      mediaPos = mediaLinkingState.mediaPos;

  if (visible && mediaPos !== null) {
    var node = state.doc.nodeAt(mediaPos);

    if (node) {
      return _objectSpread(_objectSpread({}, toolbarBaseConfig), {}, {
        height: RECENT_SEARCH_HEIGHT_IN_PX,
        width: RECENT_SEARCH_WIDTH_IN_PX,
        forcePlacement: true,
        items: [{
          type: 'custom',
          fallback: [],
          render: function render(view, idx) {
            if (!view || !providerFactory) {
              return null;
            }

            return /*#__PURE__*/React.createElement(MediaLinkingToolbar, {
              key: idx,
              displayUrl: link,
              providerFactory: providerFactory,
              intl: intl,
              editing: editing,
              onUnlink: function onUnlink() {
                return unlink(view.state, view.dispatch, view);
              },
              onBack: function onBack(href, meta) {
                if (href.trim() && meta.inputMethod) {
                  setUrlToMedia(href, meta.inputMethod)(view.state, view.dispatch, view);
                }

                hideLinkingToolbar(view.state, view.dispatch, view);
              },
              onCancel: function onCancel() {
                return hideLinkingToolbar(view.state, view.dispatch, view);
              },
              onSubmit: function onSubmit(href, meta) {
                setUrlToMedia(href, meta.inputMethod)(view.state, view.dispatch, view);
                hideLinkingToolbar(view.state, view.dispatch, view);
              },
              onBlur: function onBlur() {
                hideLinkingToolbar(view.state, view.dispatch, view);
              }
            });
          }
        }]
      });
    }
  }
};