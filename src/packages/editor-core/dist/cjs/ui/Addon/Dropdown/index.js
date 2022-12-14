"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _styles = require("./styles");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DropdownWrapper = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(DropdownWrapper, _React$Component);

  var _super = _createSuper(DropdownWrapper);

  function DropdownWrapper() {
    var _this;

    (0, _classCallCheck2.default)(this, DropdownWrapper);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClick", function (actions) {
      var actionOnClick = actions.actionOnClick,
          renderOnClick = actions.renderOnClick;
      var editorActions = _this.props.editorActions;

      if (actionOnClick) {
        actionOnClick(editorActions);

        _this.props.togglePopup();
      } else if (renderOnClick) {
        _this.props.onClick(editorActions, renderOnClick);
      }
    });
    return _this;
  }

  (0, _createClass2.default)(DropdownWrapper, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      // adding onClick handler to each DropdownItem component
      var children = _react.default.Children.map(this.props.children, function (child) {
        return /*#__PURE__*/_react.default.cloneElement(child, {
          onClick: _this2.handleClick
        });
      });

      return (0, _react2.jsx)("div", {
        css: _styles.dropdown
      }, children);
    }
  }]);
  return DropdownWrapper;
}(_react.default.Component);

exports.default = DropdownWrapper;