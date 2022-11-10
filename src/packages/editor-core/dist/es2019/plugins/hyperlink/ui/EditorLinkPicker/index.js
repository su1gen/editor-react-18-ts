import _extends from "@babel/runtime/helpers/extends";
import React, { useCallback } from 'react';
import { LinkPicker } from '@atlaskit/link-picker';
import { hideLinkToolbar as cardHideLinkToolbar } from '../../../card/pm-plugins/actions';
import { hideLinkToolbar } from '../../commands';
import { useEscapeClickaway } from './useEscapeClickaway';
export const EditorLinkPicker = ({
  view,
  ...restProps
}) => {
  const onEscape = useCallback(() => {
    hideLinkToolbar()(view.state, view.dispatch);
    view.dispatch(cardHideLinkToolbar(view.state.tr));
  }, [view]);
  const onClickAway = useCallback(() => {
    hideLinkToolbar()(view.state, view.dispatch);
  }, [view]);
  const ref = useEscapeClickaway(onEscape, onClickAway);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref
  }, /*#__PURE__*/React.createElement(LinkPicker, _extends({}, restProps, {
    onCancel: onEscape
  })));
};