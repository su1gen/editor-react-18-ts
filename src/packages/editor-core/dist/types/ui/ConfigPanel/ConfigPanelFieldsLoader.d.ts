/// <reference types="react" />
import { ExtensionProvider, ExtensionType, ExtensionKey, Parameters } from '@atlaskit/editor-common/extensions';
export declare type PublicProps = {
    extensionProvider: ExtensionProvider;
    extensionType: ExtensionType;
    extensionKey: ExtensionKey;
    nodeKey: string;
    extensionParameters?: Parameters;
    parameters?: Parameters;
    autoSave?: boolean;
    autoSaveTrigger?: () => void;
    autoSaveReject?: (reason?: any) => void;
    closeOnEsc?: boolean;
    showHeader?: boolean;
    onChange: (data: Parameters) => void;
    onCancel: () => void;
};
export default function FieldsLoader({ extensionType, extensionKey, nodeKey, extensionProvider, extensionParameters, parameters, autoSave, autoSaveTrigger, autoSaveReject, closeOnEsc, showHeader, onChange, onCancel, }: PublicProps): JSX.Element;
