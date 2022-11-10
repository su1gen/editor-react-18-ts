import { MarkSpec } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ErrorReporter } from '@atlaskit/editor-common/utils';
import type { ErrorReportingHandler } from '@atlaskit/editor-common/utils';
import { EditorConfig, EditorPlugin, PMPluginCreateConfig } from '../types';
export declare function sortByRank(a: {
    rank: number;
}, b: {
    rank: number;
}): number;
export declare function fixExcludes(marks: {
    [key: string]: MarkSpec;
}): {
    [key: string]: MarkSpec;
};
export declare function processPluginsList(plugins: EditorPlugin[]): EditorConfig;
export declare function createPMPlugins(config: PMPluginCreateConfig): SafePlugin[];
export declare function createErrorReporter(errorReporterHandler?: ErrorReportingHandler): ErrorReporter;
