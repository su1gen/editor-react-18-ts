/// <reference types="react" />
import { ValueType } from '@atlaskit/select';
import type { RenderOptionsPropsT, SelectOption } from '@atlaskit/editor-common/types';
export type { RenderOptionsPropsT, SelectOption };
export interface Props {
    hideExpandIcon?: boolean;
    options: SelectOption[];
    dispatchCommand: (command: Function) => void;
    mountPoint?: HTMLElement;
    boundariesElement?: HTMLElement;
    scrollableElement?: HTMLElement;
    defaultValue?: SelectOption | null;
    placeholder?: string;
    onChange?: (change: ValueType<SelectOption>) => void;
    width?: number;
    filterOption?: ((option: SelectOption, rawInput: string) => boolean) | null;
    setDisableParentScroll?: (disable: boolean) => void;
}
export default function Search(props: Props): JSX.Element;
