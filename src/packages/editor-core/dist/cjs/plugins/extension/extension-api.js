"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEditInLegacyMacroBrowser = exports.createExtensionAPI = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _validator = require("@atlaskit/adf-utils/validator");

var _editorJsonTransformer = require("@atlaskit/editor-json-transformer");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _macro = require("../macro");

var _pluginKey = require("../macro/plugin-key");

var _commands = require("./commands");

var _utils = require("./utils");

var _analytics = require("../analytics");

var _prosemirrorUtils = require("prosemirror-utils");

var getEditInLegacyMacroBrowser = function getEditInLegacyMacroBrowser(_ref) {
  var view = _ref.view,
      macroProvider = _ref.macroProvider;
  return function () {
    if (!view) {
      throw new Error("Missing view. Can't update without EditorView");
    }

    if (!macroProvider) {
      throw new Error("Missing macroProvider. Can't use the macro browser for updates");
    }

    var nodeWithPos = (0, _utils.getSelectedExtension)(view.state, true);

    if (!nodeWithPos) {
      throw new Error("Missing nodeWithPos. Can't determine position of node");
    }

    (0, _macro.insertMacroFromMacroBrowser)(macroProvider, nodeWithPos.node, true)(view);
  };
};

exports.getEditInLegacyMacroBrowser = getEditInLegacyMacroBrowser;

