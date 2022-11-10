import { EditorPlugin } from '../../types';
import type { InsertNodeAPI } from '../../insert-api/types';
export interface InsertBlockOptions {
    allowTables?: boolean;
    allowExpand?: boolean;
    insertMenuItems?: any;
    horizontalRuleEnabled?: boolean;
    nativeStatusSupported?: boolean;
    replacePlusMenuWithElementBrowser?: boolean;
    showElementBrowserLink?: boolean;
    insertNodeAPI?: InsertNodeAPI;
}
declare const insertBlockPlugin: (options?: InsertBlockOptions) => EditorPlugin;
export default insertBlockPlugin;
