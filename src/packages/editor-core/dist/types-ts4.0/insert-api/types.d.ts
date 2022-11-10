import type { Node as PMNode, Schema } from 'prosemirror-model';
import type { AnalyticsEventPayload } from '../plugins/analytics/types/events';
export declare type InsertNodeConfig = {
    node: 'table';
    options: {
        selectNodeInserted: boolean;
        analyticsPayload?: AnalyticsEventPayload;
    };
};
export declare type InsertNodeAPI = {
    insert: (props: InsertNodeConfig) => boolean;
};
export declare type CreateNodeHandler = ({ nodeName, schema, }: {
    nodeName: string;
    schema: Schema;
}) => PMNode;
