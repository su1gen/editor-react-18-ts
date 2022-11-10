import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { PureComponent } from 'react';
import Spinner from '@atlaskit/spinner';
import LinkSearchListItem from './LinkSearchListItem';
var listContainer = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  padding-top: 0;\n"])));
var spinnerContainer = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  text-align: center;\n  min-height: 80px;\n  margin-top: 30px;\n"])));
export var linkSearchList = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  padding: 0;\n  list-style: none;\n"])));

var LinkSearchList = /*#__PURE__*/function (_PureComponent) {
  _inherits(LinkSearchList, _PureComponent);

  var _super = _createSuper(LinkSearchList);

  function LinkSearchList() {
    _classCallCheck(this, LinkSearchList);

    return _super.apply(this, arguments);
  }

  _createClass(LinkSearchList, [{
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
        itemsContent = jsx("ul", {
          css: linkSearchList,
          id: id,
          role: role,
          "aria-controls": ariaControls
        }, items.map(function (item, index) {
          return jsx(LinkSearchListItem, {
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
        loadingContent = jsx("div", {
          css: spinnerContainer
        }, jsx(Spinner, {
          size: "medium"
        }));
      }

      return jsx("div", {
        css: listContainer
      }, itemsContent, loadingContent);
    }
  }]);

  return LinkSearchList;
}(PureComponent);

export { LinkSearchList as default };