var extensionAPICallPayload = function extensionAPICallPayload(functionName) {
  return {
    action: _analytics.ACTION.INVOKED,
    actionSubject: _analytics.ACTION_SUBJECT.EXTENSION,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.EXTENSION_API,
    attributes: {
      functionName: functionName
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };
};

var createExtensionAPI = function createExtensionAPI(options) {
  var validate = (0, _validator.validator)();
  /**
   * Finds the node and its position by `localId`. Throws if the node could not be found.
   *
   * @returns {NodeWithPos}
   */

  var ensureNodePosByLocalId = function ensureNodePosByLocalId(localId, _ref2) {
    var opName = _ref2.opName;

    // Be extra cautious since 3rd party devs can use regular JS without type safety
    if (typeof localId !== 'string' || localId === '') {
      throw new Error("".concat(opName, "(): Invalid localId '").concat(localId, "'."));
    } // Find the node + position matching the given ID


    var state = options.editorView.state;
    var nodePos = (0, _utils.findNodePosWithLocalId)(state, localId);

    if (!nodePos) {
      throw new Error("".concat(opName, "(): Could not find node with ID '").concat(localId, "'."));
    }

    return nodePos;
  };

  var doc = {
    insertAfter: function insertAfter(localId, adf, opt) {
      try {
        validate(adf);
      } catch (e) {
        throw new Error("insertAfter(): Invalid ADF given.");
      }

      var nodePos = ensureNodePosByLocalId(localId, {
        opName: 'insertAfter'
      });
      var editorView = options.editorView;
      var dispatch = editorView.dispatch,
          state = editorView.state; // Validate the given ADF

      var tr = state.tr,
          schema = state.schema;
      var nodeType = schema.nodes[adf.type];

      if (!nodeType) {
        throw new Error("insertAfter(): Invalid ADF type '".concat(adf.type, "'."));
      }

      var fragment = _prosemirrorModel.Fragment.fromJSON(schema, adf.content);

      var marks = (adf.marks || []).map(function (markEntity) {
        return _prosemirrorModel.Mark.fromJSON(schema, markEntity);
      });
      var newNode = nodeType === null || nodeType === void 0 ? void 0 : nodeType.createChecked(adf.attrs, fragment, marks);

      if (!newNode) {
        throw new Error('insertAfter(): Could not create a node for given ADFEntity.');
      }

      var insertPosition = nodePos.pos + nodePos.node.nodeSize;
      tr.insert(insertPosition, newNode); // Validate if the document is valid at this point

      try {
        tr.doc.check();
      } catch (err) {
        throw new Error("insertAfter(): The given ADFEntity cannot be inserted in the current position.\n".concat(err));
      } // Analytics - tracking the api call


      var apiCallPayload = extensionAPICallPayload('insertAfter');
      (0, _analytics.addAnalytics)(state, tr, apiCallPayload); // Analytics - tracking node types added

      var nodesAdded = [newNode];
      newNode.descendants(function (node) {
        nodesAdded.push(node);
        return true;
      });
      nodesAdded.forEach(function (node) {
        var _node$attrs = node.attrs,
            extensionKey = _node$attrs.extensionKey,
            extensionType = _node$attrs.extensionType;
        var dataConsumerMark = (0, _utils.getDataConsumerMark)(node);
        var stringIds = (dataConsumerMark === null || dataConsumerMark === void 0 ? void 0 : dataConsumerMark.attrs.sources.map(function (sourceId) {
          return sourceId;
        })) || [];
        var hasReferentiality = !!dataConsumerMark;
        var nodeTypesReferenced = hasReferentiality ? (0, _utils.getNodeTypesReferenced)(stringIds, state) : undefined; // fire off analytics for this ADF

        var payload = {
          action: _analytics.ACTION.INSERTED,
          actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
          attributes: {
            nodeType: node.type.name,
            inputMethod: _analytics.INPUT_METHOD.EXTENSION_API,
            hasReferentiality: hasReferentiality,
            nodeTypesReferenced: nodeTypesReferenced,
            layout: node.attrs.layout,
            extensionType: extensionType,
            extensionKey: extensionKey
          },
          eventType: _analytics.EVENT_TYPE.TRACK
        };
        (0, _analytics.addAnalytics)(state, tr, payload);
      });

      if (opt && opt.allowSelectionToNewNode) {
        tr.setSelection(new _prosemirrorState.NodeSelection(tr.doc.resolve(insertPosition)));
      }

      dispatch(tr);
    },
    scrollTo: function scrollTo(localId) {
      var nodePos = ensureNodePosByLocalId(localId, {
        opName: 'scrollTo'
      }); // Analytics - tracking the api call

      var apiCallPayload = extensionAPICallPayload('scrollTo');
      var _options$editorView = options.editorView,
          dispatch = _options$editorView.dispatch,
          state = _options$editorView.state;
      var tr = state.tr;
      tr = (0, _analytics.addAnalytics)(state, tr, apiCallPayload);
      tr = (0, _prosemirrorUtils.setTextSelection)(nodePos.pos)(tr);
      tr = tr.scrollIntoView();
      dispatch(tr);
    },
    update: function update(localId, mutationCallback) {
      var _changedValues$marks;

      var _ensureNodePosByLocal = ensureNodePosByLocalId(localId, {
        opName: 'update'
      }),
          node = _ensureNodePosByLocal.node,
          pos = _ensureNodePosByLocal.pos;

      var _options$editorView2 = options.editorView,
          dispatch = _options$editorView2.dispatch,
          state = _options$editorView2.state;
      var tr = state.tr,
          schema = state.schema;
      var changedValues = mutationCallback({
        attrs: node.attrs,
        marks: node.marks.map(function (pmMark) {
          return {
            type: pmMark.type.name,
            attrs: pmMark.attrs
          };
        })
      });

      var _state$doc$resolve = state.doc.resolve(pos),
          parent = _state$doc$resolve.parent;

      var ensureValidMark = function ensureValidMark(mark) {
        if ((0, _typeof2.default)(mark) !== 'object' || Array.isArray(mark)) {
          throw new Error("update(): Invalid mark given.");
        } // Ensure that the given mark is present in the schema


        var markType = schema.marks[mark.type];

        if (!markType) {
          throw new Error("update(): Invalid ADF mark type '".concat(mark.type, "'."));
        }

        if (!parent.type.allowsMarkType(markType)) {
          throw new Error("update(): Parent of type '".concat(parent.type.name, "' does not allow marks of type '").concat(mark.type, "'."));
        }

        return {
          mark: markType,
          attrs: mark.attrs
        };
      };

      var newMarks = (_changedValues$marks = changedValues.marks) === null || _changedValues$marks === void 0 ? void 0 : _changedValues$marks.map(ensureValidMark).map(function (_ref3) {
        var mark = _ref3.mark,
            attrs = _ref3.attrs;
        return mark.create(attrs);
      }); // Validate if the new attributes and marks result in a valid node and adf.

      try {
        var newNode = node.type.createChecked(changedValues.attrs, node.content, newMarks);
        var newNodeAdf = new _editorJsonTransformer.JSONTransformer().encodeNode(newNode);
        validate(newNodeAdf);
      } catch (err) {
        throw new Error("update(): The given ADFEntity cannot be inserted in the current position.\n".concat(err));
      }

      tr.setNodeMarkup(pos, undefined, changedValues.attrs, newMarks); // Analytics - tracking the api call

      var apiCallPayload = extensionAPICallPayload('update');
      (0, _analytics.addAnalytics)(state, tr, apiCallPayload);
      dispatch(tr);
    }
  };
  return {
    editInContextPanel: function editInContextPanel(transformBefore, transformAfter) {
      var editorView = options.editorView;
      (0, _commands.setEditingContextToContextPanel)(transformBefore, transformAfter)(editorView.state, editorView.dispatch, editorView);
    },
    _editInLegacyMacroBrowser: function _editInLegacyMacroBrowser() {
      var editorView = options.editorView;
      var editInLegacy = options.editInLegacyMacroBrowser;

      if (!editInLegacy) {
        var macroState = _pluginKey.pluginKey.getState(editorView.state);

        editInLegacy = getEditInLegacyMacroBrowser({
          view: options.editorView,
          macroProvider: (macroState === null || macroState === void 0 ? void 0 : macroState.macroProvider) || undefined
        });
      }

      editInLegacy();
    },
    doc: doc
  };
};

exports.createExtensionAPI = createExtensionAPI;