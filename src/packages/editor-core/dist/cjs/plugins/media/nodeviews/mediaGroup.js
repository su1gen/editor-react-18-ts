"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ReactMediaGroupNode = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _close = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/close"));

var _mediaFilmstrip = require("@atlaskit/media-filmstrip");

var _react = _interopRequireDefault(require("react"));

var _ReactNodeView2 = _interopRequireDefault(require("../../../nodeviews/ReactNodeView"));

var _reactNodeview = require("../../../plugins/base/pm-plugins/react-nodeview");

var _WithPluginState = _interopRequireDefault(require("../../../ui/WithPluginState"));

var _utils = require("../../../utils");

var _nodes = require("../../../utils/nodes");

var _editorDisabled = require("../../editor-disabled");

var _pluginKey = require("../pm-plugins/plugin-key");

var _mediaNodeUpdater = require("./mediaNodeUpdater");

var _mediaCommon = require("@atlaskit/media-common");

var _reactIntlNext = require("react-intl-next");

var _messages = require("./messages");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var isMediaGroupSelectedFromProps = function isMediaGroupSelectedFromProps(props) {
  return (0, _nodes.isNodeSelectedOrInRange)(props.anchorPos, props.headPos, props.getPos(), props.node.nodeSize);
};

var hasSelectionChanged = function hasSelectionChanged(oldProps, newProps) {
  if (isMediaGroupSelectedFromProps(oldProps) !== isMediaGroupSelectedFromProps(newProps)) {
    return true;
  }

  if (isMediaGroupSelectedFromProps(newProps) === _nodes.SelectedState.selectedInside) {
    return oldProps.anchorPos !== newProps.anchorPos;
  }

  return false;
};

