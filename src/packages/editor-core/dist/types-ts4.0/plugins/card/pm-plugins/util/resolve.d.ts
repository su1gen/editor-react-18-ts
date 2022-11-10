import { CardProvider } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import { OutstandingRequests, Request } from '../../types';
import { CardOptions } from '@atlaskit/editor-common/card';
export declare const resolveWithProvider: (view: EditorView, outstandingRequests: OutstandingRequests, provider: CardProvider, request: Request, options: CardOptions) => Promise<void | import("@atlaskit/linking-common").InlineCardAdf | import("@atlaskit/linking-common").BlockCardAdf | import("@atlaskit/linking-common").EmbedCardAdf>;
export declare const handleProvider: (_: 'cardProvider', provider: Promise<CardProvider> | undefined, view: EditorView) => void;
