"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHasFormattingActived = exports.useFormattingIcons = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _bold = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/bold"));

var _italic = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/italic"));

var _styles = require("../../../../../ui/styles");

var _toolbarMessages = require("../toolbar-messages");

var commands = _interopRequireWildcard(require("../../../commands/text-formatting"));

var _toolbarButton = require("../../../../../plugins/analytics/types/toolbar-button");

var _pluginKey = require("../../../pm-plugins/plugin-key");

var _keymaps = require("../../../../../keymaps");

var _enums = require("../../../../analytics/types/enums");

var _types = require("../types");

var _IconsMarkSchema;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var withToolbarInputMethod = function withToolbarInputMethod(func) {
  return func({
    inputMethod: _enums.INPUT_METHOD.TOOLBAR
  });
};

var IconButtons = {
  strong: {
    buttonId: _toolbarButton.TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_STRONG,
    command: withToolbarInputMethod(commands.toggleStrongWithAnalytics),
    message: _toolbarMessages.toolbarMessages.bold,
    tooltipKeymap: _keymaps.toggleBold,
    component: function component() {
      return (0, _react2.jsx)(_bold.default, {
        label: ""
      });
    }
  },
  em: {
    buttonId: _toolbarButton.TOOLBAR_ACTION_SUBJECT_ID.TEXT_FORMATTING_ITALIC,
    command: withToolbarInputMethod(commands.toggleEmWithAnalytics),
    message: _toolbarMessages.toolbarMessages.italic,
    tooltipKeymap: _keymaps.toggleItalic,
    component: function component() {
      return (0, _react2.jsx)(_italic.default, {
        label: ""
      });
    }
  },
  underline: {
    command: withToolbarInputMethod(commands.toggleUnderlineWithAnalytics),
    message: _toolbarMessages.toolbarMessages.underline,
    tooltipKeymap: _keymaps.toggleUnderline
  },
  strike: {
    command: withToolbarInputMethod(commands.toggleStrikeWithAnalytics),
    message: _toolbarMessages.toolbarMessages.strike,
    tooltipKeymap: _keymaps.toggleStrikethrough
  },
  code: {
    command: withToolbarInputMethod(commands.toggleCodeWithAnalytics),
    message: _toolbarMessages.toolbarMessages.code,
    tooltipKeymap: _keymaps.toggleCode
  },
  subscript: {
    command: withToolbarInputMethod(commands.toggleSubscriptWithAnalytics),
    message: _toolbarMessages.toolbarMessages.subscript,
    tooltipKeymap: _keymaps.toggleSubscript
  },
  superscript: {
    command: withToolbarInputMethod(commands.toggleSuperscriptWithAnalytics),
    message: _toolbarMessages.toolbarMessages.superscript,
    tooltipKeymap: _keymaps.toggleSuperscript
  }
};

var getIcon = function getIcon(_ref) {
  var iconType = _ref.iconType,
      isDisabled = _ref.isDisabled,
      isActive = _ref.isActive,
      intl = _ref.intl;
  var icon = IconButtons[iconType];
  var content = intl.formatMessage(icon.message);
  var tooltipKeymap = icon.tooltipKeymap;
  return {
    content: content,
    buttonId: icon.buttonId,
    iconMark: iconType,
    key: iconType,
    command: icon.command,
    iconElement: icon.component ? icon.component() : undefined,
    tooltipElement: tooltipKeymap ? (0, _react2.jsx)(_keymaps.ToolTipContent, {
      description: content,
      keymap: tooltipKeymap
    }) : undefined,
    elemAfter: tooltipKeymap ? (0, _react2.jsx)("div", {
      css: _styles.shortcutStyle
    }, (0, _keymaps.tooltip)(tooltipKeymap)) : undefined,
    value: {
      name: iconType
    },
    isActive: isActive,
    isDisabled: isDisabled
  };
};

var IconsMarkSchema = (_IconsMarkSchema = {}, (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.strong, 'strong'), (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.em, 'em'), (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.strike, 'strike'), (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.code, 'code'), (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.underline, 'underline'), (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.superscript, 'subsup'), (0, _defineProperty2.default)(_IconsMarkSchema, _types.IconTypes.subscript, 'subsup'), _IconsMarkSchema);

