import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { freezeUnsafeTransactionProperties } from './safer-transactions';
export class InstrumentedPlugin extends SafePlugin {
  constructor(spec, options = {}, transactionTracker) {
    const {
      transactionTracking = {
        enabled: false
      },
      uiTracking = {
        enabled: false
      },
      saferDispatchedTransactions = false,
      dispatchAnalyticsEvent
    } = options;
    const shouldOverrideApply = transactionTracking.enabled && transactionTracker || saferDispatchedTransactions;

    if (shouldOverrideApply && spec.state) {
      const originalApply = spec.state.apply.bind(spec.state);

      spec.state.apply = (aTr, value, oldState, newState) => {
        const self = this;
        const tr = saferDispatchedTransactions ? new Proxy(aTr, freezeUnsafeTransactionProperties({
          dispatchAnalyticsEvent,
          pluginKey: self.key
        })) : aTr;
        const shouldTrackTransactions = transactionTracker === null || transactionTracker === void 0 ? void 0 : transactionTracker.shouldTrackTransaction(transactionTracking);

        if (!shouldTrackTransactions || !transactionTracker) {
          return originalApply(tr, value, oldState, newState);
        }

        const {
          startMeasure,
          stopMeasure
        } = transactionTracker.getMeasureHelpers(transactionTracking);
        const measure = `🦉${self.key}::apply`;
        startMeasure(measure);
        const result = originalApply(tr, value, oldState, newState);
        stopMeasure(measure);
        return result;
      };
    }

    if (uiTracking.enabled && spec.view) {
      const originalView = spec.view.bind(spec);

      spec.view = editorView => {
        const self = this;
        const measure = `🦉${self.key}::view::update`;
        const view = originalView(editorView);

        if (view.update) {
          const originalUpdate = view.update;

          view.update = (view, state) => {
            startMeasure(measure);
            originalUpdate(view, state);
            stopMeasure(measure, () => {});
          };
        }

        return view;
      };
    }

    super(spec);
  }

  static fromPlugin(plugin, options, transactionTracker) {
    return new InstrumentedPlugin(plugin.spec, options, transactionTracker);
  }

}