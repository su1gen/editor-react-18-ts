/**
 * Use this to register macro link positions during a paste operation, that you
 * want to track in a document over time, through any document changes.
 *
 * @param positions a map of string keys (custom position references) and position values e.g. { ['my-key-1']: 11 }
 *
 * **Context**: This is neccessary if there is an async process or an unknown period of time
 * between obtaining an original position, and wanting to know about what its final eventual
 * value. In that scenario, positions will need to be actively tracked and mapped in plugin
 * state so that they can be mapped through any other independent document change transactions being
 * dispatched to the editor that could affect their value.
 */
export declare const startTrackingPastedMacroPositions: (pastedMacroPositions: {
    [key: string]: number;
}) => import("@atlaskit/editor-common/types").Command;
export declare const stopTrackingPastedMacroPositions: (pastedMacroPositionKeys: string[]) => import("@atlaskit/editor-common/types").Command;
