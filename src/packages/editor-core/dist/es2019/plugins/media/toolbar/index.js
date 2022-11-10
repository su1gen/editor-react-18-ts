import React from 'react';
import { NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType, removeSelectedNode } from 'prosemirror-utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { mediaFilmstripItemDOMSelector } from '@atlaskit/media-filmstrip';
import commonMessages from '../../../messages';
import { stateKey } from '../pm-plugins/plugin-key';
import { hoverDecoration } from '../../base/pm-plugins/decoration';
import { getLinkingToolbar, shouldShowMediaLinkToolbar } from './linking';
import buildLayoutButtons from '../../../ui/MediaAndEmbedsToolbar';
import { getMediaLinkingState } from '../pm-plugins/linking';
import { getPluginState as getMediaAltTextPluginState } from '../pm-plugins/alt-text';
import { altTextButton, getAltTextToolbar } from './alt-text';
import { showLinkingToolbar } from '../commands/linking';
import { LinkToolbarAppearance } from './linking-toolbar-appearance';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE } from '../../analytics';
import { messages } from '@atlaskit/media-ui';
import { messages as cardMessages } from '../../card/messages';
import { FilePreviewItem } from './filePreviewItem';
import { downloadMedia, removeMediaGroupNode } from './utils';
import { changeInlineToMediaCard, changeMediaCardToInline, removeInlineCard } from './commands';
import { MediaInlineNodeSelector, MediaSingleNodeSelector } from '../nodeviews/styles';

const remove = (state, dispatch) => {
  if (dispatch) {
    dispatch(removeSelectedNode(state.tr));
  }

  return true;
};

