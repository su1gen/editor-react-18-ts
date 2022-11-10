/// <reference types="react" />
import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { FieldDefinition, Parameters } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from './types';
export interface FieldComponentProps {
    field: FieldDefinition;
    parameters: Parameters;
    parentName?: string;
    extensionManifest: ExtensionManifest;
    firstVisibleFieldName?: string;
    onFieldChange: OnFieldChange;
}
export declare function FieldComponent({ field, parameters, parentName, extensionManifest, firstVisibleFieldName, onFieldChange, }: FieldComponentProps): JSX.Element;
export default function FormContent({ fields, parentName, parameters, extensionManifest, canRemoveFields, onClickRemove, onFieldChange, firstVisibleFieldName, contextIdentifierProvider, }: {
    fields: FieldDefinition[];
    parentName?: string;
    parameters?: Parameters;
    extensionManifest: ExtensionManifest;
    canRemoveFields?: boolean;
    onClickRemove?: (fieldName: string) => void;
    onFieldChange: OnFieldChange;
    firstVisibleFieldName?: string;
    contextIdentifierProvider?: ContextIdentifierProvider;
}): JSX.Element;
