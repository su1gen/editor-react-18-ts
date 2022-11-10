import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import uuid from 'uuid';
import { Fragment } from 'prosemirror-model';
import { isResolvingMentionProvider } from '@atlaskit/mention/resource';
import { MENTION_ITEM_HEIGHT, MentionItem } from '@atlaskit/mention/item';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { TeamMentionHighlight, TeamMentionHighlightController } from '@atlaskit/mention/spotlight';
import { buildTypeAheadCancelPayload, buildTypeAheadInsertedPayload, buildTypeAheadInviteExposurePayload, buildTypeAheadInviteItemClickedPayload, buildTypeAheadInviteItemViewedPayload, buildTypeAheadRenderedPayload } from '../analytics';
import InviteItem, { INVITE_ITEM_DESCRIPTION } from '../ui/InviteItem';
import { isInviteItem, isTeamType, isTeamStats, shouldKeepInviteItem } from '../utils';
import { getMentionPluginState } from '../pm-plugins/utils';

var createInviteItem = function createInviteItem(_ref) {
  var mentionProvider = _ref.mentionProvider,
      onInviteItemMount = _ref.onInviteItemMount;
  return {
    title: INVITE_ITEM_DESCRIPTION.id,
    render: function render(_ref2) {
      var isSelected = _ref2.isSelected,
          onClick = _ref2.onClick,
          onHover = _ref2.onHover;
      return /*#__PURE__*/React.createElement(InviteItem, {
        productName: mentionProvider ? mentionProvider.productName : undefined,
        selected: isSelected,
        onMount: onInviteItemMount,
        onMouseEnter: onHover,
        onSelection: onClick,
        userRole: mentionProvider.userRole
      });
    },
    mention: INVITE_ITEM_DESCRIPTION
  };
};

var withInviteItem = function withInviteItem(_ref3) {
  var mentionProvider = _ref3.mentionProvider,
      firstQueryWithoutResults = _ref3.firstQueryWithoutResults,
      currentQuery = _ref3.currentQuery,
      onInviteItemMount = _ref3.onInviteItemMount;
  return function (mentionItems) {
    var inviteItem = createInviteItem({
      mentionProvider: mentionProvider,
      onInviteItemMount: onInviteItemMount
    });
    var keepInviteItem = shouldKeepInviteItem(currentQuery, firstQueryWithoutResults);

    if (mentionItems.length === 0) {
      return keepInviteItem ? [inviteItem] : [];
    }

    return [].concat(_toConsumableArray(mentionItems), [// invite item should be shown at the bottom
    inviteItem]);
  };
};

export var mentionToTypeaheadItem = function mentionToTypeaheadItem(mention) {
  return {
    title: mention.id,
    render: function render(_ref4) {
      var isSelected = _ref4.isSelected,
          onClick = _ref4.onClick,
          onHover = _ref4.onHover;
      return /*#__PURE__*/React.createElement(MentionItem, {
        mention: mention,
        selected: isSelected,
        onMouseEnter: onHover,
        onSelection: onClick
      });
    },
    getCustomComponentHeight: function getCustomComponentHeight() {
      return MENTION_ITEM_HEIGHT;
    },
    mention: mention
  };
};
export function memoize(fn) {
  // Cache results here
  var seen = new Map();

  function memoized(mention) {
    // Check cache for hits
    var hit = seen.get(mention.id);

    if (hit) {
      return hit;
    } // Generate new result and cache it


    var result = fn(mention);
    seen.set(mention.id, result);
    return result;
  }

  return {
    call: memoized,
    clear: seen.clear.bind(seen)
  };
}
var memoizedToItem = memoize(mentionToTypeaheadItem);

var buildAndSendElementsTypeAheadAnalytics = function buildAndSendElementsTypeAheadAnalytics(fireEvent) {
  return function (_ref5) {
    var query = _ref5.query,
        mentions = _ref5.mentions,
        stats = _ref5.stats;
    var duration = 0;
    var userOrTeamIds = null;
    var teams = null;

    if (!isTeamStats(stats)) {
      // is from primary mention endpoint which could be just user mentions or user/team mentions
      duration = stats && stats.duration;
      teams = null;
      userOrTeamIds = mentions.map(function (mention) {
        return mention.id;
      });
    } else {
      // is from dedicated team-only mention endpoint
      duration = stats && stats.teamMentionDuration;
      userOrTeamIds = null;
      teams = mentions.map(function (mention) {
        return isTeamType(mention.userType) ? {
          teamId: mention.id,
          includesYou: mention.context.includesYou,
          memberCount: mention.context.memberCount
        } : null;
      }).filter(function (m) {
        return !!m;
      });
    }

    var payload = buildTypeAheadRenderedPayload(duration, userOrTeamIds, query, teams);
    fireEvent(payload);
  };
};

