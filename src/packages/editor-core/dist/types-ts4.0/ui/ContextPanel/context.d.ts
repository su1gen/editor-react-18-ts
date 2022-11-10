import React from 'react';
export declare type ContextPanelContext = {
    width: number;
    positionedOverEditor: boolean;
    broadcastWidth: (width: number) => void;
    broadcastPosition: (positionedOverEditor: boolean) => void;
};
declare const Provider: React.Provider<ContextPanelContext>, Consumer: React.Consumer<ContextPanelContext>;
export declare type ContextPanelProviderState = {
    width?: number;
    positionedOverEditor?: boolean;
};
export declare class ContextPanelWidthProvider extends React.Component<any, ContextPanelProviderState> {
    state: {
        width: number;
        positionedOverEditor: boolean;
    };
    constructor(props: any);
    broadcastSidebarWidth: (width: number) => void;
    broadcastPosition: (positionedOverEditor: boolean) => void;
    render(): JSX.Element;
}
export { Provider as ContextPanelProvider, Consumer as ContextPanelConsumer };
