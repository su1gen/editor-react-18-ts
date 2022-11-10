import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { Popup } from '@atlaskit/editor-common/ui';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { StatusPicker as AkStatusPicker } from '@atlaskit/status/picker';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N0 } from '@atlaskit/theme/colors';
import withOuterListeners from '../../../ui/with-outer-listeners';
import { DEFAULT_STATUS } from '../actions';
import { analyticsState, createStatusAnalyticsAndFire } from '../analytics';
import { token } from '@atlaskit/tokens';
const PopupWithListeners = withOuterListeners(Popup);
export let InputMethod;

(function (InputMethod) {
  InputMethod["blur"] = "blur";
  InputMethod["escKey"] = "escKey";
  InputMethod["enterKey"] = "enterKey";
})(InputMethod || (InputMethod = {}));

const pickerContainer = css`
  background: ${token('elevation.surface.overlay', N0)};
  padding: ${gridSize()}px 0;
  border-radius: ${borderRadius()}px;
  box-shadow: ${token('elevation.shadow.overlay', '0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)')};
  input {
    text-transform: uppercase;
  }
`;
export class StatusPickerWithoutAnalytcs extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleClickOutside", event => {
      event.preventDefault();
      this.inputMethod = InputMethod.blur;
      const selectedText = window.getSelection();

      if (!selectedText) {
        this.props.closeStatusPicker();
      }
    });

    _defineProperty(this, "handleEscapeKeydown", event => {
      event.preventDefault();
      this.inputMethod = InputMethod.escKey;
      this.props.onEnter(this.state);
    });

    _defineProperty(this, "onColorHover", color => {
      this.createStatusAnalyticsAndFireFunc({
        action: 'hovered',
        actionSubject: 'statusColorPicker',
        attributes: {
          color,
          localId: this.state.localId,
          state: analyticsState(this.props.isNew)
        }
      });
    });

    _defineProperty(this, "onColorClick", color => {
      const {
        text,
        localId
      } = this.state;

      if (color === this.state.color) {
        this.createStatusAnalyticsAndFireFunc({
          action: 'clicked',
          actionSubject: 'statusColorPicker',
          attributes: {
            color,
            localId,
            state: analyticsState(this.props.isNew)
          }
        }); // closes status box and commits colour

        this.onEnter();
      } else {
        this.setState({
          color
        });
        this.props.onSelect({
          text,
          color,
          localId
        });
      }
    });

    _defineProperty(this, "onTextChanged", text => {
      const {
        color,
        localId
      } = this.state;
      this.setState({
        text
      });
      this.props.onTextChanged({
        text,
        color,
        localId
      }, !!this.props.isNew);
    });

    _defineProperty(this, "onEnter", () => {
      this.inputMethod = InputMethod.enterKey;
      this.props.onEnter(this.state);
    });

    _defineProperty(this, "handlePopupClick", event => event.nativeEvent.stopImmediatePropagation());

    this.state = this.extractStateFromProps(props);
    this.createStatusAnalyticsAndFireFunc = createStatusAnalyticsAndFire(props.createAnalyticsEvent);
  }

  fireStatusPopupOpenedAnalytics(state) {
    const {
      color,
      text,
      localId,
      isNew
    } = state;
    this.startTime = Date.now();
    this.createStatusAnalyticsAndFireFunc({
      action: 'opened',
      actionSubject: 'statusPopup',
      attributes: {
        textLength: text ? text.length : 0,
        selectedColor: color,
        localId,
        state: analyticsState(isNew)
      }
    });
  }

  fireStatusPopupClosedAnalytics(state) {
    const {
      color,
      text,
      localId,
      isNew
    } = state;
    this.createStatusAnalyticsAndFireFunc({
      action: 'closed',
      actionSubject: 'statusPopup',
      attributes: {
        inputMethod: this.inputMethod,
        duration: Date.now() - this.startTime,
        textLength: text ? text.length : 0,
        selectedColor: color,
        localId,
        state: analyticsState(isNew)
      }
    });
  }

  reset() {
    this.startTime = Date.now();
    this.inputMethod = InputMethod.blur;
  }

  componentDidMount() {
    this.reset();
    this.fireStatusPopupOpenedAnalytics(this.state);
  }

  componentWillUnmount() {
    this.fireStatusPopupClosedAnalytics(this.state);
    this.startTime = 0;
  }

  componentDidUpdate(prevProps, prevState, _snapshot) {
    const element = this.props.target;

    if (prevProps.target !== element) {
      const newState = this.extractStateFromProps(this.props);
      this.setState(newState);
      this.fireStatusPopupClosedAnalytics(prevState);
      this.reset();
      this.fireStatusPopupOpenedAnalytics(newState);
    }
  }

  extractStateFromProps(props) {
    const {
      defaultColor,
      defaultText,
      defaultLocalId,
      isNew
    } = props;
    return {
      color: defaultColor || DEFAULT_STATUS.color,
      text: defaultText || DEFAULT_STATUS.text,
      localId: defaultLocalId,
      isNew
    };
  }

  render() {
    const {
      isNew,
      target
    } = this.props;
    const {
      color,
      text
    } = this.state;
    return target && jsx(PopupWithListeners, {
      target: target,
      offset: [0, 8],
      handleClickOutside: this.handleClickOutside,
      handleEscapeKeydown: this.handleEscapeKeydown,
      zIndex: akEditorFloatingDialogZIndex,
      fitHeight: 40
    }, jsx("div", {
      css: pickerContainer,
      onClick: this.handlePopupClick
    }, jsx(AkStatusPicker, {
      autoFocus: isNew,
      selectedColor: color,
      text: text,
      onColorClick: this.onColorClick,
      onColorHover: this.onColorHover,
      onTextChanged: this.onTextChanged,
      onEnter: this.onEnter
    })));
  }

}
export default withAnalyticsEvents()(StatusPickerWithoutAnalytcs);