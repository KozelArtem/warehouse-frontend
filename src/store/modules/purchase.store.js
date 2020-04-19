import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';
import { sortDesc } from '../../helpers/dates';

const URL = '/purchases';

let timeout = null;

const initialState = () => ({
  purchases: [],
  totalCount: 0,
  loading: false,
  query: {
    limit: 10,
    offset: 0,
    active: true,
    search: null,
  },
});

const localState = initialState();

const getters = {
  totalPages: state => Math.ceil(state.totalCount / state.query.limit),
  isLoading: state => state.loading,

  purchaseList(state) {
    return state.purchases
      .slice(0)
      .sort(sortDesc)
      .filter(purchase => purchase.item)
      .map(value => ({
        ...value,
        active: !value.amount,
      }));
  },
};

const actions = {
  async fetchPurchases({ state, commit }, params) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      commit('SET_LOADING', true);
      commit('UPDATE_QUERY', params);

      const response = await httpClient.get(URL, { params: state.query });

      if (response) {
        commit('SET_PURCHASES', response);
      }

      commit('SET_LOADING', false);
    }, 300);
  },
  async createPurchase({ commit, dispatch }, data) {
    commit('SET_LOADING', true);

    const response = await httpClient.post(URL, data);

    dispatch('fetchPurchases');
    commit('SET_LOADING', false);

    return response.data;
  },
  async updatePurchase({ commit, dispatch }, { id, ...data }) {
    commit('SET_LOADING', true);

    const response = await httpClient.put(`${URL}/${id}`, data);

    dispatch('fetchPurchases');
    commit('SET_LOADING', false);

    return response.data;
  },
  async removePurchase({ commit, dispatch }, id) {
    if (id < 1) {
      return;
    }

    commit('SET_LOADING', true);

    await httpClient.delete(`${URL}/${id}`);

    dispatch('fetchPurchases');
    commit('SET_LOADING', false);
  },
};

const mutations = {
  SET_PURCHASES(state, response) {
    state.purchases = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  UPDATE_QUERY(state, params) {
    state.query = { ...state.query, ...params };
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
