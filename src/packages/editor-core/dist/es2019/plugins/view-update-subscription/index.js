import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export const trackerStore = new WeakMap();

class Tracker {
  constructor() {
    _defineProperty(this, "update", props => {
      this.subscriptions.forEach(cb => cb(props));
    });

    _defineProperty(this, "add", subscription => {
      this.subscriptions.push(subscription);
    });

    _defineProperty(this, "remove", subscription => {
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    });

    this.subscriptions = [];
  }

}

const pluginKey = new PluginKey('viewUpdateSubscriptionKey');

const createViewUpdateSubscriptionPlugin = () => {
  let tracker;
  const lastUpdateRef = {
    current: null,
    initial: null,
    transactions: [],
    queued: false
  };
  return {
    name: 'viewUpdateSubscription',
    pmPlugins: () => {
      const createPlugin = () => new SafePlugin({
        key: pluginKey,

        view(editorView) {
          tracker = trackerStore.get(editorView);

          if (!tracker) {
            tracker = new Tracker();
            trackerStore.set(editorView, tracker);
          }

          return {};
        }

      });

      return [{
        name: 'viewUpdateSubscription',
        plugin: createPlugin
      }];
    },

    onEditorViewStateUpdated(props) {
      lastUpdateRef.current = props;
      lastUpdateRef.transactions.push(...props.transactions);

      if (!lastUpdateRef.queued) {
        lastUpdateRef.initial = props;
        lastUpdateRef.queued = true;
        queueMicrotask(() => {
          if (!lastUpdateRef.current || !lastUpdateRef.initial) {
            return;
          }

          if (tracker) {
            var _lastUpdateRef$initia;

            tracker.update({
              newEditorState: lastUpdateRef.current.newEditorState,
              oldEditorState: (_lastUpdateRef$initia = lastUpdateRef.initial) === null || _lastUpdateRef$initia === void 0 ? void 0 : _lastUpdateRef$initia.oldEditorState,
              transactions: lastUpdateRef.transactions
            });
          }

          lastUpdateRef.queued = false;
          lastUpdateRef.current = null;
          lastUpdateRef.transactions = [];
        });
      }
    }

  };
};

export default createViewUpdateSubscriptionPlugin;