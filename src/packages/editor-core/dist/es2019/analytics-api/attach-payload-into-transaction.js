import { getStateContext } from './editor-state-context';
import { mapActionSubjectIdToAttributes } from './map-attributes';
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { ACTION } from '@atlaskit/editor-common/analytics';
const actionsToIgnore = [ACTION.INVOKED, ACTION.OPENED];
export const attachPayloadIntoTransaction = ({
  payload,
  editorState,
  tr,
  channel
}) => {
  payload = getStateContext(editorState, payload);
  payload = mapActionSubjectIdToAttributes(payload);
  const {
    storedMarks
  } = tr;
  tr.step(new AnalyticsStep([{
    payload,
    channel
  }], actionsToIgnore, tr.selection.$from.pos)); // When you add a new step all the storedMarks are removed it

  if (storedMarks) {
    tr.setStoredMarks(storedMarks);
  }
};