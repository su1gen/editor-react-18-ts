export declare const iconOnlySpacing: {
    '&&': {
        padding: string;
        /**
          Increased specificity here because css for .hyperlink-open-link defined in
          packages/editor/editor-core/src/ui/ContentStyles/index.tsx file
          overrides padding left-right 2px with 4px.
        */
        '&&[href]': {
            padding: string;
        };
    };
    '& > span': {
        margin: string;
    };
};
export declare const getButtonStyles: (props: any) => {
    background: any;
    color: any;
};
