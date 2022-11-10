import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { Node } from 'prosemirror-model';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';
import { toJSON } from '../utils';
import { processRawValue, isEmptyDocument } from '../utils/document';
import { getEditorValueWithMedia, __temporaryFixForConfigPanel } from '../utils/action';
import { createDispatch } from '../event-dispatcher';
import { safeInsert } from 'prosemirror-utils';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import { findNodePosWithLocalId } from '../plugins/extension/utils';
import { getFeatureFlags } from '../plugins/feature-flags-context/get-feature-flags';
import { getCollabProvider } from '../plugins/collab-edit/native-collab-provider-plugin';
import deprecationWarnings from '../utils/deprecation-warnings';
import { findNodePosByFragmentLocalIds } from '../utils/nodes-by-localIds';
export default class EditorActions {
  constructor() {
    _defineProperty(this, "listeners", []);

    _defineProperty(this, "dispatchAnalyticsEvent", payload => {
      if (this.eventDispatcher) {
        const dispatch = createDispatch(this.eventDispatcher);
        dispatch(analyticsEventKey, {
          payload
        });
      }
    });

    _defineProperty(this, "getResolvedEditorState", async () => {
      var _getCollabProvider;

      if (!this.editorView) {
        throw new Error('Called getResolvedEditorState before editorView is ready');
      }

      const featureFlags = getFeatureFlags(this.editorView.state);

      if (!featureFlags.useNativeCollabPlugin) {
        const editorValue = await this.getValue();

        if (!editorValue) {
          throw new Error('editorValue is undefined');
        }

        return {
          content: editorValue,
          title: null,
          stepVersion: -1
        };
      }

      const editorView = this.editorView;
      await getEditorValueWithMedia(editorView);
      return (_getCollabProvider = getCollabProvider(editorView.state)) === null || _getCollabProvider === void 0 ? void 0 : _getCollabProvider.getFinalAcknowledgedState();
    });
  }

  static from(view, eventDispatcher, transformer) {
    const editorActions = new EditorActions();

    editorActions._privateRegisterEditor(view, eventDispatcher, transformer);

    return editorActions;
  } //#region private
  // This method needs to be public for context based helper components.


  _privateGetEditorView() {
    return this.editorView;
  }

  _privateGetEventDispatcher() {
    return this.eventDispatcher;
  } // This method needs to be public for EditorContext component.


  _privateRegisterEditor(editorView, eventDispatcher, contentTransformer) {
    this.contentTransformer = contentTransformer;
    this.eventDispatcher = eventDispatcher;

    if (!this.editorView && editorView) {
      this.editorView = editorView;
      this.listeners.forEach(cb => cb(editorView, eventDispatcher));
    } else if (this.editorView !== editorView) {
      throw new Error("Editor has already been registered! It's not allowed to re-register editor with the new Editor instance.");
    }

    if (this.contentTransformer) {
      this.contentEncode = this.contentTransformer.encode.bind(this.contentTransformer);
    }
  } // This method needs to be public for EditorContext component.


  _privateUnregisterEditor() {
    this.editorView = undefined;
    this.contentTransformer = undefined;
    this.contentEncode = undefined;
    this.eventDispatcher = undefined;
  }

  _privateSubscribe(cb) {
    // If editor is registered and somebody is trying to add a listener,
    // just call it first.
    if (this.editorView && this.eventDispatcher) {
      cb(this.editorView, this.eventDispatcher);
    }

    this.listeners.push(cb);
  }

  _privateUnsubscribe(cb) {
    this.listeners = this.listeners.filter(c => c !== cb);
  } //#endregion


  focus() {
    if (!this.editorView || this.editorView.hasFocus()) {
      return false;
    }

    this.editorView.focus();
    this.editorView.dispatch(this.editorView.state.tr.scrollIntoView());
    return true;
  }

  blur() {
    if (!this.editorView || !this.editorView.hasFocus()) {
      return false;
    }

    this.editorView.dom.blur();
    return true;
  }

  clear() {
    if (!this.editorView) {
      return false;
    }

    const editorView = this.editorView;
    const {
      state
    } = editorView;
    const tr = editorView.state.tr.setSelection(TextSelection.create(state.doc, 0, state.doc.nodeSize - 2)).deleteSelection();
    editorView.dispatch(tr);
    return true;
  }

  async __temporaryFixForConfigPanel() {
    const {
      editorView
    } = this;

    if (!editorView) {
      return;
    }

    __temporaryFixForConfigPanel(editorView);
  } // WARNING: this may be called repeatedly, async with care


