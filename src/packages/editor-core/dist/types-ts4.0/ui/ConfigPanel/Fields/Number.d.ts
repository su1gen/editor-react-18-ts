/// <reference types="react" />
import { NumberField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function Number({ name, field, autoFocus, onFieldChange, placeholder, }: {
    name: string;
    field: NumberField;
    autoFocus?: boolean;
    onFieldChange: OnFieldChange;
    placeholder?: string;
}): JSX.Element;
