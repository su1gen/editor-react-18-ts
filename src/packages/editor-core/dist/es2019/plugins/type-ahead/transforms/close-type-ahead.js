import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
export const closeTypeAhead = tr => {
  return tr.setMeta(pluginKey, {
    action: ACTIONS.CLOSE_TYPE_AHEAD
  });
};