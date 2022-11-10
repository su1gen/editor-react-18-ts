/// <reference types="react" />
import { UserField, ExtensionManifest } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function UserSelect({ name, autoFocus, extensionManifest, field, onFieldChange, }: {
    name: string;
    field: UserField;
    extensionManifest: ExtensionManifest;
    onFieldChange: OnFieldChange;
    autoFocus?: boolean;
}): JSX.Element;
