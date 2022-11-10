import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ACTIONS } from './actions';
import { isInsertionTransaction } from './utils';
export function createPlugin() {
  return new SafePlugin({
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var insertItemCallback = isInsertionTransaction(transactions, ACTIONS.INSERT_ITEM);

      if (insertItemCallback) {
        var tr = insertItemCallback(newState);

        if (tr) {
          return tr;
        }
      }
    }
  });
}