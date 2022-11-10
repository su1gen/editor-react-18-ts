import { getSendableSelection } from '../actions';
import { pluginKey } from '../plugin-key';
export const sendTransaction = ({
  originalTransaction,
  transactions,
  oldEditorState,
  newEditorState,
  useNativePlugin
}) => provider => {
  const docChangedTransaction = transactions.find(tr => tr.docChanged);
  const currentPluginState = pluginKey.getState(newEditorState);

  if (!currentPluginState.isReady) {
    return;
  }

  const shouldSendStepForSynchronyCollabProvider = !originalTransaction.getMeta('isRemote') && // TODO: ED-8995
  // We need to do this check to reduce the number of race conditions when working with tables.
  // This metadata is coming from the scaleTable command in table-resizing plugin
  !originalTransaction.getMeta('scaleTable') && docChangedTransaction;

  if (useNativePlugin || shouldSendStepForSynchronyCollabProvider) {
    provider.send(docChangedTransaction, oldEditorState, newEditorState);
  }

  const prevPluginState = pluginKey.getState(oldEditorState);
  const {
    activeParticipants: prevActiveParticipants
  } = prevPluginState;
  const {
    activeParticipants,
    sessionId
  } = currentPluginState;
  const selectionChanged = !oldEditorState.selection.eq(newEditorState.selection);
  const participantsChanged = !prevActiveParticipants.eq(activeParticipants);

  if (sessionId && selectionChanged && !docChangedTransaction || sessionId && participantsChanged) {
    const selection = getSendableSelection(newEditorState.selection);
    const message = {
      type: 'telepointer',
      selection,
      sessionId
    };
    provider.sendMessage(message);
  }
};