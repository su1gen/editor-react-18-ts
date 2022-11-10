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
  const {
    formatMessage
  } = useIntl();
  const {
    disabled,
    isReducedSpacing,
    bulletListActive,
    orderedListActive,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    onItemActivated
  } = props;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const labelLists = formatMessage(listMessages.lists);

  const onOpenChange = attrs => {
    setIsDropdownOpen(attrs.isDropdownOpen);
  };

  const handleTriggerClick = () => {
    onOpenChange({
      isDropdownOpen: !isDropdownOpen
    });
  };

  const items = useItems(props);

  const handleOnItemActivated = ({
    item
  }) => {
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
  const {
    formatMessage
  } = useIntl();
  const labelUnorderedList = formatMessage(listMessages.unorderedList);
  const labelOrderedList = formatMessage(listMessages.orderedList);
  let items = [{
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
    const labelIndent = formatMessage(indentationMessages.indent);
    const labelOutdent = formatMessage(indentationMessages.outdent);
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
    items
  }];
}