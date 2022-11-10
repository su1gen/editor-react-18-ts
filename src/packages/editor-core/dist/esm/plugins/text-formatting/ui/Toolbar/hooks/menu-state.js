import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useCallback, useState } from 'react';
export var useMenuState = function useMenuState() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isMenuOpen = _useState2[0],
      setIsMenuOpened = _useState2[1];

  var toggleMenu = useCallback(function () {
    setIsMenuOpened(!isMenuOpen);
  }, [isMenuOpen]);
  var closeMenu = useCallback(function () {
    setIsMenuOpened(false);
  }, []);
  return [isMenuOpen, toggleMenu, closeMenu];
};