import { setProvider } from '../actions';
import { replaceQueuedUrlWithCard, handleFallbackWithAnalytics } from '../doc';
// ============================================================================ //
// ============================== PROVIDER UTILS ============================== //
// ============================================================================ //
// Used for all interactions with the EditorCardProvider.
// ============================================================================ //
export var resolveWithProvider = function resolveWithProvider(view, outstandingRequests, provider, request, options) {
  // When user manually changes appearance from blue link to smart link, we should respect that,
  var shouldForceAppearance = // This flag is set to true only in one place atm:
  // packages/editor/editor-core/src/plugins/card/pm-plugins/doc.ts @ convertHyperlinkToSmartCard
  // Which is used when user switching from URL to smart link appearance.
  !!request.shouldReplaceLink;
  var handleResolve = provider.resolve(request.url, request.appearance, shouldForceAppearance).then(function (resolvedCard) {
    delete outstandingRequests[request.url];
    return resolvedCard;
  }).then(handleResolved(view, request, options), handleRejected(view, request));
  outstandingRequests[request.url] = handleResolve;
  return handleResolve;
};

var updateCardType = function updateCardType(resolvedCard, options) {
  if ((resolvedCard === null || resolvedCard === void 0 ? void 0 : resolvedCard.type) === 'blockCard' && !options.allowBlockCards || (resolvedCard === null || resolvedCard === void 0 ? void 0 : resolvedCard.type) === 'embedCard' && !options.allowEmbeds) {
    resolvedCard.type = 'inlineCard';
  }
};

var handleResolved = function handleResolved(view, request, options) {
  return function (resolvedCard) {
    updateCardType(resolvedCard, options);
    replaceQueuedUrlWithCard(request.url, resolvedCard, request.analyticsAction)(view.state, view.dispatch);
    return resolvedCard;
  };
};

var handleRejected = function handleRejected(view, request) {
  return function () {
    handleFallbackWithAnalytics(request.url, request.source)(view.state, view.dispatch);
  };
}; // listen for card provider changes


export var handleProvider = function handleProvider(_, provider, view) {
  if (!provider) {
    return;
  }

  provider.then(function (cardProvider) {
    var state = view.state,
        dispatch = view.dispatch;
    dispatch(setProvider(cardProvider)(state.tr));
  });
};