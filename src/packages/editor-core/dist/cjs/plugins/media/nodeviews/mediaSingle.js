"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ReactMediaSingleNode = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _nodes = require("../../../utils/nodes");

var _WithPluginState = _interopRequireDefault(require("../../../ui/WithPluginState"));

var _width = require("../../width");

var _utils2 = require("../../../utils");

var _ResizableMediaSingle = _interopRequireDefault(require("../ui/ResizableMediaSingle"));

var _grid = require("../../../plugins/grid");

var _main = require("../pm-plugins/main");

var _mediaNodeUpdater = require("./mediaNodeUpdater");

var _prosemirrorUtils = require("prosemirror-utils");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _styles = require("./styles");

var _richMediaUtils = require("../../../utils/rich-media-utils");

var _mediaClient = require("@atlaskit/media-client");

var _mediaCommon = require("../utils/media-common");

var _mediaCommon2 = require("@atlaskit/media-common");

var _ReactNodeView2 = _interopRequireDefault(require("../../../nodeviews/ReactNodeView"));

var _CaptionPlaceholder = _interopRequireDefault(require("../ui/CaptionPlaceholder"));

var _prosemirrorState = require("prosemirror-state");

var _captions = require("../commands/captions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var MediaSingleNode = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(MediaSingleNode, _Component);

  var _super = _createSuper(MediaSingleNode);

  function MediaSingleNode() {
    var _this;

    (0, _classCallCheck2.default)(this, MediaSingleNode);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      width: undefined,
      height: undefined,
      viewMediaClientConfig: undefined,
      isCopying: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "createMediaNodeUpdater", function (props) {
      var node = _this.props.node.firstChild;
      return new _mediaNodeUpdater.MediaNodeUpdater(_objectSpread(_objectSpread({}, props), {}, {
        isMediaSingle: true,
        node: node ? node : _this.props.node,
        dispatchAnalyticsEvent: _this.props.dispatchAnalyticsEvent
      }));
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setViewMediaClientConfig", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(props) {
        var mediaProvider, viewMediaClientConfig;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return props.mediaProvider;

              case 2:
                mediaProvider = _context.sent;

                if (mediaProvider) {
                  viewMediaClientConfig = mediaProvider.viewMediaClientConfig;

                  _this.setState({
                    viewMediaClientConfig: viewMediaClientConfig
                  });
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateMediaNodeAttributes", /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(props) {
        var mediaNodeUpdater, addPendingTask, node, updatedDimensions, updatingNode, contextId, hasDifferentContextId, copyNode;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                mediaNodeUpdater = _this.createMediaNodeUpdater(props);
                addPendingTask = _this.props.mediaPluginState.addPendingTask; // we want the first child of MediaSingle (type "media")

                node = _this.props.node.firstChild;

                if (node) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return");

              case 5:
                _context2.next = 7;
                return mediaNodeUpdater.getRemoteDimensions();

              case 7:
                updatedDimensions = _context2.sent;

                if (updatedDimensions) {
                  mediaNodeUpdater.updateDimensions(updatedDimensions);
                }

                if (!(node.attrs.type === 'external' && node.attrs.__external)) {
                  _context2.next = 15;
                  break;
                }

                updatingNode = mediaNodeUpdater.handleExternalMedia(_this.props.getPos);
                addPendingTask(updatingNode);
                _context2.next = 14;
                return updatingNode;

              case 14:
                return _context2.abrupt("return");

              case 15:
                contextId = mediaNodeUpdater.getNodeContextId();

                if (contextId) {
                  _context2.next = 19;
                  break;
                }

                _context2.next = 19;
                return mediaNodeUpdater.updateContextId();

              case 19:
                _context2.next = 21;
                return mediaNodeUpdater.hasDifferentContextId();

              case 21:
                hasDifferentContextId = _context2.sent;

                if (!hasDifferentContextId) {
                  _context2.next = 34;
                  break;
                }

                _this.setState({
                  isCopying: true
                });

                _context2.prev = 24;
                copyNode = mediaNodeUpdater.copyNode();
                addPendingTask(copyNode);
                _context2.next = 29;
                return copyNode;

              case 29:
                _context2.next = 34;
                break;

              case 31:
                _context2.prev = 31;
                _context2.t0 = _context2["catch"](24);

                // if copyNode fails, let's set isCopying false so we can show the eventual error
                _this.setState({
                  isCopying: false
                });

              case 34:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[24, 31]]);
      }));

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "selectMediaSingle", function (_ref3) {
      var event = _ref3.event;
      // We need to call "stopPropagation" here in order to prevent the browser from navigating to
      // another URL if the media node is wrapped in a link mark.
      event.stopPropagation();

      var propPos = _this.props.getPos();

      var state = _this.props.view.state;

      if (event.shiftKey) {
        // don't select text if there is current selection in a table (as this would override selected cells)
        if (state.selection instanceof _cellSelection.CellSelection) {
          return;
        }

        (0, _utils2.setTextSelection)(_this.props.view, state.selection.from < propPos ? state.selection.from : propPos, // + 3 needed for offset of the media inside mediaSingle and cursor to make whole mediaSingle selected
        state.selection.to > propPos ? state.selection.to : propPos + 3);
      } else {
        (0, _utils2.setNodeSelection)(_this.props.view, propPos);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateSize", function (width, layout) {
      var _this$props$view = _this.props.view,
          state = _this$props$view.state,
          dispatch = _this$props$view.dispatch;

      var pos = _this.props.getPos();

      if (typeof pos === 'undefined') {
        return;
      }

      var tr = state.tr.setNodeMarkup(pos, undefined, _objectSpread(_objectSpread({}, _this.props.node.attrs), {}, {
        layout: layout,
        width: width
      }));
      tr.setMeta('scrollIntoView', false);
      /**
       * Any changes to attributes of a node count the node as "recreated" in Prosemirror[1]
       * This makes it so Prosemirror resets the selection to the child i.e. "media" instead of "media-single"
       * The recommended fix is to reset the selection.[2]
       *
       * [1] https://discuss.prosemirror.net/t/setnodemarkup-loses-current-nodeselection/976
       * [2] https://discuss.prosemirror.net/t/setnodemarkup-and-deselect/3673
       */

      tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, pos));
      return dispatch(tr);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "clickPlaceholder", function () {
      var _this$props = _this.props,
          view = _this$props.view,
          getPos = _this$props.getPos,
          node = _this$props.node;

      if (typeof getPos === 'boolean') {
        return;
      }

      (0, _captions.insertAndSelectCaptionFromMediaSinglePos)(getPos(), node)(view.state, view.dispatch);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getLineLength", function (view, pos) {
      if ((0, _richMediaUtils.isRichMediaInsideOfBlockNode)(view, pos)) {
        var $pos = view.state.doc.resolve(pos);
        var domNode = view.nodeDOM($pos.pos);

        if ($pos.nodeAfter && _richMediaUtils.floatingLayouts.indexOf($pos.nodeAfter.attrs.layout) > -1 && domNode && domNode.parentElement) {
          return domNode.parentElement.offsetWidth;
        }

        if (domNode instanceof HTMLElement) {
          return domNode.offsetWidth;
        }
      }

      return null;
    });
    return _this;
  }

  (0, _createClass2.default)(MediaSingleNode, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.mediaProvider !== this.props.mediaProvider) {
        this.setViewMediaClientConfig(nextProps);
      } // Forced updates not required on mobile


      if (nextProps.isCopyPasteEnabled === false) {
        return;
      } // We need to call this method on any prop change since attrs can get removed with collab editing
      // the method internally checks if we already have all attrs


      this.createMediaNodeUpdater(nextProps).updateFileAttrs();
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        var contextIdentifierProvider;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                contextIdentifierProvider = this.props.contextIdentifierProvider;
                _context3.next = 3;
                return Promise.all([this.setViewMediaClientConfig(this.props), this.updateMediaNodeAttributes(this.props)]);

              case 3:
                _context3.t0 = this;
                _context3.next = 6;
                return contextIdentifierProvider;

              case 6:
                _context3.t1 = _context3.sent;
                _context3.t2 = {
                  contextIdentifierProvider: _context3.t1
                };

                _context3.t0.setState.call(_context3.t0, _context3.t2);

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          selected = _this$props2.selected,
          getPos = _this$props2.getPos,
          node = _this$props2.node,
          mediaOptions = _this$props2.mediaOptions,
          fullWidthMode = _this$props2.fullWidthMode,
          state = _this$props2.view.state,
          view = _this$props2.view;
      var _ref4 = node.attrs,
          layout = _ref4.layout,
          mediaSingleWidth = _ref4.width;
      var childNode = node.firstChild;
      var attrs = childNode.attrs;
      var width = attrs.width,
          height = attrs.height;

      if (attrs.type === 'external') {
        if ((0, _mediaCommon.isMediaBlobUrlFromAttrs)(attrs)) {
          var urlAttrs = (0, _mediaClient.getAttrsFromUrl)(attrs.url);

          if (urlAttrs) {
            var urlWidth = urlAttrs.width,
                urlHeight = urlAttrs.height;
            width = width || urlWidth;
            height = height || urlHeight;
          }
        }

        var _this$state = this.state,
            stateWidth = _this$state.width,
            stateHeight = _this$state.height;

        if (width === null) {
          width = stateWidth || _ui.DEFAULT_IMAGE_WIDTH;
        }

        if (height === null) {
          height = stateHeight || _ui.DEFAULT_IMAGE_HEIGHT;
        }
      }

      if (!width || !height) {
        width = _ui.DEFAULT_IMAGE_WIDTH;
        height = _ui.DEFAULT_IMAGE_HEIGHT;
      }

      var mediaSingleProps = {
        layout: layout,
        width: width,
        height: height,
        containerWidth: this.props.width,
        lineLength: this.props.lineLength,
        pctWidth: mediaSingleWidth,
        fullWidthMode: fullWidthMode,
        hasFallbackContainer: false
      };
      var canResize = !!this.props.mediaOptions.allowResizing;

      if (!this.props.mediaOptions.allowResizingInTables) {
        // If resizing not allowed in tables, check parents for tables
        var pos = getPos();

        if (pos) {
          var $pos = state.doc.resolve(pos);
          var table = state.schema.nodes.table;
          var disabledNode = !!(0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($pos, [table]);
          canResize = canResize && !disabledNode;
        }
      }

      var lineLength = this.getLineLength(view, getPos()) || this.props.lineLength;
      var isSelected = selected();

      var shouldShowPlaceholder = (0, _mediaCommon2.getMediaFeatureFlag)('captions', mediaOptions.featureFlags) && node.childCount !== 2 && isSelected && state.selection instanceof _prosemirrorState.NodeSelection;

      var MediaChildren = (0, _react.jsx)("figure", {
        css: _styles.figureWrapper,
        className: _styles.MediaSingleNodeSelector
      }, (0, _react.jsx)("div", {
        ref: this.props.forwardRef
      }), shouldShowPlaceholder && (0, _react.jsx)(_CaptionPlaceholder.default, {
        onClick: this.clickPlaceholder
      }));
      return canResize ? (0, _react.jsx)(_ResizableMediaSingle.default, (0, _extends2.default)({}, mediaSingleProps, {
        lineLength: lineLength,
        view: this.props.view,
        getPos: getPos,
        updateSize: this.updateSize,
        displayGrid: (0, _grid.createDisplayGrid)(this.props.eventDispatcher),
        gridSize: 12,
        viewMediaClientConfig: this.state.viewMediaClientConfig,
        allowBreakoutSnapPoints: mediaOptions && mediaOptions.allowBreakoutSnapPoints,
        selected: isSelected,
        dispatchAnalyticsEvent: this.props.dispatchAnalyticsEvent
      }), MediaChildren) : (0, _react.jsx)(_ui.MediaSingle, mediaSingleProps, MediaChildren);
    }
  }]);
  return MediaSingleNode;
}(_react2.Component);

