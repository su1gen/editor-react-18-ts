import { getStateContext } from './editor-state-context';
import { mapActionSubjectIdToAttributes } from './map-attributes';
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { ACTION } from '@atlaskit/editor-common/analytics';
var actionsToIgnore = [ACTION.INVOKED, ACTION.OPENED];
export var attachPayloadIntoTransaction = function attachPayloadIntoTransaction(_ref) {
  var payload = _ref.payload,
      editorState = _ref.editorState,
      tr = _ref.tr,
      channel = _ref.channel;
  payload = getStateContext(editorState, payload);
  payload = mapActionSubjectIdToAttributes(payload);
  var storedMarks = tr.storedMarks;
  tr.step(new AnalyticsStep([{
    payload: payload,
    channel: channel
  }], actionsToIgnore, tr.selection.$from.pos)); // When you add a new step all the storedMarks are removed it

  if (storedMarks) {
    tr.setStoredMarks(storedMarks);
  }
};