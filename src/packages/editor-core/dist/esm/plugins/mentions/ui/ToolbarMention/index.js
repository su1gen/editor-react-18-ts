import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { PureComponent } from 'react';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { INPUT_METHOD } from '../../../analytics';
import { createTypeAheadTools } from '../../../type-ahead/api';
import { injectIntl } from 'react-intl-next';
import { messages } from '../../messages';

var ToolbarMention = /*#__PURE__*/function (_PureComponent) {
  _inherits(ToolbarMention, _PureComponent);

  var _super = _createSuper(ToolbarMention);

  function ToolbarMention() {
    var _this;

    _classCallCheck(this, ToolbarMention);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleInsertMention", function () {
      if (!_this.props.editorView) {
        return false;
      }

      createTypeAheadTools(_this.props.editorView).openMention(INPUT_METHOD.INSERT_MENU);
      return true;
    });

    return _this;
  }

  _createClass(ToolbarMention, [{
    key: "render",
    value: function render() {
      var mentionStringTranslated = this.props.intl.formatMessage(messages.mentionsIconLabel);
      return /*#__PURE__*/React.createElement(ToolbarButton, {
        testId: this.props.testId,
        buttonId: TOOLBAR_BUTTON.MENTION,
        spacing: "none",
        onClick: this.handleInsertMention,
        disabled: this.props.isDisabled,
        title: mentionStringTranslated + '@',
        iconBefore: /*#__PURE__*/React.createElement(MentionIcon, {
          label: mentionStringTranslated
        })
      });
    }
  }]);

  return ToolbarMention;
}(PureComponent);

export default injectIntl(ToolbarMention);