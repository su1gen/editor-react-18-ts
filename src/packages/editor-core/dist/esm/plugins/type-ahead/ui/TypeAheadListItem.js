import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

/** @jsx jsx */
import React, { useCallback, useMemo, useLayoutEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { DN600, N200, N800, N30, B100 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { ButtonItem } from '@atlaskit/menu';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import IconFallback from '../../quick-insert/assets/fallback';
import { shortcutStyle } from '../../../ui/styles';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { token } from '@atlaskit/tokens';
export var ICON_HEIGHT = 40;
export var ICON_WIDTH = 40;
export var ITEM_PADDING = 12;
export var itemIcon = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: ", "px;\n  height: ", "px;\n  overflow: hidden;\n  border: 1px solid ", "; /* N60 at 50% */\n  border-radius: ", "px;\n  box-sizing: border-box;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  div {\n    width: ", "px;\n    height: ", "px;\n  }\n"])), ICON_WIDTH, ICON_HEIGHT, token('color.border', 'rgba(223, 225, 229, 0.5)'), borderRadius(), ICON_WIDTH, ICON_HEIGHT);
var itemBody = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  line-height: 1.4;\n"])));

var itemText = function itemText(theme) {
  return css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  white-space: initial;\n  color: ", ";\n  .item-description {\n    font-size: ", ";\n    color: ", ";\n    margin-top: 4px;\n  }\n"])), themed({
    light: token('color.text', N800),
    dark: token('color.text', DN600)
  })(theme), relativeFontSizeToBase16(11.67), token('color.text.subtlest', N200));
};

var itemAfter = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  flex: 0 0 auto;\n"])));
var customRenderItemDivStyle = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  overflow: hidden;\n  &:hover {\n    background-color: ", ";\n  }\n  &:focus {\n    box-shadow: inset 0px 0px 0px 2px ", ";\n    outline: none;\n  }\n"])), token('color.background.selected', N30), token('color.border.focused', B100));
/**
 * This CSS emulates the desired behaviour with :focus-visible for firefox.
 * Firefox unfortunately does not register keyboard focus if user mouseDown and drag a typeahead item
 * resulting in focus-visible style not drawn.
 */

var selectionFrame = {
  '& > button:focus': {
    boxShadow: "inset 0px 0px 0px 2px ".concat(token('color.border.focused', B100)),
    outline: 'none',
    '&:active': {
      boxShadow: 'none'
    }
  }
};
var selectedStyle = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  background-color: ", ";\n"])), token('color.background.selected', N30));
var FallbackIcon = /*#__PURE__*/React.memo(function (_ref) {
  var label = _ref.label;
  return jsx(IconFallback, null);
});

var noop = function noop() {};

export var TypeAheadListItem = function TypeAheadListItem(_ref2) {
  var item = _ref2.item,
      itemsLength = _ref2.itemsLength,
      selectedIndex = _ref2.selectedIndex,
      onItemClick = _ref2.onItemClick,
      itemIndex = _ref2.itemIndex;

  /**
   * To select and highlight the first Item when no item is selected
   * However selectedIndex remains -1, So that user does not skip the first item when down arrow key is used from typeahead query(inputQuery.tsx)
   */
  var isSelected = itemIndex === selectedIndex || selectedIndex === -1 && itemIndex === 0;
  var icon = item.icon,
      title = item.title,
      customRenderItem = item.render;
  var elementIcon = useMemo(function () {
    return jsx("div", {
      css: itemIcon
    }, icon ? icon() : jsx(FallbackIcon, {
      label: title
    }));
  }, [icon, title]);
  var insertSelectedItem = useCallback(function () {
    onItemClick(SelectItemMode.SELECTED, itemIndex);
  }, [onItemClick, itemIndex]);
  var customItemRef = /*#__PURE__*/React.createRef();
  var buttonItemRef = /*#__PURE__*/React.createRef();
  var shouldUpdateFocus = selectedIndex === itemIndex;
  useLayoutEffect(function () {
    if (shouldUpdateFocus) {
      var _customItemRef$curren;

      customItemRef === null || customItemRef === void 0 ? void 0 : (_customItemRef$curren = customItemRef.current) === null || _customItemRef$curren === void 0 ? void 0 : _customItemRef$curren.focus();
    }
  }, [customItemRef, shouldUpdateFocus]);
  useLayoutEffect(function () {
    if (shouldUpdateFocus) {
      var _buttonItemRef$curren;

      buttonItemRef === null || buttonItemRef === void 0 ? void 0 : (_buttonItemRef$curren = buttonItemRef.current) === null || _buttonItemRef$curren === void 0 ? void 0 : _buttonItemRef$curren.focus();
    }
  }, [buttonItemRef, shouldUpdateFocus]);
  var customItem = useMemo(function () {
    if (!customRenderItem) {
      return null;
    }

    var Comp = customRenderItem;
    var listItemClasses = [customRenderItemDivStyle, isSelected && selectedStyle];
    return jsx("div", {
      "aria-selected": isSelected,
      "aria-label": title,
      role: "option",
      "aria-setsize": itemsLength,
      tabIndex: 0,
      css: listItemClasses,
      className: "ak-typeahead-item ".concat(isSelected ? 'typeahead-selected-item' : '') //CSS classes added for test cases purpose
      ,
      ref: customItemRef
    }, jsx(Comp, {
      onClick: insertSelectedItem,
      isSelected: false //The selection styles are handled in the parent div instead. Hence isSelected is made false always.
      ,
      onHover: noop
    }));
  }, [customRenderItem, insertSelectedItem, isSelected, title, customItemRef, itemsLength]);

  if (customItem) {
    return customItem;
  }

  return jsx("span", {
    css: selectionFrame
  }, jsx(ButtonItem, {
    onClick: insertSelectedItem,
    iconBefore: elementIcon,
    isSelected: isSelected,
    "aria-selected": isSelected,
    "aria-label": item.title,
    "aria-setsize": itemsLength,
    role: "option",
    ref: buttonItemRef,
    description: item.description
  }, jsx("div", {
    css: itemBody
  }, jsx("div", {
    css: itemText
  }, jsx("div", {
    className: "item-title"
  }, item.title)), jsx("div", {
    css: itemAfter
  }, item.keyshortcut && jsx("div", {
    css: shortcutStyle
  }, item.keyshortcut)))));
};