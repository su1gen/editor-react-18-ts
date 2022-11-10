"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _text = _interopRequireDefault(require("@atlaskit/icon/glyph/media-services/text"));

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _utils = require("../../utils");

var _cursor = require("../fake-text-cursor/cursor");

var _PlaceholderFloatingToolbar = _interopRequireDefault(require("./ui/PlaceholderFloatingToolbar"));

var _actions = require("./actions");

var _placeholderTextNodeview = require("./placeholder-text-nodeview");

var _pluginKey = require("./plugin-key");

var _analytics = require("../analytics");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _selectionUtils = require("./selection-utils");

var _api = require("../type-ahead/api");

var getOpenTypeAhead = function getOpenTypeAhead(view, content) {
  var typeAheadAPI = (0, _api.createInternalTypeAheadTools)(view);
  var typeAheadHandler = typeAheadAPI.findTypeAheadHandler(content);

  if (!typeAheadHandler || !typeAheadHandler.id) {
    return null;
  }

  return typeAheadAPI.openTypeAheadHandler({
    triggerHandler: typeAheadHandler,
    inputMethod: _analytics.INPUT_METHOD.KEYBOARD
  });
};

function createPlugin(dispatch, options) {
  var allowInserting = !!options.allowInserting;
  return new _safePlugin.SafePlugin({
    key: _pluginKey.pluginKey,
    state: {
      init: function init() {
        return {
          showInsertPanelAt: null,
          allowInserting: allowInserting
        };
      },
      apply: function apply(tr, state) {
        var meta = tr.getMeta(_pluginKey.pluginKey);

        if (meta && meta.showInsertPanelAt !== undefined) {
          var newState = {
            showInsertPanelAt: meta.showInsertPanelAt,
            allowInserting: allowInserting
          };
          dispatch(_pluginKey.pluginKey, newState);
          return newState;
        } else if (state.showInsertPanelAt) {
          var _newState = {
            showInsertPanelAt: tr.mapping.map(state.showInsertPanelAt),
            allowInserting: allowInserting
          };
          dispatch(_pluginKey.pluginKey, _newState);
          return _newState;
        }

        return state;
      }
    },
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      if (transactions.some(function (txn) {
        return txn.docChanged;
      })) {
        var didPlaceholderExistBeforeTxn = oldState.selection.$head.nodeAfter === newState.selection.$head.nodeAfter;
        var adjacentNode = newState.selection.$head.nodeAfter;
        var adjacentNodePos = newState.selection.$head.pos;
        var placeholderNodeType = newState.schema.nodes.placeholder;

        if (adjacentNode && adjacentNode.type === placeholderNodeType && didPlaceholderExistBeforeTxn) {
          var _$newHead$nodeBefore;

          var $newHead = newState.selection.$head;
          var $oldHead = oldState.selection.$head; // Check that cursor has moved forward in the document **and** that there is content before the cursor

          var cursorMoved = $oldHead.pos < $newHead.pos;
          var nodeBeforeHasContent = !(0, _utils.isNodeEmpty)($newHead.nodeBefore);
          var nodeBeforeIsInline = (_$newHead$nodeBefore = $newHead.nodeBefore) === null || _$newHead$nodeBefore === void 0 ? void 0 : _$newHead$nodeBefore.type.isInline;

          if (cursorMoved && (nodeBeforeHasContent || nodeBeforeIsInline)) {
            var _NodeSelection$create = _prosemirrorState.NodeSelection.create(newState.doc, adjacentNodePos),
                $from = _NodeSelection$create.$from,
                $to = _NodeSelection$create.$to;

            return newState.tr.deleteRange($from.pos, $to.pos);
          }
        }
      } // Handle Fake Text Cursor for Floating Toolbar


      if (!_pluginKey.pluginKey.getState(oldState).showInsertPanelAt && _pluginKey.pluginKey.getState(newState).showInsertPanelAt) {
        return newState.tr.setSelection(new _cursor.FakeTextCursorSelection(newState.selection.$from));
      }

      if (_pluginKey.pluginKey.getState(oldState).showInsertPanelAt && !_pluginKey.pluginKey.getState(newState).showInsertPanelAt) {
        if (newState.selection instanceof _cursor.FakeTextCursorSelection) {
          return newState.tr.setSelection(new _prosemirrorState.TextSelection(newState.selection.$from));
        }
      }

      return;
    },
    props: {
      handleDOMEvents: {
        beforeinput: function beforeinput(view, event) {
          var state = view.state;

          if (event instanceof InputEvent && !event.isComposing && event.inputType === 'insertText' && (0, _selectionUtils.isSelectionAtPlaceholder)(view.state.selection)) {
            event.stopPropagation();
            event.preventDefault();
            var startNodePosition = state.selection.from;
            var content = event.data || '';
            var tr = view.state.tr;
            tr.delete(startNodePosition, startNodePosition + 1);
            var openTypeAhead = getOpenTypeAhead(view, content);

            if (openTypeAhead) {
              openTypeAhead(tr);
            } else {
              tr.insertText(content);
            }

            view.dispatch(tr);
            return true;
          }

          return false;
        }
      },
      nodeViews: {
        placeholder: function placeholder(node, view, getPos) {
          return new _placeholderTextNodeview.PlaceholderTextNodeView(node, view, getPos);
        }
      }
    }
  });
}

