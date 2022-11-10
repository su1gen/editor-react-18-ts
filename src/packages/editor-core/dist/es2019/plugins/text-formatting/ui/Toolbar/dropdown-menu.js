import React, { useCallback, useMemo } from 'react';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { useMenuState } from './hooks/menu-state';
import { MoreButton } from './more-button';
export const FormattingTextDropdownMenu = /*#__PURE__*/React.memo(({
  editorView,
  moreButtonLabel,
  isReducedSpacing,
  items,
  hasFormattingActive,
  popupsBoundariesElement,
  popupsMountPoint,
  popupsScrollableElement
}) => {
  const [isMenuOpen, toggleMenu, closeMenu] = useMenuState();
  const group = useMemo(() => [{
    items
  }], [items]);
  const onItemActivated = useCallback(({
    item
  }) => {
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