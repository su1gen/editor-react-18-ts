"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkToolbarIconDropdown = exports.ICON_WIDTH = exports.ICON_HEIGHT = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _menu = require("@atlaskit/menu");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _Dropdown = _interopRequireDefault(require("../../floating-toolbar/ui/Dropdown"));

var _excluded = ["options"];
var ICON_HEIGHT = 40;
exports.ICON_HEIGHT = ICON_HEIGHT;
var ICON_WIDTH = 40;
exports.ICON_WIDTH = ICON_WIDTH;
var iconBoxStyles = (0, _react2.css)({
  width: ICON_HEIGHT,
  height: ICON_WIDTH,
  overflow: 'hidden',
  border: "1px solid ".concat((0, _tokens.token)('color.border', 'rgba(223, 225, 229, 0.5)'))
  /* N60 at 50% */
  ,
  borderRadius: (0, _constants.borderRadius)(),
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: (0, _tokens.token)('elevation.surface', 'white')
});
var primitiveStyles = (0, _react2.css)({
  padding: '0.75rem',
  alignItems: 'flex-start'
});
var interactiveStyles = (0, _react2.css)({
  '&:active': {
    backgroundColor: (0, _tokens.token)('color.background.selected.pressed', _colors.B50),
    color: (0, _tokens.token)('color.text.selected', _colors.B400)
  }
});
var unselectedStyles = (0, _react2.css)({
  '&:hover': {
    backgroundColor: (0, _tokens.token)('color.background.neutral.subtle.hovered', _colors.N20),
    color: (0, _tokens.token)('color.text.brand', 'currentColor')
  }
});
var selectedOptionStyles = (0, _react2.css)({
  backgroundColor: (0, _tokens.token)('color.background.selected.pressed', _colors.B50),
  color: (0, _tokens.token)('color.text.selected', 'currentColor'),
  '&:hover': {
    backgroundColor: (0, _tokens.token)('color.background.selected.pressed', _colors.B50),
    color: (0, _tokens.token)('color.text.selected', 'currentColor')
  }
});
var titleOffsetStyles = (0, _react2.css)({
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
  return (0, _react2.jsx)("div", (0, _extends2.default)({}, props, {
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
  var option = (0, _react2.jsx)(_menu.CustomItem, {
    "aria-label": title,
    component: OptionRoot,
    iconBefore: (0, _react2.jsx)("div", {
      css: iconBoxStyles
    }, (0, _react2.jsx)(Icon, {
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
  }, (0, _react2.jsx)("div", {
    css: titleOffsetStyles
  }, title));

  if (tooltipContent) {
    return (0, _react2.jsx)(_tooltip.default, {
      content: tooltipContent
    }, option);
  }

  return option;
};

var LinkToolbarIconDropdown = function LinkToolbarIconDropdown(_ref2) {
  var options = _ref2.options,
      rest = (0, _objectWithoutProperties2.default)(_ref2, _excluded);
  return (0, _react2.jsx)(_Dropdown.default, (0, _extends2.default)({}, rest, {
    options: {
      render: function render(_ref3) {
        var hide = _ref3.hide;
        return (0, _react2.jsx)(_menu.MenuGroup, null, (0, _react2.jsx)("div", {
          role: "listbox"
        }, (0, _react2.jsx)(_menu.Section, null, options.map(function (props) {
          return (0, _react2.jsx)(Option, (0, _extends2.default)({
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

exports.LinkToolbarIconDropdown = LinkToolbarIconDropdown;