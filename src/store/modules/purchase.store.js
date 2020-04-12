import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';
import { sortDesc } from '../../helpers/dates';

const URL = '/purchases';

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

const state = initialState();

const getters = {
  totalPages(_state) {
    return Math.ceil(_state.totalCount / _state.query.limit);
  },
  purchaseList(_state) {
    return _state.purchases
      .slice(0)
      .sort(sortDesc)
      .filter(purchase => purchase.item)
      .map(value => ({
        ...value,
        active: !value.amount,
      }));
  },
  isLoading(_state) {
    return _state.loading;
  },
};

const actions = {
  async fetchPurchases({ commit }, params) {
    if (state.timeout) {
      clearTimeout(state.timeout);
    }

    this.timeout = setTimeout(async () => {
      commit('SET_LOADING', true);
      commit('UPDATE_QUERY', params);

      const response = await httpClient.get(URL, { params: state.query });

      if (response) {
        commit('SET_PURCHASES', response);
      }

      commit('SET_LOADING', false);
    }, 300);
  },
  async createPurchase({ dispatch }, data) {
    await httpClient.post(URL, data);

    dispatch('fetchPurchases');
  },
  async updatePurchase({ dispatch }, id, data) {
    await httpClient.put(`${URL}/${id}`, data);

    dispatch('fetchPurchases');
  },
};

const mutations = {
  SET_PURCHASES(_state, response) {
    _state.purchases = response.data;
    _state.totalCount = getTotalCountFromHeaders(response);
  },
  UPDATE_QUERY(_state, params) {
    _state.query = { ...params };
  },
  SET_LOADING(_state, value) {
    _state.loading = value;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
