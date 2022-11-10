import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { defineMessages, injectIntl } from 'react-intl-next';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import ChevronDownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/hipchat/chevron-up';
import MatchCaseIcon from '@atlaskit/icon/glyph/emoji/keyboard';
import Textfield from '@atlaskit/textfield';
import { countStyles, sectionWrapperStyles } from './styles';
import { TRIGGER_METHOD } from '../../analytics/types';
import { FindReplaceTooltipButton } from './FindReplaceTooltipButton';
var messages = defineMessages({
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
  _inherits(Find, _React$Component);

  var _super = _createSuper(Find);

  function Find(props) {
    var _this;

    _classCallCheck(this, Find);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "findTextfieldRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "isComposing", false);

    _defineProperty(_assertThisInitialized(_this), "syncFindText", function () {
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

    _defineProperty(_assertThisInitialized(_this), "skipWhileComposing", function (fn) {
      if (_this.isComposing) {
        return;
      }

      fn();
    });

    _defineProperty(_assertThisInitialized(_this), "focusFindTextfield", function () {
      var input = _this.findTextfieldRef.current;

      if (_this.props.shouldFocus && input) {
        input.select();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleFindChange", function (event) {
      _this.updateFindValue(event.target.value);
    });

    _defineProperty(_assertThisInitialized(_this), "updateFindValue", function (value) {
      _this.setState({
        localFindText: value
      });

      _this.skipWhileComposing(function () {
        _this.props.onFind(value);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleFindKeyDown", function (event) {
      return _this.skipWhileComposing(function () {
        if (event.key === 'Enter') {
          if (event.shiftKey) {
            _this.props.onFindPrev({
              triggerMethod: TRIGGER_METHOD.KEYBOARD
            });
          } else {
            _this.props.onFindNext({
              triggerMethod: TRIGGER_METHOD.KEYBOARD
            });
          }
        } else if (event.key === 'ArrowDown') {
          // we want to move focus between find & replace texfields when user hits up/down arrows
          _this.props.onArrowDown();
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleFindNextClick", function (ref) {
      return _this.skipWhileComposing(function () {
        _this.props.onFindNext({
          triggerMethod: TRIGGER_METHOD.BUTTON
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleFindPrevClick", function (ref) {
      return _this.skipWhileComposing(function () {
        _this.props.onFindPrev({
          triggerMethod: TRIGGER_METHOD.BUTTON
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCompositionStart", function () {
      _this.isComposing = true;
    });

    _defineProperty(_assertThisInitialized(_this), "handleCompositionEnd", function (event) {
      _this.isComposing = false; // type for React.CompositionEvent doesn't set type for target correctly

      _this.updateFindValue(event.target.value);
    });

    _defineProperty(_assertThisInitialized(_this), "clearSearch", function () {
      _this.props.onCancel({
        triggerMethod: TRIGGER_METHOD.BUTTON
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleMatchCaseClick", function (buttonRef) {
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
    _this.matchCaseIcon = jsx(MatchCaseIcon, {
      label: _this.matchCase
    });
    _this.findNextIcon = jsx(ChevronDownIcon, {
      label: _this.findNext
    });
    _this.findPrevIcon = jsx(ChevronUpIcon, {
      label: _this.findPrevious
    });
    _this.closeIcon = jsx(EditorCloseIcon, {
      label: _this.closeFindReplaceDialog
    }); // We locally manage the value of the input inside this component in order to support compositions.
    // This requires some additional work inside componentDidUpdate to ensure we support changes that
    // occur to this value which do not originate from this component.

    _this.state = {
      localFindText: ''
    };
    return _this;
  }

  _createClass(Find, [{
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
      return jsx("div", {
        css: sectionWrapperStyles
      }, jsx(Textfield, {
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
      }), findText && jsx("span", {
        "data-testid": "textfield-count",
        css: countStyles
      }, count.total === 0 ? this.noResultsFound : resultsCount), allowMatchCase && jsx(FindReplaceTooltipButton, {
        title: this.matchCase,
        icon: this.matchCaseIcon,
        onClick: this.handleMatchCaseClick,
        isPressed: shouldMatchCase
      }), jsx(FindReplaceTooltipButton, {
        title: this.findNext,
        icon: this.findNextIcon,
        keymapDescription: 'Enter',
        onClick: this.handleFindNextClick,
        disabled: count.total <= 1
      }), jsx(FindReplaceTooltipButton, {
        title: this.findPrevious,
        icon: this.findPrevIcon,
        keymapDescription: 'Shift Enter',
        onClick: this.handleFindPrevClick,
        disabled: count.total <= 1
      }), jsx(FindReplaceTooltipButton, {
        title: this.closeFindReplaceDialog,
        icon: this.closeIcon,
        keymapDescription: 'Escape',
        onClick: this.clearSearch
      }));
    }
  }]);

  return Find;
}(React.Component);

export default injectIntl(Find);