import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { defineMessages, injectIntl } from 'react-intl-next';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ColorPalette from '../../../../ui/ColorPalette';
import { textColorPalette as originalTextColors } from '../../../../ui/ColorPalette/Palettes/textColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import { expandIconWrapperStyle, wrapperStyle, separatorStyles, triggerWrapperStyles } from '../../../../ui/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../analytics';
import * as commands from '../../commands/change-color';
import { EditorTextColorIcon } from './icon';
import { backgroundDisabled, textColorIconBar, textColorIconWrapper } from './styles';
const EXPERIMENT_NAME = 'editor.toolbarTextColor.moreColors';
const EXPERIMENT_GROUP_CONTROL = 'control';
export const messages = defineMessages({
  textColor: {
    id: 'fabric.editor.textColor',
    defaultMessage: 'Text color',
    description: ''
  }
});
export class ToolbarTextColor extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      isOpen: false
    });

    _defineProperty(this, "changeColor", color => commands.changeColor(color)(this.props.editorView.state, this.props.editorView.dispatch));

    _defineProperty(this, "changeTextColor", (color, disabled) => {
      if (!disabled) {
        const {
          pluginState: {
            palette,
            paletteExpanded,
            defaultColor
          }
        } = this.props; // we store color names in analytics

        const swatch = (paletteExpanded || palette).find(sw => sw.value === color);
        const isNewColor = color !== defaultColor && !originalTextColors.some(col => col.value === color);
        this.dispatchAnalyticsEvent(this.buildAnalyticsSelectColor({
          color: (swatch ? swatch.label : color).toLowerCase(),
          isNewColor
        }));
        this.handleOpenChange({
          isOpen: false,
          logCloseEvent: false
        });
        return this.changeColor(color);
      }

      return false;
    });

    _defineProperty(this, "toggleOpen", () => {
      this.handleOpenChange({
        isOpen: !this.state.isOpen,
        logCloseEvent: true
      });
    });

    _defineProperty(this, "handleOpenChange", ({
      isOpen,
      logCloseEvent
    }) => {
      this.setState({
        isOpen
      });

      if (logCloseEvent) {
        this.dispatchAnalyticsEvent(this.buildAnalyticsPalette(isOpen ? ACTION.OPENED : ACTION.CLOSED, {
          noSelect: isOpen === false
        }));
      }
    });

    _defineProperty(this, "hide", e => {
      const {
        isOpen
      } = this.state;

      if (isOpen === true) {
        this.dispatchAnalyticsEvent(this.buildAnalyticsPalette(ACTION.CLOSED, {
          noSelect: true
        }));
        this.setState({
          isOpen: false
        });
      }
    });
  }

  render() {
    const {
      isOpen
    } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isReducedSpacing,
      pluginState,
      pluginState: {
        paletteExpanded
      },
      intl: {
        formatMessage
      },
      disabled
    } = this.props;
    const labelTextColor = formatMessage(messages.textColor);
    const palette = paletteExpanded || pluginState.palette;
    let fitWidth;

    if (document.body.clientWidth <= 740) {
      // This was originally hard-coded, but moved here to a const
      // My guess is it's based off (width of button * columns) + left/right padding
      // 240 = (32 * 7) + (8 + 8)
      // Not sure where the extra 2px comes from
      fitWidth = 242;
    }

    const selectedColor = pluginState.color !== pluginState.defaultColor && pluginState.color;
    return jsx("span", {
      css: wrapperStyle
    }, jsx(Dropdown, {
      mountTo: popupsMountPoint,
      boundariesElement: popupsBoundariesElement,
      scrollableElement: popupsScrollableElement,
      isOpen: isOpen && !pluginState.disabled,
      handleClickOutside: this.hide,
      handleEscapeKeydown: this.hide,
      zIndex: akEditorMenuZIndex,
      fitWidth: fitWidth,
      trigger: jsx(ToolbarButton, {
        buttonId: TOOLBAR_BUTTON.TEXT_COLOR,
        spacing: isReducedSpacing ? 'none' : 'default',
        disabled: disabled || pluginState.disabled,
        selected: isOpen,
        "aria-label": labelTextColor,
        "aria-expanded": isOpen,
        "aria-haspopup": true,
        title: labelTextColor,
        onClick: this.toggleOpen,
        iconBefore: jsx("div", {
          css: triggerWrapperStyles
        }, jsx("div", {
          css: textColorIconWrapper
        }, jsx(EditorTextColorIcon, null), jsx("div", {
          css: [textColorIconBar, selectedColor ? `background: ${selectedColor};` : pluginState.disabled && backgroundDisabled]
        })), jsx("span", {
          css: expandIconWrapperStyle
        }, jsx(ExpandIcon, {
          label: ""
        })))
      })
    }, jsx("div", {
      "data-testid": "text-color-palette"
    }, jsx(ColorPalette, {
      palette: palette,
      onClick: color => this.changeTextColor(color, pluginState.disabled),
      selectedColor: pluginState.color
    }))), jsx("span", {
      css: separatorStyles
    }));
  }

  getCommonAnalyticsAttributes() {
    return {
      experiment: EXPERIMENT_NAME,
      experimentGroup: EXPERIMENT_GROUP_CONTROL
    };
  }

  buildAnalyticsPalette(action, data) {
    return {
      action,
      actionSubject: ACTION_SUBJECT.TOOLBAR,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: { ...this.getCommonAnalyticsAttributes(),
        ...data
      }
    };
  }

  buildAnalyticsSelectColor(data) {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
      eventType: EVENT_TYPE.TRACK,
      attributes: { ...this.getCommonAnalyticsAttributes(),
        ...data
      }
    };
  }

  dispatchAnalyticsEvent(payload) {
    const {
      dispatchAnalyticsEvent
    } = this.props;

    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent(payload);
    }
  }

}
export default injectIntl(ToolbarTextColor);