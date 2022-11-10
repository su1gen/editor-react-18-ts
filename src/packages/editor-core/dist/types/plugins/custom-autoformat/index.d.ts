import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorPlugin, PMPluginFactoryParams } from '../../types';
import { CustomAutoformatState } from './types';
export declare const createPMPlugin: ({ providerFactory }: PMPluginFactoryParams) => SafePlugin<CustomAutoformatState, any>;
declare const customAutoformatPlugin: () => EditorPlugin;
export default customAutoformatPlugin;
