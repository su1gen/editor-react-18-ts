"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlockCardComponent = exports.BlockCard = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _smartCard = require("@atlaskit/smart-card");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _genericCard = require("./genericCard");

var _nodeviews = require("../../../nodeviews/");

var _actions = require("../pm-plugins/actions");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var BlockCardComponent = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(BlockCardComponent, _React$PureComponent);

  var _super = _createSuper(BlockCardComponent);

  function BlockCardComponent() {
    var _this;

    (0, _classCallCheck2.default)(this, BlockCardComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onClick", function () {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onResolve", function (data) {
      var _this$props = _this.props,
          getPos = _this$props.getPos,
          view = _this$props.view;

      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      var title = data.title,
          url = data.url; // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview

      (0, _rafSchd.default)(function () {
        return view.dispatch((0, _actions.registerCard)({
          title: title,
          url: url,
          pos: getPos()
        })(view.state.tr));
      })();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "gapCursorSpan", function () {
      // Don't render in EdgeHTMl version <= 18 (Edge version 44)
      // as it forces the edit popup to render 24px lower than it should
      if (_utils.browser.ie && _utils.browser.ie_version < 79) {
        return;
      } // render an empty span afterwards to get around Webkit bug
      // that puts caret in next editable text element


      return /*#__PURE__*/_react.default.createElement("span", {
        contentEditable: true
      });
    });
    return _this;
  }

  (0, _createClass2.default)(BlockCardComponent, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var view = this.props.view;
      var scrollContainer = (0, _ui.findOverflowScrollParent)(view.dom);
      this.scrollContainer = scrollContainer || undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          node = _this$props2.node,
          cardContext = _this$props2.cardContext,
          platform = _this$props2.platform;
      var _node$attrs = node.attrs,
          url = _node$attrs.url,
          data = _node$attrs.data;

      var cardInner = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_smartCard.Card, {
        key: url,
        url: url,
        data: data,
        container: this.scrollContainer,
        appearance: "block",
        onClick: this.onClick,
        onResolve: this.onResolve,
        showActions: platform === 'web',
        platform: platform
      }), this.gapCursorSpan()); // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
      // otherwise if we got data, we can render the card directly since it doesn't need the Provider


      return /*#__PURE__*/_react.default.createElement("div", null, cardContext && cardContext.value ? /*#__PURE__*/_react.default.createElement(cardContext.Provider, {
        value: cardContext.value
      }, cardInner) : data ? cardInner : null);
    }
  }]);
  return BlockCardComponent;
}(_react.default.PureComponent);

exports.BlockCardComponent = BlockCardComponent;
(0, _defineProperty2.default)(BlockCardComponent, "contextTypes", {
  contextAdapter: _propTypes.default.object
});
var WrappedBlockCard = (0, _genericCard.Card)(BlockCardComponent, _ui.UnsupportedBlock);

var BlockCard = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(BlockCard, _ReactNodeView);

  var _super2 = _createSuper(BlockCard);

  function BlockCard() {
    (0, _classCallCheck2.default)(this, BlockCard);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2.default)(BlockCard, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('div');

      if (_utils.browser.chrome && this.reactComponentProps.platform !== 'mobile') {
        // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
        // see also: https://github.com/ProseMirror/prosemirror/issues/884
        domRef.contentEditable = 'true';
        domRef.setAttribute('spellcheck', 'false');
      }

      return domRef;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement(WrappedBlockCard, {
        node: this.node,
        view: this.view,
        getPos: this.getPos,
        platform: this.reactComponentProps.platform
      });
    }
  }]);
  return BlockCard;
}(_nodeviews.ReactNodeView);

exports.BlockCard = BlockCard;