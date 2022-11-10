"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarDropdown = ToolbarDropdown;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("@emotion/react");

var _react2 = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _bulletList = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/bullet-list"));

var _keymaps = require("../../../keymaps");

var _DropdownMenu = _interopRequireDefault(require("../../../ui/DropdownMenu"));

var _ToolbarButton = _interopRequireDefault(require("../../../ui/ToolbarButton"));

var _styles = require("../../../ui/styles");

var _messages = require("../../list/messages");

var _messages2 = require("../../indentation/messages");

/** @jsx jsx */
function ToolbarDropdown(props) {
  var _useIntl = (0, _reactIntlNext.useIntl)(),
      formatMessage = _useIntl.formatMessage;

  var disabled = props.disabled,
      isReducedSpacing = props.isReducedSpacing,
      bulletListActive = props.bulletListActive,
      orderedListActive = props.orderedListActive,
      popupsMountPoint = props.popupsMountPoint,
      popupsBoundariesElement = props.popupsBoundariesElement,
      popupsScrollableElement = props.popupsScrollableElement,
      onItemActivated = props.onItemActivated;

  var _React$useState = _react2.default.useState(false),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      isDropdownOpen = _React$useState2[0],
      setIsDropdownOpen = _React$useState2[1];

  var labelLists = formatMessage(_messages.messages.lists);

  var onOpenChange = function onOpenChange(attrs) {
    setIsDropdownOpen(attrs.isDropdownOpen);
  };

  var handleTriggerClick = function handleTriggerClick() {
    onOpenChange({
      isDropdownOpen: !isDropdownOpen
    });
  };

  var items = useItems(props);

  var handleOnItemActivated = function handleOnItemActivated(_ref) {
    var item = _ref.item;
    setIsDropdownOpen(false);
    return onItemActivated({
      editorView: props.editorView,
      buttonName: item.value.name
    });
  };

  return (0, _react.jsx)("span", {
    css: _styles.wrapperStyle
  }, (0, _react.jsx)(_DropdownMenu.default, {
    items: items,
    onItemActivated: handleOnItemActivated,
    mountTo: popupsMountPoint,
    boundariesElement: popupsBoundariesElement,
    scrollableElement: popupsScrollableElement,
    isOpen: isDropdownOpen,
    onOpenChange: onOpenChange,
    fitHeight: 188,
    fitWidth: 175,
    shouldUseDefaultRole: true
  }, (0, _react.jsx)(_ToolbarButton.default, {
    spacing: isReducedSpacing ? 'none' : 'default',
    selected: bulletListActive || orderedListActive,
    "aria-expanded": isDropdownOpen,
    "aria-haspopup": true,
    "aria-label": labelLists,
    disabled: disabled,
    onClick: handleTriggerClick,
    title: labelLists,
    iconBefore: (0, _react.jsx)("span", {
      css: _styles.wrapperStyle
    }, (0, _react.jsx)(_bulletList.default, {
      label: labelLists
    }), (0, _react.jsx)("span", {
      css: _styles.expandIconWrapperStyle
    }, (0, _react.jsx)(_chevronDown.default, {
      label: ""
    })))
  })), (0, _react.jsx)("span", {
    css: _styles.separatorStyles
  }));
}

function useItems(props) {
  var _useIntl2 = (0, _reactIntlNext.useIntl)(),
      formatMessage = _useIntl2.formatMessage;

  var labelUnorderedList = formatMessage(_messages.messages.unorderedList);
  var labelOrderedList = formatMessage(_messages.messages.orderedList);
  var items = [{
    key: 'unorderedList',
    content: labelUnorderedList,
    value: {
      name: 'bullet_list'
    },
    isDisabled: props.bulletListDisabled,
    isActive: Boolean(props.bulletListActive),
    elemAfter: (0, _react.jsx)("div", {
      css: _styles.shortcutStyle
    }, (0, _keymaps.tooltip)(_keymaps.toggleBulletList))
  }, {
    key: 'orderedList',
    content: labelOrderedList,
    value: {
      name: 'ordered_list'
    },
    isDisabled: props.orderedListDisabled,
    isActive: Boolean(props.orderedListActive),
    elemAfter: (0, _react.jsx)("div", {
      css: _styles.shortcutStyle
    }, (0, _keymaps.tooltip)(_keymaps.toggleOrderedList))
  }];

  if (props.showIndentationButtons) {
    var labelIndent = formatMessage(_messages2.messages.indent);
    var labelOutdent = formatMessage(_messages2.messages.outdent);
    items.push({
      key: 'outdent',
      content: labelOutdent,
      value: {
        name: 'outdent'
      },
      isDisabled: props.outdentDisabled,
      isActive: false,
      elemAfter: (0, _react.jsx)("div", {
        css: _styles.shortcutStyle
      }, (0, _keymaps.tooltip)(_keymaps.outdent))
    }, {
      key: 'indent',
      content: labelIndent,
      value: {
        name: 'indent'
      },
      isDisabled: props.indentDisabled,
      isActive: false,
      elemAfter: (0, _react.jsx)("div", {
        css: _styles.shortcutStyle
      }, (0, _keymaps.tooltip)(_keymaps.indent))
    });
  }

  return [{
    items: items
  }];
}