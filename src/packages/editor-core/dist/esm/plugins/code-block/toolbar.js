import { defineMessages } from 'react-intl-next';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import { findDomRefAtPos } from 'prosemirror-utils';
import { removeCodeBlock, changeLanguage, copyContentToClipboard, resetCopiedState } from './actions';
import commonMessages from '../../messages';
import { codeBlockCopyButtonMessages } from '@atlaskit/editor-common/messages';
import { provideVisualFeedbackForCopyButton, removeVisualFeedbackForCopyButton } from './pm-plugins/codeBlockCopySelectionPlugin';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { pluginKey } from './plugin-key';
import { createLanguageList, getLanguageIdentifier, DEFAULT_LANGUAGES } from './language-list';
export var messages = defineMessages({
  selectLanguage: {
    id: 'fabric.editor.selectLanguage',
    defaultMessage: 'Select language',
    description: 'Code blocks display software code. A prompt to select the software language the code is written in.'
  }
});
var languageList = createLanguageList(DEFAULT_LANGUAGES);
export var getToolbarConfig = function getToolbarConfig() {
  var allowCopyToClipboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return function (state, _ref) {
    var _codeBlockState$pos, _node$attrs;

    var formatMessage = _ref.formatMessage;
    var codeBlockState = pluginKey.getState(state);
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
        value: getLanguageIdentifier(lang),
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
        return changeLanguage(option.value);
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
      icon: CopyIcon,
      // note: copyContentToClipboard contains logic that also removes the
      // visual feedback for the copy button
      onClick: copyContentToClipboard,
      title: formatMessage(codeBlockState.contentCopied ? codeBlockCopyButtonMessages.copiedCodeToClipboard : codeBlockCopyButtonMessages.copyCodeToClipboard),
      onMouseEnter: provideVisualFeedbackForCopyButton,
      // note: resetCopiedState contains logic that also removes the
      // visual feedback for the copy button
      onMouseLeave: resetCopiedState,
      onFocus: provideVisualFeedbackForCopyButton,
      onBlur: removeVisualFeedbackForCopyButton,
      hideTooltipOnClick: false,
      disabled: codeBlockState.isNodeSelected,
      tabIndex: null
    }, separator];
    var deleteButton = {
      id: 'editor.codeBlock.delete',
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onMouseEnter: hoverDecoration(nodeType, true),
      onMouseLeave: hoverDecoration(nodeType, false),
      onFocus: hoverDecoration(nodeType, true),
      onBlur: hoverDecoration(nodeType, false),
      onClick: removeCodeBlock,
      title: formatMessage(commonMessages.remove),
      tabIndex: null
    };
    return {
      title: 'CodeBlock floating controls',
      getDomRef: function getDomRef(view) {
        return findDomRefAtPos(pos, view.domAtPos.bind(view));
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

export var languageListFilter = function languageListFilter(option, rawInput) {
  var _ref2 = option,
      data = _ref2.data;
  var searchString = rawInput.toLowerCase();
  return data.label.toLowerCase().includes(searchString) || data.alias.some(function (alias) {
    return alias.toLowerCase() === searchString;
  });
};