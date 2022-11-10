"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMediaNodeAttributes = exports.handleNewNode = exports.createMediaNodeUpdater = exports.ReactMediaInlineNode = exports.MediaInlineNodeView = exports.MediaInline = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _nodeviews = require("../../../nodeviews/");

var _WithPluginState = _interopRequireDefault(require("../../../ui/WithPluginState"));

var _mediaCard = require("@atlaskit/media-card");

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _styles = require("./styles");

var _pluginKey = require("../pm-plugins/plugin-key");

var _mediaNodeUpdater = require("./mediaNodeUpdater");

var _mediaUi = require("@atlaskit/media-ui");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createMediaNodeUpdater = function createMediaNodeUpdater(props) {
  var node = props.node;
  return new _mediaNodeUpdater.MediaNodeUpdater(_objectSpread(_objectSpread({}, props), {}, {
    isMediaSingle: true,
    node: node ? node : props.node,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    contextIdentifierProvider: props.contextIdentifierProvider
  }));
};
/**
 * Handles updating the media inline node attributes
 * but also handling copy-paste for cross-editor of the same instance
 * using the contextid
 *
 */


exports.createMediaNodeUpdater = createMediaNodeUpdater;

var updateMediaNodeAttributes = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(props) {
    var mediaNodeUpdater, addPendingTask, node, contextId, hasDifferentContextId, copyNode;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mediaNodeUpdater = createMediaNodeUpdater(props);
            addPendingTask = props.mediaPluginState.addPendingTask;
            node = props.node;

            if (node) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            contextId = mediaNodeUpdater.getNodeContextId();

            if (contextId) {
              _context.next = 9;
              break;
            }

            _context.next = 9;
            return mediaNodeUpdater.updateContextId();

          case 9:
            _context.next = 11;
            return mediaNodeUpdater.hasDifferentContextId();

          case 11:
            hasDifferentContextId = _context.sent;

            if (!hasDifferentContextId) {
              _context.next = 23;
              break;
            }

            _context.prev = 13;
            copyNode = mediaNodeUpdater.copyNode();
            addPendingTask(copyNode);
            _context.next = 18;
            return copyNode;

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](13);
            return _context.abrupt("return");

          case 23:
            _context.next = 25;
            return mediaNodeUpdater.updateFileAttrs();

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[13, 20]]);
  }));

  return function updateMediaNodeAttributes(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.updateMediaNodeAttributes = updateMediaNodeAttributes;

var handleNewNode = function handleNewNode(props) {
  var node = props.node,
      mediaPluginState = props.mediaPluginState,
      getPos = props.getPos;
  mediaPluginState.handleMediaNodeMount(node, function () {
    return getPos();
  });
};

exports.handleNewNode = handleNewNode;

var MediaInline = function MediaInline(props) {
  var _useState = (0, _react.useState)(),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      viewMediaClientConfig = _useState2[0],
      setViewMediaClientConfig = _useState2[1];

  (0, _react.useEffect)(function () {
    handleNewNode(props);
    updateMediaNodeAttributes(props);
    updateViewMediaClientConfig(props);
    return function () {
      var mediaPluginState = props.mediaPluginState;
      mediaPluginState.handleMediaNodeUnmount(props.node);
    };
  }, [props]);

  var updateViewMediaClientConfig = /*#__PURE__*/function () {
    var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(props) {
      var mediaProvider, _viewMediaClientConfig;

      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return props.mediaProvider;

            case 2:
              mediaProvider = _context2.sent;

              if (mediaProvider) {
                _viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
                setViewMediaClientConfig(_viewMediaClientConfig);
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function updateViewMediaClientConfig(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var _props$node$attrs = props.node.attrs,
      id = _props$node$attrs.id,
      collection = _props$node$attrs.collection;
  var identifier = {
    id: id,
    mediaItemType: 'file',
    collectionName: collection
  };
  /*
   * Only show the loading view if the media provider is not ready
   * prevents calling the media API before the provider is ready
   */

  if (!viewMediaClientConfig) {
    return /*#__PURE__*/_react.default.createElement(_mediaUi.MediaInlineCardLoadingView, {
      message: "",
      isSelected: false
    });
  }

  return /*#__PURE__*/_react.default.createElement(_mediaCard.MediaInlineCard, {
    isSelected: props.isSelected,
    identifier: identifier,
    mediaClientConfig: viewMediaClientConfig
  });
};

exports.MediaInline = MediaInline;

var MediaInlineNodeView = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  (0, _inherits2.default)(MediaInlineNodeView, _SelectionBasedNodeVi);

  var _super = _createSuper(MediaInlineNodeView);

  function MediaInlineNodeView() {
    (0, _classCallCheck2.default)(this, MediaInlineNodeView);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(MediaInlineNodeView, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('span');
      domRef.contentEditable = 'false';
      return domRef;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('span');
      dom.classList.add(_styles.MediaInlineNodeSelector);
      return {
        dom: dom
      };
    }
  }, {
    key: "ignoreMutation",
    value: function ignoreMutation() {
      return true;
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.node.attrs !== nextNode.attrs) {
        return true;
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(MediaInlineNodeView.prototype), "viewShouldUpdate", this).call(this, nextNode);
    }
  }, {
    key: "render",
    value: function render(props) {
      var _this = this;

      var providerFactory = props.providerFactory;
      var getPos = this.getPos;
      return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref3) {
          var mediaProvider = _ref3.mediaProvider,
              contextIdentifierProvider = _ref3.contextIdentifierProvider;

          if (!mediaProvider) {
            return null;
          }

          return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
            editorView: _this.view,
            plugins: {
              mediaPluginState: _pluginKey.stateKey
            },
            render: function render(_ref4) {
              var mediaPluginState = _ref4.mediaPluginState;

              if (!mediaPluginState) {
                return null;
              }

              return /*#__PURE__*/_react.default.createElement(MediaInline, {
                identifier: _this.node.attrs.id,
                mediaProvider: mediaProvider,
                mediaPluginState: mediaPluginState,
                node: _this.node,
                isSelected: _this.nodeInsideSelection(),
                view: _this.view,
                getPos: getPos,
                contextIdentifierProvider: contextIdentifierProvider
              });
            }
          });
        }
      });
    }
  }]);
  return MediaInlineNodeView;
}(_nodeviews.SelectionBasedNodeView);

exports.MediaInlineNodeView = MediaInlineNodeView;

var ReactMediaInlineNode = function ReactMediaInlineNode(portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent) {
  return function (node, view, getPos) {
    return new MediaInlineNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent
    }).init();
  };
};

exports.ReactMediaInlineNode = ReactMediaInlineNode;