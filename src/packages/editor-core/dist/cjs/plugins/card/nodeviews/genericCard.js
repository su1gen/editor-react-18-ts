"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Card = Card;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _adfSchema = require("@atlaskit/adf-schema");

var _utils = require("../utils");

var _doc = require("../pm-plugins/doc");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function Card(SmartCardComponent, UnsupportedComponent) {
  var _class;

  return _class = /*#__PURE__*/function (_React$Component) {
    (0, _inherits2.default)(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class() {
      var _this;

      (0, _classCallCheck2.default)(this, _class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));
      (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
        isError: false
      });
      return _this;
    }

    (0, _createClass2.default)(_class, [{
      key: "render",
      value: function render() {
        var _titleUrlPairFromNode = (0, _utils.titleUrlPairFromNode)(this.props.node),
            url = _titleUrlPairFromNode.url;

        if (url && !(0, _adfSchema.isSafeUrl)(url)) {
          return /*#__PURE__*/_react.default.createElement(UnsupportedComponent, null);
        }

        if (this.state.isError) {
          if (url) {
            return /*#__PURE__*/_react.default.createElement("a", {
              href: url,
              onClick: function onClick(e) {
                e.preventDefault();
              }
            }, url);
          } else {
            return /*#__PURE__*/_react.default.createElement(UnsupportedComponent, null);
          }
        }

        var cardContext = this.context.contextAdapter ? this.context.contextAdapter.card : undefined;
        return /*#__PURE__*/_react.default.createElement(SmartCardComponent, (0, _extends2.default)({
          key: url,
          cardContext: cardContext
        }, this.props));
      }
    }, {
      key: "componentDidCatch",
      value: function componentDidCatch(error) {
        var maybeAPIError = error; // NB: errors received in this component are propagated by the `@atlaskit/smart-card` component.
        // Depending on the kind of error, the expectation for this component is to either:
        // (1) Render a blue link whilst retaining `inlineCard` in the ADF (non-fatal errs);
        // (2) Render a blue link whilst downgrading to `link` in the ADF (fatal errs).

        if (maybeAPIError.kind && maybeAPIError.kind === 'fatal') {
          this.setState({
            isError: true
          });
          var _this$props = this.props,
              view = _this$props.view,
              node = _this$props.node,
              getPos = _this$props.getPos;

          var _titleUrlPairFromNode2 = (0, _utils.titleUrlPairFromNode)(node),
              url = _titleUrlPairFromNode2.url;

          if (!getPos || typeof getPos === 'boolean') {
            return;
          }

          (0, _doc.changeSelectedCardToLinkFallback)(undefined, url, true, node, getPos())(view.state, view.dispatch);
          return null;
        } else {
          // Otherwise, render a blue link as fallback (above in render()).
          this.setState({
            isError: true
          });
        }
      }
    }]);
    return _class;
  }(_react.default.Component), (0, _defineProperty2.default)(_class, "contextTypes", {
    contextAdapter: _propTypes.default.object
  }), _class;
}