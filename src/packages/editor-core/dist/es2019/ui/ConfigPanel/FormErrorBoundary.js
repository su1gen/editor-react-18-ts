import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { injectIntl } from 'react-intl-next';
import SectionMessage from '@atlaskit/section-message';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../plugins/analytics';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import { messages } from './messages';

class FormErrorBoundaryInner extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      error: undefined
    });

    _defineProperty(this, "getProductName", async () => {
      const {
        contextIdentifierProvider
      } = this.props;

      if (contextIdentifierProvider) {
        const context = await contextIdentifierProvider;

        if (context.product) {
          return context.product;
        }
      }

      return 'atlaskit';
    });

    _defineProperty(this, "fireAnalytics", analyticsErrorPayload => {
      const {
        createAnalyticsEvent,
        extensionKey,
        fields
      } = this.props;
      this.getProductName().then(product => {
        var _window, _window$navigator;

        if (!createAnalyticsEvent) {
          // eslint-disable-next-line no-console
          console.error('ConfigPanel FormErrorBoundary: Missing `createAnalyticsEvent`', {
            channel: editorAnalyticsChannel,
            product,
            error: analyticsErrorPayload
          });
          return;
        }

        const {
          error,
          errorInfo,
          errorStack
        } = analyticsErrorPayload;
        const payload = {
          action: ACTION.ERRORED,
          actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
          eventType: EVENT_TYPE.UI,
          attributes: {
            product,
            browserInfo: ((_window = window) === null || _window === void 0 ? void 0 : (_window$navigator = _window.navigator) === null || _window$navigator === void 0 ? void 0 : _window$navigator.userAgent) || 'unknown',
            extensionKey,
            fields: JSON.stringify(fields),
            error,
            errorInfo,
            errorStack
          }
        };
        createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      }).catch(e => {
        // eslint-disable-next-line no-console
        console.error('Failed to resolve product name from contextIdentifierProvider.', e);
      });
    });
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error
    }, () => {
      // Log the error
      this.fireAnalytics({
        error: error.toString(),
        errorInfo,
        errorStack: error.stack
      });
    });
  }

  render() {
    const {
      intl
    } = this.props;
    const {
      error
    } = this.state;

    if (!error) {
      return this.props.children;
    }

    return /*#__PURE__*/React.createElement(SectionMessage, {
      title: intl.formatMessage(messages.errorBoundaryTitle),
      appearance: "error"
    }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", null, error.message)), /*#__PURE__*/React.createElement("p", null, intl.formatMessage(messages.errorBoundaryNote)));
  }

}

export const FormErrorBoundaryImpl = injectIntl(FormErrorBoundaryInner);
export const FormErrorBoundary = withAnalyticsContext()(withAnalyticsEvents()(FormErrorBoundaryImpl));
FormErrorBoundary.displayName = 'FormErrorBoundary';