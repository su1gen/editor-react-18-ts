import React from 'react';
import HyperlinkToolbar from '../../hyperlink/ui/HyperlinkAddToolbar';
import { showLinkToolbar, hideLinkToolbar } from '../pm-plugins/actions';
import { addAnalytics } from '../../analytics';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '../../../ui/LinkSearch/ToolbarComponents';
import { changeSelectedCardToLink, updateCard } from '../pm-plugins/doc';
import { findCardInfo, displayInfoForCard } from '../utils';
import { NodeSelection } from 'prosemirror-state';
import { buildEditLinkPayload } from '../../../utils/linking-utils';
export class EditLinkToolbar extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.node !== this.props.node) {
      this.hideLinkToolbar();
    }
  }

  componentWillUnmount() {
    this.hideLinkToolbar();
  }

  hideLinkToolbar() {
    const {
      view
    } = this.props;
    view.dispatch(hideLinkToolbar(view.state.tr));
  }

  render() {
    const {
      linkPickerOptions,
      providerFactory,
      url,
      text,
      view,
      onSubmit
    } = this.props;
    return /*#__PURE__*/React.createElement(HyperlinkToolbar, {
      view: view,
      linkPickerOptions: linkPickerOptions,
      providerFactory: providerFactory,
      displayUrl: url,
      displayText: text,
      onSubmit: (href, title, displayText) => {
        this.hideLinkToolbar();

        if (onSubmit) {
          onSubmit(href, displayText || title);
        }
      }
    });
  }

}
export const editLink = (state, dispatch) => {
  let type = 'hyperlink';

  if (state.selection instanceof NodeSelection) {
    type = state.selection.node.type.name;
  }

  if (dispatch) {
    dispatch(addAnalytics(state, showLinkToolbar(state.tr), buildEditLinkPayload(type)));
    return true;
  }

  return false;
};
export const buildEditLinkToolbar = ({
  providerFactory,
  node,
  linkPicker
}) => {
  return {
    type: 'custom',
    fallback: [],
    render: (view, idx) => {
      if (!view || !providerFactory) {
        return null;
      }

      const displayInfo = displayInfoForCard(node, findCardInfo(view.state));
      return /*#__PURE__*/React.createElement(EditLinkToolbar, {
        key: idx,
        view: view,
        linkPickerOptions: linkPicker,
        providerFactory: providerFactory,
        url: displayInfo.url,
        text: displayInfo.title || '',
        node: node,
        onSubmit: (newHref, newText) => {
          const urlChanged = newHref !== displayInfo.url;
          const titleChanged = newText !== displayInfo.title; // If the title is changed in a smartlink, convert to standard blue hyperlink
          // (even if the url was also changed) - we don't want to lose the custom title.

          if (titleChanged) {
            return changeSelectedCardToLink(newText, newHref)(view.state, view.dispatch);
          } else if (urlChanged) {
            // If *only* the url is changed in a smart link, reresolve
            return updateCard(newHref)(view.state, view.dispatch);
          }

          return;
        }
      });
    }
  };
};
export const editLinkToolbarConfig = {
  height: RECENT_SEARCH_HEIGHT_IN_PX,
  width: RECENT_SEARCH_WIDTH_IN_PX,
  forcePlacement: true
};