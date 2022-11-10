import { PluginKey } from 'prosemirror-state';
export declare type NamedPluginKeys = Readonly<{
    [stateName: string]: PluginKey;
}>;
export declare type NamedPluginStates<P extends NamedPluginKeys> = Readonly<Partial<{
    [K in keyof P]: P[K] extends PluginKey<infer T> ? T : never;
}>>;
export declare type Writeable<T> = {
    -readonly [P in keyof T]: T[P];
};
