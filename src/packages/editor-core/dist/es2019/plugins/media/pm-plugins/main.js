import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import ReactDOM from 'react-dom';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { NodeSelection } from 'prosemirror-state';
import { insertPoint } from 'prosemirror-transform';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { ErrorReporter, browser } from '@atlaskit/editor-common/utils';
import assert from 'assert';
import { findDomRefAtPos, isNodeSelection } from 'prosemirror-utils';
import { insertMediaSingleNode, isMediaSingle } from '../utils/media-single';
import DropPlaceholder from '../ui/Media/DropPlaceholder';
import { insertMediaGroupNode, insertMediaInlineNode, canInsertMediaInline } from '../utils/media-files';
import { isInsidePotentialEmptyParagraph, removeMediaNode, splitMediaGroup } from '../utils/media-common';
import * as helpers from '../commands/helpers';
import { updateMediaNodeAttrs } from '../commands/helpers';
import { stateKey } from './plugin-key';
import PickerFacade from '../picker-facade';
import { INPUT_METHOD } from '../../analytics/types';
import { isImage } from '../utils/is-image';
import { isInEmptyLine } from '../../../utils/document';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { isInListItem } from '../../../utils';
import { CAPTION_PLACEHOLDER_ID } from '../ui/CaptionPlaceholder';
import { RawIntlProvider } from 'react-intl-next';
import { MediaTaskManager } from './mediaTaskManager';
export { stateKey } from './plugin-key';

const createDropPlaceholder = (intl, allowDropLine) => {
  const dropPlaceholder = document.createElement('div');
  const createElement = React.createElement;

  if (allowDropLine) {
    ReactDOM.render(createElement(RawIntlProvider, {
      value: intl
    }, createElement(DropPlaceholder, {
      type: 'single'
    })), dropPlaceholder);
  } else {
    ReactDOM.render(createElement(RawIntlProvider, {
      value: intl
    }, createElement(DropPlaceholder)), dropPlaceholder);
  }

  return dropPlaceholder;
};

