import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React, { useMemo, useEffect, useLayoutEffect, useCallback, useRef, useState } from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { moveSelectedIndex, getPluginState } from '../utils';
import { updateQuery } from '../commands/update-query';
import { InputQuery } from './InputQuery';
import { useLoadItems } from './hooks/use-load-items';
import { useItemInsert } from './hooks/use-item-insert';
import { useOnForceSelect } from './hooks/use-on-force-select';
export var WrapperTypeAhead = /*#__PURE__*/React.memo(function (_ref) {
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

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      closed = _useState2[0],
      setClosed = _useState2[1];

  var _useState3 = useState(reopenQuery || ''),
      _useState4 = _slicedToArray(_useState3, 2),
      query = _useState4[0],
      setQuery = _useState4[1];

  var queryRef = useRef(query);
  var editorViewRef = useRef(editorView);
  var items = useLoadItems(triggerHandler, editorView, query);
  useLayoutEffect(function () {
    queryRef.current = query;
  }, [query]);

  var _useItemInsert = useItemInsert(triggerHandler, editorView, items),
      _useItemInsert2 = _slicedToArray(_useItemInsert, 2),
      onItemInsert = _useItemInsert2[0],
      onTextInsert = _useItemInsert2[1];

  var selectNextItem = useMemo(function () {
    return moveSelectedIndex({
      editorView: editorView,
      direction: 'next'
    });
  }, [editorView]);
  var selectPreviousItem = useMemo(function () {
    return moveSelectedIndex({
      editorView: editorView,
      direction: 'previous'
    });
  }, [editorView]);
  var cancel = useCallback(function (_ref2) {
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
  var insertSelectedItem = useCallback(function () {
    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SelectItemMode.SELECTED;
    var view = editorViewRef.current;

    var _getPluginState = getPluginState(view.state),
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
  var showTypeAheadPopupList = useCallback(function () {}, []);
  var closePopup = useCallback(function () {
    setClosed(true);
  }, []);
  useEffect(function () {
    var view = editorViewRef.current;
    var pluginState = getPluginState(view.state);

    if (query.length === 0 || query === pluginState.query || !pluginState.triggerHandler) {
      return;
    }

    updateQuery(query)(view.state, view.dispatch);
  }, [query, reopenQuery]);
  useOnForceSelect({
    triggerHandler: triggerHandler,
    items: items,
    query: query,
    editorView: editorView,
    closePopup: closePopup
  });

  if (closed) {
    return null;
  }

  return /*#__PURE__*/React.createElement(InputQuery, {
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
WrapperTypeAhead.displayName = 'WrapperTypeAhead';