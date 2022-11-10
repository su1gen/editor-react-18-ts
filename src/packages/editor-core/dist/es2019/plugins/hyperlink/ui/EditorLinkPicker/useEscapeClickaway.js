import { useEffect, useRef } from 'react';
export const useEscapeClickaway = (onEscape, onClickAway) => {
  const ref = useRef(null);
  useEffect(() => {
    const handleClickAway = event => {
      const el = ref.current;

      if (event.target instanceof Element && el && !el.contains(event.target)) {
        onClickAway();
      }
    };

    const handleKeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscape();
      }
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClickAway, onEscape]);
  return ref;
};