import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Component } from 'react';
import { gridSize } from '@atlaskit/theme/constants';
import { B400 } from '@atlaskit/theme/colors';
import { ButtonItem } from '@atlaskit/menu';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import Tooltip from '@atlaskit/tooltip';
import { injectIntl } from 'react-intl-next';
import messages from './messages';
import { token } from '@atlaskit/tokens';
export var menuItemDimensions = {
  width: 175,
  height: 32
};
var spacer = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex: 1;\n  padding: 8px;\n"])));
var menuContainer = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  min-width: ", "px;\n\n  // temporary solution to retain spacing defined by @atlaskit/Item\n  & button {\n    min-height: ", "px;\n    padding: 8px 8px 7px;\n\n    & > [data-item-elem-before] {\n      margin-right: ", "px;\n    }\n  }\n"])), menuItemDimensions.width, gridSize() * 4, gridSize() / 2);
export var itemSpacing = gridSize() / 2;

var Dropdown = /*#__PURE__*/function (_Component) {
  _inherits(Dropdown, _Component);

  var _super = _createSuper(Dropdown);

  function Dropdown() {
    _classCallCheck(this, Dropdown);

    return _super.apply(this, arguments);
  }

  _createClass(Dropdown, [{
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          hide = _this$props.hide,
          dispatchCommand = _this$props.dispatchCommand,
          items = _this$props.items,
          intl = _this$props.intl;
      return jsx("div", {
        css: menuContainer
      }, items.filter(function (item) {
        return !item.hidden;
      }).map(function (item, idx) {
        var itemContent = jsx(ButtonItem, {
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
          return jsx(Tooltip, {
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
        return jsx(EditorDoneIcon, {
          primaryColor: token('color.icon.selected', B400),
          size: "small",
          label: intl.formatMessage(messages.confirmModalOK)
        });
      }

      return jsx("span", {
        css: spacer
      });
    }
  }]);

  return Dropdown;
}(Component);

export default injectIntl(Dropdown);