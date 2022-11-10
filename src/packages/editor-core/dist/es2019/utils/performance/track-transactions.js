import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { isPerformanceAPIAvailable, startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { getTimeSince } from './get-performance-timing';
export const EVENT_NAME_STATE_APPLY = `🦉 EditorView::state::apply`;
export const EVENT_NAME_UPDATE_STATE = `🦉 EditorView::updateState`;
export const EVENT_NAME_VIEW_STATE_UPDATED = `🦉 EditorView::onEditorViewStateUpdated`;
export const EVENT_NAME_ON_CHANGE = `🦉 ReactEditorView::onChange`;
export const EVENT_NAME_DISPATCH_TRANSACTION = `🦉 ReactEditorView::dispatchTransaction`;
export const DEFAULT_USE_PERFORMANCE_MARK = false;
const DEFAULT_SAMPLING_RATE = 100;

const noop = () => {};

export class TransactionTracker {
  constructor() {
    _defineProperty(this, "dispatchCallCounter", 0);

    _defineProperty(this, "measureMap", new Map());

    _defineProperty(this, "measureListeners", []);

    _defineProperty(this, "bumpDispatchCounter", options => {
      const {
        enabled: trackingEnabled,
        samplingRate = DEFAULT_SAMPLING_RATE
      } = options;

      if (trackingEnabled) {
        if (this.dispatchCallCounter >= samplingRate) {
          this.dispatchCallCounter = 0;
        }

        this.dispatchCallCounter++;
      }

      return this.dispatchCallCounter;
    });

    _defineProperty(this, "getMeasureHelpers", options => {
      const {
        usePerformanceMarks = DEFAULT_USE_PERFORMANCE_MARK
      } = options;

      if (!this.shouldTrackTransaction(options)) {
        return {
          startMeasure: noop,
          stopMeasure: noop
        };
      }

      return {
        startMeasure: usePerformanceMarks ? startMeasure : this.startMeasureSimple,
        stopMeasure: usePerformanceMarks ? stopMeasure : this.stopMeasureSimple
      };
    });

    _defineProperty(this, "startMeasureSimple", measureName => {
      if (!isPerformanceAPIAvailable()) {
        return;
      }

      this.measureMap.set(measureName, performance.now());
    });

    _defineProperty(this, "stopMeasureSimple", (measureName, onMeasureComplete) => {
      if (!isPerformanceAPIAvailable()) {
        return;
      }

      const startTime = this.measureMap.get(measureName);

      if (startTime) {
        const duration = getTimeSince(startTime);
        this.measureMap.delete(measureName);

        if (onMeasureComplete) {
          onMeasureComplete(duration, startTime);
        } // Call each subscribed listener


        this.measureListeners.forEach(listener => listener({
          name: measureName,
          duration,
          startTime
        }));
      }
    });
  }

  addMeasureListener(listener) {
    this.measureListeners.push(listener);
  }

  removeMeasureListener(listener) {
    const index = this.measureListeners.indexOf(listener);

    if (index > -1) {
      this.measureListeners.splice(index, 1);
    }
  }

  shouldTrackTransaction(options) {
    const {
      enabled: trackingEnabled,
      samplingRate = DEFAULT_SAMPLING_RATE
    } = options;
    return trackingEnabled && this.dispatchCallCounter === samplingRate;
  }

}