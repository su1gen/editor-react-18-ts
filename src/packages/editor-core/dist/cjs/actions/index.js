"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("../utils");

var _document = require("../utils/document");

var _action = require("../utils/action");

var _eventDispatcher = require("../event-dispatcher");

var _utils2 = require("@atlaskit/editor-common/utils");

var _utils3 = require("../plugins/extension/utils");

var _getFeatureFlags = require("../plugins/feature-flags-context/get-feature-flags");

var _nativeCollabProviderPlugin = require("../plugins/collab-edit/native-collab-provider-plugin");

var _deprecationWarnings = _interopRequireDefault(require("../utils/deprecation-warnings"));

var _nodesByLocalIds = require("../utils/nodes-by-localIds");

var EditorActions = /*#__PURE__*/function () {
  function EditorActions() {
    var _this = this;

    (0, _classCallCheck2.default)(this, EditorActions);
    (0, _defineProperty2.default)(this, "listeners", []);
    (0, _defineProperty2.default)(this, "dispatchAnalyticsEvent", function (payload) {
      if (_this.eventDispatcher) {
        var dispatch = (0, _eventDispatcher.createDispatch)(_this.eventDispatcher);
        dispatch(_utils2.analyticsEventKey, {
          payload: payload
        });
      }
    });
    (0, _defineProperty2.default)(this, "getResolvedEditorState", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _getCollabProvider;

      var featureFlags, editorValue, editorView;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (_this.editorView) {
                _context.next = 2;
                break;
              }

              throw new Error('Called getResolvedEditorState before editorView is ready');

            case 2:
              featureFlags = (0, _getFeatureFlags.getFeatureFlags)(_this.editorView.state);

              if (featureFlags.useNativeCollabPlugin) {
                _context.next = 10;
                break;
              }

              _context.next = 6;
              return _this.getValue();

            case 6:
              editorValue = _context.sent;

              if (editorValue) {
                _context.next = 9;
                break;
              }

              throw new Error('editorValue is undefined');

            case 9:
              return _context.abrupt("return", {
                content: editorValue,
                title: null,
                stepVersion: -1
              });

            case 10:
              editorView = _this.editorView;
              _context.next = 13;
              return (0, _action.getEditorValueWithMedia)(editorView);

            case 13:
              return _context.abrupt("return", (_getCollabProvider = (0, _nativeCollabProviderPlugin.getCollabProvider)(editorView.state)) === null || _getCollabProvider === void 0 ? void 0 : _getCollabProvider.getFinalAcknowledgedState());

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
  }

  (0, _createClass2.default)(EditorActions, [{
    key: "_privateGetEditorView",
    value: //#region private
    // This method needs to be public for context based helper components.
    function _privateGetEditorView() {
      return this.editorView;
    }
  }, {
    key: "_privateGetEventDispatcher",
    value: function _privateGetEventDispatcher() {
      return this.eventDispatcher;
    } // This method needs to be public for EditorContext component.

  }, {
    key: "_privateRegisterEditor",
    value: function _privateRegisterEditor(editorView, eventDispatcher, contentTransformer) {
      this.contentTransformer = contentTransformer;
      this.eventDispatcher = eventDispatcher;

      if (!this.editorView && editorView) {
        this.editorView = editorView;
        this.listeners.forEach(function (cb) {
          return cb(editorView, eventDispatcher);
        });
      } else if (this.editorView !== editorView) {
        throw new Error("Editor has already been registered! It's not allowed to re-register editor with the new Editor instance.");
      }

      if (this.contentTransformer) {
        this.contentEncode = this.contentTransformer.encode.bind(this.contentTransformer);
      }
    } // This method needs to be public for EditorContext component.

  }, {
    key: "_privateUnregisterEditor",
    value: function _privateUnregisterEditor() {
      this.editorView = undefined;
      this.contentTransformer = undefined;
      this.contentEncode = undefined;
      this.eventDispatcher = undefined;
    }
  }, {
    key: "_privateSubscribe",
    value: function _privateSubscribe(cb) {
      // If editor is registered and somebody is trying to add a listener,
      // just call it first.
      if (this.editorView && this.eventDispatcher) {
        cb(this.editorView, this.eventDispatcher);
      }

      this.listeners.push(cb);
    }
  }, {
    key: "_privateUnsubscribe",
    value: function _privateUnsubscribe(cb) {
      this.listeners = this.listeners.filter(function (c) {
        return c !== cb;
      });
    } //#endregion

  }, {
    key: "focus",
    value: function focus() {
      if (!this.editorView || this.editorView.hasFocus()) {
        return false;
      }

      this.editorView.focus();
      this.editorView.dispatch(this.editorView.state.tr.scrollIntoView());
      return true;
    }
  }, {
    key: "blur",
    value: function blur() {
      if (!this.editorView || !this.editorView.hasFocus()) {
        return false;
      }

      this.editorView.dom.blur();
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      if (!this.editorView) {
        return false;
      }

      var editorView = this.editorView;
      var state = editorView.state;
      var tr = editorView.state.tr.setSelection(_prosemirrorState.TextSelection.create(state.doc, 0, state.doc.nodeSize - 2)).deleteSelection();
      editorView.dispatch(tr);
      return true;
    }
  }, {
    key: "__temporaryFixForConfigPanel",
    value: function () {
      var _temporaryFixForConfigPanel2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var editorView;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                editorView = this.editorView;

                if (editorView) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                (0, _action.__temporaryFixForConfigPanel)(editorView);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function __temporaryFixForConfigPanel() {
        return _temporaryFixForConfigPanel2.apply(this, arguments);
      }

      return __temporaryFixForConfigPanel;
    }() // WARNING: this may be called repeatedly, async with care

  }, {
    key: "getValue",
    value: function () {
      var _getValue = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var editorView, doc, json, nodeSanitized;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                editorView = this.editorView;

                if (editorView) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                _context3.next = 5;
                return (0, _action.getEditorValueWithMedia)(editorView);

              case 5:
                doc = _context3.sent;
                json = (0, _utils.toJSON)(doc);

                if (this.contentEncode) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", json);

              case 9:
                nodeSanitized = _prosemirrorModel.Node.fromJSON(this.editorView.state.schema, json);
                return _context3.abrupt("return", this.contentEncode(nodeSanitized));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getValue() {
        return _getValue.apply(this, arguments);
      }

      return getValue;
    }()
  }, {
    key: "getNodeByLocalId",
    value: function getNodeByLocalId(id) {
      var _this$editorView;

      if ((_this$editorView = this.editorView) !== null && _this$editorView !== void 0 && _this$editorView.state) {
        var _findNodePosWithLocal, _this$editorView2;

        return (_findNodePosWithLocal = (0, _utils3.findNodePosWithLocalId)((_this$editorView2 = this.editorView) === null || _this$editorView2 === void 0 ? void 0 : _this$editorView2.state, id)) === null || _findNodePosWithLocal === void 0 ? void 0 : _findNodePosWithLocal.node;
      }
    }
  }, {
    key: "getNodeByFragmentLocalId",
    value: function getNodeByFragmentLocalId(id) {
      var _this$editorView3;

      if ((_this$editorView3 = this.editorView) !== null && _this$editorView3 !== void 0 && _this$editorView3.state) {
        var _this$editorView4;

        var nodes = (0, _nodesByLocalIds.findNodePosByFragmentLocalIds)((_this$editorView4 = this.editorView) === null || _this$editorView4 === void 0 ? void 0 : _this$editorView4.state, [id]);
        return nodes.length > 0 ? nodes[0].node : undefined;
      }
    }
    /**
     * This method will return the currently selected `Node` if the selection is a `Node`.
     * Otherwise, if the selection is textual or a non-selectable `Node` within another selectable `Node`, the closest selectable parent `Node` will be returned.
     */

  }, {
    key: "getSelectedNode",
    value: function getSelectedNode() {
      var _this$editorView5, _this$editorView5$sta;

      if ((_this$editorView5 = this.editorView) !== null && _this$editorView5 !== void 0 && (_this$editorView5$sta = _this$editorView5.state) !== null && _this$editorView5$sta !== void 0 && _this$editorView5$sta.selection) {
        var _findParentNode;

        var selection = this.editorView.state.selection;

        if (selection instanceof _prosemirrorState.NodeSelection) {
          return selection.node;
        }

        return (_findParentNode = (0, _prosemirrorUtils.findParentNode)(function (node) {
          return Boolean(node.type.spec.selectable);
        })(selection)) === null || _findParentNode === void 0 ? void 0 : _findParentNode.node;
      }
    }
  }, {
    key: "isDocumentEmpty",
    value: function isDocumentEmpty() {
      // Unlikely case when editorView has been destroyed before calling isDocumentEmpty,
      // we treat this case as if document was empty.
      if (!this.editorView) {
        return true;
      }

      return (0, _document.isEmptyDocument)(this.editorView.state.doc);
    }
  }, {
    key: "replaceDocument",
    value: function replaceDocument(rawValue) {
      var shouldScrollToBottom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var shouldAddToHistory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      (0, _deprecationWarnings.default)('EditorActions.replaceDocument', {
        shouldAddToHistory: shouldAddToHistory
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
          shouldScrollToBottom: shouldScrollToBottom
        });
      }

      return true;
    }
  }, {
    key: "replaceSelection",
    value: function replaceSelection(rawValue, tryToReplace) {
      if (!this.editorView) {
        return false;
      }

      var state = this.editorView.state;

      if (!rawValue) {
        var tr = state.tr.deleteSelection().scrollIntoView();
        this.editorView.dispatch(tr);
        return true;
      }

      var schema = state.schema;
      var content = (0, _document.processRawValue)(schema, rawValue);

      if (!content) {
        return false;
      } // try to find a place in the document where to insert a node if its not allowed at the cursor position by schema


      this.editorView.dispatch((0, _prosemirrorUtils.safeInsert)(content, undefined, tryToReplace)(state.tr).scrollIntoView());
      return true;
    }
  }, {
    key: "appendText",
    value: function appendText(text) {
      if (!this.editorView || !text) {
        return false;
      }

      var state = this.editorView.state;
      var lastChild = state.doc.lastChild;

      if (lastChild && lastChild.type !== state.schema.nodes.paragraph) {
        return false;
      }

      var tr = state.tr.insertText(text).scrollIntoView();
      this.editorView.dispatch(tr);
      return true;
    }
  }], [{
    key: "from",
    value: function from(view, eventDispatcher, transformer) {
      var editorActions = new EditorActions();

      editorActions._privateRegisterEditor(view, eventDispatcher, transformer);

      return editorActions;
    }
  }]);
  return EditorActions;
}();

exports.default = EditorActions;