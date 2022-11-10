import _defineProperty from "@babel/runtime/helpers/defineProperty";

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
const messages = defineMessages({
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

class Find extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "findTextfieldRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "isComposing", false);

    _defineProperty(this, "syncFindText", () => {
      var _this$state;

      // If the external prop findText changes and we aren't in a composition we should update to
      // use the external prop value.
      //
      // An example of where this may happen is when a find occurs through the user selecting some text
      // and pressing Mod-f.
      if (!this.isComposing && this.props.findText !== ((_this$state = this.state) === null || _this$state === void 0 ? void 0 : _this$state.localFindText)) {
        this.updateFindValue(this.props.findText || '');
      }
    });

    _defineProperty(this, "skipWhileComposing", fn => {
      if (this.isComposing) {
        return;
      }

      fn();
    });

    _defineProperty(this, "focusFindTextfield", () => {
      const input = this.findTextfieldRef.current;

      if (this.props.shouldFocus && input) {
        input.select();
      }
    });

    _defineProperty(this, "handleFindChange", event => {
      this.updateFindValue(event.target.value);
    });

    _defineProperty(this, "updateFindValue", value => {
      this.setState({
        localFindText: value
      });
      this.skipWhileComposing(() => {
        this.props.onFind(value);
      });
    });

    _defineProperty(this, "handleFindKeyDown", event => this.skipWhileComposing(() => {
      if (event.key === 'Enter') {
        if (event.shiftKey) {
          this.props.onFindPrev({
            triggerMethod: TRIGGER_METHOD.KEYBOARD
          });
        } else {
          this.props.onFindNext({
            triggerMethod: TRIGGER_METHOD.KEYBOARD
          });
        }
      } else if (event.key === 'ArrowDown') {
        // we want to move focus between find & replace texfields when user hits up/down arrows
        this.props.onArrowDown();
      }
    }));

    _defineProperty(this, "handleFindNextClick", ref => this.skipWhileComposing(() => {
      this.props.onFindNext({
        triggerMethod: TRIGGER_METHOD.BUTTON
      });
    }));

    _defineProperty(this, "handleFindPrevClick", ref => this.skipWhileComposing(() => {
      this.props.onFindPrev({
        triggerMethod: TRIGGER_METHOD.BUTTON
      });
    }));

    _defineProperty(this, "handleCompositionStart", () => {
      this.isComposing = true;
    });

    _defineProperty(this, "handleCompositionEnd", event => {
      this.isComposing = false; // type for React.CompositionEvent doesn't set type for target correctly

      this.updateFindValue(event.target.value);
    });

    _defineProperty(this, "clearSearch", () => {
      this.props.onCancel({
        triggerMethod: TRIGGER_METHOD.BUTTON
      });
    });

    _defineProperty(this, "handleMatchCaseClick", buttonRef => {
      if (this.props.allowMatchCase && this.props.onToggleMatchCase) {
        this.props.onToggleMatchCase();
        this.props.onFind(this.props.findText);
      }
    });

    const {
      intl: {
        formatMessage
      }
    } = props;
    this.find = formatMessage(messages.find);
    this.closeFindReplaceDialog = formatMessage(messages.closeFindReplaceDialog);
    this.noResultsFound = formatMessage(messages.noResultsFound);
    this.findNext = formatMessage(messages.findNext);
    this.findPrevious = formatMessage(messages.findPrevious);
    this.matchCase = formatMessage(messages.matchCase);
    this.matchCaseIcon = jsx(MatchCaseIcon, {
      label: this.matchCase
    });
    this.findNextIcon = jsx(ChevronDownIcon, {
      label: this.findNext
    });
    this.findPrevIcon = jsx(ChevronUpIcon, {
      label: this.findPrevious
    });
    this.closeIcon = jsx(EditorCloseIcon, {
      label: this.closeFindReplaceDialog
    }); // We locally manage the value of the input inside this component in order to support compositions.
    // This requires some additional work inside componentDidUpdate to ensure we support changes that
    // occur to this value which do not originate from this component.

    this.state = {
      localFindText: ''
    };
  }

  componentDidMount() {
    this.props.onFindTextfieldRefSet(this.findTextfieldRef);
    this.focusFindTextfield();
    this.syncFindText();
  }

  componentDidUpdate() {
    this.focusFindTextfield();
    this.syncFindText();
  }

  render() {
    const {
      findText,
      count,
      allowMatchCase,
      shouldMatchCase,
      intl: {
        formatMessage
      }
    } = this.props;
    const resultsCount = formatMessage(messages.resultsCount, {
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

}

export default injectIntl(Find);