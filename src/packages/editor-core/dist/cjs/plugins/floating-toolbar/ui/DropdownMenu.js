"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.menuItemDimensions = exports.itemSpacing = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _menu = require("@atlaskit/menu");

var _done = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/done"));

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _reactIntlNext = require("react-intl-next");

var _messages = _interopRequireDefault(require("./messages"));

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var menuItemDimensions = {
  width: 175,
  height: 32
};
exports.menuItemDimensions = menuItemDimensions;
var spacer = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex: 1;\n  padding: 8px;\n"])));
var menuContainer = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  min-width: ", "px;\n\n  // temporary solution to retain spacing defined by @atlaskit/Item\n  & button {\n    min-height: ", "px;\n    padding: 8px 8px 7px;\n\n    & > [data-item-elem-before] {\n      margin-right: ", "px;\n    }\n  }\n"])), menuItemDimensions.width, (0, _constants.gridSize)() * 4, (0, _constants.gridSize)() / 2);
var itemSpacing = (0, _constants.gridSize)() / 2;
exports.itemSpacing = itemSpacing;

var Dropdown = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Dropdown, _Component);

  var _super = _createSuper(Dropdown);

  function Dropdown() {
    (0, _classCallCheck2.default)(this, Dropdown);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Dropdown, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          hide = _this$props.hide,
          dispatchCommand = _this$props.dispatchCommand,
          items = _this$props.items,
          intl = _this$props.intl;
      return (0, _react.jsx)("div", {
        css: menuContainer
      }, items.filter(function (item) {
        return !item.hidden;
      }).map(function (item, idx) {
        var itemContent = (0, _react.jsx)(_menu.ButtonItem, {
          key: idx,
          iconBefore: _this.renderSelected(item, intl),
          iconAfter: item.elemAfter,
          onClick: function onClick() {
            /**
             * The order of dispatching the event and hide() is important, because
             * the ClickAreaBlock will be relying on the element to calculate the
             * click coordinate.
             * For more details, please visit the comment in this PR https://bitbucket.org/atlassian/atlassian-frontend/pull-requests/5328/edm-1321-set-selection-near-smart-link?link_source=email#chg-packages/editor/editor-core/src/plugins/floating-toolbar/ui/DropdownMenu.tsx
             */
            dispatchCommand(item.onClick);
            hide();
          },
          "data-testid": item.testId,
          isDisabled: item.disabled,
          onMouseDown: function onMouseDown(e) {
            e.preventDefault();
          }
        }, item.title);

        if (item.tooltip) {
          return (0, _react.jsx)(_tooltip.default, {
            key: idx,
            content: item.tooltip
          }, itemContent);
        }

        return itemContent;
      }));
    }
  }, {
    key: "renderSelected",
    value: function renderSelected(item, intl) {
      var _this$props$showSelec = this.props.showSelected,
          showSelected = _this$props$showSelec === void 0 ? true : _this$props$showSelec;
      var selected = item.selected;

      if (showSelected && selected) {
        return (0, _react.jsx)(_done.default, {
          primaryColor: (0, _tokens.token)('color.icon.selected', _colors.B400),
          size: "small",
          label: intl.formatMessage(_messages.default.confirmModalOK)
        });
      }

      return (0, _react.jsx)("span", {
        css: spacer
      });
    }
  }]);
  return Dropdown;
}(_react2.Component);

var _default = (0, _reactIntlNext.injectIntl)(Dropdown);

exports.default = _default;