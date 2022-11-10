import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import PropTypes from 'prop-types';
import { isSafeUrl } from '@atlaskit/adf-schema';
import { titleUrlPairFromNode } from '../utils';
import { changeSelectedCardToLinkFallback } from '../pm-plugins/doc';
export function Card(SmartCardComponent, UnsupportedComponent) {
  var _class;

  return _class = class extends React.Component {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "state", {
        isError: false
      });
    }

    render() {
      const {
        url
      } = titleUrlPairFromNode(this.props.node);

      if (url && !isSafeUrl(url)) {
        return /*#__PURE__*/React.createElement(UnsupportedComponent, null);
      }

      if (this.state.isError) {
        if (url) {
          return /*#__PURE__*/React.createElement("a", {
            href: url,
            onClick: e => {
              e.preventDefault();
            }
          }, url);
        } else {
          return /*#__PURE__*/React.createElement(UnsupportedComponent, null);
        }
      }

      const cardContext = this.context.contextAdapter ? this.context.contextAdapter.card : undefined;
      return /*#__PURE__*/React.createElement(SmartCardComponent, _extends({
        key: url,
        cardContext: cardContext
      }, this.props));
    }

    componentDidCatch(error) {
      const maybeAPIError = error; // NB: errors received in this component are propagated by the `@atlaskit/smart-card` component.
      // Depending on the kind of error, the expectation for this component is to either:
      // (1) Render a blue link whilst retaining `inlineCard` in the ADF (non-fatal errs);
      // (2) Render a blue link whilst downgrading to `link` in the ADF (fatal errs).

      if (maybeAPIError.kind && maybeAPIError.kind === 'fatal') {
        this.setState({
          isError: true
        });
        const {
          view,
          node,
          getPos
        } = this.props;
        const {
          url
        } = titleUrlPairFromNode(node);

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

  }, _defineProperty(_class, "contextTypes", {
    contextAdapter: PropTypes.object
  }), _class;
}