const MEDIA_RESOLVED_STATES = ['ready', 'error', 'cancelled'];
export class MediaPluginStateImplementation {
  constructor(_state, options, mediaOptions, _dispatch) {
    _defineProperty(this, "allowsUploads", false);

    _defineProperty(this, "ignoreLinks", false);

    _defineProperty(this, "waitForMediaUpload", true);

    _defineProperty(this, "allUploadsFinished", true);

    _defineProperty(this, "showDropzone", false);

    _defineProperty(this, "isFullscreen", false);

    _defineProperty(this, "layout", 'center');

    _defineProperty(this, "mediaNodes", []);

    _defineProperty(this, "mediaGroupNodes", {});

    _defineProperty(this, "destroyed", false);

    _defineProperty(this, "removeOnCloseListener", () => {});

    _defineProperty(this, "onPopupToggleCallback", () => {});

    _defineProperty(this, "nodeCount", new Map());

    _defineProperty(this, "taskManager", new MediaTaskManager());

    _defineProperty(this, "pickers", []);

    _defineProperty(this, "pickerPromises", []);

    _defineProperty(this, "onContextIdentifierProvider", async (_name, provider) => {
      if (provider) {
        this.contextIdentifierProvider = await provider;
      }
    });

    _defineProperty(this, "setMediaProvider", async mediaProvider => {
      if (!mediaProvider) {
        this.destroyPickers();
        this.allowsUploads = false;

        if (!this.destroyed) {
          this.view.dispatch(this.view.state.tr.setMeta(stateKey, {
            allowsUploads: this.allowsUploads
          }));
        }

        return;
      } // TODO disable (not destroy!) pickers until mediaProvider is resolved


      try {
        this.mediaProvider = await mediaProvider; // TODO [MS-2038]: remove once context api is removed
        // We want to re assign the view and upload configs if they are missing for backwards compatibility
        // as currently integrators can pass context || mediaClientConfig

        if (!this.mediaProvider.viewMediaClientConfig) {
          const viewMediaClientConfig = this.mediaProvider.viewMediaClientConfig;

          if (viewMediaClientConfig) {
            this.mediaProvider.viewMediaClientConfig = viewMediaClientConfig;
          }
        }

        assert(this.mediaProvider.viewMediaClientConfig, `MediaProvider promise did not resolve to a valid instance of MediaProvider - ${this.mediaProvider}`);
      } catch (err) {
        const wrappedError = new Error(`Media functionality disabled due to rejected provider: ${err instanceof Error ? err.message : String(err)}`);
        this.errorReporter.captureException(wrappedError);
        this.destroyPickers();
        this.allowsUploads = false;

        if (!this.destroyed) {
          this.view.dispatch(this.view.state.tr.setMeta(stateKey, {
            allowsUploads: this.allowsUploads
          }));
        }

        return;
      }

      this.mediaClientConfig = this.mediaProvider.viewMediaClientConfig;
      this.allowsUploads = !!this.mediaProvider.uploadMediaClientConfig;
      const {
        view,
        allowsUploads
      } = this; // make sure editable DOM node is mounted

      if (!this.destroyed && view && view.dom.parentNode) {
        // make PM plugin aware of the state change to update UI during 'apply' hook
        view.dispatch(view.state.tr.setMeta(stateKey, {
          allowsUploads
        }));
      }

      if (this.allowsUploads) {
        this.uploadMediaClientConfig = this.mediaProvider.uploadMediaClientConfig;

        if (this.mediaProvider.uploadParams && this.uploadMediaClientConfig) {
          await this.initPickers(this.mediaProvider.uploadParams, PickerFacade);
        } else {
          this.destroyPickers();
        }
      } else {
        this.destroyPickers();
      }
    });

    _defineProperty(this, "getMediaOptions", () => this.options);

    _defineProperty(this, "isMediaSchemaNode", ({
      type
    }) => {
      var _this$mediaOptions;

      const {
        mediaInline,
        mediaSingle,
        media
      } = this.view.state.schema.nodes;

      if (getMediaFeatureFlag('mediaInline', (_this$mediaOptions = this.mediaOptions) === null || _this$mediaOptions === void 0 ? void 0 : _this$mediaOptions.featureFlags)) {
        return type === mediaSingle || type === media || type === mediaInline;
      }

      return type === mediaSingle;
    });

    _defineProperty(this, "insertFile", (mediaState, onMediaStateChanged, pickerType) => {
      var _mediaState$collectio, _this$mediaOptions2;

      const {
        state
      } = this.view;
      const mediaStateWithContext = { ...mediaState,
        contextId: this.contextIdentifierProvider ? this.contextIdentifierProvider.objectId : undefined
      };
      const collection = (_mediaState$collectio = mediaState.collection) !== null && _mediaState$collectio !== void 0 ? _mediaState$collectio : this.collectionFromProvider();

      if (collection === undefined) {
        return;
      } // We need to dispatch the change to event dispatcher only for successful files


      if (mediaState.status !== 'error') {
        this.updateAndDispatch({
          allUploadsFinished: false
        });
      }

      if (isMediaSingle(state.schema, mediaStateWithContext.fileMimeType)) {
        insertMediaSingleNode(this.view, mediaStateWithContext, this.getInputMethod(pickerType), collection, this.mediaOptions && this.mediaOptions.alignLeftOnInsert);
      } else if (getMediaFeatureFlag('mediaInline', (_this$mediaOptions2 = this.mediaOptions) === null || _this$mediaOptions2 === void 0 ? void 0 : _this$mediaOptions2.featureFlags) && !isInEmptyLine(state) && (!isInsidePotentialEmptyParagraph(state) || isInListItem(state)) && canInsertMediaInline(state)) {
        insertMediaInlineNode(this.view, mediaStateWithContext, collection, this.getInputMethod(pickerType));
      } else {
        insertMediaGroupNode(this.view, [mediaStateWithContext], collection, this.getInputMethod(pickerType));
      } // do events when media state changes


      onMediaStateChanged(this.handleMediaState); // handle waiting for upload complete

      const isEndState = state => state.status && MEDIA_RESOLVED_STATES.indexOf(state.status) !== -1;

      if (!isEndState(mediaStateWithContext)) {
        const uploadingPromise = new Promise(resolve => {
          onMediaStateChanged(newState => {
            // When media item reaches its final state, remove listener and resolve
            if (isEndState(newState)) {
              resolve(newState);
            }
          });
        });
        this.taskManager.addPendingTask(uploadingPromise, mediaStateWithContext.id).then(() => {
          this.updateAndDispatch({
            allUploadsFinished: true
          });
        });
      } // refocus the view


      const {
        view
      } = this;

      if (!view.hasFocus()) {
        view.focus();
      }
    });

    _defineProperty(this, "addPendingTask", task => {
      this.taskManager.addPendingTask(task);
    });

    _defineProperty(this, "splitMediaGroup", () => splitMediaGroup(this.view));

    _defineProperty(this, "onPopupPickerClose", () => {
      this.onPopupToggleCallback(false);
    });

    _defineProperty(this, "showMediaPicker", () => {
      if (this.openMediaPickerBrowser) {
        return this.openMediaPickerBrowser();
      }

      this.onPopupToggleCallback(true);
    });

    _defineProperty(this, "setBrowseFn", browseFn => {
      this.openMediaPickerBrowser = browseFn;
    });

    _defineProperty(this, "onPopupToggle", onPopupToggleCallback => {
      this.onPopupToggleCallback = onPopupToggleCallback;
    });

    _defineProperty(this, "waitForPendingTasks", this.taskManager.waitForPendingTasks);

    _defineProperty(this, "handleMediaNodeRemoval", (node, getPos) => {
      let getNode = node;

      if (!getNode) {
        getNode = this.view.state.doc.nodeAt(getPos());
      }

      removeMediaNode(this.view, getNode, getPos);
    });

    _defineProperty(this, "trackMediaNodeAddition", node => {
      var _this$nodeCount$get;

      const id = node.attrs.id;
      const count = (_this$nodeCount$get = this.nodeCount.get(id)) !== null && _this$nodeCount$get !== void 0 ? _this$nodeCount$get : 0;

      if (count === 0) {
        this.taskManager.resumePendingTask(id);
      }

      this.nodeCount.set(id, count + 1);
    });

    _defineProperty(this, "trackMediaNodeRemoval", node => {
      var _this$nodeCount$get2;

      const id = node.attrs.id;
      const count = (_this$nodeCount$get2 = this.nodeCount.get(id)) !== null && _this$nodeCount$get2 !== void 0 ? _this$nodeCount$get2 : 0;

      if (count === 1) {
        this.taskManager.cancelPendingTask(id);
      }

      this.nodeCount.set(id, count - 1);
    });

    _defineProperty(this, "handleMediaNodeMount", (node, getPos) => {
      this.trackMediaNodeAddition(node);
      this.mediaNodes.unshift({
        node,
        getPos
      });
    });

    _defineProperty(this, "handleMediaNodeUnmount", oldNode => {
      this.trackMediaNodeRemoval(oldNode);
      this.mediaNodes = this.mediaNodes.filter(({
        node
      }) => oldNode !== node);
    });

    _defineProperty(this, "handleMediaGroupUpdate", (oldNodes, newNodes) => {
      const addedNodes = newNodes.filter(node => oldNodes.every(oldNode => oldNode.attrs.id !== node.attrs.id));
      const removedNodes = oldNodes.filter(node => newNodes.every(newNode => newNode.attrs.id !== node.attrs.id));
      addedNodes.forEach(node => {
        this.trackMediaNodeAddition(node);
      });
      removedNodes.forEach(oldNode => {
        this.trackMediaNodeRemoval(oldNode);
      });
    });

    _defineProperty(this, "findMediaNode", id => {
      return helpers.findMediaSingleNode(this, id);
    });

    _defineProperty(this, "destroyAllPickers", pickers => {
      pickers.forEach(picker => picker.destroy());
      this.pickers.splice(0, this.pickers.length);
    });

    _defineProperty(this, "destroyPickers", () => {
      const {
        pickers,
        pickerPromises
      } = this; // If pickerPromises and pickers are the same length
      // All pickers have resolved and we safely destroy them
      // Otherwise wait for them to resolve then destroy.

      if (pickerPromises.length === pickers.length) {
        this.destroyAllPickers(this.pickers);
      } else {
        Promise.all(pickerPromises).then(resolvedPickers => this.destroyAllPickers(resolvedPickers));
      }

      this.customPicker = undefined;
    });

    _defineProperty(this, "getInputMethod", pickerType => {
      switch (pickerType) {
        case 'clipboard':
          return INPUT_METHOD.CLIPBOARD;

        case 'dropzone':
          return INPUT_METHOD.DRAG_AND_DROP;
      }

      return;
    });

    _defineProperty(this, "updateMediaNodeAttrs", (id, attrs, isMediaSingle) => {
      const {
        view
      } = this;

      if (!view) {
        return;
      }

      return updateMediaNodeAttrs(id, attrs, isMediaSingle)(view.state, view.dispatch);
    });

    _defineProperty(this, "handleMediaState", state => {
      switch (state.status) {
        case 'error':
          const {
            uploadErrorHandler
          } = this.options;

          if (uploadErrorHandler) {
            uploadErrorHandler(state);
          }

          break;

        case 'mobile-upload-end':
          const attrs = {
            id: state.publicId || state.id
          };

          if (typeof state.collection === 'string') {
            attrs.collection = state.collection;
          }

          this.updateMediaNodeAttrs(state.id, attrs, isMediaSingle(this.view.state.schema, state.fileMimeType));
          delete this.mediaGroupNodes[state.id];
          break;
      }
    });

    _defineProperty(this, "removeNodeById", state => {
      const {
        id
      } = state;
      const mediaNodeWithPos = helpers.findMediaNode(this, id, isImage(state.fileMimeType));

      if (mediaNodeWithPos) {
        removeMediaNode(this.view, mediaNodeWithPos.node, mediaNodeWithPos.getPos);
      }
    });

    _defineProperty(this, "removeSelectedMediaContainer", () => {
      const {
        view
      } = this;
      const selectedNode = this.selectedMediaContainerNode();

      if (!selectedNode) {
        return false;
      }

      let {
        from
      } = view.state.selection;
      removeMediaNode(view, selectedNode.firstChild, () => from + 1);
      return true;
    });

    _defineProperty(this, "selectedMediaContainerNode", () => {
      const {
        selection
      } = this.view.state;

      if (selection instanceof NodeSelection && this.isMediaSchemaNode(selection.node)) {
        return selection.node;
      }

      return;
    });

    _defineProperty(this, "handleDrag", dragState => {
      const isActive = dragState === 'enter';

      if (this.showDropzone === isActive) {
        return;
      }

      this.showDropzone = isActive;
      const {
        dispatch,
        state
      } = this.view; // Trigger state change to be able to pick it up in the decorations handler

      dispatch(state.tr);
    });

    this.options = options;
    this.mediaOptions = mediaOptions;
    this.dispatch = _dispatch;
    this.waitForMediaUpload = options.waitForMediaUpload === undefined ? true : options.waitForMediaUpload;
    const {
      nodes
    } = _state.schema;
    assert(nodes.media && (nodes.mediaGroup || nodes.mediaSingle), 'Editor: unable to init media plugin - media or mediaGroup/mediaSingle node absent in schema');
    options.providerFactory.subscribe('mediaProvider', (_name, provider) => this.setMediaProvider(provider));
    options.providerFactory.subscribe('contextIdentifierProvider', this.onContextIdentifierProvider);
    this.errorReporter = options.errorReporter || new ErrorReporter();
  }

