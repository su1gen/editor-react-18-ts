import React from 'react';
import { EventDispatcher } from '../../event-dispatcher';
import { FireAnalyticsCallback } from '../../plugins/analytics/fire-analytics-event';
import { IntlShape, WrappedComponentProps } from 'react-intl-next';
import type { ThemeModes } from '@atlaskit/theme/types';
export declare type BasePortalProviderProps = {
    render: (portalProviderAPI: PortalProviderAPI) => React.ReactChild | JSX.Element | null;
    onAnalyticsEvent?: FireAnalyticsCallback;
    useAnalyticsContext?: boolean;
    themeMode?: ThemeModes;
} & WrappedComponentProps;
export declare type Portals = Map<HTMLElement, React.ReactChild>;
export declare type PortalRendererState = {
    portals: Portals;
};
declare type MountedPortal = {
    children: () => React.ReactChild | null;
    hasAnalyticsContext: boolean;
    hasIntlContext: boolean;
};
export declare class PortalProviderAPI extends EventDispatcher {
    portals: Map<HTMLElement, MountedPortal>;
    context: any;
    intl: IntlShape;
    onAnalyticsEvent?: FireAnalyticsCallback;
    useAnalyticsContext?: boolean;
    themeMode?: ThemeModes;
    constructor(intl: IntlShape, onAnalyticsEvent?: FireAnalyticsCallback, analyticsContext?: boolean, themeMode?: ThemeModes);
    setContext: (context: any) => void;
    render(children: () => React.ReactChild | JSX.Element | null, container: HTMLElement, hasAnalyticsContext?: boolean, hasIntlContext?: boolean): void;
    forceUpdate({ intl, themeMode, }: {
        intl: IntlShape;
        themeMode: ThemeModes | undefined;
    }): void;
    remove(container: HTMLElement): void;
}
export declare const PortalProvider: React.FC<import("react-intl-next").WithIntlProps<BasePortalProviderProps>> & {
    WrappedComponent: React.ComponentType<BasePortalProviderProps>;
};
declare type PortalProviderWithThemeProvidersProps = Omit<BasePortalProviderProps, 'intl' | 'themeMode'>;
export declare const PortalProviderWithThemeProviders: ({ onAnalyticsEvent, useAnalyticsContext, render, }: PortalProviderWithThemeProvidersProps) => JSX.Element;
export declare class PortalRenderer extends React.Component<{
    portalProviderAPI: PortalProviderAPI;
}, PortalRendererState> {
    constructor(props: {
        portalProviderAPI: PortalProviderAPI;
    });
    handleUpdate: (portals: Portals) => void;
    render(): JSX.Element;
}
export {};
