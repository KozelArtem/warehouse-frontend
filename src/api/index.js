import jwt from 'jsonwebtoken';

import config from '../config/config.json';

import { METHODS, request } from './axiosWrapper';

import category from './category';
import company from './company';
import item from './item';
import waybill from './waybill';

import {
  login as loginURL,

  distributionPlaces,

  placeServiceList,
  placeService,

  order,
  activeOrders,
  orderById,
  itemDistribution,
  itemDistributionInfo,
} from './urls';

const isLoggedIn = () => !!localStorage.getItem('token');
const isAdmin = () => {
  if (!isLoggedIn()) {
    return false;
  }

  const token = localStorage.getItem('token').split(' ')[1];
  const jwtData = jwt.verify(token, config.secretKey);

  return jwtData.role === config.adminRoleId;
};

const login = async (payload) => {
  try {
    const response = await request(METHODS.POST, loginURL, payload);
    const data = response.data || {};

    if (data.token) {
      localStorage.setItem('token', `Bearer ${data.token}`);
    }

    return true;
  } catch (err) {
    return false;
  }
};

const loadDistributionPlaces = async (query) => {
  try {
    const queryString = Object.keys(query)
      .reduce((acc, key) => `${acc}&${key}=${query[key]}`, '');

    const url = `${distributionPlaces}?${queryString}`;

    const response = await request(METHODS.GET, url);
    const count = response.headers['x-total-count'];

    return { data: response.data || [], count };
  } catch (err) {
    return {};
  }
};

const createDistributionPlace = async (data) => {
  try {
    const response = await request(METHODS.POST, distributionPlaces, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const createItemDistribution = async (itemId, data) => {
  try {
    const response = await request(METHODS.POST, itemDistribution(itemId), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateItemDistribution = async (itemId, id, data) => {
  try {
    const response = await request(METHODS.PUT, itemDistributionInfo(itemId, id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const getItemDistributionInfo = async (itemId, distId) => {
  try {
    const response = await request(METHODS.GET, itemDistributionInfo(itemId, distId));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const loadPlaceServices = async (distId, completed = false) => {
  try {
    const url = `${placeServiceList(distId)}?completed=${completed}`;
    const response = await request(METHODS.GET, url);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const createPlaceService = async (distId, data) => {
  try {
    const response = await request(METHODS.POST, placeServiceList(distId), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updatePlaceService = async (distId, id, data) => {
  try {
    const response = await request(METHODS.PUT, placeService(distId, id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removePlaceService = async (distId, id) => {
  try {
    const response = await request(METHODS.DELETE, placeService(distId, id));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const getOrders = async (query) => {
  try {
    const queryString = Object.keys(query)
      .reduce((acc, key) => `${acc}&${key}=${query[key]}`, '');

    const url = `${order}?${queryString}`;

    const response = await request(METHODS.GET, url);
    const count = response.headers['x-total-count'];

    return { data: response.data || [], count };
  } catch (err) {
    return {};
  }
};

const getActiveOrders = async () => {
  try {
    const response = await request(METHODS.GET, activeOrders);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const getOrdersByIds = async (strIds) => {
  try {
    const url = `${order}?ids=${strIds}`;
    const response = await request(METHODS.GET, url);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const createOrder = async (data) => {
  try {
    const response = await request(METHODS.POST, order, data);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const updateOrder = async (id, data) => {
  try {
    const response = await request(METHODS.PUT, orderById(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeOrder = async (id) => {
  try {
    await request(METHODS.DELETE, orderById(id));

    return true;
  } catch (err) {
    return false;
  }
};


export default {
  isLoggedIn,
  isAdmin,
  login,

  ...category,
  ...company,
  ...item,
  ...waybill,

  createItemDistribution,
  updateItemDistribution,
  getItemDistributionInfo,

  loadDistributionPlaces,
  createDistributionPlace,

  loadPlaceServices,
  createPlaceService,
  updatePlaceService,
  removePlaceService,

  getOrders,
  getActiveOrders,
  getOrdersByIds,
  createOrder,
  updateOrder,
  removeOrder,
};
