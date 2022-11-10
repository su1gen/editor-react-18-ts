import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { getPanelNodeView } from '../nodeviews/panel';
import { pluginKey } from '../types';
import { createSelectionClickHandler } from '../../selection/utils';
export var createPlugin = function createPlugin(dispatch, providerFactory, pluginOptions) {
  var _pluginOptions$useLon = pluginOptions.useLongPressSelection,
      useLongPressSelection = _pluginOptions$useLon === void 0 ? false : _pluginOptions$useLon;
  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        panel: getPanelNodeView(pluginOptions, providerFactory)
      },
      handleClickOn: createSelectionClickHandler(['panel'], function (target) {
        return !!target.closest(".".concat(PanelSharedCssClassName.prefix));
      }, {
        useLongPressSelection: useLongPressSelection
      })
    }
  });
};