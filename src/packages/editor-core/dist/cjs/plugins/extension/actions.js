"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performNodeUpdate = exports.editSelectedExtension = exports.editExtension = exports.buildExtensionNode = void 0;
Object.defineProperty(exports, "transformSliceToRemoveOpenBodiedExtension", {
  enumerable: true,
  get: function get() {
    return _transforms.transformSliceToRemoveOpenBodiedExtension;
  }
});
exports.updateExtensionParams = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _transforms = require("@atlaskit/editor-common/transforms");

var _analytics = require("../analytics");

var _extensionEvents = require("../analytics/types/extension-events");

var _utils = require("./utils");

var _main = require("./pm-plugins/main");

var _extensionApi = require("./extension-api");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var buildExtensionNode = function buildExtensionNode(type, schema, attrs, content, marks) {
  switch (type) {
    case 'extension':
      return schema.nodes.extension.createChecked(attrs, content, marks);

    case 'inlineExtension':
      return schema.nodes.inlineExtension.createChecked(attrs, content, marks);

    case 'bodiedExtension':
      return schema.nodes.bodiedExtension.create(attrs, content, marks);
  }
};

exports.buildExtensionNode = buildExtensionNode;

var performNodeUpdate = function performNodeUpdate(type, newAttrs, content, marks, shouldScrollIntoView) {
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
    var isBodiedExtensionSelected = !!(0, _prosemirrorUtils.findSelectedNodeOfType)([bodiedExtension])(selection);
    var extensionState = (0, _main.getPluginState)(state);
    var targetSelectionSource = _extensionEvents.TARGET_SELECTION_SOURCE.CURRENT_SELECTION;
    var action = _analytics.ACTION.UPDATED;
    var tr = state.tr; // When it's a bodiedExtension but not selected

    if (newNode.type === bodiedExtension && !isBodiedExtensionSelected) {
      // Bodied extensions can trigger an update when the cursor is inside which means that there is no node selected.
      // To work around that we replace the parent and create a text selection instead of new node selection
      tr = (0, _prosemirrorUtils.replaceParentNodeOfType)(state.schema.nodes.bodiedExtension, newNode)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

      tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, state.selection.anchor));
    } // If any extension is currently selected
    else if ((0, _prosemirrorUtils.findSelectedNodeOfType)([extension, bodiedExtension, inlineExtension])(selection)) {
      tr = (0, _prosemirrorUtils.replaceSelectedNode)(newNode)(tr); // Replacing selected node doesn't update the selection. `selection.node` still returns the old node

      tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, tr.mapping.map(state.selection.anchor)));
    } // When we loose the selection. This usually happens when Synchrony resets or changes
    // the selection when user is in the middle of updating an extension.
    else if (extensionState.element) {
      var pos = view.posAtDOM(extensionState.element, -1);

      if (pos > -1) {
        tr = tr.replaceWith(pos, pos + (content.size || 0) + 1, newNode);
        tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(pos)));
        targetSelectionSource = _extensionEvents.TARGET_SELECTION_SOURCE.HTML_ELEMENT;
      } else {
        action = _analytics.ACTION.ERRORED;
      }
    } // Only scroll if we have anything to update, best to avoid surprise scroll


    if (dispatch && tr.docChanged) {
      var _newNode$attrs = newNode.attrs,
          extensionType = _newNode$attrs.extensionType,
          extensionKey = _newNode$attrs.extensionKey,
          layout = _newNode$attrs.layout,
          localId = _newNode$attrs.localId;
      (0, _analytics.addAnalytics)(state, tr, {
        action: action,
        actionSubject: _analytics.ACTION_SUBJECT.EXTENSION,
        actionSubjectId: newNode.type.name,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: _analytics.INPUT_METHOD.CONFIG_PANEL,
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

exports.performNodeUpdate = performNodeUpdate;

var updateExtensionParams = function updateExtensionParams(updateExtension, node, actions) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(state, dispatch, view) {
      var _node$node, attrs, type, content, marks, parameters, newParameters, newAttrs;

      return _regenerator.default.wrap(function _callee$(_context) {
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

exports.updateExtensionParams = updateExtensionParams;

var editSelectedExtension = function editSelectedExtension(editorActions) {
  var editorView = editorActions._privateGetEditorView();

  var _getPluginState = (0, _main.getPluginState)(editorView.state),
      updateExtension = _getPluginState.updateExtension;

  return editExtension(null, updateExtension)(editorView.state, editorView.dispatch, editorView);
};

exports.editSelectedExtension = editSelectedExtension;

var editExtension = function editExtension(macroProvider, updateExtension) {
  return function (state, dispatch, view) {
    if (!view) {
      return false;
    }

    var _getPluginState2 = (0, _main.getPluginState)(state),
        localId = _getPluginState2.localId;

    var nodeWithPos = (0, _utils.findExtensionWithLocalId)(state, localId);

    if (!nodeWithPos) {
      return false;
    }

    var editInLegacyMacroBrowser = (0, _extensionApi.getEditInLegacyMacroBrowser)({
      view: view,
      macroProvider: macroProvider || undefined
    });

    if (updateExtension) {
      updateExtension.then(function (updateMethod) {
        if (updateMethod && view) {
          var actions = (0, _extensionApi.createExtensionAPI)({
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

exports.editExtension = editExtension;