import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { OPERATIONAL_EVENT_TYPE, UI_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { isSpecialMention } from '@atlaskit/mention/resource';
import { name as packageName, version as packageVersion } from '../../version-wrapper';
import { isTeamType } from './utils';
var componentName = 'mention';
export var buildAnalyticsPayload = function buildAnalyticsPayload(actionSubject, action, eventType, sessionId) {
  var otherAttributes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var tags = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  return {
    action: action,
    actionSubject: actionSubject,
    eventType: eventType,
    attributes: _objectSpread({
      packageName: packageName,
      packageVersion: packageVersion,
      componentName: componentName,
      sessionId: sessionId
    }, otherAttributes),
    tags: tags
  };
};
var emptyQueryResponse = {
  queryLength: 0,
  spaceInQuery: false
};

var extractAttributesFromQuery = function extractAttributesFromQuery(query) {
  if (query) {
    return {
      queryLength: query.length,
      spaceInQuery: query.indexOf(' ') !== -1
    };
  }

  return emptyQueryResponse;
};

export var buildTypeAheadCancelPayload = function buildTypeAheadCancelPayload(duration, upKeyCount, downKeyCount, sessionId, query) {
  var _extractAttributesFro = extractAttributesFromQuery(query),
      queryLength = _extractAttributesFro.queryLength,
      spaceInQuery = _extractAttributesFro.spaceInQuery;

  return buildAnalyticsPayload('mentionTypeahead', 'cancelled', UI_EVENT_TYPE, sessionId, {
    duration: duration,
    downKeyCount: downKeyCount,
    upKeyCount: upKeyCount,
    queryLength: queryLength,
    spaceInQuery: spaceInQuery
  });
};

var getPosition = function getPosition(mentionList, selectedMention) {
  if (mentionList) {
    var index = mentionList.findIndex(function (mention) {
      return mention.id === selectedMention.id;
    });
    return index === -1 ? undefined : index;
  }

  return;
};

var isClicked = function isClicked(insertType) {
  return insertType === 'selected';
};

export var buildTypeAheadInviteItemViewedPayload = function buildTypeAheadInviteItemViewedPayload(sessionId, contextIdentifierProvider, userRole) {
  var _ref = contextIdentifierProvider || {},
      containerId = _ref.containerId,
      objectId = _ref.objectId,
      childObjectId = _ref.childObjectId;

  return buildAnalyticsPayload('inviteItem', 'rendered', UI_EVENT_TYPE, sessionId, {
    containerId: containerId,
    objectId: objectId,
    childObjectId: childObjectId,
    userRole: userRole
  });
};
export var buildTypeAheadInviteExposurePayload = function buildTypeAheadInviteExposurePayload(sessionId, contextIdentifierProvider, inviteExperimentCohort, userRole) {
  var _ref2 = contextIdentifierProvider || {},
      containerId = _ref2.containerId,
      objectId = _ref2.objectId,
      childObjectId = _ref2.childObjectId;

  return buildAnalyticsPayload('feature', 'exposed', OPERATIONAL_EVENT_TYPE, sessionId, {
    flagKey: 'confluence.frontend.invite.from.mention',
    value: inviteExperimentCohort || 'not-enrolled',
    containerId: containerId,
    objectId: objectId,
    childObjectId: childObjectId,
    userRole: userRole
  }, ['measurement', 'hasCustomAttributes']);
};
export var buildTypeAheadInviteItemClickedPayload = function buildTypeAheadInviteItemClickedPayload(duration, upKeyCount, downKeyCount, sessionId, insertType, query, contextIdentifierProvider, userRole) {
  var _extractAttributesFro2 = extractAttributesFromQuery(query),
      queryLength = _extractAttributesFro2.queryLength,
      spaceInQuery = _extractAttributesFro2.spaceInQuery;

  var _ref3 = contextIdentifierProvider || {},
      containerId = _ref3.containerId,
      objectId = _ref3.objectId,
      childObjectId = _ref3.childObjectId;

  return buildAnalyticsPayload('inviteItem', isClicked(insertType) ? 'clicked' : 'pressed', UI_EVENT_TYPE, sessionId, {
    duration: duration,
    queryLength: queryLength,
    spaceInQuery: spaceInQuery,
    upKeyCount: upKeyCount,
    downKeyCount: downKeyCount,
    containerId: containerId,
    objectId: objectId,
    childObjectId: childObjectId,
    userRole: userRole
  });
};
export var buildTypeAheadInsertedPayload = function buildTypeAheadInsertedPayload(duration, upKeyCount, downKeyCount, sessionId, insertType, mention, mentionList, query, contextIdentifierProvider) {
  var _extractAttributesFro3 = extractAttributesFromQuery(query),
      queryLength = _extractAttributesFro3.queryLength,
      spaceInQuery = _extractAttributesFro3.spaceInQuery;

  var analyticsPayload = buildAnalyticsPayload('mentionTypeahead', isClicked(insertType) ? 'clicked' : 'pressed', UI_EVENT_TYPE, sessionId, {
    duration: duration,
    position: getPosition(mentionList, mention),
    keyboardKey: isClicked(insertType) ? undefined : insertType,
    source: mention.source,
    queryLength: queryLength,
    spaceInQuery: spaceInQuery,
    isSpecial: isSpecialMention(mention),
    accessLevel: mention.accessLevel || '',
    userType: mention.userType,
    userId: mention.id,
    upKeyCount: upKeyCount,
    downKeyCount: downKeyCount,
    memberCount: isTeamType(mention.userType) && mention.context ? mention.context.memberCount : null,
    includesYou: isTeamType(mention.userType) && mention.context ? mention.context.includesYou : null
  });

  if (contextIdentifierProvider) {
    analyticsPayload.containerId = contextIdentifierProvider.containerId || undefined;
    analyticsPayload.objectId = contextIdentifierProvider.objectId || undefined;
    analyticsPayload.childObjectId = contextIdentifierProvider.childObjectId || undefined;
  }

  return analyticsPayload;
};
export var buildTypeAheadRenderedPayload = function buildTypeAheadRenderedPayload(duration, userIds, query, teams) {
  var _extractAttributesFro4 = extractAttributesFromQuery(query),
      queryLength = _extractAttributesFro4.queryLength,
      spaceInQuery = _extractAttributesFro4.spaceInQuery;

  var actionSubject = userIds ? 'mentionTypeahead' : 'teamMentionTypeahead';
  return {
    action: 'rendered',
    actionSubject: actionSubject,
    eventType: OPERATIONAL_EVENT_TYPE,
    attributes: {
      packageName: packageName,
      packageVersion: packageVersion,
      componentName: componentName,
      duration: duration,
      userIds: userIds,
      teams: teams,
      queryLength: queryLength,
      spaceInQuery: spaceInQuery
    }
  };
};