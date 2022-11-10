"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineCardComponent = void 0;
exports.InlineCardNodeView = InlineCardNodeView;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _smartCard = require("@atlaskit/smart-card");

var _ui = require("@atlaskit/editor-common/ui");

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _genericCard = require("./genericCard");

var _actions = require("../pm-plugins/actions");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var InlineCardComponent = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(InlineCardComponent, _React$PureComponent);

  var _super = _createSuper(InlineCardComponent);

  function InlineCardComponent() {
    var _this;

    (0, _classCallCheck2.default)(this, InlineCardComponent);

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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onError", function (data) {
      var url = data.url;

      _this.onResolve({
        url: url
      });
    });
    return _this;
  }

  (0, _createClass2.default)(InlineCardComponent, [{
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
          useAlternativePreloader = _this$props2.useAlternativePreloader;
      var _node$attrs = node.attrs,
          url = _node$attrs.url,
          data = _node$attrs.data;

      var card = /*#__PURE__*/_react.default.createElement("span", {
        className: "card"
      }, /*#__PURE__*/_react.default.createElement(_smartCard.Card, {
        key: url,
        url: url,
        data: data,
        appearance: "inline",
        onClick: this.onClick,
        container: this.scrollContainer,
        onResolve: this.onResolve,
        onError: this.onError,
        inlinePreloaderStyle: useAlternativePreloader ? 'on-right-without-skeleton' : undefined
      })); // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
      // otherwise if we got data, we can render the card directly since it doesn't need the Provider


      return cardContext && cardContext.value ? /*#__PURE__*/_react.default.createElement(cardContext.Provider, {
        value: cardContext.value
      }, card) : data ? card : null;
    }
  }]);
  return InlineCardComponent;
}(_react.default.PureComponent);

exports.InlineCardComponent = InlineCardComponent;
(0, _defineProperty2.default)(InlineCardComponent, "contextTypes", {
  contextAdapter: _propTypes.default.object
});
var WrappedInlineCard = (0, _genericCard.Card)(InlineCardComponent, _ui.UnsupportedInline);

function InlineCardNodeView(props) {
  var useAlternativePreloader = props.useAlternativePreloader,
      node = props.node,
      view = props.view,
      getPos = props.getPos;
  return /*#__PURE__*/_react.default.createElement(WrappedInlineCard, {
    node: node,
    view: view,
    getPos: getPos,
    useAlternativePreloader: useAlternativePreloader
  });
}