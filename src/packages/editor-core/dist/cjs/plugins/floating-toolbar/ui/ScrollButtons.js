"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _constants = require("@atlaskit/theme/constants");

var _chevronLeftLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-left-large"));

var _chevronRightLarge = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-right-large"));

var _Button = _interopRequireDefault(require("./Button"));

var _messages = _interopRequireDefault(require("./messages"));

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var akGridSize = (0, _constants.gridSize)();
var toolbarScrollButtons = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-gap: ", "px;\n  padding: ", "px ", "px;\n  border-left: solid ", " 1px;\n  flex-shrink: 0;\n  align-items: center;\n"])), akGridSize / 2, akGridSize / 2, akGridSize, (0, _tokens.token)('color.border', _colors.N30));
var LeftIcon = _chevronLeftLarge.default;
var RightIcon = _chevronRightLarge.default;

var _default = function _default(_ref) {
  var _scrollContainerRef$c, _scrollContainerRef$c2;

  var intl = _ref.intl,
      scrollContainerRef = _ref.scrollContainerRef,
      node = _ref.node,
      disabled = _ref.disabled;
  var buttonsContainerRef = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      needScroll = _useState2[0],
      setNeedScroll = _useState2[1];

  var _useState3 = (0, _react.useState)(true),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      canScrollLeft = _useState4[0],
      setCanScrollLeft = _useState4[1];

  var _useState5 = (0, _react.useState)(true),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      canScrollRight = _useState6[0],
      setCanScrollRight = _useState6[1];

  var items = Array.from(((_scrollContainerRef$c = scrollContainerRef.current) === null || _scrollContainerRef$c === void 0 ? void 0 : (_scrollContainerRef$c2 = _scrollContainerRef$c.firstChild) === null || _scrollContainerRef$c2 === void 0 ? void 0 : _scrollContainerRef$c2.childNodes) || {});
  var scheduledSetCanScroll = (0, _rafSchd.default)(function () {
    var _ref2 = scrollContainerRef.current,
        scrollLeft = _ref2.scrollLeft,
        scrollWidth = _ref2.scrollWidth,
        offsetWidth = _ref2.offsetWidth;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + offsetWidth < scrollWidth - 1); // -1 to account for half pixel
  });

  var onScroll = function onScroll() {
    return scheduledSetCanScroll();
  };

  var scrollLeft = function scrollLeft() {
    // find the first item partially visible
    var _iterator = _createForOfIteratorHelper(items.reverse().entries()),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _scrollContainerRef$c3;

        var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
            itemIndex = _step$value[0],
            item = _step$value[1];

        var _item$getBoundingClie = item.getBoundingClientRect(),
            itemLeft = _item$getBoundingClie.left,
            itemWidth = _item$getBoundingClie.width;

        var _ref3 = ((_scrollContainerRef$c3 = scrollContainerRef.current) === null || _scrollContainerRef$c3 === void 0 ? void 0 : _scrollContainerRef$c3.getBoundingClientRect()) || {},
            _ref3$left = _ref3.left,
            scrollContainerLeft = _ref3$left === void 0 ? 0 : _ref3$left,
            _ref3$width = _ref3.width,
            scrollContainerWidth = _ref3$width === void 0 ? 0 : _ref3$width; // if item is partially visible on the left, scroll to it so it became the last item visible


        if (itemLeft <= scrollContainerLeft) {
          var _scrollContainerRef$c4, _scrollContainerRef$c5;

          var gap = scrollContainerWidth - itemWidth;
          var scrollTo = item.offsetLeft - gap; // if scrollTo is same as current scrollLeft

          if (Math.floor(scrollTo) === Math.floor((scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : (_scrollContainerRef$c4 = scrollContainerRef.current) === null || _scrollContainerRef$c4 === void 0 ? void 0 : _scrollContainerRef$c4.scrollLeft) || 0)) {
            // if this is the first item, scroll to the beginning, otherwise find next item to scroll to
            if (itemIndex === items.length - 1) {
              scrollTo = 0;
            } else {
              continue;
            }
          }

          scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : (_scrollContainerRef$c5 = scrollContainerRef.current) === null || _scrollContainerRef$c5 === void 0 ? void 0 : _scrollContainerRef$c5.scrollTo({
            top: 0,
            left: scrollTo,
            behavior: 'smooth'
          });
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };

  var scrollRight = function scrollRight() {
    // find the last item partially visible
    var _iterator2 = _createForOfIteratorHelper(items),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _scrollContainerRef$c6;

        var item = _step2.value;

        var _item$getBoundingClie2 = item.getBoundingClientRect(),
            itemLeft = _item$getBoundingClie2.left,
            itemWidth = _item$getBoundingClie2.width;

        var _ref4 = ((_scrollContainerRef$c6 = scrollContainerRef.current) === null || _scrollContainerRef$c6 === void 0 ? void 0 : _scrollContainerRef$c6.getBoundingClientRect()) || {},
            _ref4$left = _ref4.left,
            scrollContainerLeft = _ref4$left === void 0 ? 0 : _ref4$left,
            _ref4$width = _ref4.width,
            scrollContainerWidth = _ref4$width === void 0 ? 0 : _ref4$width; // if item is partially visible on the right


        if (itemLeft + itemWidth >= scrollContainerLeft + scrollContainerWidth) {
          var _scrollContainerRef$c7, _scrollContainerRef$c8, _scrollContainerRef$c9;

          var scrollTo = item.offsetLeft; // if the item is longer than the entire container width, just scroll past it

          if (itemWidth >= scrollContainerWidth && (((_scrollContainerRef$c7 = scrollContainerRef.current) === null || _scrollContainerRef$c7 === void 0 ? void 0 : _scrollContainerRef$c7.scrollLeft) || 0) >= itemLeft - 1) {
            scrollTo = item.offsetLeft + item.offsetWidth;
          } // if scrollTo is same as current scrollLeft, find next item to scroll to


          if (Math.floor(scrollTo) === Math.floor((scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : (_scrollContainerRef$c8 = scrollContainerRef.current) === null || _scrollContainerRef$c8 === void 0 ? void 0 : _scrollContainerRef$c8.scrollLeft) || 0)) {
            continue;
          }

          (_scrollContainerRef$c9 = scrollContainerRef.current) === null || _scrollContainerRef$c9 === void 0 ? void 0 : _scrollContainerRef$c9.scrollTo({
            top: 0,
            left: scrollTo,
            behavior: 'smooth'
          });
          break;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  };

  var resizeObserver = new ResizeObserver(function (t) {
    var _scrollContainerRef$c10, _scrollContainerRef$c11, _scrollContainerRef$c12;

    var widthNeededToShowAllItems = ((_scrollContainerRef$c10 = scrollContainerRef.current) === null || _scrollContainerRef$c10 === void 0 ? void 0 : _scrollContainerRef$c10.scrollWidth) || 0;
    var availableSpace = (_scrollContainerRef$c11 = scrollContainerRef.current) === null || _scrollContainerRef$c11 === void 0 ? void 0 : (_scrollContainerRef$c12 = _scrollContainerRef$c11.parentNode) === null || _scrollContainerRef$c12 === void 0 ? void 0 : _scrollContainerRef$c12.offsetWidth;

    if (availableSpace >= widthNeededToShowAllItems) {
      setNeedScroll(false);
    } else {
      setNeedScroll(true);
      onScroll();
    }
  });
  (0, _react.useEffect)(function () {
    var scrollContainerRefCurrent = scrollContainerRef.current;
    onScroll();

    if (scrollContainerRefCurrent) {
      // enable/disable scroll buttons depending on scroll position
      scrollContainerRefCurrent.addEventListener('scroll', onScroll); // watch for toolbar resize and show/hide scroll buttons if needed

      resizeObserver.observe(scrollContainerRefCurrent); // reset scroll position when switching from one node with toolbar to another

      scrollContainerRefCurrent.scrollTo({
        left: 0
      });
    }

    return function () {
      if (scrollContainerRefCurrent) {
        scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
        resizeObserver.unobserve(scrollContainerRefCurrent);
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, scrollContainerRef]);
  return needScroll ? (0, _react2.jsx)("div", {
    ref: buttonsContainerRef,
    css: toolbarScrollButtons
  }, (0, _react2.jsx)(_Button.default, {
    title: intl.formatMessage(_messages.default.floatingToolbarScrollLeft),
    icon: (0, _react2.jsx)(LeftIcon, {
      label: intl.formatMessage(_messages.default.floatingToolbarScrollLeft)
    }),
    onClick: scrollLeft,
    disabled: !canScrollLeft || disabled
  }), (0, _react2.jsx)(_Button.default, {
    title: intl.formatMessage(_messages.default.floatingToolbarScrollRight),
    icon: (0, _react2.jsx)(RightIcon, {
      label: intl.formatMessage(_messages.default.floatingToolbarScrollRight)
    }),
    onClick: scrollRight,
    disabled: !canScrollRight || disabled
  })) : null;
};

exports.default = _default;