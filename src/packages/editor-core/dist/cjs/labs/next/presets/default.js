"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorPresetDefault = EditorPresetDefault;
exports.createDefaultPreset = createDefaultPreset;
exports.useDefaultPreset = useDefaultPreset;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _paste = _interopRequireDefault(require("../../../plugins/paste"));

var _blockType = _interopRequireDefault(require("../../../plugins/block-type"));

var _clearMarksOnChangeToEmptyDocument = _interopRequireDefault(require("../../../plugins/clear-marks-on-change-to-empty-document"));

var _hyperlink = _interopRequireDefault(require("../../../plugins/hyperlink"));

var _textFormatting = _interopRequireDefault(require("../../../plugins/text-formatting"));

var _width = _interopRequireDefault(require("../../../plugins/width"));

var _unsupportedContent = _interopRequireDefault(require("../../../plugins/unsupported-content"));

var _base = _interopRequireDefault(require("../../../plugins/base"));

var _editorDisabled = _interopRequireDefault(require("../../../plugins/editor-disabled"));

var _typeAhead = _interopRequireDefault(require("../../../plugins/type-ahead"));

var _submitEditor = _interopRequireDefault(require("../../../plugins/submit-editor"));

var _fakeTextCursor = _interopRequireDefault(require("../../../plugins/fake-text-cursor"));

var _featureFlagsContext = _interopRequireDefault(require("../../../plugins/feature-flags-context"));

var _floatingToolbar = _interopRequireDefault(require("../../../plugins/floating-toolbar"));

var _Editor = require("../Editor");

var _preset = require("./preset");

var _clipboard = _interopRequireDefault(require("../../../plugins/clipboard"));

var _placeholder = _interopRequireDefault(require("../../../plugins/placeholder"));

var _annotation = _interopRequireDefault(require("../../../plugins/annotation"));

var _quickInsert = _interopRequireDefault(require("../../../plugins/quick-insert"));

var _selection = _interopRequireDefault(require("../../../plugins/selection"));

var _codeBlock = _interopRequireDefault(require("../../../plugins/code-block"));

var _undoRedo = _interopRequireDefault(require("../../../plugins/undo-redo"));

// #region Imports

/**
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */
function createDefaultPreset(options) {
  var _options$featureFlags;

  var preset = new _preset.Preset();
  preset.add([_paste.default, options.paste]);
  preset.add(_clipboard.default);
  preset.add([_base.default, options.base]);

  if ((_options$featureFlags = options.featureFlags) !== null && _options$featureFlags !== void 0 && _options$featureFlags.undoRedoButtons) {
    preset.add(_undoRedo.default);
  }

  preset.add([_blockType.default, options.blockType]);
  preset.add([_placeholder.default, options.placeholder]);
  preset.add(_clearMarksOnChangeToEmptyDocument.default);

  if (options.annotationProviders) {
    preset.add([_annotation.default, options.annotationProviders]);
  }

  preset.add([_hyperlink.default, options.hyperlinkOptions]);
  preset.add([_textFormatting.default, options.textFormatting]);
  preset.add(_width.default);
  preset.add([_quickInsert.default, options.quickInsert]);
  preset.add([_typeAhead.default, options.typeAhead || {
    createAnalyticsEvent: options.createAnalyticsEvent
  }]);
  preset.add(_unsupportedContent.default);
  preset.add(_editorDisabled.default);
  preset.add([_submitEditor.default, options.submitEditor]);
  preset.add(_fakeTextCursor.default);
  preset.add(_floatingToolbar.default);
  preset.add([_featureFlagsContext.default, options.featureFlags || {}]);
  preset.add([_selection.default, options.selection]);
  preset.add([_codeBlock.default, options.codeBlock || {
    appearance: 'full-page'
  }]);
  return preset;
}

function useDefaultPreset(props) {
  var preset = createDefaultPreset(props);
  return [preset];
}

function EditorPresetDefault(props) {
  var _useDefaultPreset = useDefaultPreset(props),
      _useDefaultPreset2 = (0, _slicedToArray2.default)(_useDefaultPreset, 1),
      preset = _useDefaultPreset2[0];

  var plugins = preset.getEditorPlugins();
  return /*#__PURE__*/_react.default.createElement(_Editor.PresetProvider, {
    value: plugins
  }, props.children);
}