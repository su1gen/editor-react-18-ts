import { jsx } from '@emotion/react';
import { BooleanField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
export default function Boolean({ name, field, onFieldChange, }: {
    name: string;
    field: BooleanField;
    onFieldChange: OnFieldChange;
}): jsx.JSX.Element;
