import { METHODS, request } from './axiosWrapper';

import {
  itemInfo,
  itemList,
  item,
  itemSearch,
  itemShortInfo,
} from './urls';


const getItemList = async () => {
  try {
    const response = await request(METHODS.GET, itemList);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getItemShortInfo = async (id) => {
  try {
    const response = await request(METHODS.GET, itemShortInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
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

const searchItems = async (search) => {
  try {
    const response = await request(METHODS.GET, itemSearch(search));

    return response.data || [];
  } catch (err) {
    return [];
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

const updateItem = async (id, data) => {
  try {
    const response = await request(METHODS.PUT, itemInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeItem = async (id) => {
  try {
    await request(METHODS.DELETE, itemInfo(id));

    return true;
  } catch (err) {
    return false;
  }
};

export default {
  getItemList,
  getItemShortInfo,
  getItemInfo,
  createItem,
  updateItem,
  removeItem,
  searchItems,
};
