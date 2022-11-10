import React from 'react';
import { media, mediaGroup, mediaSingle, mediaSingleWithCaption, mediaInline } from '@atlaskit/adf-schema';
import { stateKey as pluginKey, createPlugin } from './pm-plugins/main';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { createPlugin as createMediaAltTextPlugin } from './pm-plugins/alt-text';
import keymapMediaAltTextPlugin from './pm-plugins/alt-text/keymap';
import keymapMediaSinglePlugin from './pm-plugins/keymap-media-single';
import keymapLinkingPlugin from './pm-plugins/linking/keymap';
import keymapPlugin from './pm-plugins/keymap';
import linkingPlugin from './pm-plugins/linking';
import ToolbarMedia from './ui/ToolbarMedia';
import { ReactMediaGroupNode } from './nodeviews/mediaGroup';
import { ReactMediaSingleNode } from './nodeviews/mediaSingle';
import { floatingToolbar } from './toolbar';
import { addAnalytics, ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT_ID } from '../analytics';
import { IconImages } from '../quick-insert/assets';
import WithPluginState from '../../ui/WithPluginState';
import { MediaPickerComponents } from './ui/MediaPicker';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { ReactMediaNode } from './nodeviews/mediaNodeView';
import { ReactMediaInlineNode } from './nodeviews/mediaInline';
export { insertMediaSingleNode } from './utils/media-single';

const mediaPlugin = options => ({
  name: 'media',

  nodes() {
    const {
      allowMediaGroup = true,
      allowMediaSingle = false,
      featureFlags
    } = options || {};
    const captions = getMediaFeatureFlag('captions', featureFlags);
    const allowMediaInline = getMediaFeatureFlag('mediaInline', featureFlags);
    const mediaSingleNode = captions ? mediaSingleWithCaption : mediaSingle;
    return [{
      name: 'mediaGroup',
      node: mediaGroup
    }, {
      name: 'mediaSingle',
      node: mediaSingleNode
    }, {
      name: 'media',
      node: media
    }, {
      name: 'mediaInline',
      node: mediaInline
    }].filter(node => {
      if (node.name === 'mediaGroup') {
        return allowMediaGroup;
      }

      if (node.name === 'mediaSingle') {
        return allowMediaSingle;
      }

      if (node.name === 'mediaInline') {
        return allowMediaInline;
      }

      return true;
    });
  },

  pmPlugins() {
    const pmPlugins = [{
      name: 'media',
      plugin: ({
        schema,
        dispatch,
        getIntl,
        eventDispatcher,
        providerFactory,
        errorReporter,
        portalProviderAPI,
        reactContext,
        dispatchAnalyticsEvent
      }) => {
        return createPlugin(schema, {
          providerFactory,
          nodeViews: {
            mediaGroup: ReactMediaGroupNode(portalProviderAPI, eventDispatcher, providerFactory, options),
            mediaSingle: ReactMediaSingleNode(portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent, options),
            media: ReactMediaNode(portalProviderAPI, eventDispatcher, providerFactory, options),
            mediaInline: ReactMediaInlineNode(portalProviderAPI, eventDispatcher, providerFactory)
          },
          errorReporter,
          uploadErrorHandler: options && options.uploadErrorHandler,
          waitForMediaUpload: options && options.waitForMediaUpload,
          customDropzoneContainer: options && options.customDropzoneContainer,
          customMediaPicker: options && options.customMediaPicker,
          allowResizing: !!(options && options.allowResizing)
        }, reactContext, getIntl, dispatch, options);
      }
    }, {
      name: 'mediaKeymap',
      plugin: () => keymapPlugin(options)
    }];

    if (options && options.allowMediaSingle) {
      pmPlugins.push({
        name: 'mediaSingleKeymap',
        plugin: ({
          schema
        }) => keymapMediaSinglePlugin(schema)
      });
    }

    if (options && options.allowAltTextOnImages) {
      pmPlugins.push({
        name: 'mediaAltText',
        plugin: createMediaAltTextPlugin
      });
      pmPlugins.push({
        name: 'mediaAltTextKeymap',
        plugin: ({
          schema
        }) => keymapMediaAltTextPlugin(schema)
      });
    }

    if (options && options.allowLinking) {
      pmPlugins.push({
        name: 'mediaLinking',
        plugin: ({
          dispatch
        }) => linkingPlugin(dispatch)
      });
      pmPlugins.push({
        name: 'mediaLinkingKeymap',
        plugin: ({
          schema
        }) => keymapLinkingPlugin(schema)
      });
    }

    return pmPlugins;
  },

  contentComponent({
    editorView,
    appearance
  }) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WithPluginState, {
      editorView: editorView,
      plugins: {
        mediaState: pluginKey
      },
      render: ({
        mediaState
      }) => /*#__PURE__*/React.createElement(MediaPickerComponents, {
        editorDomElement: editorView.dom,
        mediaState: mediaState,
        appearance: appearance
      })
    }));
  },

  secondaryToolbarComponent({
    editorView,
    eventDispatcher,
    disabled
  }) {
    return /*#__PURE__*/React.createElement(ToolbarMedia, {
      editorView: editorView,
      eventDispatcher: eventDispatcher,
      pluginKey: pluginKey,
      isDisabled: disabled,
      isReducedSpacing: true
    });
  },

  pluginsOptions: {
    quickInsert: ({
      formatMessage
    }) => [{
      id: 'media',
      title: formatMessage(messages.filesAndImages),
      description: formatMessage(messages.filesAndImagesDescription),
      priority: 400,
      keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
      icon: () => /*#__PURE__*/React.createElement(IconImages, null),

      action(insert, state) {
        const pluginState = pluginKey.getState(state);
        pluginState.showMediaPicker();
        return addAnalytics(state, insert(''), {
          action: ACTION.OPENED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT
          },
          eventType: EVENT_TYPE.UI
        });
      }

    }],
    floatingToolbar: (state, intl, providerFactory) => floatingToolbar(state, intl, {
      providerFactory,
      allowMediaInline: options && getMediaFeatureFlag('mediaInline', options.featureFlags),
      allowResizing: options && options.allowResizing,
      allowResizingInTables: options && options.allowResizingInTables,
      allowLinking: options && options.allowLinking,
      allowAdvancedToolBarOptions: options && options.allowAdvancedToolBarOptions,
      allowAltTextOnImages: options && options.allowAltTextOnImages,
      altTextValidator: options && options.altTextValidator
    })
  }
});

export default mediaPlugin;