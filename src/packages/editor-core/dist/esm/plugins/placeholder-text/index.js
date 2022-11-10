import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { placeholder } from '@atlaskit/adf-schema';
import MediaServicesTextIcon from '@atlaskit/icon/glyph/media-services/text';
import WithPluginState from '../../ui/WithPluginState';
import { isNodeEmpty } from '../../utils';
import { FakeTextCursorSelection } from '../fake-text-cursor/cursor';
import PlaceholderFloatingToolbar from './ui/PlaceholderFloatingToolbar';
import { hidePlaceholderFloatingToolbar, insertPlaceholderTextAtSelection } from './actions';
import { PlaceholderTextNodeView } from './placeholder-text-nodeview';
import { pluginKey } from './plugin-key';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { isSelectionAtPlaceholder } from './selection-utils';
import { createInternalTypeAheadTools } from '../type-ahead/api';

var getOpenTypeAhead = function getOpenTypeAhead(view, content) {
  var typeAheadAPI = createInternalTypeAheadTools(view);
  var typeAheadHandler = typeAheadAPI.findTypeAheadHandler(content);

  if (!typeAheadHandler || !typeAheadHandler.id) {
    return null;
  }

  return typeAheadAPI.openTypeAheadHandler({
    triggerHandler: typeAheadHandler,
    inputMethod: INPUT_METHOD.KEYBOARD
  });
};

export function createPlugin(dispatch, options) {
  var allowInserting = !!options.allowInserting;
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        return {
          showInsertPanelAt: null,
          allowInserting: allowInserting
        };
      },
      apply: function apply(tr, state) {
        var meta = tr.getMeta(pluginKey);

        if (meta && meta.showInsertPanelAt !== undefined) {
          var newState = {
            showInsertPanelAt: meta.showInsertPanelAt,
            allowInserting: allowInserting
          };
          dispatch(pluginKey, newState);
          return newState;
        } else if (state.showInsertPanelAt) {
          var _newState = {
            showInsertPanelAt: tr.mapping.map(state.showInsertPanelAt),
            allowInserting: allowInserting
          };
          dispatch(pluginKey, _newState);
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
          var nodeBeforeHasContent = !isNodeEmpty($newHead.nodeBefore);
          var nodeBeforeIsInline = (_$newHead$nodeBefore = $newHead.nodeBefore) === null || _$newHead$nodeBefore === void 0 ? void 0 : _$newHead$nodeBefore.type.isInline;

          if (cursorMoved && (nodeBeforeHasContent || nodeBeforeIsInline)) {
            var _NodeSelection$create = NodeSelection.create(newState.doc, adjacentNodePos),
                $from = _NodeSelection$create.$from,
                $to = _NodeSelection$create.$to;

            return newState.tr.deleteRange($from.pos, $to.pos);
          }
        }
      } // Handle Fake Text Cursor for Floating Toolbar


      if (!pluginKey.getState(oldState).showInsertPanelAt && pluginKey.getState(newState).showInsertPanelAt) {
        return newState.tr.setSelection(new FakeTextCursorSelection(newState.selection.$from));
      }

      if (pluginKey.getState(oldState).showInsertPanelAt && !pluginKey.getState(newState).showInsertPanelAt) {
        if (newState.selection instanceof FakeTextCursorSelection) {
          return newState.tr.setSelection(new TextSelection(newState.selection.$from));
        }
      }

      return;
    },
    props: {
      handleDOMEvents: {
        beforeinput: function beforeinput(view, event) {
          var state = view.state;

          if (event instanceof InputEvent && !event.isComposing && event.inputType === 'insertText' && isSelectionAtPlaceholder(view.state.selection)) {
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
          return new PlaceholderTextNodeView(node, view, getPos);
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
        node: placeholder
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
        return insertPlaceholderTextAtSelection(value)(editorView.state, editorView.dispatch);
      };

      var hidePlaceholderToolbar = function hidePlaceholderToolbar() {
        return hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
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

      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          placeholderTextState: pluginKey
        },
        render: function render(_ref3) {
          var _ref3$placeholderText = _ref3.placeholderTextState,
              placeholderTextState = _ref3$placeholderText === void 0 ? {} : _ref3$placeholderText;

          if (placeholderTextState.showInsertPanelAt) {
            return /*#__PURE__*/React.createElement(PlaceholderFloatingToolbar, {
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
        title: formatMessage(messages.placeholderText),
        description: formatMessage(messages.placeholderTextDescription),
        priority: 1400,
        keywords: ['placeholder'],
        icon: function icon() {
          return /*#__PURE__*/React.createElement(MediaServicesTextIcon, {
            label: ""
          });
        },
        action: function action(insert, state) {
          var tr = state.tr;
          tr.setMeta(pluginKey, {
            showInsertPanelAt: tr.selection.anchor
          });
          return addAnalytics(state, tr, {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.PLACEHOLDER_TEXT,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT
            },
            eventType: EVENT_TYPE.TRACK
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

export default placeholderTextPlugin;