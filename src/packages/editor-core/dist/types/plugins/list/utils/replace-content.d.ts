import { ResolvedPos } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
declare type Params = {
    insertPosition: number;
    $target: ResolvedPos;
};
export declare const moveTargetIntoList: ({ insertPosition, $target, }: Params) => Step;
export {};
