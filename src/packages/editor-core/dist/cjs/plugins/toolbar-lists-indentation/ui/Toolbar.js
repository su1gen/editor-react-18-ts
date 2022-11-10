"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbar = Toolbar;

var _react = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _bulletList = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/bullet-list"));

var _numberList = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/number-list"));

var _indent = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/indent"));

var _outdent = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/outdent"));

var _keymaps = require("../../../keymaps");

var _ToolbarButton = _interopRequireWildcard(require("../../../ui/ToolbarButton"));

var _messages = require("../../list/messages");

var _messages2 = require("../../indentation/messages");

var _styles = require("../../../ui/styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @jsx jsx */
function Toolbar(props) {
  var _useIntl = (0, _reactIntlNext.useIntl)(),
      formatMessage = _useIntl.formatMessage;

  var disabled = props.disabled,
      isReducedSpacing = props.isReducedSpacing,
      bulletListActive = props.bulletListActive,
      bulletListDisabled = props.bulletListDisabled,
      orderedListActive = props.orderedListActive,
      orderedListDisabled = props.orderedListDisabled,
      showIndentationButtons = props.showIndentationButtons,
      indentDisabled = props.indentDisabled,
      outdentDisabled = props.outdentDisabled,
      onItemActivated = props.onItemActivated;
  var labelUnorderedList = formatMessage(_messages.messages.unorderedList);
  var labelOrderedList = formatMessage(_messages.messages.orderedList);

  var handleOnItemActivated = function handleOnItemActivated(buttonName) {
    return function (event) {
      return onItemActivated({
        editorView: props.editorView,
        buttonName: buttonName
      });
    };
  };

  return (0, _react.jsx)("span", {
    css: _styles.buttonGroupStyle
  }, (0, _react.jsx)(_ToolbarButton.default, {
    buttonId: _ToolbarButton.TOOLBAR_BUTTON.BULLET_LIST,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('bullet_list'),
    selected: bulletListActive,
    "aria-pressed": bulletListActive,
    "aria-label": labelUnorderedList,
    disabled: bulletListDisabled || disabled,
    title: (0, _react.jsx)(_keymaps.ToolTipContent, {
      description: labelUnorderedList,
      keymap: _keymaps.toggleBulletList
    }),
    iconBefore: (0, _react.jsx)(_bulletList.default, {
      label: ""
    })
  }), (0, _react.jsx)(_ToolbarButton.default, {
    buttonId: _ToolbarButton.TOOLBAR_BUTTON.ORDERED_LIST,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('ordered_list'),
    selected: orderedListActive,
    "aria-pressed": orderedListActive,
    "aria-label": labelOrderedList,
    disabled: orderedListDisabled || disabled,
    title: (0, _react.jsx)(_keymaps.ToolTipContent, {
      description: labelOrderedList,
      keymap: _keymaps.toggleOrderedList
    }),
    iconBefore: (0, _react.jsx)(_numberList.default, {
      label: ""
    })
  }), showIndentationButtons && (0, _react.jsx)(_ToolbarButton.default, {
    buttonId: _ToolbarButton.TOOLBAR_BUTTON.OUTDENT,
    testId: _ToolbarButton.TOOLBAR_BUTTON.OUTDENT,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('outdent'),
    iconBefore: (0, _react.jsx)(_outdent.default, {
      label: ""
    }),
    disabled: outdentDisabled || disabled,
    "aria-label": formatMessage(_messages2.messages.outdent),
    title: (0, _react.jsx)(_keymaps.ToolTipContent, {
      description: formatMessage(_messages2.messages.outdent),
      keymap: _keymaps.outdent
    })
  }), showIndentationButtons && (0, _react.jsx)(_ToolbarButton.default, {
    buttonId: _ToolbarButton.TOOLBAR_BUTTON.INDENT,
    testId: _ToolbarButton.TOOLBAR_BUTTON.INDENT,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('indent'),
    iconBefore: (0, _react.jsx)(_indent.default, {
      label: ""
    }),
    disabled: indentDisabled || disabled,
    "aria-label": formatMessage(_messages2.messages.indent),
    title: (0, _react.jsx)(_keymaps.ToolTipContent, {
      description: formatMessage(_messages2.messages.indent),
      keymap: _keymaps.indent
    })
  }), (0, _react.jsx)("span", {
    css: _styles.separatorStyles
  }));
}