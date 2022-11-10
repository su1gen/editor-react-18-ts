/// <reference types="react" />
import { WrappedComponentProps } from 'react-intl-next';
import { Schema } from 'prosemirror-model';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { BlockType } from '../../../block-type/types';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
import { MacroProvider } from '../../../macro';
export interface CreateItemsConfig {
    isTypeAheadAllowed?: boolean;
    tableSupported?: boolean;
    mediaUploadsEnabled?: boolean;
    mediaSupported?: boolean;
    imageUploadSupported?: boolean;
    imageUploadEnabled?: boolean;
    mentionsSupported?: boolean;
    availableWrapperBlockTypes?: BlockType[];
    actionSupported?: boolean;
    decisionSupported?: boolean;
    linkSupported?: boolean;
    linkDisabled?: boolean;
    emojiDisabled?: boolean;
    nativeStatusSupported?: boolean;
    dateEnabled?: boolean;
    placeholderTextEnabled?: boolean;
    horizontalRuleEnabled?: boolean;
    layoutSectionEnabled?: boolean;
    showElementBrowserLink?: boolean;
    expandEnabled?: boolean;
    insertMenuItems?: MenuItem[];
    macroProvider?: MacroProvider | null;
    emojiProvider?: Promise<EmojiProvider>;
    schema: Schema;
    numberOfButtons: number;
    formatMessage: WrappedComponentProps['intl']['formatMessage'];
    isNewMenuEnabled?: boolean;
}
export interface BlockMenuItem extends MenuItem {
    title: JSX.Element | null;
}
export declare const createItems: import("memoize-one").MemoizedFn<(config: CreateItemsConfig) => readonly [
    BlockMenuItem[],
    BlockMenuItem[]
]>;
