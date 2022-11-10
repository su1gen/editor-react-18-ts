"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _utils = require("../../../utils");

var _utils2 = require("../../selection/utils");

var _decisionItem = require("../nodeviews/decisionItem");

var _taskItem = require("../nodeviews/taskItem");

var _pluginKey = require("./plugin-key");

var _excluded = ["localId"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["SET_CONTEXT_PROVIDER"] = 0] = "SET_CONTEXT_PROVIDER";
})(ACTIONS || (ACTIONS = {}));

var setContextIdentifierProvider = function setContextIdentifierProvider(provider) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(_pluginKey.stateKey, {
        action: ACTIONS.SET_CONTEXT_PROVIDER,
        data: provider
      }));
    }

    return true;
  };
};

function createPlugin(portalProviderAPI, eventDispatcher, providerFactory, dispatch) {
  var useLongPressSelection = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  return new _safePlugin.SafePlugin({
    props: {
      nodeViews: {
        taskItem: (0, _taskItem.taskItemNodeViewFactory)(portalProviderAPI, eventDispatcher, providerFactory),
        decisionItem: (0, _decisionItem.decisionItemNodeView)(portalProviderAPI, eventDispatcher)
      },
      handleTextInput: function handleTextInput(view, from, to, text) {
        // When a decision item is selected and the user starts typing, the entire node
        // should be replaced with what was just typed. This custom text input handler
        // is needed to implement that behaviour.
        // TODO: ProseMirror should already do this by default
        // Tech debt to investigate why we need a custom handler here:
        // https://product-fabric.atlassian.net/browse/ED-9278
        var state = view.state,
            dispatch = view.dispatch;
        var tr = state.tr;

        if (state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node.type === view.state.schema.nodes.decisionItem) {
          state.selection.replace(tr);
          tr.insertText(text);

          if (dispatch) {
            dispatch(tr);
          }

          return true;
        }

        return false;
      },
      handleClickOn: (0, _utils2.createSelectionClickHandler)(['decisionItem'], function (target) {
        return target.hasAttribute('data-decision-wrapper') || target.getAttribute('aria-label') === 'Decision';
      }, {
        useLongPressSelection: useLongPressSelection
      })
    },
    state: {
      init: function init() {
        return {
          insideTaskDecisionItem: false
        };
      },
      apply: function apply(tr, pluginState) {
        var _ref = tr.getMeta(_pluginKey.stateKey) || {
          action: null,
          data: null
        },
            action = _ref.action,
            data = _ref.data;

        var newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_CONTEXT_PROVIDER:
            newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
              contextIdentifierProvider: data
            });
            break;
        }

        dispatch(_pluginKey.stateKey, newPluginState);
        return newPluginState;
      }
    },
    view: function view(editorView) {
      var providerHandler = function providerHandler(name, providerPromise) {
        if (name === 'contextIdentifierProvider') {
          if (!providerPromise) {
            setContextIdentifierProvider(undefined)(editorView.state, editorView.dispatch);
          } else {
            providerPromise.then(function (provider) {
              setContextIdentifierProvider(provider)(editorView.state, editorView.dispatch);
            });
          }
        }
      };

      providerFactory.subscribe('contextIdentifierProvider', providerHandler);
      return {};
    },
    key: _pluginKey.stateKey,

    /*
     * After each transaction, we search through the document for any decisionList/Item & taskList/Item nodes
     * that do not have the localId attribute set and generate a random UUID to use. This is to replace a previous
     * Prosemirror capabibility where node attributes could be generated dynamically.
     * See https://discuss.prosemirror.net/t/release-0-23-0-possibly-to-be-1-0-0/959/17 for a discussion of this approach.
     *
     * Note: we currently do not handle the edge case where two nodes may have the same localId
     */
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var tr = newState.tr;
      var modified = false;
      transactions.forEach(function (transaction) {
        if (!transaction.docChanged) {
          return;
        } // Adds a unique id to a node


        (0, _utils.nodesBetweenChanged)(transaction, function (node, pos) {
          var _newState$schema$node = newState.schema.nodes,
              decisionList = _newState$schema$node.decisionList,
              decisionItem = _newState$schema$node.decisionItem,
              taskList = _newState$schema$node.taskList,
              taskItem = _newState$schema$node.taskItem;

          if (!!node.type && (node.type === decisionList || node.type === decisionItem || node.type === taskList || node.type === taskItem)) {
            var _node$attrs = node.attrs,
                localId = _node$attrs.localId,
                rest = (0, _objectWithoutProperties2.default)(_node$attrs, _excluded);

            if (localId === undefined || localId === null || localId === '') {
              tr.step(new _utils.SetAttrsStep(pos, _objectSpread({
                localId: _adfSchema.uuid.generate()
              }, rest)));
              modified = true;
            }
          }
        });
      });

      if (modified) {
        return tr.setMeta('addToHistory', false);
      }

      return;
    }
  });
}