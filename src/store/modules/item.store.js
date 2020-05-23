import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/items';

let timeout = null;

const initialState = () => ({
  item: {},
  items: [],
  extendedItems: [],
  totalCount: 0,
  loading: false,
  searchLoading: false,
  itemsCountByInput: 0,
  foundItems: [],
});

const localState = initialState();

const getters = {
  itemInfo: state => state.item,
  itemList: state => state.items.slice(0),
  isLoading: state => state.loading,
  searchLoading: state => state.searchLoading,
  itemsCountByInput: state => state.itemsCountByInput,
  foundItems: state => state.foundItems,
};

const actions = {
  async fetchItems({ state, commit }, needLoad = false) {
    if (state.items.length && !needLoad) {
      return;
    }

    commit('SET_LOADING', true);
    const response = await httpClient.get(URL);

    if (response) {
      commit('SET_ITEMS', response);
    }

    commit('SET_LOADING', false);
  },
  async loadItem({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ITEM', {});

    const response = await httpClient.get(`${URL}/${id}`);

    commit('SET_ITEM', response.data);
    commit('SET_LOADING', false);
  },
  async createItem({ commit, dispatch }, data) {
    commit('SET_LOADING', true);
    const response = await httpClient.post(URL, data);

    dispatch('fetchItems', true);
    commit('SET_LOADING', false);

    return response.data;
  },
  async updateItem({ commit, dispatch }, { id, ...data }) {
    commit('SET_LOADING', true);
    const response = await httpClient.put(`${URL}/${id}`, data);

    dispatch('fetchItems', true);
    commit('SET_LOADING', false);

    return response.data;
  },
  async removeItem({ commit }, id) {
    commit('SET_LOADING', true);

    const response = await httpClient.delete(`${URL}/${id}`);

    commit('SET_LOADING', false);

    return response.data;
  },
  async countItemsByName({ commit }, search) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      const response = await httpClient.get(`${URL}/check`, { params: { search } });

      commit('SET_ITEMS_COUNT_BY_INPUT', response.data.count);
    }, 300);
  },
  async searchItems({ commit }, search) {
    if (timeout) {
      clearTimeout(timeout);
    }

    commit('SET_SEARCH_LOADING', true);
    timeout = setTimeout(async () => {
      const response = await httpClient.get(`${URL}/search`, { params: { search } });

      commit('SET_SEARCH_LOADING', false);
      commit('SET_FOUND_ITEMS', response.data);
    }, 300);
  },
};

const mutations = {
  SET_ITEMS(state, response) {
    state.items = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  SET_ITEM(state, payload) {
    state.item = payload;
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_SEARCH_LOADING(state, value) {
    state.searchLoading = value;
  },
  SET_ITEMS_COUNT_BY_INPUT(state, value) {
    state.itemsCountByInput = value;
  },
  SET_FOUND_ITEMS(state, value) {
    state.foundItems = value;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};
