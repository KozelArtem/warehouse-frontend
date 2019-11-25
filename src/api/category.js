import { METHODS, request } from './axiosWrapper';

import {
  category,
  categoryList,
  categoryInfo,
} from './urls';

const getBaseCategories = async () => {
  try {
    const response = await request(METHODS.GET, category);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getShortCategoryList = async () => {
  try {
    const response = await request(METHODS.GET, categoryList);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getCategoryInfo = async (id) => {
  try {
    const response = await request(METHODS.GET, categoryInfo(id));

    return response.data || { items: [], categories: [] };
  } catch (err) {
    return { items: [], categories: [] };
  }
};


const createCategory = async (data) => {
  try {
    const response = await request(METHODS.POST, category, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateCategory = async (id, data) => {
  try {
    const response = await request(METHODS.PUT, categoryInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeCategory = async (id) => {
  try {
    const response = await request(METHODS.DELETE, categoryInfo(id));

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
