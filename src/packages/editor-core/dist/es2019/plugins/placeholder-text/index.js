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

const getOpenTypeAhead = (view, content) => {
  const typeAheadAPI = createInternalTypeAheadTools(view);
  const typeAheadHandler = typeAheadAPI.findTypeAheadHandler(content);

  if (!typeAheadHandler || !typeAheadHandler.id) {
    return null;
  }

  return typeAheadAPI.openTypeAheadHandler({
    triggerHandler: typeAheadHandler,
    inputMethod: INPUT_METHOD.KEYBOARD
  });
};

export function createPlugin(dispatch, options) {
  const allowInserting = !!options.allowInserting;
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: () => ({
        showInsertPanelAt: null,
        allowInserting
      }),
      apply: (tr, state) => {
        const meta = tr.getMeta(pluginKey);

        if (meta && meta.showInsertPanelAt !== undefined) {
          const newState = {
            showInsertPanelAt: meta.showInsertPanelAt,
            allowInserting
          };
          dispatch(pluginKey, newState);
          return newState;
        } else if (state.showInsertPanelAt) {
          const newState = {
            showInsertPanelAt: tr.mapping.map(state.showInsertPanelAt),
            allowInserting
          };
          dispatch(pluginKey, newState);
          return newState;
        }

        return state;
      }
    },

    appendTransaction(transactions, oldState, newState) {
      if (transactions.some(txn => txn.docChanged)) {
        const didPlaceholderExistBeforeTxn = oldState.selection.$head.nodeAfter === newState.selection.$head.nodeAfter;
        const adjacentNode = newState.selection.$head.nodeAfter;
        const adjacentNodePos = newState.selection.$head.pos;
        const placeholderNodeType = newState.schema.nodes.placeholder;

        if (adjacentNode && adjacentNode.type === placeholderNodeType && didPlaceholderExistBeforeTxn) {
          var _$newHead$nodeBefore;

          const {
            $head: $newHead
          } = newState.selection;
          const {
            $head: $oldHead
          } = oldState.selection; // Check that cursor has moved forward in the document **and** that there is content before the cursor

          const cursorMoved = $oldHead.pos < $newHead.pos;
          const nodeBeforeHasContent = !isNodeEmpty($newHead.nodeBefore);
          const nodeBeforeIsInline = (_$newHead$nodeBefore = $newHead.nodeBefore) === null || _$newHead$nodeBefore === void 0 ? void 0 : _$newHead$nodeBefore.type.isInline;

          if (cursorMoved && (nodeBeforeHasContent || nodeBeforeIsInline)) {
            const {
              $from,
              $to
            } = NodeSelection.create(newState.doc, adjacentNodePos);
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
        beforeinput: (view, event) => {
          const {
            state
          } = view;

          if (event instanceof InputEvent && !event.isComposing && event.inputType === 'insertText' && isSelectionAtPlaceholder(view.state.selection)) {
            event.stopPropagation();
            event.preventDefault();
            const startNodePosition = state.selection.from;
            const content = event.data || '';
            const tr = view.state.tr;
            tr.delete(startNodePosition, startNodePosition + 1);
            const openTypeAhead = getOpenTypeAhead(view, content);

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
        placeholder: (node, view, getPos) => new PlaceholderTextNodeView(node, view, getPos)
      }
    }
  });
}

const basePlaceholderTextPlugin = options => ({
  name: 'placeholderText',

  nodes() {
    return [{
      name: 'placeholder',
      node: placeholder
    }];
  },

  pmPlugins() {
    return [{
      name: 'placeholderText',
      plugin: ({
        dispatch
      }) => createPlugin(dispatch, options)
    }];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement
  }) {
    const insertPlaceholderText = value => insertPlaceholderTextAtSelection(value)(editorView.state, editorView.dispatch);

    const hidePlaceholderToolbar = () => hidePlaceholderFloatingToolbar(editorView.state, editorView.dispatch);

    const getNodeFromPos = pos => editorView.domAtPos(pos).node;

    const getFixedCoordinatesFromPos = pos => editorView.coordsAtPos(pos);

    const setFocusInEditor = () => editorView.focus();

    return /*#__PURE__*/React.createElement(WithPluginState, {
      plugins: {
        placeholderTextState: pluginKey
      },
      render: ({
        placeholderTextState = {}
      }) => {
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

});

const decorateWithPluginOptions = (plugin, options) => {
  if (!options.allowInserting) {
    return plugin;
  }

  plugin.pluginsOptions = {
    quickInsert: ({
      formatMessage
    }) => [{
      id: 'placeholderText',
      title: formatMessage(messages.placeholderText),
      description: formatMessage(messages.placeholderTextDescription),
      priority: 1400,
      keywords: ['placeholder'],
      icon: () => /*#__PURE__*/React.createElement(MediaServicesTextIcon, {
        label: ""
      }),

      action(insert, state) {
        const tr = state.tr;
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

    }]
  };
  return plugin;
};

const placeholderTextPlugin = options => decorateWithPluginOptions(basePlaceholderTextPlugin(options), options);

export default placeholderTextPlugin;