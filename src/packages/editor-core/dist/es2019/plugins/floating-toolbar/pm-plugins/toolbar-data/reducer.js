export const reducer = (pluginState, action) => {
  switch (action.type) {
    case 'SHOW_CONFIRM_DIALOG':
      return { ...pluginState,
        confirmDialogForItem: action.data.buttonIndex
      };

    case 'HIDE_CONFIRM_DIALOG':
      return { ...pluginState,
        confirmDialogForItem: undefined
      };

    default:
      return pluginState;
  }
};