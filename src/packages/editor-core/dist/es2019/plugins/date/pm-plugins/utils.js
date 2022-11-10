import { NodeSelection } from 'prosemirror-state';
export function reducer(pluginState, meta) {
  // If the same nodeview is clicked twice, calendar should close
  if (meta.showDatePickerAt === pluginState.showDatePickerAt) {
    return { ...pluginState,
      showDatePickerAt: null
    };
  }

  const {
    showDatePickerAt,
    isNew
  } = pluginState;
  const {
    showDatePickerAt: showDatePickerAtMeta
  } = meta; // If date picker position has changed, it is no longer new

  if (showDatePickerAt && showDatePickerAtMeta && showDatePickerAt !== showDatePickerAtMeta && isNew) {
    return { ...pluginState,
      ...meta,
      isNew: false
    };
  }

  return { ...pluginState,
    ...meta
  };
}
export function mapping(tr, pluginState) {
  if (!pluginState.showDatePickerAt) {
    return pluginState;
  }

  const {
    pos
  } = tr.mapping.mapResult(pluginState.showDatePickerAt);
  return {
    showDatePickerAt: pos,
    isNew: pluginState.isNew,
    isDateEmpty: pluginState.isDateEmpty,
    focusDateInput: pluginState.focusDateInput
  };
}
export function onSelectionChanged(tr, pluginState) {
  if (tr.docChanged && isDateNodeSelection(tr.selection)) {
    return { ...pluginState,
      isQuickInsertAction: false,
      showDatePickerAt: tr.selection.from
    };
  } else if (!isDateNodeSelection(tr.selection) && !pluginState.isQuickInsertAction) {
    if (pluginState.showDatePickerAt) {
      return {
        showDatePickerAt: null,
        isNew: false,
        isDateEmpty: false,
        focusDateInput: false
      };
    }

    return pluginState;
  }

  return pluginState;
}

const isDateNodeSelection = selection => {
  if (selection instanceof NodeSelection) {
    const nodeTypeName = selection.node.type.name;
    return nodeTypeName === 'date';
  }

  return false;
};