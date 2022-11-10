import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

/** @jsx jsx */
import React, { memo } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import Textfield from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { N200 } from '@atlaskit/theme/colors';
import { shortcutStyle } from '../../styles';
import { GRID_SIZE, SEARCH_ITEM_HEIGHT_WIDTH } from '../constants';
import useFocus from '../hooks/use-focus';
import { Modes } from '../types';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

function ElementSearch(_ref) {
  var onSearch = _ref.onSearch,
      mode = _ref.mode,
      formatMessage = _ref.intl.formatMessage,
      focus = _ref.focus,
      onClick = _ref.onClick,
      searchTerm = _ref.searchTerm;
  var ref = useFocus(focus);

  var onChange = function onChange(_ref2) {
    var value = _ref2.target.value;
    onSearch(value);
  };

  var onFocus = function onFocus(e) {};

  var onBlur = function onBlur(e) {};

  return jsx("div", {
    css: [wrapper, mode === Modes.inline && wrapperInline]
  }, jsx(Textfield, {
    ref: ref,
    onChange: onChange,
    onClick: onClick,
    onFocus: onFocus,
    onBlur: onBlur,
    elemBeforeInput: jsx("div", {
      css: elementBeforeInput,
      "data-testid": "element_search__element_before_input"
    }, jsx(SearchIcon, {
      size: "medium",
      label: "Advanced search",
      primaryColor: "inherit"
    })),
    elemAfterInput: jsx("div", {
      css: elementAfterInput,
      "data-testid": "element_search__element_after_input"
    }, jsx("div", {
      css: styledShortcut
    }, "\u23CE ", formatMessage(elementAfterInputMessage))),
    placeholder: formatMessage(placeHolderMessage),
    "aria-label": "search",
    value: searchTerm
  }));
}

var elementAfterInputMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.elementAfterInput',
  defaultMessage: 'Enter',
  description: 'Enter to insert'
};
var placeHolderMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.placeholder',
  defaultMessage: 'Search',
  description: 'Search field placeholder'
};
var styledShortcut = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  ", "\n  padding: ", "px ", "px;\n  width: ", "px;\n"])), shortcutStyle, GRID_SIZE / 2, GRID_SIZE, GRID_SIZE * 6);
var wrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  & > [data-ds--text-field--container] {\n    height: ", "px;\n    border-radius: ", "px;\n    flex: 1 1 100%;\n    overflow: visible;\n    & > [data-ds--text-field--input] {\n      margin-bottom: 3px;\n      font-size: ", ";\n      padding: ", "px 6px ", "px 0;\n    }\n  }\n"])), GRID_SIZE * 6, GRID_SIZE, relativeFontSizeToBase16(14), GRID_SIZE, GRID_SIZE);
var wrapperInline = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  & > [data-ds--text-field--container] {\n    height: ", "px;\n    flex: none;\n    overflow: revert;\n  }\n"])), GRID_SIZE * 5);
var elementBeforeInput = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  margin: 1px 6px 0 8px;\n  color: ", ";\n\n  // Custom SearchIcon style\n  span,\n  svg {\n    height: 20px;\n    width: 20px;\n  }\n"])), token('color.icon', N200));
var elementAfterInput = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  margin: 0 8px;\n  height: ", ";\n  text-align: center;\n"])), SEARCH_ITEM_HEIGHT_WIDTH);
var MemoizedElementSearchWithAnalytics = /*#__PURE__*/memo(withAnalyticsContext({
  component: 'Searchbar'
})(injectIntl(ElementSearch)));
export default MemoizedElementSearchWithAnalytics;