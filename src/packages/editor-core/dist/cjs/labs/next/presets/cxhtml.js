"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorPresetCXHTML = EditorPresetCXHTML;
exports.useCXHTMLPreset = useCXHTMLPreset;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _editorPluginTable = require("@atlaskit/editor-plugin-table");

var _plugins = require("../../../plugins");

var _Editor = require("../Editor");

var _default = require("./default");

// #region Imports
function useCXHTMLPreset(_ref) {
  var mentionProvider = _ref.mentionProvider,
      mediaProvider = _ref.mediaProvider,
      placeholder = _ref.placeholder,
      featureFlags = _ref.featureFlags;

  var _useDefaultPreset = (0, _default.useDefaultPreset)({
    featureFlags: featureFlags,
    paste: {
      plainTextPasteLinkification: featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.plainTextPasteLinkification
    }
  }),
      _useDefaultPreset2 = (0, _slicedToArray2.default)(_useDefaultPreset, 1),
      preset = _useDefaultPreset2[0];

  preset.add([_plugins.basePlugin, {
    allowInlineCursorTarget: true,
    allowScrollGutter: {
      getScrollElement: function getScrollElement(_view) {
        return document.querySelector('.fabric-editor-popup-scroll-parent') || null;
      }
    }
  }]);
  preset.add([_editorPluginTable.tablesPlugin, {
    tableOptions: {
      advanced: true
    }
  }]);
  preset.add([_plugins.panelPlugin, {
    allowCustomPanel: true
  }]);
  preset.add(_plugins.listPlugin);
  preset.add(_plugins.textColorPlugin);
  preset.add(_plugins.breakoutPlugin);
  preset.add(_plugins.jiraIssuePlugin);
  preset.add(_plugins.extensionPlugin);
  preset.add(_plugins.rulePlugin);
  preset.add(_plugins.datePlugin);
  preset.add(_plugins.layoutPlugin);
  preset.add(_plugins.indentationPlugin);
  preset.add([_plugins.cardPlugin, {
    allowBlockCards: true,
    platform: 'web'
  }]);
  preset.add([_plugins.statusPlugin, {
    menuDisabled: false
  }]);
  preset.add(_plugins.tasksAndDecisionsPlugin);
  preset.add(_plugins.insertBlockPlugin);
  preset.add([_plugins.placeholderPlugin, {
    placeholder: placeholder
  }]);

  if (mentionProvider) {
    preset.add(_plugins.mentionsPlugin);
  }

  if (mediaProvider) {
    preset.add([_plugins.mediaPlugin, {
      provider: mediaProvider,
      allowMediaSingle: true,
      allowMediaGroup: true,
      allowResizing: true,
      allowLinking: true,
      allowResizingInTables: true,
      allowAltTextOnImages: true
    }]);
  }

  return [preset];
}

function EditorPresetCXHTML(props) {
  var children = props.children,
      excludes = props.excludes;

  var _useCXHTMLPreset = useCXHTMLPreset(props),
      _useCXHTMLPreset2 = (0, _slicedToArray2.default)(_useCXHTMLPreset, 1),
      preset = _useCXHTMLPreset2[0];

  var plugins = preset.getEditorPlugins(excludes);
  return /*#__PURE__*/_react.default.createElement(_Editor.PresetProvider, {
    value: plugins
  }, children);
}