import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorPlugin } from '../../types';
import { Providers } from '@atlaskit/editor-common/provider-factory';
export declare function createPlugin(dispatch: Function, imageEnabled: boolean): SafePlugin<any, any>;
declare const helpDialog: (legacyImageUploadProvider?: Providers['imageUploadProvider']) => EditorPlugin;
export default helpDialog;
