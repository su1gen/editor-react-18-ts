import Fuse from 'fuse.js';
import { dedupe } from '../../utils';
const options = {
  threshold: 0.3,
  keys: [{
    name: 'title',
    weight: 0.57
  }, {
    name: 'priority',
    weight: 0.3
  }, {
    name: 'keywords',
    weight: 0.08
  }, {
    name: 'description',
    weight: 0.04
  }, {
    name: 'keyshortcut',
    weight: 0.01
  }]
};
export function find(query, items) {
  const fuse = new Fuse(items, options);

  if (query === '') {
    // Copy and sort list by priority
    return items.slice(0).sort((a, b) => (a.priority || Number.POSITIVE_INFINITY) - (b.priority || Number.POSITIVE_INFINITY));
  }

  return fuse.search(query).map(result => result.item);
}
export const searchQuickInsertItems = (quickInsertState, options) => (query, category) => {
  const defaultItems = options && options.disableDefaultItems ? [] : quickInsertState.lazyDefaultItems();
  const providedItems = quickInsertState.providedItems;
  const items = providedItems ? dedupe([...defaultItems, ...providedItems], item => item.title) : defaultItems;
  return find(query || '', category === 'all' || !category ? items : items.filter(item => item.categories && item.categories.includes(category)));
};
export const getFeaturedQuickInsertItems = ({
  providedItems,
  lazyDefaultItems
}, options) => () => {
  const defaultItems = options && options.disableDefaultItems ? [] : lazyDefaultItems();
  const items = providedItems ? dedupe([...defaultItems, ...providedItems], item => item.title) : defaultItems;
  return items.filter(item => item.featured);
};