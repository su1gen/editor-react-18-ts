/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { WrappedComponentProps } from 'react-intl-next';
import { Props, State } from './types';
export declare class ToolbarInsertBlock extends React.PureComponent<Props & WrappedComponentProps, State> {
    private dropdownButtonRef?;
    private emojiButtonRef?;
    private plusButtonRef?;
    state: State;
    static getDerivedStateFromProps(props: Props & WrappedComponentProps, state: State): State | null;
    componentDidUpdate(prevProps: Props): void;
    private onOpenChange;
    private togglePlusMenuVisibility;
    private toggleEmojiPicker;
    private handleEmojiPressEscape;
    private handleEmojiClickOutside;
    private renderPopup;
    private handleEmojiButtonRef;
    private handlePlusButtonRef;
    private handleDropDownButtonRef;
    render(): jsx.JSX.Element | null;
    private toggleLinkPanel;
    private insertMention;
    private insertTable;
    private createDate;
    private createPlaceholderText;
    private insertLayoutColumns;
    private createStatus;
    private openMediaPicker;
    private insertTaskDecision;
    private insertHorizontalRule;
    private insertExpand;
    private insertBlockType;
    private handleSelectedEmoji;
    private openElementBrowser;
    private onItemActivated;
    private insertToolbarMenuItem;
    private insertInsertMenuItem;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;
