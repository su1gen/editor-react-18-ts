/** @jsx jsx */
import { jsx } from '@emotion/react';
import { dropdownItem } from './styles';

const DropdownItemWrapper = props => jsx("div", {
  css: dropdownItem,
  onClick: () => props.onClick && props.onClick({
    actionOnClick: props.actionOnClick,
    renderOnClick: props.renderOnClick
  })
}, jsx("span", null, props.icon), props.children);

export default DropdownItemWrapper;