import { EditorState, Transaction } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { CardReplacementInputMethod } from '../types';
import { CardAdf, CardAppearance } from '@atlaskit/editor-common/provider-factory';
import { Command } from '../../../types';
import { ACTION, InputMethodInsertLink } from '../../../plugins/analytics';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
export declare const replaceQueuedUrlWithCard: (url: string, cardData: CardAdf, analyticsAction?: ACTION | undefined, createAnalyticsEvent?: CreateUIAnalyticsEvent | undefined) => Command;
export declare const handleFallbackWithAnalytics: (url: string, source: InputMethodInsertLink) => Command;
export declare const queueCardsFromChangedTr: (state: EditorState, tr: Transaction, source: CardReplacementInputMethod, normalizeLinkText?: boolean) => Transaction;
export declare const convertHyperlinkToSmartCard: (state: EditorState, source: CardReplacementInputMethod, appearance: CardAppearance, normalizeLinkText?: boolean) => Transaction;
export declare const changeSelectedCardToLink: (text?: string | undefined, href?: string | undefined, sendAnalytics?: boolean | undefined, node?: Node<any> | undefined, pos?: number | undefined) => Command;
export declare const changeSelectedCardToLinkFallback: (text?: string | undefined, href?: string | undefined, sendAnalytics?: boolean | undefined, node?: Node<any> | undefined, pos?: number | undefined) => Command;
export declare const updateCard: (href: string) => Command;
export declare const changeSelectedCardToText: (text: string) => Command;
export declare const setSelectedCardAppearance: (appearance: CardAppearance) => Command;
