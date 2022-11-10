import { EditorState } from 'prosemirror-state';
import { IntlShape } from 'react-intl-next';
import { NodeType } from 'prosemirror-model';
import { FloatingToolbarItem } from '../../plugins/floating-toolbar/types';
import { Command } from '../../types';
declare const buildLayoutButtons: (state: EditorState, intl: IntlShape, nodeType: NodeType, allowResizing?: boolean | undefined, allowResizingInTables?: boolean | undefined) => FloatingToolbarItem<Command>[];
export default buildLayoutButtons;
