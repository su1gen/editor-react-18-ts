import { ACTION, ACTION_SUBJECT, SELECTION_TYPE, SELECTION_POSITION } from '@atlaskit/editor-common/analytics';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { findParentNode } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
export function getSelectionType(state) {
  var _selection$constructo;

  const {
    selection
  } = state;
  let type;
  let position;

  if ((selection === null || selection === void 0 ? void 0 : (_selection$constructo = selection.constructor) === null || _selection$constructo === void 0 ? void 0 : _selection$constructo.name) === 'GapCursorSelection') {
    type = SELECTION_TYPE.GAP_CURSOR;
    position = selection.side;
  } else if (selection instanceof CellSelection) {
    type = SELECTION_TYPE.CELL;
  } else if (selection instanceof NodeSelection) {
    type = SELECTION_TYPE.NODE;
  } else if (selection.from !== selection.to) {
    type = SELECTION_TYPE.RANGED;
  } else {
    type = SELECTION_TYPE.CURSOR;
    const {
      from,
      $from
    } = selection;

    if (from === $from.start()) {
      position = SELECTION_POSITION.START;
    } else if (from === $from.end()) {
      position = SELECTION_POSITION.END;
    } else {
      position = SELECTION_POSITION.MIDDLE;
    }
  }

  return {
    type,
    position
  };
}
export function findInsertLocation(state) {
  const {
    selection
  } = state;

  if (selection instanceof NodeSelection) {
    return selection.node.type.name;
  }

  if (selection instanceof CellSelection) {
    return state.schema.nodes.table.name;
  } // Text selection


  const parentNodeInfo = findParentNode(node => node.type !== state.schema.nodes.paragraph)(state.selection);
  return parentNodeInfo ? parentNodeInfo.node.type.name : state.doc.type.name;
}
export function getStateContext(state, payload) {
  if (!payload.attributes) {
    return payload;
  }

  const {
    type,
    position
  } = getSelectionType(state);
  payload.attributes.selectionType = type;

  if (position) {
    payload.attributes.selectionPosition = position;
  }

  const insertLocation = findInsertLocation(state);

  if (payload.action === ACTION.INSERTED && payload.actionSubject === ACTION_SUBJECT.DOCUMENT && payload.attributes) {
    payload.attributes.insertLocation = insertLocation;
  } else {
    payload.attributes.nodeLocation = insertLocation;
  }

  return payload;
}