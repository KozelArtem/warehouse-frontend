const baseURL = 'http://localhost:3000';

const category = '/category';
const categoryList = `${category}/list`;
const categoryInfo = id => `${category}/${id}`;

const item = '/item';
const itemInfo = id => `${item}/${id}`;

const itemDistribution = itemId => `${itemInfo(itemId)}/distributions`;
const itemDistributionInfo = (itemId, distribId) => `${itemDistribution(itemId)}/${distribId}`;

export {
  baseURL,
  category,
  categoryList,
  categoryInfo,
  item,
  itemInfo,
  itemDistribution,
  itemDistributionInfo,
};