var basePlaceholderTextPlugin = function basePlaceholderTextPlugin(options) {
  return {
    name: 'placeholderText',
    nodes: function nodes() {
      return [{
        name: 'placeholder',
        node: _adfSchema.placeholder
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'placeholderText',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, options);
        }
      }];
    },
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsBoundariesElement = _ref2.popupsBoundariesElement;

      var insertPlaceholderText = function insertPlaceholderText(value) {
        return (0, _actions.insertPlaceholderTextAtSelection)(value)(editorView.state, editorView.dispatch);
      };

      var hidePlaceholderToolbar = function hidePlaceholderToolbar() {
        return (0, _actions.hidePlaceholderFloatingToolbar)(editorView.state, editorView.dispatch);
      };

      var getNodeFromPos = function getNodeFromPos(pos) {
        return editorView.domAtPos(pos).node;
      };

      var getFixedCoordinatesFromPos = function getFixedCoordinatesFromPos(pos) {
        return editorView.coordsAtPos(pos);
      };

      var setFocusInEditor = function setFocusInEditor() {
        return editorView.focus();
      };

      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          placeholderTextState: _pluginKey.pluginKey
        },
        render: function render(_ref3) {
          var _ref3$placeholderText = _ref3.placeholderTextState,
              placeholderTextState = _ref3$placeholderText === void 0 ? {} : _ref3$placeholderText;

          if (placeholderTextState.showInsertPanelAt) {
            return /*#__PURE__*/_react.default.createElement(_PlaceholderFloatingToolbar.default, {
              editorViewDOM: editorView.dom,
              popupsMountPoint: popupsMountPoint,
              popupsBoundariesElement: popupsBoundariesElement,
              getFixedCoordinatesFromPos: getFixedCoordinatesFromPos,
              getNodeFromPos: getNodeFromPos,
              hidePlaceholderFloatingToolbar: hidePlaceholderToolbar,
              showInsertPanelAt: placeholderTextState.showInsertPanelAt,
              insertPlaceholder: insertPlaceholderText,
              setFocusInEditor: setFocusInEditor
            });
          }

          return null;
        }
      });
    }
  };
};

var decorateWithPluginOptions = function decorateWithPluginOptions(plugin, options) {
  if (!options.allowInserting) {
    return plugin;
  }

  plugin.pluginsOptions = {
    quickInsert: function quickInsert(_ref4) {
      var formatMessage = _ref4.formatMessage;
      return [{
        id: 'placeholderText',
        title: formatMessage(_messages.messages.placeholderText),
        description: formatMessage(_messages.messages.placeholderTextDescription),
        priority: 1400,
        keywords: ['placeholder'],
        icon: function icon() {
          return /*#__PURE__*/_react.default.createElement(_text.default, {
            label: ""
          });
        },
        action: function action(insert, state) {
          var tr = state.tr;
          tr.setMeta(_pluginKey.pluginKey, {
            showInsertPanelAt: tr.selection.anchor
          });
          return (0, _analytics.addAnalytics)(state, tr, {
            action: _analytics.ACTION.INSERTED,
            actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: _analytics.ACTION_SUBJECT_ID.PLACEHOLDER_TEXT,
            attributes: {
              inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
            },
            eventType: _analytics.EVENT_TYPE.TRACK
          });
        }
      }];
    }
  };
  return plugin;
};

var placeholderTextPlugin = function placeholderTextPlugin(options) {
  return decorateWithPluginOptions(basePlaceholderTextPlugin(options), options);
};

var _default = placeholderTextPlugin;
exports.default = _default;