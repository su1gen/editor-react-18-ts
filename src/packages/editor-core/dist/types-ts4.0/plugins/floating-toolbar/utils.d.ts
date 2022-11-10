import { Node } from 'prosemirror-model';
export declare const shallowEqual: (objA?: Object | undefined, objB?: Object | undefined) => boolean;
export declare const compareArrays: <T>(left: T[], right: T[], compareFn?: (left: T, right: T) => boolean) => boolean;
export declare function findNode(parent: Node, predicate: (node: Node) => boolean): Node | undefined;
export declare function getFirstFocusableElement(rootNode: HTMLElement | null): HTMLElement | undefined;
export declare function getFocusableElements(rootNode: HTMLElement | null): NodeListOf<HTMLElement> | undefined;
export declare function getLastFocusableElement(rootNode: HTMLElement | null): HTMLElement | undefined;
