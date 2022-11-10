"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaPickerComponents = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _ClipboardWrapper = require("./ClipboardWrapper");

var _DropzoneWrapper = require("./DropzoneWrapper");

var _BrowserWrapper = require("./BrowserWrapper");

var _WithPluginState = _interopRequireDefault(require("../../../../ui/WithPluginState"));

var _focusHandler = require("../../../../plugins/base/pm-plugins/focus-handler");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var MediaPickerComponents = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(MediaPickerComponents, _React$Component);

  var _super = _createSuper(MediaPickerComponents);

  function MediaPickerComponents() {
    var _this;

    (0, _classCallCheck2.default)(this, MediaPickerComponents);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      isPopupOpened: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onBrowseFn", function (nativeBrowseFn) {
      var mediaState = _this.props.mediaState;
      mediaState && mediaState.setBrowseFn(nativeBrowseFn);
    });
    return _this;
  }

  (0, _createClass2.default)(MediaPickerComponents, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var mediaState = this.props.mediaState;
      mediaState.onPopupToggle(function (isPopupOpened) {
        _this2.setState({
          isPopupOpened: isPopupOpened
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          mediaState = _this$props.mediaState,
          editorDomElement = _this$props.editorDomElement,
          appearance = _this$props.appearance;
      var isPopupOpened = this.state.isPopupOpened;
      var featureFlags = mediaState.mediaOptions && mediaState.mediaOptions.featureFlags;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          focus: _focusHandler.focusStateKey
        },
        render: function render(_ref) {
          var focus = _ref.focus;
          var clipboard = focus ? /*#__PURE__*/_react.default.createElement(_ClipboardWrapper.ClipboardWrapper, {
            mediaState: mediaState,
            featureFlags: featureFlags
          }) : null;
          return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, clipboard, /*#__PURE__*/_react.default.createElement(_DropzoneWrapper.DropzoneWrapper, {
            mediaState: mediaState,
            isActive: !isPopupOpened,
            featureFlags: featureFlags,
            editorDomElement: editorDomElement,
            appearance: appearance
          }), /*#__PURE__*/_react.default.createElement(_BrowserWrapper.BrowserWrapper, {
            onBrowseFn: _this3.onBrowseFn,
            mediaState: mediaState,
            featureFlags: featureFlags
          }));
        }
      });
    }
  }]);
  return MediaPickerComponents;
}(_react.default.Component);

exports.MediaPickerComponents = MediaPickerComponents;
(0, _defineProperty2.default)(MediaPickerComponents, "displayName", 'MediaPickerComponents');