import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { codeBidiWarningMessages } from '@atlaskit/editor-common/messages';
import { codeBidiWarningPluginKey } from '../plugin-key';
import { createBidiWarningsDecorationSetFromDoc, createPluginState, getPluginState } from './plugin-factory';
export var createPlugin = function createPlugin(_ref, _ref2) {
  var dispatch = _ref.dispatch,
      getIntl = _ref.getIntl;
  var appearance = _ref2.appearance;
  var intl = getIntl();
  var codeBidiWarningLabel = intl.formatMessage(codeBidiWarningMessages.label);
  return new SafePlugin({
    key: codeBidiWarningPluginKey,
    state: createPluginState(dispatch, function (state) {
      // The appearance being mobile indicates we are in an editor being
      // rendered by mobile bridge in a web view.
      // The tooltip is likely to have unexpected behaviour there, with being cut
      // off, so we disable it. This is also to keep the behaviour consistent with
      // the rendering in the mobile Native Renderer.
      var tooltipEnabled = appearance !== 'mobile';
      return {
        decorationSet: createBidiWarningsDecorationSetFromDoc({
          doc: state.doc,
          codeBidiWarningLabel: codeBidiWarningLabel,
          tooltipEnabled: tooltipEnabled
        }),
        codeBidiWarningLabel: codeBidiWarningLabel,
        tooltipEnabled: tooltipEnabled
      };
    }),
    props: {
      decorations: function decorations(state) {
        var _getPluginState = getPluginState(state),
            decorationSet = _getPluginState.decorationSet;

        return decorationSet;
      }
    }
  });
};