var buildMenuIconState = function buildMenuIconState(iconMark) {
  return function (_ref2) {
    var schema = _ref2.schema,
        textFormattingPluginState = _ref2.textFormattingPluginState;
    var hasPluginState = Boolean(textFormattingPluginState);
    var markSchema = IconsMarkSchema[iconMark];
    var hasSchemaMark = Boolean(schema.marks[markSchema]);

    if (!hasPluginState) {
      return {
        isActive: false,
        isDisabled: true,
        isHidden: false,
        hasSchemaMark: hasSchemaMark
      };
    }

    var isActive = textFormattingPluginState["".concat(iconMark, "Active")];
    var isDisabled = textFormattingPluginState["".concat(iconMark, "Disabled")];
    var isHidden = textFormattingPluginState["".concat(iconMark, "Hidden")];
    return {
      isActive: Boolean(isActive),
      isDisabled: Boolean(isDisabled),
      isHidden: Boolean(isHidden),
      hasSchemaMark: hasSchemaMark
    };
  };
};

var buildIcon = function buildIcon(iconMark) {
  var getState = buildMenuIconState(iconMark);
  return function (_ref3) {
    var schema = _ref3.schema,
        textFormattingPluginState = _ref3.textFormattingPluginState,
        intl = _ref3.intl,
        isToolbarDisabled = _ref3.isToolbarDisabled;
    var iconState = getState({
      schema: schema,
      textFormattingPluginState: textFormattingPluginState
    });
    var isActive = iconState.isActive,
        isDisabled = iconState.isDisabled,
        isHidden = iconState.isHidden,
        hasSchemaMark = iconState.hasSchemaMark;
    var iconComponent = (0, _react.useMemo)(function () {
      return getIcon({
        iconType: _types.IconTypes[iconMark],
        isDisabled: isToolbarDisabled || isDisabled,
        isActive: isActive,
        intl: intl
      });
    }, [isToolbarDisabled, isDisabled, isActive, intl]);
    var shouldRenderIcon = hasSchemaMark && !isHidden;
    return (0, _react.useMemo)(function () {
      return shouldRenderIcon ? iconComponent : null;
    }, [shouldRenderIcon, iconComponent]);
  };
};

var buildStrongIcon = buildIcon(_types.IconTypes.strong);
var buildEmIcon = buildIcon(_types.IconTypes.em);
var buildUnderlineIcon = buildIcon(_types.IconTypes.underline);
var buildStrikeIcon = buildIcon(_types.IconTypes.strike);
var buildCodeIcon = buildIcon(_types.IconTypes.code);
var buildSubscriptIcon = buildIcon(_types.IconTypes.subscript);
var buildSuperscriptIcon = buildIcon(_types.IconTypes.superscript);

var useTextFormattingPluginState = function useTextFormattingPluginState(editorState) {
  return (0, _react.useMemo)(function () {
    return _pluginKey.pluginKey.getState(editorState);
  }, [editorState]);
};

var useFormattingIcons = function useFormattingIcons(_ref4) {
  var isToolbarDisabled = _ref4.isToolbarDisabled,
      editorState = _ref4.editorState,
      intl = _ref4.intl;
  var textFormattingPluginState = useTextFormattingPluginState(editorState);
  var schema = editorState.schema;
  var props = {
    schema: schema,
    textFormattingPluginState: textFormattingPluginState,
    intl: intl,
    isToolbarDisabled: Boolean(isToolbarDisabled)
  };
  var strongIcon = buildStrongIcon(props);
  var emIcon = buildEmIcon(props);
  var underlineIcon = buildUnderlineIcon(props);
  var strikeIcon = buildStrikeIcon(props);
  var codeIcon = buildCodeIcon(props);
  var subscriptIcon = buildSubscriptIcon(props);
  var superscriptIcon = buildSuperscriptIcon(props);
  var result = (0, _react.useMemo)(function () {
    return [strongIcon, emIcon, underlineIcon, strikeIcon, codeIcon, subscriptIcon, superscriptIcon];
  }, [strongIcon, emIcon, underlineIcon, strikeIcon, codeIcon, subscriptIcon, superscriptIcon]);
  return result;
};

exports.useFormattingIcons = useFormattingIcons;

var useHasFormattingActived = function useHasFormattingActived(_ref5) {
  var editorState = _ref5.editorState,
      iconTypeList = _ref5.iconTypeList;
  var textFormattingPluginState = useTextFormattingPluginState(editorState);
  var hasActiveFormatting = (0, _react.useMemo)(function () {
    if (!textFormattingPluginState) {
      return false;
    }

    return iconTypeList.some(function (iconType) {
      return textFormattingPluginState["".concat(iconType, "Active")];
    });
  }, [textFormattingPluginState, iconTypeList]);
  return hasActiveFormatting;
};

exports.useHasFormattingActived = useHasFormattingActived;