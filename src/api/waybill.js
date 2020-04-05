import httpClient from './httpClient';

import { buildUrl } from './helper';

const WAYBILLS = '/waybills';
const WAYBILL_BY_ID = '/waybills/:waybillId';

const getWaybillList = async (query) => {
  try {
    const url = buildUrl(WAYBILLS, query);
    const response = await httpClient.get(url);
    const count = response.headers['x-total-count'];

    return { data: response.data || [], count };
  } catch (err) {
    return [];
  }
};

const getWaybillInfo = async (id) => {
  try {
    const url = WAYBILL_BY_ID.replace(':waybillId', id);
    const response = await httpClient.get(url);

    return { data: response.data || {} };
  } catch (err) {
    return {};
  }
};

const createWaybill = async (data) => {
  try {
    const url = WAYBILLS;
    const response = await httpClient.post(url, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateWaybill = async (id, data) => {
  try {
    const url = WAYBILL_BY_ID.replace(':waybillId', id);
    const response = await httpClient.put(url, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeWaybill = async (id) => {
  try {
    const url = WAYBILL_BY_ID.replace(':waybillId', id);

    await httpClient.delete(url);

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
