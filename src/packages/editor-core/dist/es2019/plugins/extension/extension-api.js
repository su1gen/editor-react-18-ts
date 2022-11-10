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
export const getEditInLegacyMacroBrowser = ({
  view,
  macroProvider
}) => {
  return () => {
    if (!view) {
      throw new Error(`Missing view. Can't update without EditorView`);
    }

    if (!macroProvider) {
      throw new Error(`Missing macroProvider. Can't use the macro browser for updates`);
    }

    const nodeWithPos = getSelectedExtension(view.state, true);

    if (!nodeWithPos) {
      throw new Error(`Missing nodeWithPos. Can't determine position of node`);
    }

    insertMacroFromMacroBrowser(macroProvider, nodeWithPos.node, true)(view);
  };
};

const extensionAPICallPayload = functionName => ({
  action: ACTION.INVOKED,
  actionSubject: ACTION_SUBJECT.EXTENSION,
  actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_API,
  attributes: {
    functionName
  },
  eventType: EVENT_TYPE.TRACK
});

export const createExtensionAPI = options => {
  const validate = validator();
  /**
   * Finds the node and its position by `localId`. Throws if the node could not be found.
   *
   * @returns {NodeWithPos}
   */

  const ensureNodePosByLocalId = (localId, {
    opName
  }) => {
    // Be extra cautious since 3rd party devs can use regular JS without type safety
    if (typeof localId !== 'string' || localId === '') {
      throw new Error(`${opName}(): Invalid localId '${localId}'.`);
    } // Find the node + position matching the given ID


    const {
      editorView: {
        state
      }
    } = options;
    const nodePos = findNodePosWithLocalId(state, localId);

    if (!nodePos) {
      throw new Error(`${opName}(): Could not find node with ID '${localId}'.`);
    }

    return nodePos;
  };

  const doc = {
    insertAfter: (localId, adf, opt) => {
      try {
        validate(adf);
      } catch (e) {
        throw new Error(`insertAfter(): Invalid ADF given.`);
      }

      const nodePos = ensureNodePosByLocalId(localId, {
        opName: 'insertAfter'
      });
      const {
        editorView
      } = options;
      const {
        dispatch,
        state
      } = editorView; // Validate the given ADF

      const {
        tr,
        schema
      } = state;
      const nodeType = schema.nodes[adf.type];

      if (!nodeType) {
        throw new Error(`insertAfter(): Invalid ADF type '${adf.type}'.`);
      }

      const fragment = Fragment.fromJSON(schema, adf.content);
      const marks = (adf.marks || []).map(markEntity => Mark.fromJSON(schema, markEntity));
      const newNode = nodeType === null || nodeType === void 0 ? void 0 : nodeType.createChecked(adf.attrs, fragment, marks);

      if (!newNode) {
        throw new Error('insertAfter(): Could not create a node for given ADFEntity.');
      }

      const insertPosition = nodePos.pos + nodePos.node.nodeSize;
      tr.insert(insertPosition, newNode); // Validate if the document is valid at this point

      try {
        tr.doc.check();
      } catch (err) {
        throw new Error(`insertAfter(): The given ADFEntity cannot be inserted in the current position.\n${err}`);
      } // Analytics - tracking the api call


      const apiCallPayload = extensionAPICallPayload('insertAfter');
      addAnalytics(state, tr, apiCallPayload); // Analytics - tracking node types added

      const nodesAdded = [newNode];
      newNode.descendants(node => {
        nodesAdded.push(node);
        return true;
      });
      nodesAdded.forEach(node => {
        const {
          extensionKey,
          extensionType
        } = node.attrs;
        const dataConsumerMark = getDataConsumerMark(node);
        const stringIds = (dataConsumerMark === null || dataConsumerMark === void 0 ? void 0 : dataConsumerMark.attrs.sources.map(sourceId => sourceId)) || [];
        const hasReferentiality = !!dataConsumerMark;
        const nodeTypesReferenced = hasReferentiality ? getNodeTypesReferenced(stringIds, state) : undefined; // fire off analytics for this ADF

        const payload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: {
            nodeType: node.type.name,
            inputMethod: INPUT_METHOD.EXTENSION_API,
            hasReferentiality,
            nodeTypesReferenced,
            layout: node.attrs.layout,
            extensionType,
            extensionKey
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
    scrollTo: localId => {
      const nodePos = ensureNodePosByLocalId(localId, {
        opName: 'scrollTo'
      }); // Analytics - tracking the api call

      const apiCallPayload = extensionAPICallPayload('scrollTo');
      const {
        editorView: {
          dispatch,
          state
        }
      } = options;
      let {
        tr
      } = state;
      tr = addAnalytics(state, tr, apiCallPayload);
      tr = setTextSelection(nodePos.pos)(tr);
      tr = tr.scrollIntoView();
      dispatch(tr);
    },
    update: (localId, mutationCallback) => {
      var _changedValues$marks;

      const {
        node,
        pos
      } = ensureNodePosByLocalId(localId, {
        opName: 'update'
      });
      const {
        editorView: {
          dispatch,
          state
        }
      } = options;
      const {
        tr,
        schema
      } = state;
      const changedValues = mutationCallback({
        attrs: node.attrs,
        marks: node.marks.map(pmMark => ({
          type: pmMark.type.name,
          attrs: pmMark.attrs
        }))
      });
      const {
        parent
      } = state.doc.resolve(pos);

      const ensureValidMark = mark => {
        if (typeof mark !== 'object' || Array.isArray(mark)) {
          throw new Error(`update(): Invalid mark given.`);
        } // Ensure that the given mark is present in the schema


        const markType = schema.marks[mark.type];

        if (!markType) {
          throw new Error(`update(): Invalid ADF mark type '${mark.type}'.`);
        }

        if (!parent.type.allowsMarkType(markType)) {
          throw new Error(`update(): Parent of type '${parent.type.name}' does not allow marks of type '${mark.type}'.`);
        }

        return {
          mark: markType,
          attrs: mark.attrs
        };
      };

      const newMarks = (_changedValues$marks = changedValues.marks) === null || _changedValues$marks === void 0 ? void 0 : _changedValues$marks.map(ensureValidMark).map(({
        mark,
        attrs
      }) => mark.create(attrs)); // Validate if the new attributes and marks result in a valid node and adf.

      try {
        const newNode = node.type.createChecked(changedValues.attrs, node.content, newMarks);
        const newNodeAdf = new JSONTransformer().encodeNode(newNode);
        validate(newNodeAdf);
      } catch (err) {
        throw new Error(`update(): The given ADFEntity cannot be inserted in the current position.\n${err}`);
      }

      tr.setNodeMarkup(pos, undefined, changedValues.attrs, newMarks); // Analytics - tracking the api call

      const apiCallPayload = extensionAPICallPayload('update');
      addAnalytics(state, tr, apiCallPayload);
      dispatch(tr);
    }
  };
  return {
    editInContextPanel: (transformBefore, transformAfter) => {
      const {
        editorView
      } = options;
      setEditingContextToContextPanel(transformBefore, transformAfter)(editorView.state, editorView.dispatch, editorView);
    },
    _editInLegacyMacroBrowser: () => {
      const {
        editorView
      } = options;
      let editInLegacy = options.editInLegacyMacroBrowser;

      if (!editInLegacy) {
        const macroState = macroPluginKey.getState(editorView.state);
        editInLegacy = getEditInLegacyMacroBrowser({
          view: options.editorView,
          macroProvider: (macroState === null || macroState === void 0 ? void 0 : macroState.macroProvider) || undefined
        });
      }

      editInLegacy();
    },
    doc
  };
};