exports.default = MediaSingleNode;
(0, _defineProperty2.default)(MediaSingleNode, "defaultProps", {
  mediaOptions: {}
});
(0, _defineProperty2.default)(MediaSingleNode, "displayName", 'MediaSingleNode');

var MediaSingleNodeView = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(MediaSingleNodeView, _ReactNodeView);

  var _super2 = _createSuper(MediaSingleNodeView);

  function MediaSingleNodeView() {
    var _this2;

    (0, _classCallCheck2.default)(this, MediaSingleNodeView);

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    _this2 = _super2.call.apply(_super2, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "lastOffsetLeft", 0);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "forceViewUpdate", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "selectionType", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "checkAndUpdateSelectionType", function () {
      var getPos = _this2.getPos;
      var selection = _this2.view.state.selection;
      var isNodeSelected = (0, _nodes.isNodeSelectedOrInRange)(selection.$anchor.pos, selection.$head.pos, getPos(), _this2.node.nodeSize);
      _this2.selectionType = isNodeSelected;
      return isNodeSelected;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "isNodeSelected", function () {
      _this2.checkAndUpdateSelectionType();

      return _this2.selectionType !== null;
    });
    return _this2;
  }

  (0, _createClass2.default)(MediaSingleNodeView, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('div');

      if (_utils.browser.chrome && this.reactComponentProps.mediaOptions && this.reactComponentProps.mediaOptions.allowMediaSingleEditable) {
        // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
        // see also: https://github.com/ProseMirror/prosemirror/issues/884
        domRef.contentEditable = 'true';
      }

      return domRef;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('div');
      dom.classList.add("media-content-wrap");
      return {
        dom: dom
      };
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.forceViewUpdate) {
        this.forceViewUpdate = false;
        return true;
      }

      if (this.node.attrs !== nextNode.attrs) {
        return true;
      }

      if (this.selectionType !== this.checkAndUpdateSelectionType()) {
        return true;
      }

      if (this.node.childCount !== nextNode.childCount) {
        return true;
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(MediaSingleNodeView.prototype), "viewShouldUpdate", this).call(this, nextNode);
    }
  }, {
    key: "getNodeMediaId",
    value: function getNodeMediaId(node) {
      if (node.firstChild) {
        return node.firstChild.attrs.id;
      }

      return undefined;
    }
  }, {
    key: "update",
    value: function update(node, decorations, _innerDecorations, isValidUpdate) {
      var _this3 = this;

      if (!isValidUpdate) {
        isValidUpdate = function isValidUpdate(currentNode, newNode) {
          return _this3.getNodeMediaId(currentNode) === _this3.getNodeMediaId(newNode);
        };
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(MediaSingleNodeView.prototype), "update", this).call(this, node, decorations, _innerDecorations, isValidUpdate);
    }
  }, {
    key: "render",
    value: function render(props, forwardRef) {
      var _this4 = this;

      var _this$reactComponentP = this.reactComponentProps,
          eventDispatcher = _this$reactComponentP.eventDispatcher,
          fullWidthMode = _this$reactComponentP.fullWidthMode,
          providerFactory = _this$reactComponentP.providerFactory,
          mediaOptions = _this$reactComponentP.mediaOptions,
          dispatchAnalyticsEvent = _this$reactComponentP.dispatchAnalyticsEvent; // getPos is a boolean for marks, since this is a node we know it must be a function

      var getPos = this.getPos;
      return (0, _react.jsx)(_providerFactory.WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref5) {
          var mediaProvider = _ref5.mediaProvider,
              contextIdentifierProvider = _ref5.contextIdentifierProvider;
          return (0, _react.jsx)(_WithPluginState.default, {
            editorView: _this4.view,
            plugins: {
              width: _width.pluginKey,
              mediaPluginState: _main.stateKey
            },
            render: function render(_ref6) {
              var width = _ref6.width,
                  mediaPluginState = _ref6.mediaPluginState;
              return (0, _react.jsx)(MediaSingleNode, {
                width: width.width,
                lineLength: width.lineLength,
                node: _this4.node,
                getPos: getPos,
                mediaProvider: mediaProvider,
                contextIdentifierProvider: contextIdentifierProvider,
                mediaOptions: mediaOptions,
                view: _this4.view,
                fullWidthMode: fullWidthMode,
                selected: _this4.isNodeSelected,
                eventDispatcher: eventDispatcher,
                mediaPluginState: mediaPluginState,
                dispatchAnalyticsEvent: dispatchAnalyticsEvent,
                forwardRef: forwardRef
              });
            }
          });
        }
      });
    }
  }, {
    key: "ignoreMutation",
    value: function ignoreMutation() {
      // DOM has changed; recalculate if we need to re-render
      if (this.dom) {
        var offsetLeft = this.dom.offsetLeft;

        if (offsetLeft !== this.lastOffsetLeft) {
          this.lastOffsetLeft = offsetLeft;
          this.forceViewUpdate = true;
          this.update(this.node, [], [], function () {
            return true;
          });
        }
      }

      return true;
    }
  }]);
  return MediaSingleNodeView;
}(_ReactNodeView2.default);

var ReactMediaSingleNode = function ReactMediaSingleNode(portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent) {
  var mediaOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new MediaSingleNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      eventDispatcher: eventDispatcher,
      fullWidthMode: mediaOptions.fullWidthEnabled,
      providerFactory: providerFactory,
      mediaOptions: mediaOptions,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent,
      isCopyPasteEnabled: mediaOptions.isCopyPasteEnabled
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
};

exports.ReactMediaSingleNode = ReactMediaSingleNode;