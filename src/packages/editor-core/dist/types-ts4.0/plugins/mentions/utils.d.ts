import { MentionDescription } from '@atlaskit/mention';
export declare const isTeamType: (userType: any) => Boolean;
export declare const isTeamStats: (stat: any) => Boolean;
export declare const isInviteItem: (mention: MentionDescription) => Boolean;
/**
 * Actions
 */
export declare const shouldKeepInviteItem: (query: string, firstQueryWithoutResults: string) => boolean;
