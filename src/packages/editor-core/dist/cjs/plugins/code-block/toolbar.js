"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.languageListFilter = exports.getToolbarConfig = void 0;

var _reactIntlNext = require("react-intl-next");

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _copy = _interopRequireDefault(require("@atlaskit/icon/glyph/copy"));

var _prosemirrorUtils = require("prosemirror-utils");

var _actions = require("./actions");

var _messages = _interopRequireDefault(require("../../messages"));

var _messages2 = require("@atlaskit/editor-common/messages");

var _codeBlockCopySelectionPlugin = require("./pm-plugins/codeBlockCopySelectionPlugin");

var _decoration = require("../base/pm-plugins/decoration");

var _pluginKey = require("./plugin-key");

var _languageList = require("./language-list");

var messages = (0, _reactIntlNext.defineMessages)({
  selectLanguage: {
    id: 'fabric.editor.selectLanguage',
    defaultMessage: 'Select language',
    description: 'Code blocks display software code. A prompt to select the software language the code is written in.'
  }
});
exports.messages = messages;
var languageList = (0, _languageList.createLanguageList)(_languageList.DEFAULT_LANGUAGES);

var getToolbarConfig = function getToolbarConfig() {
  var allowCopyToClipboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (state, _ref) {
    var _codeBlockState$pos, _node$attrs;

    var formatMessage = _ref.formatMessage;

    var codeBlockState = _pluginKey.pluginKey.getState(state);

    var pos = (_codeBlockState$pos = codeBlockState === null || codeBlockState === void 0 ? void 0 : codeBlockState.pos) !== null && _codeBlockState$pos !== void 0 ? _codeBlockState$pos : null;

    if (!codeBlockState || pos === null) {
      return;
    }

    var node = state.doc.nodeAt(pos);
    var nodeType = state.schema.nodes.codeBlock;

    if ((node === null || node === void 0 ? void 0 : node.type) !== nodeType) {
      return;
    }

    var language = node === null || node === void 0 ? void 0 : (_node$attrs = node.attrs) === null || _node$attrs === void 0 ? void 0 : _node$attrs.language;
    var options = languageList.map(function (lang) {
      return {
        label: lang.name,
        value: (0, _languageList.getLanguageIdentifier)(lang),
        alias: lang.alias
      };
    }); // If language is not undefined search for it in the value and then search in the aliases

    var defaultValue = language ? options.find(function (option) {
      return option.value === language;
    }) || options.find(function (option) {
      return option.alias.includes(language);
    }) : null;
    var languageSelect = {
      id: 'editor.codeBlock.languageOptions',
      type: 'select',
      selectType: 'list',
      onChange: function onChange(option) {
        return (0, _actions.changeLanguage)(option.value);
      },
      defaultValue: defaultValue,
      placeholder: formatMessage(messages.selectLanguage),
      options: options,
      filterOption: languageListFilter
    };
    var separator = {
      type: 'separator'
    };
    var copyToClipboardItems = !allowCopyToClipboard ? [] : [{
      id: 'editor.codeBlock.copy',
      type: 'button',
      appearance: 'subtle',
      icon: _copy.default,
      // note: copyContentToClipboard contains logic that also removes the
      // visual feedback for the copy button
      onClick: _actions.copyContentToClipboard,
      title: formatMessage(codeBlockState.contentCopied ? _messages2.codeBlockCopyButtonMessages.copiedCodeToClipboard : _messages2.codeBlockCopyButtonMessages.copyCodeToClipboard),
      onMouseEnter: _codeBlockCopySelectionPlugin.provideVisualFeedbackForCopyButton,
      // note: resetCopiedState contains logic that also removes the
      // visual feedback for the copy button
      onMouseLeave: _actions.resetCopiedState,
      onFocus: _codeBlockCopySelectionPlugin.provideVisualFeedbackForCopyButton,
      onBlur: _codeBlockCopySelectionPlugin.removeVisualFeedbackForCopyButton,
      hideTooltipOnClick: false,
      disabled: codeBlockState.isNodeSelected,
      tabIndex: null
    }, separator];
    var deleteButton = {
      id: 'editor.codeBlock.delete',
      type: 'button',
      appearance: 'danger',
      icon: _remove.default,
      onMouseEnter: (0, _decoration.hoverDecoration)(nodeType, true),
      onMouseLeave: (0, _decoration.hoverDecoration)(nodeType, false),
      onFocus: (0, _decoration.hoverDecoration)(nodeType, true),
      onBlur: (0, _decoration.hoverDecoration)(nodeType, false),
      onClick: _actions.removeCodeBlock,
      title: formatMessage(_messages.default.remove),
      tabIndex: null
    };
    return {
      title: 'CodeBlock floating controls',
      getDomRef: function getDomRef(view) {
        return (0, _prosemirrorUtils.findDomRefAtPos)(pos, view.domAtPos.bind(view));
      },
      nodeType: nodeType,
      items: [languageSelect, separator].concat(copyToClipboardItems, [deleteButton]),
      scrollable: true
    };
  };
};
/**
 * Filters language list based on both name and alias properties.
 */


exports.getToolbarConfig = getToolbarConfig;

var languageListFilter = function languageListFilter(option, rawInput) {
  var _ref2 = option,
      data = _ref2.data;
  var searchString = rawInput.toLowerCase();
  return data.label.toLowerCase().includes(searchString) || data.alias.some(function (alias) {
    return alias.toLowerCase() === searchString;
  });
};

exports.languageListFilter = languageListFilter;