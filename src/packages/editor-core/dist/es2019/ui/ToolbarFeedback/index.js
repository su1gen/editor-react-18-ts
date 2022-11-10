import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import { jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Spinner from '@atlaskit/spinner';
import { Popup } from '@atlaskit/editor-common/ui';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import ToolbarButton from '../ToolbarButton';
import withOuterListeners from '../with-outer-listeners';
import { wrapper, buttonContent, confirmationPopup, confirmationText, confirmationHeader, confirmationImg } from './styles';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID } from '../../plugins/analytics';
import { createDispatch } from '../../event-dispatcher';
import { openFeedbackDialog } from '../../plugins/feedback-dialog';
import deprecationWarnings from '../../utils/deprecation-warnings';
import pickBy from '../../utils/pick-by';
import { analyticsEventKey } from '../../plugins/analytics/consts';
import { getContextIdentifier } from '../../plugins/base/pm-plugins/context-identifier';
const PopupWithOutsideListeners = withOuterListeners(Popup);
const POPUP_HEIGHT = 388;
const POPUP_WIDTH = 280;
const EDITOR_IMAGE_URL = 'https://confluence.atlassian.com/download/attachments/945114421/editorillustration@2x.png?api=v2';
const deprecations = [{
  property: 'packageVersion',
  description: 'To pass package version use feedbackInfo property – <Editor feedbackInfo={{ packageVersion }} />',
  type: 'removed'
}, {
  property: 'packageName',
  description: 'To pass package name use feedbackInfo property – <Editor feedbackInfo={{ packageName }} />',
  type: 'removed'
}, {
  property: 'labels',
  description: 'To pass feedback labels use feedbackInfo property – <Editor feedbackInfo={{ labels }} />',
  type: 'removed'
}];

const isNullOrUndefined = attr => attr === null || attr === undefined;

export default class ToolbarFeedback extends PureComponent {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      jiraIssueCollectorScriptLoading: false,
      showOptOutOption: false
    });

    _defineProperty(this, "handleRef", ref => {
      if (ref) {
        this.setState({
          target: ReactDOM.findDOMNode(ref || null)
        });
      }
    });

    _defineProperty(this, "getFeedbackInfo", () => {
      const isFeedbackInfoAttr = attr => ['product', 'packageVersion', 'packageName', 'labels'].indexOf(attr) >= 0;

      return pickBy((key, value) => isFeedbackInfoAttr(key) && !isNullOrUndefined(value), this.props);
    });

    _defineProperty(this, "collectFeedback", () => {
      if (this.props.product === 'bitbucket') {
        this.setState({
          showOptOutOption: true
        });
      } else {
        this.openFeedbackPopup();
      }
    });

    _defineProperty(this, "toggleShowOptOutOption", () => {
      this.setState({
        showOptOutOption: !this.state.showOptOutOption
      });
    });

    _defineProperty(this, "openJiraIssueCollector", async () => {
      var _window$localStorage$, _getContextIdentifier;

      this.setState({
        jiraIssueCollectorScriptLoading: true,
        showOptOutOption: false
      });
      const {
        editorView
      } = this.context.editorActions;
      const sessionId = (_window$localStorage$ = window.localStorage.getItem('awc.session.id')) === null || _window$localStorage$ === void 0 ? void 0 : _window$localStorage$.toString();
      const contentId = (_getContextIdentifier = getContextIdentifier(editorView === null || editorView === void 0 ? void 0 : editorView.state)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId;
      const tabId = window.sessionStorage['awc.tab.id'];
      await openFeedbackDialog({ ...this.getFeedbackInfo(),
        sessionId,
        contentId,
        tabId
      });
      this.setState({
        jiraIssueCollectorScriptLoading: false
      });
    });

    _defineProperty(this, "openFeedbackPopup", () => {
      const dispatch = createDispatch(this.context.editorActions.eventDispatcher);
      dispatch(analyticsEventKey, {
        payload: {
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
          eventType: EVENT_TYPE.UI
        }
      });
      this.openJiraIssueCollector();
      return true;
    });

    _defineProperty(this, "openLearnMorePage", () => {
      window.open('https://confluence.atlassian.com/x/NU1VO', '_blank');
      this.toggleShowOptOutOption();
    });

    _defineProperty(this, "hasJquery", () => {
      return typeof window.jQuery !== 'undefined';
    });

    deprecationWarnings(ToolbarFeedback.name, props, deprecations);
  }

  render() {
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement
    } = this.props;
    const iconBefore = this.state.jiraIssueCollectorScriptLoading ? jsx(Spinner, null) : undefined; // JIRA issue collector script is using jQuery internally

    return this.hasJquery() ? jsx("div", {
      css: wrapper
    }, jsx(ToolbarButton, {
      ref: this.handleRef,
      iconBefore: iconBefore,
      onClick: this.collectFeedback,
      selected: false,
      spacing: "compact"
    }, jsx("span", {
      css: buttonContent
    }, "Feedback")), this.state.showOptOutOption && jsx(PopupWithOutsideListeners, {
      target: this.state.target,
      mountTo: popupsMountPoint,
      boundariesElement: popupsBoundariesElement,
      scrollableElement: popupsScrollableElement,
      fitHeight: POPUP_HEIGHT,
      fitWidth: POPUP_WIDTH,
      handleClickOutside: this.toggleShowOptOutOption,
      handleEscapeKeydown: this.toggleShowOptOutOption
    }, jsx("div", {
      css: confirmationPopup
    }, jsx("div", {
      css: confirmationHeader
    }, jsx("img", {
      css: confirmationImg,
      src: EDITOR_IMAGE_URL
    })), jsx("div", {
      css: confirmationText
    }, jsx("div", null, "We are rolling out a new editing experience across Atlassian products. Help us improve by providing feedback."), jsx("div", null, "You can opt-out for now by turning off the \"Atlassian Editor\" feature on the Labs page in Bitbucket settings."), jsx(ButtonGroup, null, jsx(Button, {
      appearance: "primary",
      onClick: this.openFeedbackPopup
    }, "Give feedback"), jsx(Button, {
      appearance: "default",
      onClick: this.openLearnMorePage
    }, "Learn more")))))) : null;
  }

}

_defineProperty(ToolbarFeedback, "contextTypes", {
  editorActions: PropTypes.object.isRequired
});