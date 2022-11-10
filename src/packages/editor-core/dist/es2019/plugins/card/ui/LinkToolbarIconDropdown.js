import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { MenuGroup, Section, CustomItem } from '@atlaskit/menu';
import { borderRadius } from '@atlaskit/theme/constants';
import { B50, N20, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import Dropdown from '../../floating-toolbar/ui/Dropdown';
export const ICON_HEIGHT = 40;
export const ICON_WIDTH = 40;
const iconBoxStyles = css({
  width: ICON_HEIGHT,
  height: ICON_WIDTH,
  overflow: 'hidden',
  border: `1px solid ${token('color.border', 'rgba(223, 225, 229, 0.5)')}`
  /* N60 at 50% */
  ,
  borderRadius: borderRadius(),
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: token('elevation.surface', 'white')
});
const primitiveStyles = css({
  padding: '0.75rem',
  alignItems: 'flex-start'
});
const interactiveStyles = css({
  '&:active': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', B400)
  }
});
const unselectedStyles = css({
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N20),
    color: token('color.text.brand', 'currentColor')
  }
});
const selectedOptionStyles = css({
  backgroundColor: token('color.background.selected.pressed', B50),
  color: token('color.text.selected', 'currentColor'),
  '&:hover': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', 'currentColor')
  }
});
const titleOffsetStyles = css({
  marginTop: '0.125rem'
});

const getCustomStyles = (selected, disabled) => {
  if (disabled) {
    return [primitiveStyles];
  }

  if (selected) {
    return [primitiveStyles, selectedOptionStyles, interactiveStyles];
  }

  return [primitiveStyles, unselectedStyles, interactiveStyles];
};

const OptionRoot = props => jsx("div", _extends({}, props, {
  tabIndex: 0
}));

const Option = ({
  title,
  description,
  selected,
  disabled,
  onClick,
  icon: Icon,
  testId,
  tooltipContent,
  hide
}) => {
  const option = jsx(CustomItem, {
    "aria-label": title,
    component: OptionRoot,
    iconBefore: jsx("div", {
      css: iconBoxStyles
    }, jsx(Icon, {
      width: 38,
      height: 38,
      label: title
    })) // @ts-ignore Overriding Menu styles is not supported
    ,
    css: getCustomStyles(selected, disabled),
    description: description,
    testId: testId,
    onClick: event => {
      event.preventDefault();

      if (!disabled) {
        onClick();
        hide();
      }
    },
    onKeyDown: event => {
      if (event.key === 'Enter' || event.key === 'Space') {
        event.preventDefault();

        if (!disabled) {
          onClick();
          hide();
        }
      }
    },
    role: "option",
    "aria-selected": selected,
    isSelected: selected,
    isDisabled: disabled,
    shouldDescriptionWrap: true
  }, jsx("div", {
    css: titleOffsetStyles
  }, title));

  if (tooltipContent) {
    return jsx(Tooltip, {
      content: tooltipContent
    }, option);
  }

  return option;
};

export const LinkToolbarIconDropdown = ({
  options,
  ...rest
}) => jsx(Dropdown, _extends({}, rest, {
  options: {
    render: ({
      hide
    }) => jsx(MenuGroup, null, jsx("div", {
      role: "listbox"
    }, jsx(Section, null, options.map(props => jsx(Option, _extends({
      key: props.testId
    }, props, {
      hide: hide
    })))))),
    width: 320,
    height: 200
  }
}));