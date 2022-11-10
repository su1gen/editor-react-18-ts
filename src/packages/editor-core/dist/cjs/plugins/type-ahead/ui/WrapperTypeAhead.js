"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WrapperTypeAhead = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _utils = require("../utils");

var _updateQuery = require("../commands/update-query");

var _InputQuery = require("./InputQuery");

var _useLoadItems = require("./hooks/use-load-items");

var _useItemInsert3 = require("./hooks/use-item-insert");

var _useOnForceSelect = require("./hooks/use-on-force-select");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var WrapperTypeAhead = /*#__PURE__*/_react.default.memo(function (_ref) {
  var triggerHandler = _ref.triggerHandler,
      editorView = _ref.editorView,
      anchorElement = _ref.anchorElement,
      shouldFocusCursorInsideQuery = _ref.shouldFocusCursorInsideQuery,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsScrollableElement = _ref.popupsScrollableElement,
      createAnalyticsEvent = _ref.createAnalyticsEvent,
      inputMethod = _ref.inputMethod,
      getDecorationPosition = _ref.getDecorationPosition,
      reopenQuery = _ref.reopenQuery,
      onUndoRedo = _ref.onUndoRedo;

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      closed = _useState2[0],
      setClosed = _useState2[1];

  var _useState3 = (0, _react.useState)(reopenQuery || ''),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      query = _useState4[0],
      setQuery = _useState4[1];

  var queryRef = (0, _react.useRef)(query);
  var editorViewRef = (0, _react.useRef)(editorView);
  var items = (0, _useLoadItems.useLoadItems)(triggerHandler, editorView, query);
  (0, _react.useLayoutEffect)(function () {
    queryRef.current = query;
  }, [query]);

  var _useItemInsert = (0, _useItemInsert3.useItemInsert)(triggerHandler, editorView, items),
      _useItemInsert2 = (0, _slicedToArray2.default)(_useItemInsert, 2),
      onItemInsert = _useItemInsert2[0],
      onTextInsert = _useItemInsert2[1];

  var selectNextItem = (0, _react.useMemo)(function () {
    return (0, _utils.moveSelectedIndex)({
      editorView: editorView,
      direction: 'next'
    });
  }, [editorView]);
  var selectPreviousItem = (0, _react.useMemo)(function () {
    return (0, _utils.moveSelectedIndex)({
      editorView: editorView,
      direction: 'previous'
    });
  }, [editorView]);
  var cancel = (0, _react.useCallback)(function (_ref2) {
    var setSelectionAt = _ref2.setSelectionAt,
        addPrefixTrigger = _ref2.addPrefixTrigger,
        text = _ref2.text,
        forceFocusOnEditor = _ref2.forceFocusOnEditor;
    setClosed(true);
    var fullquery = addPrefixTrigger ? "".concat(triggerHandler.trigger).concat(text) : text;
    onTextInsert({
      forceFocusOnEditor: forceFocusOnEditor,
      setSelectionAt: setSelectionAt,
      text: fullquery
    });
  }, [triggerHandler, onTextInsert]);
  var insertSelectedItem = (0, _react.useCallback)(function () {
    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _typeAhead.SelectItemMode.SELECTED;
    var view = editorViewRef.current;

    var _getPluginState = (0, _utils.getPluginState)(view.state),
        selectedIndex = _getPluginState.selectedIndex;

    setClosed(true);
    queueMicrotask(function () {
      onItemInsert({
        mode: mode,
        index: selectedIndex,
        query: queryRef.current
      });
    });
  }, [onItemInsert]);
  var showTypeAheadPopupList = (0, _react.useCallback)(function () {}, []);
  var closePopup = (0, _react.useCallback)(function () {
    setClosed(true);
  }, []);
  (0, _react.useEffect)(function () {
    var view = editorViewRef.current;
    var pluginState = (0, _utils.getPluginState)(view.state);

    if (query.length === 0 || query === pluginState.query || !pluginState.triggerHandler) {
      return;
    }

    (0, _updateQuery.updateQuery)(query)(view.state, view.dispatch);
  }, [query, reopenQuery]);
  (0, _useOnForceSelect.useOnForceSelect)({
    triggerHandler: triggerHandler,
    items: items,
    query: query,
    editorView: editorView,
    closePopup: closePopup
  });

  if (closed) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_InputQuery.InputQuery, {
    triggerQueryPrefix: triggerHandler.trigger,
    onQueryChange: setQuery,
    onItemSelect: insertSelectedItem,
    selectNextItem: selectNextItem,
    selectPreviousItem: selectPreviousItem,
    onQueryFocus: showTypeAheadPopupList,
    cancel: cancel,
    forceFocus: shouldFocusCursorInsideQuery,
    onUndoRedo: onUndoRedo,
    reopenQuery: reopenQuery,
    editorView: editorView,
    items: items
  });
});

exports.WrapperTypeAhead = WrapperTypeAhead;
WrapperTypeAhead.displayName = 'WrapperTypeAhead';