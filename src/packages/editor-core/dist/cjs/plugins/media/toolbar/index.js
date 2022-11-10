"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatingToolbar = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _download = _interopRequireDefault(require("@atlaskit/icon/glyph/download"));

var _mediaFilmstrip = require("@atlaskit/media-filmstrip");

var _messages = _interopRequireDefault(require("../../../messages"));

var _pluginKey = require("../pm-plugins/plugin-key");

var _decoration = require("../../base/pm-plugins/decoration");

var _linking = require("./linking");

var _MediaAndEmbedsToolbar = _interopRequireDefault(require("../../../ui/MediaAndEmbedsToolbar"));

var _linking2 = require("../pm-plugins/linking");

var _altText = require("../pm-plugins/alt-text");

var _altText2 = require("./alt-text");

var _linking3 = require("../commands/linking");

var _linkingToolbarAppearance = require("./linking-toolbar-appearance");

var _analytics = require("../../analytics");

var _mediaUi = require("@atlaskit/media-ui");

var _messages2 = require("../../card/messages");

var _filePreviewItem = require("./filePreviewItem");

var _utils = require("./utils");

var _commands = require("./commands");

var _styles = require("../nodeviews/styles");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var remove = function remove(state, dispatch) {
  if (dispatch) {
    dispatch((0, _prosemirrorUtils.removeSelectedNode)(state.tr));
  }

  return true;
};

