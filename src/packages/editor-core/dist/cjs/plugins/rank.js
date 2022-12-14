"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  plugins: ['featureFlagsContextPlugin', 'compositionPlugin', 'inlineCursorTargetPlugin', 'typeAhead', 'typeAheadInsertItem', 'focusHandlerPlugin', 'frozenEditor', 'submitEditor', 'saveOnEnter', 'customAutoformatting', 'newlinePreserveMarksPlugin', 'imageUpload', 'imageUploadInputRule', 'clipboard', 'paste', 'pasteKeymap', 'mention', 'mentionInputRule', 'mentionKeymap', 'emoji', 'placeholderText', 'emojiInputRule', 'emojiKeymap', 'emojiAsciiInputRule', 'blockType', 'quickInsert', 'tasksAndDecisions', 'blockTypeInputRule', 'tasksAndDecisionsInputRule', 'list', 'typeAheadKeymap', 'typeAheadInputRule', 'date', // Needs to be before indentation to handle tab into input field
  'dateKeymap', // This should be always after `typeAheadKeymap` & `emojiKeymap`
  'indentationKeymap', 'textColor', 'alignmentPlugin', 'listInputRule', 'listKeymap', 'codeBlock', 'codeBlockIDEKeyBindings', 'codeBlockKeyMap', 'textFormatting', 'textFormattingCursor', 'textFormattingInputRule', 'textFormattingSmartRule', 'textFormattingClear', 'textFormattingKeymap', // task/decisions keymap needs to be above table keymap so can indent actions in a table
  'tasksAndDecisionsKeyMap', // expand and table keymaps need to be above selection keymap to add their custom selection behaviour:
  // https://product-fabric.atlassian.net/wiki/spaces/E/pages/1113098008/Selection+Guide#Special-Cases
  'expandKeymap', 'tableSelectionKeymap', 'tableKeymap', 'captionKeymap', // selection keymap needs to be above gap cursor keymap so it can set node selections from
  // left/right arrows
  'selectionKeymap', 'gapCursorKeymap', 'gapCursor', 'syncUrlText', 'fakeCursorToolbarPlugin', 'hyperLink', 'table', 'tableDecorations', 'hyperlinkInputRule', 'tablePMColResizing', 'hyperlinkKeymap', 'tableColResizing', 'undoRedoKeyMap', 'blockTypeKeyMap', 'tableEditing', 'filterStepsPlugin', 'pmCollab', 'collab', 'ruleInputRule', 'ruleKeymap', 'panel', 'media', 'mediaKeymap', 'mediaSingleKeymap', 'mediaEditor', 'unsupportedContent', 'jiraIssue', 'fakeTextCursor', 'helpDialog', 'helpDialogKeymap', 'macro', 'expand', 'extension', 'layout', 'contextPanel', 'floatingToolbar', 'clearMarksOnChange', 'reactNodeView', 'history', 'undoRedoPlugin', 'codeBlockIndent', 'placeholder', 'width', 'maxContentSize', 'multilineContent', 'grid', 'mobileDimensions', 'scrollGutterPlugin', 'analytics', 'findReplace', 'selection', 'avatarGroup', 'viewUpdateSubscription', 'beforePrimaryToolbar', 'inlineCode'],
  nodes: ['doc', 'paragraph', 'text', 'bulletList', 'orderedList', 'listItem', 'heading', 'blockquote', 'codeBlock', 'rule', 'panel', 'mention', 'confluenceUnsupportedBlock', 'confluenceUnsupportedInline', 'unsupportedBlock', 'unsupportedInline', 'confluenceJiraIssue', 'hardBreak', 'emoji', 'placeholder', 'mediaSingle', 'mediaGroup', 'table', 'expand', 'nestedExpand', 'media', 'tableHeader', 'decisionList', 'tableRow', 'decisionItem', 'tableCell', 'taskList', 'taskItem', 'extension', 'bodiedExtension', 'inlineExtension', 'layoutSection', 'layoutColumn', 'inlineCard', 'blockCard', 'embedCard'],
  marks: [// Fragment mark is both for inline and block elements
  'fragment', // Inline marks
  'link', 'em', 'strong', 'textColor', 'strike', 'subsup', 'underline', 'code', 'typeAheadQuery', // Block marks
  'alignment', 'breakout', 'indentation', 'annotation', 'dataConsumer', // Unsupported mark
  'unsupportedMark', 'unsupportedNodeAttribute']
};
exports.default = _default;