var MediaGroup = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(MediaGroup, _React$Component);

  var _super = _createSuper(MediaGroup);

  function MediaGroup(_props) {
    var _this;

    (0, _classCallCheck2.default)(this, MediaGroup);
    _this = _super.call(this, _props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      viewMediaClientConfig: undefined
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateNodeAttrs", function (props) {
      var view = props.view,
          mediaProvider = props.mediaProvider,
          contextIdentifierProvider = props.contextIdentifierProvider;

      _this.mediaNodes.forEach(function (node) {
        var mediaNodeUpdater = new _mediaNodeUpdater.MediaNodeUpdater({
          view: view,
          mediaProvider: mediaProvider,
          contextIdentifierProvider: contextIdentifierProvider,
          node: node,
          isMediaSingle: false
        });
        mediaNodeUpdater.updateFileAttrs(false);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setMediaItems", function (props) {
      var node = props.node;
      var oldMediaNodes = _this.mediaNodes;
      _this.mediaNodes = [];
      node.forEach(function (item, childOffset) {
        _this.mediaPluginState.mediaGroupNodes[item.attrs.id] = {
          node: item,
          getPos: function getPos() {
            return props.getPos() + childOffset + 1;
          }
        };

        _this.mediaNodes.push(item);
      });

      _this.mediaPluginState.handleMediaGroupUpdate(oldMediaNodes, _this.mediaNodes);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getIdentifier", function (item) {
      if (item.attrs.type === 'external') {
        return {
          mediaItemType: 'external-image',
          dataURI: item.attrs.url
        };
      }

      return {
        id: item.attrs.id,
        mediaItemType: 'file',
        collectionName: item.attrs.collection
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isNodeSelected", function (nodePos) {
      var selected = isMediaGroupSelectedFromProps(_this.props);

      if (selected === _nodes.SelectedState.selectedInRange) {
        return true;
      }

      if (selected === _nodes.SelectedState.selectedInside && _this.props.anchorPos === nodePos) {
        return true;
      }

      return false;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderChildNodes", function () {
      var viewMediaClientConfig = _this.state.viewMediaClientConfig;
      var _this$props = _this.props,
          getPos = _this$props.getPos,
          allowLazyLoading = _this$props.allowLazyLoading,
          disabled = _this$props.disabled,
          mediaOptions = _this$props.mediaOptions;

      var items = _this.mediaNodes.map(function (item, idx) {
        // We declared this to get a fresh position every time
        var getNodePos = function getNodePos() {
          return getPos() + idx + 1;
        }; // Media Inline creates a floating toolbar with the same options, excludes these options if enabled


        var mediaInlineOptions = function mediaInlineOptions() {
          var allowMediaInline = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

          if (!allowMediaInline) {
            return {
              shouldEnableDownloadButton: mediaOptions.enableDownloadButton,
              actions: [{
                handler: disabled ? function () {} : _this.mediaPluginState.handleMediaNodeRemoval.bind(null, undefined, getNodePos),
                icon: /*#__PURE__*/_react.default.createElement(_close.default, {
                  label: _this.props.intl.formatMessage(_messages.messages.mediaGroupDeleteLabel)
                })
              }]
            };
          }
        };

        return _objectSpread({
          identifier: _this.getIdentifier(item),
          isLazy: allowLazyLoading,
          selected: _this.isNodeSelected(getNodePos()),
          onClick: function onClick() {
            (0, _utils.setNodeSelection)(_this.props.view, getNodePos());
          }
        }, mediaInlineOptions((0, _mediaCommon.getMediaFeatureFlag)('mediaInline', mediaOptions.featureFlags)));
      });

      return /*#__PURE__*/_react.default.createElement(_mediaFilmstrip.Filmstrip, {
        items: items,
        mediaClientConfig: viewMediaClientConfig,
        featureFlags: mediaOptions.featureFlags
      });
    });
    _this.mediaNodes = [];
    _this.mediaPluginState = _pluginKey.stateKey.getState(_props.view.state);

    _this.setMediaItems(_props);

    _this.state = {
      viewMediaClientConfig: undefined
    };
    return _this;
  }

  (0, _createClass2.default)(MediaGroup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.updateMediaClientConfig();
      this.mediaNodes.forEach( /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(node) {
          var _this2$props, view, mediaProvider, contextIdentifierProvider, mediaNodeUpdater, contextId, hasDifferentContextId;

          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(node.attrs.type === 'external')) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return");

                case 2:
                  _this2$props = _this2.props, view = _this2$props.view, mediaProvider = _this2$props.mediaProvider, contextIdentifierProvider = _this2$props.contextIdentifierProvider;
                  mediaNodeUpdater = new _mediaNodeUpdater.MediaNodeUpdater({
                    view: view,
                    mediaProvider: mediaProvider,
                    contextIdentifierProvider: contextIdentifierProvider,
                    node: node,
                    isMediaSingle: false
                  });
                  contextId = mediaNodeUpdater.getNodeContextId();

                  if (contextId) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 8;
                  return mediaNodeUpdater.updateContextId();

                case 8:
                  _context.next = 10;
                  return mediaNodeUpdater.hasDifferentContextId();

                case 10:
                  hasDifferentContextId = _context.sent;

                  if (!hasDifferentContextId) {
                    _context.next = 14;
                    break;
                  }

                  _context.next = 14;
                  return mediaNodeUpdater.copyNode();

                case 14:
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
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mediaPluginState.handleMediaGroupUpdate(this.mediaNodes, []);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(props) {
      this.updateMediaClientConfig();
      this.setMediaItems(props);

      if (props.isCopyPasteEnabled !== false) {
        this.updateNodeAttrs(props);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (hasSelectionChanged(this.props, nextProps) || this.props.node !== nextProps.node || this.state.viewMediaClientConfig !== this.mediaPluginState.mediaClientConfig) {
        return true;
      }

      return false;
    }
  }, {
    key: "updateMediaClientConfig",
    value: function updateMediaClientConfig() {
      var viewMediaClientConfig = this.state.viewMediaClientConfig;
      var mediaClientConfig = this.mediaPluginState.mediaClientConfig;

      if (!viewMediaClientConfig && mediaClientConfig) {
        this.setState({
          viewMediaClientConfig: mediaClientConfig
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderChildNodes();
    }
  }]);
  return MediaGroup;
}(_react.default.Component);

(0, _defineProperty2.default)(MediaGroup, "displayName", 'MediaGroup');
var IntlMediaGroup = (0, _reactIntlNext.injectIntl)(MediaGroup);
var _default = IntlMediaGroup;
exports.default = _default;

var MediaGroupNodeView = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(MediaGroupNodeView, _ReactNodeView);

  var _super2 = _createSuper(MediaGroupNodeView);

  function MediaGroupNodeView() {
    (0, _classCallCheck2.default)(this, MediaGroupNodeView);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2.default)(MediaGroupNodeView, [{
    key: "render",
    value: function render(props, forwardRef) {
      var _this3 = this;

      var providerFactory = props.providerFactory,
          mediaOptions = props.mediaOptions;
      var getPos = this.getPos;
      return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref2) {
          var mediaProvider = _ref2.mediaProvider,
              contextIdentifierProvider = _ref2.contextIdentifierProvider;

          var renderFn = function renderFn(_ref3) {
            var editorDisabledPlugin = _ref3.editorDisabledPlugin;

            if (!mediaProvider) {
              return null;
            }

            return /*#__PURE__*/_react.default.createElement(IntlMediaGroup, {
              node: _this3.node,
              getPos: getPos,
              view: _this3.view,
              forwardRef: forwardRef,
              disabled: (editorDisabledPlugin || {}).editorDisabled,
              allowLazyLoading: mediaOptions.allowLazyLoading,
              mediaProvider: mediaProvider,
              contextIdentifierProvider: contextIdentifierProvider,
              isCopyPasteEnabled: mediaOptions.isCopyPasteEnabled,
              anchorPos: _this3.view.state.selection.$anchor.pos,
              headPos: _this3.view.state.selection.$head.pos,
              mediaOptions: mediaOptions
            });
          };

          return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
            editorView: _this3.view,
            plugins: {
              reactNodeViewState: _reactNodeview.stateKey,
              editorDisabledPlugin: _editorDisabled.pluginKey
            },
            render: renderFn
          });
        }
      });
    }
  }]);
  return MediaGroupNodeView;
}(_ReactNodeView2.default);

var ReactMediaGroupNode = function ReactMediaGroupNode(portalProviderAPI, eventDispatcher, providerFactory) {
  var mediaOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory,
      mediaOptions: mediaOptions
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
};

exports.ReactMediaGroupNode = ReactMediaGroupNode;