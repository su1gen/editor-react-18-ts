/**
 * This plugin ensures that certain nodes (such as tables, and various extension ones)
 * have a unique `localId` attribute value for `fragment` marks.
 * It also ensures the preservation of these IDs when nodes are being cut-and-pasted
 * around the document.
 *
 * The implementation has been _heavily_ borrowed from
 * - packages/editor/editor-core/src/plugins/table/pm-plugins/table-local-id.ts
 */
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Dispatch } from '../../../event-dispatcher';
/**
 * Ensures presence of `fragment` mark on certain node types and the uniqueness of their `localId` attributes
 */
export declare const createPlugin: (dispatch: Dispatch) => SafePlugin<any, any>;
