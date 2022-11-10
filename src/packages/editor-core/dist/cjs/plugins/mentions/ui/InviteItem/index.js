"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.INVITE_ITEM_MIN_HEIGHT = exports.INVITE_ITEM_DESCRIPTION = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = require("@emotion/react");

var _add = _interopRequireDefault(require("@atlaskit/icon/glyph/add"));

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _react2 = _interopRequireWildcard(require("react"));

var _reactIntlNext = require("react-intl-next");

var _styles = require("./styles");

var _messages = require("../../messages");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @jsx jsx */
var INVITE_ITEM_MIN_HEIGHT = _styles.AVATAR_HEIGHT + _styles.ROW_SIDE_PADDING * 2;
exports.INVITE_ITEM_MIN_HEIGHT = INVITE_ITEM_MIN_HEIGHT;
var INVITE_ITEM_DESCRIPTION = {
  id: 'invite-teammate'
};
exports.INVITE_ITEM_DESCRIPTION = INVITE_ITEM_DESCRIPTION;

var leftClick = function leftClick(event) {
  return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
};

var InviteItem = function InviteItem(_ref) {
  var productName = _ref.productName,
      onMount = _ref.onMount,
      onMouseEnter = _ref.onMouseEnter,
      onSelection = _ref.onSelection,
      selected = _ref.selected,
      userRole = _ref.userRole,
      intl = _ref.intl;
  var onSelected = (0, _react2.useCallback)(function (event) {
    if (leftClick(event) && onSelection) {
      event.preventDefault();
      onSelection(INVITE_ITEM_DESCRIPTION, event);
    }
  }, [onSelection]);
  var onItemMouseEnter = (0, _react2.useCallback)(function (event) {
    if (onMouseEnter) {
      onMouseEnter(INVITE_ITEM_DESCRIPTION, event);
    }
  }, [onMouseEnter]);
  (0, _react2.useEffect)(function () {
    if (onMount) {
      onMount();
    }
  }, [onMount]);
  return (0, _react.jsx)("div", {
    css: [_styles.mentionItemStyle, selected && _styles.mentionItemSelectedStyle],
    onMouseDown: onSelected,
    onMouseEnter: onItemMouseEnter,
    "data-id": INVITE_ITEM_DESCRIPTION.id
  }, (0, _react.jsx)("div", {
    css: _styles.rowStyle
  }, (0, _react.jsx)("span", {
    css: _styles.avatarStyle
  }, (0, _react.jsx)(_add.default, {
    label: intl.formatMessage(_messages.messages.mentionsAddLabel),
    primaryColor: (0, _tokens.token)('color.icon.subtle', _colors.N300)
  })), (0, _react.jsx)("div", {
    css: _styles.nameSectionStyle,
    "data-testid": "name-section"
  }, (0, _react.jsx)(_reactIntlNext.FormattedMessage, (0, _extends2.default)({}, _messages.messages.inviteItemTitle, {
    values: {
      userRole: userRole || 'basic',
      productName: (0, _react.jsx)("span", {
        css: _styles.capitalizedStyle,
        "data-testid": "capitalized-message"
      }, productName)
    }
  })))));
};

var _default = (0, _reactIntlNext.injectIntl)(InviteItem);

exports.default = _default;