"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ACTION", {
  enumerable: true,
  get: function get() {
    return _analytics.ACTION;
  }
});
Object.defineProperty(exports, "ACTION_SUBJECT", {
  enumerable: true,
  get: function get() {
    return _analytics.ACTION_SUBJECT;
  }
});
Object.defineProperty(exports, "ACTION_SUBJECT_ID", {
  enumerable: true,
  get: function get() {
    return _analytics.ACTION_SUBJECT_ID;
  }
});
Object.defineProperty(exports, "AbstractMentionResource", {
  enumerable: true,
  get: function get() {
    return _resource2.AbstractMentionResource;
  }
});
Object.defineProperty(exports, "AnnotationUpdateEmitter", {
  enumerable: true,
  get: function get() {
    return _annotation.AnnotationUpdateEmitter;
  }
});
Object.defineProperty(exports, "BaseReactEditorView", {
  enumerable: true,
  get: function get() {
    return _createEditor.BaseReactEditorView;
  }
});
Object.defineProperty(exports, "CollapsedEditor", {
  enumerable: true,
  get: function get() {
    return _CollapsedEditor.default;
  }
});
Object.defineProperty(exports, "ContextPanel", {
  enumerable: true,
  get: function get() {
    return _ContextPanel.default;
  }
});
Object.defineProperty(exports, "DEFAULT_BORDER_COLOR", {
  enumerable: true,
  get: function get() {
    return _common.DEFAULT_BORDER_COLOR;
  }
});
Object.defineProperty(exports, "EVENT_TYPE", {
  enumerable: true,
  get: function get() {
    return _analytics.EVENT_TYPE;
  }
});
Object.defineProperty(exports, "Editor", {
  enumerable: true,
  get: function get() {
    return _editor.default;
  }
});
Object.defineProperty(exports, "EditorActions", {
  enumerable: true,
  get: function get() {
    return _actions3.default;
  }
});
Object.defineProperty(exports, "EditorContext", {
  enumerable: true,
  get: function get() {
    return _EditorContext.default;
  }
});
Object.defineProperty(exports, "EmojiResource", {
  enumerable: true,
  get: function get() {
    return _resource.EmojiResource;
  }
});
Object.defineProperty(exports, "EventDispatcher", {
  enumerable: true,
  get: function get() {
    return _eventDispatcher.EventDispatcher;
  }
});
Object.defineProperty(exports, "GapCursorSelection", {
  enumerable: true,
  get: function get() {
    return _gapCursorSelection.GapCursorSelection;
  }
});
Object.defineProperty(exports, "GapCursorSide", {
  enumerable: true,
  get: function get() {
    return _gapCursorSelection.Side;
  }
});
Object.defineProperty(exports, "HyperlinkInsertStatus", {
  enumerable: true,
  get: function get() {
    return _main3.InsertStatus;
  }
});
Object.defineProperty(exports, "INPUT_METHOD", {
  enumerable: true,
  get: function get() {
    return _analytics.INPUT_METHOD;
  }
});
Object.defineProperty(exports, "MentionResource", {
  enumerable: true,
  get: function get() {
    return _resource2.MentionResource;
  }
});
Object.defineProperty(exports, "PortalProvider", {
  enumerable: true,
  get: function get() {
    return _PortalProvider.PortalProvider;
  }
});
Object.defineProperty(exports, "PortalProviderAPI", {
  enumerable: true,
  get: function get() {
    return _PortalProvider.PortalProviderAPI;
  }
});
Object.defineProperty(exports, "PortalRenderer", {
  enumerable: true,
  get: function get() {
    return _PortalProvider.PortalRenderer;
  }
});
Object.defineProperty(exports, "PresenceResource", {
  enumerable: true,
  get: function get() {
    return _resource2.PresenceResource;
  }
});
Object.defineProperty(exports, "ReactEditorView", {
  enumerable: true,
  get: function get() {
    return _createEditor.ReactEditorView;
  }
});
Object.defineProperty(exports, "TeamMentionResource", {
  enumerable: true,
  get: function get() {
    return _teamResource.TeamMentionResource;
  }
});
Object.defineProperty(exports, "ToolbarFeedback", {
  enumerable: true,
  get: function get() {
    return _ToolbarFeedback.default;
  }
});
Object.defineProperty(exports, "ToolbarHelp", {
  enumerable: true,
  get: function get() {
    return _ToolbarHelp.default;
  }
});
Object.defineProperty(exports, "WithEditorActions", {
  enumerable: true,
  get: function get() {
    return _WithEditorActions.default;
  }
});
Object.defineProperty(exports, "WithHelpTrigger", {
  enumerable: true,
  get: function get() {
    return _WithHelpTrigger.default;
  }
});
Object.defineProperty(exports, "WithPluginState", {
  enumerable: true,
  get: function get() {
    return _WithPluginState.default;
  }
});
Object.defineProperty(exports, "blockPluginStateKey", {
  enumerable: true,
  get: function get() {
    return _plugins.blockPluginStateKey;
  }
});
Object.defineProperty(exports, "changeColor", {
  enumerable: true,
  get: function get() {
    return _changeColor.changeColor;
  }
});
Object.defineProperty(exports, "clearEditorContent", {
  enumerable: true,
  get: function get() {
    return _commands.clearEditorContent;
  }
});
Object.defineProperty(exports, "commitStatusPicker", {
  enumerable: true,
  get: function get() {
    return _actions2.commitStatusPicker;
  }
});
Object.defineProperty(exports, "createQuickInsertTools", {
  enumerable: true,
  get: function get() {
    return _api2.createQuickInsertTools;
  }
});
Object.defineProperty(exports, "createTable", {
  enumerable: true,
  get: function get() {
    return _commands4.createTable;
  }
});
Object.defineProperty(exports, "createTypeAheadTools", {
  enumerable: true,
  get: function get() {
    return _api.createTypeAheadTools;
  }
});
Object.defineProperty(exports, "darkModeStatusColorPalette", {
  enumerable: true,
  get: function get() {
    return _statusColorPalette.darkModeStatusColorPalette;
  }
});
Object.defineProperty(exports, "dateMessages", {
  enumerable: true,
  get: function get() {
    return _messages.dateMessages;
  }
});
Object.defineProperty(exports, "datePluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});
Object.defineProperty(exports, "dateToDateType", {
  enumerable: true,
  get: function get() {
    return _formatParse.dateToDateType;
  }
});
Object.defineProperty(exports, "dedupe", {
  enumerable: true,
  get: function get() {
    return _utils.dedupe;
  }
});
Object.defineProperty(exports, "deleteDate", {
  enumerable: true,
  get: function get() {
    return _actions.deleteDate;
  }
});
Object.defineProperty(exports, "floatingToolbarPluginKey", {
  enumerable: true,
  get: function get() {
    return _floatingToolbar.pluginKey;
  }
});
Object.defineProperty(exports, "getDefaultPresetOptionsFromEditorProps", {
  enumerable: true,
  get: function get() {
    return _createEditor.getDefaultPresetOptionsFromEditorProps;
  }
});
Object.defineProperty(exports, "getListCommands", {
  enumerable: true,
  get: function get() {
    return _listCommands.getListCommands;
  }
});
Object.defineProperty(exports, "getNodesCount", {
  enumerable: true,
  get: function get() {
    return _utils.getNodesCount;
  }
});
Object.defineProperty(exports, "hasVisibleContent", {
  enumerable: true,
  get: function get() {
    return _utils.hasVisibleContent;
  }
});
Object.defineProperty(exports, "historyPluginKey", {
  enumerable: true,
  get: function get() {
    return _history.historyPluginKey;
  }
});
Object.defineProperty(exports, "hyperlinkStateKey", {
  enumerable: true,
  get: function get() {
    return _main3.stateKey;
  }
});
Object.defineProperty(exports, "insertBlockType", {
  enumerable: true,
  get: function get() {
    return _commands3.insertBlockType;
  }
});
Object.defineProperty(exports, "insertBlockTypesWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _commands3.insertBlockTypesWithAnalytics;
  }
});
Object.defineProperty(exports, "insertDate", {
  enumerable: true,
  get: function get() {
    return _actions.insertDate;
  }
});
Object.defineProperty(exports, "insertExpand", {
  enumerable: true,
  get: function get() {
    return _commands8.insertExpand;
  }
});
Object.defineProperty(exports, "insertHorizontalRule", {
  enumerable: true,
  get: function get() {
    return _commands2.insertHorizontalRule;
  }
});
Object.defineProperty(exports, "insertLink", {
  enumerable: true,
  get: function get() {
    return _commands6.insertLink;
  }
});
Object.defineProperty(exports, "insertLinkWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _commands6.insertLinkWithAnalytics;
  }
});
Object.defineProperty(exports, "insertLinkWithAnalyticsMobileNative", {
  enumerable: true,
  get: function get() {
    return _commands6.insertLinkWithAnalyticsMobileNative;
  }
});
Object.defineProperty(exports, "insertMediaSingleNode", {
  enumerable: true,
  get: function get() {
    return _media.insertMediaSingleNode;
  }
});
Object.defineProperty(exports, "insertTaskDecisionCommand", {
  enumerable: true,
  get: function get() {
    return _commands5.insertTaskDecisionCommand;
  }
});
Object.defineProperty(exports, "isEmptyDocument", {
  enumerable: true,
  get: function get() {
    return _utils.isEmptyDocument;
  }
});
Object.defineProperty(exports, "isLinkAtPos", {
  enumerable: true,
  get: function get() {
    return _commands6.isLinkAtPos;
  }
});
Object.defineProperty(exports, "isTextAtPos", {
  enumerable: true,
  get: function get() {
    return _commands6.isTextAtPos;
  }
});
Object.defineProperty(exports, "lightModeStatusColorPalette", {
  enumerable: true,
  get: function get() {
    return _statusColorPalette.lightModeStatusColorPalette;
  }
});
Object.defineProperty(exports, "listStateKey", {
  enumerable: true,
  get: function get() {
    return _main4.pluginKey;
  }
});
Object.defineProperty(exports, "measurements", {
  enumerable: true,
  get: function get() {
    return _utils.measurements;
  }
});
Object.defineProperty(exports, "mediaPlugin", {
  enumerable: true,
  get: function get() {
    return _media.default;
  }
});
Object.defineProperty(exports, "mediaPluginKey", {
  enumerable: true,
  get: function get() {
    return _main.stateKey;
  }
});
Object.defineProperty(exports, "mentionPluginKey", {
  enumerable: true,
  get: function get() {
    return _mentions.mentionPluginKey;
  }
});
Object.defineProperty(exports, "messages", {
  enumerable: true,
  get: function get() {
    return _messages.default;
  }
});
Object.defineProperty(exports, "name", {
  enumerable: true,
  get: function get() {
    return _versionWrapper.name;
  }
});
Object.defineProperty(exports, "openDatePicker", {
  enumerable: true,
  get: function get() {
    return _actions.openDatePicker;
  }
});
Object.defineProperty(exports, "processQuickInsertItems", {
  enumerable: true,
  get: function get() {
    return _quickInsert.memoProcessItems;
  }
});
Object.defineProperty(exports, "quickInsertPluginKey", {
  enumerable: true,
  get: function get() {
    return _quickInsert.pluginKey;
  }
});
Object.defineProperty(exports, "removeStatus", {
  enumerable: true,
  get: function get() {
    return _actions2.removeStatus;
  }
});
Object.defineProperty(exports, "selectionPluginKey", {
  enumerable: true,
  get: function get() {
    return _mobileSelection.selectionPluginKey;
  }
});
Object.defineProperty(exports, "setBlockType", {
  enumerable: true,
  get: function get() {
    return _commands3.setBlockType;
  }
});
Object.defineProperty(exports, "setBlockTypeWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _commands3.setBlockTypeWithAnalytics;
  }
});
Object.defineProperty(exports, "setIsExpanded", {
  enumerable: true,
  get: function get() {
    return _commands7.setIsExpanded;
  }
});
Object.defineProperty(exports, "setKeyboardHeight", {
  enumerable: true,
  get: function get() {
    return _commands7.setKeyboardHeight;
  }
});
Object.defineProperty(exports, "setMobilePaddingTop", {
  enumerable: true,
  get: function get() {
    return _commands7.setMobilePaddingTop;
  }
});
Object.defineProperty(exports, "setStatusPickerAt", {
  enumerable: true,
  get: function get() {
    return _actions2.setStatusPickerAt;
  }
});
Object.defineProperty(exports, "setTextSelection", {
  enumerable: true,
  get: function get() {
    return _utils.setTextSelection;
  }
});
Object.defineProperty(exports, "statusMessages", {
  enumerable: true,
  get: function get() {
    return _messages.statusMessages;
  }
});
Object.defineProperty(exports, "statusPluginKey", {
  enumerable: true,
  get: function get() {
    return _plugin.pluginKey;
  }
});
Object.defineProperty(exports, "subscribeToToolbarAndPickerUpdates", {
  enumerable: true,
  get: function get() {
    return _toolbarAndPickerUpdates.subscribeToToolbarAndPickerUpdates;
  }
});
Object.defineProperty(exports, "subscribeTypeAheadUpdates", {
  enumerable: true,
  get: function get() {
    return _typeAheadUpdates.subscribeTypeAheadUpdates;
  }
});
Object.defineProperty(exports, "textColorPluginKey", {
  enumerable: true,
  get: function get() {
    return _textColor.textColorPluginKey;
  }
});
Object.defineProperty(exports, "textFormattingStateKey", {
  enumerable: true,
  get: function get() {
    return _main2.pluginKey;
  }
});
Object.defineProperty(exports, "toggleCode", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleCode;
  }
});
Object.defineProperty(exports, "toggleCodeWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleCodeWithAnalytics;
  }
});
Object.defineProperty(exports, "toggleEm", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleEm;
  }
});
Object.defineProperty(exports, "toggleEmWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleEmWithAnalytics;
  }
});
Object.defineProperty(exports, "toggleStrike", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleStrike;
  }
});
Object.defineProperty(exports, "toggleStrikeWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleStrikeWithAnalytics;
  }
});
Object.defineProperty(exports, "toggleStrong", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleStrong;
  }
});
Object.defineProperty(exports, "toggleStrongWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleStrongWithAnalytics;
  }
});
Object.defineProperty(exports, "toggleSubscript", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleSubscript;
  }
});
Object.defineProperty(exports, "toggleSubscriptWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleSubscriptWithAnalytics;
  }
});
Object.defineProperty(exports, "toggleSuperscript", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleSuperscript;
  }
});
Object.defineProperty(exports, "toggleSuperscriptWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleSuperscriptWithAnalytics;
  }
});
Object.defineProperty(exports, "toggleUnderline", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleUnderline;
  }
});
Object.defineProperty(exports, "toggleUnderlineWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _textFormatting.toggleUnderlineWithAnalytics;
  }
});
Object.defineProperty(exports, "typeAheadPluginKey", {
  enumerable: true,
  get: function get() {
    return _typeAhead.typeAheadPluginKey;
  }
});
Object.defineProperty(exports, "updateLink", {
  enumerable: true,
  get: function get() {
    return _commands6.updateLink;
  }
});
Object.defineProperty(exports, "updateStatus", {
  enumerable: true,
  get: function get() {
    return _actions2.updateStatus;
  }
});
Object.defineProperty(exports, "updateStatusWithAnalytics", {
  enumerable: true,
  get: function get() {
    return _actions2.updateStatusWithAnalytics;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _versionWrapper.version;
  }
});

