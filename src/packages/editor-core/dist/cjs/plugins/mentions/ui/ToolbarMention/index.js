"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _react = _interopRequireWildcard(require("react"));

var _mention = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/mention"));

var _ToolbarButton = _interopRequireWildcard(require("../../../../ui/ToolbarButton"));

var _analytics = require("../../../analytics");

var _api = require("../../../type-ahead/api");

var _reactIntlNext = require("react-intl-next");

var _messages = require("../../messages");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ToolbarMention = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(ToolbarMention, _PureComponent);

  var _super = _createSuper(ToolbarMention);

  function ToolbarMention() {
    var _this;

    (0, _classCallCheck2.default)(this, ToolbarMention);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInsertMention", function () {
      if (!_this.props.editorView) {
        return false;
      }

      (0, _api.createTypeAheadTools)(_this.props.editorView).openMention(_analytics.INPUT_METHOD.INSERT_MENU);
      return true;
    });
    return _this;
  }

  (0, _createClass2.default)(ToolbarMention, [{
    key: "render",
    value: function render() {
      var mentionStringTranslated = this.props.intl.formatMessage(_messages.messages.mentionsIconLabel);
      return /*#__PURE__*/_react.default.createElement(_ToolbarButton.default, {
        testId: this.props.testId,
        buttonId: _ToolbarButton.TOOLBAR_BUTTON.MENTION,
        spacing: "none",
        onClick: this.handleInsertMention,
        disabled: this.props.isDisabled,
        title: mentionStringTranslated + '@',
        iconBefore: /*#__PURE__*/_react.default.createElement(_mention.default, {
          label: mentionStringTranslated
        })
      });
    }
  }]);
  return ToolbarMention;
}(_react.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(ToolbarMention);

exports.default = _default;