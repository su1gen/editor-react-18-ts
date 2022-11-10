import _extends from "@babel/runtime/helpers/extends";
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
import { ResourcedMention } from '@atlaskit/mention/element';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';

var Mention = /*#__PURE__*/function (_PureComponent) {
  _inherits(Mention, _PureComponent);

  var _super = _createSuper(Mention);

  function Mention(props) {
    var _this;

    _classCallCheck(this, Mention);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "renderWithProvider", function (providers) {
      var _this$props = _this.props,
          accessLevel = _this$props.accessLevel,
          eventHandlers = _this$props.eventHandlers,
          id = _this$props.id,
          text = _this$props.text;
      var _ref = providers,
          mentionProvider = _ref.mentionProvider;
      var actionHandlers = {};
      ['onClick', 'onMouseEnter', 'onMouseLeave'].forEach(function (handler) {
        actionHandlers[handler] = eventHandlers && eventHandlers[handler] || function () {};
      });
      return /*#__PURE__*/React.createElement(ResourcedMention, _extends({
        id: id,
        text: text,
        accessLevel: accessLevel,
        mentionProvider: mentionProvider
      }, actionHandlers));
    });

    _this.providerFactory = props.providers || new ProviderFactory();
    return _this;
  }

  _createClass(Mention, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.providers) {
        // new ProviderFactory is created if no `providers` has been set
        // in this case when component is unmounted it's safe to destroy this providerFactory
        this.providerFactory.destroy();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['mentionProvider', 'profilecardProvider'],
        providerFactory: this.providerFactory,
        renderNode: this.renderWithProvider
      });
    }
  }]);

  return Mention;
}(PureComponent);

_defineProperty(Mention, "displayName", 'Mention');

export { Mention as default };