/** @jsx jsx */
import { jsx } from '@emotion/react';
import { dropdownItem } from './styles';

var DropdownItemWrapper = function DropdownItemWrapper(props) {
  return jsx("div", {
    css: dropdownItem,
    onClick: function onClick() {
      return props.onClick && props.onClick({
        actionOnClick: props.actionOnClick,
        renderOnClick: props.renderOnClick
      });
    }
  }, jsx("span", null, props.icon), props.children);
};

export default DropdownItemWrapper;