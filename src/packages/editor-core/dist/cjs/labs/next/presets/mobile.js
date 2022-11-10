"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorPresetMobile = EditorPresetMobile;
exports.useMobilePreset = useMobilePreset;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _analytics = _interopRequireDefault(require("../../../plugins/analytics"));

var _base = _interopRequireDefault(require("../../../plugins/base"));

var _card = _interopRequireDefault(require("../../../plugins/card"));

var _date = _interopRequireDefault(require("../../../plugins/date"));

var _emoji = _interopRequireDefault(require("../../../plugins/emoji"));

var _extension = _interopRequireDefault(require("../../../plugins/extension"));

var _layout = _interopRequireDefault(require("../../../plugins/layout"));

var _list = _interopRequireDefault(require("../../../plugins/list"));

var _media = _interopRequireDefault(require("../../../plugins/media"));

var _mentions = _interopRequireDefault(require("../../../plugins/mentions"));

var _mobileDimensions = _interopRequireDefault(require("../../../plugins/mobile-dimensions"));

var _panel = _interopRequireDefault(require("../../../plugins/panel"));

var _placeholder = _interopRequireDefault(require("../../../plugins/placeholder"));

var _rule = _interopRequireDefault(require("../../../plugins/rule"));

var _status = _interopRequireDefault(require("../../../plugins/status"));

var _editorPluginTable = require("@atlaskit/editor-plugin-table");

var _tasksAndDecisions = _interopRequireDefault(require("../../../plugins/tasks-and-decisions"));

var _textColor = _interopRequireDefault(require("../../../plugins/text-color"));

var _maxContentSize = _interopRequireDefault(require("../../../plugins/max-content-size"));

var _expand = _interopRequireDefault(require("../../../plugins/expand"));

var _selection = _interopRequireDefault(require("../../../plugins/selection"));

var _Editor = require("../Editor");

var _default = require("./default");

var _utils = require("./utils");

var _plugins = require("../../../plugins");

// #region Imports
function useMobilePreset(_ref) {
  var media = _ref.media,
      placeholder = _ref.placeholder,
      maxContentSize = _ref.maxContentSize,
      createAnalyticsEvent = _ref.createAnalyticsEvent,
      featureFlags = _ref.featureFlags;
  var mediaProvider = (0, _providerFactory.useProvider)('mediaProvider');

  var _useDefaultPreset = (0, _default.useDefaultPreset)({
    featureFlags: featureFlags,
    paste: {
      plainTextPasteLinkification: featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.plainTextPasteLinkification
    }
  }),
      _useDefaultPreset2 = (0, _slicedToArray2.default)(_useDefaultPreset, 1),
      preset = _useDefaultPreset2[0];

  preset.add([_base.default, {
    allowScrollGutter: {
      getScrollElement: function getScrollElement() {
        return document.body;
      },
      allowCustomScrollHandler: false
    }
  }]);
  preset.add([_analytics.default, createAnalyticsEvent]);
  preset.add([_editorPluginTable.tablesPlugin, {
    tableOptions: {
      allowControls: false
    }
  }]);
  preset.add(_panel.default);
  preset.add(_list.default);
  preset.add(_textColor.default);
  preset.add(_extension.default);
  preset.add(_rule.default);
  preset.add(_date.default);
  preset.add(_layout.default);
  preset.add([_plugins.quickInsertPlugin, {
    headless: true,
    disableDefaultItems: true
  }]);
  preset.add([_status.default, {
    menuDisabled: false
  }]);
  preset.add([_placeholder.default, {
    placeholder: placeholder
  }]);
  preset.add(_mobileDimensions.default);
  preset.add(_expand.default);
  preset.add([_selection.default, {
    useLongPressSelection: false
  }]); // Begin -> This would be exclude if the provider doesnt exist in the factory

  preset.add(_tasksAndDecisions.default);
  preset.add([_card.default, {
    allowBlockCards: true,
    platform: 'mobile'
  }]);
  preset.add([_mentions.default]);
  preset.add([_emoji.default]); // End

  if (maxContentSize) {
    preset.add([_maxContentSize.default, maxContentSize]);
  }

  if (media) {
    preset.add([_media.default, {
      provider: mediaProvider,
      customMediaPicker: media.picker,
      fullWidthEnabled: false,
      allowMediaSingle: true,
      allowLazyLoading: false,
      allowMediaSingleEditable: false,
      allowRemoteDimensionsFetch: false,
      allowMarkingUploadsAsIncomplete: true,
      allowAltTextOnImages: true,
      allowTemplatePlaceholders: {
        allowInserting: true
      }
    }]);
  }

  return [preset];
}

function EditorPresetMobile(props) {
  var children = props.children,
      excludes = props.excludes;

  var _useMobilePreset = useMobilePreset(props),
      _useMobilePreset2 = (0, _slicedToArray2.default)(_useMobilePreset, 1),
      preset = _useMobilePreset2[0];

  var providerFactory = (0, _providerFactory.useProviderFactory)();
  var plugins = preset.getEditorPlugins((0, _utils.addExcludesFromProviderFactory)(providerFactory, excludes));
  return /*#__PURE__*/_react.default.createElement(_Editor.PresetProvider, {
    value: plugins
  }, children);
}