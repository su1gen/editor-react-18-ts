export declare const MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;
export interface MainToolbarProps {
    showKeyline: boolean;
    twoLineEditorToolbar: boolean;
}
export declare const mainToolbarStyle: (showKeyline: boolean, twoLineEditorToolbar: boolean) => (false | import("@emotion/react").SerializedStyles)[];
export declare const mainToolbarIconBeforeStyle: import("@emotion/react").SerializedStyles;
export declare const mainToolbarFirstChildStyle: (twoLineEditorToolbar: boolean) => (false | import("@emotion/react").SerializedStyles)[];
export declare const mainToolbarSecondChildStyle: (twoLineEditorToolbar: boolean) => (false | import("@emotion/react").SerializedStyles)[];
export declare const nonCustomToolbarWrapperStyle: import("@emotion/react").SerializedStyles;
export declare const customToolbarWrapperStyle: import("@emotion/react").SerializedStyles;
