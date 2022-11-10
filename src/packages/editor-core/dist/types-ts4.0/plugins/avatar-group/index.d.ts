import { EditorPlugin } from '../../types';
import { CollabEditOptions } from '../collab-edit';
declare const avatarGroup: (props: {
    collabEdit?: CollabEditOptions;
    takeFullWidth: boolean;
}) => EditorPlugin;
export default avatarGroup;
