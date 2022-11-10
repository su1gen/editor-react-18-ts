import { EditorState } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { IntlShape } from 'react-intl-next';
import { FloatingToolbarConfig } from '../../floating-toolbar/types';
import { MediaLinkingState } from '../pm-plugins/linking';
import { MediaToolbarBaseConfig } from '../types';
export declare function shouldShowMediaLinkToolbar(editorState: EditorState): boolean;
export declare const getLinkingToolbar: (toolbarBaseConfig: MediaToolbarBaseConfig, mediaLinkingState: MediaLinkingState, state: EditorState, intl: IntlShape, providerFactory?: ProviderFactory | undefined) => FloatingToolbarConfig | undefined;
