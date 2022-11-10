"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeAheadPopup = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _ui = require("@atlaskit/editor-common/ui");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _analytics = require("../../analytics");

var _constants2 = require("../constants");

var _TypeAheadList = require("./TypeAheadList");

var _TypeAheadListItem = require("./TypeAheadListItem");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DEFAULT_TYPEAHEAD_MENU_HEIGHT = 380;
var typeAheadContent = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  padding: ", "px 0;\n  width: 320px;\n  max-height: 380px; /* ~5.5 visibile items */\n  overflow-y: auto;\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n  position: relative;\n"])), (0, _tokens.token)('elevation.surface.overlay', _colors.N0), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 0 1px ".concat(_colors.N60A, ", 0 4px 8px -2px ").concat(_colors.N50A)), (0, _constants.gridSize)() / 2);

var Highlight = function Highlight(_ref) {
  var state = _ref.state,
      triggerHandler = _ref.triggerHandler;

  if (!(triggerHandler !== null && triggerHandler !== void 0 && triggerHandler.getHighlight)) {
    return null;
  }

  var highlight = triggerHandler.getHighlight(state);
  return highlight;
};

var OFFSET = [0, 8];

var TypeAheadPopup = /*#__PURE__*/_react.default.memo(function (props) {
  var editorView = props.editorView,
      triggerHandler = props.triggerHandler,
      anchorElement = props.anchorElement,
      popupsMountPoint = props.popupsMountPoint,
      popupsBoundariesElement = props.popupsBoundariesElement,
      popupsScrollableElement = props.popupsScrollableElement,
      items = props.items,
      selectedIndex = props.selectedIndex,
      onItemInsert = props.onItemInsert,
      fireAnalyticsCallback = props.fireAnalyticsCallback,
      isEmptyQuery = props.isEmptyQuery;
  var startTime = (0, _react.useMemo)(function () {
    return performance.now();
  }, // In case those props changes
  // we need to recreate the startTime
  [items, isEmptyQuery, fireAnalyticsCallback, triggerHandler] // eslint-disable-line react-hooks/exhaustive-deps
  );
  (0, _react.useEffect)(function () {
    if (!fireAnalyticsCallback) {
      return;
    }

    var stopTime = performance.now();
    var time = stopTime - startTime;
    fireAnalyticsCallback({
      payload: {
        action: _analytics.ACTION.RENDERED,
        actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          time: time,
          items: items.length,
          initial: isEmptyQuery
        }
      }
    });
  }, [startTime, items, fireAnalyticsCallback, isEmptyQuery, // In case the current triggerHandler changes
  // e.g: Inserting a mention using the quick insert
  // we need to send the event again
  // eslint-disable-next-line react-hooks/exhaustive-deps
  triggerHandler]);
  (0, _react.useEffect)(function () {
    if (!fireAnalyticsCallback) {
      return;
    }

    fireAnalyticsCallback({
      payload: {
        action: _analytics.ACTION.VIEWED,
        actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD_ITEM,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          index: selectedIndex,
          items: items.length
        }
      }
    });
  }, [items, fireAnalyticsCallback, selectedIndex, // In case the current triggerHandler changes
  // e.g: Inserting a mention using the quick insert
  // we need to send the event again
  // eslint-disable-next-line react-hooks/exhaustive-deps
  triggerHandler]);

  var _useState = (0, _react.useState)(DEFAULT_TYPEAHEAD_MENU_HEIGHT),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      fitHeight = _useState2[0],
      setFitHeight = _useState2[1];

  var getFitHeight = (0, _react.useCallback)(function () {
    if (!anchorElement || !popupsMountPoint) {
      return;
    }

    var target = anchorElement;

    var _target$getBoundingCl = target.getBoundingClientRect(),
        targetTop = _target$getBoundingCl.top,
        targetHeight = _target$getBoundingCl.height;

    var boundariesElement = document.body;

    var _boundariesElement$ge = boundariesElement.getBoundingClientRect(),
        boundariesHeight = _boundariesElement$ge.height,
        boundariesTop = _boundariesElement$ge.top; // Calculating the space above and space below our decoration


    var spaceAbove = targetTop - (boundariesTop - boundariesElement.scrollTop);
    var spaceBelow = boundariesTop + boundariesHeight - (targetTop + targetHeight); // Keep default height if more than enough space

    if (spaceBelow >= DEFAULT_TYPEAHEAD_MENU_HEIGHT) {
      return setFitHeight(DEFAULT_TYPEAHEAD_MENU_HEIGHT);
    } // Determines whether typeahead will fit above or below decoration
    // and return the space available.


    var newFitHeight = spaceBelow >= spaceAbove ? spaceBelow : spaceAbove; // Each typeahead item has some padding
    // We want to leave some space at the top so first item
    // is not partially cropped

    var fitHeightWithSpace = newFitHeight - _TypeAheadListItem.ITEM_PADDING * 2; // Ensure typeahead height is max its default height

    var minFitHeight = Math.min(DEFAULT_TYPEAHEAD_MENU_HEIGHT, fitHeightWithSpace);
    return setFitHeight(minFitHeight);
  }, [anchorElement, popupsMountPoint]);
  var getFitHeightDebounced = (0, _rafSchd.default)(getFitHeight);
  (0, _react.useLayoutEffect)(function () {
    var scrollableElement = popupsScrollableElement || (0, _ui.findOverflowScrollParent)(anchorElement);
    getFitHeight();
    window.addEventListener('resize', getFitHeightDebounced);

    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', getFitHeightDebounced);
    }

    return function () {
      window.removeEventListener('resize', getFitHeightDebounced);

      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', getFitHeightDebounced);
      }
    };
  }, [anchorElement, popupsScrollableElement, getFitHeightDebounced, getFitHeight]);
  return (0, _react2.jsx)(_ui.Popup, {
    zIndex: _editorSharedStyles.akEditorFloatingDialogZIndex,
    target: anchorElement,
    mountTo: popupsMountPoint,
    boundariesElement: popupsBoundariesElement,
    scrollableElement: popupsScrollableElement,
    fitHeight: fitHeight,
    fitWidth: 340,
    offset: OFFSET
  }, (0, _react2.jsx)("div", {
    css: typeAheadContent,
    tabIndex: 0,
    className: _constants2.TYPE_AHEAD_POPUP_CONTENT_CLASS
  }, (0, _react2.jsx)(Highlight, {
    state: editorView.state,
    triggerHandler: triggerHandler
  }), (0, _react2.jsx)(_TypeAheadList.TypeAheadList, {
    items: items,
    selectedIndex: selectedIndex,
    onItemClick: onItemInsert,
    fitHeight: fitHeight,
    editorView: editorView,
    decorationElement: anchorElement
  })));
});

exports.TypeAheadPopup = TypeAheadPopup;
TypeAheadPopup.displayName = 'TypeAheadPopup';