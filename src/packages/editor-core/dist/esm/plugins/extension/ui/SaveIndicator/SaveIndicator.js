import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

/** @jsx jsx */
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { G300, N0 } from '@atlaskit/theme/colors';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import { FormattedMessage } from 'react-intl-next';
import { messages } from './messages';
import { token } from '@atlaskit/tokens';

var noop = function noop() {};

var saveIndicatorWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: center;\n"])));
var saveIndicatorContent = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: fixed;\n  width: 256px;\n  bottom: 20px;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 6px 12px;\n\n  background: ", ";\n\n  /* E300 */\n  box-shadow: ", ";\n  border-radius: 16px;\n"])), token('elevation.surface.overlay', N0), token('elevation.shadow.overlay', "0px 8px 12px rgba(9, 30, 66, 0.15), 0px 0px 1px rgba(9, 30, 66, 0.31)"));
var saveIndicatorText = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  padding-left: 6px;\n"])));
export var SaveIndicator = function SaveIndicator(_ref) {
  var children = _ref.children,
      duration = _ref.duration,
      _ref$visible = _ref.visible,
      visible = _ref$visible === void 0 ? true : _ref$visible;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      saving = _useState2[0],
      setSaving = _useState2[1];

  var shown = useRef(false);
  var onSaveStarted = useCallback(function () {
    if (!shown.current) {
      setSaving(true);
      shown.current = true;
    }
  }, []);
  useEffect(function () {
    if (saving) {
      var handleId = setTimeout(function () {
        setSaving(false);
      }, duration);
      return function () {
        return clearTimeout(handleId);
      };
    }
  }, [saving, duration]);
  return jsx(Fragment, null, jsx("div", null, children({
    onSaveStarted: onSaveStarted,
    onSaveEnded: noop
  })), visible && saving && jsx("div", {
    css: saveIndicatorWrapper
  }, jsx("div", {
    css: saveIndicatorContent,
    "data-testid": "save-indicator-content"
  }, jsx(CheckCircleIcon, {
    label: "Saving",
    primaryColor: token('color.icon.success', G300),
    size: "small"
  }), jsx("span", {
    css: saveIndicatorText
  }, jsx(FormattedMessage, messages.saveIndicator)))));
};