import { INVITE_ITEM_DESCRIPTION } from './ui/InviteItem';
export var isTeamType = function isTeamType(userType) {
  return userType === 'TEAM';
};
export var isTeamStats = function isTeamStats(stat) {
  return stat && !isNaN(stat.teamMentionDuration);
};
export var isInviteItem = function isInviteItem(mention) {
  return mention && mention.id === INVITE_ITEM_DESCRIPTION.id;
};
/**
 * Actions
 */

export var shouldKeepInviteItem = function shouldKeepInviteItem(query, firstQueryWithoutResults) {
  if (!firstQueryWithoutResults) {
    return true;
  }

  var lastIndexWithResults = firstQueryWithoutResults.length - 1;
  var suffix = query.slice(lastIndexWithResults);

  if (query[lastIndexWithResults - 1] === ' ') {
    suffix = ' ' + suffix;
  }

  var depletedExtraWords = /\s[^\s]+\s/.test(suffix);
  return !depletedExtraWords;
};