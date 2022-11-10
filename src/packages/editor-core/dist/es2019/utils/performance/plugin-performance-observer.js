import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { PluginPerformanceReport } from './plugin-performance-report';
import { DEFAULT_USE_PERFORMANCE_MARK, EVENT_NAME_DISPATCH_TRANSACTION } from './track-transactions';
import { SimpleMeasurementLogger } from './simple-measure-to-entries';
export class PluginPerformanceObserver {
  constructor(callback) {
    _defineProperty(this, "getNodeCounts", () => [{
      nodeCount: {},
      extensionNodeCount: {}
    }, 0]);

    _defineProperty(this, "getPlugins", () => []);

    _defineProperty(this, "getOptions", () => ({}));

    _defineProperty(this, "reportCount", 0);

    _defineProperty(this, "simpleObserver", new SimpleMeasurementLogger());

    _defineProperty(this, "onObserveration", entries => {
      const reports = entries.getEntriesByName(EVENT_NAME_DISPATCH_TRANSACTION).map(entry => PluginPerformanceReport.fromEntry(entry).withCount(++this.reportCount).withEntryList(entries).withNodes(...this.getNodeCounts()).withPlugins(this.getPlugins()).withOptions(this.getOptions()).toJSON());
      reports.filter(report => report.trigger !== 'none').forEach(report => this.callback(report));
    });

    this.callback = callback;
    this.observer = window.PerformanceObserver ? new PerformanceObserver(this.onObserveration) : {
      observe() {},

      disconnect() {},

      takeRecords() {
        return [];
      }

    };
  }

  get isSimpleTracking() {
    const {
      usePerformanceMarks = DEFAULT_USE_PERFORMANCE_MARK
    } = this.getOptions();
    return !usePerformanceMarks;
  }

  withNodeCounts(getNodeCounts) {
    this.getNodeCounts = () => {
      const start = performance.now();
      const result = getNodeCounts();
      return [result, performance.now() - start];
    };

    return this;
  }

  withPlugins(getPlugins) {
    this.getPlugins = getPlugins;
    return this;
  }

  withOptions(getOptions) {
    this.getOptions = getOptions;
    return this;
  }

  withTransactionTracker(getTransactionTracker) {
    this.getTransactionTracker = getTransactionTracker;
    return this;
  }

  observe() {
    if (this.isSimpleTracking) {
      this.simpleObserver.setPluginNames(this.getPlugins());
      this.simpleObserver.setOnObservation(entries => {
        this.onObserveration(entries, this.observer);
      }); // can trigger a callback when stopMeasure() measures something.
      // use that to trigger this.onObservation()

      this.getTransactionTracker && this.getTransactionTracker().addMeasureListener(this.simpleObserver.observed);
    } else {
      try {
        this.observer.observe({
          buffered: false,
          type: 'measure'
        });
      } catch (err) {
        // Older API implementations do not support the simpler type init
        this.observer.observe({
          entryTypes: ['measure']
        });
      }
    }
  }

  disconnect() {
    if (this.isSimpleTracking) {
      this.getTransactionTracker && this.getTransactionTracker().removeMeasureListener(this.simpleObserver.observed);
    } else {
      this.observer.disconnect();
    }
  }

  takeRecords() {
    return this.observer.takeRecords();
  }

}