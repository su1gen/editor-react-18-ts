import { FieldDefinition, Parameters, ExtensionManifest, ParametersWithDuplicateFields } from '@atlaskit/editor-common/extensions';
interface SerializeOptions {
    depth?: number;
    parentType?: 'fieldset' | 'tab' | 'expand';
}
export declare const findDuplicateFields: (fields: FieldDefinition[]) => FieldDefinition | undefined;
export declare const serialize: (manifest: ExtensionManifest, data: Parameters, fields: FieldDefinition[], options?: SerializeOptions) => Promise<Parameters>;
export declare const deserialize: (manifest: ExtensionManifest, data: Parameters | ParametersWithDuplicateFields, fields: FieldDefinition[], depth?: number) => Promise<Parameters>;
export {};
