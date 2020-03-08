import { METHODS, request } from './axiosWrapper';

import {
  waybillInfo,
  waybill,
} from './urls';


const getWaybillList = async (itemId) => {
  try {
    let url = waybill;

    if (itemId) {
      url = `${url}?itemId=${itemId}`;
    }

    const response = await request(METHODS.GET, url);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getWaybillInfo = async (id) => {
  try {
    const response = await request(METHODS.GET, waybillInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const createWaybill = async (data) => {
  try {
    const response = await request(METHODS.POST, waybill, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateWaybill = async (id, data) => {
  try {
    const response = await request(METHODS.PUT, waybillInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeWaybill = async (id) => {
  try {
    await request(METHODS.DELETE, waybillInfo(id));

    return true;
  } catch (err) {
    return false;
  }
};

export default {
  getWaybillList,
  getWaybillInfo,
  createWaybill,
  updateWaybill,
  removeWaybill,
};
