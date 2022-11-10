import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/react';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import UiDropdown from '../../../ui/Dropdown';
import Button from './Button';
import DropdownMenu, { itemSpacing, menuItemDimensions } from './DropdownMenu';
const dropdownExpandContainer = css`
  margin: 0px -4px;
`;
const iconGroup = css`
  display: flex;
`;

const CompositeIcon = ({
  icon
}) => jsx("div", {
  css: iconGroup
}, icon, jsx("span", {
  css: dropdownExpandContainer
}, jsx(ExpandIcon, {
  label: "Expand dropdown menu"
})));

export default class Dropdown extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      isOpen: false
    });

    _defineProperty(this, "renderArrayOptions", options => {
      const {
        showSelected,
        dispatchCommand
      } = this.props;
      return jsx(DropdownMenu, {
        hide: this.hide,
        dispatchCommand: dispatchCommand,
        items: options,
        showSelected: showSelected
      });
    });

    _defineProperty(this, "toggleOpen", () => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    });

    _defineProperty(this, "hide", () => {
      this.setState({
        isOpen: false
      });
    });
  }

  render() {
    const {
      isOpen
    } = this.state;
    const {
      title,
      icon,
      options,
      dispatchCommand,
      mountPoint,
      boundariesElement,
      scrollableElement,
      hideExpandIcon,
      disabled,
      tooltip,
      buttonTestId,
      dropdownWidth
    } = this.props;
    let trigger;

    if (icon) {
      const TriggerIcon = hideExpandIcon ? icon : jsx(CompositeIcon, {
        icon: icon
      });
      trigger = jsx(Button, {
        testId: buttonTestId,
        title: title,
        icon: TriggerIcon,
        onClick: this.toggleOpen,
        selected: isOpen,
        disabled: disabled,
        tooltipContent: tooltip
      });
    } else {
      trigger = jsx(Button, {
        testId: buttonTestId,
        iconAfter: jsx("span", {
          css: dropdownExpandContainer
        }, jsx(ExpandIcon, {
          label: "Expand dropdown menu"
        })),
        onClick: this.toggleOpen,
        selected: isOpen,
        disabled: disabled,
        tooltipContent: tooltip
      }, title);
    }
    /**
     * We want to change direction of our dropdowns a bit early,
     * not exactly when it hits the boundary.
     */


    const fitTolerance = 10;
    const fitWidth = Array.isArray(options) ? dropdownWidth || menuItemDimensions.width : options.width;
    const fitHeight = Array.isArray(options) ? options.length * menuItemDimensions.height + itemSpacing * 2 : options.height;
    return jsx(UiDropdown, {
      mountTo: mountPoint,
      boundariesElement: boundariesElement,
      scrollableElement: scrollableElement,
      isOpen: isOpen,
      handleClickOutside: this.hide,
      handleEscapeKeydown: this.hide,
      fitWidth: fitWidth + fitTolerance,
      fitHeight: fitHeight + fitTolerance,
      trigger: trigger
    }, Array.isArray(options) ? this.renderArrayOptions(options) : options.render({
      hide: this.hide,
      dispatchCommand
    }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.setDisableParentScroll && prevState.isOpen !== this.state.isOpen) {
      this.props.setDisableParentScroll(this.state.isOpen);
    }
  }

}