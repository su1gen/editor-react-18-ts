import { NodesCount, PluginPerformanceReportData, PluginPerformanceReportOptions } from './plugin-performance-report';
import { TransactionTracker } from './track-transactions';
export declare class PluginPerformanceObserver implements PerformanceObserver {
    private callback;
    private getNodeCounts;
    private getPlugins;
    private getOptions;
    private reportCount;
    private simpleObserver;
    private observer;
    private getTransactionTracker?;
    constructor(callback: (report: PluginPerformanceReportData) => void);
    private get isSimpleTracking();
    withNodeCounts(getNodeCounts: () => NodesCount): this;
    withPlugins(getPlugins: () => string[]): this;
    withOptions(getOptions: () => Partial<PluginPerformanceReportOptions>): this;
    withTransactionTracker(getTransactionTracker: () => TransactionTracker): this;
    private onObserveration;
    observe(): void;
    disconnect(): void;
    takeRecords(): PerformanceEntryList;
}
