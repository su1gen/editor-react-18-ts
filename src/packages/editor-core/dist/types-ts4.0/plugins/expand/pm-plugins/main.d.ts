import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Dispatch } from '../../../event-dispatcher';
import { EditorProps } from '../../../types';
import { IntlShape } from 'react-intl-next';
export declare const createPlugin: (dispatch: Dispatch, getIntl: () => IntlShape, appearance?: EditorProps['appearance'], useLongPressSelection?: boolean) => SafePlugin<import("..").ExpandPluginState, import("prosemirror-model").Schema<any, any>>;
