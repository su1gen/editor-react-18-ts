/// <reference types="react" />
import { EnumSelectField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function SelectField({ name, field, onFieldChange, autoFocus, placeholder, fieldDefaultValue, }: {
    name: string;
    field: EnumSelectField;
    onFieldChange: OnFieldChange;
    autoFocus?: boolean;
    placeholder?: string;
    fieldDefaultValue?: string | string[];
}): JSX.Element;
