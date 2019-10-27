import { METHODS, request } from './axiosWrapper';

import {
  category, categoryInfo, itemInfo, item,
} from './urls';

const getBaseCategories = async () => {
  try {
    const response = await request(METHODS.GET, category);

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

const getItemInfo = async (id) => {
  try {
    const response = await request(METHODS.GET, itemInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
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

const createItem = async (data) => {
  try {
    const response = await request(METHODS.POST, item, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

export default {
  getBaseCategories,
  getCategoryInfo,
  createCategory,
  updateCategory,
  removeCategory,

  getItemInfo,
  createItem,
};
