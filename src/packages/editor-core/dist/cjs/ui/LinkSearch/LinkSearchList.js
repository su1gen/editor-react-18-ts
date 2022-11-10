"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linkSearchList = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _spinner = _interopRequireDefault(require("@atlaskit/spinner"));

var _LinkSearchListItem = _interopRequireDefault(require("./LinkSearchListItem"));

var _templateObject, _templateObject2, _templateObject3;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var listContainer = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  padding-top: 0;\n"])));
var spinnerContainer = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  text-align: center;\n  min-height: 80px;\n  margin-top: 30px;\n"])));
var linkSearchList = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 0;\n  list-style: none;\n"])));
exports.linkSearchList = linkSearchList;

var LinkSearchList = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(LinkSearchList, _PureComponent);

  var _super = _createSuper(LinkSearchList);

  function LinkSearchList() {
    (0, _classCallCheck2.default)(this, LinkSearchList);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(LinkSearchList, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onSelect = _this$props.onSelect,
          onMouseMove = _this$props.onMouseMove,
          onMouseEnter = _this$props.onMouseEnter,
          onMouseLeave = _this$props.onMouseLeave,
          items = _this$props.items,
          selectedIndex = _this$props.selectedIndex,
          isLoading = _this$props.isLoading,
          ariaControls = _this$props.ariaControls,
          role = _this$props.role,
          id = _this$props.id;
      var itemsContent;
      var loadingContent;

      if (items && items.length > 0) {
        itemsContent = (0, _react.jsx)("ul", {
          css: linkSearchList,
          id: id,
          role: role,
          "aria-controls": ariaControls
        }, items.map(function (item, index) {
          return (0, _react.jsx)(_LinkSearchListItem.default, {
            id: "link-search-list-item-".concat(index),
            role: role && 'option',
            item: item,
            selected: selectedIndex === index,
            onMouseMove: onMouseMove,
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave,
            onSelect: onSelect,
            key: item.objectId
          });
        }));
      }

      if (isLoading) {
        loadingContent = (0, _react.jsx)("div", {
          css: spinnerContainer
        }, (0, _react.jsx)(_spinner.default, {
          size: "medium"
        }));
      }

      return (0, _react.jsx)("div", {
        css: listContainer
      }, itemsContent, loadingContent);
    }
  }]);
  return LinkSearchList;
}(_react2.PureComponent);

exports.default = LinkSearchList;