  updateElement() {
    let newElement;
    const selectedContainer = this.selectedMediaContainerNode();

    if (selectedContainer && this.isMediaSchemaNode(selectedContainer)) {
      newElement = this.getDomElement(this.view.domAtPos.bind(this.view));
    }

    if (this.element !== newElement) {
      this.element = newElement;
    }
  }

  getDomElement(domAtPos) {
    const {
      selection
    } = this.view.state;

    if (!(selection instanceof NodeSelection)) {
      return;
    }

    if (!this.isMediaSchemaNode(selection.node)) {
      return;
    }

    const node = findDomRefAtPos(selection.from, domAtPos);

    if (node) {
      if (!node.childNodes.length) {
        return node.parentNode;
      }

      return node;
    }

    return;
  }
  /**
   * we insert a new file by inserting a initial state for that file.
   *
   * called when we insert a new file via the picker (connected via pickerfacade)
   */


  setView(view) {
    this.view = view;
  }
  /**
   * Called from React UI Component when user clicks on "Delete" icon
   * inside of it
   */


  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;
    const {
      mediaNodes
    } = this;
    mediaNodes.splice(0, mediaNodes.length);
    this.removeOnCloseListener();
    this.destroyPickers();
  }

  async initPickers(uploadParams, Picker) {
    if (this.destroyed || !this.uploadMediaClientConfig) {
      return;
    }

    const {
      errorReporter,
      pickers,
      pickerPromises
    } = this; // create pickers if they don't exist, re-use otherwise

    if (!pickers.length) {
      const pickerFacadeConfig = {
        mediaClientConfig: this.uploadMediaClientConfig,
        errorReporter
      };

      if (this.options.customMediaPicker) {
        const customPicker = new Picker('customMediaPicker', pickerFacadeConfig, this.options.customMediaPicker).init();
        pickerPromises.push(customPicker);
        pickers.push(this.customPicker = await customPicker);
      }

      pickers.forEach(picker => {
        picker.onNewMedia(this.insertFile);
      });
    } // set new upload params for the pickers


    pickers.forEach(picker => picker.setUploadParams(uploadParams));
  }

  collectionFromProvider() {
    return this.mediaProvider && this.mediaProvider.uploadParams && this.mediaProvider.uploadParams.collection;
  }

  updateAndDispatch(props) {
    // update plugin state
    Object.keys(props).forEach(_key => {
      const key = _key;
      const value = props[key];

      if (value !== undefined) {
        this[key] = value;
      }
    });

    if (this.dispatch) {
      this.dispatch(stateKey, { ...this
      });
    }
  }

}
export const getMediaPluginState = state => stateKey.getState(state);
export const createPlugin = (_schema, options, reactContext, getIntl, dispatch, mediaOptions) => {
  const intl = getIntl();
  const dropPlaceholder = createDropPlaceholder(intl, mediaOptions && mediaOptions.allowDropzoneDropLine);
  return new SafePlugin({
    state: {
      init(_config, state) {
        return new MediaPluginStateImplementation(state, options, mediaOptions, dispatch);
      },

      apply(tr, pluginState) {
        // remap editing media single position if we're in collab
        if (typeof pluginState.editingMediaSinglePos === 'number') {
          pluginState.editingMediaSinglePos = tr.mapping.map(pluginState.editingMediaSinglePos);
        }

        const meta = tr.getMeta(stateKey);

        if (meta) {
          const {
            allowsUploads
          } = meta;
          pluginState.updateAndDispatch({
            allowsUploads: typeof allowsUploads === 'undefined' ? pluginState.allowsUploads : allowsUploads
          });
        } // NOTE: We're not calling passing new state to the Editor, because we depend on the view.state reference
        //       throughout the lifetime of view. We injected the view into the plugin state, because we dispatch()
        //       transformations from within the plugin state (i.e. when adding a new file).


        return pluginState;
      }

    },

    appendTransaction(transactions, _oldState, newState) {
      for (const transaction of transactions) {
        const isSelectionOnMediaInsideMediaSingle = transaction.selectionSet && isNodeSelection(transaction.selection) && transaction.selection.node.type === newState.schema.nodes.media && transaction.selection.$anchor.parent.type === newState.schema.nodes.mediaSingle; // Note: this causes an additional transaction when selecting a media node
        // through clicking  on it with the cursor.

        if (isSelectionOnMediaInsideMediaSingle) {
          // If a selection has been placed on a media inside a media single,
          // we shift it to the media single parent as other code is opinionated about
          // the selection landing there. In particular the caption insertion and selection
          // action.
          return newState.tr.setSelection(NodeSelection.create(newState.doc, transaction.selection.$from.pos - 1));
        }
      }

      return;
    },

    key: stateKey,
    view: view => {
      const pluginState = getMediaPluginState(view.state);
      pluginState.setView(view);
      pluginState.updateElement();
      return {
        update: () => {
          pluginState.updateElement();
        }
      };
    },
    props: {
      decorations: state => {
        const pluginState = getMediaPluginState(state);

        if (!pluginState.showDropzone) {
          return;
        }

        const {
          schema,
          selection: {
            $anchor
          }
        } = state; // When a media is already selected

        if (state.selection instanceof NodeSelection) {
          const node = state.selection.node;

          if (node.type === schema.nodes.mediaSingle) {
            const deco = Decoration.node(state.selection.from, state.selection.to, {
              class: 'richMedia-selected'
            });
            return DecorationSet.create(state.doc, [deco]);
          }

          return;
        }

        let pos = $anchor.pos;

        if ($anchor.parent.type !== schema.nodes.paragraph && $anchor.parent.type !== schema.nodes.codeBlock) {
          pos = insertPoint(state.doc, pos, schema.nodes.mediaGroup);
        }

        if (pos === null || pos === undefined) {
          return;
        }

        const dropPlaceholders = [Decoration.widget(pos, dropPlaceholder, {
          key: 'drop-placeholder'
        })];
        return DecorationSet.create(state.doc, dropPlaceholders);
      },
      nodeViews: options.nodeViews,

      handleTextInput(view) {
        getMediaPluginState(view.state).splitMediaGroup();
        return false;
      },

      handleClick: (_editorView, _pos, event) => {
        var _event$target;

        const clickedInsideCaptionPlaceholder = (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.closest(`[data-id="${CAPTION_PLACEHOLDER_ID}"]`); // Workaround for Chrome given a regression introduced in prosemirror-view@1.18.6
        // Returning true prevents that updateSelection() is getting called in the commit below:
        // @see https://github.com/ProseMirror/prosemirror-view/compare/1.18.5...1.18.6

        return Boolean((browser.chrome || browser.safari) && clickedInsideCaptionPlaceholder);
      }
    }
  });
};