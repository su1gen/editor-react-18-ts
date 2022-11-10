import { FloatingToolbarConfig, FloatingToolbarItem } from './../floating-toolbar/types';
import { EmojiInfo, PanelPluginOptions } from './types';
import { IntlShape } from 'react-intl-next';
import { EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { Command } from '../../types';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { PanelType } from '@atlaskit/adf-schema';
export declare const panelIconMap: {
    [key in Exclude<PanelType, PanelType.CUSTOM>]: EmojiInfo;
};
export declare const getToolbarItems: (formatMessage: IntlShape['formatMessage'], panelNodeType: NodeType, isCustomPanelEnabled: boolean, isCustomPanelEditable: boolean, providerFactory: ProviderFactory, activePanelType?: string | undefined, activePanelColor?: string | undefined, activePanelIcon?: string | undefined, state?: EditorState<any> | undefined) => FloatingToolbarItem<Command>[];
export declare const getToolbarConfig: (state: EditorState, intl: IntlShape, options: PanelPluginOptions | undefined, providerFactory: ProviderFactory) => FloatingToolbarConfig | undefined;
