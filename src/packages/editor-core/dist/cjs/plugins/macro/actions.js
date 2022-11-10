"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMacroProvider = exports.runMacroAutoConvert = exports.resolveMacro = exports.insertMacroFromMacroBrowser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _assert = _interopRequireDefault(require("assert"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _validator = require("@atlaskit/editor-common/validator");

var _utils = require("../../utils");

var _pluginFactory = require("../extension/plugin-factory");

var _analytics = require("../analytics");

var _extensionEvents = require("../analytics/types/extension-events");

var _pluginKey = require("./plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var insertMacroFromMacroBrowser = function insertMacroFromMacroBrowser(macroProvider, macroNode, isEditing) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(view) {
      var newMacro, state, dispatch, currentLayout, node, selection, schema, _schema$nodes, extension, inlineExtension, bodiedExtension, extensionState, targetSelectionSource, tr, isBodiedExtensionSelected, pos, _macroNode$attrs, extensionType, extensionKey, layout, localId;

      return _regenerator.default.wrap(function _callee$(_context) {
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
              extensionState = (0, _pluginFactory.getPluginState)(state);
              targetSelectionSource = _extensionEvents.TARGET_SELECTION_SOURCE.CURRENT_SELECTION;
              tr = state.tr;
              isBodiedExtensionSelected = !!(0, _prosemirrorUtils.findSelectedNodeOfType)([bodiedExtension])(selection); // When it's a bodiedExtension but not selected

              if (macroNode.type === bodiedExtension && !isBodiedExtensionSelected) {
                // `isEditing` is `false` when we are inserting from insert-block toolbar
                tr = isEditing ? (0, _prosemirrorUtils.replaceParentNodeOfType)(bodiedExtension, node)(tr) : (0, _prosemirrorUtils.safeInsert)(node)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

                tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, state.selection.anchor));
              } // If any extension is currently selected
              else if ((0, _prosemirrorUtils.findSelectedNodeOfType)([extension, bodiedExtension, inlineExtension])(selection)) {
                tr = (0, _prosemirrorUtils.replaceSelectedNode)(node)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

                tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, tr.mapping.map(state.selection.anchor)));
              } // When we loose the selection. This usually happens when Synchrony resets or changes
              // the selection when user is in the middle of updating an extension.
              else if (extensionState.element) {
                pos = view.posAtDOM(extensionState.element, -1);

                if (pos > -1) {
                  tr = tr.replaceWith(pos, pos + macroNode.nodeSize, node);
                  tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(pos)));
                  targetSelectionSource = _extensionEvents.TARGET_SELECTION_SOURCE.HTML_ELEMENT;
                }
              } // Only scroll if we have anything to update, best to avoid surprise scroll


              if (dispatch && tr.docChanged) {
                _macroNode$attrs = macroNode.attrs, extensionType = _macroNode$attrs.extensionType, extensionKey = _macroNode$attrs.extensionKey, layout = _macroNode$attrs.layout, localId = _macroNode$attrs.localId;
                (0, _analytics.addAnalytics)(state, tr, {
                  action: _analytics.ACTION.UPDATED,
                  actionSubject: _analytics.ACTION_SUBJECT.EXTENSION,
                  actionSubjectId: macroNode.type.name,
                  eventType: _analytics.EVENT_TYPE.TRACK,
                  attributes: {
                    inputMethod: isEditing ? _analytics.INPUT_METHOD.MACRO_BROWSER : _analytics.INPUT_METHOD.TOOLBAR,
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

exports.insertMacroFromMacroBrowser = insertMacroFromMacroBrowser;

var resolveMacro = function resolveMacro(macro, state, optionalAttrs) {
  if (!macro || !state) {
    return null;
  }

  var schema = state.schema;

  var _getValidNode = (0, _validator.getValidNode)(macro, schema),
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

  return (0, _utils.normaliseNestedLayout)(state, node);
}; // gets the macroProvider from the state and tries to autoConvert a given text


exports.resolveMacro = resolveMacro;

var runMacroAutoConvert = function runMacroAutoConvert(state, text) {
  var macroPluginState = _pluginKey.pluginKey.getState(state);

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

exports.runMacroAutoConvert = runMacroAutoConvert;

var setMacroProvider = function setMacroProvider(provider) {
  return /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(view) {
      var resolvedProvider;
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return provider;

            case 3:
              resolvedProvider = _context2.sent;
              (0, _assert.default)(resolvedProvider && resolvedProvider.openMacroBrowser, "MacroProvider promise did not resolve to a valid instance of MacroProvider - ".concat(resolvedProvider));
              _context2.next = 10;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              resolvedProvider = null;

            case 10:
              view.dispatch(view.state.tr.setMeta(_pluginKey.pluginKey, {
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

exports.setMacroProvider = setMacroProvider;