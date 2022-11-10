import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import EditorActions from '../../../../../actions';
import { PortalProviderAPI } from '../../../../../ui/PortalProvider';
import { EditorSharedConfig } from '../../context/shared-config';
import { EditorPropsExtended } from '../../editor-props-type';
import { FeatureFlags } from '../../../../../types/feature-flags';
import { IntlShape } from 'react-intl-next';
export declare function createEditor({ context, onAnalyticsEvent, transformer, providerFactory, plugins, portalProviderAPI, defaultValue, ref, popupsMountPoint, popupsBoundariesElement, popupsScrollableElement, editorActions, disabled, onChange, onDestroy, onMount, featureFlags, getIntl, }: CreateEditorParams): EditorSharedConfig | null;
export declare type CreateEditorParams = Pick<EditorPropsExtended, 'defaultValue' | 'plugins' | 'popupsMountPoint' | 'popupsBoundariesElement' | 'popupsScrollableElement' | 'onChange' | 'disabled' | 'transformer' | 'onAnalyticsEvent' | 'onDestroy' | 'onMount'> & {
    context: any;
    ref?: HTMLDivElement | null;
    providerFactory: ProviderFactory;
    portalProviderAPI: PortalProviderAPI;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    editorActions: EditorActions;
    featureFlags: FeatureFlags;
    getIntl: () => IntlShape;
};
