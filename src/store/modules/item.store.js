import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/items';

const initialState = () => ({
  items: [],
  extendedItems: [],
  totalCount: 0,
  loading: false,
});

const localState = initialState();

const getters = {
  itemList(state) {
    return state.items.slice(0);
  },
  isLoading(state) {
    return state.loading;
  },
};

const actions = {
  async fetchItems({ state, commit }) {
    if (state.items.length) {
      return;
    }

    commit('SET_LOADING', true);

    const response = await httpClient.get(URL);
    if (response) {
      commit('SET_ITEMS', response);
    }

    commit('SET_LOADING', false);
  },
  async updateItem({ dispatch }, id, data) {
    await httpClient.put(`${URL}/${id}`, data);
    dispatch('fetchItems');
  },
  async getItemById({ state, commit }, id) {
    const item = state.extendedItems.find(i => i.id === id);

    if (item) {
      return item;
    }

    const response = await httpClient.get(`${URL}/${id}`);

    commit('ADD_EXTENDED_ITEM', response);

    return response.data;
  },
};

const mutations = {
  SET_ITEMS(state, response) {
    state.items = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  ADD_EXTENDED_ITEM(state, response) {
    state.extendedItems.push(response.data);
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
