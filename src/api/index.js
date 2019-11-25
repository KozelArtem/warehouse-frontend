import jwt from 'jsonwebtoken';

import config from '../config/config.json';

import { METHODS, request } from './axiosWrapper';

import category from './category';
import company from './company';
import item from './item';

import {
  login as loginURL,

  distributionPlaces,

  placeServiceList,
  placeService,

  order,
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

const loadDistributionPlaces = async () => {
  try {
    const response = await request(METHODS.GET, distributionPlaces);

    return response.data || {};
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

const getOrders = async () => {
  try {
    const response = await request(METHODS.GET, order);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const getOrdersByIds = async (strIds) => {
  try {
    const url = `${order}?ids=${strIds}`;
    console.log(url);
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

  createItemDistribution,
  getItemDistributionInfo,

  loadDistributionPlaces,
  createDistributionPlace,

  loadPlaceServices,
  createPlaceService,
  updatePlaceService,

  getOrders,
  getOrdersByIds,
  createOrder,
  updateOrder,
  removeOrder,
};