var isTeamMentionProvider = function isTeamMentionProvider(p) {
  return !!(p.mentionTypeaheadHighlightEnabled && p.mentionTypeaheadCreateTeamPath);
};
/**
 * When a team mention is selected, we render a team link and list of member/user mentions
 * in editor content
 */


var buildNodesForTeamMention = function buildNodesForTeamMention(schema, selectedMention, mentionProvider, sanitizePrivateContent) {
  var nodes = schema.nodes,
      marks = schema.marks;
  var name = selectedMention.name,
      teamId = selectedMention.id,
      accessLevel = selectedMention.accessLevel,
      context = selectedMention.context; // build team link

  var defaultTeamLink = "".concat(window.location.origin, "/people/team/").concat(teamId);
  var teamLink = context && context.teamLink ? context.teamLink : defaultTeamLink;
  var teamLinkNode = schema.text(name, [marks.link.create({
    href: teamLink
  })]);
  var openBracketText = schema.text('(');
  var closeBracketText = schema.text(')');
  var emptySpaceText = schema.text(' ');
  var inlineNodes = [teamLinkNode, emptySpaceText, openBracketText];
  var members = context && context.members ? context.members : [];
  members.forEach(function (member, index) {
    var name = member.name,
        id = member.id;
    var mentionName = "@".concat(name);
    var text = sanitizePrivateContent ? '' : mentionName;

    if (sanitizePrivateContent && isResolvingMentionProvider(mentionProvider)) {
      mentionProvider.cacheMentionName(id, name);
    }

    var userMentionNode = nodes.mention.createChecked({
      text: text,
      id: member.id,
      accessLevel: accessLevel,
      userType: 'DEFAULT'
    });
    inlineNodes.push(userMentionNode); // should not add empty space after the last user mention.

    if (index !== members.length - 1) {
      inlineNodes.push(emptySpaceText);
    }
  });
  inlineNodes.push(closeBracketText);
  return Fragment.fromArray(inlineNodes);
};

