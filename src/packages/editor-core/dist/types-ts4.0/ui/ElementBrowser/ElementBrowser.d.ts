import { PureComponent } from 'react';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { Category, Modes } from './types';
import { EmptyStateHandler } from '../../types/empty-state-handler';
export interface Props {
    categories?: Category[];
    mode: keyof typeof Modes;
    getItems: (query?: string, category?: string) => QuickInsertItem[];
    onSelectItem?: (item: QuickInsertItem) => void;
    onInsertItem: (item: QuickInsertItem) => void;
    showSearch: boolean;
    showCategories: boolean;
    defaultCategory?: string;
    emptyStateHandler?: EmptyStateHandler;
}
export interface State {
    items: QuickInsertItem[];
    categories: Category[];
    selectedCategory?: string;
    searchTerm?: string;
}
export default class ElementBrowser extends PureComponent<Props, State> {
    static defaultProps: {
        defaultCategory: string;
        onInsertItem: () => void;
    };
    state: State;
    componentDidMount(): void;
    getCategories: (items?: QuickInsertItem[]) => Category[];
    filterCategories: (items: QuickInsertItem[], categories?: Category[]) => Category[];
    fetchItems: (query?: string | undefined, category?: string | undefined) => QuickInsertItem[];
    componentDidUpdate(prevProps: Props, prevState: State): void;
    handleSearch: (searchTerm: string) => void;
    handleCategorySelection: (clickedCategory: Category) => void;
    render(): JSX.Element;
}
