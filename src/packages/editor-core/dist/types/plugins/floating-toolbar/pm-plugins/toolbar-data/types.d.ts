export declare type FloatingToolbarPluginData = {
    confirmDialogForItem?: number;
};
export declare type FloatingToolbarPluginAction = {
    type: 'SHOW_CONFIRM_DIALOG';
    data: {
        buttonIndex: number;
    };
} | {
    type: 'HIDE_CONFIRM_DIALOG';
};
