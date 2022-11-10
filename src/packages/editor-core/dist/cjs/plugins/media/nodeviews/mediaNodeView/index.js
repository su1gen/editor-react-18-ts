"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactMediaNode = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _prosemirrorState = require("prosemirror-state");

var _react = _interopRequireDefault(require("react"));

var _nodeviews = require("../../../../nodeviews");

var _WithPluginState = _interopRequireDefault(require("../../../../ui/WithPluginState"));

var _width = require("../../../width");

var _media = _interopRequireDefault(require("./media"));

var _mediaClient = require("@atlaskit/media-client");

var _mediaCommon = require("../../utils/media-common");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var MediaNodeView = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  (0, _inherits2.default)(MediaNodeView, _SelectionBasedNodeVi);

  var _super = _createSuper(MediaNodeView);

  function MediaNodeView() {
    var _this;

    (0, _classCallCheck2.default)(this, MediaNodeView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderMediaNodeWithState", function (mediaProvider, contextIdentifierProvider) {
      return function (_ref) {
        var editorWidth = _ref.width;
        var getPos = _this.getPos;
        var mediaOptions = _this.reactComponentProps.mediaOptions;
        var selection = _this.view.state.selection;

        var isSelected = function isSelected() {
          return _this.isNodeInsideSelection(selection.from, selection.to) || selection instanceof _prosemirrorState.NodeSelection && selection.from === getPos();
        };

        var attrs = _this.getAttrs();

        var url = attrs.type === 'external' ? attrs.url : '';
        var width = attrs.width,
            height = attrs.height;

        if (_this.isMediaBlobUrl()) {
          var urlAttrs = (0, _mediaClient.getAttrsFromUrl)(url);

          if (urlAttrs) {
            var urlWidth = urlAttrs.width,
                urlHeight = urlAttrs.height;
            width = width || urlWidth;
            height = height || urlHeight;
          }
        }

        width = width || _ui.DEFAULT_IMAGE_WIDTH;
        height = height || _ui.DEFAULT_IMAGE_HEIGHT;
        var maxDimensions = {
          width: "".concat(editorWidth.width, "px"),
          height: "".concat(height / width * editorWidth.width, "px")
        };
        var originalDimensions = {
          width: width,
          height: height
        };
        return /*#__PURE__*/_react.default.createElement(_media.default, {
          view: _this.view,
          node: _this.node,
          getPos: getPos,
          selected: isSelected(),
          originalDimensions: originalDimensions,
          maxDimensions: maxDimensions,
          url: url,
          mediaProvider: mediaProvider,
          contextIdentifierProvider: contextIdentifierProvider,
          mediaOptions: mediaOptions
        });
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderMediaNodeWithProviders", function (_ref2) {
      var mediaProvider = _ref2.mediaProvider,
          contextIdentifierProvider = _ref2.contextIdentifierProvider;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        editorView: _this.view,
        plugins: {
          width: _width.pluginKey
        },
        render: _this.renderMediaNodeWithState(mediaProvider, contextIdentifierProvider)
      });
    });
    return _this;
  }

  (0, _createClass2.default)(MediaNodeView, [{
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
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.node.attrs !== nextNode.attrs) {
        return true;
      }

      return (0, _get2.default)((0, _getPrototypeOf2.default)(MediaNodeView.prototype), "viewShouldUpdate", this).call(this, nextNode);
    }
  }, {
    key: "stopEvent",
    value: function stopEvent(event) {
      // Don't trap right click events on media node
      if (['mousedown', 'contextmenu'].indexOf(event.type) !== -1) {
        var mouseEvent = event;

        if (mouseEvent.button === 2) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "getAttrs",
    value: function getAttrs() {
      var attrs = this.node.attrs;
      return attrs;
    }
  }, {
    key: "isMediaBlobUrl",
    value: function isMediaBlobUrl() {
      var attrs = this.getAttrs();
      return (0, _mediaCommon.isMediaBlobUrlFromAttrs)(attrs);
    }
  }, {
    key: "render",
    value: function render() {
      var providerFactory = this.reactComponentProps.providerFactory;
      return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: this.renderMediaNodeWithProviders
      });
    }
  }]);
  return MediaNodeView;
}(_nodeviews.SelectionBasedNodeView);

var ReactMediaNode = function ReactMediaNode(portalProviderAPI, eventDispatcher, providerFactory) {
  var mediaOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new MediaNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      eventDispatcher: eventDispatcher,
      providerFactory: providerFactory,
      mediaOptions: mediaOptions
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
};

exports.ReactMediaNode = ReactMediaNode;