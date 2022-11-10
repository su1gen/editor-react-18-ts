import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { useIntl } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import { toggleBulletList as toggleBulletListKeymap, toggleOrderedList as toggleOrderedListKeymap, indent as toggleIndentKeymap, outdent as toggleOutdentKeymap, tooltip } from '../../../keymaps';
import DropdownMenu from '../../../ui/DropdownMenu';
import ToolbarButton from '../../../ui/ToolbarButton';
import { wrapperStyle, expandIconWrapperStyle, shortcutStyle, separatorStyles } from '../../../ui/styles';
import { messages as listMessages } from '../../list/messages';
import { messages as indentationMessages } from '../../indentation/messages';
export function ToolbarDropdown(props) {
  var _useIntl = useIntl(),
      formatMessage = _useIntl.formatMessage;

  var disabled = props.disabled,
      isReducedSpacing = props.isReducedSpacing,
      bulletListActive = props.bulletListActive,
      orderedListActive = props.orderedListActive,
      popupsMountPoint = props.popupsMountPoint,
      popupsBoundariesElement = props.popupsBoundariesElement,
      popupsScrollableElement = props.popupsScrollableElement,
      onItemActivated = props.onItemActivated;

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isDropdownOpen = _React$useState2[0],
      setIsDropdownOpen = _React$useState2[1];

  var labelLists = formatMessage(listMessages.lists);

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

  return jsx("span", {
    css: wrapperStyle
  }, jsx(DropdownMenu, {
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
  }, jsx(ToolbarButton, {
    spacing: isReducedSpacing ? 'none' : 'default',
    selected: bulletListActive || orderedListActive,
    "aria-expanded": isDropdownOpen,
    "aria-haspopup": true,
    "aria-label": labelLists,
    disabled: disabled,
    onClick: handleTriggerClick,
    title: labelLists,
    iconBefore: jsx("span", {
      css: wrapperStyle
    }, jsx(BulletListIcon, {
      label: labelLists
    }), jsx("span", {
      css: expandIconWrapperStyle
    }, jsx(ExpandIcon, {
      label: ""
    })))
  })), jsx("span", {
    css: separatorStyles
  }));
}

function useItems(props) {
  var _useIntl2 = useIntl(),
      formatMessage = _useIntl2.formatMessage;

  var labelUnorderedList = formatMessage(listMessages.unorderedList);
  var labelOrderedList = formatMessage(listMessages.orderedList);
  var items = [{
    key: 'unorderedList',
    content: labelUnorderedList,
    value: {
      name: 'bullet_list'
    },
    isDisabled: props.bulletListDisabled,
    isActive: Boolean(props.bulletListActive),
    elemAfter: jsx("div", {
      css: shortcutStyle
    }, tooltip(toggleBulletListKeymap))
  }, {
    key: 'orderedList',
    content: labelOrderedList,
    value: {
      name: 'ordered_list'
    },
    isDisabled: props.orderedListDisabled,
    isActive: Boolean(props.orderedListActive),
    elemAfter: jsx("div", {
      css: shortcutStyle
    }, tooltip(toggleOrderedListKeymap))
  }];

  if (props.showIndentationButtons) {
    var labelIndent = formatMessage(indentationMessages.indent);
    var labelOutdent = formatMessage(indentationMessages.outdent);
    items.push({
      key: 'outdent',
      content: labelOutdent,
      value: {
        name: 'outdent'
      },
      isDisabled: props.outdentDisabled,
      isActive: false,
      elemAfter: jsx("div", {
        css: shortcutStyle
      }, tooltip(toggleOutdentKeymap))
    }, {
      key: 'indent',
      content: labelIndent,
      value: {
        name: 'indent'
      },
      isDisabled: props.indentDisabled,
      isActive: false,
      elemAfter: jsx("div", {
        css: shortcutStyle
      }, tooltip(toggleIndentKeymap))
    });
  }

  return [{
    items: items
  }];
}