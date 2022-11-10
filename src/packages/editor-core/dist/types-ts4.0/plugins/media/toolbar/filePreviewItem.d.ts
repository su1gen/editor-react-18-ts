import { FC } from 'react';
import { MediaPluginState } from '../pm-plugins/types';
import { IntlShape } from 'react-intl-next';
interface FilePreviewProps {
    mediaPluginState: MediaPluginState;
    intl: IntlShape;
}
export declare const FilePreviewItem: FC<FilePreviewProps>;
export {};
