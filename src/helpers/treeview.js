const createCategoryKey = id => `cat_${id}`;
const getIdFromKey = key => key.split('_')[1];

const createItemKey = id => `item_${id}`;

const mapCategories = categories => categories.map(category => ({
  ...category,
  fetch: false,
  id: createCategoryKey(category.id),
  children: [],
}));

const findItem = (base, id) => {
  if (base.id === id) {
    return base;
  }

  if (base.children) {
    for (let i = 0; i < base.children.length; i += 1) {
      const element = findItem(base.children[i], id);

      if (element) {
        return element;
      }
    }
  }

  return null;
};

const findItemInTree = (items, id) => items
  .map(item => findItem(item, id))
  .filter(item => item)[0];

export {
  createCategoryKey, createItemKey, getIdFromKey, mapCategories, findItemInTree,
};
