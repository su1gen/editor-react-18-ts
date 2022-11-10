import { Plugin } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
export declare function createPlugin(): Plugin | undefined;
declare const dataConsumerMarkPlugin: () => EditorPlugin;
export default dataConsumerMarkPlugin;
