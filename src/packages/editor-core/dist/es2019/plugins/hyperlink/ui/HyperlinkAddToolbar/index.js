import _extends from "@babel/runtime/helpers/extends";
import React from 'react';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import HyperlinkAddToolbarComp from './HyperlinkAddToolbar';
import { INPUT_METHOD } from '../../../analytics';
import { stateKey as pluginKey } from '../../pm-plugins/main';
import WithPluginState from '../../../../ui/WithPluginState';
import { getFeatureFlags } from '../../../feature-flags-context';
import { EditorLinkPicker } from '../EditorLinkPicker';

/**
 * Wraps around the editor's onSubmit handler so that the plugin can interface with the link picker
 */
const onSubmitInterface = onSubmit => ({
  url,
  title,
  displayText,
  rawUrl,
  meta
}) => {
  onSubmit(url, title !== null && title !== void 0 ? title : rawUrl, displayText || undefined, meta.inputMethod === 'manual' ? INPUT_METHOD.MANUAL : INPUT_METHOD.TYPEAHEAD);
};

export default class HyperlinkAddToolbar extends React.PureComponent {
  render() {
    const {
      linkPickerOptions = {},
      onSubmit,
      displayText,
      displayUrl,
      providerFactory,
      view
    } = this.props;
    return /*#__PURE__*/React.createElement(WithProviders, {
      providers: ['activityProvider', 'searchProvider'],
      providerFactory: providerFactory,
      renderNode: ({
        activityProvider,
        searchProvider
      }) => /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: view,
        plugins: {
          hyperlinkPluginState: pluginKey
        },
        render: ({
          hyperlinkPluginState
        }) => {
          var _linkPickerOptions$pl;

          const {
            lpLinkPicker
          } = getFeatureFlags(view.state);
          /**
           * If activityProvider or searchProvider are present then only enable if there are plugins supplied to
           * faciliate providing link search capabilities
           */

          if (lpLinkPicker && (!activityProvider && !searchProvider || Boolean(linkPickerOptions === null || linkPickerOptions === void 0 ? void 0 : (_linkPickerOptions$pl = linkPickerOptions.plugins) === null || _linkPickerOptions$pl === void 0 ? void 0 : _linkPickerOptions$pl.length))) {
            return /*#__PURE__*/React.createElement(EditorLinkPicker, _extends({
              view: view
            }, linkPickerOptions, {
              url: displayUrl,
              displayText: displayText,
              onSubmit: onSubmitInterface(onSubmit)
            }));
          }

          return /*#__PURE__*/React.createElement(HyperlinkAddToolbarComp, {
            activityProvider: activityProvider,
            searchProvider: searchProvider,
            onSubmit: onSubmit,
            displayText: displayText,
            displayUrl: displayUrl,
            pluginState: hyperlinkPluginState,
            view: view
          });
        }
      })
    });
  }

}