var _versionWrapper = require("./version-wrapper");

var _commands = require("./commands");

var _editor = _interopRequireDefault(require("./editor"));

var _EditorContext = _interopRequireDefault(require("./ui/EditorContext"));

var _WithEditorActions = _interopRequireDefault(require("./ui/WithEditorActions"));

var _WithHelpTrigger = _interopRequireDefault(require("./ui/WithHelpTrigger"));

var _CollapsedEditor = _interopRequireDefault(require("./ui/CollapsedEditor"));

var _ToolbarHelp = _interopRequireDefault(require("./ui/ToolbarHelp"));

var _ToolbarFeedback = _interopRequireDefault(require("./ui/ToolbarFeedback"));

var _ContextPanel = _interopRequireDefault(require("./ui/ContextPanel"));

var _resource = require("@atlaskit/emoji/resource");

var _media = _interopRequireWildcard(require("./plugins/media"));

var _resource2 = require("@atlaskit/mention/resource");

var _teamResource = require("@atlaskit/mention/team-resource");

var _annotation = require("./plugins/annotation");

var _main = require("./plugins/media/pm-plugins/main");

var _mentions = require("./plugins/mentions");

var _main2 = require("./plugins/text-formatting/pm-plugins/main");

var _textColor = require("./plugins/text-color");

