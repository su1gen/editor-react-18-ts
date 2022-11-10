import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
interface Props {
    fields: FieldDefinition[];
    extensionKey: string;
    contextIdentifierProvider?: ContextIdentifierProvider;
    children: React.ReactNode;
}
export declare const FormErrorBoundaryImpl: React.FC<import("react-intl-next").WithIntlProps<Props & WithAnalyticsEventsProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WithAnalyticsEventsProps & WrappedComponentProps<"intl">>;
};
export declare const FormErrorBoundary: React.ForwardRefExoticComponent<Pick<Omit<React.PropsWithChildren<import("react-intl-next").WithIntlProps<Props & WithAnalyticsEventsProps & WrappedComponentProps<"intl">>>, keyof WithAnalyticsEventsProps> & React.RefAttributes<any> & import("@atlaskit/analytics-next").WithContextProps, "key" | "analyticsContext" | "forwardedRef" | keyof Props> & React.RefAttributes<any>>;
export {};
