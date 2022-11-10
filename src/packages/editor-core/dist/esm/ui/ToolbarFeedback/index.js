import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
var PopupWithOutsideListeners = withOuterListeners(Popup);
var POPUP_HEIGHT = 388;
var POPUP_WIDTH = 280;
var EDITOR_IMAGE_URL = 'https://confluence.atlassian.com/download/attachments/945114421/editorillustration@2x.png?api=v2';
var deprecations = [{
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

var isNullOrUndefined = function isNullOrUndefined(attr) {
  return attr === null || attr === undefined;
};

var ToolbarFeedback = /*#__PURE__*/function (_PureComponent) {
  _inherits(ToolbarFeedback, _PureComponent);

  var _super = _createSuper(ToolbarFeedback);

  function ToolbarFeedback(props) {
    var _this;

    _classCallCheck(this, ToolbarFeedback);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      jiraIssueCollectorScriptLoading: false,
      showOptOutOption: false
    });

    _defineProperty(_assertThisInitialized(_this), "handleRef", function (ref) {
      if (ref) {
        _this.setState({
          target: ReactDOM.findDOMNode(ref || null)
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "getFeedbackInfo", function () {
      var isFeedbackInfoAttr = function isFeedbackInfoAttr(attr) {
        return ['product', 'packageVersion', 'packageName', 'labels'].indexOf(attr) >= 0;
      };

      return pickBy(function (key, value) {
        return isFeedbackInfoAttr(key) && !isNullOrUndefined(value);
      }, _this.props);
    });

    _defineProperty(_assertThisInitialized(_this), "collectFeedback", function () {
      if (_this.props.product === 'bitbucket') {
        _this.setState({
          showOptOutOption: true
        });
      } else {
        _this.openFeedbackPopup();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleShowOptOutOption", function () {
      _this.setState({
        showOptOutOption: !_this.state.showOptOutOption
      });
    });

    _defineProperty(_assertThisInitialized(_this), "openJiraIssueCollector", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _window$localStorage$, _getContextIdentifier;

      var editorView, sessionId, contentId, tabId;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                jiraIssueCollectorScriptLoading: true,
                showOptOutOption: false
              });

              editorView = _this.context.editorActions.editorView;
              sessionId = (_window$localStorage$ = window.localStorage.getItem('awc.session.id')) === null || _window$localStorage$ === void 0 ? void 0 : _window$localStorage$.toString();
              contentId = (_getContextIdentifier = getContextIdentifier(editorView === null || editorView === void 0 ? void 0 : editorView.state)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId;
              tabId = window.sessionStorage['awc.tab.id'];
              _context.next = 7;
              return openFeedbackDialog(_objectSpread(_objectSpread({}, _this.getFeedbackInfo()), {}, {
                sessionId: sessionId,
                contentId: contentId,
                tabId: tabId
              }));

            case 7:
              _this.setState({
                jiraIssueCollectorScriptLoading: false
              });

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(_assertThisInitialized(_this), "openFeedbackPopup", function () {
      var dispatch = createDispatch(_this.context.editorActions.eventDispatcher);
      dispatch(analyticsEventKey, {
        payload: {
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
          eventType: EVENT_TYPE.UI
        }
      });

      _this.openJiraIssueCollector();

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "openLearnMorePage", function () {
      window.open('https://confluence.atlassian.com/x/NU1VO', '_blank');

      _this.toggleShowOptOutOption();
    });

    _defineProperty(_assertThisInitialized(_this), "hasJquery", function () {
      return typeof window.jQuery !== 'undefined';
    });

    deprecationWarnings(ToolbarFeedback.name, props, deprecations);
    return _this;
  }

  _createClass(ToolbarFeedback, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement;
      var iconBefore = this.state.jiraIssueCollectorScriptLoading ? jsx(Spinner, null) : undefined; // JIRA issue collector script is using jQuery internally

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
  }]);

  return ToolbarFeedback;
}(PureComponent);

_defineProperty(ToolbarFeedback, "contextTypes", {
  editorActions: PropTypes.object.isRequired
});

export { ToolbarFeedback as default };