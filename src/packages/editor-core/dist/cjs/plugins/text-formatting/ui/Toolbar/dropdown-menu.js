"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormattingTextDropdownMenu = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _DropdownMenu = _interopRequireDefault(require("../../../../ui/DropdownMenu"));

var _menuState = require("./hooks/menu-state");

var _moreButton = require("./more-button");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FormattingTextDropdownMenu = /*#__PURE__*/_react.default.memo(function (_ref) {
  var editorView = _ref.editorView,
      moreButtonLabel = _ref.moreButtonLabel,
      isReducedSpacing = _ref.isReducedSpacing,
      items = _ref.items,
      hasFormattingActive = _ref.hasFormattingActive,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsScrollableElement = _ref.popupsScrollableElement;

  var _useMenuState = (0, _menuState.useMenuState)(),
      _useMenuState2 = (0, _slicedToArray2.default)(_useMenuState, 3),
      isMenuOpen = _useMenuState2[0],
      toggleMenu = _useMenuState2[1],
      closeMenu = _useMenuState2[2];

  var group = (0, _react.useMemo)(function () {
    return [{
      items: items
    }];
  }, [items]);
  var onItemActivated = (0, _react.useCallback)(function (_ref2) {
    var item = _ref2.item;
    item.command(editorView.state, editorView.dispatch);
    closeMenu();
  }, [editorView.state, editorView.dispatch, closeMenu]);
  return /*#__PURE__*/_react.default.createElement(_DropdownMenu.default, {
    mountTo: popupsMountPoint,
    onOpenChange: closeMenu,
    boundariesElement: popupsBoundariesElement,
    scrollableElement: popupsScrollableElement,
    onItemActivated: onItemActivated,
    isOpen: isMenuOpen,
    items: group,
    zIndex: _editorSharedStyles.akEditorMenuZIndex,
    fitHeight: 188,
    fitWidth: 136,
    shouldUseDefaultRole: true
  }, /*#__PURE__*/_react.default.createElement(_moreButton.MoreButton, {
    isSelected: isMenuOpen || hasFormattingActive,
    label: moreButtonLabel,
    isReducedSpacing: isReducedSpacing,
    isDisabled: false,
    onClick: toggleMenu,
    "aria-expanded": isMenuOpen
  }));
});

exports.FormattingTextDropdownMenu = FormattingTextDropdownMenu;