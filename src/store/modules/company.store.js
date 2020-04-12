import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/companies';

const initialState = () => ({
  companies: [],
  extendedCompanies: [],
  totalCount: 0,
  loading: false,
});

const localState = initialState();

const getters = {
  companyList(state) {
    return state.companies.slice(0);
  },
  isLoading(state) {
    return state.loading;
  },
};

const actions = {
  async fetchCompanies({ commit, state }) {
    if (state.companies.length) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(URL);

    if (response) {
      commit('SET_COMPANIES', response);
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
};

const mutations = {
  SET_COMPANIES(state, response) {
    state.companies = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  ADD_EXTENDED_COMPANY(state, payload) {
    state.extendedCompanies.push(payload);
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};
