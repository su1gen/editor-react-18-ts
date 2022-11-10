import { EditorState } from 'prosemirror-state';
import { IntlShape } from 'react-intl-next';
import { FloatingToolbarConfig } from '../../../plugins/floating-toolbar/types';
import { MediaFloatingToolbarOptions } from '../types';
export declare const floatingToolbar: (state: EditorState, intl: IntlShape, options?: MediaFloatingToolbarOptions) => FloatingToolbarConfig | undefined;
