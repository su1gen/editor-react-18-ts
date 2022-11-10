"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldKeepInviteItem = exports.isTeamType = exports.isTeamStats = exports.isInviteItem = void 0;

var _InviteItem = require("./ui/InviteItem");

var isTeamType = function isTeamType(userType) {
  return userType === 'TEAM';
};

exports.isTeamType = isTeamType;

var isTeamStats = function isTeamStats(stat) {
  return stat && !isNaN(stat.teamMentionDuration);
};

exports.isTeamStats = isTeamStats;

var isInviteItem = function isInviteItem(mention) {
  return mention && mention.id === _InviteItem.INVITE_ITEM_DESCRIPTION.id;
};
/**
 * Actions
 */


exports.isInviteItem = isInviteItem;

var shouldKeepInviteItem = function shouldKeepInviteItem(query, firstQueryWithoutResults) {
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

exports.shouldKeepInviteItem = shouldKeepInviteItem;