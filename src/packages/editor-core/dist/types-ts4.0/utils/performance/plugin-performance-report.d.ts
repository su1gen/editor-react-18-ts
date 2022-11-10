import { PluginMethodReport, PluginsReport, NodeCount, PluginPerformanceReportData } from '@atlaskit/editor-common/analytics';
export type { PluginMethodReport, PluginsReport, NodeCount, PluginPerformanceReportData, };
export interface OutlierReport {
    stateApplyOutlier: number | undefined;
    viewUpdateOutlier: number | undefined;
}
export interface PluginPerformanceReportOptions {
    usePerformanceMarks?: boolean;
    samplingRate: number;
    slowThreshold: number;
    outlierThreshold: number;
    outlierFactor: number;
}
export declare type NodesCount = {
    nodeCount: NodeCount;
    extensionNodeCount: NodeCount;
};
export declare class PluginPerformanceReport {
    private entry;
    private count;
    private pluginNames;
    private entryList?;
    private stateApplied?;
    private viewUpdated?;
    private onChangeCalled?;
    private onEditorViewStateUpdatedCalled?;
    private nodes;
    private extensionNodes;
    private nodesDuration;
    private plugins;
    private slowPlugins;
    private options;
    private constructor();
    static fromEntry(entry: PerformanceEntry): PluginPerformanceReport;
    private isChild;
    private getEntryByName;
    private getMethodSum;
    private greaterEquals;
    private hasOutlierMethods;
    get trigger(): 'none' | 'slow' | 'distribution' | 'sample';
    get hasSlowPlugins(): boolean;
    withEntryList(entryList: PerformanceObserverEntryList): this;
    withPlugins(pluginNames: string[]): this;
    withNodes(nodesCount: NodesCount, nodesDuration?: number): this;
    withCount(count: number): this;
    withOptions(options: Partial<PluginPerformanceReportOptions>): this;
    toJSON(): PluginPerformanceReportData;
}
