import React, { forwardRef, memo, useState, useEffect } from 'react'; // How to use:
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Preferring_specialized_live_region_roles
// Demo: https://dequeuniversity.com/library/aria/liveregion-playground
// Important: Strongly recommend test your solution in all supported screen readers
// if you use non default value of properties: ariaAtomic, ariaLive, ariaRelevant, role
// Note: Text won't be announced if the text message doesn't change after the render.
// For using a forced announcement in this case, set the 'key' attribute - key={Date.now()}

// Note: Flag 'contentRendered' resolves bug with duplicates messages (NVDA + Firefox)
// https://github.com/nvaccess/nvda/labels/bug%2Fdouble-speaking
let timer;
const Announcer = /*#__PURE__*/forwardRef(({
  ariaAtomic = 'true',
  ariaLive = 'polite',
  ariaRelevant = 'all',
  role = 'status',
  text = '',
  delay = 0
}, ref) => {
  const [contentRendered, setContentRendered] = useState(false);
  useEffect(() => {
    clearTimeout(timer);
    setContentRendered(false);
    timer = setTimeout(() => {
      setContentRendered(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);
  return /*#__PURE__*/React.createElement("div", {
    className: "assistive",
    ref: ref,
    role: role,
    "aria-atomic": ariaAtomic,
    "aria-relevant": ariaRelevant,
    "aria-live": ariaLive
  }, contentRendered && /*#__PURE__*/React.createElement("span", null, text));
});
export default /*#__PURE__*/memo(Announcer);