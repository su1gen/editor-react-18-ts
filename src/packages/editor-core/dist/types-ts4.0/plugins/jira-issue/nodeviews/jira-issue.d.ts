/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Node as PMNode } from 'prosemirror-model';
export interface Props {
    node: PMNode;
}
export default function JIRAIssueNode(props: Props): jsx.JSX.Element;
