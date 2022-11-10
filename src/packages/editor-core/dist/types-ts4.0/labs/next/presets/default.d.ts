import React from 'react';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { PastePluginOptions } from '../../../plugins/paste';
import { BasePluginOptions } from '../../../plugins/base';
import { EditorProps } from '../Editor';
import { EditorPresetProps } from './types';
import { Preset } from './preset';
import { EditorPlugin } from '../../../types/editor-plugin';
import { BlockTypePluginOptions } from '../../../plugins/block-type/types';
import { PlaceholderPluginOptions } from '../../../plugins/placeholder';
import { AnnotationProviders } from '../../../plugins/annotation';
import { TextFormattingOptions } from '../../../plugins/text-formatting/types';
import { QuickInsertPluginOptions } from '../../../plugins/quick-insert';
import { CodeBlockOptions } from '../../../plugins/code-block/types';
import { SelectionPluginOptions } from '../../../plugins/selection/types';
import { CardOptions } from '@atlaskit/editor-common/card';
import { TypeAheadPluginOptions } from '../../../plugins/type-ahead';
import { HyperlinkPluginOptions } from '../../../plugins/hyperlink/types';
interface EditorPresetDefaultProps {
    children?: React.ReactNode;
}
export declare type DefaultPresetPluginOptions = {
    paste: PastePluginOptions;
    base?: BasePluginOptions;
    blockType?: BlockTypePluginOptions;
    placeholder?: PlaceholderPluginOptions;
    textFormatting?: TextFormattingOptions;
    submitEditor?: EditorProps['onSave'];
    annotationProviders?: AnnotationProviders;
    quickInsert?: QuickInsertPluginOptions;
    codeBlock?: CodeBlockOptions;
    selection?: SelectionPluginOptions;
    cardOptions?: CardOptions;
    hyperlinkOptions?: HyperlinkPluginOptions;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    typeAhead?: TypeAheadPluginOptions;
};
/**
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */
export declare function createDefaultPreset(options: EditorPresetProps & DefaultPresetPluginOptions): Preset<EditorPlugin>;
export declare function useDefaultPreset(props: EditorPresetProps & DefaultPresetPluginOptions): Preset<EditorPlugin>[];
export declare function EditorPresetDefault(props: EditorPresetDefaultProps & EditorPresetProps & DefaultPresetPluginOptions): JSX.Element;
export {};
