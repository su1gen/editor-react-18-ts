import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _class;

import React from 'react';
import { createPortal, unstable_renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';
import { EventDispatcher } from '../../event-dispatcher';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../plugins/analytics/types/enums';
import { useIntl, RawIntlProvider, injectIntl } from 'react-intl-next';
import { useGlobalTheme } from '@atlaskit/theme/components';
import { PortalProviderThemeProviders } from './PortalProviderThemesProvider';
import { IntlProviderIfMissingWrapper } from '@atlaskit/editor-common/ui';
export class PortalProviderAPI extends EventDispatcher {
  constructor(intl, onAnalyticsEvent, analyticsContext, themeMode) {
    super();

    _defineProperty(this, "portals", new Map());

    _defineProperty(this, "setContext", context => {
      this.context = context;
    });

    this.intl = intl;
    this.onAnalyticsEvent = onAnalyticsEvent;
    this.useAnalyticsContext = analyticsContext;
    this.themeMode = themeMode;
  }

  render(children, container, hasAnalyticsContext = false, hasIntlContext = false) {
    this.portals.set(container, {
      children: children,
      hasAnalyticsContext,
      hasIntlContext
    });
    const childrenWithThemeProviders = /*#__PURE__*/React.createElement(PortalProviderThemeProviders, {
      mode: this.themeMode
    }, children());
    let wrappedChildren = this.useAnalyticsContext ? /*#__PURE__*/React.createElement(AnalyticsContextWrapper, null, childrenWithThemeProviders) : childrenWithThemeProviders;

    if (hasIntlContext) {
      wrappedChildren = /*#__PURE__*/React.createElement(RawIntlProvider, {
        value: this.intl
      }, wrappedChildren);
    }

    unstable_renderSubtreeIntoContainer(this.context, wrappedChildren, container);
  } // TODO: until https://product-fabric.atlassian.net/browse/ED-5013
  // we (unfortunately) need to re-render to pass down any updated context.
  // selectively do this for nodeviews that opt-in via `hasAnalyticsContext`


  forceUpdate({
    intl,
    themeMode
  }) {
    this.intl = intl;
    this.themeMode = themeMode;
    this.portals.forEach((portal, container) => {
      if (!portal.hasAnalyticsContext && !this.useAnalyticsContext && !portal.hasIntlContext) {
        return;
      }

      let wrappedChildren = portal.children();
      const childrenWithThemeProviders = /*#__PURE__*/React.createElement(PortalProviderThemeProviders, {
        mode: themeMode
      }, wrappedChildren);

      if (portal.hasAnalyticsContext && this.useAnalyticsContext) {
        wrappedChildren = /*#__PURE__*/React.createElement(AnalyticsContextWrapper, null, childrenWithThemeProviders);
      }

      if (portal.hasIntlContext) {
        wrappedChildren = /*#__PURE__*/React.createElement(RawIntlProvider, {
          value: this.intl
        }, childrenWithThemeProviders);
      }

      unstable_renderSubtreeIntoContainer(this.context, wrappedChildren, container);
    });
  }

  remove(container) {
    this.portals.delete(container); // There is a race condition that can happen caused by Prosemirror vs React,
    // where Prosemirror removes the container from the DOM before React gets
    // around to removing the child from the container
    // This will throw a NotFoundError: The node to be removed is not a child of this node
    // Both Prosemirror and React remove the elements asynchronously, and in edge
    // cases Prosemirror beats React

    try {
      unmountComponentAtNode(container);
    } catch (error) {
      if (this.onAnalyticsEvent) {
        this.onAnalyticsEvent({
          payload: {
            action: ACTION.FAILED_TO_UNMOUNT,
            actionSubject: ACTION_SUBJECT.EDITOR,
            actionSubjectId: ACTION_SUBJECT_ID.REACT_NODE_VIEW,
            attributes: {
              error: error,
              domNodes: {
                container: container ? container.className : undefined,
                child: container.firstElementChild ? container.firstElementChild.className : undefined
              }
            },
            eventType: EVENT_TYPE.OPERATIONAL
          }
        });
      }
    }
  }

}

class BasePortalProvider extends React.Component {
  constructor(props) {
    super(props);
    this.portalProviderAPI = new PortalProviderAPI(props.intl, props.onAnalyticsEvent, props.useAnalyticsContext, props.themeMode);
  }

  render() {
    return this.props.render(this.portalProviderAPI);
  }

  componentDidUpdate() {
    this.portalProviderAPI.forceUpdate({
      intl: this.props.intl,
      themeMode: this.props.themeMode
    });
  }

}

_defineProperty(BasePortalProvider, "displayName", 'PortalProvider');

export const PortalProvider = injectIntl(BasePortalProvider);
export const PortalProviderWithThemeProviders = ({
  onAnalyticsEvent,
  useAnalyticsContext,
  render
}) => /*#__PURE__*/React.createElement(IntlProviderIfMissingWrapper, null, /*#__PURE__*/React.createElement(PortalProviderWithThemeAndIntlProviders, {
  onAnalyticsEvent: onAnalyticsEvent,
  useAnalyticsContext: useAnalyticsContext,
  render: render
}));

const PortalProviderWithThemeAndIntlProviders = ({
  onAnalyticsEvent,
  useAnalyticsContext,
  render
}) => {
  const intl = useIntl();
  const globalTheme = useGlobalTheme();
  return /*#__PURE__*/React.createElement(BasePortalProvider, {
    intl: intl,
    themeMode: globalTheme.mode,
    onAnalyticsEvent: onAnalyticsEvent,
    useAnalyticsContext: useAnalyticsContext,
    render: render
  });
};

export class PortalRenderer extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleUpdate", portals => this.setState({
      portals
    }));

    props.portalProviderAPI.setContext(this);
    props.portalProviderAPI.on('update', this.handleUpdate);
    this.state = {
      portals: new Map()
    };
  }

  render() {
    const {
      portals
    } = this.state;
    return /*#__PURE__*/React.createElement(React.Fragment, null, Array.from(portals.entries()).map(([container, children]) => /*#__PURE__*/createPortal(children, container)));
  }

}
/**
 * Wrapper to re-provide modern analytics context to ReactNodeViews.
 */

const dummyAnalyticsContext = {
  getAtlaskitAnalyticsContext() {},

  getAtlaskitAnalyticsEventHandlers() {}

};
const AnalyticsContextWrapper = (_class = class AnalyticsContextWrapper extends React.Component {
  render() {
    const {
      value
    } = this.context.contextAdapter.analytics || {
      value: dummyAnalyticsContext
    };
    return /*#__PURE__*/React.createElement(AnalyticsReactContext.Provider, {
      value: value
    }, this.props.children);
  }

}, _defineProperty(_class, "contextTypes", {
  contextAdapter: PropTypes.object
}), _class);