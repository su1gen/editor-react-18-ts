import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Dropdown from '../../../../ui/Dropdown';
import Alignment from '../../../../ui/Alignment';
import { expandIconWrapper, separator, triggerWrapper, wrapper } from './styles';
import { IconMap } from './icon-map';
import { messages } from './messages';
export class AlignmentToolbar extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      isOpen: false
    });

    _defineProperty(this, "changeAlignment", align => {
      this.toggleOpen();
      return this.props.changeAlignment(align);
    });

    _defineProperty(this, "toggleOpen", () => {
      this.handleOpenChange({
        isOpen: !this.state.isOpen
      });
    });

    _defineProperty(this, "handleOpenChange", ({
      isOpen
    }) => {
      this.setState({
        isOpen
      });
    });

    _defineProperty(this, "hide", () => {
      if (this.state.isOpen) {
        this.setState({
          isOpen: false
        });
      }
    });
  }

  render() {
    const {
      isOpen
    } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
      disabled,
      intl
    } = this.props;
    const title = intl.formatMessage(messages.alignment);
    return jsx("span", {
      css: wrapper
    }, jsx(Dropdown, {
      mountTo: popupsMountPoint,
      boundariesElement: popupsBoundariesElement,
      scrollableElement: popupsScrollableElement,
      isOpen: isOpen,
      handleClickOutside: this.hide,
      handleEscapeKeydown: this.hide,
      fitWidth: 112,
      fitHeight: 80,
      trigger: jsx(ToolbarButton, {
        spacing: isReducedSpacing ? 'none' : 'default',
        disabled: disabled,
        selected: isOpen,
        title: title,
        className: "align-btn",
        "aria-label": title,
        "aria-expanded": isOpen,
        "aria-haspopup": true,
        onClick: this.toggleOpen,
        iconBefore: jsx("div", {
          css: triggerWrapper
        }, jsx(IconMap, {
          alignment: pluginState.align
        }), jsx("span", {
          css: expandIconWrapper
        }, jsx(ExpandIcon, {
          label: ""
        })))
      })
    }, jsx(Alignment, {
      onClick: align => this.changeAlignment(align),
      selectedAlignment: pluginState.align
    })), jsx("span", {
      css: separator
    }));
  }

}

_defineProperty(AlignmentToolbar, "displayName", 'AlignmentToolbar');

export default injectIntl(AlignmentToolbar);