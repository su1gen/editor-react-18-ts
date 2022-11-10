import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import PropTypes from 'prop-types';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import { findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import rafSchedule from 'raf-schd';
import { Card } from './genericCard';
import { registerCard } from '../pm-plugins/actions';
export class InlineCardComponent extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onClick", () => {});

    _defineProperty(this, "onResolve", data => {
      const {
        getPos,
        view
      } = this.props;

      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      const {
        title,
        url
      } = data; // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview

      rafSchedule(() => view.dispatch(registerCard({
        title,
        url,
        pos: getPos()
      })(view.state.tr)))();
    });

    _defineProperty(this, "onError", data => {
      const {
        url
      } = data;
      this.onResolve({
        url
      });
    });
  }

  UNSAFE_componentWillMount() {
    const {
      view
    } = this.props;
    const scrollContainer = findOverflowScrollParent(view.dom);
    this.scrollContainer = scrollContainer || undefined;
  }

  render() {
    const {
      node,
      cardContext,
      useAlternativePreloader
    } = this.props;
    const {
      url,
      data
    } = node.attrs;
    const card = /*#__PURE__*/React.createElement("span", {
      className: "card"
    }, /*#__PURE__*/React.createElement(SmartCard, {
      key: url,
      url: url,
      data: data,
      appearance: "inline",
      onClick: this.onClick,
      container: this.scrollContainer,
      onResolve: this.onResolve,
      onError: this.onError,
      inlinePreloaderStyle: useAlternativePreloader ? 'on-right-without-skeleton' : undefined
    })); // [WS-2307]: we only render card wrapped into a Provider when the value is ready,
    // otherwise if we got data, we can render the card directly since it doesn't need the Provider

    return cardContext && cardContext.value ? /*#__PURE__*/React.createElement(cardContext.Provider, {
      value: cardContext.value
    }, card) : data ? card : null;
  }

}

_defineProperty(InlineCardComponent, "contextTypes", {
  contextAdapter: PropTypes.object
});

const WrappedInlineCard = Card(InlineCardComponent, UnsupportedInline);
export function InlineCardNodeView(props) {
  const {
    useAlternativePreloader,
    node,
    view,
    getPos
  } = props;
  return /*#__PURE__*/React.createElement(WrappedInlineCard, {
    node: node,
    view: view,
    getPos: getPos,
    useAlternativePreloader: useAlternativePreloader
  });
}