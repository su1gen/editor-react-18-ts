"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MediaNode = exports.MEDIA_HEIGHT = exports.FILE_WIDTH = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _utils = require("@atlaskit/editor-common/utils");

var _mediaCard = require("@atlaskit/media-card");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _react = _interopRequireWildcard(require("react"));

var _utils2 = require("../../../../utils");

var _pluginKey = require("../../pm-plugins/plugin-key");

var _styles = require("../styles");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// This is being used by DropPlaceholder now
var MEDIA_HEIGHT = 125;
exports.MEDIA_HEIGHT = MEDIA_HEIGHT;
var FILE_WIDTH = 156;
exports.FILE_WIDTH = FILE_WIDTH;

var MediaNode = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(MediaNode, _Component);

  var _super = _createSuper(MediaNode);

  function MediaNode(_props) {
    var _this;

    (0, _classCallCheck2.default)(this, MediaNode);
    _this = _super.call(this, _props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setViewMediaClientConfig", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var mediaProvider, viewMediaClientConfig;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.props.mediaProvider;

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
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "selectMediaSingleFromCard", function (_ref2) {
      var event = _ref2.event;

      _this.selectMediaSingle(event);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "selectMediaSingle", function (event) {
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

        (0, _utils2.setTextSelection)(_this.props.view, state.selection.from < propPos ? state.selection.from : propPos - 1, // + 3 needed for offset of the media inside mediaSingle and cursor to make whole mediaSingle selected
        state.selection.to > propPos ? state.selection.to : propPos + 2);
      } else {
        (0, _utils2.setNodeSelection)(_this.props.view, propPos - 1);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onFullscreenChange", function (fullscreen) {
      _this.mediaPluginState.updateAndDispatch({
        isFullscreen: fullscreen
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleNewNode", function (props) {
      var node = props.node;

      _this.mediaPluginState.handleMediaNodeMount(node, function () {
        return _this.props.getPos();
      });
    });
    var view = _this.props.view;
    _this.mediaPluginState = _pluginKey.stateKey.getState(view.state);
    return _this;
  }

  (0, _createClass2.default)(MediaNode, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var hasNewViewMediaClientConfig = !this.state.viewMediaClientConfig && nextState.viewMediaClientConfig;

      if (this.props.selected !== nextProps.selected || this.props.node.attrs.id !== nextProps.node.attrs.id || this.props.node.attrs.collection !== nextProps.node.attrs.collection || this.props.maxDimensions.height !== nextProps.maxDimensions.height || this.props.maxDimensions.width !== nextProps.maxDimensions.width || this.props.contextIdentifierProvider !== nextProps.contextIdentifierProvider || this.props.isLoading !== nextProps.isLoading || this.props.mediaProvider !== nextProps.mediaProvider || hasNewViewMediaClientConfig) {
        return true;
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        var contextIdentifierProvider;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.handleNewNode(this.props);
                contextIdentifierProvider = this.props.contextIdentifierProvider;
                _context2.t0 = this;
                _context2.next = 5;
                return contextIdentifierProvider;

              case 5:
                _context2.t1 = _context2.sent;
                _context2.t2 = {
                  contextIdentifierProvider: _context2.t1
                };

                _context2.t0.setState.call(_context2.t0, _context2.t2);

                _context2.next = 10;
                return this.setViewMediaClientConfig();

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var node = this.props.node;
      this.mediaPluginState.handleMediaNodeUnmount(node);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.node.attrs.id !== this.props.node.attrs.id) {
        this.mediaPluginState.handleMediaNodeUnmount(prevProps.node);
        this.handleNewNode(this.props);
      }

      this.mediaPluginState.updateElement();
      this.setViewMediaClientConfig();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          node = _this$props.node,
          selected = _this$props.selected,
          originalDimensions = _this$props.originalDimensions,
          isLoading = _this$props.isLoading,
          maxDimensions = _this$props.maxDimensions,
          mediaOptions = _this$props.mediaOptions;
      var _this$state = this.state,
          viewMediaClientConfig = _this$state.viewMediaClientConfig,
          contextIdentifierProvider = _this$state.contextIdentifierProvider;
      var _node$attrs = node.attrs,
          id = _node$attrs.id,
          type = _node$attrs.type,
          collection = _node$attrs.collection,
          url = _node$attrs.url,
          alt = _node$attrs.alt;

      if (isLoading || type !== 'external' && !viewMediaClientConfig) {
        return /*#__PURE__*/_react.default.createElement(_styles.MediaCardWrapper, {
          dimensions: originalDimensions
        }, /*#__PURE__*/_react.default.createElement(_mediaCard.CardLoading, null));
      }

      var contextId = contextIdentifierProvider && contextIdentifierProvider.objectId;
      var identifier = type === 'external' ? {
        dataURI: url,
        name: url,
        mediaItemType: 'external-image'
      } : {
        id: id,
        mediaItemType: 'file',
        collectionName: collection
      }; // mediaClientConfig is not needed for "external" case. So we have to cheat here.
      // there is a possibility mediaClientConfig will be part of a identifier,
      // so this might be not an issue

      var mediaClientConfig = viewMediaClientConfig || {
        authProvider: function authProvider() {
          return {};
        }
      };
      return /*#__PURE__*/_react.default.createElement(_styles.MediaCardWrapper, {
        dimensions: originalDimensions,
        onContextMenu: this.selectMediaSingle
      }, /*#__PURE__*/_react.default.createElement(_mediaCard.Card, {
        mediaClientConfig: mediaClientConfig,
        resizeMode: "stretchy-fit",
        dimensions: maxDimensions,
        originalDimensions: originalDimensions,
        identifier: identifier,
        selectable: true,
        selected: selected,
        disableOverlay: true,
        onFullscreenChange: this.onFullscreenChange,
        onClick: this.selectMediaSingleFromCard,
        useInlinePlayer: mediaOptions && mediaOptions.allowLazyLoading,
        isLazy: mediaOptions && mediaOptions.allowLazyLoading,
        featureFlags: mediaOptions && mediaOptions.featureFlags,
        contextId: contextId,
        alt: alt
      }));
    }
  }]);
  return MediaNode;
}(_react.Component);

exports.MediaNode = MediaNode;

var _default = (0, _utils.withImageLoader)(MediaNode);

exports.default = _default;