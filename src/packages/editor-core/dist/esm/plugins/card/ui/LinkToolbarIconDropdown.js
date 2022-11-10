import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/extends";
var _excluded = ["options"];

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { MenuGroup, Section, CustomItem } from '@atlaskit/menu';
import { borderRadius } from '@atlaskit/theme/constants';
import { B50, N20, B400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import Dropdown from '../../floating-toolbar/ui/Dropdown';
export var ICON_HEIGHT = 40;
export var ICON_WIDTH = 40;
var iconBoxStyles = css({
  width: ICON_HEIGHT,
  height: ICON_WIDTH,
  overflow: 'hidden',
  border: "1px solid ".concat(token('color.border', 'rgba(223, 225, 229, 0.5)'))
  /* N60 at 50% */
  ,
  borderRadius: borderRadius(),
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: token('elevation.surface', 'white')
});
var primitiveStyles = css({
  padding: '0.75rem',
  alignItems: 'flex-start'
});
var interactiveStyles = css({
  '&:active': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', B400)
  }
});
var unselectedStyles = css({
  '&:hover': {
    backgroundColor: token('color.background.neutral.subtle.hovered', N20),
    color: token('color.text.brand', 'currentColor')
  }
});
var selectedOptionStyles = css({
  backgroundColor: token('color.background.selected.pressed', B50),
  color: token('color.text.selected', 'currentColor'),
  '&:hover': {
    backgroundColor: token('color.background.selected.pressed', B50),
    color: token('color.text.selected', 'currentColor')
  }
});
var titleOffsetStyles = css({
  marginTop: '0.125rem'
});

var getCustomStyles = function getCustomStyles(selected, disabled) {
  if (disabled) {
    return [primitiveStyles];
  }

  if (selected) {
    return [primitiveStyles, selectedOptionStyles, interactiveStyles];
  }

  return [primitiveStyles, unselectedStyles, interactiveStyles];
};

var OptionRoot = function OptionRoot(props) {
  return jsx("div", _extends({}, props, {
    tabIndex: 0
  }));
};

var Option = function Option(_ref) {
  var title = _ref.title,
      description = _ref.description,
      selected = _ref.selected,
      disabled = _ref.disabled,
      _onClick = _ref.onClick,
      Icon = _ref.icon,
      testId = _ref.testId,
      tooltipContent = _ref.tooltipContent,
      hide = _ref.hide;
  var option = jsx(CustomItem, {
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
    onClick: function onClick(event) {
      event.preventDefault();

      if (!disabled) {
        _onClick();

        hide();
      }
    },
    onKeyDown: function onKeyDown(event) {
      if (event.key === 'Enter' || event.key === 'Space') {
        event.preventDefault();

        if (!disabled) {
          _onClick();

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

export var LinkToolbarIconDropdown = function LinkToolbarIconDropdown(_ref2) {
  var options = _ref2.options,
      rest = _objectWithoutProperties(_ref2, _excluded);

  return jsx(Dropdown, _extends({}, rest, {
    options: {
      render: function render(_ref3) {
        var hide = _ref3.hide;
        return jsx(MenuGroup, null, jsx("div", {
          role: "listbox"
        }, jsx(Section, null, options.map(function (props) {
          return jsx(Option, _extends({
            key: props.testId
          }, props, {
            hide: hide
          }));
        }))));
      },
      width: 320,
      height: 200
    }
  }));
};