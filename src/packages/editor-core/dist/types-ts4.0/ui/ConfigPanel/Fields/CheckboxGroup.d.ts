import { jsx } from '@emotion/react';
import { EnumCheckboxField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function CheckboxGroup({ name, field, onFieldChange, }: {
    name: string;
    field: EnumCheckboxField;
    onFieldChange: OnFieldChange;
}): jsx.JSX.Element;
