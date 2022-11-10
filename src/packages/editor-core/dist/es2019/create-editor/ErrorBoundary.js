import _defineProperty from "@babel/runtime/helpers/defineProperty";
import memoizeOne from 'memoize-one';
import React from 'react';
import uuid from 'uuid';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { IntlErrorBoundary } from '@atlaskit/editor-common/ui';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../plugins/analytics';
import { editorAnalyticsChannel } from '../plugins/analytics/consts';
import { getFeatureFlags } from '../plugins/feature-flags-context';
import { getDocStructure } from '../utils/document-logger';
import { WithEditorView } from './WithEditorView';
import { isOutdatedBrowser } from '@atlaskit/editor-common/utils';
export class ErrorBoundaryWithEditorView extends React.Component {
  // Memoizing this as react alternative suggestion of https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
  get featureFlags() {
    return this.getFeatureFlags(this.props.editorView);
  }

  constructor(props) {
    super(props);

    _defineProperty(this, "browserExtensions", undefined);

    _defineProperty(this, "state", {
      error: undefined
    });

    _defineProperty(this, "getFeatureFlags", memoizeOne(editorView => {
      if (!editorView) {
        return {};
      }

      return getFeatureFlags(editorView.state);
    }));

    _defineProperty(this, "sendErrorData", async analyticsErrorPayload => {
      var _window, _window$navigator;

      const product = await this.getProductName();
      const {
        error,
        errorInfo,
        errorStack
      } = analyticsErrorPayload;
      const sharedId = uuid();
      const browserInfo = ((_window = window) === null || _window === void 0 ? void 0 : (_window$navigator = _window.navigator) === null || _window$navigator === void 0 ? void 0 : _window$navigator.userAgent) || 'unknown';
      const attributes = {
        product,
        browserInfo,
        error: error,
        errorInfo,
        errorId: sharedId,
        browserExtensions: this.browserExtensions,
        docStructure: this.featureFlags.errorBoundaryDocStructure && this.props.editorView ? getDocStructure(this.props.editorView.state.doc, {
          compact: true
        }) : undefined,
        outdatedBrowser: isOutdatedBrowser(browserInfo)
      };
      this.fireAnalyticsEvent({
        action: ACTION.EDITOR_CRASHED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes
      });
      this.fireAnalyticsEvent({
        action: ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          errorStack,
          errorId: sharedId
        }
      });

      if (this.featureFlags.ufo && this.props.editorView) {
        var _this$experienceStore;

        (_this$experienceStore = this.experienceStore) === null || _this$experienceStore === void 0 ? void 0 : _this$experienceStore.failAll({ ...this.getExperienceMetadata(attributes),
          errorStack
        });
      }
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

    _defineProperty(this, "fireAnalyticsEvent", event => {
      var _this$props$createAna, _this$props;

      (_this$props$createAna = (_this$props = this.props).createAnalyticsEvent) === null || _this$props$createAna === void 0 ? void 0 : _this$props$createAna.call(_this$props, event).fire(editorAnalyticsChannel);
    });

    _defineProperty(this, "getExperienceMetadata", attributes => {
      var _attributes$browserEx;

      return {
        browserInfo: attributes.browserInfo,
        error: attributes.error.toString(),
        errorInfo: {
          componentStack: attributes.errorInfo.componentStack
        },
        errorId: attributes.errorId,
        browserExtensions: (_attributes$browserEx = attributes.browserExtensions) === null || _attributes$browserEx === void 0 ? void 0 : _attributes$browserEx.toString(),
        docStructure: attributes.docStructure
      };
    });

    if (props.editorView) {
      this.experienceStore = ExperienceStore.getInstance(props.editorView);
    }
  }

  componentDidCatch(error, errorInfo) {
    this.sendErrorData({
      error: error.toString(),
      errorInfo,
      errorStack: error.stack
    }); // // Update state to allow a re-render to attempt graceful recovery (in the event that
    // // the error was caused by a race condition or is intermittent)

    this.setState({
      error
    }, () => {
      if (this.props.rethrow) {
        // Now that a re-render has occured, we re-throw to allow product error boundaries
        // to catch and handle the error too.
        //
        // Note that when rethrowing inside a error boundary, the stack trace
        // from a higher error boundary's componentDidCatch.info param will reset
        // to this component, instead of the original component which threw it.
        throw error;
      }
    });
  }

  async componentDidMount() {
    this.browserExtensions = await sniffUserBrowserExtensions({
      extensions: ['grammarly'],
      async: true,
      asyncTimeoutMs: 20000
    });
  }

  render() {
    return /*#__PURE__*/React.createElement(IntlErrorBoundary, null, this.props.children);
  }

}

_defineProperty(ErrorBoundaryWithEditorView, "defaultProps", {
  rethrow: true
});

export default WithEditorView(ErrorBoundaryWithEditorView);