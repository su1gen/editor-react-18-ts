import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React, { useCallback, useMemo } from 'react';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { useMenuState } from './hooks/menu-state';
import { MoreButton } from './more-button';
export var FormattingTextDropdownMenu = /*#__PURE__*/React.memo(function (_ref) {
  var editorView = _ref.editorView,
      moreButtonLabel = _ref.moreButtonLabel,
      isReducedSpacing = _ref.isReducedSpacing,
      items = _ref.items,
      hasFormattingActive = _ref.hasFormattingActive,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsScrollableElement = _ref.popupsScrollableElement;

  var _useMenuState = useMenuState(),
      _useMenuState2 = _slicedToArray(_useMenuState, 3),
      isMenuOpen = _useMenuState2[0],
      toggleMenu = _useMenuState2[1],
      closeMenu = _useMenuState2[2];

  var group = useMemo(function () {
    return [{
      items: items
    }];
  }, [items]);
  var onItemActivated = useCallback(function (_ref2) {
    var item = _ref2.item;
    item.command(editorView.state, editorView.dispatch);
    closeMenu();
  }, [editorView.state, editorView.dispatch, closeMenu]);
  return /*#__PURE__*/React.createElement(DropdownMenu, {
    mountTo: popupsMountPoint,
    onOpenChange: closeMenu,
    boundariesElement: popupsBoundariesElement,
    scrollableElement: popupsScrollableElement,
    onItemActivated: onItemActivated,
    isOpen: isMenuOpen,
    items: group,
    zIndex: akEditorMenuZIndex,
    fitHeight: 188,
    fitWidth: 136,
    shouldUseDefaultRole: true
  }, /*#__PURE__*/React.createElement(MoreButton, {
    isSelected: isMenuOpen || hasFormattingActive,
    label: moreButtonLabel,
    isReducedSpacing: isReducedSpacing,
    isDisabled: false,
    onClick: toggleMenu,
    "aria-expanded": isMenuOpen
  }));
});