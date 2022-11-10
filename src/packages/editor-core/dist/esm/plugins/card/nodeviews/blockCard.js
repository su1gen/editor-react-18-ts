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
import { Card as SmartCard } from '@atlaskit/smart-card';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import PropTypes from 'prop-types';
import rafSchedule from 'raf-schd';
import { Card } from './genericCard';
import { ReactNodeView } from '../../../nodeviews/';
import { registerCard } from '../pm-plugins/actions';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
export var BlockCardComponent = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(BlockCardComponent, _React$PureComponent);

  var _super = _createSuper(BlockCardComponent);

  function BlockCardComponent() {
    var _this;

    _classCallCheck(this, BlockCardComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {});

    _defineProperty(_assertThisInitialized(_this), "onResolve", function (data) {
      var _this$props = _this.props,
          getPos = _this$props.getPos,
          view = _this$props.view;

      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      var title = data.title,
          url = data.url; // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview

      rafSchedule(function () {
        return view.dispatch(registerCard({
          title: title,
          url: url,
          pos: getPos()
        })(view.state.tr));
      })();
    });

    _defineProperty(_assertThisInitialized(_this), "gapCursorSpan", function () {
      // Don't render in EdgeHTMl version <= 18 (Edge version 44)
      // as it forces the edit popup to render 24px lower than it should
      if (browser.ie && browser.ie_version < 79) {
        return;
      } // render an empty span afterwards to get around Webkit bug
      // that puts caret in next editable text element


      return /*#__PURE__*/React.createElement("span", {
        contentEditable: true
      });
    });

    return _this;
  }

  _createClass(BlockCardComponent, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var view = this.props.view;
      var scrollContainer = findOverflowScrollParent(view.dom);
      this.scrollContainer = scrollContainer || undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          node = _this$props2.node,
          cardContext = _this$props2.cardContext,
          platform = _this$props2.platform;
      var _node$attrs = node.attrs,
          url = _node$attrs.url,
          data = _node$attrs.data;
      var cardInner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SmartCard, {
        key: url,
        url: url,
        data: data,
        container: this.scrollContainer,
        appearance: "block",
        onClick: this.onClick,
        onResolve: this.onResolve,
        showActions: platform === 'web',
        platform: platform
      }), this.gapCursorSpan()); // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
      // otherwise if we got data, we can render the card directly since it doesn't need the Provider

      return /*#__PURE__*/React.createElement("div", null, cardContext && cardContext.value ? /*#__PURE__*/React.createElement(cardContext.Provider, {
        value: cardContext.value
      }, cardInner) : data ? cardInner : null);
    }
  }]);

  return BlockCardComponent;
}(React.PureComponent);

_defineProperty(BlockCardComponent, "contextTypes", {
  contextAdapter: PropTypes.object
});

var WrappedBlockCard = Card(BlockCardComponent, UnsupportedBlock);
export var BlockCard = /*#__PURE__*/function (_ReactNodeView) {
  _inherits(BlockCard, _ReactNodeView);

  var _super2 = _createSuper(BlockCard);

  function BlockCard() {
    _classCallCheck(this, BlockCard);

    return _super2.apply(this, arguments);
  }

  _createClass(BlockCard, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('div');

      if (browser.chrome && this.reactComponentProps.platform !== 'mobile') {
        // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
        // see also: https://github.com/ProseMirror/prosemirror/issues/884
        domRef.contentEditable = 'true';
        domRef.setAttribute('spellcheck', 'false');
      }

      return domRef;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(WrappedBlockCard, {
        node: this.node,
        view: this.view,
        getPos: this.getPos,
        platform: this.reactComponentProps.platform
      });
    }
  }]);

  return BlockCard;
}(ReactNodeView);