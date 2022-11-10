import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { removeSelectedNode, removeParentNodeOfType } from 'prosemirror-utils';
import { applyChange } from '../context-panel/transforms';
import { createCommand } from './plugin-factory';
import { getSelectedExtension } from './utils'; // AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

export function updateState(state) {
  return createCommand({
    type: 'UPDATE_STATE',
    data: state
  });
}
export function setEditingContextToContextPanel(processParametersBefore, processParametersAfter) {
  return createCommand({
    type: 'UPDATE_STATE',
    data: {
      showContextPanel: true,
      processParametersBefore: processParametersBefore,
      processParametersAfter: processParametersAfter
    }
  }, applyChange);
}
export var clearEditingContext = createCommand({
  type: 'UPDATE_STATE',
  data: {
    showContextPanel: false,
    processParametersBefore: undefined,
    processParametersAfter: undefined
  }
}, applyChange);
export var forceAutoSave = function forceAutoSave(resolve, reject) {
  return createCommand({
    type: 'UPDATE_STATE',
    data: {
      autoSaveResolve: resolve,
      autoSaveReject: reject
    }
  }, applyChange);
};
export var showContextPanel = createCommand({
  type: 'UPDATE_STATE',
  data: {
    showContextPanel: true
  }
}, applyChange);
export var updateExtensionLayout = function updateExtensionLayout(layout) {
  return createCommand({
    type: 'UPDATE_STATE',
    data: {
      layout: layout
    }
  }, function (tr, state) {
    var selectedExtension = getSelectedExtension(state, true);

    if (selectedExtension) {
      var trWithNewNodeMarkup = tr.setNodeMarkup(selectedExtension.pos, undefined, _objectSpread(_objectSpread({}, selectedExtension.node.attrs), {}, {
        layout: layout
      }));
      trWithNewNodeMarkup.setMeta('scrollIntoView', false);
      return trWithNewNodeMarkup;
    }

    return tr;
  });
};
export var removeExtension = function removeExtension() {
  return createCommand({
    type: 'UPDATE_STATE',
    data: {
      element: undefined
    }
  }, function (tr, state) {
    if (getSelectedExtension(state)) {
      return removeSelectedNode(tr);
    } else {
      return removeParentNodeOfType(state.schema.nodes.bodiedExtension)(tr);
    }
  });
};