import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import _regeneratorRuntime from "@babel/runtime/regenerator";
import assert from 'assert';
import { Selection, NodeSelection, TextSelection } from 'prosemirror-state';
import { safeInsert, replaceSelectedNode, findSelectedNodeOfType, replaceParentNodeOfType } from 'prosemirror-utils';
import { getValidNode } from '@atlaskit/editor-common/validator';
import { normaliseNestedLayout } from '../../utils';
import { getPluginState as getExtensionPluginState } from '../extension/plugin-factory';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, addAnalytics } from '../analytics';
import { TARGET_SELECTION_SOURCE } from '../analytics/types/extension-events';
import { pluginKey } from './plugin-key';
export var insertMacroFromMacroBrowser = function insertMacroFromMacroBrowser(macroProvider, macroNode, isEditing) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(view) {
      var newMacro, state, dispatch, currentLayout, node, selection, schema, _schema$nodes, extension, inlineExtension, bodiedExtension, extensionState, targetSelectionSource, tr, isBodiedExtensionSelected, pos, _macroNode$attrs, extensionType, extensionKey, layout, localId;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (macroProvider) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return", false);

            case 2:
              _context.next = 4;
              return macroProvider.openMacroBrowser(macroNode);

            case 4:
              newMacro = _context.sent;

              if (!(newMacro && macroNode)) {
                _context.next = 20;
                break;
              }

              state = view.state, dispatch = view.dispatch;
              currentLayout = macroNode && macroNode.attrs.layout || 'default';
              node = resolveMacro(newMacro, state, {
                layout: currentLayout
              });

              if (node) {
                _context.next = 11;
                break;
              }

              return _context.abrupt("return", false);

            case 11:
              selection = state.selection, schema = state.schema;
              _schema$nodes = schema.nodes, extension = _schema$nodes.extension, inlineExtension = _schema$nodes.inlineExtension, bodiedExtension = _schema$nodes.bodiedExtension;
              extensionState = getExtensionPluginState(state);
              targetSelectionSource = TARGET_SELECTION_SOURCE.CURRENT_SELECTION;
              tr = state.tr;
              isBodiedExtensionSelected = !!findSelectedNodeOfType([bodiedExtension])(selection); // When it's a bodiedExtension but not selected

              if (macroNode.type === bodiedExtension && !isBodiedExtensionSelected) {
                // `isEditing` is `false` when we are inserting from insert-block toolbar
                tr = isEditing ? replaceParentNodeOfType(bodiedExtension, node)(tr) : safeInsert(node)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

                tr.setSelection(TextSelection.create(tr.doc, state.selection.anchor));
              } // If any extension is currently selected
              else if (findSelectedNodeOfType([extension, bodiedExtension, inlineExtension])(selection)) {
                tr = replaceSelectedNode(node)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

                tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(state.selection.anchor)));
              } // When we loose the selection. This usually happens when Synchrony resets or changes
              // the selection when user is in the middle of updating an extension.
              else if (extensionState.element) {
                pos = view.posAtDOM(extensionState.element, -1);

                if (pos > -1) {
                  tr = tr.replaceWith(pos, pos + macroNode.nodeSize, node);
                  tr.setSelection(Selection.near(tr.doc.resolve(pos)));
                  targetSelectionSource = TARGET_SELECTION_SOURCE.HTML_ELEMENT;
                }
              } // Only scroll if we have anything to update, best to avoid surprise scroll


              if (dispatch && tr.docChanged) {
                _macroNode$attrs = macroNode.attrs, extensionType = _macroNode$attrs.extensionType, extensionKey = _macroNode$attrs.extensionKey, layout = _macroNode$attrs.layout, localId = _macroNode$attrs.localId;
                addAnalytics(state, tr, {
                  action: ACTION.UPDATED,
                  actionSubject: ACTION_SUBJECT.EXTENSION,
                  actionSubjectId: macroNode.type.name,
                  eventType: EVENT_TYPE.TRACK,
                  attributes: {
                    inputMethod: isEditing ? INPUT_METHOD.MACRO_BROWSER : INPUT_METHOD.TOOLBAR,
                    extensionType: extensionType,
                    extensionKey: extensionKey,
                    layout: layout,
                    localId: localId,
                    selection: tr.selection.toJSON(),
                    targetSelectionSource: targetSelectionSource
                  }
                });
                dispatch(tr.scrollIntoView());
              }

              return _context.abrupt("return", true);

            case 20:
              return _context.abrupt("return", false);

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }();
};
export var resolveMacro = function resolveMacro(macro, state, optionalAttrs) {
  if (!macro || !state) {
    return null;
  }

  var schema = state.schema;

  var _getValidNode = getValidNode(macro, schema),
      type = _getValidNode.type,
      attrs = _getValidNode.attrs;

  var node;

  if (type === 'extension') {
    node = schema.nodes.extension.create(_objectSpread(_objectSpread({}, attrs), optionalAttrs));
  } else if (type === 'bodiedExtension') {
    node = schema.nodes.bodiedExtension.create(_objectSpread(_objectSpread({}, attrs), optionalAttrs), schema.nodeFromJSON(macro).content);
  } else if (type === 'inlineExtension') {
    node = schema.nodes.inlineExtension.create(attrs);
  }

  return normaliseNestedLayout(state, node);
}; // gets the macroProvider from the state and tries to autoConvert a given text

export var runMacroAutoConvert = function runMacroAutoConvert(state, text) {
  var macroPluginState = pluginKey.getState(state);
  var macroProvider = macroPluginState && macroPluginState.macroProvider;

  if (!macroProvider || !macroProvider.autoConvert) {
    return null;
  }

  var macroAttributes = macroProvider.autoConvert(text);

  if (!macroAttributes) {
    return null;
  } // decides which kind of macro to render (inline|bodied|bodyless)


  return resolveMacro(macroAttributes, state);
};
export var setMacroProvider = function setMacroProvider(provider) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(view) {
      var resolvedProvider;
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return provider;

            case 3:
              resolvedProvider = _context2.sent;
              assert(resolvedProvider && resolvedProvider.openMacroBrowser, "MacroProvider promise did not resolve to a valid instance of MacroProvider - ".concat(resolvedProvider));
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              resolvedProvider = null;

            case 10:
              view.dispatch(view.state.tr.setMeta(pluginKey, {
                macroProvider: resolvedProvider
              }));
              return _context2.abrupt("return", true);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 7]]);
    }));

    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }();
};