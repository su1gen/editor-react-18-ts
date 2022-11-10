export declare type FormResult = {
    [key: string]: string | number | string[] | number[] | undefined;
};
export declare enum ValidationError {
    Required = "required",
    Invalid = "invalid"
}
export declare enum FieldTypeError {
    isMultipleAndRadio = "isMultipleAndRadio"
}
export declare type Entry<T> = [string, T];
export declare type OnFieldChange = (name: string, isDirty: boolean) => void;
export interface ValidationErrors {
    [key: string]: any;
}
