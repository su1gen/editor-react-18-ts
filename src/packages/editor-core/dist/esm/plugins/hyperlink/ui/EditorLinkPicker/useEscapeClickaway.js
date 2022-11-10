import { useEffect, useRef } from 'react';
export var useEscapeClickaway = function useEscapeClickaway(onEscape, onClickAway) {
  var ref = useRef(null);
  useEffect(function () {
    var handleClickAway = function handleClickAway(event) {
      var el = ref.current;

      if (event.target instanceof Element && el && !el.contains(event.target)) {
        onClickAway();
      }
    };

    var handleKeydown = function handleKeydown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('keydown', handleKeydown);
    return function () {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClickAway, onEscape]);
  return ref;
};