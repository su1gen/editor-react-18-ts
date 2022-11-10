import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { IntlShape } from 'react-intl-next';
import type { EditorProps } from '../../../types';
export declare const createPlugin: ({ useLongPressSelection, getIntl, appearance, allowCompositionInputOverride, }: {
    useLongPressSelection?: boolean | undefined;
    getIntl: () => IntlShape;
    appearance: EditorProps['appearance'];
    allowCompositionInputOverride?: boolean | undefined;
}) => SafePlugin<any, any>;
