import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import Find from './Find';
import Replace from './Replace';
import { ruleStyles, wrapperStyles } from './styles';

class FindReplace extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "findTextfield", null);

    _defineProperty(this, "replaceTextfield", null);

    _defineProperty(this, "setFindTextfieldRef", findTextfieldRef => {
      this.findTextfield = findTextfieldRef.current;
    });

    _defineProperty(this, "setReplaceTextfieldRef", replaceTextfieldRef => {
      this.replaceTextfield = replaceTextfieldRef.current;
    });

    _defineProperty(this, "setFocusToFind", () => {
      if (this.findTextfield) {
        this.findTextfield.focus();
      }
    });

    _defineProperty(this, "setFocusToReplace", () => {
      if (this.replaceTextfield) {
        this.replaceTextfield.focus();
      }
    });
  }

  render() {
    const {
      findText,
      count,
      shouldFocus,
      onFind,
      onFindBlur,
      onFindNext,
      onFindPrev,
      onCancel,
      replaceText,
      onReplace,
      onReplaceAll,
      dispatchAnalyticsEvent,
      allowMatchCase,
      shouldMatchCase,
      onToggleMatchCase
    } = this.props;
    return jsx("div", {
      css: wrapperStyles
    }, jsx(Find, {
      allowMatchCase: allowMatchCase,
      shouldMatchCase: shouldMatchCase,
      onToggleMatchCase: onToggleMatchCase,
      findText: findText,
      count: count,
      shouldFocus: shouldFocus,
      onFind: onFind,
      onFindBlur: onFindBlur,
      onFindPrev: onFindPrev,
      onFindNext: onFindNext,
      onFindTextfieldRefSet: this.setFindTextfieldRef,
      onCancel: onCancel,
      onArrowDown: this.setFocusToReplace
    }), jsx("hr", {
      css: ruleStyles,
      id: "replace-hr-element"
    }), jsx(Replace, {
      canReplace: count.total > 0,
      replaceText: replaceText,
      onReplace: onReplace,
      onReplaceAll: onReplaceAll,
      onReplaceTextfieldRefSet: this.setReplaceTextfieldRef,
      onArrowUp: this.setFocusToFind,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent
    }));
  }

}

export default FindReplace;