var handleRemoveMediaGroup = function handleRemoveMediaGroup(state, dispatch) {
  var tr = (0, _utils.removeMediaGroupNode)(state);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

var generateMediaCardFloatingToolbar = function generateMediaCardFloatingToolbar(state, intl, mediaPluginState) {
  var mediaGroup = state.schema.nodes.mediaGroup;
  var items = [{
    id: 'editor.media.view.switcher',
    type: 'dropdown',
    title: intl.formatMessage(_mediaUi.messages.changeView),
    options: [{
      id: 'editor.media.view.switcher.inline',
      title: intl.formatMessage(_messages2.messages.inline),
      selected: false,
      disabled: false,
      onClick: _commands.changeMediaCardToInline,
      testId: 'inline-appearance'
    }, {
      id: 'editor.media.view.switcher.thumbnail',
      title: intl.formatMessage(_mediaUi.messages.displayThumbnail),
      selected: true,
      disabled: false,
      onClick: function onClick() {
        return true;
      },
      testId: 'thumbnail-appearance'
    }]
  }, {
    type: 'separator'
  }, {
    type: 'custom',
    fallback: [],
    render: function render() {
      return /*#__PURE__*/_react.default.createElement(_filePreviewItem.FilePreviewItem, {
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
    icon: _download.default,
    onClick: function onClick() {
      (0, _utils.downloadMedia)(mediaPluginState);
      return true;
    },
    title: intl.formatMessage(_mediaUi.messages.download)
  }, {
    type: 'separator'
  }, {
    type: 'copy-button',
    items: [{
      state: state,
      formatMessage: intl.formatMessage,
      nodeType: mediaGroup
    }, {
      type: 'separator'
    }]
  }, {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: _remove.default,
    onMouseEnter: (0, _decoration.hoverDecoration)(mediaGroup, true),
    onMouseLeave: (0, _decoration.hoverDecoration)(mediaGroup, false),
    onFocus: (0, _decoration.hoverDecoration)(mediaGroup, true),
    onBlur: (0, _decoration.hoverDecoration)(mediaGroup, false),
    title: intl.formatMessage(_messages.default.remove),
    onClick: handleRemoveMediaGroup,
    testId: 'media-toolbar-remove-button'
  }];
  return items;
};

var generateMediaInlineFloatingToolbar = function generateMediaInlineFloatingToolbar(state, intl, mediaPluginState) {
  var mediaInline = state.schema.nodes.mediaInline;
  var items = [{
    id: 'editor.media.view.switcher',
    type: 'dropdown',
    title: intl.formatMessage(_mediaUi.messages.changeView),
    options: [{
      id: 'editor.media.view.switcher.inline',
      title: intl.formatMessage(_messages2.messages.inline),
      selected: true,
      disabled: false,
      onClick: function onClick() {
        return true;
      },
      testId: 'inline-appearance'
    }, {
      id: 'editor.media.view.switcher.thumbnail',
      title: intl.formatMessage(_mediaUi.messages.displayThumbnail),
      selected: false,
      disabled: false,
      onClick: _commands.changeInlineToMediaCard,
      testId: 'thumbnail-appearance'
    }]
  }, {
    type: 'separator'
  }, {
    type: 'custom',
    fallback: [],
    render: function render() {
      return /*#__PURE__*/_react.default.createElement(_filePreviewItem.FilePreviewItem, {
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
    icon: _download.default,
    onClick: function onClick() {
      (0, _utils.downloadMedia)(mediaPluginState);
      return true;
    },
    title: intl.formatMessage(_mediaUi.messages.download)
  }, {
    type: 'separator'
  }, {
    type: 'copy-button',
    items: [{
      state: state,
      formatMessage: intl.formatMessage,
      nodeType: mediaInline
    }, {
      type: 'separator'
    }]
  }, {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: _remove.default,
    onMouseEnter: (0, _decoration.hoverDecoration)(mediaInline, true),
    onMouseLeave: (0, _decoration.hoverDecoration)(mediaInline, false),
    onFocus: (0, _decoration.hoverDecoration)(mediaInline, true),
    onBlur: (0, _decoration.hoverDecoration)(mediaInline, false),
    title: intl.formatMessage(_messages.default.remove),
    onClick: _commands.removeInlineCard,
    testId: 'media-toolbar-remove-button'
  }];
  return items;
};

var generateMediaSingleFloatingToolbar = function generateMediaSingleFloatingToolbar(state, intl, options, pluginState, mediaLinkingState) {
  var mediaSingle = state.schema.nodes.mediaSingle;
  var allowResizing = options.allowResizing,
      allowLinking = options.allowLinking,
      allowAdvancedToolBarOptions = options.allowAdvancedToolBarOptions,
      allowResizingInTables = options.allowResizingInTables,
      allowAltTextOnImages = options.allowAltTextOnImages;
  var toolbarButtons = [];

  if (allowAdvancedToolBarOptions) {
    toolbarButtons = (0, _MediaAndEmbedsToolbar.default)(state, intl, state.schema.nodes.mediaSingle, allowResizing, allowResizingInTables);

    if (toolbarButtons.length) {
      toolbarButtons.push({
        type: 'separator'
      });
    }

    if (allowLinking && (0, _linking.shouldShowMediaLinkToolbar)(state)) {
      toolbarButtons.push({
        type: 'custom',
        fallback: [],
        render: function render(editorView, idx) {
          if (editorView !== null && editorView !== void 0 && editorView.state) {
            var editLink = function editLink() {
              if (editorView) {
                var _state = editorView.state,
                    dispatch = editorView.dispatch;
                (0, _linking3.showLinkingToolbar)(_state, dispatch);
              }
            };

            var openLink = function openLink() {
              if (editorView) {
                var _state2 = editorView.state,
                    dispatch = editorView.dispatch;
                dispatch((0, _analytics.addAnalytics)(_state2, _state2.tr, {
                  eventType: _analytics.EVENT_TYPE.TRACK,
                  action: _analytics.ACTION.VISITED,
                  actionSubject: _analytics.ACTION_SUBJECT.MEDIA,
                  actionSubjectId: _analytics.ACTION_SUBJECT_ID.LINK
                }));
                return true;
              }
            };

            return /*#__PURE__*/_react.default.createElement(_linkingToolbarAppearance.LinkToolbarAppearance, {
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
    toolbarButtons.push((0, _altText2.altTextButton)(intl, state), {
      type: 'separator'
    });
  }

  var removeButton = {
    id: 'editor.media.delete',
    type: 'button',
    appearance: 'danger',
    icon: _remove.default,
    onMouseEnter: (0, _decoration.hoverDecoration)(mediaSingle, true),
    onMouseLeave: (0, _decoration.hoverDecoration)(mediaSingle, false),
    onFocus: (0, _decoration.hoverDecoration)(mediaSingle, true),
    onBlur: (0, _decoration.hoverDecoration)(mediaSingle, false),
    title: intl.formatMessage(_messages.default.remove),
    onClick: remove,
    testId: 'media-toolbar-remove-button'
  };
  var items = [].concat((0, _toConsumableArray2.default)(toolbarButtons), [{
    type: 'copy-button',
    items: [{
      state: state,
      formatMessage: intl.formatMessage,
      nodeType: mediaSingle
    }, {
      type: 'separator'
    }]
  }, removeButton]);
  return items;
};

var floatingToolbar = function floatingToolbar(state, intl) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _state$schema$nodes = state.schema.nodes,
      media = _state$schema$nodes.media,
      mediaInline = _state$schema$nodes.mediaInline,
      mediaSingle = _state$schema$nodes.mediaSingle,
      mediaGroup = _state$schema$nodes.mediaGroup;
  var altTextValidator = options.altTextValidator,
      allowLinking = options.allowLinking,
      allowAltTextOnImages = options.allowAltTextOnImages,
      providerFactory = options.providerFactory,
      allowMediaInline = options.allowMediaInline;

  var mediaPluginState = _pluginKey.stateKey.getState(state);

  var mediaLinkingState = (0, _linking2.getMediaLinkingState)(state);

  if (!mediaPluginState) {
    return;
  }

  var nodeType = allowMediaInline ? [mediaInline, mediaSingle, media] : [mediaSingle];
  var baseToolbar = {
    title: 'Media floating controls',
    nodeType: nodeType,
    getDomRef: function getDomRef() {
      return mediaPluginState.element;
    }
  };

  if (allowLinking && mediaLinkingState && mediaLinkingState.visible && (0, _linking.shouldShowMediaLinkToolbar)(state)) {
    var linkingToolbar = (0, _linking.getLinkingToolbar)(baseToolbar, mediaLinkingState, state, intl, providerFactory);

    if (linkingToolbar) {
      return linkingToolbar;
    }
  }

  if (allowAltTextOnImages) {
    var mediaAltTextPluginState = (0, _altText.getPluginState)(state);

    if (mediaAltTextPluginState.isAltTextEditorOpen) {
      return (0, _altText2.getAltTextToolbar)(baseToolbar, {
        altTextValidator: altTextValidator
      });
    }
  }

  var items = [];
  var parentMediaGroupNode = (0, _prosemirrorUtils.findParentNodeOfType)(mediaGroup)(state.selection);
  var selectedNodeType;

  if (state.selection instanceof _prosemirrorState.NodeSelection) {
    selectedNodeType = state.selection.node.type;
  }

  if (allowMediaInline && (parentMediaGroupNode === null || parentMediaGroupNode === void 0 ? void 0 : parentMediaGroupNode.node.type) === mediaGroup) {
    var mediaOffset = state.selection.$from.parentOffset + 1;

    baseToolbar.getDomRef = function () {
      var _mediaPluginState$ele;

      var selector = (0, _mediaFilmstrip.mediaFilmstripItemDOMSelector)(mediaOffset);
      return (_mediaPluginState$ele = mediaPluginState.element) === null || _mediaPluginState$ele === void 0 ? void 0 : _mediaPluginState$ele.querySelector(selector);
    };

    items = generateMediaCardFloatingToolbar(state, intl, mediaPluginState);
  } else if (allowMediaInline && selectedNodeType && selectedNodeType === mediaInline) {
    baseToolbar.getDomRef = function () {
      var _mediaPluginState$ele2;

      var element = (_mediaPluginState$ele2 = mediaPluginState.element) === null || _mediaPluginState$ele2 === void 0 ? void 0 : _mediaPluginState$ele2.querySelector(".".concat(_styles.MediaInlineNodeSelector));
      return element || mediaPluginState.element;
    };

    items = generateMediaInlineFloatingToolbar(state, intl, mediaPluginState);
  } else {
    baseToolbar.getDomRef = function () {
      var _mediaPluginState$ele3;

      var element = (_mediaPluginState$ele3 = mediaPluginState.element) === null || _mediaPluginState$ele3 === void 0 ? void 0 : _mediaPluginState$ele3.querySelector(".".concat(_styles.MediaSingleNodeSelector));
      return element || mediaPluginState.element;
    };

    items = generateMediaSingleFloatingToolbar(state, intl, options, mediaPluginState, mediaLinkingState);
  }

  return _objectSpread(_objectSpread({}, baseToolbar), {}, {
    items: items,
    scrollable: true
  });
};

exports.floatingToolbar = floatingToolbar;