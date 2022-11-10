import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { Selection, NodeSelection, TextSelection } from 'prosemirror-state';
import { replaceSelectedNode, findSelectedNodeOfType, replaceParentNodeOfType } from 'prosemirror-utils';
export { transformSliceToRemoveOpenBodiedExtension } from '@atlaskit/editor-common/transforms';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, addAnalytics } from '../analytics';
import { TARGET_SELECTION_SOURCE } from '../analytics/types/extension-events';
import { findExtensionWithLocalId } from './utils';
import { getPluginState } from './pm-plugins/main';
import { getEditInLegacyMacroBrowser, createExtensionAPI } from './extension-api';
export var buildExtensionNode = function buildExtensionNode(type, schema, attrs, content, marks) {
  switch (type) {
    case 'extension':
      return schema.nodes.extension.createChecked(attrs, content, marks);

    case 'inlineExtension':
      return schema.nodes.inlineExtension.createChecked(attrs, content, marks);

    case 'bodiedExtension':
      return schema.nodes.bodiedExtension.create(attrs, content, marks);
  }
};
export var performNodeUpdate = function performNodeUpdate(type, newAttrs, content, marks, shouldScrollIntoView) {
  return function (_state, _dispatch, view) {
    if (!view) {
      throw Error('EditorView is required to perform node update!');
    } // NOTE: `state` and `dispatch` are stale at this point so we need to grab
    // the latest one from `view` @see HOT-93986


    var state = view.state,
        dispatch = view.dispatch;
    var newNode = buildExtensionNode(type, state.schema, newAttrs, content, marks);

    if (!newNode) {
      return false;
    }

    var selection = state.selection,
        schema = state.schema;
    var _schema$nodes = schema.nodes,
        extension = _schema$nodes.extension,
        inlineExtension = _schema$nodes.inlineExtension,
        bodiedExtension = _schema$nodes.bodiedExtension;
    var isBodiedExtensionSelected = !!findSelectedNodeOfType([bodiedExtension])(selection);
    var extensionState = getPluginState(state);
    var targetSelectionSource = TARGET_SELECTION_SOURCE.CURRENT_SELECTION;
    var action = ACTION.UPDATED;
    var tr = state.tr; // When it's a bodiedExtension but not selected

    if (newNode.type === bodiedExtension && !isBodiedExtensionSelected) {
      // Bodied extensions can trigger an update when the cursor is inside which means that there is no node selected.
      // To work around that we replace the parent and create a text selection instead of new node selection
      tr = replaceParentNodeOfType(state.schema.nodes.bodiedExtension, newNode)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

      tr.setSelection(TextSelection.create(tr.doc, state.selection.anchor));
    } // If any extension is currently selected
    else if (findSelectedNodeOfType([extension, bodiedExtension, inlineExtension])(selection)) {
      tr = replaceSelectedNode(newNode)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

      tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(state.selection.anchor)));
    } // When we loose the selection. This usually happens when Synchrony resets or changes
    // the selection when user is in the middle of updating an extension.
    else if (extensionState.element) {
      var pos = view.posAtDOM(extensionState.element, -1);

      if (pos > -1) {
        tr = tr.replaceWith(pos, pos + (content.size || 0) + 1, newNode);
        tr.setSelection(Selection.near(tr.doc.resolve(pos)));
        targetSelectionSource = TARGET_SELECTION_SOURCE.HTML_ELEMENT;
      } else {
        action = ACTION.ERRORED;
      }
    } // Only scroll if we have anything to update, best to avoid surprise scroll


    if (dispatch && tr.docChanged) {
      var _newNode$attrs = newNode.attrs,
          extensionType = _newNode$attrs.extensionType,
          extensionKey = _newNode$attrs.extensionKey,
          layout = _newNode$attrs.layout,
          localId = _newNode$attrs.localId;
      addAnalytics(state, tr, {
        action: action,
        actionSubject: ACTION_SUBJECT.EXTENSION,
        actionSubjectId: newNode.type.name,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: INPUT_METHOD.CONFIG_PANEL,
          extensionType: extensionType,
          extensionKey: extensionKey,
          layout: layout,
          localId: localId,
          selection: tr.selection.toJSON(),
          targetSelectionSource: targetSelectionSource
        }
      });
      dispatch(shouldScrollIntoView ? tr.scrollIntoView() : tr);
    }

    return true;
  };
};
export var updateExtensionParams = function updateExtensionParams(updateExtension, node, actions) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(state, dispatch, view) {
      var _node$node, attrs, type, content, marks, parameters, newParameters, newAttrs;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _node$node = node.node, attrs = _node$node.attrs, type = _node$node.type, content = _node$node.content, marks = _node$node.marks;

              if (state.schema.nodes[type.name]) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return", false);

            case 3:
              parameters = attrs.parameters;
              _context.prev = 4;
              _context.next = 7;
              return updateExtension(parameters, actions);

            case 7:
              newParameters = _context.sent;

              if (!newParameters) {
                _context.next = 11;
                break;
              }

              newAttrs = _objectSpread(_objectSpread({}, attrs), {}, {
                parameters: _objectSpread(_objectSpread({}, parameters), newParameters)
              });
              return _context.abrupt("return", performNodeUpdate(type.name, newAttrs, content, marks, true)(state, dispatch, view));

            case 11:
              _context.next = 15;
              break;

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](4);

            case 15:
              return _context.abrupt("return", true);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 13]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};
export var editSelectedExtension = function editSelectedExtension(editorActions) {
  var editorView = editorActions._privateGetEditorView();

  var _getPluginState = getPluginState(editorView.state),
      updateExtension = _getPluginState.updateExtension;

  return editExtension(null, updateExtension)(editorView.state, editorView.dispatch, editorView);
};
export var editExtension = function editExtension(macroProvider, updateExtension) {
  return function (state, dispatch, view) {
    if (!view) {
      return false;
    }

    var _getPluginState2 = getPluginState(state),
        localId = _getPluginState2.localId;

    var nodeWithPos = findExtensionWithLocalId(state, localId);

    if (!nodeWithPos) {
      return false;
    }

    var editInLegacyMacroBrowser = getEditInLegacyMacroBrowser({
      view: view,
      macroProvider: macroProvider || undefined
    });

    if (updateExtension) {
      updateExtension.then(function (updateMethod) {
        if (updateMethod && view) {
          var actions = createExtensionAPI({
            editorView: view,
            editInLegacyMacroBrowser: editInLegacyMacroBrowser
          });
          updateExtensionParams(updateMethod, nodeWithPos, actions)(state, dispatch, view);
          return;
        }

        if (!updateMethod && macroProvider) {
          editInLegacyMacroBrowser();
          return;
        }
      });
    } else {
      if (!macroProvider) {
        return false;
      }

      editInLegacyMacroBrowser();
    }

    return true;
  };
};