import httpClient from './httpClient';

import {
  company,
  companyList,
  companyInfo,
  companyListItems,
} from './urls';

const getCompaniesWithItems = async () => {
  try {
    const response = await httpClient.get(companyListItems);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getShortCompanyList = async () => {
  try {
    const response = await httpClient.get(companyList);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getCompanyInfo = async (id) => {
  try {
    const response = await httpClient.get(companyInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const createCompany = async (data) => {
  try {
    const response = await httpClient.post(company, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateCompany = async (id, data) => {
  try {
    const response = await httpClient.put(companyInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeCompany = async (id) => {
  try {
    const response = await httpClient.delete(companyInfo(id));

    return response.data || false;
  } catch (err) {
    return false;
  }
};

export default {
  getCompaniesWithItems,
  getShortCompanyList,
  getCompanyInfo,
  createCompany,
  updateCompany,
  removeCompany,
};
