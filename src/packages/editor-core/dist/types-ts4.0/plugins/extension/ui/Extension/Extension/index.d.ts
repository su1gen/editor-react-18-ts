/** @jsx jsx */
import React from 'react';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import type { ExtensionProvider, ReferenceEntity } from '@atlaskit/editor-common/extensions';
import { ProsemirrorGetPosHandler } from '../../../../../nodeviews';
import { EditorAppearance } from '../../../../../types/editor-appearance';
export interface Props {
    node: PmNode;
    getPos: ProsemirrorGetPosHandler;
    view: EditorView;
    extensionProvider?: ExtensionProvider;
    handleContentDOMRef: (node: HTMLElement | null) => void;
    children?: React.ReactNode;
    references?: ReferenceEntity[];
    hideFrame?: boolean;
    editorAppearance?: EditorAppearance;
}
declare const _default: {
    new (props: Readonly<Props>): {
        overflowContainer?: HTMLElement | null | undefined;
        container?: HTMLElement | undefined;
        shadowObserver?: import("@atlaskit/editor-common/ui").ShadowObserver | undefined;
        overflowContainerWidth: number;
        scrollable?: NodeList | undefined;
        diff?: number | undefined;
        state: {
            showLeftShadow: boolean;
            showRightShadow: boolean;
        };
        componentWillUnmount(): void;
        componentDidUpdate(): void;
        handleScroll: (event: Event) => void;
        updateShadows: () => void;
        showLeftShadow: (overflowContainer: HTMLElement | null | undefined) => boolean;
        calcOverflowDiff: () => number;
        calcScrollableWidth: () => number;
        handleContainer: (container: HTMLElement | null) => void;
        initShadowObserver(): void;
        render(): JSX.Element;
        context: any;
        setState<K extends keyof import("@atlaskit/editor-common/ui").OverflowShadowState>(state: import("@atlaskit/editor-common/ui").OverflowShadowState | ((prevState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, props: Readonly<Props>) => import("@atlaskit/editor-common/ui").OverflowShadowState | Pick<import("@atlaskit/editor-common/ui").OverflowShadowState, K> | null) | Pick<import("@atlaskit/editor-common/ui").OverflowShadowState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<Props> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, nextContext: any): void;
    };
    new (props: Props, context?: any): {
        overflowContainer?: HTMLElement | null | undefined;
        container?: HTMLElement | undefined;
        shadowObserver?: import("@atlaskit/editor-common/ui").ShadowObserver | undefined;
        overflowContainerWidth: number;
        scrollable?: NodeList | undefined;
        diff?: number | undefined;
        state: {
            showLeftShadow: boolean;
            showRightShadow: boolean;
        };
        componentWillUnmount(): void;
        componentDidUpdate(): void;
        handleScroll: (event: Event) => void;
        updateShadows: () => void;
        showLeftShadow: (overflowContainer: HTMLElement | null | undefined) => boolean;
        calcOverflowDiff: () => number;
        calcScrollableWidth: () => number;
        handleContainer: (container: HTMLElement | null) => void;
        initShadowObserver(): void;
        render(): JSX.Element;
        context: any;
        setState<K_1 extends keyof import("@atlaskit/editor-common/ui").OverflowShadowState>(state: import("@atlaskit/editor-common/ui").OverflowShadowState | ((prevState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, props: Readonly<Props>) => import("@atlaskit/editor-common/ui").OverflowShadowState | Pick<import("@atlaskit/editor-common/ui").OverflowShadowState, K_1> | null) | Pick<import("@atlaskit/editor-common/ui").OverflowShadowState, K_1> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<Props> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<Props>, nextState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<Props>, prevState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>): any;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<Props>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<Props>, nextState: Readonly<import("@atlaskit/editor-common/ui").OverflowShadowState>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export default _default;
