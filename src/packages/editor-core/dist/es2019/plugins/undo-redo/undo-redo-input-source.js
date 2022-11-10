import { pluginKey as undoRedoPluginKey } from './pm-plugins/plugin-key';

const getUndoRedoInputSource = tr => {
  return tr.getMeta(undoRedoPluginKey) || null;
};

export const generateUndoRedoInputSoucePayload = tr => {
  const undoRedoPluginInputSource = getUndoRedoInputSource(tr);
  return payload => {
    const shouldAddHistoryTriggerMethodAttribute = undoRedoPluginInputSource && ['undid', 'redid'].includes(payload.action);
    return !shouldAddHistoryTriggerMethodAttribute ? payload : { ...payload,
      attributes: { ...payload.attributes,
        historyTriggerMethod: undoRedoPluginInputSource
      }
    };
  };
};