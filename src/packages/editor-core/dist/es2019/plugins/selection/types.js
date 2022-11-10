import { PluginKey } from 'prosemirror-state';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export const selectionPluginKey = new PluginKey('selection');
export { RelativeSelectionPos };
export let SelectionDirection;

(function (SelectionDirection) {
  SelectionDirection[SelectionDirection["Before"] = -1] = "Before";
  SelectionDirection[SelectionDirection["After"] = 1] = "After";
})(SelectionDirection || (SelectionDirection = {}));