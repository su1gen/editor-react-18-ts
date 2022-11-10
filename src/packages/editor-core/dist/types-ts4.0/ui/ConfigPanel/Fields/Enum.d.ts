/// <reference types="react" />
import { EnumField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function Enum({ name, field, autoFocus, onFieldChange, fieldDefaultValue, }: {
    name: string;
    field: EnumField;
    autoFocus: boolean;
    onFieldChange: OnFieldChange;
    fieldDefaultValue?: string | string[];
}): JSX.Element;
