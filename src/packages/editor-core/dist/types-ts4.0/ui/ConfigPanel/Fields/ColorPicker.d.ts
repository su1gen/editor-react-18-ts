/** @jsx jsx */
import { jsx } from '@emotion/react';
import { ColorField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
declare const ColorPickerField: ({ name, field, onFieldChange, }: {
    name: string;
    field: ColorField;
    onFieldChange: OnFieldChange;
}) => jsx.JSX.Element;
export default ColorPickerField;
