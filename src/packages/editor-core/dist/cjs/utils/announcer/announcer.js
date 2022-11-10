"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Note: Flag 'contentRendered' resolves bug with duplicates messages (NVDA + Firefox)
// https://github.com/nvaccess/nvda/labels/bug%2Fdouble-speaking
var timer;
var Announcer = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, ref) {
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

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      contentRendered = _useState2[0],
      setContentRendered = _useState2[1];

  (0, _react.useEffect)(function () {
    clearTimeout(timer);
    setContentRendered(false);
    timer = setTimeout(function () {
      setContentRendered(true);
    }, delay);
    return function () {
      return clearTimeout(timer);
    };
  }, [text, delay]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "assistive",
    ref: ref,
    role: role,
    "aria-atomic": ariaAtomic,
    "aria-relevant": ariaRelevant,
    "aria-live": ariaLive
  }, contentRendered && /*#__PURE__*/_react.default.createElement("span", null, text));
});

var _default = /*#__PURE__*/(0, _react.memo)(Announcer);

exports.default = _default;