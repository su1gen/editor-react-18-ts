/// <reference types="react" />
import { EnumRadioField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function RadioField({ name, field, onFieldChange, }: {
    name: string;
    field: EnumRadioField;
    onFieldChange: OnFieldChange;
}): JSX.Element;
