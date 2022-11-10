import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { QuickInsertProvider } from '@atlaskit/editor-common/provider-factory';
import EditorActions from '../actions';
export declare function extensionProviderToQuickInsertProvider(extensionProvider: ExtensionProvider, editorActions: EditorActions, createAnalyticsEvent?: CreateUIAnalyticsEvent): Promise<QuickInsertProvider>;
export declare function combineQuickInsertProviders(quickInsertProviders: Array<QuickInsertProvider | Promise<QuickInsertProvider>>): Promise<QuickInsertProvider>;
