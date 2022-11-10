/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { Popup, withOuterListeners } from '@atlaskit/editor-common/ui';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import ColorPalette from '../ColorPalette';
import { DEFAULT_BORDER_COLOR } from '../ColorPalette/Palettes/common';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../plugins/analytics/types'; // helps adjusts position of popup

const colorPickerButtonWrapper = css`
  position: relative;
`; // Control the size of color picker buttons and preview

const colorPickerWrapper = css`
  border-radius: ${borderRadius()}px;
  background-color: white;
  box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
  padding: 8px 0px;
`;

const ColorPickerButton = props => {
  var _props$size, _props$size2;

  const buttonRef = React.useRef(null);
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  React.useEffect(() => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [isPopupOpen]);
  const ColorPaletteWithListeners = withOuterListeners(ColorPalette);

  const onColorSelected = (color, label) => {
    setIsPopupOpen(false);

    if (props.onChange) {
      if (props.createAnalyticsEvent) {
        // fire analytics
        const payload = {
          action: ACTION.UPDATED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
          attributes: {
            color,
            label,
            placement: props.placement
          },
          eventType: EVENT_TYPE.TRACK
        };
        props.createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      }

      const newPalette = props.colorPalette.find(colorPalette => colorPalette.value === color);
      newPalette && props.onChange(newPalette);
    }
  };

  const renderPopup = () => {
    if (!isPopupOpen || !buttonRef.current) {
      return;
    }

    return jsx(Popup, {
      target: buttonRef.current,
      fitHeight: 350,
      fitWidth: 350,
      offset: [0, 10],
      alignX: props.alignX,
      mountTo: props.setDisableParentScroll ? props.mountPoint : undefined // Confluence inline comment editor has z-index: 500
      // if the toolbar is scrollable, this will be mounted in the root editor
      // we need an index of > 500 to display over it
      ,
      zIndex: props.setDisableParentScroll ? 600 : undefined,
      ariaLabel: "Color picker popup"
    }, jsx("div", {
      css: colorPickerWrapper
    }, jsx(ColorPaletteWithListeners, {
      palette: props.colorPalette,
      cols: props.cols,
      selectedColor: props.currentColor || null,
      onClick: onColorSelected,
      handleClickOutside: togglePopup
    })));
  };

  const title = props.title || '';
  return jsx("div", {
    css: colorPickerButtonWrapper
  }, jsx(Tooltip, {
    content: title,
    position: "top"
  }, jsx(Button, {
    ref: buttonRef,
    "aria-label": title,
    spacing: "compact",
    onClick: togglePopup,
    style: {
      backgroundColor: props.currentColor || 'transparent',
      border: `1px solid ${DEFAULT_BORDER_COLOR}`,
      width: `${((_props$size = props.size) === null || _props$size === void 0 ? void 0 : _props$size.width) || 20}px`,
      height: `${((_props$size2 = props.size) === null || _props$size2 === void 0 ? void 0 : _props$size2.height) || 20}px`,
      padding: 0
    }
  })), renderPopup());
};

export default withAnalyticsContext({
  source: 'ConfigPanel'
})(withAnalyticsEvents()(ColorPickerButton));