import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import { Popup } from '@atlaskit/editor-common/ui';
import { timestampToUTCDate, timestampToIsoFormat } from '@atlaskit/editor-common/utils';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import Calendar from '@atlaskit/calendar';
import { borderRadius } from '@atlaskit/theme/constants';
import { N60A, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import withOuterListeners from '../../../../ui/with-outer-listeners';
const PopupWithListeners = withOuterListeners(Popup);
import { INPUT_METHOD } from '../../../analytics/types/enums';
import { injectIntl } from 'react-intl-next';
import DatePickerInput from './date-picker-input';
const popupContentWrapper = css`
  padding: 2px;
  border-radius: ${borderRadius()}px;
  box-shadow: ${token('elevation.shadow.overlay', `0 4px 8px -2px ${N60A}, 0 0 1px ${N60A}`)};
  background-color: ${token('elevation.surface.overlay', N0)};
`;

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleNewDate", date => {
      this.props.onTextChanged(date);
      this.setState({
        latestValidDate: date
      });
    });

    _defineProperty(this, "handleKeyboardSubmitDate", date => {
      this.props.onSelect(date, INPUT_METHOD.KEYBOARD);
    });

    _defineProperty(this, "handleEmptySubmitDate", () => {
      this.props.onDelete();
    });

    _defineProperty(this, "handleOnChange", ({
      day,
      month,
      year
    }) => {
      const date = {
        day,
        month,
        year
      };
      this.setState({
        latestValidDate: date
      });
    });

    _defineProperty(this, "closeDatePickerWithAnalytics", () => {
      this.props.closeDatePickerWithAnalytics({
        date: this.state.latestValidDate
      });
    });

    _defineProperty(this, "handleRef", ref => {
      const elm = ref && ReactDOM.findDOMNode(ref);

      if (elm) {
        elm.focus();
      }
    });

    const timestamp = props.element.getAttribute('timestamp');

    if (timestamp) {
      // Warning: The 'Date' return type of timestampToUTCDate() is not a JS date, it's more similar
      // to the DateType type
      const {
        day,
        month,
        year
      } = timestampToUTCDate(timestamp);
      const date = {
        day,
        month,
        year
      };
      this.state = {
        selected: [timestampToIsoFormat(timestamp)],
        date,
        latestValidDate: date
      };
    }
  }

  render() {
    const {
      element,
      onSelect,
      mountTo,
      boundariesElement,
      scrollableElement,
      showTextField,
      intl,
      dispatchAnalyticsEvent,
      isNew,
      autoFocus
    } = this.props;
    const timestamp = element.getAttribute('timestamp');

    if (this.state === null) {
      // Without this, you can blow up the page by slowing down cpu, opening date, typing after date
      // then clicking on date lozenge and typing quickly before it opens
      return null;
    }

    const {
      date,
      selected,
      latestValidDate
    } = this.state;
    const {
      day,
      month,
      year
    } = latestValidDate;

    if (!timestamp) {
      return null;
    }

    return jsx(PopupWithListeners, {
      target: element,
      offset: [0, 8],
      fitHeight: 327,
      fitWidth: 340,
      handleClickOutside: this.closeDatePickerWithAnalytics,
      handleEscapeKeydown: this.closeDatePickerWithAnalytics,
      zIndex: akEditorFloatingDialogZIndex,
      mountTo: mountTo,
      boundariesElement: boundariesElement,
      scrollableElement: scrollableElement
    }, jsx("div", {
      css: popupContentWrapper
    }, showTextField === true && jsx(DatePickerInput, {
      date: date,
      onNewDate: this.handleNewDate,
      onSubmitDate: this.handleKeyboardSubmitDate,
      onEmptySubmit: this.handleEmptySubmitDate,
      locale: intl.locale,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent,
      autoFocus: autoFocus,
      autoSelectAll: isNew
    }), jsx(Calendar, {
      onChange: this.handleOnChange,
      onSelect: date => onSelect(date, INPUT_METHOD.PICKER),
      day: day,
      month: month,
      year: year,
      selected: selected,
      ref: this.handleRef
    })));
  }

}

export default injectIntl(DatePicker);