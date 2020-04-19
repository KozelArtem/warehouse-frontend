import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/companies';

const initialState = () => ({
  companyInfo: {},
  companies: [],
  extendedCompanies: [],
  totalCount: 0,
  loading: false,
  search: '',
});

const localState = initialState();

const getters = {
  companyList: state => state.companies.slice(0),
  extendedList: state => state.extendedCompanies.slice(0),
  isLoading: state => state.loading,
  companyInfo: state => state.companyInfo,

  extendedSearchList(state) {
    const search = state.search.trim().toLowerCase();

    if (search) {
      return state.extendedCompanies
        .slice(0)
        .filter(i => i.name.toLowerCase().includes(search));
    }

    return state.extendedCompanies.slice(0);
  },
};

const actions = {
  async fetchCompanies({ state, commit }, needLoad = false) {
    if (state.companies.length && !needLoad) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(URL);

    commit('SET_COMPANIES', response);
    commit('SET_LOADING', false);
  },
  async fetchExtendedCompanies({ state, commit }, needLoad) {
    if (state.extendedCompanies.length && !needLoad) {
      return;
    }

    commit('SET_LOADING', true);

    const params = { extended: true };
    const response = await httpClient.get(URL, { params });

    if (response) {
      commit('SET_EXTENDED_COMPANIES', response);
    }

    commit('SET_LOADING', false);
  },
  async getCompanyById({ state, commit }, id) {
    if (id < 1) {
      return {};
    }

    const company = state.extendedCompanies.find(i => i.id === id);

    if (company) {
      commit('SET_COMPANY_INFO', company);

      return company;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(`${URL}/${id}`);

    commit('SET_COMPANY_INFO', response.data);
    commit('SET_LOADING', false);

    return response.data;
  },
  async createCompany({ commit, dispatch }, data) {
    commit('SET_LOADING', true);

    const response = await httpClient.post(URL, data);

    dispatch('fetchExtendedCompanies', true);
    dispatch('fetchCompanies', true);
    commit('SET_LOADING', false);

    return response.data;
  },
  async updateCompany({ commit, dispatch }, { id, ...data }) {
    commit('SET_LOADING', true);

    const response = await httpClient.put(`${URL}/${id}`, data);

    dispatch('fetchExtendedCompanies', true);
    dispatch('fetchCompanies', true);
    commit('SET_LOADING', false);

    return response.data;
  },
  async deleteCompany({ commit, dispatch }, id) {
    if (id < 1) {
      return true;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.delete(`${URL}/${id}`);

    dispatch('fetchExtendedCompanies', true);
    dispatch('fetchCompanies', true);
    commit('SET_LOADING', true);

    return response.data;
  },
};

const mutations = {
  SET_COMPANIES(state, response) {
    state.companies = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  SET_EXTENDED_COMPANIES(state, response) {
    state.extendedCompanies = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  SET_COMPANY_INFO(state, payload) {
    state.companyInfo = payload;
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  UPDATE_SEARCH(state, value) {
    state.search = value;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};
