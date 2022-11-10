import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { injectIntl } from 'react-intl-next';
import { IconMap } from '../../plugins/alignment/ui/ToolbarAlignment/icon-map';
import AlignmentButton from './AlignmentButton';
import { alignmentMessages } from './messages';
import { alignmentWrapper } from './styles';
import { alignLeft, alignRight } from '../../keymaps';
var alignmentOptions = [{
  title: alignmentMessages.alignLeft,
  shortcut: alignLeft,
  value: 'start'
}, {
  title: alignmentMessages.alignCenter,
  value: 'center'
}, {
  title: alignmentMessages.alignRight,
  shortcut: alignRight,
  value: 'end'
}];

var Alignment = /*#__PURE__*/function (_PureComponent) {
  _inherits(Alignment, _PureComponent);

  var _super = _createSuper(Alignment);

  function Alignment() {
    _classCallCheck(this, Alignment);

    return _super.apply(this, arguments);
  }

  _createClass(Alignment, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          onClick = _this$props.onClick,
          selectedAlignment = _this$props.selectedAlignment,
          className = _this$props.className,
          intl = _this$props.intl;
      return jsx("div", {
        css: alignmentWrapper,
        className: className
      }, alignmentOptions.map(function (alignment) {
        var value = alignment.value,
            title = alignment.title,
            shortcut = alignment.shortcut;
        var message = intl.formatMessage(title);
        return jsx(AlignmentButton, {
          content: jsx(IconMap, {
            alignment: value
          }),
          key: value,
          value: value,
          label: message,
          shortcut: shortcut,
          onClick: onClick,
          isSelected: value === selectedAlignment
        });
      }));
    }
  }]);

  return Alignment;
}(PureComponent);

export default injectIntl(Alignment);