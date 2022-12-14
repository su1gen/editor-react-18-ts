import { keymap } from 'prosemirror-keymap';
import { bindKeymapWithCommand, find as findKeymap } from '../../keymaps';
import { activateWithAnalytics } from './commands-with-analytics';
import { TRIGGER_METHOD } from '../analytics';

const activateFindReplace = () => (state, dispatch) => {
  activateWithAnalytics({
    triggerMethod: TRIGGER_METHOD.SHORTCUT
  })(state, dispatch);
  return true;
};

const keymapPlugin = () => {
  const list = {};
  bindKeymapWithCommand(findKeymap.common, activateFindReplace(), list);
  return keymap(list);
};

export default keymapPlugin;