import { INPUT_METHOD } from '../analytics/types/enums';
export let InputSource;

(function (InputSource) {
  InputSource[InputSource["TOOLBAR"] = INPUT_METHOD.TOOLBAR] = "TOOLBAR";
  InputSource[InputSource["KEYBOARD"] = INPUT_METHOD.KEYBOARD] = "KEYBOARD";
})(InputSource || (InputSource = {}));