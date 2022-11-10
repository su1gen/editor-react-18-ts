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
import PropTypes from 'prop-types';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { titleUrlPairFromNode } from '../utils';
import { changeSelectedCardToLinkFallback } from '../pm-plugins/doc';
export function Card(SmartCardComponent, UnsupportedComponent) {
  var _class;

  return _class = /*#__PURE__*/function (_React$Component) {
    _inherits(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class() {
      var _this;

      _classCallCheck(this, _class);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "state", {
        isError: false
      });

      return _this;
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        var _titleUrlPairFromNode = titleUrlPairFromNode(this.props.node),
            url = _titleUrlPairFromNode.url;

        if (url && !isSafeUrl(url)) {
          return /*#__PURE__*/React.createElement(UnsupportedComponent, null);
        }

        if (this.state.isError) {
          if (url) {
            return /*#__PURE__*/React.createElement("a", {
              href: url,
              onClick: function onClick(e) {
                e.preventDefault();
              }
            }, url);
          } else {
            return /*#__PURE__*/React.createElement(UnsupportedComponent, null);
          }
        }

        var cardContext = this.context.contextAdapter ? this.context.contextAdapter.card : undefined;
        return /*#__PURE__*/React.createElement(SmartCardComponent, _extends({
          key: url,
          cardContext: cardContext
        }, this.props));
      }
    }, {
      key: "componentDidCatch",
      value: function componentDidCatch(error) {
        var maybeAPIError = error; // NB: errors received in this component are propagated by the `@atlaskit/smart-card` component.
        // Depending on the kind of error, the expectation for this component is to either:
        // (1) Render a blue link whilst retaining `inlineCard` in the ADF (non-fatal errs);
        // (2) Render a blue link whilst downgrading to `link` in the ADF (fatal errs).

        if (maybeAPIError.kind && maybeAPIError.kind === 'fatal') {
          this.setState({
            isError: true
          });
          var _this$props = this.props,
              view = _this$props.view,
              node = _this$props.node,
              getPos = _this$props.getPos;

          var _titleUrlPairFromNode2 = titleUrlPairFromNode(node),
              url = _titleUrlPairFromNode2.url;

          if (!getPos || typeof getPos === 'boolean') {
            return;
          }

          changeSelectedCardToLinkFallback(undefined, url, true, node, getPos())(view.state, view.dispatch);
          return null;
        } else {
          // Otherwise, render a blue link as fallback (above in render()).
          this.setState({
            isError: true
          });
        }
      }
    }]);

    return _class;
  }(React.Component), _defineProperty(_class, "contextTypes", {
    contextAdapter: PropTypes.object
  }), _class;
}