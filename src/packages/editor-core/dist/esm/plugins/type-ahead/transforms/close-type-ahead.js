import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
export var closeTypeAhead = function closeTypeAhead(tr) {
  return tr.setMeta(pluginKey, {
    action: ACTIONS.CLOSE_TYPE_AHEAD
  });
};