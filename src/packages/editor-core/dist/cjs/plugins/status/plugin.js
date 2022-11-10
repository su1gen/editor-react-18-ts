"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});
Object.defineProperty(exports, "pluginKeyName", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKeyName;
  }
});

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _getInlineNodeViewProducer = require("../../nodeviews/getInlineNodeViewProducer");

var _status = require("./nodeviews/status");

var _pluginKey = require("./plugin-key");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createPlugin = function createPlugin(pmPluginFactoryParams, options) {
  return new _safePlugin.SafePlugin({
    state: {
      init: function init() {
        return {
          isNew: false,
          showStatusPickerAt: null
        };
      },
      apply: function apply(tr, state, oldEditorState) {
        var meta = tr.getMeta(_pluginKey.pluginKey);

        if (meta) {
          var newState = _objectSpread(_objectSpread({}, state), meta);

          pmPluginFactoryParams.dispatch(_pluginKey.pluginKey, newState);
          return newState;
        }

        if (tr.docChanged && state.showStatusPickerAt) {
          var _tr$mapping$mapResult = tr.mapping.mapResult(state.showStatusPickerAt),
              pos = _tr$mapping$mapResult.pos,
              deleted = _tr$mapping$mapResult.deleted;

          var showStatusPickerAt = deleted ? null : pos;

          var _newState = _objectSpread(_objectSpread({}, state), {}, {
            showStatusPickerAt: showStatusPickerAt
          });

          if (_newState.showStatusPickerAt !== state.showStatusPickerAt) {
            pmPluginFactoryParams.dispatch(_pluginKey.pluginKey, _newState);
            return _newState;
          }
        }

        if (tr.selectionSet) {
          // Change in selection, while status picker was open, update state, if required.
          var selectionFrom = tr.selection.from;
          var nodeAtSelection = tr.doc.nodeAt(selectionFrom);
          var _showStatusPickerAt = null;

          if (nodeAtSelection && nodeAtSelection.type === oldEditorState.schema.nodes.status && tr.selection instanceof _prosemirrorState.NodeSelection) {
            _showStatusPickerAt = selectionFrom;
          }

          if (_showStatusPickerAt !== state.showStatusPickerAt) {
            var _newState2 = _objectSpread(_objectSpread({}, state), {}, {
              isNew: false,
              showStatusPickerAt: _showStatusPickerAt
            });

            pmPluginFactoryParams.dispatch(_pluginKey.pluginKey, _newState2);
            return _newState2;
          }
        }

        return state;
      }
    },
    filterTransaction: function filterTransaction(tr, state) {
      // if it is a selection change transaction, and selection changes from node to text
      if (tr.selectionSet && !tr.steps.length && tr.isGeneric && tr.selection instanceof _prosemirrorState.TextSelection && state.selection instanceof _prosemirrorState.NodeSelection) {
        var _pluginKey$getState = _pluginKey.pluginKey.getState(state),
            isNew = _pluginKey$getState.isNew,
            showStatusPickerAt = _pluginKey$getState.showStatusPickerAt;

        var nodeAtSelection = tr.doc.nodeAt(tr.selection.from); // prevent changing node selection to text selection on dom change right after inserting status
        // if newly selected status is selected with status picker opened

        if (isNew && showStatusPickerAt && nodeAtSelection && nodeAtSelection.type === state.schema.nodes.status) {
          return false;
        }
      }

      return true;
    },
    appendTransaction: function appendTransaction(transactions, oldEditorState, newEditorState) {
      var changed = false;
      var tr = newEditorState.tr; // user leaves the StatusPicker with empty text and selects a new node

      if (transactions.find(function (tr) {
        return tr.selectionSet;
      })) {
        var oldStatus = (0, _utils.mayGetStatusAtSelection)(oldEditorState.selection);
        var newStatus = (0, _utils.mayGetStatusAtSelection)(newEditorState.selection);

        if (oldStatus && (newStatus && oldStatus.localId !== newStatus.localId || !newStatus)) {
          if ((0, _utils.isEmptyStatus)(oldStatus)) {
            var pos = oldEditorState.selection.from;
            tr.delete(tr.mapping.map(pos), tr.mapping.map(pos + 1));
            changed = true;
          }
        }
      }

      return changed ? tr : undefined;
    },
    key: _pluginKey.pluginKey,
    props: {
      nodeViews: {
        status: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: _status.StatusNodeView,
          extraComponentProps: {
            options: options
          }
        })
      }
    }
  });
};

var _default = createPlugin;
exports.default = _default;