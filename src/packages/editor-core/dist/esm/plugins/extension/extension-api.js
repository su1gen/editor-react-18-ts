import _typeof from "@babel/runtime/helpers/typeof";
import { validator } from '@atlaskit/adf-utils/validator';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Fragment, Mark } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import { insertMacroFromMacroBrowser } from '../macro';
import { pluginKey as macroPluginKey } from '../macro/plugin-key';
import { setEditingContextToContextPanel } from './commands';
import { findNodePosWithLocalId, getSelectedExtension } from './utils';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { getNodeTypesReferenced, getDataConsumerMark } from './utils';
import { setTextSelection } from 'prosemirror-utils';
export var getEditInLegacyMacroBrowser = function getEditInLegacyMacroBrowser(_ref) {
  var view = _ref.view,
      macroProvider = _ref.macroProvider;
  return function () {
    if (!view) {
      throw new Error("Missing view. Can't update without EditorView");
    }

    if (!macroProvider) {
      throw new Error("Missing macroProvider. Can't use the macro browser for updates");
    }

    var nodeWithPos = getSelectedExtension(view.state, true);

    if (!nodeWithPos) {
      throw new Error("Missing nodeWithPos. Can't determine position of node");
    }

    insertMacroFromMacroBrowser(macroProvider, nodeWithPos.node, true)(view);
  };
};

var extensionAPICallPayload = function extensionAPICallPayload(functionName) {
  return {
    action: ACTION.INVOKED,
    actionSubject: ACTION_SUBJECT.EXTENSION,
    actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_API,
    attributes: {
      functionName: functionName
    },
    eventType: EVENT_TYPE.TRACK
  };
};

export var createExtensionAPI = function createExtensionAPI(options) {
  var validate = validator();
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
    var nodePos = findNodePosWithLocalId(state, localId);

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

      var fragment = Fragment.fromJSON(schema, adf.content);
      var marks = (adf.marks || []).map(function (markEntity) {
        return Mark.fromJSON(schema, markEntity);
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
      addAnalytics(state, tr, apiCallPayload); // Analytics - tracking node types added

      var nodesAdded = [newNode];
      newNode.descendants(function (node) {
        nodesAdded.push(node);
        return true;
      });
      nodesAdded.forEach(function (node) {
        var _node$attrs = node.attrs,
            extensionKey = _node$attrs.extensionKey,
            extensionType = _node$attrs.extensionType;
        var dataConsumerMark = getDataConsumerMark(node);
        var stringIds = (dataConsumerMark === null || dataConsumerMark === void 0 ? void 0 : dataConsumerMark.attrs.sources.map(function (sourceId) {
          return sourceId;
        })) || [];
        var hasReferentiality = !!dataConsumerMark;
        var nodeTypesReferenced = hasReferentiality ? getNodeTypesReferenced(stringIds, state) : undefined; // fire off analytics for this ADF

        var payload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: {
            nodeType: node.type.name,
            inputMethod: INPUT_METHOD.EXTENSION_API,
            hasReferentiality: hasReferentiality,
            nodeTypesReferenced: nodeTypesReferenced,
            layout: node.attrs.layout,
            extensionType: extensionType,
            extensionKey: extensionKey
          },
          eventType: EVENT_TYPE.TRACK
        };
        addAnalytics(state, tr, payload);
      });

      if (opt && opt.allowSelectionToNewNode) {
        tr.setSelection(new NodeSelection(tr.doc.resolve(insertPosition)));
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
      tr = addAnalytics(state, tr, apiCallPayload);
      tr = setTextSelection(nodePos.pos)(tr);
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
        if (_typeof(mark) !== 'object' || Array.isArray(mark)) {
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
        var newNodeAdf = new JSONTransformer().encodeNode(newNode);
        validate(newNodeAdf);
      } catch (err) {
        throw new Error("update(): The given ADFEntity cannot be inserted in the current position.\n".concat(err));
      }

      tr.setNodeMarkup(pos, undefined, changedValues.attrs, newMarks); // Analytics - tracking the api call

      var apiCallPayload = extensionAPICallPayload('update');
      addAnalytics(state, tr, apiCallPayload);
      dispatch(tr);
    }
  };
  return {
    editInContextPanel: function editInContextPanel(transformBefore, transformAfter) {
      var editorView = options.editorView;
      setEditingContextToContextPanel(transformBefore, transformAfter)(editorView.state, editorView.dispatch, editorView);
    },
    _editInLegacyMacroBrowser: function _editInLegacyMacroBrowser() {
      var editorView = options.editorView;
      var editInLegacy = options.editInLegacyMacroBrowser;

      if (!editInLegacy) {
        var macroState = macroPluginKey.getState(editorView.state);
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