"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "typeAheadPluginKey", {
  enumerable: true,
  get: function get() {
    return _key.pluginKey;
  }
});

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _main = require("./pm-plugins/main");

var _insertItemPlugin = require("./pm-plugins/insert-item-plugin");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _adfSchema = require("@atlaskit/adf-schema");

var _key = require("./pm-plugins/key");

var _inputRules = require("./pm-plugins/input-rules");

var _TypeAheadPopup = require("./ui/TypeAheadPopup");

var _utils = require("./utils");

var _useItemInsert3 = require("./ui/hooks/use-item-insert");

var _updateSelectedIndex = require("./commands/update-selected-index");

var _statsModifier = require("./stats-modifier");

var _analytics = require("../analytics");

/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
var TypeAheadMenu = /*#__PURE__*/_react.default.memo(function (_ref) {
  var _popupMountRef$curren, _popupMountRef$curren2, _popupMountRef$curren3;

  var editorView = _ref.editorView,
      popupMountRef = _ref.popupMountRef,
      typeAheadState = _ref.typeAheadState,
      fireAnalyticsCallback = _ref.fireAnalyticsCallback;
  var isOpen = typeAheadState.decorationSet.find().length > 0;
  var triggerHandler = typeAheadState.triggerHandler,
      items = typeAheadState.items,
      selectedIndex = typeAheadState.selectedIndex,
      decorationElement = typeAheadState.decorationElement,
      decorationSet = typeAheadState.decorationSet,
      query = typeAheadState.query;

  var _useItemInsert = (0, _useItemInsert3.useItemInsert)(triggerHandler, editorView, items),
      _useItemInsert2 = (0, _slicedToArray2.default)(_useItemInsert, 3),
      onItemInsert = _useItemInsert2[0],
      onItemMatch = _useItemInsert2[2];

  var setSelectedItem = _react.default.useCallback(function (_ref2) {
    var nextIndex = _ref2.index;
    queueMicrotask(function () {
      (0, _updateSelectedIndex.updateSelectedIndex)(nextIndex)(editorView.state, editorView.dispatch);
    });
  }, [editorView]);

  var insertItem = _react.default.useCallback(function () {
    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _typeAhead.SelectItemMode.SELECTED;
    var index = arguments.length > 1 ? arguments[1] : undefined;
    queueMicrotask(function () {
      onItemInsert({
        mode: mode,
        index: index,
        query: query
      });
    });
  }, [onItemInsert, query]);

  _react.default.useEffect(function () {
    if (!isOpen || !query) {
      return;
    }

    var isLastCharSpace = query[query.length - 1] === ' ';

    if (!isLastCharSpace) {
      return;
    }

    var result = onItemMatch({
      mode: _typeAhead.SelectItemMode.SPACE,
      query: query.trim()
    });

    if (!result) {
      return;
    }
  }, [isOpen, query, onItemMatch]);

  if (!isOpen || !triggerHandler || !(decorationElement instanceof HTMLElement) || items.length === 0) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_TypeAheadPopup.TypeAheadPopup, {
    editorView: editorView,
    popupsMountPoint: (_popupMountRef$curren = popupMountRef.current) === null || _popupMountRef$curren === void 0 ? void 0 : _popupMountRef$curren.popupsMountPoint,
    popupsBoundariesElement: (_popupMountRef$curren2 = popupMountRef.current) === null || _popupMountRef$curren2 === void 0 ? void 0 : _popupMountRef$curren2.popupsBoundariesElement,
    popupsScrollableElement: (_popupMountRef$curren3 = popupMountRef.current) === null || _popupMountRef$curren3 === void 0 ? void 0 : _popupMountRef$curren3.popupsScrollableElement,
    anchorElement: decorationElement,
    triggerHandler: triggerHandler,
    fireAnalyticsCallback: fireAnalyticsCallback,
    items: items,
    selectedIndex: selectedIndex,
    setSelectedItem: setSelectedItem,
    onItemInsert: insertItem,
    decorationSet: decorationSet,
    isEmptyQuery: !query
  });
});
/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */


var typeAheadPlugin = function typeAheadPlugin(options) {
  var fireAnalyticsCallback = (0, _analytics.fireAnalyticsEvent)(options === null || options === void 0 ? void 0 : options.createAnalyticsEvent);
  var popupMountRef = {
    current: null
  };
  return {
    name: 'typeAhead',
    marks: function marks() {
      // We need to keep this to make sure
      // All documents with typeahead marks will be loaded normaly
      return [{
        name: 'typeAheadQuery',
        mark: _adfSchema.typeAheadQuery
      }];
    },
    pmPlugins: function pmPlugins() {
      var typeAhead = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return [{
        name: 'typeAhead',
        plugin: function plugin(_ref3) {
          var dispatch = _ref3.dispatch,
              getIntl = _ref3.getIntl;
          return (0, _main.createPlugin)({
            getIntl: getIntl,
            popupMountRef: popupMountRef,
            reactDispatch: dispatch,
            typeAheadHandlers: typeAhead,
            createAnalyticsEvent: options === null || options === void 0 ? void 0 : options.createAnalyticsEvent
          });
        }
      }, {
        name: 'typeAheadInsertItem',
        plugin: _insertItemPlugin.createPlugin
      }, {
        name: 'typeAheadInputRule',
        plugin: function plugin(_ref4) {
          var schema = _ref4.schema,
              featureFlags = _ref4.featureFlags;
          return (0, _inputRules.inputRulePlugin)(schema, typeAhead, featureFlags);
        }
      }];
    },
    contentComponent: function contentComponent(_ref5) {
      var editorView = _ref5.editorView,
          containerElement = _ref5.containerElement,
          popupsMountPoint = _ref5.popupsMountPoint,
          popupsBoundariesElement = _ref5.popupsBoundariesElement,
          popupsScrollableElement = _ref5.popupsScrollableElement,
          wrapperElement = _ref5.wrapperElement;
      popupMountRef.current = {
        popupsMountPoint: popupsMountPoint || wrapperElement || undefined,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement || containerElement || undefined
      };
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          typeAheadState: _key.pluginKey
        },
        render: function render(_ref6) {
          var typeAheadState = _ref6.typeAheadState;

          if (!typeAheadState) {
            return null;
          }

          return /*#__PURE__*/_react.default.createElement(TypeAheadMenu, {
            editorView: editorView,
            popupMountRef: popupMountRef,
            typeAheadState: typeAheadState,
            fireAnalyticsCallback: fireAnalyticsCallback
          });
        }
      });
    },
    onEditorViewStateUpdated: function onEditorViewStateUpdated(_ref7) {
      var originalTransaction = _ref7.originalTransaction,
          oldEditorState = _ref7.oldEditorState,
          newEditorState = _ref7.newEditorState;
      var oldPluginState = (0, _utils.getPluginState)(oldEditorState);
      var newPluginState = (0, _utils.getPluginState)(newEditorState);

      if (!oldPluginState || !newPluginState) {
        return;
      }

      var oldTriggerHandler = oldPluginState.triggerHandler;
      var newTriggerHandler = newPluginState.triggerHandler;
      var isANewHandler = oldTriggerHandler !== newTriggerHandler;

      if (oldTriggerHandler !== null && oldTriggerHandler !== void 0 && oldTriggerHandler.dismiss && isANewHandler) {
        var typeAheadMessage = originalTransaction.getMeta(_key.pluginKey);
        var wasItemInserted = typeAheadMessage && typeAheadMessage.action === 'INSERT_RAW_QUERY';
        oldTriggerHandler.dismiss({
          editorState: newEditorState,
          query: oldPluginState.query,
          stats: (oldPluginState.stats || new _statsModifier.StatsModifier()).serialize(),
          wasItemInserted: wasItemInserted
        });
      }

      if (newTriggerHandler !== null && newTriggerHandler !== void 0 && newTriggerHandler.onOpen && isANewHandler) {
        newTriggerHandler.onOpen(newEditorState);
      }

      if (newTriggerHandler && isANewHandler && options !== null && options !== void 0 && options.createAnalyticsEvent) {
        fireAnalyticsCallback({
          payload: {
            action: _analytics.ACTION.INVOKED,
            actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD,
            actionSubjectId: newTriggerHandler.id || 'not_set',
            attributes: {
              inputMethod: newPluginState.inputMethod || _analytics.INPUT_METHOD.KEYBOARD
            },
            eventType: _analytics.EVENT_TYPE.UI
          }
        });
      }
    }
  };
};

var _default = typeAheadPlugin;
exports.default = _default;