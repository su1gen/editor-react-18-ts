import React from 'react';
import { hideLinkingToolbar, setUrlToMedia, unlink } from '../commands/linking';
import { getMediaLinkingState } from '../pm-plugins/linking';
import MediaLinkingToolbar from '../ui/MediaLinkingToolbar';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '../../../ui/LinkSearch/ToolbarComponents';
export function shouldShowMediaLinkToolbar(editorState) {
  const mediaLinkingState = getMediaLinkingState(editorState);

  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return false;
  }

  const {
    nodes: {
      media
    },
    marks: {
      link
    }
  } = editorState.schema;
  const node = editorState.doc.nodeAt(mediaLinkingState.mediaPos);

  if (!node || node.type !== media) {
    return false;
  }

  const {
    parent
  } = editorState.doc.resolve(mediaLinkingState.mediaPos);
  return parent && parent.type.allowsMarkType(link);
}
export const getLinkingToolbar = (toolbarBaseConfig, mediaLinkingState, state, intl, providerFactory) => {
  const {
    link,
    visible,
    editable: editing,
    mediaPos
  } = mediaLinkingState;

  if (visible && mediaPos !== null) {
    const node = state.doc.nodeAt(mediaPos);

    if (node) {
      return { ...toolbarBaseConfig,
        height: RECENT_SEARCH_HEIGHT_IN_PX,
        width: RECENT_SEARCH_WIDTH_IN_PX,
        forcePlacement: true,
        items: [{
          type: 'custom',
          fallback: [],
          render: (view, idx) => {
            if (!view || !providerFactory) {
              return null;
            }

            return /*#__PURE__*/React.createElement(MediaLinkingToolbar, {
              key: idx,
              displayUrl: link,
              providerFactory: providerFactory,
              intl: intl,
              editing: editing,
              onUnlink: () => unlink(view.state, view.dispatch, view),
              onBack: (href, meta) => {
                if (href.trim() && meta.inputMethod) {
                  setUrlToMedia(href, meta.inputMethod)(view.state, view.dispatch, view);
                }

                hideLinkingToolbar(view.state, view.dispatch, view);
              },
              onCancel: () => hideLinkingToolbar(view.state, view.dispatch, view),
              onSubmit: (href, meta) => {
                setUrlToMedia(href, meta.inputMethod)(view.state, view.dispatch, view);
                hideLinkingToolbar(view.state, view.dispatch, view);
              },
              onBlur: () => {
                hideLinkingToolbar(view.state, view.dispatch, view);
              }
            });
          }
        }]
      };
    }
  }
};