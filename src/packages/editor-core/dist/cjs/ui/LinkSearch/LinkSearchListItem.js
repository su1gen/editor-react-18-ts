"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameStyle = exports.default = exports.containerSelected = exports.containerName = exports.container = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _theme = require("@atlaskit/theme");

var _tokens = require("@atlaskit/tokens");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _listItemAlts = require("./listItemAlts");

var _transformTimeStamp = require("./transformTimeStamp");

var _reactIntlNext = require("react-intl-next");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var container = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background-color: transparent;\n  padding: 8px 12px;\n  cursor: pointer;\n  display: flex;\n  margin-top: 0;\n"])));
exports.container = container;
var containerSelected = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n"])), (0, _tokens.token)('color.background.neutral.subtle.hovered', _colors.N20));
exports.containerSelected = containerSelected;
var nameWrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  overflow: hidden;\n"])));
var nameStyle = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  line-height: 20px;\n"])), (0, _tokens.token)('color.text', _colors.N800));
exports.nameStyle = nameStyle;
var containerName = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  line-height: 14px;\n  font-size: ", ";\n"])), (0, _tokens.token)('color.text.subtlest', _colors.N300), (0, _editorSharedStyles.relativeFontSizeToBase16)((0, _theme.fontSizeSmall)()));
exports.containerName = containerName;
var iconStyle = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  min-width: 16px;\n  margin-top: 3px;\n  margin-right: 12px;\n\n  img {\n    max-width: 16px;\n  }\n"])));

var LinkSearchListItem = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(LinkSearchListItem, _React$PureComponent);

  var _super = _createSuper(LinkSearchListItem);

  function LinkSearchListItem() {
    var _this;

    (0, _classCallCheck2.default)(this, LinkSearchListItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSelect", function (e) {
      e.preventDefault(); // don't let editor lose focus

      var _this$props = _this.props,
          item = _this$props.item,
          onSelect = _this$props.onSelect;
      onSelect(item.url, item.name);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMouseMove", function () {
      var _this$props2 = _this.props,
          onMouseMove = _this$props2.onMouseMove,
          item = _this$props2.item;
      onMouseMove && onMouseMove(item.objectId);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMouseEnter", function () {
      var _this$props3 = _this.props,
          onMouseEnter = _this$props3.onMouseEnter,
          item = _this$props3.item;
      onMouseEnter && onMouseEnter(item.objectId);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMouseLeave", function () {
      var _this$props4 = _this.props,
          onMouseLeave = _this$props4.onMouseLeave,
          item = _this$props4.item;
      onMouseLeave && onMouseLeave(item.objectId);
    });
    return _this;
  }

  (0, _createClass2.default)(LinkSearchListItem, [{
    key: "renderIcon",
    value: function renderIcon() {
      var _this$props5 = this.props,
          _this$props5$item = _this$props5.item,
          icon = _this$props5$item.icon,
          iconUrl = _this$props5$item.iconUrl,
          intl = _this$props5.intl;

      if (icon) {
        return (0, _react2.jsx)("span", {
          css: iconStyle
        }, icon);
      }

      if (iconUrl) {
        return (0, _react2.jsx)("span", {
          css: iconStyle
        }, (0, _react2.jsx)("img", {
          src: iconUrl,
          alt: (0, _listItemAlts.getCorrectAltByIconUrl)(iconUrl, intl)
        }));
      }

      return null;
    }
  }, {
    key: "renderTimeStamp",
    value: function renderTimeStamp() {
      var _this$props6 = this.props,
          item = _this$props6.item,
          intl = _this$props6.intl;
      var date = (0, _transformTimeStamp.transformTimeStamp)(intl, item.lastViewedDate, item.lastUpdatedDate);
      return date && (0, _react2.jsx)(_react.Fragment, null, "\xA0 \u2022", (0, _react2.jsx)("span", {
        className: "link-search-timestamp",
        "data-test-id": "link-search-timestamp"
      }, "\xA0 ", date.pageAction, " ", date.dateString, " ", date.timeSince || ''));
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props7 = this.props,
          item = _this$props7.item,
          selected = _this$props7.selected,
          id = _this$props7.id,
          role = _this$props7.role;
      return (0, _react2.jsx)("li", {
        css: [container, selected && containerSelected],
        role: role,
        id: id,
        "aria-selected": selected,
        "data-testid": "link-search-list-item",
        onMouseMove: this.handleMouseMove,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onClick: this.handleSelect
      }, this.renderIcon(), (0, _react2.jsx)("span", {
        css: nameWrapper
      }, (0, _react2.jsx)("div", {
        css: nameStyle
      }, item.name), (0, _react2.jsx)("div", {
        "data-testid": "link-search-list-item-container",
        css: containerName
      }, item.container, this.renderTimeStamp())));
    }
  }]);
  return LinkSearchListItem;
}(_react.default.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(LinkSearchListItem);

exports.default = _default;