import { ReadonlyTransaction } from 'prosemirror-state';
import { DatePluginState, DatePluginMeta } from './types';
export declare function reducer(pluginState: DatePluginState, meta: DatePluginMeta): DatePluginState;
export declare function mapping(tr: ReadonlyTransaction, pluginState: DatePluginState): DatePluginState;
export declare function onSelectionChanged(tr: ReadonlyTransaction, pluginState: DatePluginState): DatePluginState;
