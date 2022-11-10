import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
var _excluded = ["view"];
import React, { useCallback } from 'react';
import { LinkPicker } from '@atlaskit/link-picker';
import { hideLinkToolbar as cardHideLinkToolbar } from '../../../card/pm-plugins/actions';
import { hideLinkToolbar } from '../../commands';
import { useEscapeClickaway } from './useEscapeClickaway';
export var EditorLinkPicker = function EditorLinkPicker(_ref) {
  var view = _ref.view,
      restProps = _objectWithoutProperties(_ref, _excluded);

  var onEscape = useCallback(function () {
    hideLinkToolbar()(view.state, view.dispatch);
    view.dispatch(cardHideLinkToolbar(view.state.tr));
  }, [view]);
  var onClickAway = useCallback(function () {
    hideLinkToolbar()(view.state, view.dispatch);
  }, [view]);
  var ref = useEscapeClickaway(onEscape, onClickAway);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement(LinkPicker, _extends({}, restProps, {
    onCancel: onEscape
  })));
};