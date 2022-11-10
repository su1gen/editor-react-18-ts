"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _close = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/close"));

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/chevron-down"));

var _chevronUp = _interopRequireDefault(require("@atlaskit/icon/glyph/hipchat/chevron-up"));

var _keyboard = _interopRequireDefault(require("@atlaskit/icon/glyph/emoji/keyboard"));

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _styles = require("./styles");

var _types = require("../../analytics/types");

var _FindReplaceTooltipButton = require("./FindReplaceTooltipButton");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var messages = (0, _reactIntlNext.defineMessages)({
  find: {
    id: 'fabric.editor.find',
    defaultMessage: 'Find',
    description: 'The word or phrase to search for on the document'
  },
  matchCase: {
    id: 'fabric.editor.matchCase',
    defaultMessage: 'Match case',
    description: 'Toggle whether should also match case when searching for text'
  },
  findNext: {
    id: 'fabric.editor.findNext',
    defaultMessage: 'Find next',
    description: 'Locate the next occurrence of the word or phrase that was searched for'
  },
  findPrevious: {
    id: 'fabric.editor.findPrevious',
    defaultMessage: 'Find previous',
    description: 'Locate the previous occurrence of the word or phrase that was searched for'
  },
  closeFindReplaceDialog: {
    id: 'fabric.editor.closeFindReplaceDialog',
    defaultMessage: 'Close',
    description: 'Cancel search and close the "Find and Replace" dialog'
  },
  noResultsFound: {
    id: 'fabric.editor.noResultsFound',
    defaultMessage: 'No results',
    description: 'No matches were found for the word or phrase that was searched for'
  },
  resultsCount: {
    id: 'fabric.editor.resultsCount',
    description: 'Text for selected search match position and total results count',
    defaultMessage: '{selectedMatchPosition} of {totalResultsCount}'
  }
});

