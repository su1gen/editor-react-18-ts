"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "insertMediaSingleNode", {
  enumerable: true,
  get: function get() {
    return _mediaSingle2.insertMediaSingleNode;
  }
});

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _mediaCommon = require("@atlaskit/media-common");

var _altText = require("./pm-plugins/alt-text");

var _keymap = _interopRequireDefault(require("./pm-plugins/alt-text/keymap"));

var _keymapMediaSingle = _interopRequireDefault(require("./pm-plugins/keymap-media-single"));

var _keymap2 = _interopRequireDefault(require("./pm-plugins/linking/keymap"));

var _keymap3 = _interopRequireDefault(require("./pm-plugins/keymap"));

var _linking = _interopRequireDefault(require("./pm-plugins/linking"));

var _ToolbarMedia = _interopRequireDefault(require("./ui/ToolbarMedia"));

var _mediaGroup = require("./nodeviews/mediaGroup");

var _mediaSingle = require("./nodeviews/mediaSingle");

var _toolbar = require("./toolbar");

var _analytics = require("../analytics");

var _assets = require("../quick-insert/assets");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _MediaPicker = require("./ui/MediaPicker");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _mediaNodeView = require("./nodeviews/mediaNodeView");

var _mediaInline = require("./nodeviews/mediaInline");

var _mediaSingle2 = require("./utils/media-single");

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

      var captions = (0, _mediaCommon.getMediaFeatureFlag)('captions', featureFlags);
      var allowMediaInline = (0, _mediaCommon.getMediaFeatureFlag)('mediaInline', featureFlags);
      var mediaSingleNode = captions ? _adfSchema.mediaSingleWithCaption : _adfSchema.mediaSingle;
      return [{
        name: 'mediaGroup',
        node: _adfSchema.mediaGroup
      }, {
        name: 'mediaSingle',
        node: mediaSingleNode
      }, {
        name: 'media',
        node: _adfSchema.media
      }, {
        name: 'mediaInline',
        node: _adfSchema.mediaInline
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
          return (0, _main.createPlugin)(schema, {
            providerFactory: providerFactory,
            nodeViews: {
              mediaGroup: (0, _mediaGroup.ReactMediaGroupNode)(portalProviderAPI, eventDispatcher, providerFactory, options),
              mediaSingle: (0, _mediaSingle.ReactMediaSingleNode)(portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent, options),
              media: (0, _mediaNodeView.ReactMediaNode)(portalProviderAPI, eventDispatcher, providerFactory, options),
              mediaInline: (0, _mediaInline.ReactMediaInlineNode)(portalProviderAPI, eventDispatcher, providerFactory)
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
          return (0, _keymap3.default)(options);
        }
      }];

      if (options && options.allowMediaSingle) {
        pmPlugins.push({
          name: 'mediaSingleKeymap',
          plugin: function plugin(_ref3) {
            var schema = _ref3.schema;
            return (0, _keymapMediaSingle.default)(schema);
          }
        });
      }

      if (options && options.allowAltTextOnImages) {
        pmPlugins.push({
          name: 'mediaAltText',
          plugin: _altText.createPlugin
        });
        pmPlugins.push({
          name: 'mediaAltTextKeymap',
          plugin: function plugin(_ref4) {
            var schema = _ref4.schema;
            return (0, _keymap.default)(schema);
          }
        });
      }

      if (options && options.allowLinking) {
        pmPlugins.push({
          name: 'mediaLinking',
          plugin: function plugin(_ref5) {
            var dispatch = _ref5.dispatch;
            return (0, _linking.default)(dispatch);
          }
        });
        pmPlugins.push({
          name: 'mediaLinkingKeymap',
          plugin: function plugin(_ref6) {
            var schema = _ref6.schema;
            return (0, _keymap2.default)(schema);
          }
        });
      }

      return pmPlugins;
    },
    contentComponent: function contentComponent(_ref7) {
      var editorView = _ref7.editorView,
          appearance = _ref7.appearance;
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        editorView: editorView,
        plugins: {
          mediaState: _main.stateKey
        },
        render: function render(_ref8) {
          var mediaState = _ref8.mediaState;
          return /*#__PURE__*/_react.default.createElement(_MediaPicker.MediaPickerComponents, {
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
      return /*#__PURE__*/_react.default.createElement(_ToolbarMedia.default, {
        editorView: editorView,
        eventDispatcher: eventDispatcher,
        pluginKey: _main.stateKey,
        isDisabled: disabled,
        isReducedSpacing: true
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref10) {
        var formatMessage = _ref10.formatMessage;
        return [{
          id: 'media',
          title: formatMessage(_messages.messages.filesAndImages),
          description: formatMessage(_messages.messages.filesAndImagesDescription),
          priority: 400,
          keywords: ['attachment', 'gif', 'media', 'picture', 'image', 'video'],
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconImages, null);
          },
          action: function action(insert, state) {
            var pluginState = _main.stateKey.getState(state);

            pluginState.showMediaPicker();
            return (0, _analytics.addAnalytics)(state, insert(''), {
              action: _analytics.ACTION.OPENED,
              actionSubject: _analytics.ACTION_SUBJECT.PICKER,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.PICKER_CLOUD,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.UI
            });
          }
        }];
      },
      floatingToolbar: function floatingToolbar(state, intl, providerFactory) {
        return (0, _toolbar.floatingToolbar)(state, intl, {
          providerFactory: providerFactory,
          allowMediaInline: options && (0, _mediaCommon.getMediaFeatureFlag)('mediaInline', options.featureFlags),
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

var _default = mediaPlugin;
exports.default = _default;