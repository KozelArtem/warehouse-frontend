import httpClient from './httpClient';

import {
  itemInfo,
  itemList,
  item,
  itemSearch,
  itemShortInfo,
} from './urls';


const getItemList = async () => {
  try {
    const response = await httpClient.get(itemList);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getItemShortInfo = async (id) => {
  try {
    const response = await httpClient.get(itemShortInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const getItemInfo = async (id) => {
  try {
    const response = await httpClient.get(itemInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const searchItems = async (search) => {
  try {
    const response = await httpClient.get(itemSearch(search));

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const createItem = async (data) => {
  try {
    const response = await httpClient.post(item, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateItem = async (id, data) => {
  try {
    const response = await httpClient.put(itemInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeItem = async (id) => {
  try {
    await httpClient.delete(itemInfo(id));

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
