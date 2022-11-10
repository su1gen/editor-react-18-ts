import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react'; // AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

import { fontSizeSmall } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';
import { N20, N300, N800 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { getCorrectAltByIconUrl } from './listItemAlts';
import { transformTimeStamp } from './transformTimeStamp';
import { injectIntl } from 'react-intl-next';
export var container = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background-color: transparent;\n  padding: 8px 12px;\n  cursor: pointer;\n  display: flex;\n  margin-top: 0;\n"])));
export var containerSelected = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  background-color: ", ";\n"])), token('color.background.neutral.subtle.hovered', N20));
var nameWrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  overflow: hidden;\n"])));
export var nameStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  color: ", ";\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  line-height: 20px;\n"])), token('color.text', N800));
export var containerName = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  color: ", ";\n  line-height: 14px;\n  font-size: ", ";\n"])), token('color.text.subtlest', N300), relativeFontSizeToBase16(fontSizeSmall()));
var iconStyle = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  min-width: 16px;\n  margin-top: 3px;\n  margin-right: 12px;\n\n  img {\n    max-width: 16px;\n  }\n"])));

var LinkSearchListItem = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(LinkSearchListItem, _React$PureComponent);

  var _super = _createSuper(LinkSearchListItem);

  function LinkSearchListItem() {
    var _this;

    _classCallCheck(this, LinkSearchListItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleSelect", function (e) {
      e.preventDefault(); // don't let editor lose focus

      var _this$props = _this.props,
          item = _this$props.item,
          onSelect = _this$props.onSelect;
      onSelect(item.url, item.name);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseMove", function () {
      var _this$props2 = _this.props,
          onMouseMove = _this$props2.onMouseMove,
          item = _this$props2.item;
      onMouseMove && onMouseMove(item.objectId);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseEnter", function () {
      var _this$props3 = _this.props,
          onMouseEnter = _this$props3.onMouseEnter,
          item = _this$props3.item;
      onMouseEnter && onMouseEnter(item.objectId);
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseLeave", function () {
      var _this$props4 = _this.props,
          onMouseLeave = _this$props4.onMouseLeave,
          item = _this$props4.item;
      onMouseLeave && onMouseLeave(item.objectId);
    });

    return _this;
  }

  _createClass(LinkSearchListItem, [{
    key: "renderIcon",
    value: function renderIcon() {
      var _this$props5 = this.props,
          _this$props5$item = _this$props5.item,
          icon = _this$props5$item.icon,
          iconUrl = _this$props5$item.iconUrl,
          intl = _this$props5.intl;

      if (icon) {
        return jsx("span", {
          css: iconStyle
        }, icon);
      }

      if (iconUrl) {
        return jsx("span", {
          css: iconStyle
        }, jsx("img", {
          src: iconUrl,
          alt: getCorrectAltByIconUrl(iconUrl, intl)
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
      var date = transformTimeStamp(intl, item.lastViewedDate, item.lastUpdatedDate);
      return date && jsx(Fragment, null, "\xA0 \u2022", jsx("span", {
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
      return jsx("li", {
        css: [container, selected && containerSelected],
        role: role,
        id: id,
        "aria-selected": selected,
        "data-testid": "link-search-list-item",
        onMouseMove: this.handleMouseMove,
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onClick: this.handleSelect
      }, this.renderIcon(), jsx("span", {
        css: nameWrapper
      }, jsx("div", {
        css: nameStyle
      }, item.name), jsx("div", {
        "data-testid": "link-search-list-item-container",
        css: containerName
      }, item.container, this.renderTimeStamp())));
    }
  }]);

  return LinkSearchListItem;
}(React.PureComponent);

export default injectIntl(LinkSearchListItem);