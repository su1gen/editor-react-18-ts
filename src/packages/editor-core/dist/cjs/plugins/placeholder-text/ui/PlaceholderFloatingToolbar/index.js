"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _PanelTextInput = _interopRequireDefault(require("../../../../ui/PanelTextInput"));

var _FloatingToolbar = _interopRequireWildcard(require("../../../../ui/FloatingToolbar"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var messages = (0, _reactIntlNext.defineMessages)({
  placeholderTextPlaceholder: {
    id: 'fabric.editor.placeholderTextPlaceholder',
    defaultMessage: 'Add placeholder text',
    description: ''
  }
});
exports.messages = messages;

var PlaceholderFloatingToolbar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(PlaceholderFloatingToolbar, _React$Component);

  var _super = _createSuper(PlaceholderFloatingToolbar);

  function PlaceholderFloatingToolbar() {
    var _this;

    (0, _classCallCheck2.default)(this, PlaceholderFloatingToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSubmit", function (value) {
      if (value) {
        _this.props.insertPlaceholder(value);

        _this.props.setFocusInEditor();
      } else {
        _this.props.hidePlaceholderFloatingToolbar();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleBlur", function () {
      _this.props.hidePlaceholderFloatingToolbar();
    });
    return _this;
  }

  (0, _createClass2.default)(PlaceholderFloatingToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          getNodeFromPos = _this$props.getNodeFromPos,
          showInsertPanelAt = _this$props.showInsertPanelAt,
          editorViewDOM = _this$props.editorViewDOM,
          popupsMountPoint = _this$props.popupsMountPoint,
          getFixedCoordinatesFromPos = _this$props.getFixedCoordinatesFromPos,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          formatMessage = _this$props.intl.formatMessage;
      var target = getNodeFromPos(showInsertPanelAt);
      var offsetParent = (0, _FloatingToolbar.getOffsetParent)(editorViewDOM, popupsMountPoint);

      var getFixedCoordinates = function getFixedCoordinates() {
        return getFixedCoordinatesFromPos(showInsertPanelAt);
      };

      var handlePositionCalculated = (0, _FloatingToolbar.handlePositionCalculatedWith)(offsetParent, target, getFixedCoordinates);
      return /*#__PURE__*/_react.default.createElement(_FloatingToolbar.default, {
        target: (0, _FloatingToolbar.getNearestNonTextNode)(target),
        onPositionCalculated: handlePositionCalculated,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        fitHeight: 32,
        offset: [0, 12]
      }, /*#__PURE__*/_react.default.createElement(_PanelTextInput.default, {
        placeholder: formatMessage(messages.placeholderTextPlaceholder),
        onSubmit: this.handleSubmit,
        onBlur: this.handleBlur,
        autoFocus: true,
        width: 300
      }));
    }
  }]);
  return PlaceholderFloatingToolbar;
}(_react.default.Component);

var _default = (0, _reactIntlNext.injectIntl)(PlaceholderFloatingToolbar);

exports.default = _default;