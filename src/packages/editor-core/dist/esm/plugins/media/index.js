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
import { floatingToolbar as _floatingToolbar } from './toolbar';
import { addAnalytics, ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT_ID } from '../analytics';
import { IconImages } from '../quick-insert/assets';
import WithPluginState from '../../ui/WithPluginState';
import { MediaPickerComponents } from './ui/MediaPicker';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { ReactMediaNode } from './nodeviews/mediaNodeView';
import { ReactMediaInlineNode } from './nodeviews/mediaInline';
export { insertMediaSingleNode } from './utils/media-single';

var mediaPlugin = function mediaPlugin(options) {
  return {
    name: 'media',
    nodes: function nodes() {
      var _ref = options || {},
          _ref$allowMediaGroup = _ref.allowMediaGroup,
          allowMediaGroup = _ref$allowMediaGroup === void 0 ? true : _ref$allowMediaGroup,
          _ref$allowMediaSingle = _ref.allowMediaSingle,
          allowMediaSingle = _ref$allowMediaSingle === void 0 ? false : _ref$allowMediaSingle,
          featureFlags = _ref.featureFlags;

      var captions = getMediaFeatureFlag('captions', featureFlags);
      var allowMediaInline = getMediaFeatureFlag('mediaInline', featureFlags);
      var mediaSingleNode = captions ? mediaSingleWithCaption : mediaSingle;
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
      }].filter(function (node) {
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
    pmPlugins: function pmPlugins() {
      var pmPlugins = [{
        name: 'media',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              dispatch = _ref2.dispatch,
              getIntl = _ref2.getIntl,
              eventDispatcher = _ref2.eventDispatcher,
              providerFactory = _ref2.providerFactory,
              errorReporter = _ref2.errorReporter,
              portalProviderAPI = _ref2.portalProviderAPI,
              reactContext = _ref2.reactContext,
              dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent;
          return createPlugin(schema, {
            providerFactory: providerFactory,
            nodeViews: {
              mediaGroup: ReactMediaGroupNode(portalProviderAPI, eventDispatcher, providerFactory, options),
              mediaSingle: ReactMediaSingleNode(portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent, options),
              media: ReactMediaNode(portalProviderAPI, eventDispatcher, providerFactory, options),
              mediaInline: ReactMediaInlineNode(portalProviderAPI, eventDispatcher, providerFactory)
            },
            errorReporter: errorReporter,
            uploadErrorHandler: options && options.uploadErrorHandler,
            waitForMediaUpload: options && options.waitForMediaUpload,
            customDropzoneContainer: options && options.customDropzoneContainer,
            customMediaPicker: options && options.customMediaPicker,
            allowResizing: !!(options && options.allowResizing)
          }, reactContext, getIntl, dispatch, options);
        }
      }, {
        name: 'mediaKeymap',
        plugin: function plugin() {
          return keymapPlugin(options);
        }
      }];

      if (options && options.allowMediaSingle) {
        pmPlugins.push({
          name: 'mediaSingleKeymap',
          plugin: function plugin(_ref3) {
            var schema = _ref3.schema;
            return keymapMediaSinglePlugin(schema);
          }
        });
      }

      if (options && options.allowAltTextOnImages) {
        pmPlugins.push({
          name: 'mediaAltText',
          plugin: createMediaAltTextPlugin
        });
        pmPlugins.push({
          name: 'mediaAltTextKeymap',
          plugin: function plugin(_ref4) {
            var schema = _ref4.schema;
            return keymapMediaAltTextPlugin(schema);
          }
        });
      }

      if (options && options.allowLinking) {
        pmPlugins.push({
          name: 'mediaLinking',
          plugin: function plugin(_ref5) {
            var dispatch = _ref5.dispatch;
            return linkingPlugin(dispatch);
          }
        });
        pmPlugins.push({
          name: 'mediaLinkingKeymap',
          plugin: function plugin(_ref6) {
            var schema = _ref6.schema;
            return keymapLinkingPlugin(schema);
          }
        });
      }

      return pmPlugins;
    },
    contentComponent: function contentComponent(_ref7) {
      var editorView = _ref7.editorView,
          appearance = _ref7.appearance;
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: editorView,
        plugins: {
          mediaState: pluginKey
        },
        render: function render(_ref8) {
          var mediaState = _ref8.mediaState;
          return /*#__PURE__*/React.createElement(MediaPickerComponents, {
            editorDomElement: editorView.dom,
            mediaState: mediaState,
            appearance: appearance
          });
        }
      }));
    },
    secondaryToolbarComponent: function secondaryToolbarComponent(_ref9) {
      var editorView = _ref9.editorView,
          eventDispatcher = _ref9.eventDispatcher,
          disabled = _ref9.disabled;
      return /*#__PURE__*/React.createElement(ToolbarMedia, {
        editorView: editorView,
        eventDispatcher: eventDispatcher,
        pluginKey: pluginKey,
        isDisabled: disabled,
        isReducedSpacing: true
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref10) {
        var formatMessage = _ref10.formatMessage;
        return [{
          id: 'media',
          title: formatMessage(messages.filesAndImages),
          description: formatMessage(messages.filesAndImagesDescription),
          priority: 400,
          keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconImages, null);
          },
          action: function action(insert, state) {
            var pluginState = pluginKey.getState(state);
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
        }];
      },
      floatingToolbar: function floatingToolbar(state, intl, providerFactory) {
        return _floatingToolbar(state, intl, {
          providerFactory: providerFactory,
          allowMediaInline: options && getMediaFeatureFlag('mediaInline', options.featureFlags),
          allowResizing: options && options.allowResizing,
          allowResizingInTables: options && options.allowResizingInTables,
          allowLinking: options && options.allowLinking,
          allowAdvancedToolBarOptions: options && options.allowAdvancedToolBarOptions,
          allowAltTextOnImages: options && options.allowAltTextOnImages,
          altTextValidator: options && options.altTextValidator
        });
      }
    }
  };
};

export default mediaPlugin;