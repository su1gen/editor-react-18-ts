import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

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

var colorPickerButtonWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n"]))); // Control the size of color picker buttons and preview

var colorPickerWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  border-radius: ", "px;\n  background-color: white;\n  box-shadow: 0 4px 8px -2px ", ", 0 0 1px ", ";\n  padding: 8px 0px;\n"])), borderRadius(), N60A, N60A);

var ColorPickerButton = function ColorPickerButton(props) {
  var _props$size, _props$size2;

  var buttonRef = React.useRef(null);

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isPopupOpen = _React$useState2[0],
      setIsPopupOpen = _React$useState2[1];

  var togglePopup = function togglePopup() {
    setIsPopupOpen(!isPopupOpen);
  };

  React.useEffect(function () {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [isPopupOpen]);
  var ColorPaletteWithListeners = withOuterListeners(ColorPalette);

  var onColorSelected = function onColorSelected(color, label) {
    setIsPopupOpen(false);

    if (props.onChange) {
      if (props.createAnalyticsEvent) {
        // fire analytics
        var payload = {
          action: ACTION.UPDATED,
          actionSubject: ACTION_SUBJECT.PICKER,
          actionSubjectId: ACTION_SUBJECT_ID.PICKER_COLOR,
          attributes: {
            color: color,
            label: label,
            placement: props.placement
          },
          eventType: EVENT_TYPE.TRACK
        };
        props.createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      }

      var newPalette = props.colorPalette.find(function (colorPalette) {
        return colorPalette.value === color;
      });
      newPalette && props.onChange(newPalette);
    }
  };

  var renderPopup = function renderPopup() {
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

  var title = props.title || '';
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
      border: "1px solid ".concat(DEFAULT_BORDER_COLOR),
      width: "".concat(((_props$size = props.size) === null || _props$size === void 0 ? void 0 : _props$size.width) || 20, "px"),
      height: "".concat(((_props$size2 = props.size) === null || _props$size2 === void 0 ? void 0 : _props$size2.height) || 20, "px"),
      padding: 0
    }
  })), renderPopup());
};

export default withAnalyticsContext({
  source: 'ConfigPanel'
})(withAnalyticsEvents()(ColorPickerButton));