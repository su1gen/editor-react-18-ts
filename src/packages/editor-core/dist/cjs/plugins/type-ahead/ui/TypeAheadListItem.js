"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.itemIcon = exports.TypeAheadListItem = exports.ITEM_PADDING = exports.ICON_WIDTH = exports.ICON_HEIGHT = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _components = require("@atlaskit/theme/components");

var _constants = require("@atlaskit/theme/constants");

var _menu = require("@atlaskit/menu");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _fallback = _interopRequireDefault(require("../../quick-insert/assets/fallback"));

var _styles = require("../../../ui/styles");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ICON_HEIGHT = 40;
exports.ICON_HEIGHT = ICON_HEIGHT;
var ICON_WIDTH = 40;
exports.ICON_WIDTH = ICON_WIDTH;
var ITEM_PADDING = 12;
exports.ITEM_PADDING = ITEM_PADDING;
var itemIcon = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  width: ", "px;\n  height: ", "px;\n  overflow: hidden;\n  border: 1px solid ", "; /* N60 at 50% */\n  border-radius: ", "px;\n  box-sizing: border-box;\n\n  display: flex;\n  justify-content: center;\n  align-items: center;\n\n  div {\n    width: ", "px;\n    height: ", "px;\n  }\n"])), ICON_WIDTH, ICON_HEIGHT, (0, _tokens.token)('color.border', 'rgba(223, 225, 229, 0.5)'), (0, _constants.borderRadius)(), ICON_WIDTH, ICON_HEIGHT);
exports.itemIcon = itemIcon;
var itemBody = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  line-height: 1.4;\n"])));

var itemText = function itemText(theme) {
  return (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  white-space: initial;\n  color: ", ";\n  .item-description {\n    font-size: ", ";\n    color: ", ";\n    margin-top: 4px;\n  }\n"])), (0, _components.themed)({
    light: (0, _tokens.token)('color.text', _colors.N800),
    dark: (0, _tokens.token)('color.text', _colors.DN600)
  })(theme), (0, _editorSharedStyles.relativeFontSizeToBase16)(11.67), (0, _tokens.token)('color.text.subtlest', _colors.N200));
};

var itemAfter = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 0 0 auto;\n"])));
var customRenderItemDivStyle = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  overflow: hidden;\n  &:hover {\n    background-color: ", ";\n  }\n  &:focus {\n    box-shadow: inset 0px 0px 0px 2px ", ";\n    outline: none;\n  }\n"])), (0, _tokens.token)('color.background.selected', _colors.N30), (0, _tokens.token)('color.border.focused', _colors.B100));
/**
 * This CSS emulates the desired behaviour with :focus-visible for firefox.
 * Firefox unfortunately does not register keyboard focus if user mouseDown and drag a typeahead item
 * resulting in focus-visible style not drawn.
 */

var selectionFrame = {
  '& > button:focus': {
    boxShadow: "inset 0px 0px 0px 2px ".concat((0, _tokens.token)('color.border.focused', _colors.B100)),
    outline: 'none',
    '&:active': {
      boxShadow: 'none'
    }
  }
};
var selectedStyle = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n"])), (0, _tokens.token)('color.background.selected', _colors.N30));

var FallbackIcon = /*#__PURE__*/_react.default.memo(function (_ref) {
  var label = _ref.label;
  return (0, _react2.jsx)(_fallback.default, null);
});

var noop = function noop() {};

var TypeAheadListItem = function TypeAheadListItem(_ref2) {
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
  var elementIcon = (0, _react.useMemo)(function () {
    return (0, _react2.jsx)("div", {
      css: itemIcon
    }, icon ? icon() : (0, _react2.jsx)(FallbackIcon, {
      label: title
    }));
  }, [icon, title]);
  var insertSelectedItem = (0, _react.useCallback)(function () {
    onItemClick(_typeAhead.SelectItemMode.SELECTED, itemIndex);
  }, [onItemClick, itemIndex]);

  var customItemRef = /*#__PURE__*/_react.default.createRef();

  var buttonItemRef = /*#__PURE__*/_react.default.createRef();

  var shouldUpdateFocus = selectedIndex === itemIndex;
  (0, _react.useLayoutEffect)(function () {
    if (shouldUpdateFocus) {
      var _customItemRef$curren;

      customItemRef === null || customItemRef === void 0 ? void 0 : (_customItemRef$curren = customItemRef.current) === null || _customItemRef$curren === void 0 ? void 0 : _customItemRef$curren.focus();
    }
  }, [customItemRef, shouldUpdateFocus]);
  (0, _react.useLayoutEffect)(function () {
    if (shouldUpdateFocus) {
      var _buttonItemRef$curren;

      buttonItemRef === null || buttonItemRef === void 0 ? void 0 : (_buttonItemRef$curren = buttonItemRef.current) === null || _buttonItemRef$curren === void 0 ? void 0 : _buttonItemRef$curren.focus();
    }
  }, [buttonItemRef, shouldUpdateFocus]);
  var customItem = (0, _react.useMemo)(function () {
    if (!customRenderItem) {
      return null;
    }

    var Comp = customRenderItem;
    var listItemClasses = [customRenderItemDivStyle, isSelected && selectedStyle];
    return (0, _react2.jsx)("div", {
      "aria-selected": isSelected,
      "aria-label": title,
      role: "option",
      "aria-setsize": itemsLength,
      tabIndex: 0,
      css: listItemClasses,
      className: "ak-typeahead-item ".concat(isSelected ? 'typeahead-selected-item' : '') //CSS classes added for test cases purpose
      ,
      ref: customItemRef
    }, (0, _react2.jsx)(Comp, {
      onClick: insertSelectedItem,
      isSelected: false //The selection styles are handled in the parent div instead. Hence isSelected is made false always.
      ,
      onHover: noop
    }));
  }, [customRenderItem, insertSelectedItem, isSelected, title, customItemRef, itemsLength]);

  if (customItem) {
    return customItem;
  }

  return (0, _react2.jsx)("span", {
    css: selectionFrame
  }, (0, _react2.jsx)(_menu.ButtonItem, {
    onClick: insertSelectedItem,
    iconBefore: elementIcon,
    isSelected: isSelected,
    "aria-selected": isSelected,
    "aria-label": item.title,
    "aria-setsize": itemsLength,
    role: "option",
    ref: buttonItemRef,
    description: item.description
  }, (0, _react2.jsx)("div", {
    css: itemBody
  }, (0, _react2.jsx)("div", {
    css: itemText
  }, (0, _react2.jsx)("div", {
    className: "item-title"
  }, item.title)), (0, _react2.jsx)("div", {
    css: itemAfter
  }, item.keyshortcut && (0, _react2.jsx)("div", {
    css: _styles.shortcutStyle
  }, item.keyshortcut)))));
};

exports.TypeAheadListItem = TypeAheadListItem;