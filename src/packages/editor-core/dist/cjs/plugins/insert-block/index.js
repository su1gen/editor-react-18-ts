"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _main = require("../block-type/pm-plugins/main");

var _pluginKey = require("../media/pm-plugins/plugin-key");

var _main2 = require("../hyperlink/pm-plugins/main");

var _utils = require("../type-ahead/utils");

var _key = require("../mentions/pm-plugins/key");

var _layout = require("../layout");

var _macro = require("../macro");

var _emoji = require("../emoji");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _ToolbarInsertBlock = _interopRequireDefault(require("./ui/ToolbarInsertBlock"));

var _key2 = require("../type-ahead/pm-plugins/key");

var _commands = require("../block-type/commands");

var _commands2 = require("../image-upload/pm-plugins/commands");

var _analytics = require("../analytics");

var _pluginKey2 = require("../image-upload/pm-plugins/plugin-key");

var _pluginKey3 = require("../date/pm-plugins/plugin-key");

var _pluginKey4 = require("../placeholder-text/plugin-key");

var _pluginKey5 = require("../macro/plugin-key");

var _types = require("../../ui/Toolbar/types");

var toolbarSizeToButtons = function toolbarSizeToButtons(toolbarSize) {
  switch (toolbarSize) {
    case _types.ToolbarSize.XXL:
    case _types.ToolbarSize.XL:
    case _types.ToolbarSize.L:
    case _types.ToolbarSize.M:
      return 7;

    case _types.ToolbarSize.S:
      return 2;

    default:
      return 0;
  }
};

/**
 * Wrapper over insertBlockTypeWithAnalytics to autobind toolbar input method
 * @param name Block name
 */
function handleInsertBlockType(name) {
  return (0, _commands.insertBlockTypesWithAnalytics)(name, _analytics.INPUT_METHOD.TOOLBAR);
}

var insertBlockPlugin = function insertBlockPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'insertBlock',
    primaryToolbarComponent: function primaryToolbarComponent(_ref) {
      var editorView = _ref.editorView,
          editorActions = _ref.editorActions,
          dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
          providerFactory = _ref.providerFactory,
          popupsMountPoint = _ref.popupsMountPoint,
          popupsBoundariesElement = _ref.popupsBoundariesElement,
          popupsScrollableElement = _ref.popupsScrollableElement,
          toolbarSize = _ref.toolbarSize,
          disabled = _ref.disabled,
          isToolbarReducedSpacing = _ref.isToolbarReducedSpacing,
          isLastItem = _ref.isLastItem;
      var buttons = toolbarSizeToButtons(toolbarSize);

      var renderNode = function renderNode(providers) {
        return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
          plugins: {
            typeAheadState: _key2.pluginKey,
            blockTypeState: _main.pluginKey,
            mediaState: _pluginKey.stateKey,
            mentionState: _key.mentionPluginKey,
            macroState: _pluginKey5.pluginKey,
            hyperlinkState: _main2.stateKey,
            emojiState: _emoji.emojiPluginKey,
            dateState: _pluginKey3.pluginKey,
            imageUpload: _pluginKey2.stateKey,
            placeholderTextState: _pluginKey4.pluginKey,
            layoutState: _layout.pluginKey
          },
          render: function render(_ref2) {
            var mentionState = _ref2.mentionState,
                blockTypeState = _ref2.blockTypeState,
                mediaState = _ref2.mediaState,
                _ref2$macroState = _ref2.macroState,
                macroState = _ref2$macroState === void 0 ? {} : _ref2$macroState,
                hyperlinkState = _ref2.hyperlinkState,
                emojiState = _ref2.emojiState,
                dateState = _ref2.dateState,
                imageUpload = _ref2.imageUpload,
                placeholderTextState = _ref2.placeholderTextState,
                layoutState = _ref2.layoutState;
            return /*#__PURE__*/_react.default.createElement(_ToolbarInsertBlock.default, {
              insertNodeAPI: options.insertNodeAPI,
              buttons: buttons,
              isReducedSpacing: isToolbarReducedSpacing,
              isDisabled: disabled,
              isTypeAheadAllowed: (0, _utils.isTypeAheadAllowed)(editorView.state),
              editorView: editorView,
              tableSupported: !!editorView.state.schema.nodes.table,
              actionSupported: !!editorView.state.schema.nodes.taskItem,
              mentionsSupported: !!(mentionState && mentionState.mentionProvider),
              decisionSupported: !!editorView.state.schema.nodes.decisionItem,
              dateEnabled: !!dateState,
              placeholderTextEnabled: placeholderTextState && placeholderTextState.allowInserting,
              layoutSectionEnabled: !!layoutState,
              expandEnabled: !!options.allowExpand,
              mediaUploadsEnabled: mediaState && mediaState.allowsUploads,
              onShowMediaPicker: mediaState && mediaState.showMediaPicker,
              mediaSupported: !!mediaState,
              imageUploadSupported: !!imageUpload,
              imageUploadEnabled: imageUpload && imageUpload.enabled,
              handleImageUpload: _commands2.startImageUpload,
              availableWrapperBlockTypes: blockTypeState && blockTypeState.availableWrapperBlockTypes,
              linkSupported: !!hyperlinkState,
              linkDisabled: !hyperlinkState || !hyperlinkState.canInsertLink || !!hyperlinkState.activeLinkMark,
              emojiDisabled: !emojiState || !emojiState.emojiProvider,
              emojiProvider: providers.emojiProvider,
              nativeStatusSupported: options.nativeStatusSupported,
              horizontalRuleEnabled: options.horizontalRuleEnabled,
              onInsertBlockType: handleInsertBlockType,
              onInsertMacroFromMacroBrowser: _macro.insertMacroFromMacroBrowser,
              macroProvider: macroState.macroProvider,
              popupsMountPoint: popupsMountPoint,
              popupsBoundariesElement: popupsBoundariesElement,
              popupsScrollableElement: popupsScrollableElement,
              insertMenuItems: options.insertMenuItems,
              editorActions: editorActions,
              dispatchAnalyticsEvent: dispatchAnalyticsEvent,
              replacePlusMenuWithElementBrowser: options.replacePlusMenuWithElementBrowser,
              showElementBrowserLink: options.showElementBrowserLink,
              showSeparator: !isLastItem && toolbarSize <= _types.ToolbarSize.S
            });
          }
        });
      };

      return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
        providerFactory: providerFactory,
        providers: ['emojiProvider'],
        renderNode: renderNode
      });
    }
  };
};

var _default = insertBlockPlugin;
exports.default = _default;