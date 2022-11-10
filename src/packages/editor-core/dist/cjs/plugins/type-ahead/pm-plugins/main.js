"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorView = require("prosemirror-view");

var _steps = require("@atlaskit/adf-schema/steps");

var _constants = require("../constants");

var _actions = require("./actions");

var _key = require("./key");

var _dom = require("../../../utils/dom");

var _reducer = require("./reducer");

var _decorations = require("./decorations");

var _utils = require("./utils");

var hasValidTypeAheadStep = function hasValidTypeAheadStep(tr) {
  var steps = tr.steps.filter(function (step) {
    return step instanceof _steps.InsertTypeAheadStep;
  }); // There are some cases, like collab rebase, where the steps are re-applied
  // We should not re open the type-ahead for those cases

  if (steps.length === 1) {
    return steps[0];
  }

  return null;
};

function createPlugin(_ref) {
  var reactDispatch = _ref.reactDispatch,
      popupMountRef = _ref.popupMountRef,
      createAnalyticsEvent = _ref.createAnalyticsEvent,
      typeAheadHandlers = _ref.typeAheadHandlers,
      getIntl = _ref.getIntl;
  var intl = getIntl();

  var _factoryDecorations = (0, _decorations.factoryDecorations)({
    intl: intl,
    popupMountRef: popupMountRef,
    createAnalyticsEvent: createAnalyticsEvent
  }),
      createDecorations = _factoryDecorations.createDecorations,
      removeDecorations = _factoryDecorations.removeDecorations;

  var reducer = (0, _reducer.createReducer)({
    createDecorations: createDecorations,
    removeDecorations: removeDecorations,
    typeAheadHandlers: typeAheadHandlers,
    popupMountRef: popupMountRef
  });
  return new _safePlugin.SafePlugin({
    key: _key.pluginKey,
    state: {
      init: function init() {
        return {
          typeAheadHandlers: typeAheadHandlers,
          query: '',
          decorationSet: _prosemirrorView.DecorationSet.empty,
          decorationElement: null,
          items: [],
          selectedIndex: -1,
          stats: null,
          inputMethod: null
        };
      },
      apply: function apply(tr, currentPluginState, oldEditorState, state) {
        var customStep = hasValidTypeAheadStep(tr);
        var nextPluginState = reducer(tr, currentPluginState, customStep);

        if (currentPluginState !== nextPluginState) {
          reactDispatch(_key.pluginKey, nextPluginState);
        }

        return nextPluginState;
      }
    },
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var insertItemCallback = (0, _utils.isInsertionTransaction)(transactions, _actions.ACTIONS.INSERT_RAW_QUERY);

      if (insertItemCallback) {
        var tr = insertItemCallback(newState);

        if (tr) {
          return tr;
        }
      }
    },
    view: function view() {
      return {
        update: function update(editorView) {}
      };
    },
    props: {
      decorations: function decorations(state) {
        var _pluginKey$getState;

        return (_pluginKey$getState = _key.pluginKey.getState(state)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.decorationSet;
      },
      handleDOMEvents: {
        compositionend: function compositionend(view, event) {
          return false;
        },
        click: function click(view, event) {
          var target = event.target; // ProseMirror view listen to any click event inside of it
          // When this event is coming from the typeahead
          // we should tell to ProseMirror to sit down and relax
          // cuz we know what we are doing (I hope)

          if (target instanceof HTMLElement && (0, _dom.closest)(target, "[data-type-ahead=".concat(_constants.TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE, "]"))) {
            return true;
          }

          return false;
        }
      }
    }
  });
}