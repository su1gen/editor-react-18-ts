import { PluginKey } from 'prosemirror-state';
import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
export var selectionPluginKey = new PluginKey('selection');
export { RelativeSelectionPos };
export var SelectionDirection;

(function (SelectionDirection) {
  SelectionDirection[SelectionDirection["Before"] = -1] = "Before";
  SelectionDirection[SelectionDirection["After"] = 1] = "After";
})(SelectionDirection || (SelectionDirection = {}));