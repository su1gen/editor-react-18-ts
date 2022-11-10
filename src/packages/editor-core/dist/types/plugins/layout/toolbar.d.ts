import { IntlShape } from 'react-intl-next';
import { EditorState } from 'prosemirror-state';
import { FloatingToolbarConfig } from '../../plugins/floating-toolbar/types';
export declare const layoutToolbarTitle = "Layout floating controls";
export declare const buildToolbar: (state: EditorState, intl: IntlShape, pos: number, _allowBreakout: boolean, addSidebarLayouts: boolean, allowSingleColumnLayout: boolean) => FloatingToolbarConfig | undefined;