var _changeColor = require("./plugins/text-color/commands/change-color");

var _commands2 = require("./plugins/rule/commands");

var _plugins = require("./plugins");

var _main3 = require("./plugins/hyperlink/pm-plugins/main");

var _main4 = require("./plugins/list/pm-plugins/main");

var _textFormatting = require("./plugins/text-formatting/commands/text-formatting");

var _toolbarAndPickerUpdates = require("./plugins/view-update-subscription/subscribe/toolbarAndPickerUpdates");

var _typeAheadUpdates = require("./plugins/view-update-subscription/subscribe/type-ahead-updates");

var _commands3 = require("./plugins/block-type/commands");

var _commands4 = require("@atlaskit/editor-plugin-table/commands");

var _commands5 = require("./plugins/tasks-and-decisions/commands");

var _eventDispatcher = require("./event-dispatcher");

var _plugin = require("./plugins/status/plugin");

var _actions = require("./plugins/date/actions");

var _formatParse = require("./plugins/date/utils/formatParse");

var _pluginKey = require("./plugins/date/pm-plugins/plugin-key");

var _actions2 = require("./plugins/status/actions");

var _typeAhead = require("./plugins/type-ahead");

var _quickInsert = require("./plugins/quick-insert");

var _commands6 = require("./plugins/hyperlink/commands");

var _history = require("./plugins/history");

var _analytics = require("./plugins/analytics");

var _commands7 = require("./plugins/mobile-dimensions/commands");

var _utils = require("./utils");

var _listCommands = require("./utils/list-commands");

var _createEditor = require("./create-editor");

var _actions3 = _interopRequireDefault(require("./actions"));

var _PortalProvider = require("./ui/PortalProvider");

var _gapCursorSelection = require("./plugins/selection/gap-cursor-selection");

var _mobileSelection = require("./plugins/mobile-selection");

var _commands8 = require("./plugins/expand/commands");

var _WithPluginState = _interopRequireDefault(require("./ui/WithPluginState"));

var _floatingToolbar = require("./plugins/floating-toolbar");

var _statusColorPalette = require("./ui/ColorPalette/Palettes/statusColorPalette");

var _common = require("./ui/ColorPalette/Palettes/common");

var _messages = _interopRequireWildcard(require("./messages"));

var _api = require("./plugins/type-ahead/api");

var _api2 = require("./plugins/quick-insert/api");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }