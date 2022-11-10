import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { separatorStyles, wrapperStyle } from '../../../../ui/styles';
import { NORMAL_TEXT } from '../../types';
import { blockTypeMenuItemStyle, keyboardShortcut, keyboardShortcutSelect } from './styled';
import { tooltip, findKeymapByDescription } from '../../../../keymaps';
import { BlockTypeButton } from './blocktype-button';

class ToolbarBlockType extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      active: false
    });

    _defineProperty(this, "onOpenChange", attrs => {
      this.setState({
        active: attrs.isOpen
      });
    });

    _defineProperty(this, "handleTriggerClick", () => {
      this.onOpenChange({
        isOpen: !this.state.active
      });
    });

    _defineProperty(this, "createItems", () => {
      const {
        intl: {
          formatMessage
        }
      } = this.props;
      const {
        currentBlockType,
        availableBlockTypes
      } = this.props.pluginState;
      const items = availableBlockTypes.map((blockType, index) => {
        const isActive = currentBlockType === blockType;
        const tagName = blockType.tagName || 'p';
        const Tag = tagName;
        return {
          content: jsx("div", {
            css: blockTypeMenuItemStyle(tagName, isActive)
          }, jsx(Tag, null, formatMessage(blockType.title))),
          value: blockType,
          label: formatMessage(blockType.title),
          key: `${blockType.name}-${index}`,
          elemAfter: jsx("div", {
            css: [keyboardShortcut, isActive && keyboardShortcutSelect]
          }, tooltip(findKeymapByDescription(blockType.title.defaultMessage))),
          isActive
        };
      });
      return [{
        items
      }];
    });

    _defineProperty(this, "handleSelectBlockType", ({
      item
    }) => {
      const blockType = item.value;
      this.props.setBlockType(blockType.name);
      this.setState({
        active: false
      });
    });
  }

  render() {
    const {
      active
    } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isSmall,
      isReducedSpacing,
      pluginState: {
        currentBlockType,
        blockTypesDisabled,
        availableBlockTypes
      },
      intl: {
        formatMessage
      }
    } = this.props;
    const isHeadingDisabled = !availableBlockTypes.some(blockType => blockType.nodeName === 'heading');

    if (isHeadingDisabled) {
      return null;
    }

    const blockTypeTitles = availableBlockTypes.filter(blockType => blockType.name === currentBlockType.name).map(blockType => blockType.title);
    const longestDropdownMenuItem = [NORMAL_TEXT, ...availableBlockTypes].reduce((longest, item) => {
      const itemTitle = formatMessage(item.title);
      return itemTitle.length >= longest.length ? itemTitle : longest;
    }, '');

    if (!this.props.isDisabled && !blockTypesDisabled) {
      const items = this.createItems();
      return jsx("span", {
        css: wrapperStyle
      }, jsx(DropdownMenu, {
        items: items,
        onOpenChange: this.onOpenChange,
        onItemActivated: this.handleSelectBlockType,
        isOpen: active,
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        zIndex: akEditorMenuZIndex,
        fitHeight: 360,
        fitWidth: 106,
        shouldUseDefaultRole: true
      }, jsx(BlockTypeButton, {
        isSmall: isSmall,
        isReducedSpacing: isReducedSpacing,
        selected: active,
        disabled: false,
        title: blockTypeTitles[0],
        onClick: this.handleTriggerClick,
        formatMessage: formatMessage,
        "aria-expanded": active
      }, longestDropdownMenuItem)), jsx("span", {
        css: separatorStyles
      }));
    }

    return jsx("span", {
      css: wrapperStyle
    }, jsx(BlockTypeButton, {
      isSmall: isSmall,
      isReducedSpacing: isReducedSpacing,
      selected: active,
      disabled: true,
      title: blockTypeTitles[0],
      onClick: this.handleTriggerClick,
      formatMessage: formatMessage,
      "aria-expanded": active
    }, longestDropdownMenuItem), jsx("span", {
      css: separatorStyles
    }));
  }

}

export default injectIntl(ToolbarBlockType);