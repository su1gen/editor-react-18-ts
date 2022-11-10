import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import _regeneratorRuntime from "@babel/runtime/regenerator";
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

var createDropPlaceholder = function createDropPlaceholder(intl, allowDropLine) {
  var dropPlaceholder = document.createElement('div');
  var createElement = React.createElement;

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

var MEDIA_RESOLVED_STATES = ['ready', 'error', 'cancelled'];
export var MediaPluginStateImplementation = /*#__PURE__*/function () {
  function MediaPluginStateImplementation(_state, options, mediaOptions, _dispatch) {
    var _this = this;

    _classCallCheck(this, MediaPluginStateImplementation);

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

    _defineProperty(this, "removeOnCloseListener", function () {});

    _defineProperty(this, "onPopupToggleCallback", function () {});

    _defineProperty(this, "nodeCount", new Map());

    _defineProperty(this, "taskManager", new MediaTaskManager());

    _defineProperty(this, "pickers", []);

    _defineProperty(this, "pickerPromises", []);

    _defineProperty(this, "onContextIdentifierProvider", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_name, provider) {
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!provider) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return provider;

              case 3:
                _this.contextIdentifierProvider = _context.sent;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());

    _defineProperty(this, "setMediaProvider", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(mediaProvider) {
        var viewMediaClientConfig, wrappedError, view, allowsUploads;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (mediaProvider) {
                  _context2.next = 5;
                  break;
                }

                _this.destroyPickers();

                _this.allowsUploads = false;

                if (!_this.destroyed) {
                  _this.view.dispatch(_this.view.state.tr.setMeta(stateKey, {
                    allowsUploads: _this.allowsUploads
                  }));
                }

                return _context2.abrupt("return");

              case 5:
                _context2.prev = 5;
                _context2.next = 8;
                return mediaProvider;

              case 8:
                _this.mediaProvider = _context2.sent;

                // TODO [MS-2038]: remove once context api is removed
                // We want to re assign the view and upload configs if they are missing for backwards compatibility
                // as currently integrators can pass context || mediaClientConfig
                if (!_this.mediaProvider.viewMediaClientConfig) {
                  viewMediaClientConfig = _this.mediaProvider.viewMediaClientConfig;

                  if (viewMediaClientConfig) {
                    _this.mediaProvider.viewMediaClientConfig = viewMediaClientConfig;
                  }
                }

                assert(_this.mediaProvider.viewMediaClientConfig, "MediaProvider promise did not resolve to a valid instance of MediaProvider - ".concat(_this.mediaProvider));
                _context2.next = 21;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](5);
                wrappedError = new Error("Media functionality disabled due to rejected provider: ".concat(_context2.t0 instanceof Error ? _context2.t0.message : String(_context2.t0)));

                _this.errorReporter.captureException(wrappedError);

                _this.destroyPickers();

                _this.allowsUploads = false;

                if (!_this.destroyed) {
                  _this.view.dispatch(_this.view.state.tr.setMeta(stateKey, {
                    allowsUploads: _this.allowsUploads
                  }));
                }

                return _context2.abrupt("return");

              case 21:
                _this.mediaClientConfig = _this.mediaProvider.viewMediaClientConfig;
                _this.allowsUploads = !!_this.mediaProvider.uploadMediaClientConfig;
                view = _this.view, allowsUploads = _this.allowsUploads; // make sure editable DOM node is mounted

                if (!_this.destroyed && view && view.dom.parentNode) {
                  // make PM plugin aware of the state change to update UI during 'apply' hook
                  view.dispatch(view.state.tr.setMeta(stateKey, {
                    allowsUploads: allowsUploads
                  }));
                }

                if (!_this.allowsUploads) {
                  _context2.next = 35;
                  break;
                }

                _this.uploadMediaClientConfig = _this.mediaProvider.uploadMediaClientConfig;

                if (!(_this.mediaProvider.uploadParams && _this.uploadMediaClientConfig)) {
                  _context2.next = 32;
                  break;
                }

                _context2.next = 30;
                return _this.initPickers(_this.mediaProvider.uploadParams, PickerFacade);

              case 30:
                _context2.next = 33;
                break;

              case 32:
                _this.destroyPickers();

              case 33:
                _context2.next = 36;
                break;

              case 35:
                _this.destroyPickers();

              case 36:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[5, 13]]);
      }));

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getMediaOptions", function () {
      return _this.options;
    });

    _defineProperty(this, "isMediaSchemaNode", function (_ref3) {
      var _this$mediaOptions;

      var type = _ref3.type;
      var _this$view$state$sche = _this.view.state.schema.nodes,
          mediaInline = _this$view$state$sche.mediaInline,
          mediaSingle = _this$view$state$sche.mediaSingle,
          media = _this$view$state$sche.media;

      if (getMediaFeatureFlag('mediaInline', (_this$mediaOptions = _this.mediaOptions) === null || _this$mediaOptions === void 0 ? void 0 : _this$mediaOptions.featureFlags)) {
        return type === mediaSingle || type === media || type === mediaInline;
      }

      return type === mediaSingle;
    });

    _defineProperty(this, "insertFile", function (mediaState, onMediaStateChanged, pickerType) {
      var _mediaState$collectio, _this$mediaOptions2;

      var state = _this.view.state;

      var mediaStateWithContext = _objectSpread(_objectSpread({}, mediaState), {}, {
        contextId: _this.contextIdentifierProvider ? _this.contextIdentifierProvider.objectId : undefined
      });

      var collection = (_mediaState$collectio = mediaState.collection) !== null && _mediaState$collectio !== void 0 ? _mediaState$collectio : _this.collectionFromProvider();

      if (collection === undefined) {
        return;
      } // We need to dispatch the change to event dispatcher only for successful files


      if (mediaState.status !== 'error') {
        _this.updateAndDispatch({
          allUploadsFinished: false
        });
      }

      if (isMediaSingle(state.schema, mediaStateWithContext.fileMimeType)) {
        insertMediaSingleNode(_this.view, mediaStateWithContext, _this.getInputMethod(pickerType), collection, _this.mediaOptions && _this.mediaOptions.alignLeftOnInsert);
      } else if (getMediaFeatureFlag('mediaInline', (_this$mediaOptions2 = _this.mediaOptions) === null || _this$mediaOptions2 === void 0 ? void 0 : _this$mediaOptions2.featureFlags) && !isInEmptyLine(state) && (!isInsidePotentialEmptyParagraph(state) || isInListItem(state)) && canInsertMediaInline(state)) {
        insertMediaInlineNode(_this.view, mediaStateWithContext, collection, _this.getInputMethod(pickerType));
      } else {
        insertMediaGroupNode(_this.view, [mediaStateWithContext], collection, _this.getInputMethod(pickerType));
      } // do events when media state changes


      onMediaStateChanged(_this.handleMediaState); // handle waiting for upload complete

      var isEndState = function isEndState(state) {
        return state.status && MEDIA_RESOLVED_STATES.indexOf(state.status) !== -1;
      };

      if (!isEndState(mediaStateWithContext)) {
        var uploadingPromise = new Promise(function (resolve) {
          onMediaStateChanged(function (newState) {
            // When media item reaches its final state, remove listener and resolve
            if (isEndState(newState)) {
              resolve(newState);
            }
          });
        });

        _this.taskManager.addPendingTask(uploadingPromise, mediaStateWithContext.id).then(function () {
          _this.updateAndDispatch({
            allUploadsFinished: true
          });
        });
      } // refocus the view


      var view = _this.view;

      if (!view.hasFocus()) {
        view.focus();
      }
    });

    _defineProperty(this, "addPendingTask", function (task) {
      _this.taskManager.addPendingTask(task);
    });

    _defineProperty(this, "splitMediaGroup", function () {
      return splitMediaGroup(_this.view);
    });

    _defineProperty(this, "onPopupPickerClose", function () {
      _this.onPopupToggleCallback(false);
    });

    _defineProperty(this, "showMediaPicker", function () {
      if (_this.openMediaPickerBrowser) {
        return _this.openMediaPickerBrowser();
      }

      _this.onPopupToggleCallback(true);
    });

    _defineProperty(this, "setBrowseFn", function (browseFn) {
      _this.openMediaPickerBrowser = browseFn;
    });

    _defineProperty(this, "onPopupToggle", function (onPopupToggleCallback) {
      _this.onPopupToggleCallback = onPopupToggleCallback;
    });

    _defineProperty(this, "waitForPendingTasks", this.taskManager.waitForPendingTasks);

    _defineProperty(this, "handleMediaNodeRemoval", function (node, getPos) {
      var getNode = node;

      if (!getNode) {
        getNode = _this.view.state.doc.nodeAt(getPos());
      }

      removeMediaNode(_this.view, getNode, getPos);
    });

    _defineProperty(this, "trackMediaNodeAddition", function (node) {
      var _this$nodeCount$get;

      var id = node.attrs.id;
      var count = (_this$nodeCount$get = _this.nodeCount.get(id)) !== null && _this$nodeCount$get !== void 0 ? _this$nodeCount$get : 0;

      if (count === 0) {
        _this.taskManager.resumePendingTask(id);
      }

      _this.nodeCount.set(id, count + 1);
    });

    _defineProperty(this, "trackMediaNodeRemoval", function (node) {
      var _this$nodeCount$get2;

      var id = node.attrs.id;
      var count = (_this$nodeCount$get2 = _this.nodeCount.get(id)) !== null && _this$nodeCount$get2 !== void 0 ? _this$nodeCount$get2 : 0;

      if (count === 1) {
        _this.taskManager.cancelPendingTask(id);
      }

      _this.nodeCount.set(id, count - 1);
    });

    _defineProperty(this, "handleMediaNodeMount", function (node, getPos) {
      _this.trackMediaNodeAddition(node);

      _this.mediaNodes.unshift({
        node: node,
        getPos: getPos
      });
    });

    _defineProperty(this, "handleMediaNodeUnmount", function (oldNode) {
      _this.trackMediaNodeRemoval(oldNode);

      _this.mediaNodes = _this.mediaNodes.filter(function (_ref4) {
        var node = _ref4.node;
        return oldNode !== node;
      });
    });

    _defineProperty(this, "handleMediaGroupUpdate", function (oldNodes, newNodes) {
      var addedNodes = newNodes.filter(function (node) {
        return oldNodes.every(function (oldNode) {
          return oldNode.attrs.id !== node.attrs.id;
        });
      });
      var removedNodes = oldNodes.filter(function (node) {
        return newNodes.every(function (newNode) {
          return newNode.attrs.id !== node.attrs.id;
        });
      });
      addedNodes.forEach(function (node) {
        _this.trackMediaNodeAddition(node);
      });
      removedNodes.forEach(function (oldNode) {
        _this.trackMediaNodeRemoval(oldNode);
      });
    });

    _defineProperty(this, "findMediaNode", function (id) {
      return helpers.findMediaSingleNode(_this, id);
    });

    _defineProperty(this, "destroyAllPickers", function (pickers) {
      pickers.forEach(function (picker) {
        return picker.destroy();
      });

      _this.pickers.splice(0, _this.pickers.length);
    });

    _defineProperty(this, "destroyPickers", function () {
      var pickers = _this.pickers,
          pickerPromises = _this.pickerPromises; // If pickerPromises and pickers are the same length
      // All pickers have resolved and we safely destroy them
      // Otherwise wait for them to resolve then destroy.

      if (pickerPromises.length === pickers.length) {
        _this.destroyAllPickers(_this.pickers);
      } else {
        Promise.all(pickerPromises).then(function (resolvedPickers) {
          return _this.destroyAllPickers(resolvedPickers);
        });
      }

      _this.customPicker = undefined;
    });

    _defineProperty(this, "getInputMethod", function (pickerType) {
      switch (pickerType) {
        case 'clipboard':
          return INPUT_METHOD.CLIPBOARD;

        case 'dropzone':
          return INPUT_METHOD.DRAG_AND_DROP;
      }

      return;
    });

    _defineProperty(this, "updateMediaNodeAttrs", function (id, attrs, isMediaSingle) {
      var view = _this.view;

      if (!view) {
        return;
      }

      return updateMediaNodeAttrs(id, attrs, isMediaSingle)(view.state, view.dispatch);
    });

    _defineProperty(this, "handleMediaState", function (state) {
      switch (state.status) {
        case 'error':
          var uploadErrorHandler = _this.options.uploadErrorHandler;

          if (uploadErrorHandler) {
            uploadErrorHandler(state);
          }

          break;

        case 'mobile-upload-end':
          var attrs = {
            id: state.publicId || state.id
          };

          if (typeof state.collection === 'string') {
            attrs.collection = state.collection;
          }

          _this.updateMediaNodeAttrs(state.id, attrs, isMediaSingle(_this.view.state.schema, state.fileMimeType));

          delete _this.mediaGroupNodes[state.id];
          break;
      }
    });

    _defineProperty(this, "removeNodeById", function (state) {
      var id = state.id;
      var mediaNodeWithPos = helpers.findMediaNode(_this, id, isImage(state.fileMimeType));

      if (mediaNodeWithPos) {
        removeMediaNode(_this.view, mediaNodeWithPos.node, mediaNodeWithPos.getPos);
      }
    });

    _defineProperty(this, "removeSelectedMediaContainer", function () {
      var view = _this.view;

      var selectedNode = _this.selectedMediaContainerNode();

      if (!selectedNode) {
        return false;
      }

      var from = view.state.selection.from;
      removeMediaNode(view, selectedNode.firstChild, function () {
        return from + 1;
      });
      return true;
    });

    _defineProperty(this, "selectedMediaContainerNode", function () {
      var selection = _this.view.state.selection;

      if (selection instanceof NodeSelection && _this.isMediaSchemaNode(selection.node)) {
        return selection.node;
      }

      return;
    });

    _defineProperty(this, "handleDrag", function (dragState) {
      var isActive = dragState === 'enter';

      if (_this.showDropzone === isActive) {
        return;
      }

      _this.showDropzone = isActive;
      var _this$view = _this.view,
          dispatch = _this$view.dispatch,
          state = _this$view.state; // Trigger state change to be able to pick it up in the decorations handler

      dispatch(state.tr);
    });

    this.options = options;
    this.mediaOptions = mediaOptions;
    this.dispatch = _dispatch;
    this.waitForMediaUpload = options.waitForMediaUpload === undefined ? true : options.waitForMediaUpload;
    var nodes = _state.schema.nodes;
    assert(nodes.media && (nodes.mediaGroup || nodes.mediaSingle), 'Editor: unable to init media plugin - media or mediaGroup/mediaSingle node absent in schema');
    options.providerFactory.subscribe('mediaProvider', function (_name, provider) {
      return _this.setMediaProvider(provider);
    });
    options.providerFactory.subscribe('contextIdentifierProvider', this.onContextIdentifierProvider);
    this.errorReporter = options.errorReporter || new ErrorReporter();
  }

  _createClass(MediaPluginStateImplementation, [{
    key: "updateElement",
    value: function updateElement() {
      var newElement;
      var selectedContainer = this.selectedMediaContainerNode();

      if (selectedContainer && this.isMediaSchemaNode(selectedContainer)) {
        newElement = this.getDomElement(this.view.domAtPos.bind(this.view));
      }

      if (this.element !== newElement) {
        this.element = newElement;
      }
    }
  }, {
    key: "getDomElement",
    value: function getDomElement(domAtPos) {
      var selection = this.view.state.selection;

      if (!(selection instanceof NodeSelection)) {
        return;
      }

      if (!this.isMediaSchemaNode(selection.node)) {
        return;
      }

      var node = findDomRefAtPos(selection.from, domAtPos);

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

  }, {
    key: "setView",
    value: function setView(view) {
      this.view = view;
    }
    /**
     * Called from React UI Component when user clicks on "Delete" icon
     * inside of it
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.destroyed) {
        return;
      }

      this.destroyed = true;
      var mediaNodes = this.mediaNodes;
      mediaNodes.splice(0, mediaNodes.length);
      this.removeOnCloseListener();
      this.destroyPickers();
    }
  }, {
    key: "initPickers",
    value: function () {
      var _initPickers = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(uploadParams, Picker) {
        var _this2 = this;

        var errorReporter, pickers, pickerPromises, pickerFacadeConfig, customPicker;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(this.destroyed || !this.uploadMediaClientConfig)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                errorReporter = this.errorReporter, pickers = this.pickers, pickerPromises = this.pickerPromises; // create pickers if they don't exist, re-use otherwise

                if (pickers.length) {
                  _context3.next = 14;
                  break;
                }

                pickerFacadeConfig = {
                  mediaClientConfig: this.uploadMediaClientConfig,
                  errorReporter: errorReporter
                };

                if (!this.options.customMediaPicker) {
                  _context3.next = 13;
                  break;
                }

                customPicker = new Picker('customMediaPicker', pickerFacadeConfig, this.options.customMediaPicker).init();
                pickerPromises.push(customPicker);
                _context3.t0 = pickers;
                _context3.next = 11;
                return customPicker;

              case 11:
                _context3.t1 = this.customPicker = _context3.sent;

                _context3.t0.push.call(_context3.t0, _context3.t1);

              case 13:
                pickers.forEach(function (picker) {
                  picker.onNewMedia(_this2.insertFile);
                });

              case 14:
                // set new upload params for the pickers
                pickers.forEach(function (picker) {
                  return picker.setUploadParams(uploadParams);
                });

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function initPickers(_x4, _x5) {
        return _initPickers.apply(this, arguments);
      }

      return initPickers;
    }()
  }, {
    key: "collectionFromProvider",
    value: function collectionFromProvider() {
      return this.mediaProvider && this.mediaProvider.uploadParams && this.mediaProvider.uploadParams.collection;
    }
  }, {
    key: "updateAndDispatch",
    value: function updateAndDispatch(props) {
      var _this3 = this;

      // update plugin state
      Object.keys(props).forEach(function (_key) {
        var key = _key;
        var value = props[key];

        if (value !== undefined) {
          _this3[key] = value;
        }
      });

      if (this.dispatch) {
        this.dispatch(stateKey, _objectSpread({}, this));
      }
    }
  }]);

  return MediaPluginStateImplementation;
}();
export var getMediaPluginState = function getMediaPluginState(state) {
  return stateKey.getState(state);
};
export var createPlugin = function createPlugin(_schema, options, reactContext, getIntl, dispatch, mediaOptions) {
  var intl = getIntl();
  var dropPlaceholder = createDropPlaceholder(intl, mediaOptions && mediaOptions.allowDropzoneDropLine);
  return new SafePlugin({
    state: {
      init: function init(_config, state) {
        return new MediaPluginStateImplementation(state, options, mediaOptions, dispatch);
      },
      apply: function apply(tr, pluginState) {
        // remap editing media single position if we're in collab
        if (typeof pluginState.editingMediaSinglePos === 'number') {
          pluginState.editingMediaSinglePos = tr.mapping.map(pluginState.editingMediaSinglePos);
        }

        var meta = tr.getMeta(stateKey);

        if (meta) {
          var allowsUploads = meta.allowsUploads;
          pluginState.updateAndDispatch({
            allowsUploads: typeof allowsUploads === 'undefined' ? pluginState.allowsUploads : allowsUploads
          });
        } // NOTE: We're not calling passing new state to the Editor, because we depend on the view.state reference
        //       throughout the lifetime of view. We injected the view into the plugin state, because we dispatch()
        //       transformations from within the plugin state (i.e. when adding a new file).


        return pluginState;
      }
    },
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var _iterator = _createForOfIteratorHelper(transactions),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var transaction = _step.value;
          var isSelectionOnMediaInsideMediaSingle = transaction.selectionSet && isNodeSelection(transaction.selection) && transaction.selection.node.type === newState.schema.nodes.media && transaction.selection.$anchor.parent.type === newState.schema.nodes.mediaSingle; // Note: this causes an additional transaction when selecting a media node
          // through clicking  on it with the cursor.

          if (isSelectionOnMediaInsideMediaSingle) {
            // If a selection has been placed on a media inside a media single,
            // we shift it to the media single parent as other code is opinionated about
            // the selection landing there. In particular the caption insertion and selection
            // action.
            return newState.tr.setSelection(NodeSelection.create(newState.doc, transaction.selection.$from.pos - 1));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return;
    },
    key: stateKey,
    view: function view(_view) {
      var pluginState = getMediaPluginState(_view.state);
      pluginState.setView(_view);
      pluginState.updateElement();
      return {
        update: function update() {
          pluginState.updateElement();
        }
      };
    },
    props: {
      decorations: function decorations(state) {
        var pluginState = getMediaPluginState(state);

        if (!pluginState.showDropzone) {
          return;
        }

        var schema = state.schema,
            $anchor = state.selection.$anchor; // When a media is already selected

        if (state.selection instanceof NodeSelection) {
          var node = state.selection.node;

          if (node.type === schema.nodes.mediaSingle) {
            var deco = Decoration.node(state.selection.from, state.selection.to, {
              class: 'richMedia-selected'
            });
            return DecorationSet.create(state.doc, [deco]);
          }

          return;
        }

        var pos = $anchor.pos;

        if ($anchor.parent.type !== schema.nodes.paragraph && $anchor.parent.type !== schema.nodes.codeBlock) {
          pos = insertPoint(state.doc, pos, schema.nodes.mediaGroup);
        }

        if (pos === null || pos === undefined) {
          return;
        }

        var dropPlaceholders = [Decoration.widget(pos, dropPlaceholder, {
          key: 'drop-placeholder'
        })];
        return DecorationSet.create(state.doc, dropPlaceholders);
      },
      nodeViews: options.nodeViews,
      handleTextInput: function handleTextInput(view) {
        getMediaPluginState(view.state).splitMediaGroup();
        return false;
      },
      handleClick: function handleClick(_editorView, _pos, event) {
        var _event$target;

        var clickedInsideCaptionPlaceholder = (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.closest("[data-id=\"".concat(CAPTION_PLACEHOLDER_ID, "\"]")); // Workaround for Chrome given a regression introduced in prosemirror-view@1.18.6
        // Returning true prevents that updateSelection() is getting called in the commit below:
        // @see https://github.com/ProseMirror/prosemirror-view/compare/1.18.5...1.18.6

        return Boolean((browser.chrome || browser.safari) && clickedInsideCaptionPlaceholder);
      }
    }
  });
};