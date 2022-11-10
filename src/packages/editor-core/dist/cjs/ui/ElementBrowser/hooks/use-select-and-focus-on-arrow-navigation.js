"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureSafeIndex = exports.default = exports.ACTIONS = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("react");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var ACTIONS;
exports.ACTIONS = ACTIONS;

(function (ACTIONS) {
  ACTIONS["FOCUS_SEARCH"] = "focusOnSearch";
  ACTIONS["UPDATE_STATE"] = "updateState";
  ACTIONS["MOVE"] = "move";
})(ACTIONS || (exports.ACTIONS = ACTIONS = {}));

var reducer = function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_STATE:
      return _objectSpread(_objectSpread({}, state), action.payload);

    case ACTIONS.FOCUS_SEARCH:
      return _objectSpread(_objectSpread({}, state), {}, {
        focusedItemIndex: undefined,
        focusOnSearch: true
      });

    case ACTIONS.MOVE:
      return moveReducer(state, action);
  }

  return state;
};

var moveReducer = function moveReducer(state, action) {
  var newIndex = state.selectedItemIndex + action.payload.positions; // The step payload is only sent for up arrow.
  // When user presses up arrow on first row, focus on search bar.

  if (action.payload.step && state.selectedItemIndex < action.payload.step) {
    return _objectSpread(_objectSpread({}, state), {}, {
      focusOnSearch: true,
      focusedItemIndex: undefined
    });
  }

  if (newIndex < 0) {
    return state;
  } // Set focus position to first item when moving forward or backward from searchbar


  if (state.focusedItemIndex == null || state.focusOnSearch) {
    return _objectSpread(_objectSpread({}, state), {}, {
      focusOnSearch: false,
      focusedItemIndex: 0,
      selectedItemIndex: 0
    });
  }

  var safeIndex = ensureSafeIndex(newIndex, state.listSize);
  return _objectSpread(_objectSpread({}, state), {}, {
    focusedItemIndex: safeIndex,
    selectedItemIndex: safeIndex
  });
};

var initialState = {
  focusOnSearch: true,
  selectedItemIndex: 0,
  focusedItemIndex: undefined,
  listSize: 0
};

var getInitialState = function getInitialState(listSize) {
  return function (initialState) {
    return _objectSpread(_objectSpread({}, initialState), {}, {
      listSize: listSize
    });
  };
};

function useSelectAndFocusOnArrowNavigation(listSize, step) {
  var _useReducer = (0, _react.useReducer)(reducer, initialState, getInitialState(listSize)),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var selectedItemIndex = state.selectedItemIndex,
      focusedItemIndex = state.focusedItemIndex,
      focusOnSearch = state.focusOnSearch;
  var reset = (0, _react.useCallback)(function (listSize) {
    var payload = _objectSpread(_objectSpread({}, initialState), {}, {
      listSize: listSize
    });

    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload: payload
    });
  }, []);
  var removeFocusFromSearchAndSetOnItem = (0, _react.useCallback)(function (index) {
    var payload = {
      focusedItemIndex: index,
      selectedItemIndex: index,
      focusOnSearch: false
    };
    dispatch({
      type: ACTIONS.UPDATE_STATE,
      payload: payload
    });
  }, [dispatch]);
  var setFocusOnSearch = (0, _react.useCallback)(function () {
    dispatch({
      type: ACTIONS.FOCUS_SEARCH,
      payload: {}
    });
  }, [dispatch]);
  var isMoving = (0, _react.useRef)(false);
  var move = (0, _react.useCallback)(function (e, positions, actualStep) {
    e.preventDefault();
    e.stopPropagation(); // avoid firing 2 moves at the same time when holding an arrow down as this can freeze the screen

    if (!isMoving.current) {
      isMoving.current = true;
      requestAnimationFrame(function () {
        isMoving.current = false;
        dispatch({
          type: ACTIONS.MOVE,
          payload: {
            positions: positions,
            step: actualStep
          }
        });
      });
    }
  }, []);
  var onKeyDown = (0, _react.useCallback)(function (e) {
    var avoidKeysWhileSearching = ['/', // While already focused on search bar, let users type in.
    'ArrowRight', 'ArrowLeft', 'ArrowUp'];

    if (focusOnSearch && avoidKeysWhileSearching.includes(e.key)) {
      return;
    }

    switch (e.key) {
      case '/':
        e.preventDefault();
        e.stopPropagation();
        return setFocusOnSearch();

      case 'ArrowRight':
        return move(e, +1);

      case 'ArrowLeft':
        return move(e, -1);

      case 'ArrowDown':
        return move(e, +step);

      case 'ArrowUp':
        return move(e, -step, step);
    }
  }, [focusOnSearch, setFocusOnSearch, move, step]);
  (0, _react.useEffect)(function () {
    // To reset selection when user filters
    reset(listSize);
  }, [listSize, reset]);
  return {
    selectedItemIndex: selectedItemIndex,
    onKeyDown: onKeyDown,
    focusOnSearch: focusOnSearch,
    setFocusOnSearch: setFocusOnSearch,
    focusedItemIndex: focusedItemIndex,
    setFocusedItemIndex: removeFocusFromSearchAndSetOnItem
  };
}

var ensureSafeIndex = function ensureSafeIndex(index, listSize) {
  if (index < 0) {
    return 0;
  }

  if (index > listSize) {
    return listSize;
  }

  return index;
};

exports.ensureSafeIndex = ensureSafeIndex;
var _default = useSelectAndFocusOnArrowNavigation;
exports.default = _default;