const handleRemoveMediaGroup = (state, dispatch) => {
  const tr = removeMediaGroupNode(state);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

const generateMediaCardFloatingToolbar = (state, intl, mediaPluginState) => {
  const {
    mediaGroup
  } = state.schema.nodes;
  const items = [{
    id: 'editor.media.view.switcher',
    type: 'dropdown',
    title: intl.formatMessage(messages.changeView),
    options: [{
      id: 'editor.media.view.switcher.inline',
      title: intl.formatMessage(cardMessages.inline),
      selected: false,
      disabled: false,
      onClick: changeMediaCardToInline,
      testId: 'inline-appearance'
    }, {
      id: 'editor.media.view.switcher.thumbnail',
      title: intl.formatMessage(messages.displayThumbnail),
      selected: true,
      disabled: false,
      onClick: () => {
        return true;
      },
      testId: 'thumbnail-appearance'
    }]
  }, {
    type: 'separator'
  }, {
    type: 'custom',
    fallback: [],
    render: () => {
      return /*#__PURE__*/React.createElement(FilePreviewItem, {
        key: "editor.media.card.preview",
        mediaPluginState: mediaPluginState,
        intl: intl
      });
    }
  }, {
    type: 'separator'
  }, {
    id: 'editor.media.card.download',
    type: 'button',
    icon: DownloadIcon,
    onClick: () => {
      downloadMedia(mediaPluginState);
      return true;
    },
    title: intl.formatMessage(messages.download)
  }, {
    type: 'separator'
  }, {
    type: 'copy-button',
    items: [{
      state,
      formatMessage: intl.formatMessage,
      nodeType: mediaGroup
    }, {
      type: 'separator'
    }]
  }, {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: RemoveIcon,
    onMouseEnter: hoverDecoration(mediaGroup, true),
    onMouseLeave: hoverDecoration(mediaGroup, false),
    onFocus: hoverDecoration(mediaGroup, true),
    onBlur: hoverDecoration(mediaGroup, false),
    title: intl.formatMessage(commonMessages.remove),
    onClick: handleRemoveMediaGroup,
    testId: 'media-toolbar-remove-button'
  }];
  return items;
};

const generateMediaInlineFloatingToolbar = (state, intl, mediaPluginState) => {
  const {
    mediaInline
  } = state.schema.nodes;
  const items = [{
    id: 'editor.media.view.switcher',
    type: 'dropdown',
    title: intl.formatMessage(messages.changeView),
    options: [{
      id: 'editor.media.view.switcher.inline',
      title: intl.formatMessage(cardMessages.inline),
      selected: true,
      disabled: false,
      onClick: () => {
        return true;
      },
      testId: 'inline-appearance'
    }, {
      id: 'editor.media.view.switcher.thumbnail',
      title: intl.formatMessage(messages.displayThumbnail),
      selected: false,
      disabled: false,
      onClick: changeInlineToMediaCard,
      testId: 'thumbnail-appearance'
    }]
  }, {
    type: 'separator'
  }, {
    type: 'custom',
    fallback: [],
    render: () => {
      return /*#__PURE__*/React.createElement(FilePreviewItem, {
        key: "editor.media.card.preview",
        mediaPluginState: mediaPluginState,
        intl: intl
      });
    }
  }, {
    type: 'separator'
  }, {
    id: 'editor.media.card.download',
    type: 'button',
    icon: DownloadIcon,
    onClick: () => {
      downloadMedia(mediaPluginState);
      return true;
    },
    title: intl.formatMessage(messages.download)
  }, {
    type: 'separator'
  }, {
    type: 'copy-button',
    items: [{
      state,
      formatMessage: intl.formatMessage,
      nodeType: mediaInline
    }, {
      type: 'separator'
    }]
  }, {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: RemoveIcon,
    onMouseEnter: hoverDecoration(mediaInline, true),
    onMouseLeave: hoverDecoration(mediaInline, false),
    onFocus: hoverDecoration(mediaInline, true),
    onBlur: hoverDecoration(mediaInline, false),
    title: intl.formatMessage(commonMessages.remove),
    onClick: removeInlineCard,
    testId: 'media-toolbar-remove-button'
  }];
  return items;
};

const generateMediaSingleFloatingToolbar = (state, intl, options, pluginState, mediaLinkingState) => {
  const {
    mediaSingle
  } = state.schema.nodes;
  const {
    allowResizing,
    allowLinking,
    allowAdvancedToolBarOptions,
    allowResizingInTables,
    allowAltTextOnImages
  } = options;
  let toolbarButtons = [];

  if (allowAdvancedToolBarOptions) {
    toolbarButtons = buildLayoutButtons(state, intl, state.schema.nodes.mediaSingle, allowResizing, allowResizingInTables);

    if (toolbarButtons.length) {
      toolbarButtons.push({
        type: 'separator'
      });
    }

    if (allowLinking && shouldShowMediaLinkToolbar(state)) {
      toolbarButtons.push({
        type: 'custom',
        fallback: [],
        render: (editorView, idx) => {
          if (editorView !== null && editorView !== void 0 && editorView.state) {
            const editLink = () => {
              if (editorView) {
                const {
                  state,
                  dispatch
                } = editorView;
                showLinkingToolbar(state, dispatch);
              }
            };

            const openLink = () => {
              if (editorView) {
                const {
                  state,
                  dispatch
                } = editorView;
                dispatch(addAnalytics(state, state.tr, {
                  eventType: EVENT_TYPE.TRACK,
                  action: ACTION.VISITED,
                  actionSubject: ACTION_SUBJECT.MEDIA,
                  actionSubjectId: ACTION_SUBJECT_ID.LINK
                }));
                return true;
              }
            };

            return /*#__PURE__*/React.createElement(LinkToolbarAppearance, {
              key: idx,
              editorState: editorView.state,
              intl: intl,
              mediaLinkingState: mediaLinkingState,
              onAddLink: editLink,
              onEditLink: editLink,
              onOpenLink: openLink
            });
          }

          return null;
        }
      });
    }
  }

  if (allowAltTextOnImages) {
    toolbarButtons.push(altTextButton(intl, state), {
      type: 'separator'
    });
  }

  const removeButton = {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: RemoveIcon,
    onMouseEnter: hoverDecoration(mediaSingle, true),
    onMouseLeave: hoverDecoration(mediaSingle, false),
    onFocus: hoverDecoration(mediaSingle, true),
    onBlur: hoverDecoration(mediaSingle, false),
    title: intl.formatMessage(commonMessages.remove),
    onClick: remove,
    testId: 'media-toolbar-remove-button'
  };
  const items = [...toolbarButtons, {
    type: 'copy-button',
    items: [{
      state,
      formatMessage: intl.formatMessage,
      nodeType: mediaSingle
    }, {
      type: 'separator'
    }]
  }, removeButton];
  return items;
};

export const floatingToolbar = (state, intl, options = {}) => {
  const {
    media,
    mediaInline,
    mediaSingle,
    mediaGroup
  } = state.schema.nodes;
  const {
    altTextValidator,
    allowLinking,
    allowAltTextOnImages,
    providerFactory,
    allowMediaInline
  } = options;
  const mediaPluginState = stateKey.getState(state);
  const mediaLinkingState = getMediaLinkingState(state);

  if (!mediaPluginState) {
    return;
  }

  const nodeType = allowMediaInline ? [mediaInline, mediaSingle, media] : [mediaSingle];
  const baseToolbar = {
    title: 'Media floating controls',
    nodeType,
    getDomRef: () => mediaPluginState.element
  };

  if (allowLinking && mediaLinkingState && mediaLinkingState.visible && shouldShowMediaLinkToolbar(state)) {
    const linkingToolbar = getLinkingToolbar(baseToolbar, mediaLinkingState, state, intl, providerFactory);

    if (linkingToolbar) {
      return linkingToolbar;
    }
  }

  if (allowAltTextOnImages) {
    const mediaAltTextPluginState = getMediaAltTextPluginState(state);

    if (mediaAltTextPluginState.isAltTextEditorOpen) {
      return getAltTextToolbar(baseToolbar, {
        altTextValidator
      });
    }
  }

  let items = [];
  const parentMediaGroupNode = findParentNodeOfType(mediaGroup)(state.selection);
  let selectedNodeType;

  if (state.selection instanceof NodeSelection) {
    selectedNodeType = state.selection.node.type;
  }

  if (allowMediaInline && (parentMediaGroupNode === null || parentMediaGroupNode === void 0 ? void 0 : parentMediaGroupNode.node.type) === mediaGroup) {
    const mediaOffset = state.selection.$from.parentOffset + 1;

    baseToolbar.getDomRef = () => {
      var _mediaPluginState$ele;

      const selector = mediaFilmstripItemDOMSelector(mediaOffset);
      return (_mediaPluginState$ele = mediaPluginState.element) === null || _mediaPluginState$ele === void 0 ? void 0 : _mediaPluginState$ele.querySelector(selector);
    };

    items = generateMediaCardFloatingToolbar(state, intl, mediaPluginState);
  } else if (allowMediaInline && selectedNodeType && selectedNodeType === mediaInline) {
    baseToolbar.getDomRef = () => {
      var _mediaPluginState$ele2;

      const element = (_mediaPluginState$ele2 = mediaPluginState.element) === null || _mediaPluginState$ele2 === void 0 ? void 0 : _mediaPluginState$ele2.querySelector(`.${MediaInlineNodeSelector}`);
      return element || mediaPluginState.element;
    };

    items = generateMediaInlineFloatingToolbar(state, intl, mediaPluginState);
  } else {
    baseToolbar.getDomRef = () => {
      var _mediaPluginState$ele3;

      const element = (_mediaPluginState$ele3 = mediaPluginState.element) === null || _mediaPluginState$ele3 === void 0 ? void 0 : _mediaPluginState$ele3.querySelector(`.${MediaSingleNodeSelector}`);
      return element || mediaPluginState.element;
    };

    items = generateMediaSingleFloatingToolbar(state, intl, options, mediaPluginState, mediaLinkingState);
  }

  return { ...baseToolbar,
    items,
    scrollable: true
  };
};