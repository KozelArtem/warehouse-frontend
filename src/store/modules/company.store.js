import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/companies';

const initialState = () => ({
  companies: [],
  extendedCompanies: [],
  listLoaded: false,
  extendedListLoaded: false,
  totalCount: 0,
  loading: false,
  search: '',
});

const localState = initialState();

const getters = {
  companyList(state) {
    return state.companies.slice(0);
  },
  extendedList(state) {
    return state.extendedCompanies.slice(0);
  },
  extendedSearchList(state) {
    const search = state.search.trim().toLowerCase();

    if (search) {
      return state.extendedCompanies
        .slice(0)
        .filter(i => i.name.toLowerCase().includes(search));
    }

    return state.extendedCompanies.slice(0);
  },
  isLoading(state) {
    return state.loading;
  },
};

const actions = {
  async fetchCompanies({ commit, state }) {
    if (state.listLoaded) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(URL);

    if (response) {
      commit('SET_COMPANIES', response);
      commit('SET_LIST_LOADED', true);
    }

    commit('SET_LOADING', false);
  },
  async fetchExtendedCompanies({ state, commit }) {
    if (state.extendedListLoaded) {
      return;
    }

    commit('SET_LOADING', true);

    const params = {
      extended: true,
    };

    const response = await httpClient.get(URL, { params });

    if (response) {
      commit('SET_EXTENDED_COMPANIES', response);
      commit('SET_EXTENDED_LIST_LOADED', true);
    }

    commit('SET_LOADING', false);
  },
  async getCompanyById({ commit, state }, id) {
    if (id < 1) {
      return {};
    }

    const company = state.extendedCompanies.find(i => i.id === id);

    if (company) {
      return company;
    }

    const response = await httpClient.get(`${URL}/${id}`);
    commit('ADD_EXTENDED_COMPANY', response.data);

    return response.data;
  },
  async deleteCompany({ commit, dispatch }, id) {
    if (id < 1) {
      return true;
    }

    const response = await httpClient.delete(`${URL}/${id}`);

    commit('SET_EXTENDED_LIST_LOADED', false);
    commit('SET_LIST_LOADED', false);

    dispatch('fetchExtendedCompanies');
    dispatch('fetchCompanies');

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
  ADD_EXTENDED_COMPANY(state, payload) {
    state.extendedCompanies.push(payload);
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_LIST_LOADED(state, value) {
    state.listLoaded = value;
  },
  SET_EXTENDED_LIST_LOADED(state, value) {
    state.extendedListLoaded = value;
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
