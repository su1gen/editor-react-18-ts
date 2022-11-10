"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorView = require("prosemirror-view");

var _steps = require("@atlaskit/adf-schema/steps");

var _actions = require("./actions");

var _key = require("./key");

var _enums = require("../../analytics/types/enums");

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var shouldForceOpen = function shouldForceOpen(step) {
  if (!(step instanceof _steps.InsertTypeAheadStep)) {
    return false;
  }

  var isDeletionRawQueryOperation = step.isInsertionStep() && step.stage === _steps.InsertTypeAheadStages.DELETING_RAW_QUERY;

  var isUndoingInsertionItem = step.isUndoingStep() && step.stage === _steps.InsertTypeAheadStages.INSERTING_ITEM;

  return isDeletionRawQueryOperation || isUndoingInsertionItem;
};

var shouldForceClose = function shouldForceClose(step) {
  if (!(step instanceof _steps.InsertTypeAheadStep)) {
    return false;
  }

  var isInsertingItem = step.isInsertionStep() && step.stage === _steps.InsertTypeAheadStages.INSERTING_ITEM;

  var isUndoingDeletionRawQuery = step.isUndoingStep() && step.stage === _steps.InsertTypeAheadStages.DELETING_RAW_QUERY;

  return isInsertingItem || isUndoingDeletionRawQuery;
};

var createFindHandler = function createFindHandler(typeAheadHandlers) {
  return function (step) {
    if (!(step instanceof _steps.InsertTypeAheadStep)) {
      return null;
    }

    var handler = typeAheadHandlers.find(function (h) {
      return h.trigger === step.trigger;
    });
    return handler || null;
  };
};

var createReducer = function createReducer(_ref) {
  var typeAheadHandlers = _ref.typeAheadHandlers,
      removeDecorations = _ref.removeDecorations,
      createDecorations = _ref.createDecorations;
  var findHandler = createFindHandler(typeAheadHandlers);

  var openMenu = function openMenu(currentPluginState, _ref2) {
    var tr = _ref2.tr,
        triggerHandler = _ref2.triggerHandler,
        inputMethod = _ref2.inputMethod,
        reopenQuery = _ref2.reopenQuery,
        selectedIndex = _ref2.selectedIndex;
    removeDecorations(currentPluginState.decorationSet);

    var _createDecorations = createDecorations(tr, {
      triggerHandler: triggerHandler,
      inputMethod: inputMethod,
      reopenQuery: reopenQuery
    }),
        decorationSet = _createDecorations.decorationSet,
        decorationElement = _createDecorations.decorationElement,
        stats = _createDecorations.stats;

    return _objectSpread(_objectSpread({}, currentPluginState), {}, {
      stats: stats,
      decorationSet: decorationSet,
      triggerHandler: triggerHandler,
      decorationElement: decorationElement,
      inputMethod: inputMethod,
      selectedIndex: typeof selectedIndex === 'number' ? selectedIndex : -1,
      items: [],
      query: reopenQuery || ''
    });
  };

  var closeMenu = function closeMenu(currentPluginState) {
    removeDecorations(currentPluginState.decorationSet);
    return _objectSpread(_objectSpread({}, currentPluginState), {}, {
      inputMethod: null,
      query: '',
      decorationElement: null,
      decorationSet: _prosemirrorView.DecorationSet.empty,
      stats: null,
      triggerHandler: undefined,
      items: []
    });
  };

  return function (tr, currentPluginState, typeAheadStepOverride) {
    var meta = tr.getMeta(_key.pluginKey) || {}; // This code below controls when we should force
    // the menu to open or close during undo/redo operations

    var overrideHandler = findHandler(typeAheadStepOverride);

    if (typeAheadStepOverride && overrideHandler && shouldForceOpen(typeAheadStepOverride)) {
      return openMenu(currentPluginState, {
        tr: tr,
        triggerHandler: overrideHandler,
        inputMethod: _enums.INPUT_METHOD.KEYBOARD,
        reopenQuery: typeAheadStepOverride.query,
        selectedIndex: typeAheadStepOverride.selectedIndex
      });
    } else if (shouldForceClose(typeAheadStepOverride)) {
      return closeMenu(currentPluginState);
    }

    var _ref3 = meta || {},
        action = _ref3.action,
        params = _ref3.params;

    var shouldOpenMenu = action === _actions.ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR && (0, _utils.isTypeAheadHandler)(params === null || params === void 0 ? void 0 : params.triggerHandler);
    var selectionChanged = tr.selectionSet && (tr.isGeneric || Boolean(tr.getMeta('pointer')));
    var shouldCloseMenu = [_actions.ACTIONS.CLOSE_TYPE_AHEAD, _actions.ACTIONS.INSERT_ITEM].includes(action) || selectionChanged;
    var shouldUpdateQuery = action === _actions.ACTIONS.CHANGE_QUERY;
    var shouldUpdateListItems = action === _actions.ACTIONS.UPDATE_LIST_ITEMS;
    var shouldUpdateSelectedIndex = action === _actions.ACTIONS.UPDATE_SELECTED_INDEX;

    if (shouldOpenMenu) {
      return openMenu(currentPluginState, {
        tr: tr,
        triggerHandler: params.triggerHandler,
        inputMethod: params.inputMethod
      });
    } else if (shouldCloseMenu) {
      return closeMenu(currentPluginState);
    } else if (shouldUpdateQuery) {
      return _objectSpread(_objectSpread({}, currentPluginState), {}, {
        query: params.query
      });
    } else if (shouldUpdateListItems) {
      var items = params.items;
      var selectedIndex = currentPluginState.selectedIndex;
      return _objectSpread(_objectSpread({}, currentPluginState), {}, {
        items: items,
        selectedIndex: Math.max(selectedIndex >= items.length ? items.length - 1 : selectedIndex, -1)
      });
    } else if (shouldUpdateSelectedIndex) {
      return _objectSpread(_objectSpread({}, currentPluginState), {}, {
        selectedIndex: params.selectedIndex
      });
    }

    if (tr.docChanged) {
      var decorationSet = currentPluginState.decorationSet;

      var onRemove = function onRemove() {
        // Make sure we are unmounting the component
        // from the react tree when this decoration is removed
        removeDecorations(currentPluginState.decorationSet);
      };

      var mappedDecorationSet = decorationSet.map(tr.mapping, tr.doc, {
        onRemove: onRemove
      });
      return _objectSpread(_objectSpread({}, currentPluginState), {}, {
        decorationSet: mappedDecorationSet
      });
    }

    return currentPluginState;
  };
};

exports.createReducer = createReducer;