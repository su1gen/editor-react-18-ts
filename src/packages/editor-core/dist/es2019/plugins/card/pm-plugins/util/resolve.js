import { setProvider } from '../actions';
import { replaceQueuedUrlWithCard, handleFallbackWithAnalytics } from '../doc';
// ============================================================================ //
// ============================== PROVIDER UTILS ============================== //
// ============================================================================ //
// Used for all interactions with the EditorCardProvider.
// ============================================================================ //
export const resolveWithProvider = (view, outstandingRequests, provider, request, options) => {
  // When user manually changes appearance from blue link to smart link, we should respect that,
  let shouldForceAppearance = // This flag is set to true only in one place atm:
  // packages/editor/editor-core/src/plugins/card/pm-plugins/doc.ts @ convertHyperlinkToSmartCard
  // Which is used when user switching from URL to smart link appearance.
  !!request.shouldReplaceLink;
  const handleResolve = provider.resolve(request.url, request.appearance, shouldForceAppearance).then(resolvedCard => {
    delete outstandingRequests[request.url];
    return resolvedCard;
  }).then(handleResolved(view, request, options), handleRejected(view, request));
  outstandingRequests[request.url] = handleResolve;
  return handleResolve;
};

const updateCardType = (resolvedCard, options) => {
  if ((resolvedCard === null || resolvedCard === void 0 ? void 0 : resolvedCard.type) === 'blockCard' && !options.allowBlockCards || (resolvedCard === null || resolvedCard === void 0 ? void 0 : resolvedCard.type) === 'embedCard' && !options.allowEmbeds) {
    resolvedCard.type = 'inlineCard';
  }
};

const handleResolved = (view, request, options) => resolvedCard => {
  updateCardType(resolvedCard, options);
  replaceQueuedUrlWithCard(request.url, resolvedCard, request.analyticsAction)(view.state, view.dispatch);
  return resolvedCard;
};

const handleRejected = (view, request) => () => {
  handleFallbackWithAnalytics(request.url, request.source)(view.state, view.dispatch);
}; // listen for card provider changes


export const handleProvider = (_, provider, view) => {
  if (!provider) {
    return;
  }

  provider.then(cardProvider => {
    const {
      state,
      dispatch
    } = view;
    dispatch(setProvider(cardProvider)(state.tr));
  });
};