  async getValue() {
    const {
      editorView
    } = this;

    if (!editorView) {
      return;
    }

    const doc = await getEditorValueWithMedia(editorView);
    const json = toJSON(doc);

    if (!this.contentEncode) {
      return json;
    }

    const nodeSanitized = Node.fromJSON(this.editorView.state.schema, json);
    return this.contentEncode(nodeSanitized);
  }

  getNodeByLocalId(id) {
    var _this$editorView;

    if ((_this$editorView = this.editorView) !== null && _this$editorView !== void 0 && _this$editorView.state) {
      var _findNodePosWithLocal, _this$editorView2;

      return (_findNodePosWithLocal = findNodePosWithLocalId((_this$editorView2 = this.editorView) === null || _this$editorView2 === void 0 ? void 0 : _this$editorView2.state, id)) === null || _findNodePosWithLocal === void 0 ? void 0 : _findNodePosWithLocal.node;
    }
  }

  getNodeByFragmentLocalId(id) {
    var _this$editorView3;

    if ((_this$editorView3 = this.editorView) !== null && _this$editorView3 !== void 0 && _this$editorView3.state) {
      var _this$editorView4;

      let nodes = findNodePosByFragmentLocalIds((_this$editorView4 = this.editorView) === null || _this$editorView4 === void 0 ? void 0 : _this$editorView4.state, [id]);
      return nodes.length > 0 ? nodes[0].node : undefined;
    }
  }
  /**
   * This method will return the currently selected `Node` if the selection is a `Node`.
   * Otherwise, if the selection is textual or a non-selectable `Node` within another selectable `Node`, the closest selectable parent `Node` will be returned.
   */


  getSelectedNode() {
    var _this$editorView5, _this$editorView5$sta;

    if ((_this$editorView5 = this.editorView) !== null && _this$editorView5 !== void 0 && (_this$editorView5$sta = _this$editorView5.state) !== null && _this$editorView5$sta !== void 0 && _this$editorView5$sta.selection) {
      var _findParentNode;

      const {
        selection
      } = this.editorView.state;

      if (selection instanceof NodeSelection) {
        return selection.node;
      }

      return (_findParentNode = findParentNode(node => Boolean(node.type.spec.selectable))(selection)) === null || _findParentNode === void 0 ? void 0 : _findParentNode.node;
    }
  }

  isDocumentEmpty() {
    // Unlikely case when editorView has been destroyed before calling isDocumentEmpty,
    // we treat this case as if document was empty.
    if (!this.editorView) {
      return true;
    }

    return isEmptyDocument(this.editorView.state.doc);
  }

  replaceDocument(rawValue, shouldScrollToBottom = true,
  /** @deprecated [ED-14158] shouldAddToHistory is not being used in this function */
  shouldAddToHistory = true) {
    deprecationWarnings('EditorActions.replaceDocument', {
      shouldAddToHistory
    }, [{
      property: 'shouldAddToHistory',
      description: '[ED-14158] EditorActions.replaceDocument does not use the shouldAddToHistory arg',
      type: 'removed'
    }]);

    if (!this.editorView || rawValue === undefined || rawValue === null) {
      return false;
    }

    if (this.eventDispatcher) {
      this.eventDispatcher.emit('resetEditorState', {
        doc: rawValue,
        shouldScrollToBottom
      });
    }

    return true;
  }

  replaceSelection(rawValue, tryToReplace) {
    if (!this.editorView) {
      return false;
    }

    const {
      state
    } = this.editorView;

    if (!rawValue) {
      const tr = state.tr.deleteSelection().scrollIntoView();
      this.editorView.dispatch(tr);
      return true;
    }

    const {
      schema
    } = state;
    const content = processRawValue(schema, rawValue);

    if (!content) {
      return false;
    } // try to find a place in the document where to insert a node if its not allowed at the cursor position by schema


    this.editorView.dispatch(safeInsert(content, undefined, tryToReplace)(state.tr).scrollIntoView());
    return true;
  }

  appendText(text) {
    if (!this.editorView || !text) {
      return false;
    }

    const {
      state
    } = this.editorView;
    const lastChild = state.doc.lastChild;

    if (lastChild && lastChild.type !== state.schema.nodes.paragraph) {
      return false;
    }

    const tr = state.tr.insertText(text).scrollIntoView();
    this.editorView.dispatch(tr);
    return true;
  }

}