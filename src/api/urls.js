const baseURL = 'http://localhost:3000';

const login = '/login';

const category = '/category';
const categoryList = `${category}/list`;
const categoryInfo = id => `${category}/${id}`;

const company = '/company';
const companyList = `${company}/list`;
const companyListItems = `${companyList}/items`;
const companyInfo = id => `${company}/${id}`;

const item = '/item';
const itemList = '/item/list';
const itemInfo = id => `${item}/${id}`;
const itemShortInfo = id => `${itemInfo(id)}/short`;
const itemSearch = search => `${item}/search/?search=${search}`;

const itemDistribution = itemId => `/item/${itemId}/distribution`;
const itemDistributionInfo = (itemId, distId) => `${itemDistribution(itemId)}/${distId}`;
const distributionPlaces = '/distribution/places';

const placeServiceList = distId => `${distributionPlaces}/${distId}/service`;
const placeService = (distId, id) => `${placeServiceList(distId)}/${id}`;

const order = '/order';
const orderById = id => `/order/${id}`;

const waybill = '/waybill';
const waybillInfo = id => `${waybill}/${id}`;


export {
  baseURL,

  login,

  category,
  categoryList,
  companyListItems,
  categoryInfo,

  company,
  companyList,
  companyInfo,

  item,
  itemList,
  itemInfo,
  itemShortInfo,
  itemSearch,

  itemDistribution,
  itemDistributionInfo,
  distributionPlaces,

  placeServiceList,
  placeService,

  order,
  orderById,

  waybill,
  waybillInfo,
};
