import { METHODS, request } from './axiosWrapper';

import {
  company,
  companyList,
  companyInfo,
  companyListItems,
} from './urls';

const getCompaniesWithItems = async () => {
  try {
    const response = await request(METHODS.GET, companyListItems);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getShortCompanyList = async () => {
  try {
    const response = await request(METHODS.GET, companyList);

    return response.data || [];
  } catch (err) {
    return [];
  }
};

const getCompanyInfo = async (id) => {
  try {
    const response = await request(METHODS.GET, companyInfo(id));

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const createCompany = async (data) => {
  try {
    const response = await request(METHODS.POST, company, data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const updateCompany = async (id, data) => {
  try {
    const response = await request(METHODS.PUT, companyInfo(id), data);

    return response.data || {};
  } catch (err) {
    return {};
  }
};

const removeCompany = async (id) => {
  try {
    const response = await request(METHODS.DELETE, companyInfo(id));

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
