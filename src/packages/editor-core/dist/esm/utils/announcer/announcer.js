import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React, { forwardRef, memo, useState, useEffect } from 'react'; // How to use:
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#Preferring_specialized_live_region_roles
// Demo: https://dequeuniversity.com/library/aria/liveregion-playground
// Important: Strongly recommend test your solution in all supported screen readers
// if you use non default value of properties: ariaAtomic, ariaLive, ariaRelevant, role
// Note: Text won't be announced if the text message doesn't change after the render.
// For using a forced announcement in this case, set the 'key' attribute - key={Date.now()}

// Note: Flag 'contentRendered' resolves bug with duplicates messages (NVDA + Firefox)
// https://github.com/nvaccess/nvda/labels/bug%2Fdouble-speaking
var timer;
var Announcer = /*#__PURE__*/forwardRef(function (_ref, ref) {
  var _ref$ariaAtomic = _ref.ariaAtomic,
      ariaAtomic = _ref$ariaAtomic === void 0 ? 'true' : _ref$ariaAtomic,
      _ref$ariaLive = _ref.ariaLive,
      ariaLive = _ref$ariaLive === void 0 ? 'polite' : _ref$ariaLive,
      _ref$ariaRelevant = _ref.ariaRelevant,
      ariaRelevant = _ref$ariaRelevant === void 0 ? 'all' : _ref$ariaRelevant,
      _ref$role = _ref.role,
      role = _ref$role === void 0 ? 'status' : _ref$role,
      _ref$text = _ref.text,
      text = _ref$text === void 0 ? '' : _ref$text,
      _ref$delay = _ref.delay,
      delay = _ref$delay === void 0 ? 0 : _ref$delay;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      contentRendered = _useState2[0],
      setContentRendered = _useState2[1];

  useEffect(function () {
    clearTimeout(timer);
    setContentRendered(false);
    timer = setTimeout(function () {
      setContentRendered(true);
    }, delay);
    return function () {
      return clearTimeout(timer);
    };
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