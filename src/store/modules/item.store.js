import httpClient from '../../api/httpClient';
import { getTotalCountFromHeaders } from '../../api/helper';

const URL = '/items';

let timeout = null;

const initialState = () => ({
  items: [],
  extendedItems: [],
  totalCount: 0,
  loading: false,
  itemsCountByInput: 0,
});

const localState = initialState();

const getters = {
  itemList: state => state.items.slice(0),
  isLoading: state => state.loading,
  itemsCountByInput: state => state.itemsCountByInput,
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
  async countItemsByName({ commit }, search) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(async () => {
      const response = await httpClient.get(`${URL}/check`, { params: { search } });

      commit('SET_ITEMS_COUNT_BY_INPUT', response.data.count);
    }, 300);
  },
};

const mutations = {
  SET_ITEMS(state, response) {
    state.items = response.data;
    state.totalCount = getTotalCountFromHeaders(response);
  },
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_ITEMS_COUNT_BY_INPUT(state, value) {
    state.itemsCountByInput = value;
  },
};

export default {
  namespaced: true,
  state: localState,
  getters,
  actions,
  mutations,
};
