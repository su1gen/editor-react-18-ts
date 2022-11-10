/// <reference types="react" />
import { StringField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function String({ name, field, autoFocus, onFieldChange, placeholder, }: {
    name: string;
    field: StringField;
    autoFocus?: boolean;
    onFieldChange: OnFieldChange;
    placeholder?: string;
}): JSX.Element;
