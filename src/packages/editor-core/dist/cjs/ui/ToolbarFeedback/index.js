"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("@emotion/react");

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react2 = require("react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _spinner = _interopRequireDefault(require("@atlaskit/spinner"));

var _ui = require("@atlaskit/editor-common/ui");

var _buttonGroup = _interopRequireDefault(require("@atlaskit/button/button-group"));

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _ToolbarButton = _interopRequireDefault(require("../ToolbarButton"));

var _withOuterListeners = _interopRequireDefault(require("../with-outer-listeners"));

var _styles = require("./styles");

var _analytics = require("../../plugins/analytics");

var _eventDispatcher = require("../../event-dispatcher");

var _feedbackDialog = require("../../plugins/feedback-dialog");

var _deprecationWarnings = _interopRequireDefault(require("../../utils/deprecation-warnings"));

var _pickBy = _interopRequireDefault(require("../../utils/pick-by"));

var _consts = require("../../plugins/analytics/consts");

var _contextIdentifier = require("../../plugins/base/pm-plugins/context-identifier");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PopupWithOutsideListeners = (0, _withOuterListeners.default)(_ui.Popup);
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
  (0, _inherits2.default)(ToolbarFeedback, _PureComponent);

  var _super = _createSuper(ToolbarFeedback);

  function ToolbarFeedback(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ToolbarFeedback);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      jiraIssueCollectorScriptLoading: false,
      showOptOutOption: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleRef", function (ref) {
      if (ref) {
        _this.setState({
          target: _reactDom.default.findDOMNode(ref || null)
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getFeedbackInfo", function () {
      var isFeedbackInfoAttr = function isFeedbackInfoAttr(attr) {
        return ['product', 'packageVersion', 'packageName', 'labels'].indexOf(attr) >= 0;
      };

      return (0, _pickBy.default)(function (key, value) {
        return isFeedbackInfoAttr(key) && !isNullOrUndefined(value);
      }, _this.props);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "collectFeedback", function () {
      if (_this.props.product === 'bitbucket') {
        _this.setState({
          showOptOutOption: true
        });
      } else {
        _this.openFeedbackPopup();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "toggleShowOptOutOption", function () {
      _this.setState({
        showOptOutOption: !_this.state.showOptOutOption
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "openJiraIssueCollector", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _window$localStorage$, _getContextIdentifier;

      var editorView, sessionId, contentId, tabId;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this.setState({
                jiraIssueCollectorScriptLoading: true,
                showOptOutOption: false
              });

              editorView = _this.context.editorActions.editorView;
              sessionId = (_window$localStorage$ = window.localStorage.getItem('awc.session.id')) === null || _window$localStorage$ === void 0 ? void 0 : _window$localStorage$.toString();
              contentId = (_getContextIdentifier = (0, _contextIdentifier.getContextIdentifier)(editorView === null || editorView === void 0 ? void 0 : editorView.state)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId;
              tabId = window.sessionStorage['awc.tab.id'];
              _context.next = 7;
              return (0, _feedbackDialog.openFeedbackDialog)(_objectSpread(_objectSpread({}, _this.getFeedbackInfo()), {}, {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "openFeedbackPopup", function () {
      var dispatch = (0, _eventDispatcher.createDispatch)(_this.context.editorActions.eventDispatcher);
      dispatch(_consts.analyticsEventKey, {
        payload: {
          action: _analytics.ACTION.CLICKED,
          actionSubject: _analytics.ACTION_SUBJECT.BUTTON,
          actionSubjectId: _analytics.ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
          eventType: _analytics.EVENT_TYPE.UI
        }
      });

      _this.openJiraIssueCollector();

      return true;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "openLearnMorePage", function () {
      window.open('https://confluence.atlassian.com/x/NU1VO', '_blank');

      _this.toggleShowOptOutOption();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "hasJquery", function () {
      return typeof window.jQuery !== 'undefined';
    });
    (0, _deprecationWarnings.default)(ToolbarFeedback.name, props, deprecations);
    return _this;
  }

  (0, _createClass2.default)(ToolbarFeedback, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement;
      var iconBefore = this.state.jiraIssueCollectorScriptLoading ? (0, _react.jsx)(_spinner.default, null) : undefined; // JIRA issue collector script is using jQuery internally

      return this.hasJquery() ? (0, _react.jsx)("div", {
        css: _styles.wrapper
      }, (0, _react.jsx)(_ToolbarButton.default, {
        ref: this.handleRef,
        iconBefore: iconBefore,
        onClick: this.collectFeedback,
        selected: false,
        spacing: "compact"
      }, (0, _react.jsx)("span", {
        css: _styles.buttonContent
      }, "Feedback")), this.state.showOptOutOption && (0, _react.jsx)(PopupWithOutsideListeners, {
        target: this.state.target,
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        fitHeight: POPUP_HEIGHT,
        fitWidth: POPUP_WIDTH,
        handleClickOutside: this.toggleShowOptOutOption,
        handleEscapeKeydown: this.toggleShowOptOutOption
      }, (0, _react.jsx)("div", {
        css: _styles.confirmationPopup
      }, (0, _react.jsx)("div", {
        css: _styles.confirmationHeader
      }, (0, _react.jsx)("img", {
        css: _styles.confirmationImg,
        src: EDITOR_IMAGE_URL
      })), (0, _react.jsx)("div", {
        css: _styles.confirmationText
      }, (0, _react.jsx)("div", null, "We are rolling out a new editing experience across Atlassian products. Help us improve by providing feedback."), (0, _react.jsx)("div", null, "You can opt-out for now by turning off the \"Atlassian Editor\" feature on the Labs page in Bitbucket settings."), (0, _react.jsx)(_buttonGroup.default, null, (0, _react.jsx)(_customThemeButton.default, {
        appearance: "primary",
        onClick: this.openFeedbackPopup
      }, "Give feedback"), (0, _react.jsx)(_customThemeButton.default, {
        appearance: "default",
        onClick: this.openLearnMorePage
      }, "Learn more")))))) : null;
    }
  }]);
  return ToolbarFeedback;
}(_react2.PureComponent);

exports.default = ToolbarFeedback;
(0, _defineProperty2.default)(ToolbarFeedback, "contextTypes", {
  editorActions: _propTypes.default.object.isRequired
});