export var createTypeAheadConfig = function createTypeAheadConfig(_ref6) {
  var sanitizePrivateContent = _ref6.sanitizePrivateContent,
      mentionInsertDisplayName = _ref6.mentionInsertDisplayName,
      fireEvent = _ref6.fireEvent,
      HighlightComponent = _ref6.HighlightComponent;
  var sessionId = uuid();
  var firstQueryWithoutResults = null;
  var subscriptionKeys = new Set();
  var typeAhead = {
    id: TypeAheadAvailableNodes.MENTION,
    trigger: '@',
    // Custom regex must have a capture group around trigger
    // so it's possible to use it without needing to scan through all triggers again
    customRegex: '\\(?(@)',
    getHighlight: function getHighlight(state) {
      var CustomHighlightComponent = HighlightComponent;

      if (CustomHighlightComponent) {
        return /*#__PURE__*/React.createElement(CustomHighlightComponent, null);
      }

      var pluginState = getMentionPluginState(state);
      var provider = pluginState.mentionProvider;

      if (provider) {
        var teamMentionProvider = provider;

        if (isTeamMentionProvider(teamMentionProvider) && teamMentionProvider.mentionTypeaheadHighlightEnabled()) {
          return /*#__PURE__*/React.createElement(TeamMentionHighlight, {
            createTeamLink: teamMentionProvider.mentionTypeaheadCreateTeamPath(),
            onClose: function onClose() {
              return TeamMentionHighlightController.registerClosed();
            }
          });
        }
      }

      return null;
    },
    getItems: function getItems(_ref7) {
      var query = _ref7.query,
          editorState = _ref7.editorState;
      var pluginState = getMentionPluginState(editorState);

      if (!(pluginState !== null && pluginState !== void 0 && pluginState.mentionProvider)) {
        return Promise.resolve([]);
      }

      var mentionProvider = pluginState.mentionProvider,
          contextIdentifierProvider = pluginState.contextIdentifierProvider;
      return new Promise(function (resolve) {
        var key = "loadingMentionsForTypeAhead_".concat(uuid());

        var mentionsSubscribeCallback = function mentionsSubscribeCallback(mentions) {
          var resultQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
          var stats = arguments.length > 2 ? arguments[2] : undefined;

          if (query !== resultQuery) {
            return;
          }

          mentionProvider.unsubscribe(key);
          subscriptionKeys.delete(key);
          var mentionItems = mentions.map(function (mention) {
            return memoizedToItem.call(mention);
          });
          buildAndSendElementsTypeAheadAnalytics(fireEvent)({
            query: query,
            mentions: mentions,
            stats: stats
          });

          if (mentions.length === 0 && firstQueryWithoutResults === null) {
            firstQueryWithoutResults = query;
          } // Growth (El-dorado) experiment design hard requirement


          if (mentionItems.length <= 2) {
            var inviteExperimentCohort = mentionProvider.inviteExperimentCohort,
                userRole = mentionProvider.userRole;
            fireEvent(buildTypeAheadInviteExposurePayload(sessionId, contextIdentifierProvider, inviteExperimentCohort, userRole));
          }

          if (!mentionProvider.shouldEnableInvite || mentionItems.length > 2) {
            resolve(mentionItems);
          } else {
            var items = withInviteItem({
              mentionProvider: mentionProvider,
              firstQueryWithoutResults: firstQueryWithoutResults || '',
              currentQuery: query,
              onInviteItemMount: function onInviteItemMount() {
                fireEvent(buildTypeAheadInviteItemViewedPayload(sessionId, contextIdentifierProvider, mentionProvider.userRole));
              }
            })(mentionItems);
            resolve(items);
          }
        };

        subscriptionKeys.add(key);
        mentionProvider.subscribe(key, mentionsSubscribeCallback);
        mentionProvider.filter(query || '', _objectSpread(_objectSpread({}, contextIdentifierProvider), {}, {
          sessionId: sessionId
        }));
      });
    },
    onOpen: function onOpen() {
      firstQueryWithoutResults = null;
    },
    selectItem: function selectItem(state, item, insert, _ref8) {
      var mode = _ref8.mode,
          stats = _ref8.stats,
          query = _ref8.query,
          sourceListItem = _ref8.sourceListItem;
      var schema = state.schema;
      var pluginState = getMentionPluginState(state);
      var mentionProvider = pluginState.mentionProvider;
      var _item$mention = item.mention,
          id = _item$mention.id,
          name = _item$mention.name,
          nickname = _item$mention.nickname,
          accessLevel = _item$mention.accessLevel,
          userType = _item$mention.userType;
      var trimmedNickname = nickname && nickname.startsWith('@') ? nickname.slice(1) : nickname;
      var renderName = mentionInsertDisplayName || !trimmedNickname ? name : trimmedNickname;

      var mentionContext = _objectSpread(_objectSpread({}, pluginState.contextIdentifierProvider), {}, {
        sessionId: sessionId
      });

      if (mentionProvider && !isInviteItem(item.mention)) {
        mentionProvider.recordMentionSelection(item.mention, mentionContext);
      }

      var pickerElapsedTime = stats.startedAt ? Date.now() - stats.startedAt : 0;

      if (mentionProvider && mentionProvider.shouldEnableInvite && isInviteItem(item.mention)) {
        // Don't fire event and the callback with selection by space press
        if (mode !== 'space') {
          fireEvent(buildTypeAheadInviteItemClickedPayload(pickerElapsedTime, stats.keyCount.arrowUp, stats.keyCount.arrowDown, sessionId, mode, query, pluginState.contextIdentifierProvider, mentionProvider.userRole));

          if (mentionProvider.onInviteItemClick) {
            mentionProvider.onInviteItemClick('mention');
          }
        }

        return state.tr;
      }

      fireEvent(buildTypeAheadInsertedPayload(pickerElapsedTime, stats.keyCount.arrowUp, stats.keyCount.arrowDown, sessionId, mode, item.mention, sourceListItem.map(function (x) {
        return x.mention;
      }), query, pluginState.contextIdentifierProvider));
      sessionId = uuid();

      if (mentionProvider && isTeamType(userType)) {
        TeamMentionHighlightController.registerTeamMention();
        return insert(buildNodesForTeamMention(schema, item.mention, mentionProvider, sanitizePrivateContent));
      } // Don't insert into document if document data is sanitized.


      var text = sanitizePrivateContent ? '' : "@".concat(renderName);

      if (sanitizePrivateContent && isResolvingMentionProvider(mentionProvider)) {
        // Cache (locally) for later rendering
        mentionProvider.cacheMentionName(id, renderName);
      }

      var mentionNode = schema.nodes.mention.createChecked({
        text: text,
        id: id,
        accessLevel: accessLevel,
        userType: userType === 'DEFAULT' ? null : userType
      });
      var space = schema.text(' ');
      return insert(Fragment.from([mentionNode, space]));
    },
    dismiss: function dismiss(_ref9) {
      var editorState = _ref9.editorState,
          query = _ref9.query,
          stats = _ref9.stats,
          wasItemInserted = _ref9.wasItemInserted;
      firstQueryWithoutResults = null;
      var pickerElapsedTime = stats.startedAt ? Date.now() - stats.startedAt : 0;

      if (!wasItemInserted) {
        fireEvent(buildTypeAheadCancelPayload(pickerElapsedTime, stats.keyCount.arrowUp, stats.keyCount.arrowDown, sessionId, query || ''));
      }

      var pluginState = getMentionPluginState(editorState);

      if (pluginState !== null && pluginState !== void 0 && pluginState.mentionProvider) {
        var mentionProvider = pluginState.mentionProvider;

        var _iterator = _createForOfIteratorHelper(subscriptionKeys),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var key = _step.value;
            mentionProvider.unsubscribe(key);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      subscriptionKeys.clear();
      sessionId = uuid();
    }
  };
  return typeAhead;
};