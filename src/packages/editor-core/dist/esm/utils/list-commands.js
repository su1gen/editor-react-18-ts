import { indentList, outdentList, toggleOrderedList, toggleBulletList } from '../plugins/list/commands'; // getListCommands provides commands for manipulating lists in the document.

export var getListCommands = function getListCommands() {
  return {
    indentList: indentList,
    outdentList: outdentList,
    toggleOrderedList: toggleOrderedList,
    toggleBulletList: toggleBulletList
  };
};