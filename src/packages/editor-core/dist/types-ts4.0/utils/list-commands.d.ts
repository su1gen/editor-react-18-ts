import { indentList, outdentList, toggleOrderedList, toggleBulletList } from '../plugins/list/commands';
export declare const getListCommands: () => {
    indentList: typeof indentList;
    outdentList: typeof outdentList;
    toggleOrderedList: typeof toggleOrderedList;
    toggleBulletList: typeof toggleBulletList;
};
