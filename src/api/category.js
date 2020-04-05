import httpClient from './httpClient';

import {
  category,
  categoryList,
  categoryInfo,
} from './urls';

const getBaseCategories = async () => {
  try {
    const response = await httpClient.get(category);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getShortCategoryList = async () => {
  try {
    const response = await httpClient.get(categoryList);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getCategoryInfo = async (id) => {
  try {
    const response = await httpClient.get(categoryInfo(id));

    return response.data || { items: [], categories: [] };
  } catch (err) {
    return { items: [], categories: [] };
  }
};


const createCategory = async (data) => {
  try {
    const response = await httpClient.post(category, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateCategory = async (id, data) => {
  try {
    const response = await httpClient.put(categoryInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeCategory = async (id) => {
  try {
    const response = await httpClient.delete(categoryInfo(id));

    return response.data || false;
  } catch (err) {
    return false;
  }
};


export default {
  getBaseCategories,
  getShortCategoryList,
  getCategoryInfo,

  createCategory,
  updateCategory,
  removeCategory,
};
