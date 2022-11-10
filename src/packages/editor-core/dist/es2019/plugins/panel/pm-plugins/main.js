import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { getPanelNodeView } from '../nodeviews/panel';
import { pluginKey } from '../types';
import { createSelectionClickHandler } from '../../selection/utils';
export const createPlugin = (dispatch, providerFactory, pluginOptions) => {
  const {
    useLongPressSelection = false
  } = pluginOptions;
  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        panel: getPanelNodeView(pluginOptions, providerFactory)
      },
      handleClickOn: createSelectionClickHandler(['panel'], target => !!target.closest(`.${PanelSharedCssClassName.prefix}`), {
        useLongPressSelection
      })
    }
  });
};