var Find = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Find, _React$Component);

  var _super = _createSuper(Find);

  function Find(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Find);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "findTextfieldRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isComposing", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "syncFindText", function () {
      var _this$state;

      // If the external prop findText changes and we aren't in a composition we should update to
      // use the external prop value.
      //
      // An example of where this may happen is when a find occurs through the user selecting some text
      // and pressing Mod-f.
      if (!_this.isComposing && _this.props.findText !== ((_this$state = _this.state) === null || _this$state === void 0 ? void 0 : _this$state.localFindText)) {
        _this.updateFindValue(_this.props.findText || '');
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "skipWhileComposing", function (fn) {
      if (_this.isComposing) {
        return;
      }

      fn();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "focusFindTextfield", function () {
      var input = _this.findTextfieldRef.current;

      if (_this.props.shouldFocus && input) {
        input.select();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleFindChange", function (event) {
      _this.updateFindValue(event.target.value);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateFindValue", function (value) {
      _this.setState({
        localFindText: value
      });

      _this.skipWhileComposing(function () {
        _this.props.onFind(value);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleFindKeyDown", function (event) {
      return _this.skipWhileComposing(function () {
        if (event.key === 'Enter') {
          if (event.shiftKey) {
            _this.props.onFindPrev({
              triggerMethod: _types.TRIGGER_METHOD.KEYBOARD
            });
          } else {
            _this.props.onFindNext({
              triggerMethod: _types.TRIGGER_METHOD.KEYBOARD
            });
          }
        } else if (event.key === 'ArrowDown') {
          // we want to move focus between find & replace texfields when user hits up/down arrows
          _this.props.onArrowDown();
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleFindNextClick", function (ref) {
      return _this.skipWhileComposing(function () {
        _this.props.onFindNext({
          triggerMethod: _types.TRIGGER_METHOD.BUTTON
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleFindPrevClick", function (ref) {
      return _this.skipWhileComposing(function () {
        _this.props.onFindPrev({
          triggerMethod: _types.TRIGGER_METHOD.BUTTON
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCompositionStart", function () {
      _this.isComposing = true;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCompositionEnd", function (event) {
      _this.isComposing = false; // type for React.CompositionEvent doesn't set type for target correctly

      _this.updateFindValue(event.target.value);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "clearSearch", function () {
      _this.props.onCancel({
        triggerMethod: _types.TRIGGER_METHOD.BUTTON
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMatchCaseClick", function (buttonRef) {
      if (_this.props.allowMatchCase && _this.props.onToggleMatchCase) {
        _this.props.onToggleMatchCase();

        _this.props.onFind(_this.props.findText);
      }
    });
    var formatMessage = props.intl.formatMessage;
    _this.find = formatMessage(messages.find);
    _this.closeFindReplaceDialog = formatMessage(messages.closeFindReplaceDialog);
    _this.noResultsFound = formatMessage(messages.noResultsFound);
    _this.findNext = formatMessage(messages.findNext);
    _this.findPrevious = formatMessage(messages.findPrevious);
    _this.matchCase = formatMessage(messages.matchCase);
    _this.matchCaseIcon = (0, _react2.jsx)(_keyboard.default, {
      label: _this.matchCase
    });
    _this.findNextIcon = (0, _react2.jsx)(_chevronDown.default, {
      label: _this.findNext
    });
    _this.findPrevIcon = (0, _react2.jsx)(_chevronUp.default, {
      label: _this.findPrevious
    });
    _this.closeIcon = (0, _react2.jsx)(_close.default, {
      label: _this.closeFindReplaceDialog
    }); // We locally manage the value of the input inside this component in order to support compositions.
    // This requires some additional work inside componentDidUpdate to ensure we support changes that
    // occur to this value which do not originate from this component.

    _this.state = {
      localFindText: ''
    };
    return _this;
  }

  (0, _createClass2.default)(Find, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onFindTextfieldRefSet(this.findTextfieldRef);
      this.focusFindTextfield();
      this.syncFindText();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.focusFindTextfield();
      this.syncFindText();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          findText = _this$props.findText,
          count = _this$props.count,
          allowMatchCase = _this$props.allowMatchCase,
          shouldMatchCase = _this$props.shouldMatchCase,
          formatMessage = _this$props.intl.formatMessage;
      var resultsCount = formatMessage(messages.resultsCount, {
        selectedMatchPosition: count.index + 1,
        totalResultsCount: count.total
      });
      return (0, _react2.jsx)("div", {
        css: _styles.sectionWrapperStyles
      }, (0, _react2.jsx)(_textfield.default, {
        name: "find",
        appearance: "none",
        placeholder: this.find,
        value: this.state.localFindText,
        ref: this.findTextfieldRef,
        autoComplete: "off",
        onChange: this.handleFindChange,
        onKeyDown: this.handleFindKeyDown,
        onBlur: this.props.onFindBlur,
        onCompositionStart: this.handleCompositionStart,
        onCompositionEnd: this.handleCompositionEnd
      }), findText && (0, _react2.jsx)("span", {
        "data-testid": "textfield-count",
        css: _styles.countStyles
      }, count.total === 0 ? this.noResultsFound : resultsCount), allowMatchCase && (0, _react2.jsx)(_FindReplaceTooltipButton.FindReplaceTooltipButton, {
        title: this.matchCase,
        icon: this.matchCaseIcon,
        onClick: this.handleMatchCaseClick,
        isPressed: shouldMatchCase
      }), (0, _react2.jsx)(_FindReplaceTooltipButton.FindReplaceTooltipButton, {
        title: this.findNext,
        icon: this.findNextIcon,
        keymapDescription: 'Enter',
        onClick: this.handleFindNextClick,
        disabled: count.total <= 1
      }), (0, _react2.jsx)(_FindReplaceTooltipButton.FindReplaceTooltipButton, {
        title: this.findPrevious,
        icon: this.findPrevIcon,
        keymapDescription: 'Shift Enter',
        onClick: this.handleFindPrevClick,
        disabled: count.total <= 1
      }), (0, _react2.jsx)(_FindReplaceTooltipButton.FindReplaceTooltipButton, {
        title: this.closeFindReplaceDialog,
        icon: this.closeIcon,
        keymapDescription: 'Escape',
        onClick: this.clearSearch
      }));
    }
  }]);
  return Find;
}(_react.default.Component);

var _default = (0, _reactIntlNext.injectIntl)(Find);

exports.default = _default;