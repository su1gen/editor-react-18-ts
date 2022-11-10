import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { ACTION, EVENT_TYPE } from '../../plugins/analytics';
export class ErrorBoundary extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      errorCaptured: false
    });
  }

  hasFallback() {
    return typeof this.props.fallbackComponent !== 'undefined';
  }

  shouldRecover() {
    return this.hasFallback() && this.state.errorCaptured;
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.dispatchAnalyticsEvent) {
      this.props.dispatchAnalyticsEvent({
        action: ACTION.EDITOR_CRASHED,
        actionSubject: this.props.component,
        actionSubjectId: this.props.componentId,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          error,
          errorInfo,
          // @ts-expect-error
          errorRethrown: !this.hasFallback()
        }
      });
    }

    if (this.hasFallback()) {
      this.setState({
        errorCaptured: true
      });
    }
  }

  render() {
    if (this.shouldRecover()) {
      return this.props.fallbackComponent;
    }

    return this.props.children;
  }

}