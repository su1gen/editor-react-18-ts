import { EventType, GasPayload } from '@atlaskit/analytics-gas-types';
import { MentionDescription } from '@atlaskit/mention/resource';
import { InviteExperimentCohort, UserRole } from '@atlaskit/mention';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { TeamInfoAttrAnalytics } from './types';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
export declare const buildAnalyticsPayload: (actionSubject: string, action: string, eventType: EventType, sessionId: string, otherAttributes?: {}, tags?: Array<string>) => GasPayload;
export declare const buildTypeAheadCancelPayload: (duration: number, upKeyCount: number, downKeyCount: number, sessionId: string, query?: string | undefined) => GasPayload;
export declare const buildTypeAheadInviteItemViewedPayload: (sessionId: string, contextIdentifierProvider?: ContextIdentifierProvider | undefined, userRole?: UserRole | undefined) => GasPayload;
export declare const buildTypeAheadInviteExposurePayload: (sessionId: string, contextIdentifierProvider?: ContextIdentifierProvider | undefined, inviteExperimentCohort?: InviteExperimentCohort | undefined, userRole?: UserRole | undefined) => GasPayload;
export declare const buildTypeAheadInviteItemClickedPayload: (duration: number, upKeyCount: number, downKeyCount: number, sessionId: string, insertType: SelectItemMode, query?: string | undefined, contextIdentifierProvider?: ContextIdentifierProvider | undefined, userRole?: UserRole | undefined) => GasPayload;
export declare const buildTypeAheadInsertedPayload: (duration: number, upKeyCount: number, downKeyCount: number, sessionId: string, insertType: SelectItemMode, mention: MentionDescription, mentionList?: MentionDescription[] | undefined, query?: string | undefined, contextIdentifierProvider?: ContextIdentifierProvider | undefined) => GasPayload;
export declare const buildTypeAheadRenderedPayload: (duration: number, userIds: Array<string> | null, query: string, teams: TeamInfoAttrAnalytics[] | null) => GasPayload;